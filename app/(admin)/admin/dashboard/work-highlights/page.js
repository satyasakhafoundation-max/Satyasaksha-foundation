'use client';
import { useState, useEffect } from 'react';

export default function AdminWorkHighlightsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [msg, setMsg] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '', image: '' });

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/work-highlights-all');
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSave = async (item) => {
    setSaving(item._id);
    try {
      const res = await fetch('/api/admin/work-highlights', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
      if (!res.ok) throw new Error();
      showMessage('Updated!');
      fetchItems();
    } catch {
      showMessage('Failed to save.', 'error');
    }
    setSaving(null);
  };

  const handleToggle = async (item) => {
    await handleSave({ ...item, isVisible: !item.isVisible });
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this picture?')) return;
    try {
      const res = await fetch(`/api/admin/work-highlights?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showMessage('Deleted.');
      fetchItems();
    } catch {
      showMessage('Failed to delete.', 'error');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.image) {
      showMessage('Please upload an image first.', 'error');
      return;
    }
    try {
      const payload = { ...newItem, order: items.length + 1 };
      const res = await fetch('/api/admin/work-highlights', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).error);
      showMessage('Added successfully!');
      setShowAdd(false);
      setNewItem({ title: '', description: '', image: '' });
      fetchItems();
    } catch (err) {
      showMessage(err.message || 'Failed to add.', 'error');
    }
  };

  const updateLocal = (index, field, value) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'work');
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
    return (await res.json()).imageUrl;
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;
    setUploading(index);
    try {
      const imageUrl = await uploadImage(file);
      if (index === 'new') {
        setNewItem(p => ({ ...p, image: imageUrl }));
      } else {
        updateLocal(index, 'image', imageUrl);
      }
      showMessage('Image uploaded — remember to hit Save.');
    } catch (err) {
      showMessage(err.message || 'Image upload failed.', 'error');
    }
    setUploading(null);
  };

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>📸 Our Work — In Pictures</h1>
          <p style={s.sub}>Manage the photo showcase on the Impact &amp; Our Work page — mostly pictures of work we&apos;ve done.</p>
        </div>
        <button style={s.addBtn} onClick={() => setShowAdd(!showAdd)}>+ Add Picture</button>
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.type === 'error' ? s.msgError : s.msgSuccess) }}>{msg.text}</div>}

      {showAdd && (
        <form onSubmit={handleAdd} style={s.addForm}>
          <h3 style={s.addTitle}>New Picture</h3>
          <div style={s.formGrid}>
            <input required placeholder="Title (e.g. Tree Plantation Drive)" value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))} style={s.input} />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={s.uploadBtn}>
                {uploading === 'new' ? 'Uploading…' : (newItem.image ? '🖼 Change Photo' : '⬆ Upload Photo')}
                <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" style={{ display: 'none' }} onChange={e => handleImageUpload('new', e.target.files?.[0])} />
              </label>
              {newItem.image && <img src={newItem.image} alt="" style={s.imgPreview} />}
            </div>
            <textarea placeholder="Short caption (optional)" value={newItem.description} onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))} style={{ ...s.input, gridColumn: '1 / -1', minHeight: '70px', resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button type="submit" style={s.saveBtn}>Add Picture</button>
            <button type="button" onClick={() => setShowAdd(false)} style={s.cancelBtn}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <p style={s.loadText}>Loading…</p> : (
        <div style={s.list}>
          {items.map((item, i) => (
            <div key={item._id} style={{ ...s.card, opacity: item.isVisible ? 1 : 0.5 }}>
              <div style={s.cardLeft}>
                <div style={s.photo}>
                  {item.image ? <img src={item.image} alt="" style={s.photoImg} /> : '📷'}
                </div>
                <label style={s.uploadBtnSmall}>
                  {uploading === i ? '…' : '⬆'}
                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" style={{ display: 'none' }} onChange={e => handleImageUpload(i, e.target.files?.[0])} />
                </label>
              </div>
              <div style={s.cardBody}>
                <input style={s.inputInline} value={item.title} onChange={e => updateLocal(i, 'title', e.target.value)} />
                <textarea style={{ ...s.inputSmall, minHeight: '50px', resize: 'vertical', fontFamily: 'inherit' }} placeholder="Short caption" value={item.description || ''} onChange={e => updateLocal(i, 'description', e.target.value)} />
              </div>
              <div style={s.cardActions}>
                <button onClick={() => handleToggle(item)} style={{ ...s.toggleBtn, ...(item.isVisible ? s.toggleVisible : s.toggleHidden) }}>
                  {item.isVisible ? '👁 Visible' : '🚫 Hidden'}
                </button>
                <button onClick={() => handleSave(item)} disabled={saving === item._id} style={s.saveSmallBtn}>
                  {saving === item._id ? '…' : 'Save'}
                </button>
                <button onClick={() => handleDelete(item._id)} style={s.deleteBtn}>✕</button>
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
  photo: { fontSize: '1.8rem', background: 'rgba(255,255,255,0.05)', width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' },
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
  imgPreview: { width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' },
};
