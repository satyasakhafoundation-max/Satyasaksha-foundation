'use client';
import { useState, useEffect } from 'react';

const isImageIcon = (icon) => typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('data:image'));

export default function AdminFocusAreasPage() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [msg, setMsg] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newArea, setNewArea] = useState({ title: '', icon: '', description: '', color: '#1B4332' });

  const fetchAreas = async () => {
    setLoading(true);
    // Fetch all areas (admin sees all, including hidden)
    const res = await fetch('/api/admin/focus-areas-all');
    const data = await res.json();
    setAreas(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchAreas(); }, []);

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSave = async (area) => {
    setSaving(area._id);
    try {
      const res = await fetch('/api/admin/focus-areas', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(area) });
      if (!res.ok) throw new Error();
      showMessage('Focus area updated!');
      fetchAreas();
    } catch {
      showMessage('Failed to save.', 'error');
    }
    setSaving(null);
  };

  const handleToggle = async (area) => {
    await handleSave({ ...area, isVisible: !area.isVisible });
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this focus area?')) return;
    try {
      const res = await fetch(`/api/admin/focus-areas?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showMessage('Deleted.');
      fetchAreas();
    } catch {
      showMessage('Failed to delete.', 'error');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newArea, link: '/news', order: areas.length + 1 };
      const res = await fetch('/api/admin/focus-areas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).error);
      showMessage('Added successfully!');
      setShowAdd(false);
      setNewArea({ title: '', icon: '', description: '', color: '#1B4332' });
      fetchAreas();
    } catch (err) {
      showMessage(err.message || 'Failed to add.', 'error');
    }
  };

  const updateLocal = (index, field, value) => {
    setAreas(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const uploadIcon = async (file, folder = 'focus-areas') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
    return (await res.json()).imageUrl;
  };

  const handleIconUpload = async (index, file) => {
    if (!file) return;
    setUploading(index);
    try {
      const imageUrl = await uploadIcon(file);
      if (index === 'new') {
        setNewArea(p => ({ ...p, icon: imageUrl }));
      } else {
        updateLocal(index, 'icon', imageUrl);
      }
      showMessage('Icon uploaded — remember to hit Save.');
    } catch (err) {
      showMessage(err.message || 'Icon upload failed.', 'error');
    }
    setUploading(null);
  };

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>🌿 Focus Areas</h1>
          <p style={s.sub}>Manage the domains shown across the website. Toggle visibility to hide/show without deleting.</p>
        </div>
        <button style={s.addBtn} onClick={() => setShowAdd(!showAdd)}>+ Add Area</button>
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.type === 'error' ? s.msgError : s.msgSuccess) }}>{msg.text}</div>}

      {showAdd && (
        <form onSubmit={handleAdd} style={s.addForm}>
          <h3 style={s.addTitle}>New Focus Area</h3>
          <div style={s.formGrid}>
            <input required placeholder="Title (e.g. Healthcare)" value={newArea.title} onChange={e => setNewArea(p => ({ ...p, title: e.target.value }))} style={s.input} />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input placeholder="Icon (emoji)" value={isImageIcon(newArea.icon) ? '' : newArea.icon} onChange={e => setNewArea(p => ({ ...p, icon: e.target.value }))} style={{ ...s.input, flex: 1 }} />
              <label style={s.uploadBtn}>
                {uploading === 'new' ? '…' : (isImageIcon(newArea.icon) ? '🖼 Change' : '⬆ Upload')}
                <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" style={{ display: 'none' }} onChange={e => handleIconUpload('new', e.target.files?.[0])} />
              </label>
              {isImageIcon(newArea.icon) && <img src={newArea.icon} alt="" style={s.iconPreview} />}
            </div>
            <input required placeholder="Description" value={newArea.description} onChange={e => setNewArea(p => ({ ...p, description: e.target.value }))} style={{ ...s.input, gridColumn: '1 / -1' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={s.label}>Card Color</label>
              <input type="color" value={newArea.color} onChange={e => setNewArea(p => ({ ...p, color: e.target.value }))} style={{ height: '36px', width: '60px', cursor: 'pointer', borderRadius: '6px', border: 'none', background: 'none' }} />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{newArea.color}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button type="submit" style={s.saveBtn}>Add Focus Area</button>
            <button type="button" onClick={() => setShowAdd(false)} style={s.cancelBtn}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <p style={s.loadText}>Loading…</p> : (
        <div style={s.list}>
          {areas.map((area, i) => (
            <div key={area._id} style={{ ...s.card, opacity: area.isVisible ? 1 : 0.5 }}>
              <div style={s.cardLeft}>
                <span style={s.icon}>
                  {isImageIcon(area.icon) ? <img src={area.icon} alt="" style={s.iconImg} /> : area.icon}
                </span>
                <label style={s.uploadBtnSmall}>
                  {uploading === i ? '…' : '⬆'}
                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" style={{ display: 'none' }} onChange={e => handleIconUpload(i, e.target.files?.[0])} />
                </label>
                <div style={{ ...s.colorDot, background: area.color }} />
              </div>
              <div style={s.cardBody}>
                <input style={s.inputInline} value={area.title} onChange={e => updateLocal(i, 'title', e.target.value)} />
                <input style={s.inputSmall} value={area.description} onChange={e => updateLocal(i, 'description', e.target.value)} />
                <input
                  style={{ ...s.inputSmall, fontSize: '0.8rem' }}
                  placeholder="Icon (emoji) — or use ⬆ to upload an image"
                  value={isImageIcon(area.icon) ? '' : (area.icon || '')}
                  onChange={e => updateLocal(i, 'icon', e.target.value)}
                />
              </div>
              <div style={s.cardActions}>
                <button
                  onClick={() => updateLocal(i, 'cardStyle', area.cardStyle === 'translucent' ? 'solid' : 'translucent')}
                  style={{ ...s.toggleBtn, ...(area.cardStyle === 'translucent' ? s.toggleVisible : s.toggleHidden) }}
                  title="Toggle a translucent (frosted glass) card style on the homepage"
                >
                  {area.cardStyle === 'translucent' ? '🧊 Translucent' : '◻ Solid'}
                </button>
                <button onClick={() => handleToggle(area)} style={{ ...s.toggleBtn, ...(area.isVisible ? s.toggleVisible : s.toggleHidden) }}>
                  {area.isVisible ? '👁 Visible' : '🚫 Hidden'}
                </button>
                <button onClick={() => handleSave(area)} disabled={saving === area._id} style={s.saveSmallBtn}>
                  {saving === area._id ? '…' : 'Save'}
                </button>
                <button onClick={() => handleDelete(area._id)} style={s.deleteBtn}>✕</button>
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
  icon: { fontSize: '2.5rem', background: 'rgba(255,255,255,0.05)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' },
  colorDot: { width: '16px', height: '16px', borderRadius: '50%', background: 'var(--dot-color, #1B4332)', flexShrink: 0, boxShadow: '0 0 10px rgba(255,255,255,0.2)' },
  cardBody: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '240px' },
  cardActions: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' },
  input: { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px 16px', color: '#fff', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  inputInline: { background: 'rgba(255,255,255,0.02)', border: '1px solid transparent', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '1.1rem', fontWeight: '600', outline: 'none', width: '100%', transition: 'all 0.2s' },
  inputSmall: { background: 'rgba(255,255,255,0.02)', border: '1px solid transparent', borderRadius: '8px', padding: '10px 14px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', outline: 'none', width: '100%', transition: 'all 0.2s', lineHeight: 1.5 },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' },
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
  iconPreview: { width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' },
  iconImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' },
};
