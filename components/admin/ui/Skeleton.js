'use client';
import styles from './Skeleton.module.css';

export function Skeleton({ width, height = '1em', radius, className = '', style = {} }) {
  return (
    <span
      className={`${styles.shimmer} ${className}`}
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

// A row of card-shaped skeletons matching the CRUD list-item layout used
// across the admin (image thumb + a couple of text lines + action buttons).
export function SkeletonList({ count = 3 }) {
  return (
    <div className={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.row}>
          <Skeleton width="64px" height="64px" radius="var(--radius-md)" />
          <div className={styles.lines}>
            <Skeleton width="40%" height="1.1rem" />
            <Skeleton width="70%" height="0.85rem" />
          </div>
        </div>
      ))}
    </div>
  );
}
