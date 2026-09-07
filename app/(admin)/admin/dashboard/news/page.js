'use client';
import { useState, useEffect } from 'react';

const CATEGORIES = ['Environment', 'Animal Welfare', 'Community', 'Wildlife', 'Foundation', 'Education', 'Other'];

const emptyForm = { title: '', excerpt: '', content: '', category: 'Foundation', imageUrl: '', author: 'Satyasaksha Foundation', isPublished: false };

export default function AdminNewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [msg, setMsg] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchArticles = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/news');
    const data = await res.json();
    setArticles(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3500);
  };

  const handleOpenNew = () => {
    setEditingArticle(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleOpenEdit = (article) => {
    setEditingArticle(article);
    setForm({ title: article.title, excerpt: article.excerpt, content: article.content || '', category: article.category, imageUrl: article.imageUrl || '', author: article.author || '', isPublished: article.isPublished });
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving('form');
    try {
      const method = editingArticle ? 'PUT' : 'POST';
      const body = editingArticle ? { _id: editingArticle._id, ...form } : form;
      const res = await fetch('/api/admin/news', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error);
      showMessage(editingArticle ? 'Article updated!' : 'Article created!');
      setShowForm(false);
      fetchArticles();
    } catch (err) {
      showMessage(err.message || 'Failed to save.', 'error');
    }
    setSaving(null);
  };

  const handleTogglePublish = async (article) => {
    setSaving(article._id);
    try {
      const res = await fetch('/api/admin/news', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: article._id, isPublished: !article.isPublished }) });
      if (!res.ok) throw new Error();
      showMessage(article.isPublished ? 'Article unpublished.' : 'Article published!');
      fetchArticles();
    } catch {
      showMessage('Failed to update.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    setSaving('del-' + id);
    try {
      const res = await fetch(`/api/admin/news?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Delete failed');
      showMessage('Article deleted.');
      setConfirmDelete(null);
      fetchArticles();
    } catch (err) {
      showMessage(err.message || 'Failed to delete.', 'error');
    }
    setSaving(null);
  };

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>📰 News &amp; Blog</h1>
          <p style={s.sub}>Publish and manage news articles. Published articles appear live on the website.</p>
        </div>
        <button style={s.addBtn} onClick={handleOpenNew}>+ New Article</button>
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.type === 'error' ? s.msgError : s.msgSuccess) }}>{msg.text}</div>}

      {/* Article Form Modal */}
      {showForm && (
        <div style={s.formWrap}>
          <div style={s.formHeader}>
            <h3 style={s.formTitle}>{editingArticle ? 'Edit Article' : 'New Article'}</h3>
            <button onClick={() => setShowForm(false)} style={s.closeBtn}>✕</button>
          </div>
          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.fieldRow}>
              <div style={s.field}>
                <label style={s.label}>Title *</label>
                <input name="title" required value={form.title} onChange={handleFormChange} style={s.input} placeholder="e.g. Foundation Plants 50,000 Trees" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Category *</label>
                <select name="category" value={form.category} onChange={handleFormChange} style={s.select}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Excerpt * (shown in cards)</label>
              <textarea name="excerpt" required rows={3} value={form.excerpt} onChange={handleFormChange} style={{ ...s.input, resize: 'vertical' }} placeholder="A short summary of the article (max 400 chars)" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Image URL</label>
              <input name="imageUrl" value={form.imageUrl} onChange={handleFormChange} style={s.input} placeholder="https://... (leave blank for default)" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Author</label>
              <input name="author" value={form.author} onChange={handleFormChange} style={s.input} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Full Content (optional, HTML supported)</label>
              <textarea name="content" rows={6} value={form.content} onChange={handleFormChange} style={{ ...s.input, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem' }} placeholder="<p>Full article content goes here...</p>" />
            </div>
            <div style={s.publishToggleRow}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleFormChange} style={{ width: '18px', height: '18px', accentColor: '#D4AF37' }} />
                <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem' }}>Publish immediately</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" disabled={saving === 'form'} style={{ ...s.saveBtn, opacity: saving === 'form' ? 0.7 : 1 }}>{saving === 'form' ? 'Saving…' : editingArticle ? 'Save Changes' : 'Create Article'}</button>
              <button type="button" onClick={() => setShowForm(false)} style={s.cancelBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Articles List */}
      {loading ? <p style={s.loadText}>Loading articles…</p> : (
        articles.length === 0 ? (
          <div style={s.emptyState}>
            <p style={{ fontSize: '2rem', marginBottom: '12px' }}>📰</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>No articles yet. Click <strong style={{ color: '#D4AF37' }}>+ New Article</strong> to create your first post.</p>
          </div>
        ) : (
          <div style={s.list}>
            {articles.map((article) => (
              <div key={article._id} style={s.articleCard}>
                <div style={s.articleLeft}>
                  {article.imageUrl && (
                    <div style={{ ...s.articleThumb, backgroundImage: `url(${article.imageUrl})` }} />
                  )}
                  <div style={s.articleInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={s.catPill}>{article.category}</span>
                      <span style={{ ...s.statusPill, ...(article.isPublished ? s.published : s.draft) }}>
                        {article.isPublished ? '● Published' : '○ Draft'}
                      </span>
                    </div>
                    <h3 style={s.articleTitle}>{article.title}</h3>
                    <p style={s.articleExcerpt}>{article.excerpt}</p>
                  </div>
                </div>
                <div style={s.articleActions}>
                  <button onClick={() => handleOpenEdit(article)} style={s.editBtn}>✏ Edit</button>
                  <button onClick={() => handleTogglePublish(article)} disabled={saving === article._id} style={{ ...s.toggleBtn, ...(article.isPublished ? s.toggleUnpublish : s.togglePublish) }}>
                    {saving === article._id ? '…' : article.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  {confirmDelete === article._id ? (
                    <div style={s.inlineConfirm}>
                      <span style={s.confirmText}>Sure?</span>
                      <button onClick={() => handleDelete(article._id)} disabled={saving === 'del-' + article._id} style={s.confirmYes}>{saving === 'del-' + article._id ? '…' : 'Yes'}</button>
                      <button onClick={() => setConfirmDelete(null)} style={s.confirmNo}>No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(article._id)} style={s.deleteBtn}>🗑</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
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
  formWrap: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '16px', padding: '32px', marginBottom: '32px', backdropFilter: 'blur(10px)' },
  formHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  formTitle: { color: '#D4AF37', fontWeight: '700', fontSize: '1.3rem', margin: 0 },
  closeBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', padding: '6px 12px', cursor: 'pointer', fontSize: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  fieldRow: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' },
  input: { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px 16px', color: '#fff', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  select: { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px 16px', color: '#fff', fontSize: '0.95rem', outline: 'none', width: '100%', cursor: 'pointer' },
  publishToggleRow: { padding: '16px', background: 'rgba(212,175,55,0.05)', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.1)' },
  saveBtn: { background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0a110a', border: 'none', borderRadius: '10px', padding: '14px 28px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' },
  cancelBtn: { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px 20px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600' },
  emptyState: { textAlign: 'center', padding: '80px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' },
  loadText: { color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontSize: '1.1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  articleCard: { display: 'flex', alignItems: 'center', gap: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '20px 24px', flexWrap: 'wrap', transition: 'all 0.2s' },
  articleLeft: { display: 'flex', gap: '20px', flex: 1, minWidth: '280px', alignItems: 'flex-start' },
  articleThumb: { width: '80px', height: '60px', borderRadius: '10px', backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 },
  articleInfo: { flex: 1 },
  catPill: { fontSize: '0.75rem', fontWeight: '700', color: '#D4AF37', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', padding: '3px 10px', borderRadius: '99px', letterSpacing: '0.5px' },
  statusPill: { fontSize: '0.75rem', fontWeight: '600', padding: '3px 10px', borderRadius: '99px' },
  published: { color: '#34d399', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' },
  draft: { color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' },
  articleTitle: { color: '#fff', fontSize: '1.05rem', fontWeight: '600', margin: '0 0 6px' },
  articleExcerpt: { color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  articleActions: { display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' },
  editBtn: { padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' },
  toggleBtn: { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700', transition: 'all 0.2s' },
  togglePublish: { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' },
  toggleUnpublish: { background: 'rgba(255,180,0,0.1)', color: '#fbbf24', border: '1px solid rgba(255,180,0,0.2)' },
  deleteBtn: { padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem' },
  inlineConfirm: { display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '4px 8px' },
  confirmText: { color: '#f87171', fontSize: '0.8rem', fontWeight: '600' },
  confirmYes: { background: '#ef4444', border: 'none', borderRadius: '6px', color: '#fff', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' },
  confirmNo: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'rgba(255,255,255,0.6)', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' },
};
