'use client';
import Link from 'next/link';
import styles from './AboutSnippet.module.css';

export default function AboutSnippet() {

  return (
    <section className={styles.section} id="about-snippet">
      <div className={styles.grid}>
        
        {/* Left Side: Image */}
        <div className={styles.imageCol}>
          <div className={styles.imageWrapper}>
            <div className={styles.imageInner}></div>
          </div>
          {/* Subtle nature accent overlay */}
          <div className={styles.leafAccent}></div>
        </div>

        {/* Right Side: Content Panel */}
        <div className={styles.contentCol}>
          <div className={styles.contentInner}>
            <div className={`reveal ${styles.headerWrap}`}>
              <span className="label">Who We Are</span>
              <div className="divider-gold" style={{ margin: 'var(--space-4) 0', marginLeft: '0' }}></div>
            </div>
            
            <h2 className={`heading-xl reveal reveal-delay-1 ${styles.heading}`}>
              A Foundation Built on <br/>
              <span className="italic-accent">Truth and Compassion</span>
            </h2>

            <p className={`reveal reveal-delay-2 ${styles.text}`}>
              Satyasaksha Foundation — <em>the witness of truth</em> — is a non-profit organisation dedicated to protecting nature, supporting communities and empowering lives. Our name reflects our commitment to honest, transparent and accountable action across every initiative we undertake.
            </p>

            <p className={`reveal reveal-delay-2 ${styles.text}`}>
              Inspired by the elephant&apos;s wisdom, the owl&apos;s discernment and the tree&apos;s rootedness, we work across wildlife conservation, environmental sustainability, education, animal welfare and community development.
            </p>

            <div className={`reveal reveal-delay-3 ${styles.action}`}>
              <Link href="/about" className="btn btn--gold">
                Learn Our Story
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
