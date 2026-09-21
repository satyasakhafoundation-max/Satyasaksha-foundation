'use client';
import styles from './Button.module.css';

const VARIANTS = {
  gold: styles.gold,
  outline: styles.outline,
  ghost: styles.ghost,
  danger: styles.danger,
};

export default function Button({
  variant = 'gold',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${styles.btn} ${VARIANTS[variant] || VARIANTS.gold} ${size === 'sm' ? styles.sm : ''} ${className}`}
      {...rest}
    >
      {loading ? '…' : children}
    </button>
  );
}
