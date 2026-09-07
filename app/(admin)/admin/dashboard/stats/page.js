'use client';
import { useState, useEffect } from 'react';

export default function AdminStatsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [msg, setMsg] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newStat, setNewStat] = useState({ id: '', label: '', value: 0, prefix: '', suffix: '', icon: '' });

  const fetchStats = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleUpdate = async (stat) => {
    setSaving(stat._id);
    try {
      const res = await fetch('/api/admin/stats', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(stat) });
      if (!res.ok) throw new Error();
      showMessage('Stat updated successfully!');
      fetchStats();
    } catch {
      showMessage('Failed to update stat.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;
    try {
      const res = await fetch(`/api/admin/stats?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showMessage('Stat deleted.');
      fetchStats();
    } catch {
      showMessage('Failed to delete stat.', 'error');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newStat, value: Number(newStat.value), order: stats.length + 1 };
      const res = await fetch('/api/admin/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).error);
      showMessage('Stat added successfully!');
      setShowAdd(false);
      setNewStat({ id: '', label: '', value: 0, prefix: '', suffix: '', icon: '' });
      fetchStats();
    } catch (err) {
      showMessage(err.message || 'Failed to add stat.', 'error');
    }
  };

  const updateLocal = (index, field, value) => {
    setStats((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: field === 'value' ? Number(value) : value };
      return copy;
    });
  };

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>📈 Impact Stats</h1>
          <p style={s.sub}>These numbers appear on the homepage and impact page. Edit and save individually.</p>
        </div>
        <button style={s.addBtn} onClick={() => setShowAdd(!showAdd)}>+ Add Stat</button>
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.type === 'error' ? s.msgError : s.msgSuccess) }}>{msg.text}</div>}

      {/* Add New Stat Form */}
      {showAdd && (
        <form onSubmit={handleAdd} style={s.addForm}>
          <h3 style={s.addTitle}>New Stat</h3>
          <div style={s.formRow}>
            {[['id', 'ID (e.g. volunteers)'], ['icon', 'Icon (emoji)'], ['label', 'Label'], ['prefix', 'Prefix'], ['suffix', 'Suffix']].map(([key, placeholder]) => (
              <input key={key} placeholder={placeholder} value={newStat[key]} required={['id','label','icon'].includes(key)}
                onChange={e => setNewStat(p => ({ ...p, [key]: e.target.value }))} style={s.input} />
            ))}
            <input type="number" placeholder="Value" value={newStat.value} required
              onChange={e => setNewStat(p => ({ ...p, value: e.target.value }))} style={s.input} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={s.saveBtn}>Add Stat</button>
            <button type="button" onClick={() => setShowAdd(false)} style={s.cancelBtn}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={s.loadText}>Loading stats…</p>
      ) : (
        <div style={s.grid}>
          {stats.map((stat, i) => (
            <div key={stat._id} style={s.card}>
              <div style={s.cardTop}>
                <span style={s.icon}>{stat.icon}</span>
                <button onClick={() => handleDelete(stat._id)} style={s.deleteBtn} title="Delete">✕</button>
              </div>
              <div style={s.row}>
                <label style={s.label}>Label</label>
                <input style={s.input} value={stat.label} onChange={e => updateLocal(i, 'label', e.target.value)} />
              </div>
              <div style={s.row}>
                <label style={s.label}>Value</label>
                <input style={s.input} type="number" value={stat.value} onChange={e => updateLocal(i, 'value', e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ ...s.row, flex: 1 }}>
                  <label style={s.label}>Prefix</label>
                  <input style={s.input} value={stat.prefix} placeholder="e.g. $" onChange={e => updateLocal(i, 'prefix', e.target.value)} />
                </div>
                <div style={{ ...s.row, flex: 1 }}>
                  <label style={s.label}>Suffix</label>
                  <input style={s.input} value={stat.suffix} placeholder="e.g. +" onChange={e => updateLocal(i, 'suffix', e.target.value)} />
                </div>
              </div>
              <div style={s.row}>
                <label style={s.label}>Icon (emoji)</label>
                <input style={s.input} value={stat.icon} onChange={e => updateLocal(i, 'icon', e.target.value)} />
              </div>
              <button
                onClick={() => handleUpdate(stat)}
                disabled={saving === stat._id}
                style={{ ...s.saveBtn, opacity: saving === stat._id ? 0.6 : 1 }}
              >
                {saving === stat._id ? 'Saving…' : 'Save Changes'}
              </button>
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
  addBtn: { background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0a110a', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 8px 20px rgba(212,175,55,0.2)', transition: 'transform 0.2s' },
  msg: { borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '500', backdropFilter: 'blur(10px)' },
  msgSuccess: { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' },
  msgError: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' },
  addForm: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '16px', padding: '32px', marginBottom: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' },
  addTitle: { color: '#D4AF37', fontWeight: '600', margin: '0 0 20px', fontSize: '1.2rem', letterSpacing: '-0.3px' },
  formRow: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' },
  card: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  icon: { fontSize: '2.5rem', background: 'rgba(255,255,255,0.05)', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' },
  deleteBtn: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'background 0.2s' },
  row: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' },
  input: { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s' },
  saveBtn: { background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0a110a', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', marginTop: '12px', transition: 'opacity 0.2s' },
  cancelBtn: { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 20px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600' },
  loadText: { color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontSize: '1.1rem' },
};
