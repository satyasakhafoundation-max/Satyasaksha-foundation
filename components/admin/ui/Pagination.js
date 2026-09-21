'use client';
import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.navBtn}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ← Prev
      </button>
      <span className={styles.status}>Page {page} of {totalPages}</span>
      <button
        type="button"
        className={styles.navBtn}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}
