'use client';
import { useRef, useState } from 'react';
import { useToast } from './ToastProvider';
import styles from './ImageUploader.module.css';

async function uploadFile(file, folder) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.imageUrl;
}

// Single mode: value (string url) + onChange(url).
// Multi mode: multiple + values (string[]) + onChange(url[]).
export default function ImageUploader({
  folder,
  multiple = false,
  value = '',
  values = [],
  onChange,
  shape = 'square', // 'square' | 'circle'
  label = 'Upload Image',
}) {
  const inputRef = useRef(null);
  const showToast = useToast();
  const [dragging, setDragging] = useState(false);
  // Locally-staged previews while their upload is in flight: { localUrl, uploading }
  const [pending, setPending] = useState([]);

  const items = multiple ? values : value ? [value] : [];

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    if (!multiple) files.splice(1);

    const staged = files.map((file) => ({ localUrl: URL.createObjectURL(file), file, uploading: true }));
    setPending((prev) => [...prev, ...staged]);

    const newlyUploaded = [];
    for (const item of staged) {
      try {
        const imageUrl = await uploadFile(item.file, folder);
        newlyUploaded.push(imageUrl);
      } catch (err) {
        showToast(err.message || 'Image upload failed.', 'error');
      } finally {
        setPending((prev) => prev.filter((p) => p !== item));
        URL.revokeObjectURL(item.localUrl);
      }
    }

    if (newlyUploaded.length > 0) {
      if (multiple) {
        onChange([...values, ...newlyUploaded]);
      } else {
        onChange(newlyUploaded[newlyUploaded.length - 1]);
      }
    }
  };

  const handleRemove = (index) => {
    if (multiple) {
      onChange(values.filter((_, i) => i !== index));
    } else {
      onChange('');
    }
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div>
      <div
        className={`${styles.dropzone} ${dragging ? styles.dragging : ''}`}
        onClick={openPicker}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <span className={styles.dropzoneIcon}>⬆</span>
        <span>{label}</span>
        <span className={styles.dropzoneHint}>Click or drag &amp; drop &mdash; PNG, JPEG, or WebP</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple={multiple}
          style={{ display: 'none' }}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {(items.length > 0 || pending.length > 0) && (
        <div className={styles.grid}>
          {items.map((url, i) => (
            <div key={url} className={`${styles.thumb} ${shape === 'circle' ? styles.circle : ''}`}>
              <img src={url} alt="" />
              <button type="button" className={styles.remove} onClick={() => handleRemove(i)} aria-label="Remove image">✕</button>
            </div>
          ))}
          {pending.map((p, i) => (
            <div key={i} className={`${styles.thumb} ${styles.uploading} ${shape === 'circle' ? styles.circle : ''}`}>
              <img src={p.localUrl} alt="" />
              <div className={styles.spinner} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
