'use client';
import styles from './SearchInput.module.css';

export default function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon}>🔍</span>
      <input
        type="search"
        className={styles.input}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
