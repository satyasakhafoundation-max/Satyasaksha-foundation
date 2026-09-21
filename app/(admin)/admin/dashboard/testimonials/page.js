'use client';
import { useState, useEffect } from 'react';
import {
  PageHeader, Card, Button, Field, Input, Textarea, Toggle,
  ConfirmButton, ImageUploader, Modal, ReorderableList, useToast, SkeletonList, EmptyState,
} from '@/components/admin/ui';
import styles from './page.module.css';

const emptyForm = { name: '', title: '', quote: '', avatarUrl: '' };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const showToast = useToast();

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/testimonials');
    const data = await res.json();
    setItems(Array.isArray(data) ? data.sort((a, b) => a.order - b.order) : []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ name: item.name, title: item.title, quote: item.quote, avatarUrl: item.avatarUrl || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving('form');
    try {
      const method = editing ? 'PUT' : 'POST';
      const payload = editing ? { _id: editing._id, ...form } : { ...form, order: items.length + 1, isVisible: true };
      const res = await fetch('/api/admin/testimonials', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(editing ? 'Testimonial updated!' : 'Testimonial added!');
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      showToast(err.message || 'Failed to save.', 'error');
    }
    setSaving(null);
  };

  const handleToggle = async (item) => {
    setSaving(item._id);
    try {
      await fetch('/api/admin/testimonials', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: item._id, isVisible: !item.isVisible }) });
      fetchItems();
    } catch {
      showToast('Failed to update.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Delete failed');
      showToast('Deleted.');
      fetchItems();
    } catch (err) {
      showToast(err.message || 'Failed to delete.', 'error');
    }
    setSaving(null);
  };

  const handleReorder = async (reordered) => {
    setItems(reordered);
    await Promise.all(reordered.map((item, i) =>
      fetch('/api/admin/testimonials', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: item._id, order: i + 1 }) })
    ));
    showToast('Order saved.');
  };

  return (
    <div>
      <PageHeader
        icon="💬"
        title="Testimonials"
        subtitle="Manage the quotes shown in the Voices of Impact section on the homepage."
        action={<Button onClick={openNew}>+ Add Testimonial</Button>}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Testimonial' : 'New Testimonial'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldRow}>
            <Field label="Name" required>
              <Input required placeholder="e.g. Dr. Priya Sharma" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </Field>
            <Field label="Title / Role" required>
              <Input required placeholder="e.g. Wildlife Researcher, WWF India" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </Field>
          </div>
          <Field label="Quote" required hint={`${form.quote.length}/500 characters`}>
            <Textarea required rows={4} maxLength={500} placeholder="Their testimonial quote..." value={form.quote} onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))} />
          </Field>
          <ImageUploader
            folder="about"
            shape="circle"
            label="Upload Avatar (optional — falls back to initials)"
            value={form.avatarUrl}
            onChange={(url) => setForm((p) => ({ ...p, avatarUrl: url }))}
          />
          <div className={styles.modalActions}>
            <Button type="submit" loading={saving === 'form'}>{editing ? 'Save Changes' : 'Add Testimonial'}</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {loading ? <SkeletonList count={3} /> : items.length === 0 ? (
        <EmptyState icon="💬" title="No testimonials yet" description="The homepage shows built-in fallback quotes until you add real ones." />
      ) : (
        <ReorderableList items={items} onReorder={handleReorder} keyField="_id" renderItem={(item) => (
          <Card dimmed={!item.isVisible} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.avatar}>
                {item.avatarUrl
                  ? <img src={item.avatarUrl} alt={item.name} className={styles.avatarImg} />
                  : <span className={styles.initials}>{item.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}</span>}
              </div>
              <div>
                <p className={styles.personName}>{item.name}</p>
                <p className={styles.personTitle}>{item.title}</p>
              </div>
            </div>
            <p className={styles.quoteText}>&quot;{item.quote}&quot;</p>
            <div className={styles.cardActions}>
              <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>✏ Edit</Button>
              <Toggle active={item.isVisible} onClick={() => handleToggle(item)} disabled={saving === item._id} />
              <ConfirmButton onConfirm={() => handleDelete(item._id)} loading={saving === item._id} />
            </div>
          </Card>
        )} />
      )}
    </div>
  );
}
