'use client';
import { useState, useEffect } from 'react';
import { PageHeader, Card, Toggle, ConfirmButton, ImageUploader, ReorderableList, useToast, SkeletonList, EmptyState } from '@/components/admin/ui';
import styles from './page.module.css';

export default function AdminHeroImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const showToast = useToast();

  const fetchImages = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/hero-images-all');
    const data = await res.json();
    setImages(Array.isArray(data) ? data.sort((a, b) => a.order - b.order) : []);
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  // ImageUploader is always given an empty `values` array here (this page has
  // no persistent "staging" array — each finished upload becomes its own
  // HeroImage document immediately). With `multiple`, onChange can carry
  // several newly-uploaded URLs at once, so a HeroImage doc is created for
  // every url, not just the last one.
  const handleNewUpload = async (urls) => {
    try {
      await Promise.all(urls.map((imageUrl, i) =>
        fetch('/api/admin/hero-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl, order: images.length + i + 1 }),
        })
      ));
      showToast(urls.length > 1 ? `${urls.length} images added to the rotation!` : 'Image added to the rotation!');
      fetchImages();
    } catch {
      showToast('Failed to save image.', 'error');
    }
  };

  const handleToggle = async (image) => {
    setSaving(image._id);
    try {
      await fetch('/api/admin/hero-images', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...image, isVisible: !image.isVisible }) });
      fetchImages();
    } catch {
      showToast('Failed to update.', 'error');
    }
    setSaving(null);
  };

  const handleDelete = async (id) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/hero-images?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('Removed.');
      fetchImages();
    } catch {
      showToast('Failed to remove.', 'error');
    }
    setSaving(null);
  };

  const handleReorder = async (reordered) => {
    setImages(reordered);
    await Promise.all(reordered.map((img, i) =>
      fetch('/api/admin/hero-images', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: img._id, order: i + 1 }) })
    ));
    showToast('Order saved.');
  };

  return (
    <div>
      <PageHeader
        icon="🌄"
        title="Homepage Background"
        subtitle="Upload multiple images to have the homepage hero background rotate between them automatically. With one image, it stays static."
      />

      <div className={styles.uploaderWrap}>
        <ImageUploader folder="hero" multiple values={[]} onChange={handleNewUpload} label="Add Background Image(s)" />
      </div>

      {loading ? <SkeletonList count={2} /> : images.length === 0 ? (
        <EmptyState icon="🌄" title="No custom images yet" description="The homepage is using its default background. Add images above to enable rotation." />
      ) : (
        <ReorderableList items={images} onReorder={handleReorder} keyField="_id" renderItem={(image) => (
          <Card dimmed={!image.isVisible} className={styles.row}>
            <div className={styles.thumb} style={{ backgroundImage: `url(${image.imageUrl})` }} />
            <div className={styles.rowActions}>
              <Toggle active={image.isVisible} onClick={() => handleToggle(image)} disabled={saving === image._id} />
              <ConfirmButton onConfirm={() => handleDelete(image._id)} loading={saving === image._id} />
            </div>
          </Card>
        )} />
      )}
    </div>
  );
}
