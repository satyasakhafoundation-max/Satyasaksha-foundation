'use client';
import { useState, useEffect, useCallback } from 'react';
import { PageHeader, Card, Button, Field, Input, Textarea, ImageUploader, useToast, Skeleton } from '@/components/admin/ui';
import { PAGE_CONTENT_SCHEMA, PAGE_CONTENT_SLUGS } from '@/lib/pageContentSchema';
import styles from './page.module.css';

export default function AdminPageContentPage() {
  const [activeSlug, setActiveSlug] = useState(PAGE_CONTENT_SLUGS[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  const fetchData = useCallback((slug) => {
    setLoading(true);
    fetch(`/api/admin/page-content?slug=${slug}`)
      .then((res) => res.json())
      .then((res) => { setData(res.data); setLoading(false); });
  }, []);

  useEffect(() => { fetchData(activeSlug); }, [activeSlug, fetchData]);

  const set = (key, value) => setData((p) => ({ ...p, [key]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/page-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: activeSlug, data }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Page content saved!');
    } catch (err) {
      showToast(err.message || 'Failed to save.', 'error');
    }
    setSaving(false);
  };

  const page = PAGE_CONTENT_SCHEMA[activeSlug];

  const renderField = (field) => {
    const value = data?.[field.key] ?? '';
    switch (field.type) {
      case 'textarea':
        return <Textarea rows={3} value={value} onChange={(e) => set(field.key, e.target.value)} />;
      case 'richtext':
        return <Textarea rows={10} className={styles.mono} value={value} onChange={(e) => set(field.key, e.target.value)} />;
      case 'image':
        return <ImageUploader folder="about" value={value} onChange={(url) => set(field.key, url)} label="Upload Image" />;
      default:
        return <Input value={value} onChange={(e) => set(field.key, e.target.value)} />;
    }
  };

  return (
    <form onSubmit={handleSave}>
      <PageHeader
        icon="📝"
        title="Page Content"
        subtitle="Edit the hero text, intros, and narrative copy across every page on the site."
        action={<Button type="submit" loading={saving}>Save {page?.label}</Button>}
      />

      <div className={styles.tabs}>
        {PAGE_CONTENT_SLUGS.map((slug) => (
          <button
            key={slug}
            type="button"
            className={`${styles.tab} ${activeSlug === slug ? styles.tabActive : ''}`}
            onClick={() => setActiveSlug(slug)}
          >
            {PAGE_CONTENT_SCHEMA[slug].label}
          </button>
        ))}
      </div>

      {loading || !data ? (
        <Skeleton height="400px" radius="var(--radius-lg)" style={{ display: 'block', width: '100%' }} />
      ) : (
        <div className={styles.sections}>
          {page.sections.map((section) => (
            <Card key={section.title} className={styles.section}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              {section.fields.map((field) => (
                <Field key={field.key} label={field.label}>
                  {renderField(field)}
                </Field>
              ))}
            </Card>
          ))}
        </div>
      )}
    </form>
  );
}
