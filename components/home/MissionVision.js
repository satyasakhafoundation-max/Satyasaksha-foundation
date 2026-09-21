'use client';
import styles from './MissionVision.module.css';

export default function MissionVision() {

  return (
    <section className={`section ${styles.section}`} id="mission-vision">
      <div className="container">
        
        {/* Central Quote Panel */}
        <div className={`reveal ${styles.quotePanel}`}>
          <div className={styles.quoteMark}>&quot;</div>
          <h2 className={`heading-lg ${styles.quoteText}`}>
            The witness of truth — committed to protecting nature, empowering communities and acting with compassion.
          </h2>
          <div className="divider-gold"></div>
          <p className="label">Satyasaksha Foundation</p>
        </div>

        {/* Vision & Mission Cards */}
        <div className={styles.cardsGrid}>
          <div className={`reveal reveal-delay-1 ${styles.card}`}>
            <div className={styles.cardIcon}>🌱</div>
            <p className="label">Our Vision</p>
            <h3 className={`heading-md ${styles.cardTitle}`}>
              A Thriving World for All Living Beings
            </h3>
            <p className="text-muted">
              A world where nature thrives, every community flourishes, and truth guides purposeful action — a future built on compassion, knowledge and collective harmony.
            </p>
          </div>

          <div className={`reveal reveal-delay-2 ${styles.card}`}>
            <div className={styles.cardIcon}>🎯</div>
            <p className="label">Our Mission</p>
            <h3 className={`heading-md ${styles.cardTitle}`}>
              Protect. Empower. Act With Truth.
            </h3>
            <p className="text-muted">
              To protect wildlife, conserve natural environments, empower communities through education and skill development, and uphold animal welfare through honest, impactful action.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
