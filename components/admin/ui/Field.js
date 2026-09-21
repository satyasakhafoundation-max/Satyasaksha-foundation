'use client';
import styles from './Field.module.css';

export default function Field({ label, error, hint, required, children }) {
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label}>
          {label}{required && <span className={styles.required}> *</span>}
        </label>
      )}
      {children}
      {error && <p className={styles.error}>{error}</p>}
      {!error && hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
