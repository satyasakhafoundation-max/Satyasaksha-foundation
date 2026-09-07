'use client';
import { useState, useEffect } from 'react';

const emptyForm = { name: '', logoUrl: '', websiteUrl: '', isVisible: true, order: 0 };

const CONFIRM_STYLES = {
  inlineConfirm: { display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '4px 8px' },
  confirmText: { color: '#f87171', fontSize: '0.8rem', fontWeight: '600' },
  confirmYes: { background: '#ef4444', border: 'none', borderRadius: '6px', color: '#fff', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' },
  confirmNo: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'rgba(255,255,255,0.6)', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' },
};

export default function AdminPartnersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [msg, setMsg] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/partners');
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const showMessage = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg(null), 3500); };
  const handleOpenNew = () => { setEditingItem(null); setForm(emptyForm); setShowForm(true); };
  const handleOpenEdit = (item) => { setEditingItem(item); setForm({ name: item.name, logoUrl: item.logoUrl || '', websiteUrl: item.websiteUrl || '', isVisible: item.isVisible, order: item.order }); setShowForm(true); };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving('form');
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem ? { _id: editingItem._id, ...form } : form;
      const res = await fetch('/api/admin/partners', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error);
      showMessage(editingItem ? 'Partner updated!' : 'Partner added!');
      setShowForm(false);
      fetchItems();
    } catch (err) { showMessage(err.message || 'Failed.', 'error'); }
    setSaving(null);
  };

  const handleToggle = async (item) => {
    setSaving(item._id);
    try {
      await fetch('/api/admin/partners', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: item._id, isVisible: !item.isVisible }) });
      fetchItems();
    } catch { showMessage('Failed.', 'error'); }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    setSaving('del-' + id);
    try {
      const res = await fetch(`/api/admin/partners?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Delete failed');
      showMessage('Partner removed.');
      setConfirmDelete(null);
      fetchItems();
    } catch (err) { showMessage(err.message || 'Failed.', 'error'); }
    setSaving(null);
  };

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>🤝 Partners & Collaborators</h1>
          <p style={s.sub}>Manage the logos shown in the scrolling partners strip on the homepage.</p>
        </div>
        <button style={s.addBtn} onClick={handleOpenNew}>+ Add Partner</button>
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.type === 'error' ? s.msgError : s.msgSuccess) }}>{msg.text}</div>}

      {showForm && (
        <div style={s.formWrap}>
          <div style={s.formHeader}>
            <h3 style={s.formTitle}>{editingItem ? 'Edit Partner' : 'Add New Partner'}</h3>
            <button onClick={() => setShowForm(false)} style={s.closeBtn}>✕</button>
          </div>
          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.fieldRow}>
              <div style={s.field}>
                <label style={s.label}>Organisation Name *</label>
                <input name="name" required value={form.name} onChange={handleChange} style={s.input} placeholder="e.g. WWF India" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Display Order</label>
                <input name="order" type="number" value={form.order} onChange={handleChange} style={s.input} min="0" />
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Logo Image URL (optional — shows text name if blank)</label>
              <input name="logoUrl" value={form.logoUrl} onChange={handleChange} style={s.input} placeholder="https://... (PNG/SVG with transparent background works best)" />
              {form.logoUrl && (
                <div style={s.logoPreview}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.logoUrl} alt="Logo preview" style={{ height: '40px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} onError={e => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
            <div style={s.field}>
              <label style={s.label}>Website URL (optional)</label>
              <input name="websiteUrl" value={form.websiteUrl} onChange={handleChange} style={s.input} placeholder="https://wwfindia.org" />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" name="isVisible" checked={form.isVisible} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: '#D4AF37' }} />
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem' }}>Show in marquee</span>
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" disabled={saving === 'form'} style={{ ...s.saveBtn, opacity: saving === 'form' ? 0.7 : 1 }}>{saving === 'form' ? 'Saving…' : editingItem ? 'Save Changes' : 'Add Partner'}</button>
              <button type="button" onClick={() => setShowForm(false)} style={s.cancelBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p style={s.loadText}>Loading…</p> : items.length === 0 ? (
        <div style={s.emptyState}>
          <p style={{ fontSize: '2rem', marginBottom: '12px' }}>🤝</p>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>No partners added yet. The homepage marquee shows placeholder names until you add real partners.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {items.map((item) => (
            <div key={item._id} style={{ ...s.card, opacity: item.isVisible ? 1 : 0.4 }}>
              <div style={s.logoBox}>
                {item.logoUrl
                  ? /* eslint-disable @next/next/no-img-element */ <img src={item.logoUrl} alt={item.name} style={{ maxHeight: '40px', maxWidth: '120px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} onError={e => e.target.style.display = 'none'} /> /* eslint-enable @next/next/no-img-element */
                  : <span style={s.textLogo}>{item.name}</span>
                }
              </div>
              <p style={s.partnerName}>{item.name}</p>
              {item.websiteUrl && <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer" style={s.link}>{item.websiteUrl.replace('https://', '')}</a>}
              <div style={s.cardActions}>
                <button onClick={() => handleOpenEdit(item)} style={s.editBtn}>✏</button>
                <button onClick={() => handleToggle(item)} disabled={saving === item._id} style={{ ...s.toggleBtn, ...(item.isVisible ? s.toggleV : s.toggleH) }}>
                  {item.isVisible ? '👁' : '🚫'}
                </button>
                {confirmDelete === item._id ? (
                  <div style={CONFIRM_STYLES.inlineConfirm}>
                    <span style={CONFIRM_STYLES.confirmText}>Sure?</span>
                    <button onClick={() => handleDelete(item._id)} disabled={saving === 'del-' + item._id} style={CONFIRM_STYLES.confirmYes}>{saving === 'del-' + item._id ? '…' : 'Yes'}</button>
                    <button onClick={() => setConfirmDelete(null)} style={CONFIRM_STYLES.confirmNo}>No</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(item._id)} style={s.deleteBtn}>🗑</button>
                )}
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
  sub: { color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '1rem' },
  addBtn: { background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0a110a', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 8px 20px rgba(212,175,55,0.2)', whiteSpace: 'nowrap' },
  msg: { borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '500' },
  msgSuccess: { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' },
  msgError: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' },
  formWrap: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '16px', padding: '32px', marginBottom: '32px', backdropFilter: 'blur(10px)' },
  formHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  formTitle: { color: '#D4AF37', fontWeight: '700', fontSize: '1.2rem', margin: 0 },
  closeBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', padding: '6px 12px', cursor: 'pointer', fontSize: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  fieldRow: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' },
  input: { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px 16px', color: '#fff', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  logoPreview: { background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center' },
  saveBtn: { background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0a110a', border: 'none', borderRadius: '10px', padding: '14px 28px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' },
  cancelBtn: { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px 20px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600' },
  emptyState: { textAlign: 'center', padding: '80px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' },
  loadText: { color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontSize: '1.1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
  card: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', textAlign: 'center' },
  logoBox: { height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' },
  textLogo: { color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: '0.9rem' },
  partnerName: { color: '#fff', fontWeight: '600', fontSize: '0.9rem', margin: 0 },
  link: { color: 'rgba(212,175,55,0.7)', fontSize: '0.75rem', textDecoration: 'none' },
  cardActions: { display: 'flex', gap: '8px' },
  editBtn: { padding: '8px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.9rem' },
  toggleBtn: { padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.9rem' },
  toggleV: { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' },
  toggleH: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' },
  deleteBtn: { padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem' },
};
