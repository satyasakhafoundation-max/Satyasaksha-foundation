'use client';
import styles from './Inputs.module.css';

export default function Input({ invalid = false, className = '', ...rest }) {
  return <input className={`${styles.input} ${invalid ? styles.invalid : ''} ${className}`} {...rest} />;
}
