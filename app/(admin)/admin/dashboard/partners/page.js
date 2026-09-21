'use client';
import { useState, useEffect } from 'react';
import {
  PageHeader, Card, Button, Field, Input, Toggle,
  ConfirmButton, ImageUploader, Modal, useToast, SkeletonList, EmptyState,
} from '@/components/admin/ui';
import styles from './page.module.css';

const emptyForm = { name: '', logoUrl: '', websiteUrl: '' };

export default function AdminPartnersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const showToast = useToast();

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/partners');
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ name: item.name, logoUrl: item.logoUrl || '', websiteUrl: item.websiteUrl || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving('form');
    try {
      const method = editing ? 'PUT' : 'POST';
      const payload = editing ? { _id: editing._id, ...form } : { ...form, order: items.length + 1, isVisible: true };
      const res = await fetch('/api/admin/partners', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(editing ? 'Partner updated!' : 'Partner added!');
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
      await fetch('/api/admin/partners', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: item._id, isVisible: !item.isVisible }) });
      fetchItems();
    } catch {
      showToast('Failed to update.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/partners?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Delete failed');
      showToast('Partner removed.');
      fetchItems();
    } catch (err) {
      showToast(err.message || 'Failed to delete.', 'error');
    }
    setSaving(null);
  };

  return (
    <div>
      <PageHeader
        icon="🤝"
        title="Partners & Collaborators"
        subtitle="Manage the logos shown in the scrolling partners strip on the homepage."
        action={<Button onClick={openNew}>+ Add Partner</Button>}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Partner' : 'New Partner'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Organisation Name" required>
            <Input required placeholder="e.g. WWF India" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </Field>
          <ImageUploader
            folder="about"
            label="Upload Logo (optional — shows text name if blank)"
            value={form.logoUrl}
            onChange={(url) => setForm((p) => ({ ...p, logoUrl: url }))}
          />
          <Field label="Website URL">
            <Input placeholder="https://wwfindia.org" value={form.websiteUrl} onChange={(e) => setForm((p) => ({ ...p, websiteUrl: e.target.value }))} />
          </Field>
          <div className={styles.modalActions}>
            <Button type="submit" loading={saving === 'form'}>{editing ? 'Save Changes' : 'Add Partner'}</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {loading ? <SkeletonList count={3} /> : items.length === 0 ? (
        <EmptyState icon="🤝" title="No partners added yet" description="The homepage marquee shows placeholder names until you add real partners." />
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <Card key={item._id} dimmed={!item.isVisible} className={styles.card}>
              <div className={styles.logoBox}>
                {item.logoUrl
                  ? <img src={item.logoUrl} alt={item.name} className={styles.logoImg} onError={(e) => { e.target.style.display = 'none'; }} />
                  : <span className={styles.textLogo}>{item.name}</span>}
              </div>
              <p className={styles.partnerName}>{item.name}</p>
              {item.websiteUrl && <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>{item.websiteUrl.replace('https://', '')}</a>}
              <div className={styles.cardActions}>
                <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>✏</Button>
                <Toggle active={item.isVisible} onClick={() => handleToggle(item)} disabled={saving === item._id} onLabel="👁" offLabel="🚫" />
                <ConfirmButton onConfirm={() => handleDelete(item._id)} loading={saving === item._id} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
