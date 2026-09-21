import Link from 'next/link';
import styles from './not-found.module.css';

export const metadata = {
  title: 'Page Not Found | Satyasaksha Foundation',
};

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <div>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>This page has wandered off</h1>
        <p className={styles.text}>
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on the trail.
        </p>
        <div className={styles.actions}>
          <Link href="/" className="btn btn--gold btn--lg">Back to Home</Link>
          <Link href="/contact" className="btn btn--glass btn--lg">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
