'use client';
import { useState, useEffect } from 'react';

export default function AdminHeroImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/hero-images-all');
    const data = await res.json();
    setImages(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'hero');
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
        const { imageUrl } = await res.json();
        await fetch('/api/admin/hero-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl, order: images.length + 1 }),
        });
      }
      showMessage('Image(s) added to the rotation!');
      fetchImages();
    } catch (err) {
      showMessage(err.message || 'Upload failed.', 'error');
    }
    setUploading(false);
  };

  const handleToggle = async (image) => {
    setSaving(image._id);
    try {
      await fetch('/api/admin/hero-images', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...image, isVisible: !image.isVisible }) });
      fetchImages();
    } catch {
      showMessage('Failed to update.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this image from the homepage rotation?')) return;
    try {
      const res = await fetch(`/api/admin/hero-images?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showMessage('Removed.');
      fetchImages();
    } catch {
      showMessage('Failed to remove.', 'error');
    }
  };

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>🌄 Homepage Background</h1>
          <p style={s.sub}>Upload multiple images to have the homepage hero background rotate between them automatically. With one image, it stays static.</p>
        </div>
        <label style={s.addBtn}>
          {uploading ? 'Uploading…' : '+ Add Image(s)'}
          <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" multiple style={{ display: 'none' }} onChange={e => handleUpload(e.target.files)} />
        </label>
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.type === 'error' ? s.msgError : s.msgSuccess) }}>{msg.text}</div>}

      {loading ? <p style={s.loadText}>Loading…</p> : images.length === 0 ? (
        <div style={s.emptyState}>
          <p style={{ fontSize: '2rem', marginBottom: '12px' }}>🌄</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>No custom images yet — the homepage is using its default background. Add images to enable rotation.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {images.map((image) => (
            <div key={image._id} style={{ ...s.card, opacity: image.isVisible ? 1 : 0.5 }}>
              <div style={{ ...s.thumb, backgroundImage: `url(${image.imageUrl})` }} />
              <div style={s.cardActions}>
                <button onClick={() => handleToggle(image)} disabled={saving === image._id} style={{ ...s.toggleBtn, ...(image.isVisible ? s.toggleVisible : s.toggleHidden) }}>
                  {saving === image._id ? '…' : image.isVisible ? '👁 Visible' : '🚫 Hidden'}
                </button>
                <button onClick={() => handleDelete(image._id)} style={s.deleteBtn}>✕</button>
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
  sub: { color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '1rem', fontWeight: '400', maxWidth: '520px' },
  addBtn: { display: 'inline-flex', alignItems: 'center', background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0a110a', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 8px 20px rgba(212,175,55,0.2)', whiteSpace: 'nowrap' },
  msg: { borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '500' },
  msgSuccess: { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' },
  msgError: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' },
  loadText: { color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontSize: '1.1rem' },
  emptyState: { textAlign: 'center', padding: '80px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' },
  card: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', overflow: 'hidden' },
  thumb: { width: '100%', aspectRatio: '16/9', backgroundSize: 'cover', backgroundPosition: 'center' },
  cardActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', gap: '10px' },
  toggleBtn: { flex: 1, padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' },
  toggleVisible: { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' },
  toggleHidden: { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' },
  deleteBtn: { padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem' },
};
