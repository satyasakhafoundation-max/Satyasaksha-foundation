'use client';
import { useState, useEffect } from 'react';
import {
  PageHeader, Card, Button, Field, Input, Textarea, Toggle,
  ConfirmButton, Modal, ReorderableList, useToast, SkeletonList, EmptyState,
} from '@/components/admin/ui';
import styles from './page.module.css';

const emptyForm = { year: '', title: '', description: '', pdfUrl: '', highlights: '', publishedDate: '' };

export default function AdminReportsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const showToast = useToast();

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/reports-all');
    const data = await res.json();
    setItems(Array.isArray(data) ? data.sort((a, b) => a.order - b.order) : []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm({ ...emptyForm, publishedDate: new Date().toISOString().slice(0, 10) }); setModalOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      year: item.year, title: item.title, description: item.description || '',
      pdfUrl: item.pdfUrl || '', highlights: (item.highlights || []).join('\n'),
      publishedDate: item.publishedDate ? new Date(item.publishedDate).toISOString().slice(0, 10) : '',
    });
    setModalOpen(true);
  };

  const handlePdfUpload = async (file) => {
    if (!file) return;
    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload-document', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((p) => ({ ...p, pdfUrl: data.fileUrl }));
      showToast('PDF uploaded!');
    } catch (err) {
      showToast(err.message || 'PDF upload failed.', 'error');
    }
    setUploadingPdf(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving('form');
    try {
      const payload = { ...form, highlights: form.highlights.split('\n').map((h) => h.trim()).filter(Boolean) };
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { _id: editing._id, ...payload } : { ...payload, order: items.length + 1 };
      const res = await fetch('/api/admin/reports', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
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
      const res = await fetch('/api/admin/reports', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: item._id, isVisible: !item.isVisible }) });
      if (!res.ok) throw new Error();
      fetchItems();
    } catch {
      showToast('Failed to update.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/reports?id=${id}`, { method: 'DELETE' });
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
    try {
      const results = await Promise.all(reordered.map((item, i) =>
        fetch('/api/admin/reports', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: item._id, order: i + 1 }) })
      ));
      if (results.some((res) => !res.ok)) throw new Error();
      showToast('Order saved.');
    } catch {
      showToast('Failed to save new order — refreshing list.', 'error');
      fetchItems();
    }
  };

  return (
    <div>
      <PageHeader
        icon="📄"
        title="Reports & Transparency"
        subtitle="Manage annual reports and financial transparency documents shown on the Reports page."
        action={<Button onClick={openNew}>+ Add Report</Button>}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Report' : 'New Report'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldRow}>
            <Field label="Year" required hint="e.g. 2025-2026">
              <Input required value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} />
            </Field>
            <Field label="Published Date">
              <Input type="date" value={form.publishedDate} onChange={(e) => setForm((p) => ({ ...p, publishedDate: e.target.value }))} />
            </Field>
          </div>
          <Field label="Title" required>
            <Input required placeholder="e.g. Annual Impact & Financial Report" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </Field>
          <Field label="Description">
            <Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </Field>
          <Field label="Highlights" hint="One per line — shown as small tags">
            <Textarea rows={3} value={form.highlights} onChange={(e) => setForm((p) => ({ ...p, highlights: e.target.value }))} placeholder={'Audited by XYZ & Co.\n80G Compliant\n95% Funds to Field Programs'} />
          </Field>
          <Field label="Report PDF">
            <label className={styles.uploadBtn}>
              {uploadingPdf ? 'Uploading…' : form.pdfUrl ? '📄 Replace PDF' : '⬆ Upload PDF'}
              <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={(e) => handlePdfUpload(e.target.files?.[0])} />
            </label>
            {form.pdfUrl && <a href={form.pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.pdfLink}>View uploaded PDF ↗</a>}
          </Field>
          <div className={styles.modalActions}>
            <Button type="submit" loading={saving === 'form'}>{editing ? 'Save Changes' : 'Add Report'}</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {loading ? <SkeletonList count={2} /> : items.length === 0 ? (
        <EmptyState icon="📄" title="No reports yet" description="Click + Add Report to publish your first one." />
      ) : (
        <ReorderableList items={items} onReorder={handleReorder} keyField="_id" renderItem={(item) => (
          <Card dimmed={!item.isVisible} className={styles.row}>
            <div className={styles.yearBadge}>{item.year}</div>
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
