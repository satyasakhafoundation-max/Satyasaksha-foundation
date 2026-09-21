'use client';
import Link from 'next/link';
import styles from './PillarHighlights.module.css';

export default function PillarHighlights() {

  return (
    <section className="section" id="core-pillars">
      <div className="container">
        
        {/* Pillar 1: Wildlife */}
        <div className={styles.row}>
          <div className={`${styles.imageCol} reveal`}>
            <div 
              className={styles.image} 
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1600&auto=format&fit=crop")' }}
            ></div>
          </div>
          <div className={`${styles.contentCol} reveal reveal-delay-2`}>
            <p className="label">Core Pillar</p>
            <h2 className="heading-xl">Wildlife Conservation</h2>
            <div className="divider-gold" style={{ marginLeft: 0 }}></div>
            <p className="text-muted" style={{ marginBottom: 'var(--space-6)', fontSize: '1.1rem' }}>
              Protecting endangered species and restoring natural habitats is at the heart of our mission. We work tirelessly to mitigate human-wildlife conflict and ensure a thriving ecosystem for all living beings.
            </p>
            <ul className={styles.list}>
              <li>Habitat Restoration & Anti-Poaching</li>
              <li>Rescue & Rehabilitation of Injured Animals</li>
              <li>Community Awareness Programs</li>
            </ul>
            <Link href="/news" className="btn btn--outline">Discover More</Link>
          </div>
        </div>

        {/* Pillar 2: Education (Reversed) */}
        <div className={`${styles.row} ${styles.rowReverse}`}>
          <div className={`${styles.imageCol} reveal`}>
            <div 
              className={styles.image} 
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop")' }}
            ></div>
          </div>
          <div className={`${styles.contentCol} reveal reveal-delay-2`}>
            <p className="label">Core Pillar</p>
            <h2 className="heading-xl">Education for All</h2>
            <div className="divider-gold" style={{ marginLeft: 0 }}></div>
            <p className="text-muted" style={{ marginBottom: 'var(--space-6)', fontSize: '1.1rem' }}>
              Knowledge is the most powerful tool for change. We build schools, provide scholarships, and implement environmental education to empower the next generation of mindful leaders.
            </p>
            <ul className={styles.list}>
              <li>Free Rural Education Initiatives</li>
              <li>Green School Infrastructure</li>
              <li>Vocational Training & Skill Development</li>
            </ul>
            <Link href="/news" className="btn btn--outline">Discover More</Link>
          </div>
        </div>

      </div>
    </section>
  );
}
