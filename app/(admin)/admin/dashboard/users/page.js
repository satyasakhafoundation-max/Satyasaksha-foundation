'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { PageHeader, Card, Button, Field, Input, Badge, useToast, EmptyState } from '@/components/admin/ui';
import styles from './page.module.css';

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '' });
  const [inviteLink, setInviteLink] = useState(null);
  const [inviting, setInviting] = useState(false);
  const showToast = useToast();

  const isSuperAdmin = session?.user?.role === 'super_admin';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleActive = async (user) => {
    setSaving(user._id);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user._id, isActive: !user.isActive }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(user.isActive ? 'User deactivated.' : 'User reactivated!');
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (user) => {
    if (!confirm(`Permanently delete ${user.name}'s account? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${user._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Admin user deleted.');
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed.', 'error');
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setInviting(true);
    setInviteLink(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const baseUrl = window.location.origin;
      setInviteLink(`${baseUrl}/admin/setup?token=${data.rawToken}`);
      setInviteForm({ name: '', email: '' });
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to create invite.', 'error');
    }
    setInviting(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    showToast('Invite link copied to clipboard!');
  };

  if (!isSuperAdmin) {
    return (
      <EmptyState icon="🔒" title="Access Restricted" description="Only super admins can manage user accounts." />
    );
  }

  return (
    <div>
      <PageHeader
        icon="👥"
        title="Admin Users"
        subtitle="Manage who has access to this admin dashboard. Only you (super admin) can see this page."
        action={<Button onClick={() => { setShowInvite(!showInvite); setInviteLink(null); }}>{showInvite ? 'Cancel' : '+ Invite Admin'}</Button>}
      />

      {showInvite && (
        <Card className={styles.inviteBox}>
          <h3 className={styles.inviteTitle}>📨 Generate Invite Link</h3>
          <p className={styles.inviteSub}>Enter the new admin&apos;s details. You&apos;ll get a one-time link (valid 48h) to share with them via WhatsApp or email.</p>

          {!inviteLink ? (
            <form onSubmit={handleInviteSubmit} className={styles.inviteForm}>
              <div className={styles.fieldRow}>
                <Field label="Full Name" required>
                  <Input required value={inviteForm.name} onChange={(e) => setInviteForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Rahul Sharma" />
                </Field>
                <Field label="Email Address" required>
                  <Input type="email" required value={inviteForm.email} onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))} placeholder="rahul@example.com" />
                </Field>
              </div>
              <Button type="submit" loading={inviting} className={styles.generateBtn}>Generate Invite Link</Button>
            </form>
          ) : (
            <div className={styles.linkBox}>
              <p className={styles.linkLabel}>✅ Invite link generated! Share this with the new admin:</p>
              <div className={styles.linkRow}>
                <code className={styles.linkCode}>{inviteLink}</code>
                <Button variant="ghost" size="sm" onClick={handleCopy}>📋 Copy</Button>
              </div>
              <p className={styles.linkWarning}>⚠️ This link expires in 48 hours. Do not share publicly.</p>
              <Button variant="outline" onClick={() => { setInviteLink(null); setShowInvite(false); }}>Done</Button>
            </div>
          )}
        </Card>
      )}

      {loading ? <p className={styles.loadText}>Loading users…</p> : (
        <div className={styles.list}>
          {users.map((user) => (
            <Card key={user._id} dimmed={!user.isActive} className={styles.userCard}>
              <div className={styles.userLeft}>
                <div className={styles.avatar}>
                  <span className={styles.initials}>{user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <div className={styles.badgeRow}>
                    <span className={styles.userName}>{user.name}</span>
                    {user.role === 'super_admin' && <Badge variant="gold">⭐ Super Admin</Badge>}
                    {user._id === session?.user?.id && <Badge variant="neutral">You</Badge>}
                    <Badge variant={user.isActive ? 'success' : 'neutral'}>{user.isActive ? '● Active' : '○ Inactive'}</Badge>
                    {!user.password && !user.isActive && <Badge variant="warning">⏳ Pending Setup</Badge>}
                  </div>
                  <p className={styles.userEmail}>{user.email}</p>
                  <p className={styles.userDate}>Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              {user._id !== session?.user?.id && user.role !== 'super_admin' && (
                <div className={styles.userActions}>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={saving === user._id}
                    onClick={() => handleToggleActive(user)}
                  >
                    {saving === user._id ? '…' : user.isActive ? 'Deactivate' : 'Reactivate'}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(user)}>🗑 Remove</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
