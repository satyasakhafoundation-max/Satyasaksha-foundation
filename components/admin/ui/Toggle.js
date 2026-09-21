'use client';
import styles from './Toggle.module.css';

export default function Toggle({ active, onLabel = '👁 Visible', offLabel = '🚫 Hidden', onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${styles.toggle} ${active ? styles.on : styles.off}`}
    >
      {disabled ? '…' : active ? onLabel : offLabel}
    </button>
  );
}
