// Server Component — queries PageContent from DB, cached for 60s
import Link from 'next/link';
import { getPageContent } from '@/lib/pageContent';
import styles from './AboutSnippet.module.css';

export const revalidate = 60;

export default async function AboutSnippet() {
  const content = await getPageContent('home');

  return (
    <section className={styles.section} id="about-snippet">
      <div className={styles.grid}>

        {/* Left Side: Image */}
        <div className={styles.imageCol}>
          <div className={styles.imageWrapper}>
            <div className={styles.imageInner} style={{ backgroundImage: `url(${content.aboutImage})` }}></div>
          </div>
          {/* Subtle nature accent overlay */}
          <div className={styles.leafAccent}></div>
        </div>

        {/* Right Side: Content Panel */}
        <div className={styles.contentCol}>
          <div className={styles.contentInner}>
            <div className={`reveal ${styles.headerWrap}`}>
              <span className="label">{content.aboutLabel}</span>
              <div className="divider-gold" style={{ margin: 'var(--space-4) 0', marginLeft: '0' }}></div>
            </div>

            <h2 className={`heading-xl reveal reveal-delay-1 ${styles.heading}`}>
              {content.aboutHeadingLine1} <br/>
              <span className="italic-accent">{content.aboutHeadingLine2}</span>
            </h2>

            <p className={`reveal reveal-delay-2 ${styles.text}`}>
              {content.aboutPara1}
            </p>

            <p className={`reveal reveal-delay-2 ${styles.text}`}>
              {content.aboutPara2}
            </p>

            <div className={`reveal reveal-delay-3 ${styles.action}`}>
              <Link href="/about" className="btn btn--gold">
                {content.aboutButtonLabel}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
