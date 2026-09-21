'use client';
import { useState, useEffect } from 'react';
import {
  PageHeader, Card, Button, Field, Input, Textarea, Toggle, Badge,
  ConfirmButton, ImageUploader, Modal, ReorderableList, useToast, SkeletonList, EmptyState,
} from '@/components/admin/ui';
import styles from './page.module.css';

const isImageIcon = (icon) => typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('data:image'));
const emptyForm = { title: '', icon: '', description: '', color: '#1B4332', cardStyle: 'solid' };

export default function AdminFocusAreasPage() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const showToast = useToast();

  const fetchAreas = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/focus-areas-all');
    const data = await res.json();
    setAreas(Array.isArray(data) ? data.sort((a, b) => a.order - b.order) : []);
    setLoading(false);
  };

  useEffect(() => { fetchAreas(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (area) => {
    setEditing(area);
    setForm({ title: area.title, icon: area.icon, description: area.description, color: area.color, cardStyle: area.cardStyle || 'solid' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving('form');
    try {
      const method = editing ? 'PUT' : 'POST';
      const payload = editing
        ? { _id: editing._id, ...form }
        : { ...form, link: '/news', order: areas.length + 1 };
      const res = await fetch('/api/admin/focus-areas', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(editing ? 'Focus area updated!' : 'Focus area added!');
      setModalOpen(false);
      fetchAreas();
    } catch (err) {
      showToast(err.message || 'Failed to save.', 'error');
    }
    setSaving(null);
  };

  const handleToggle = async (area) => {
    setSaving(area._id);
    try {
      const res = await fetch('/api/admin/focus-areas', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: area._id, isVisible: !area.isVisible }) });
      if (!res.ok) throw new Error();
      fetchAreas();
    } catch {
      showToast('Failed to update visibility.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/focus-areas?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('Deleted.');
      fetchAreas();
    } catch {
      showToast('Failed to delete.', 'error');
    }
    setSaving(null);
  };

  const handleReorder = async (reordered) => {
    setAreas(reordered);
    await Promise.all(reordered.map((area, i) =>
      fetch('/api/admin/focus-areas', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: area._id, order: i + 1 }) })
    ));
    showToast('Order saved.');
  };

  return (
    <div>
      <PageHeader
        icon="🌿"
        title="Focus Areas"
        subtitle="Manage the domains shown across the website. Drag to reorder, toggle visibility to hide/show without deleting."
        action={<Button onClick={openNew}>+ Add Area</Button>}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Focus Area' : 'New Focus Area'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Title" required>
            <Input required placeholder="e.g. Healthcare" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </Field>
          <Field label="Icon" hint="An emoji, or upload an image below">
            <Input placeholder="🌿" value={isImageIcon(form.icon) ? '' : form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} />
          </Field>
          <ImageUploader
            folder="focus-areas"
            shape="circle"
            label="Upload Icon Image"
            value={isImageIcon(form.icon) ? form.icon : ''}
            onChange={(url) => setForm((p) => ({ ...p, icon: url }))}
          />
          <Field label="Description" required>
            <Textarea required placeholder="Short description shown on the card" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </Field>
          <Field label="Card Color">
            <div className={styles.colorRow}>
              <input type="color" value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} className={styles.colorSwatch} />
              <span className={styles.colorValue}>{form.color}</span>
            </div>
          </Field>
          <Field label="Card Style">
            <div className={styles.styleRow}>
              <label className={styles.radioLabel}>
                <input type="radio" checked={form.cardStyle === 'solid'} onChange={() => setForm((p) => ({ ...p, cardStyle: 'solid' }))} /> Solid
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" checked={form.cardStyle === 'translucent'} onChange={() => setForm((p) => ({ ...p, cardStyle: 'translucent' }))} /> Translucent
              </label>
            </div>
          </Field>
          <div className={styles.modalActions}>
            <Button type="submit" loading={saving === 'form'}>{editing ? 'Save Changes' : 'Add Focus Area'}</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {loading ? <SkeletonList count={4} /> : areas.length === 0 ? (
        <EmptyState icon="🌿" title="No focus areas yet" description="Click + Add Area to create your first one." />
      ) : (
        <ReorderableList items={areas} onReorder={handleReorder} keyField="_id" renderItem={(area) => (
          <Card dimmed={!area.isVisible} className={styles.row}>
            <div className={styles.rowIcon}>
              {isImageIcon(area.icon) ? <img src={area.icon} alt="" className={styles.iconImg} /> : area.icon}
            </div>
            <div className={styles.rowBody}>
              <div className={styles.rowTitleLine}>
                <h3 className={styles.rowTitle}>{area.title}</h3>
                {area.cardStyle === 'translucent' && <Badge variant="gold">Translucent</Badge>}
                <span className={styles.dot} style={{ background: area.color }} />
              </div>
              <p className={styles.rowDesc}>{area.description}</p>
            </div>
            <div className={styles.rowActions}>
              <Button variant="ghost" size="sm" onClick={() => openEdit(area)}>✏ Edit</Button>
              <Toggle active={area.isVisible} onClick={() => handleToggle(area)} disabled={saving === area._id} />
              <ConfirmButton onConfirm={() => handleDelete(area._id)} loading={saving === area._id} />
            </div>
          </Card>
        )} />
      )}
    </div>
  );
}
