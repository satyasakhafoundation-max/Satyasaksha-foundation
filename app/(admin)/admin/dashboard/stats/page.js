'use client';
import { useState, useEffect } from 'react';
import { PageHeader, Card, Button, Field, Input, ConfirmButton, Modal, useToast, SkeletonList, EmptyState } from '@/components/admin/ui';
import styles from './page.module.css';

const emptyForm = { id: '', label: '', value: '', prefix: '', suffix: '', icon: '' };

export default function AdminStatsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const showToast = useToast();

  const fetchStats = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    setStats(Array.isArray(data) ? data.sort((a, b) => a.order - b.order) : []);
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (stat) => {
    setEditing(stat);
    setForm({ id: stat.id, label: stat.label, value: stat.value, prefix: stat.prefix || '', suffix: stat.suffix || '', icon: stat.icon });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving('form');
    try {
      const method = editing ? 'PUT' : 'POST';
      const payload = editing
        ? { _id: editing._id, ...form, value: Number(form.value) }
        : { ...form, value: Number(form.value), order: stats.length + 1 };
      const res = await fetch('/api/admin/stats', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(editing ? 'Stat updated!' : 'Stat added!');
      setModalOpen(false);
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to save.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/stats?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('Deleted.');
      fetchStats();
    } catch {
      showToast('Failed to delete.', 'error');
    }
    setSaving(null);
  };

  return (
    <div>
      <PageHeader
        icon="📈"
        title="Impact Stats"
        subtitle="These numbers appear on the homepage and impact page."
        action={<Button onClick={openNew}>+ Add Stat</Button>}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Stat' : 'New Stat'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldRow}>
            <Field label="ID" required hint="A short unique key, e.g. volunteers">
              <Input required value={form.id} onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))} />
            </Field>
            <Field label="Icon (emoji)" required>
              <Input required placeholder="🌱" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} />
            </Field>
          </div>
          <Field label="Label" required>
            <Input required placeholder="e.g. Trees Planted" value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} />
          </Field>
          <div className={styles.fieldRow3}>
            <Field label="Prefix" hint="e.g. ₹">
              <Input value={form.prefix} onChange={(e) => setForm((p) => ({ ...p, prefix: e.target.value }))} />
            </Field>
            <Field label="Value" required>
              <Input type="number" min="0" required value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} />
            </Field>
            <Field label="Suffix" hint="e.g. +">
              <Input value={form.suffix} onChange={(e) => setForm((p) => ({ ...p, suffix: e.target.value }))} />
            </Field>
          </div>
          <div className={styles.modalActions}>
            <Button type="submit" loading={saving === 'form'}>{editing ? 'Save Changes' : 'Add Stat'}</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {loading ? <SkeletonList count={4} /> : stats.length === 0 ? (
        <EmptyState icon="📈" title="No stats yet" description="Click + Add Stat to create your first one." />
      ) : (
        <div className={styles.grid}>
          {stats.map((stat) => (
            <Card key={stat._id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.icon}>{stat.icon}</span>
                <ConfirmButton onConfirm={() => handleDelete(stat._id)} loading={saving === stat._id} />
              </div>
              <p className={styles.value}>{stat.prefix}{stat.value.toLocaleString()}{stat.suffix}</p>
              <p className={styles.statLabel}>{stat.label}</p>
              <Button variant="outline" size="sm" onClick={() => openEdit(stat)}>✏ Edit</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
