'use client';
import styles from './Badge.module.css';

const VARIANTS = {
  gold: styles.gold,
  success: styles.success,
  error: styles.error,
  warning: styles.warning,
  neutral: styles.neutral,
};

export default function Badge({ variant = 'neutral', children }) {
  return <span className={`${styles.badge} ${VARIANTS[variant] || VARIANTS.neutral}`}>{children}</span>;
}
