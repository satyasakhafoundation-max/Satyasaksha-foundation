'use client';
import { useState, useEffect } from 'react';
import {
  PageHeader, Card, Button, Field, Input, Textarea, Toggle,
  ConfirmButton, ImageUploader, Modal, ReorderableList, useToast, SkeletonList, EmptyState,
} from '@/components/admin/ui';
import styles from './page.module.css';

const emptyForm = { name: '', role: '', bio: '', image: '' };

export default function AdminTeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const showToast = useToast();

  const fetchMembers = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/team-all');
    const data = await res.json();
    setMembers(Array.isArray(data) ? data.sort((a, b) => a.order - b.order) : []);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (member) => {
    setEditing(member);
    setForm({ name: member.name, role: member.role, bio: member.bio || '', image: member.image || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving('form');
    try {
      const method = editing ? 'PUT' : 'POST';
      const payload = editing ? { _id: editing._id, ...form } : { ...form, order: members.length + 1 };
      const res = await fetch('/api/admin/team', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(editing ? 'Updated!' : 'Added!');
      setModalOpen(false);
      fetchMembers();
    } catch (err) {
      showToast(err.message || 'Failed to save.', 'error');
    }
    setSaving(null);
  };

  const handleToggle = async (member) => {
    setSaving(member._id);
    try {
      await fetch('/api/admin/team', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: member._id, isVisible: member.isVisible === false }) });
      fetchMembers();
    } catch {
      showToast('Failed to update.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('Removed.');
      fetchMembers();
    } catch {
      showToast('Failed to remove.', 'error');
    }
    setSaving(null);
  };

  const handleReorder = async (reordered) => {
    setMembers(reordered);
    await Promise.all(reordered.map((m, i) =>
      fetch('/api/admin/team', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: m._id, order: i + 1 }) })
    ));
    showToast('Order saved.');
  };

  return (
    <div>
      <PageHeader
        icon="👤"
        title="Our Team"
        subtitle="Manage the people shown on the dedicated Team page — photos, names, roles, and short bios."
        action={<Button onClick={openNew}>+ Add Member</Button>}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Team Member' : 'New Team Member'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Full Name" required>
            <Input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </Field>
          <Field label="Role" required>
            <Input required placeholder="e.g. Project Coordinator" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
          </Field>
          <Field label="Short Bio">
            <Textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />
          </Field>
          <ImageUploader
            folder="team"
            shape="circle"
            label="Upload Photo"
            value={form.image}
            onChange={(url) => setForm((p) => ({ ...p, image: url }))}
          />
          <div className={styles.modalActions}>
            <Button type="submit" loading={saving === 'form'}>{editing ? 'Save Changes' : 'Add Member'}</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {loading ? <SkeletonList count={3} /> : members.length === 0 ? (
        <EmptyState icon="👤" title="No team members yet" description="Click + Add Member to create your first one." />
      ) : (
        <ReorderableList items={members} onReorder={handleReorder} keyField="_id" renderItem={(member) => (
          <Card dimmed={member.isVisible === false} className={styles.row}>
            <div className={`${styles.rowIcon} ${styles.circle}`}>
              {member.image ? <img src={member.image} alt="" className={styles.iconImg} /> : '👤'}
            </div>
            <div className={styles.rowBody}>
              <h3 className={styles.rowTitle}>{member.name}</h3>
              <p className={styles.rowDesc}>{member.role}</p>
            </div>
            <div className={styles.rowActions}>
              <Button variant="ghost" size="sm" onClick={() => openEdit(member)}>✏ Edit</Button>
              <Toggle active={member.isVisible !== false} onClick={() => handleToggle(member)} disabled={saving === member._id} />
              <ConfirmButton onConfirm={() => handleDelete(member._id)} loading={saving === member._id} />
            </div>
          </Card>
        )} />
      )}
    </div>
  );
}
