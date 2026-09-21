'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  PageHeader, Card, Button, Field, Input, Textarea, Select, Toggle, Badge,
  ConfirmButton, ImageUploader, Modal, useToast, SkeletonList, EmptyState, SearchInput, Pagination,
} from '@/components/admin/ui';
import styles from './page.module.css';

const CATEGORIES = ['Key Chains', 'Brooches', 'Book Marks', 'Wind Chimes', 'Tote Bags', 'Other'];
const emptyForm = { name: '', category: 'Key Chains', description: '', price: '', images: [], isAvailable: true };
const PAGE_SIZE = 8;

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const showToast = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/products-all');
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [products, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (product) => {
    setEditing(product);
    setForm({ name: product.name, category: product.category, description: product.description || '', price: product.price, images: product.images || [], isAvailable: product.isAvailable });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) { showToast('Please upload at least one product image.', 'error'); return; }
    setSaving('form');
    try {
      const method = editing ? 'PUT' : 'POST';
      const payload = editing
        ? { _id: editing._id, ...form, price: Number(form.price) }
        : { ...form, price: Number(form.price) };
      const res = await fetch('/api/admin/products', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(editing ? 'Product updated!' : 'Product created!');
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Failed to save.', 'error');
    }
    setSaving(null);
  };

  const patchProduct = async (product, patch) => {
    setSaving(product._id);
    try {
      await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: product._id, ...patch }) });
      fetchProducts();
    } catch {
      showToast('Failed to update.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Product deleted.');
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Failed to delete.', 'error');
    }
    setSaving(null);
  };

  return (
    <div>
      <PageHeader
        icon="🛍️"
        title="Products"
        subtitle="Manage merchandise — key chains, brooches, book marks, wind chimes, tote bags, and more."
        action={<Button onClick={openNew}>+ New Product</Button>}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'New Product'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Name" required>
            <Input required placeholder="e.g. Elephant Keychain" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </Field>
          <div className={styles.fieldRow}>
            <Field label="Category" required>
              <Select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Price (₹)" required>
              <Input type="number" min="0" step="1" required value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
            </Field>
          </div>
          <Field label="In stock?">
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm((p) => ({ ...p, isAvailable: e.target.checked }))} />
              Available for purchase
            </label>
          </Field>
          <Field label="Description">
            <Textarea placeholder="Short product description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </Field>
          <Field label="Product Images" required>
            <ImageUploader folder="products" multiple values={form.images} onChange={(images) => setForm((p) => ({ ...p, images }))} label="Upload Images" />
          </Field>
          <div className={styles.modalActions}>
            <Button type="submit" loading={saving === 'form'}>{editing ? 'Save Changes' : 'Create Product'}</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <div className={styles.toolbar}>
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search products…" />
      </div>

      {loading ? <SkeletonList count={4} /> : filtered.length === 0 ? (
        <EmptyState icon="🛍️" title="No products found" description={query ? 'Try a different search.' : 'Click + New Product to add your first item.'} />
      ) : (
        <>
          <div className={styles.list}>
            {pageItems.map((product) => (
              <Card key={product._id} dimmed={!product.isVisible} className={styles.row}>
                <div className={styles.rowThumb}>
                  {product.images?.[0] && <img src={product.images[0]} alt="" />}
                </div>
                <div className={styles.rowBody}>
                  <div className={styles.rowMeta}>
                    <Badge variant="gold">{product.category}</Badge>
                    <Badge variant={product.isAvailable ? 'success' : 'neutral'}>{product.isAvailable ? 'In Stock' : 'Out of Stock'}</Badge>
                  </div>
                  <h3 className={styles.rowTitle}>{product.name}</h3>
                  <p className={styles.price}>₹{product.price}</p>
                </div>
                <div className={styles.rowActions}>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(product)}>✏ Edit</Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={saving === product._id}
                    onClick={() => patchProduct(product, { isAvailable: !product.isAvailable })}
                  >
                    {product.isAvailable ? 'Mark Out of Stock' : 'Mark In Stock'}
                  </Button>
                  <Toggle active={product.isVisible} onClick={() => patchProduct(product, { isVisible: !product.isVisible })} disabled={saving === product._id} />
                  <ConfirmButton onConfirm={() => handleDelete(product._id)} loading={saving === product._id} />
                </div>
              </Card>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
