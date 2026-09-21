'use client';
import styles from './Card.module.css';

export default function Card({ dimmed = false, className = '', children, ...rest }) {
  return (
    <div className={`${styles.card} ${dimmed ? styles.dimmed : ''} ${className}`} {...rest}>
      {children}
    </div>
  );
}
