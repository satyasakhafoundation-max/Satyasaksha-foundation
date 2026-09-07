'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const CATEGORIES = ['All', 'Wildlife', 'Community', 'Events', 'Environment', 'Other'];

export default function AdminGalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('All');
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);

  const fetchImages = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/gallery-all');
    const data = await res.json();
    setImages(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !caption.trim()) return;
    setUploading(true);

    try {
      // Step 1: Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/admin/gallery/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const { imageUrl, thumbnailUrl, publicId } = await uploadRes.json();

      // Step 2: Save metadata to MongoDB
      const saveRes = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, thumbnailUrl, publicId, caption, category }),
      });
      if (!saveRes.ok) throw new Error('Failed to save');

      showMessage('Image uploaded successfully!');
      setFile(null);
      setPreview(null);
      setCaption('');
      setCategory('All');
      if (fileRef.current) fileRef.current.value = '';
      fetchImages();
    } catch (err) {
      showMessage(err.message || 'Upload failed.', 'error');
    }
    setUploading(false);
  };

  const handleToggle = async (img) => {
    try {
      await fetch('/api/admin/gallery', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: img._id, isVisible: !img.isVisible }) });
      fetchImages();
    } catch {
      showMessage('Failed to toggle visibility.', 'error');
    }
  };

  const handleDelete = async (img) => {
    if (!confirm(`Delete "${img.caption}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${img._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showMessage('Image deleted.');
      fetchImages();
    } catch {
      showMessage('Failed to delete.', 'error');
    }
  };

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>🖼️ Gallery</h1>
          <p style={s.sub}>Upload new images to Cloudinary and manage existing gallery content.</p>
        </div>
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.type === 'error' ? s.msgError : s.msgSuccess) }}>{msg.text}</div>}

      {/* Upload Form */}
      <form onSubmit={handleUpload} style={s.uploadForm}>
        <h3 style={s.formTitle}>Upload New Image</h3>
        <div style={s.uploadArea}>
          <div
            style={s.dropZone}
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <div style={s.previewWrap}>
                <Image src={preview} alt="Preview" fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
            ) : (
              <div style={s.dropContent}>
                <span style={s.dropIcon}>📷</span>
                <p style={s.dropText}>Click to select an image</p>
                <p style={s.dropSub}>JPG, PNG, WebP · Max 10MB</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

          <div style={s.uploadFields}>
            <div style={s.field}>
              <label style={s.label}>Caption *</label>
              <input
                required
                placeholder="e.g. Tree Plantation Drive 2026"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                style={s.input}
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={s.select}>
                {CATEGORIES.map(c => <option key={c} value={c} style={s.option}>{c}</option>)}
              </select>
            </div>
            <button type="submit" disabled={!file || uploading} style={{ ...s.uploadBtn, opacity: (!file || uploading) ? 0.6 : 1 }}>
              {uploading ? '⏳ Uploading to Cloudinary…' : '⬆ Upload Image'}
            </button>
          </div>
        </div>
      </form>

      {/* Existing Images */}
      <h3 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: '600', margin: '32px 0 16px' }}>
        Existing Images ({images.length})
      </h3>

      {loading ? <p style={s.loadText}>Loading…</p> : (
        <div style={s.grid}>
          {images.map((img) => (
            <div key={img._id} style={{ ...s.card, opacity: img.isVisible ? 1 : 0.5 }}>
              <div style={s.imgWrap}>
                <Image
                  src={img.thumbnailUrl || img.imageUrl}
                  alt={img.caption || 'Image'}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {!img.isVisible && <div style={s.hiddenBadge}>Hidden</div>}
              </div>
              <div style={s.cardInfo}>
                <p style={s.captionText}>{img.caption}</p>
                <span style={s.catBadge}>{img.category}</span>
              </div>
              <div style={s.cardActions}>
                <button onClick={() => handleToggle(img)} style={{ ...s.toggleBtn, ...(img.isVisible ? s.toggleV : s.toggleH) }}>
                  {img.isVisible ? '👁 Visible' : '🚫 Hidden'}
                </button>
                <button onClick={() => handleDelete(img)} style={s.deleteBtn}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  header: { marginBottom: '32px' },
  title: { color: '#fff', fontSize: '2rem', fontWeight: '700', margin: '0 0 8px', letterSpacing: '-0.5px' },
  sub: { color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '1rem' },
  msg: { borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '500', backdropFilter: 'blur(10px)' },
  msgSuccess: { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' },
  msgError: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' },
  uploadForm: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '16px', padding: '32px', marginBottom: '32px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  formTitle: { color: '#D4AF37', fontWeight: '600', margin: '0 0 24px', fontSize: '1.2rem', letterSpacing: '-0.3px' },
  uploadArea: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  dropZone: { width: '260px', minHeight: '180px', border: '2px dashed rgba(212,175,55,0.4)', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, transition: 'all 0.3s', background: 'rgba(212,175,55,0.02)' },
  previewWrap: { width: '100%', height: '100%', position: 'relative' },
  dropContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '24px' },
  dropIcon: { fontSize: '2.5rem' },
  dropText: { color: '#fff', fontSize: '0.95rem', margin: 0, textAlign: 'center', fontWeight: '500' },
  dropSub: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: 0 },
  uploadFields: { flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' },
  input: { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px 16px', color: '#fff', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s' },
  select: { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px 16px', color: '#fff', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box', cursor: 'pointer', appearance: 'none' },
  option: { background: '#0a110a', color: '#fff' },
  uploadBtn: { background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0a110a', border: 'none', borderRadius: '10px', padding: '14px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', marginTop: 'auto', boxShadow: '0 8px 20px rgba(212,175,55,0.2)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' },
  card: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  imgWrap: { position: 'relative', height: '180px' },
  hiddenBadge: { position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.8)', color: '#f87171', fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', backdropFilter: 'blur(4px)' },
  cardInfo: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' },
  captionText: { color: '#fff', fontSize: '0.9rem', fontWeight: '600', margin: 0, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  catBadge: { background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', fontSize: '0.7rem', padding: '4px 10px', borderRadius: '6px', whiteSpace: 'nowrap', fontWeight: '600' },
  cardActions: { display: 'flex', gap: '8px', padding: '0 16px 16px' },
  toggleBtn: { flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', transition: 'all 0.2s' },
  toggleV: { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' },
  toggleH: { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' },
  deleteBtn: { padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s', fontWeight: '600' },
  loadText: { color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontSize: '1.1rem' },
};
