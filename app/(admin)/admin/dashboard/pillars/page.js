'use client';
import { useState, useEffect } from 'react';
import {
  PageHeader, Card, Button, Field, Input, Textarea, Toggle,
  ConfirmButton, ImageUploader, Modal, ReorderableList, useToast, SkeletonList, EmptyState,
} from '@/components/admin/ui';
import styles from './page.module.css';

const emptyForm = { title: '', description: '', image: '', bullets: '', ctaLabel: 'Discover More', ctaLink: '/news' };

export default function AdminPillarsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const showToast = useToast();

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/pillars-all');
    const data = await res.json();
    setItems(Array.isArray(data) ? data.sort((a, b) => a.order - b.order) : []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title, description: item.description, image: item.image,
      bullets: (item.bullets || []).join('\n'), ctaLabel: item.ctaLabel, ctaLink: item.ctaLink,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) { showToast('Please upload an image first.', 'error'); return; }
    setSaving('form');
    try {
      const payload = {
        ...form,
        bullets: form.bullets.split('\n').map((b) => b.trim()).filter(Boolean),
      };
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { _id: editing._id, ...payload } : { ...payload, order: items.length + 1 };
      const res = await fetch('/api/admin/pillars', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(editing ? 'Updated!' : 'Added!');
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
      await fetch('/api/admin/pillars', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: item._id, isVisible: !item.isVisible }) });
      fetchItems();
    } catch {
      showToast('Failed to update.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/pillars?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('Deleted.');
      fetchItems();
    } catch {
      showToast('Failed to delete.', 'error');
    }
    setSaving(null);
  };

  const handleReorder = async (reordered) => {
    setItems(reordered);
    await Promise.all(reordered.map((item, i) =>
      fetch('/api/admin/pillars', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: item._id, order: i + 1 }) })
    ));
    showToast('Order saved.');
  };

  return (
    <div>
      <PageHeader
        icon="🏛️"
        title="Core Program Highlights"
        subtitle="The large image + text rows on the homepage showcasing your core programs. Add, remove, or reorder freely."
        action={<Button onClick={openNew}>+ Add Highlight</Button>}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Highlight' : 'New Highlight'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Title" required>
            <Input required placeholder="e.g. Wildlife Conservation" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </Field>
          <Field label="Description" required>
            <Textarea required value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </Field>
          <ImageUploader folder="pillars" label="Upload Image" value={form.image} onChange={(url) => setForm((p) => ({ ...p, image: url }))} />
          <Field label="Bullet Points" hint="One per line">
            <Textarea rows={3} value={form.bullets} onChange={(e) => setForm((p) => ({ ...p, bullets: e.target.value }))} placeholder={'Habitat Restoration & Anti-Poaching\nRescue & Rehabilitation\nCommunity Awareness Programs'} />
          </Field>
          <div className={styles.fieldRow}>
            <Field label="Button Label">
              <Input value={form.ctaLabel} onChange={(e) => setForm((p) => ({ ...p, ctaLabel: e.target.value }))} />
            </Field>
            <Field label="Button Link">
              <Input value={form.ctaLink} onChange={(e) => setForm((p) => ({ ...p, ctaLink: e.target.value }))} />
            </Field>
          </div>
          <div className={styles.modalActions}>
            <Button type="submit" loading={saving === 'form'}>{editing ? 'Save Changes' : 'Add Highlight'}</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {loading ? <SkeletonList count={2} /> : items.length === 0 ? (
        <EmptyState icon="🏛️" title="No highlights yet" description="Click + Add Highlight to create your first one." />
      ) : (
        <ReorderableList items={items} onReorder={handleReorder} keyField="_id" renderItem={(item) => (
          <Card dimmed={!item.isVisible} className={styles.row}>
            <div className={styles.rowThumb}><img src={item.image} alt="" /></div>
            <div className={styles.rowBody}>
              <h3 className={styles.rowTitle}>{item.title}</h3>
              <p className={styles.rowDesc}>{item.description}</p>
            </div>
            <div className={styles.rowActions}>
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
