'use client';
import Link from 'next/link';
import styles from './DonationCta.module.css';

export default function DonationCta() {

  return (
    <section className={styles.section} id="donate-cta">
      <div className={styles.bgImage}></div>
      <div className={styles.overlay}></div>
      
      <div className={`container ${styles.contentWrap}`}>
        <div className={`reveal ${styles.glassPanel}`}>
          <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
            <p className="label" style={{ color: 'var(--gold-light)' }}>Support Our Cause</p>
            <div className="divider-gold"></div>
            <h2 className="heading-xl" style={{ color: 'var(--white)' }}>
              Your Contribution Creates <span className="italic-accent">Lasting Change</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '500px', margin: 'var(--space-4) auto 0' }}>
              Together, we can protect wildlife, restore habitats, and empower communities to thrive in harmony with nature.
            </p>
          </div>

          <div className={styles.presetGrid}>
            <Link href="/donate?amount=500" className={styles.presetBtn}>₹500</Link>
            <Link href="/donate?amount=1000" className={styles.presetBtn}>₹1,000</Link>
            <Link href="/donate?amount=2500" className={styles.presetBtn}>₹2,500</Link>
            <Link href="/donate?amount=5000" className={styles.presetBtn}>₹5,000</Link>
          </div>

          <div className={styles.actionWrap}>
            <Link href="/donate" className="btn btn--gold btn--lg" style={{ width: '100%', maxWidth: '300px' }}>
              Donate Now
            </Link>
          </div>
          
          <p className={styles.note}>All donations are securely processed. Tax exemption details will be provided upon successful contribution.</p>
        </div>
      </div>
    </section>
  );
}
