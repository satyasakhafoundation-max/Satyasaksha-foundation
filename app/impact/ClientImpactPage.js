'use client';
import { useState, useEffect, useRef } from 'react';
import { useReveal } from '@/hooks/useReveal';
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

export default function ClientImpactPage({ stats }) {
  useReveal();

  return (
    <div className={styles.pageWrap}>
      
      {/* Page Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2500&auto=format&fit=crop")' }}></div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className="heading-hero reveal">Our Impact</h1>
          <p className={`reveal reveal-delay-1 ${styles.heroSub}`}>
            Transparency and measurable outcomes. See how your support translates into real-world change.
          </p>
        </div>
      </section>

      {/* Main Stats Grid */}
      <section className={`section ${styles.statsSection}`}>
        <div className="container">
          <div className="section-header text-center reveal">
            <p className="label" style={{ color: 'var(--gold-dark)' }}>By The Numbers</p>
            <div className="divider-gold"></div>
            <h2 className="heading-xl">Cumulative Impact (2025-2026)</h2>
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

      {/* Narrative Section */}
      <section className={`section section-dark ${styles.narrativeSection}`}>
        <div className="container">
          <div className={styles.narrativeGrid}>
            <div className={`reveal ${styles.narrativeContent}`}>
              <h2 className="heading-lg" style={{ color: 'var(--gold-light)', marginBottom: 'var(--space-6)' }}>Beyond the Numbers</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
                While statistics provide a measurable snapshot of our work, the true impact is found in the stories of the lives we&apos;ve touched. It&apos;s in the eyes of a rescued elephant returning to the wild, the smile of a child holding their first textbook, and the pride of a farmer who now sustains their family with dignity.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                We are committed to rigorous monitoring and evaluation, ensuring that every rupee donated is maximized for ecological and social return on investment.
              </p>
              <Link href="/news" className="btn btn--outline" style={{ marginTop: 'var(--space-8)' }}>Read Impact Stories</Link>
            </div>
            <div className={`reveal reveal-delay-2 ${styles.narrativeImageWrap}`}>
              <div className={styles.narrativeImage} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop")' }}></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
