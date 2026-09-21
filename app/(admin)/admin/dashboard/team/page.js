'use client';
import { useState, useEffect } from 'react';

export default function AdminTeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [msg, setMsg] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '', bio: '', image: '' });

  const fetchMembers = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/team-all');
    const data = await res.json();
    setMembers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSave = async (member) => {
    setSaving(member._id);
    try {
      const res = await fetch('/api/admin/team', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(member) });
      if (!res.ok) throw new Error();
      showMessage('Team member updated!');
      fetchMembers();
    } catch {
      showMessage('Failed to save.', 'error');
    }
    setSaving(null);
  };

  const handleToggle = async (member) => {
    await handleSave({ ...member, isVisible: !member.isVisible });
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently remove this team member?')) return;
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showMessage('Removed.');
      fetchMembers();
    } catch {
      showMessage('Failed to remove.', 'error');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newMember, order: members.length + 1 };
      const res = await fetch('/api/admin/team', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).error);
      showMessage('Added successfully!');
      setShowAdd(false);
      setNewMember({ name: '', role: '', bio: '', image: '' });
      fetchMembers();
    } catch (err) {
      showMessage(err.message || 'Failed to add.', 'error');
    }
  };

  const updateLocal = (index, field, value) => {
    setMembers(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'team');
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
    return (await res.json()).imageUrl;
  };

  const handlePhotoUpload = async (index, file) => {
    if (!file) return;
    setUploading(index);
    try {
      const imageUrl = await uploadPhoto(file);
      if (index === 'new') {
        setNewMember(p => ({ ...p, image: imageUrl }));
      } else {
        updateLocal(index, 'image', imageUrl);
      }
      showMessage('Photo uploaded — remember to hit Save.');
    } catch (err) {
      showMessage(err.message || 'Photo upload failed.', 'error');
    }
    setUploading(null);
  };

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>👤 Our Team</h1>
          <p style={s.sub}>Manage the people shown on the dedicated Team page — photos, names, roles, and short bios.</p>
        </div>
        <button style={s.addBtn} onClick={() => setShowAdd(!showAdd)}>+ Add Member</button>
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.type === 'error' ? s.msgError : s.msgSuccess) }}>{msg.text}</div>}

      {showAdd && (
        <form onSubmit={handleAdd} style={s.addForm}>
          <h3 style={s.addTitle}>New Team Member</h3>
          <div style={s.formGrid}>
            <input required placeholder="Full Name" value={newMember.name} onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))} style={s.input} />
            <input required placeholder="Role (e.g. Project Coordinator)" value={newMember.role} onChange={e => setNewMember(p => ({ ...p, role: e.target.value }))} style={s.input} />
            <textarea placeholder="Short bio (optional)" value={newMember.bio} onChange={e => setNewMember(p => ({ ...p, bio: e.target.value }))} style={{ ...s.input, gridColumn: '1 / -1', minHeight: '70px', resize: 'vertical', fontFamily: 'inherit' }} />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', gridColumn: '1 / -1' }}>
              <label style={s.uploadBtn}>
                {uploading === 'new' ? 'Uploading…' : (newMember.image ? '📷 Change Photo' : '⬆ Upload Photo')}
                <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" style={{ display: 'none' }} onChange={e => handlePhotoUpload('new', e.target.files?.[0])} />
              </label>
              {newMember.image && <img src={newMember.image} alt="" style={s.photoPreview} />}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button type="submit" style={s.saveBtn}>Add Member</button>
            <button type="button" onClick={() => setShowAdd(false)} style={s.cancelBtn}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <p style={s.loadText}>Loading…</p> : (
        <div style={s.list}>
          {members.map((member, i) => (
            <div key={member._id} style={{ ...s.card, opacity: member.isVisible === false ? 0.5 : 1 }}>
              <div style={s.cardLeft}>
                <div style={s.photo}>
                  {member.image ? <img src={member.image} alt="" style={s.photoImg} /> : '👤'}
                </div>
                <label style={s.uploadBtnSmall}>
                  {uploading === i ? '…' : '⬆'}
                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" style={{ display: 'none' }} onChange={e => handlePhotoUpload(i, e.target.files?.[0])} />
                </label>
              </div>
              <div style={s.cardBody}>
                <input style={s.inputInline} value={member.name} onChange={e => updateLocal(i, 'name', e.target.value)} />
                <input style={s.inputSmall} value={member.role} onChange={e => updateLocal(i, 'role', e.target.value)} />
                <textarea style={{ ...s.inputSmall, minHeight: '50px', resize: 'vertical', fontFamily: 'inherit' }} placeholder="Short bio" value={member.bio || ''} onChange={e => updateLocal(i, 'bio', e.target.value)} />
              </div>
              <div style={s.cardActions}>
                <button onClick={() => handleToggle(member)} style={{ ...s.toggleBtn, ...(member.isVisible !== false ? s.toggleVisible : s.toggleHidden) }}>
                  {member.isVisible !== false ? '👁 Visible' : '🚫 Hidden'}
                </button>
                <button onClick={() => handleSave(member)} disabled={saving === member._id} style={s.saveSmallBtn}>
                  {saving === member._id ? '…' : 'Save'}
                </button>
                <button onClick={() => handleDelete(member._id)} style={s.deleteBtn}>✕</button>
              </div>
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
  sub: { color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '1rem', fontWeight: '400' },
  addBtn: { background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0a110a', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 8px 20px rgba(212,175,55,0.2)' },
  msg: { borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '500', backdropFilter: 'blur(10px)' },
  msgSuccess: { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' },
  msgError: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' },
  addForm: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '16px', padding: '32px', marginBottom: '32px', backdropFilter: 'blur(10px)' },
  addTitle: { color: '#D4AF37', fontWeight: '600', margin: '0 0 20px', fontSize: '1.2rem', letterSpacing: '-0.3px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { display: 'flex', alignItems: 'center', gap: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px 28px', flexWrap: 'wrap', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  cardLeft: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '60px' },
  photo: { fontSize: '1.8rem', background: 'rgba(255,255,255,0.05)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' },
  photoImg: { width: '100%', height: '100%', objectFit: 'cover' },
  cardBody: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '240px' },
  cardActions: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' },
  input: { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px 16px', color: '#fff', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  inputInline: { background: 'rgba(255,255,255,0.02)', border: '1px solid transparent', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '1.1rem', fontWeight: '600', outline: 'none', width: '100%', transition: 'all 0.2s' },
  inputSmall: { background: 'rgba(255,255,255,0.02)', border: '1px solid transparent', borderRadius: '8px', padding: '10px 14px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', outline: 'none', width: '100%', transition: 'all 0.2s', lineHeight: 1.5 },
  toggleBtn: { padding: '10px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s' },
  toggleVisible: { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' },
  toggleHidden: { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' },
  saveSmallBtn: { padding: '10px 20px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '10px', color: '#D4AF37', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s' },
  saveBtn: { background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0a110a', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' },
  cancelBtn: { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 20px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600' },
  deleteBtn: { padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' },
  loadText: { color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontSize: '1.1rem' },
  uploadBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '14px 16px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '10px', color: '#D4AF37', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap' },
  uploadBtnSmall: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#D4AF37', cursor: 'pointer', fontSize: '0.85rem' },
  photoPreview: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' },
};
