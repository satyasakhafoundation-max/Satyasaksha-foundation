'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './HeroSection.module.css';

export default function ClientHeroSection({ images, content }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className={styles.hero}>
      {/* Background Image & Overlay */}
      {images.map((src, i) => (
        <div
          key={src + i}
          className={`${styles.bgImage} ${i === activeIndex ? styles.bgImageActive : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        ></div>
      ))}
      <div className={styles.overlay}></div>
      <div className={styles.texture}></div>

      <div className={`container ${styles.content}`}>
        <div className={`reveal ${styles.labelWrap}`}>
          <span className="label">{content.heroLabel}</span>
          <div className={styles.divider}></div>
        </div>

        <h1 className={`heading-hero ${styles.title} reveal reveal-delay-1`}>
          {content.heroTitleLine1}<br />
          <span className="italic-accent">{content.heroTitleLine2}</span><br />
          {content.heroTitleLine3}
        </h1>

        <p className={`${styles.subtitle} reveal reveal-delay-2`}>
          {content.heroSubtitle}
        </p>

        <div className={`${styles.ctas} reveal reveal-delay-3`}>
          <Link href="/donate" className="btn btn--gold btn--lg">
            {content.heroCta1Label}
          </Link>
          <Link href="/news" className="btn btn--glass btn--lg">
            {content.heroCta2Label}
          </Link>
        </div>
      </div>

      {/* Floating Stats Bar */}
      <div className={`${styles.statsBar} reveal reveal-delay-3`}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{content.stat1Number}</span>
          <span className={styles.statLabel}>{content.stat1Label}</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{content.stat2Number}</span>
          <span className={styles.statLabel}>{content.stat2Label}</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{content.stat3Number}</span>
          <span className={styles.statLabel}>{content.stat3Label}</span>
        </div>
      </div>
    </section>
  );
}
