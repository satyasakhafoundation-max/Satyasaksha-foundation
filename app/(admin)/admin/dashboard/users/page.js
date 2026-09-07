'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '' });
  const [inviteLink, setInviteLink] = useState(null);
  const [inviting, setInviting] = useState(false);

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

  const showMessage = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg(null), 4000); };

  const handleToggleActive = async (user) => {
    setSaving(user._id);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user._id, isActive: !user.isActive }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showMessage(user.isActive ? 'User deactivated.' : 'User reactivated!');
      fetchUsers();
    } catch (err) { showMessage(err.message || 'Failed.', 'error'); }
    setSaving(null);
  };

  const handleDelete = async (user) => {
    if (!confirm(`Permanently delete ${user.name}'s account? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${user._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error);
      showMessage('Admin user deleted.');
      fetchUsers();
    } catch (err) { showMessage(err.message || 'Failed.', 'error'); }
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
      // Build the invite URL
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/admin/setup?token=${data.rawToken}`;
      setInviteLink(link);
      setInviteForm({ name: '', email: '' });
      fetchUsers();
    } catch (err) { showMessage(err.message || 'Failed to create invite.', 'error'); }
    setInviting(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    showMessage('Invite link copied to clipboard!');
  };

  if (!isSuperAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p style={{ fontSize: '3rem' }}>🔒</p>
        <h2 style={{ color: '#fff', marginTop: '16px' }}>Access Restricted</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>Only super admins can manage user accounts.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>👥 Admin Users</h1>
          <p style={s.sub}>Manage who has access to this admin dashboard. Only you (super admin) can see this page.</p>
        </div>
        <button style={s.addBtn} onClick={() => { setShowInvite(!showInvite); setInviteLink(null); }}>
          {showInvite ? 'Cancel' : '+ Invite Admin'}
        </button>
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.type === 'error' ? s.msgError : s.msgSuccess) }}>{msg.text}</div>}

      {/* Invite Form */}
      {showInvite && (
        <div style={s.inviteBox}>
          <h3 style={s.inviteTitle}>📨 Generate Invite Link</h3>
          <p style={s.inviteSub}>Enter the new admin&apos;s details. You&apos;ll get a one-time link (valid 48h) to share with them via WhatsApp or email.</p>

          {!inviteLink ? (
            <form onSubmit={handleInviteSubmit} style={s.inviteForm}>
              <div style={s.fieldRow}>
                <div style={s.field}>
                  <label style={s.label}>Full Name *</label>
                  <input name="name" required value={inviteForm.name} onChange={e => setInviteForm(p => ({ ...p, name: e.target.value }))} style={s.input} placeholder="e.g. Rahul Sharma" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Email Address *</label>
                  <input name="email" type="email" required value={inviteForm.email} onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))} style={s.input} placeholder="rahul@example.com" />
                </div>
              </div>
              <button type="submit" disabled={inviting} style={{ ...s.saveBtn, opacity: inviting ? 0.7 : 1 }}>{inviting ? 'Generating…' : 'Generate Invite Link'}</button>
            </form>
          ) : (
            <div style={s.linkBox}>
              <p style={s.linkLabel}>✅ Invite link generated! Share this with the new admin:</p>
              <div style={s.linkRow}>
                <code style={s.linkCode}>{inviteLink}</code>
                <button onClick={handleCopy} style={s.copyBtn}>📋 Copy</button>
              </div>
              <p style={s.linkWarning}>⚠️ This link expires in 48 hours. Do not share publicly.</p>
              <button onClick={() => { setInviteLink(null); setShowInvite(false); }} style={s.cancelBtn}>Done</button>
            </div>
          )}
        </div>
      )}

      {/* Users Table */}
      {loading ? <p style={s.loadText}>Loading users…</p> : (
        <div style={s.list}>
          {users.map(user => (
            <div key={user._id} style={{ ...s.userCard, opacity: user.isActive ? 1 : 0.55 }}>
              <div style={s.userLeft}>
                <div style={s.avatar}>
                  <span style={s.initials}>{user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</span>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <span style={s.userName}>{user.name}</span>
                    {user.role === 'super_admin' && <span style={s.superBadge}>⭐ Super Admin</span>}
                    {user._id === session?.user?.id && <span style={s.youBadge}>You</span>}
                    <span style={{ ...s.statusPill, ...(user.isActive ? s.active : s.inactive) }}>
                      {user.isActive ? '● Active' : '○ Inactive'}
                    </span>
                    {!user.password && !user.isActive && <span style={s.pendingPill}>⏳ Pending Setup</span>}
                  </div>
                  <p style={s.userEmail}>{user.email}</p>
                  <p style={s.userDate}>Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              {user._id !== session?.user?.id && user.role !== 'super_admin' && (
                <div style={s.userActions}>
                  <button
                    onClick={() => handleToggleActive(user)}
                    disabled={saving === user._id}
                    style={{ ...s.toggleBtn, ...(user.isActive ? s.deactivateBtn : s.activateBtn) }}
                  >
                    {saving === user._id ? '…' : user.isActive ? 'Deactivate' : 'Reactivate'}
                  </button>
                  <button onClick={() => handleDelete(user)} style={s.deleteBtn}>🗑 Remove</button>
                </div>
              )}
            </div>
          ))}
        </div>
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
  inviteBox: { background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '16px', padding: '32px', marginBottom: '32px' },
  inviteTitle: { color: '#D4AF37', fontWeight: '700', fontSize: '1.2rem', margin: '0 0 8px' },
  inviteSub: { color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', margin: '0 0 24px', lineHeight: 1.6 },
  inviteForm: { display: 'flex', flexDirection: 'column', gap: '16px' },
  fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' },
  input: { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px 16px', color: '#fff', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  saveBtn: { background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0a110a', border: 'none', borderRadius: '10px', padding: '14px 28px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', width: 'fit-content' },
  cancelBtn: { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 20px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', marginTop: '12px' },
  linkBox: { display: 'flex', flexDirection: 'column', gap: '12px' },
  linkLabel: { color: '#34d399', fontWeight: '600', margin: 0 },
  linkRow: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' },
  linkCode: { background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.8)', padding: '12px 16px', borderRadius: '8px', fontSize: '0.8rem', wordBreak: 'break-all', flex: 1, border: '1px solid rgba(255,255,255,0.05)' },
  copyBtn: { background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#D4AF37', padding: '10px 16px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', whiteSpace: 'nowrap' },
  linkWarning: { color: 'rgba(255,180,0,0.7)', fontSize: '0.82rem', margin: 0 },
  loadText: { color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontSize: '1.1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  userCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '20px 24px', gap: '16px', flexWrap: 'wrap' },
  userLeft: { display: 'flex', alignItems: 'center', gap: '16px', flex: 1 },
  avatar: { width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #0D1A0D, #1A2E1A)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  initials: { color: '#D4AF37', fontWeight: '700', fontSize: '1.1rem' },
  userName: { color: '#fff', fontWeight: '700', fontSize: '1rem' },
  superBadge: { fontSize: '0.72rem', fontWeight: '700', color: '#D4AF37', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', padding: '3px 10px', borderRadius: '99px' },
  youBadge: { fontSize: '0.72rem', fontWeight: '700', color: '#818cf8', background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', padding: '3px 10px', borderRadius: '99px' },
  statusPill: { fontSize: '0.72rem', fontWeight: '600', padding: '3px 10px', borderRadius: '99px' },
  active: { color: '#34d399', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' },
  inactive: { color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' },
  pendingPill: { fontSize: '0.72rem', fontWeight: '600', color: '#fbbf24', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', padding: '3px 10px', borderRadius: '99px' },
  userEmail: { color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', margin: '2px 0 0' },
  userDate: { color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', margin: '2px 0 0' },
  userActions: { display: 'flex', gap: '10px', flexShrink: 0, flexWrap: 'wrap' },
  toggleBtn: { padding: '9px 16px', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' },
  deactivateBtn: { background: 'rgba(251,191,36,0.08)', color: '#fbbf24', borderColor: 'rgba(251,191,36,0.2)' },
  activateBtn: { background: 'rgba(52,211,153,0.08)', color: '#34d399', borderColor: 'rgba(52,211,153,0.2)' },
  deleteBtn: { padding: '9px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' },
};
