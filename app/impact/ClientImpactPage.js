'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

function Counter({ targetValue, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * targetValue));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(targetValue);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [targetValue, duration, hasAnimated]);

  return <span ref={elementRef}>{count.toLocaleString()}</span>;
}

export default function ClientImpactPage({ stats, workHighlights = [], content }) {

  return (
    <div className={styles.pageWrap}>

      {/* Page Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${content.heroImage})` }}></div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className="heading-hero reveal">{content.heroTitle}</h1>
          <p className={`reveal reveal-delay-1 ${styles.heroSub}`}>
            {content.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Main Stats Grid */}
      <section className={`section ${styles.statsSection}`}>
        <div className="container">
          <div className="section-header text-center reveal">
            <p className="label" style={{ color: 'var(--gold-dark)' }}>{content.statsLabel}</p>
            <div className="divider-gold"></div>
            <h2 className="heading-xl">{content.statsHeading}</h2>
          </div>

          <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
              <div key={stat.id || stat._id} className={`reveal reveal-delay-${(i % 4) + 1} ${styles.statCard}`}>
                <div className={styles.icon}>{stat.icon}</div>
                <div className={styles.numberWrap}>
                  {stat.prefix}<Counter targetValue={stat.value} />{stat.suffix}
                </div>
                <p className={styles.label}>{stat.label}</p>
                <div className={styles.statLine}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Work in Pictures */}
      {workHighlights.length > 0 && (
        <section className={`section ${styles.picturesSection}`}>
          <div className="container">
            <div className="section-header text-center reveal">
              <p className="label" style={{ color: 'var(--gold-dark)' }}>In Pictures</p>
              <div className="divider-gold"></div>
              <h2 className="heading-xl">Our Work</h2>
            </div>

            <div className={styles.picturesGrid}>
              {workHighlights.map((item, i) => (
                <div key={item._id || item.id} className={`reveal reveal-delay-${(i % 3) + 1} ${styles.pictureCard}`}>
                  <div className={styles.pictureImage} style={{ backgroundImage: `url(${item.image})` }}></div>
                  <div className={styles.pictureOverlay}>
                    <p className={styles.pictureTitle}>{item.title}</p>
                    {item.description && <p className={styles.pictureDesc}>{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Narrative Section */}
      <section className={`section section-dark ${styles.narrativeSection}`}>
        <div className="container">
          <div className={styles.narrativeGrid}>
            <div className={`reveal ${styles.narrativeContent}`}>
              <h2 className="heading-lg" style={{ color: 'var(--gold-light)', marginBottom: 'var(--space-6)' }}>{content.narrativeHeading}</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
                {content.narrativePara1}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                {content.narrativePara2}
              </p>
              <Link href="/news" className="btn btn--outline" style={{ marginTop: 'var(--space-8)' }}>{content.narrativeButtonLabel}</Link>
            </div>
            <div className={`reveal reveal-delay-2 ${styles.narrativeImageWrap}`}>
              <div className={styles.narrativeImage} style={{ backgroundImage: `url(${content.narrativeImage})` }}></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
