'use client';
import Link from 'next/link';
import { useReveal } from '@/hooks/useReveal';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  useReveal();

  return (
    <section className={styles.hero}>
      {/* Background Image & Overlay */}
      <div className={styles.bgImage}></div>
      <div className={styles.overlay}></div>
      <div className={styles.texture}></div>

      <div className={`container ${styles.content}`}>
        <div className={`reveal ${styles.labelWrap}`}>
          <span className="label">Satyasaksha Foundation</span>
          <div className={styles.divider}></div>
        </div>

        <h1 className={`heading-hero ${styles.title} reveal reveal-delay-1`}>
          Protecting Nature.<br />
          <span className="italic-accent">Empowering People.</span><br />
          Creating Impact.
        </h1>

        <p className={`${styles.subtitle} reveal reveal-delay-2`}>
          The witness of truth — committed to protecting nature, empowering communities and acting with compassion across every initiative we undertake.
        </p>

        <div className={`${styles.ctas} reveal reveal-delay-3`}>
          <Link href="/donate" className="btn btn--gold btn--lg">
            Donate Now
          </Link>
          <Link href="/our-work" className="btn btn--glass btn--lg">
            Explore Our Work
          </Link>
        </div>
      </div>

      {/* Floating Stats Bar */}
      <div className={`${styles.statsBar} reveal reveal-delay-3`}>
        <div className={styles.stat}>
          <span className={styles.statNum}>10+</span>
          <span className={styles.statLabel}>Focus Areas</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.stat}>
          <span className={styles.statNum}>2026</span>
          <span className={styles.statLabel}>Established</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.stat}>
          <span className={styles.statNum}>∞</span>
          <span className={styles.statLabel}>Compassion</span>
        </div>
      </div>
    </section>
  );
}
