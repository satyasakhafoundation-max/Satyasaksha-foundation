'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  PageHeader, Card, Button, Field, Input, Textarea, Select, Badge,
  ConfirmButton, ImageUploader, Modal, useToast, SkeletonList, EmptyState, SearchInput, Pagination,
} from '@/components/admin/ui';
import styles from './page.module.css';

const CATEGORIES = ['Environment', 'Animal Welfare', 'Community', 'Wildlife', 'Foundation', 'Education', 'Other'];
const emptyForm = { title: '', excerpt: '', content: '', category: 'Foundation', imageUrl: '', images: [], author: 'Satyasaksha Foundation', isPublished: false };
const PAGE_SIZE = 8;

export default function AdminNewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const showToast = useToast();

  const fetchArticles = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/news');
    const data = await res.json();
    setArticles(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((a) => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  }, [articles, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (article) => {
    setEditing(article);
    setForm({ title: article.title, excerpt: article.excerpt, content: article.content || '', category: article.category, imageUrl: article.imageUrl || '', images: article.images || [], author: article.author || '', isPublished: article.isPublished });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving('form');
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { _id: editing._id, ...form } : form;
      const res = await fetch('/api/admin/news', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(editing ? 'Article updated!' : 'Article created!');
      setModalOpen(false);
      fetchArticles();
    } catch (err) {
      showToast(err.message || 'Failed to save.', 'error');
    }
    setSaving(null);
  };

  const handleTogglePublish = async (article) => {
    setSaving(article._id);
    try {
      const res = await fetch('/api/admin/news', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: article._id, isPublished: !article.isPublished }) });
      if (!res.ok) throw new Error();
      showToast(article.isPublished ? 'Article unpublished.' : 'Article published!');
      fetchArticles();
    } catch {
      showToast('Failed to update.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/news?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Delete failed');
      showToast('Article deleted.');
      fetchArticles();
    } catch (err) {
      showToast(err.message || 'Failed to delete.', 'error');
    }
    setSaving(null);
  };

  return (
    <div>
      <PageHeader
        icon="📰"
        title="News & Blog"
        subtitle="Publish and manage news articles. Published articles appear live on the website."
        action={<Button onClick={openNew}>+ New Article</Button>}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Article' : 'New Article'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldRow}>
            <Field label="Title" required>
              <Input required value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Foundation Plants 50,000 Trees" />
            </Field>
            <Field label="Category" required>
              <Select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Excerpt (shown in cards)" required>
            <Textarea required rows={3} maxLength={400} value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} placeholder="A short summary of the article" />
          </Field>
          <Field label="Cover Image">
            <ImageUploader folder="news" value={form.imageUrl} onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))} label="Upload Cover Image" />
          </Field>
          <Field label='Story Images (for the "View Images" gallery on the article)'>
            <ImageUploader folder="news" multiple values={form.images} onChange={(images) => setForm((p) => ({ ...p, images }))} label="Upload Story Images" />
          </Field>
          <Field label="Author">
            <Input value={form.author} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} />
          </Field>
          <Field label="Full Content (optional, HTML supported)">
            <Textarea rows={6} className={styles.mono} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} placeholder="<p>Full article content goes here...</p>" />
          </Field>
          <div className={styles.publishRow}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))} />
              Publish immediately
            </label>
          </div>
          <div className={styles.modalActions}>
            <Button type="submit" loading={saving === 'form'}>{editing ? 'Save Changes' : 'Create Article'}</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <div className={styles.toolbar}>
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search articles…" />
      </div>

      {loading ? <SkeletonList count={4} /> : filtered.length === 0 ? (
        <EmptyState icon="📰" title="No articles found" description={query ? 'Try a different search.' : 'Click + New Article to create your first post.'} />
      ) : (
        <>
          <div className={styles.list}>
            {pageItems.map((article) => (
              <Card key={article._id} className={styles.row}>
                {article.imageUrl && <div className={styles.thumb} style={{ backgroundImage: `url(${article.imageUrl})` }} />}
                <div className={styles.rowBody}>
                  <div className={styles.rowMeta}>
                    <Badge variant="gold">{article.category}</Badge>
                    <Badge variant={article.isPublished ? 'success' : 'neutral'}>{article.isPublished ? '● Published' : '○ Draft'}</Badge>
                  </div>
                  <h3 className={styles.rowTitle}>{article.title}</h3>
                  <p className={styles.rowDesc}>{article.excerpt}</p>
                </div>
                <div className={styles.rowActions}>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(article)}>✏ Edit</Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={saving === article._id}
                    onClick={() => handleTogglePublish(article)}
                  >
                    {article.isPublished ? 'Unpublish' : 'Publish'}
                  </Button>
                  <ConfirmButton onConfirm={() => handleDelete(article._id)} loading={saving === article._id} />
                </div>
              </Card>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
