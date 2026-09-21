'use client';
import { useState, useEffect } from 'react';

const isImageIcon = (icon) => typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('data:image'));

export default function AdminCoreValuesPage() {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [msg, setMsg] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newValue, setNewValue] = useState({ title: '', icon: '', description: '' });

  const fetchValues = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/core-values-all');
    const data = await res.json();
    setValues(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchValues(); }, []);

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSave = async (value) => {
    setSaving(value._id);
    try {
      const res = await fetch('/api/admin/core-values', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) });
      if (!res.ok) throw new Error();
      showMessage('Core value updated!');
      fetchValues();
    } catch {
      showMessage('Failed to save.', 'error');
    }
    setSaving(null);
  };

  const handleToggle = async (value) => {
    await handleSave({ ...value, isVisible: !value.isVisible });
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this core value?')) return;
    try {
      const res = await fetch(`/api/admin/core-values?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showMessage('Deleted.');
      fetchValues();
    } catch {
      showMessage('Failed to delete.', 'error');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newValue, order: values.length + 1 };
      const res = await fetch('/api/admin/core-values', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).error);
      showMessage('Added successfully!');
      setShowAdd(false);
      setNewValue({ title: '', icon: '', description: '' });
      fetchValues();
    } catch (err) {
      showMessage(err.message || 'Failed to add.', 'error');
    }
  };

  const updateLocal = (index, field, value) => {
    setValues(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const uploadIcon = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'about');
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
        setNewValue(p => ({ ...p, icon: imageUrl }));
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
          <h1 style={s.title}>🐘 About — Core Values</h1>
          <p style={s.sub}>Manage the &quot;Our Core Values&quot; cards shown on the About Us page. Icons can be an emoji or an uploaded image.</p>
        </div>
        <button style={s.addBtn} onClick={() => setShowAdd(!showAdd)}>+ Add Value</button>
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.type === 'error' ? s.msgError : s.msgSuccess) }}>{msg.text}</div>}

      {showAdd && (
        <form onSubmit={handleAdd} style={s.addForm}>
          <h3 style={s.addTitle}>New Core Value</h3>
          <div style={s.formGrid}>
            <input required placeholder="Title (e.g. Wisdom & Patience)" value={newValue.title} onChange={e => setNewValue(p => ({ ...p, title: e.target.value }))} style={s.input} />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input placeholder="Icon (emoji)" value={isImageIcon(newValue.icon) ? '' : newValue.icon} onChange={e => setNewValue(p => ({ ...p, icon: e.target.value }))} style={{ ...s.input, flex: 1 }} />
              <label style={s.uploadBtn}>
                {uploading === 'new' ? '…' : (isImageIcon(newValue.icon) ? '🖼 Change' : '⬆ Upload')}
                <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" style={{ display: 'none' }} onChange={e => handleIconUpload('new', e.target.files?.[0])} />
              </label>
              {isImageIcon(newValue.icon) && <img src={newValue.icon} alt="" style={s.iconPreview} />}
            </div>
            <textarea required placeholder="Description" value={newValue.description} onChange={e => setNewValue(p => ({ ...p, description: e.target.value }))} style={{ ...s.input, gridColumn: '1 / -1', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button type="submit" style={s.saveBtn}>Add Core Value</button>
            <button type="button" onClick={() => setShowAdd(false)} style={s.cancelBtn}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <p style={s.loadText}>Loading…</p> : (
        <div style={s.list}>
          {values.map((value, i) => (
            <div key={value._id} style={{ ...s.card, opacity: value.isVisible ? 1 : 0.5 }}>
              <div style={s.cardLeft}>
                <span style={s.icon}>
                  {isImageIcon(value.icon) ? <img src={value.icon} alt="" style={s.iconImg} /> : value.icon}
                </span>
                <label style={s.uploadBtnSmall}>
                  {uploading === i ? '…' : '⬆'}
                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" style={{ display: 'none' }} onChange={e => handleIconUpload(i, e.target.files?.[0])} />
                </label>
              </div>
              <div style={s.cardBody}>
                <input style={s.inputInline} value={value.title} onChange={e => updateLocal(i, 'title', e.target.value)} />
                <textarea style={{ ...s.inputSmall, minHeight: '50px', resize: 'vertical', fontFamily: 'inherit' }} value={value.description} onChange={e => updateLocal(i, 'description', e.target.value)} />
                <input
                  style={{ ...s.inputSmall, fontSize: '0.8rem' }}
                  placeholder="Icon (emoji) — or use ⬆ to upload an image"
                  value={isImageIcon(value.icon) ? '' : (value.icon || '')}
                  onChange={e => updateLocal(i, 'icon', e.target.value)}
                />
              </div>
              <div style={s.cardActions}>
                <button onClick={() => handleToggle(value)} style={{ ...s.toggleBtn, ...(value.isVisible ? s.toggleVisible : s.toggleHidden) }}>
                  {value.isVisible ? '👁 Visible' : '🚫 Hidden'}
                </button>
                <button onClick={() => handleSave(value)} disabled={saving === value._id} style={s.saveSmallBtn}>
                  {saving === value._id ? '…' : 'Save'}
                </button>
                <button onClick={() => handleDelete(value._id)} style={s.deleteBtn}>✕</button>
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
  iconPreview: { width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' },
  iconImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' },
};
