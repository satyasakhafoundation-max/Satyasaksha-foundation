'use client';
import styles from './Inputs.module.css';

export default function Textarea({ invalid = false, className = '', rows = 4, ...rest }) {
  return <textarea rows={rows} className={`${styles.input} ${invalid ? styles.invalid : ''} ${className}`} {...rest} />;
}
