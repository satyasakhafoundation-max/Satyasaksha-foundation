'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import styles from './not-found.module.css';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.wrap}>
      <div>
        <p className={styles.code}>Oops</p>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.text}>
          We hit an unexpected error loading this page. Please try again, or head back to the homepage.
        </p>
        <div className={styles.actions}>
          <button onClick={() => reset()} className="btn btn--gold btn--lg">Try Again</button>
          <Link href="/" className="btn btn--glass btn--lg">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
