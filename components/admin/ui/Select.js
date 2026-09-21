'use client';
import styles from './Inputs.module.css';

export default function Select({ invalid = false, className = '', children, ...rest }) {
  return (
    <select className={`${styles.input} ${invalid ? styles.invalid : ''} ${className}`} {...rest}>
      {children}
    </select>
  );
}
