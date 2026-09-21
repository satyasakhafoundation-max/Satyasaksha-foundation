'use client';
import { useState, useEffect } from 'react';
import {
  PageHeader, Card, Button, Field, Input, Textarea, Toggle,
  ConfirmButton, ImageUploader, Modal, ReorderableList, useToast, SkeletonList, EmptyState,
} from '@/components/admin/ui';
import styles from './page.module.css';

const isImageIcon = (icon) => typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('data:image'));
const emptyForm = { title: '', icon: '', description: '' };

export default function AdminCoreValuesPage() {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const showToast = useToast();

  const fetchValues = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/core-values-all');
    const data = await res.json();
    setValues(Array.isArray(data) ? data.sort((a, b) => a.order - b.order) : []);
    setLoading(false);
  };

  useEffect(() => { fetchValues(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (value) => {
    setEditing(value);
    setForm({ title: value.title, icon: value.icon, description: value.description });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving('form');
    try {
      const method = editing ? 'PUT' : 'POST';
      const payload = editing ? { _id: editing._id, ...form } : { ...form, order: values.length + 1 };
      const res = await fetch('/api/admin/core-values', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(editing ? 'Updated!' : 'Added!');
      setModalOpen(false);
      fetchValues();
    } catch (err) {
      showToast(err.message || 'Failed to save.', 'error');
    }
    setSaving(null);
  };

  const handleToggle = async (value) => {
    setSaving(value._id);
    try {
      await fetch('/api/admin/core-values', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: value._id, isVisible: !value.isVisible }) });
      fetchValues();
    } catch {
      showToast('Failed to update.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/core-values?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('Deleted.');
      fetchValues();
    } catch {
      showToast('Failed to delete.', 'error');
    }
    setSaving(null);
  };

  const handleReorder = async (reordered) => {
    setValues(reordered);
    await Promise.all(reordered.map((v, i) =>
      fetch('/api/admin/core-values', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: v._id, order: i + 1 }) })
    ));
    showToast('Order saved.');
  };

  return (
    <div>
      <PageHeader
        icon="🐘"
        title="About — Core Values"
        subtitle='Manage the "Our Core Values" cards on the About Us page. Icons can be an emoji or an uploaded image.'
        action={<Button onClick={openNew}>+ Add Value</Button>}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Core Value' : 'New Core Value'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Title" required>
            <Input required placeholder="e.g. Wisdom & Patience" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </Field>
          <Field label="Icon" hint="An emoji, or upload an image below">
            <Input placeholder="🐘" value={isImageIcon(form.icon) ? '' : form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} />
          </Field>
          <ImageUploader
            folder="about"
            shape="circle"
            label="Upload Icon Image"
            value={isImageIcon(form.icon) ? form.icon : ''}
            onChange={(url) => setForm((p) => ({ ...p, icon: url }))}
          />
          <Field label="Description" required>
            <Textarea required value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </Field>
          <div className={styles.modalActions}>
            <Button type="submit" loading={saving === 'form'}>{editing ? 'Save Changes' : 'Add Core Value'}</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {loading ? <SkeletonList count={3} /> : values.length === 0 ? (
        <EmptyState icon="🐘" title="No core values yet" description="Click + Add Value to create your first one." />
      ) : (
        <ReorderableList items={values} onReorder={handleReorder} keyField="_id" renderItem={(value) => (
          <Card dimmed={!value.isVisible} className={styles.row}>
            <div className={styles.rowIcon}>
              {isImageIcon(value.icon) ? <img src={value.icon} alt="" className={styles.iconImg} /> : value.icon}
            </div>
            <div className={styles.rowBody}>
              <h3 className={styles.rowTitle}>{value.title}</h3>
              <p className={styles.rowDesc}>{value.description}</p>
            </div>
            <div className={styles.rowActions}>
              <Button variant="ghost" size="sm" onClick={() => openEdit(value)}>✏ Edit</Button>
              <Toggle active={value.isVisible} onClick={() => handleToggle(value)} disabled={saving === value._id} />
              <ConfirmButton onConfirm={() => handleDelete(value._id)} loading={saving === value._id} />
            </div>
          </Card>
        )} />
      )}
    </div>
  );
}
