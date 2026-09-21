'use client';
import styles from './PageHeader.module.css';

export default function PageHeader({ icon, title, subtitle, action }) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{icon ? `${icon} ` : ''}{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
