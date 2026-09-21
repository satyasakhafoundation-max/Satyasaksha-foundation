'use client';
import { useState } from 'react';
import styles from './ConfirmButton.module.css';

// Replaces both the browser window.confirm() and the hand-rolled inline
// "Sure? Yes/No" widget that were duplicated across the admin — one pattern.
export default function ConfirmButton({ onConfirm, label = '🗑', confirmLabel = 'Sure?', loading = false }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className={styles.confirmWrap}>
        <span className={styles.confirmText}>{confirmLabel}</span>
        <button
          type="button"
          className={styles.yes}
          disabled={loading}
          onClick={() => onConfirm()}
        >
          {loading ? '…' : 'Yes'}
        </button>
        <button type="button" className={styles.no} onClick={() => setConfirming(false)}>
          No
        </button>
      </div>
    );
  }

  return (
    <button type="button" className={styles.trigger} onClick={() => setConfirming(true)}>
      {label}
    </button>
  );
}
