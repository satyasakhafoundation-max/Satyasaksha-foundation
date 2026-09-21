'use client';
import { useState, useEffect } from 'react';

const CATEGORIES = ['Key Chains', 'Brooches', 'Book Marks', 'Wind Chimes', 'Tote Bags', 'Other'];
const emptyForm = { name: '', category: 'Key Chains', description: '', price: '', images: [], isAvailable: true };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/products-all');
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3500);
  };

  const handleOpenNew = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setForm({ name: product.name, category: product.category, description: product.description || '', price: product.price, images: product.images || [], isAvailable: product.isAvailable });
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'products');
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
        uploaded.push((await res.json()).imageUrl);
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
      showMessage(`${uploaded.length} image(s) uploaded.`);
    } catch (err) {
      showMessage(err.message || 'Image upload failed.', 'error');
    }
    setUploading(false);
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) {
      showMessage('Please upload at least one product image.', 'error');
      return;
    }
    setSaving('form');
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const body = editingProduct
        ? { _id: editingProduct._id, ...form, price: Number(form.price) }
        : { ...form, price: Number(form.price) };
      const res = await fetch('/api/admin/products', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error);
      showMessage(editingProduct ? 'Product updated!' : 'Product created!');
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      showMessage(err.message || 'Failed to save.', 'error');
    }
    setSaving(null);
  };

  const handleToggleVisible = async (product) => {
    setSaving(product._id);
    try {
      await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: product._id, isVisible: !product.isVisible }) });
      fetchProducts();
    } catch {
      showMessage('Failed to update.', 'error');
    }
    setSaving(null);
  };

  const handleToggleAvailable = async (product) => {
    setSaving(product._id);
    try {
      await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: product._id, isAvailable: !product.isAvailable }) });
      fetchProducts();
    } catch {
      showMessage('Failed to update.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    setSaving('del-' + id);
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Delete failed');
      showMessage('Product deleted.');
      setConfirmDelete(null);
      fetchProducts();
    } catch (err) {
      showMessage(err.message || 'Failed to delete.', 'error');
    }
    setSaving(null);
  };

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>🛍️ Products</h1>
          <p style={s.sub}>Manage merchandise — key chains, brooches, book marks, wind chimes, tote bags, and more.</p>
        </div>
        <button style={s.addBtn} onClick={handleOpenNew}>+ New Product</button>
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.type === 'error' ? s.msgError : s.msgSuccess) }}>{msg.text}</div>}

      {showForm && (
        <div style={s.formWrap}>
          <div style={s.formHeader}>
            <h3 style={s.formTitle}>{editingProduct ? 'Edit Product' : 'New Product'}</h3>
            <button onClick={() => setShowForm(false)} style={s.closeBtn}>✕</button>
          </div>
          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.fieldRow}>
              <div style={s.field}>
                <label style={s.label}>Name *</label>
                <input name="name" required value={form.name} onChange={handleFormChange} style={s.input} placeholder="e.g. Elephant Keychain" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Category *</label>
                <select name="category" value={form.category} onChange={handleFormChange} style={s.select}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={s.fieldRow}>
              <div style={s.field}>
                <label style={s.label}>Price (₹) *</label>
                <input name="price" type="number" min="0" step="1" required value={form.price} onChange={handleFormChange} style={s.input} placeholder="e.g. 199" />
              </div>
              <div style={s.field}>
                <label style={{ ...s.label, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '10px' }}>
                  <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleFormChange} style={{ width: '16px', height: '16px', accentColor: '#D4AF37' }} />
                  <span style={{ textTransform: 'none', fontSize: '0.9rem', color: '#fff' }}>In stock</span>
                </label>
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Description</label>
              <textarea name="description" rows={3} value={form.description} onChange={handleFormChange} style={{ ...s.input, resize: 'vertical' }} placeholder="Short product description" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Product Images *</label>
              <label style={s.uploadBtn}>
                {uploading ? 'Uploading…' : '⬆ Upload Images'}
                <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" multiple style={{ display: 'none' }} onChange={e => handleImageUpload(e.target.files)} />
              </label>
              {form.images.length > 0 && (
                <div style={s.galleryPreviewGrid}>
                  {form.images.map((img, i) => (
                    <div key={i} style={s.galleryPreviewItem}>
                      <img src={img} alt="" style={s.galleryPreviewImg} />
                      <button type="button" onClick={() => handleRemoveImage(i)} style={s.galleryPreviewRemove}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" disabled={saving === 'form'} style={{ ...s.saveBtn, opacity: saving === 'form' ? 0.7 : 1 }}>{saving === 'form' ? 'Saving…' : editingProduct ? 'Save Changes' : 'Create Product'}</button>
              <button type="button" onClick={() => setShowForm(false)} style={s.cancelBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p style={s.loadText}>Loading products…</p> : (
        products.length === 0 ? (
          <div style={s.emptyState}>
            <p style={{ fontSize: '2rem', marginBottom: '12px' }}>🛍️</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>No products yet. Click <strong style={{ color: '#D4AF37' }}>+ New Product</strong> to add your first item.</p>
          </div>
        ) : (
          <div style={s.list}>
            {products.map((product) => (
              <div key={product._id} style={{ ...s.productCard, opacity: product.isVisible ? 1 : 0.5 }}>
                <div style={s.productLeft}>
                  {product.images?.[0] && (
                    <div style={{ ...s.productThumb, backgroundImage: `url(${product.images[0]})` }} />
                  )}
                  <div style={s.productInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={s.catPill}>{product.category}</span>
                      <span style={{ ...s.statusPill, ...(product.isAvailable ? s.available : s.unavailable) }}>
                        {product.isAvailable ? '● In Stock' : '○ Out of Stock'}
                      </span>
                    </div>
                    <h3 style={s.productName}>{product.name}</h3>
                    <p style={s.productPrice}>₹{product.price}</p>
                  </div>
                </div>
                <div style={s.productActions}>
                  <button onClick={() => handleOpenEdit(product)} style={s.editBtn}>✏ Edit</button>
                  <button onClick={() => handleToggleAvailable(product)} disabled={saving === product._id} style={{ ...s.toggleBtn, ...(product.isAvailable ? s.toggleUnpublish : s.togglePublish) }}>
                    {product.isAvailable ? 'Mark Out of Stock' : 'Mark In Stock'}
                  </button>
                  <button onClick={() => handleToggleVisible(product)} disabled={saving === product._id} style={{ ...s.toggleBtn, ...(product.isVisible ? s.togglePublish : s.toggleUnpublish) }}>
                    {product.isVisible ? '👁 Visible' : '🚫 Hidden'}
                  </button>
                  {confirmDelete === product._id ? (
                    <div style={s.inlineConfirm}>
                      <span style={s.confirmText}>Sure?</span>
                      <button onClick={() => handleDelete(product._id)} disabled={saving === 'del-' + product._id} style={s.confirmYes}>{saving === 'del-' + product._id ? '…' : 'Yes'}</button>
                      <button onClick={() => setConfirmDelete(null)} style={s.confirmNo}>No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(product._id)} style={s.deleteBtn}>🗑</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', gap: '16px', flexWrap: 'wrap' },
  title: { color: '#fff', fontSize: '2rem', fontWeight: '700', margin: '0 0 8px', letterSpacing: '-0.5px' },
  sub: { color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '1rem' },
  addBtn: { background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0a110a', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 8px 20px rgba(212,175,55,0.2)', whiteSpace: 'nowrap' },
  msg: { borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '500' },
  msgSuccess: { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' },
  msgError: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' },
  formWrap: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '16px', padding: '32px', marginBottom: '32px', backdropFilter: 'blur(10px)' },
  formHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  formTitle: { color: '#D4AF37', fontWeight: '700', fontSize: '1.3rem', margin: 0 },
  closeBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', padding: '6px 12px', cursor: 'pointer', fontSize: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  fieldRow: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' },
  input: { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px 16px', color: '#fff', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  select: { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px 16px', color: '#fff', fontSize: '0.95rem', outline: 'none', width: '100%', cursor: 'pointer' },
  uploadBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 18px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '10px', color: '#D4AF37', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', width: 'fit-content' },
  galleryPreviewGrid: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' },
  galleryPreviewItem: { position: 'relative', width: '72px', height: '72px' },
  galleryPreviewImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' },
  galleryPreviewRemove: { position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  saveBtn: { background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0a110a', border: 'none', borderRadius: '10px', padding: '14px 28px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' },
  cancelBtn: { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px 20px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600' },
  emptyState: { textAlign: 'center', padding: '80px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' },
  loadText: { color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontSize: '1.1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  productCard: { display: 'flex', alignItems: 'center', gap: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '20px 24px', flexWrap: 'wrap', transition: 'all 0.2s' },
  productLeft: { display: 'flex', gap: '20px', flex: 1, minWidth: '280px', alignItems: 'flex-start' },
  productThumb: { width: '80px', height: '80px', borderRadius: '10px', backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 },
  productInfo: { flex: 1 },
  catPill: { fontSize: '0.75rem', fontWeight: '700', color: '#D4AF37', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', padding: '3px 10px', borderRadius: '99px', letterSpacing: '0.5px' },
  statusPill: { fontSize: '0.75rem', fontWeight: '600', padding: '3px 10px', borderRadius: '99px' },
  available: { color: '#34d399', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' },
  unavailable: { color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' },
  productName: { color: '#fff', fontSize: '1.05rem', fontWeight: '600', margin: '0 0 6px' },
  productPrice: { color: '#D4AF37', fontSize: '0.95rem', fontWeight: '700', margin: 0 },
  productActions: { display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' },
  editBtn: { padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' },
  toggleBtn: { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700', transition: 'all 0.2s' },
  togglePublish: { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' },
  toggleUnpublish: { background: 'rgba(255,180,0,0.1)', color: '#fbbf24', border: '1px solid rgba(255,180,0,0.2)' },
  deleteBtn: { padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem' },
  inlineConfirm: { display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '4px 8px' },
  confirmText: { color: '#f87171', fontSize: '0.8rem', fontWeight: '600' },
  confirmYes: { background: '#ef4444', border: 'none', borderRadius: '6px', color: '#fff', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' },
  confirmNo: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'rgba(255,255,255,0.6)', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' },
};
