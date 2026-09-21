'use client';
import styles from './EmptyState.module.css';

export default function EmptyState({ icon = '📭', title, description }) {
  return (
    <div className={styles.wrap}>
      <p className={styles.icon}>{icon}</p>
      {title && <p className={styles.title}>{title}</p>}
      {description && <p className={styles.desc}>{description}</p>}
    </div>
  );
}
