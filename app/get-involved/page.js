'use client';
import Link from 'next/link';
import styles from './page.module.css';

export default function GetInvolvedPage() {

  return (
    <div className={styles.pageWrap}>
      
      {/* Page Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1593113544331-591dc45e8568?q=80&w=2500&auto=format&fit=crop")' }}></div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className="heading-hero reveal">Get Involved</h1>
          <p className={`reveal reveal-delay-1 ${styles.heroSub}`}>
            It takes a collective effort to create lasting change. Join us in our mission to protect nature and empower communities.
          </p>
        </div>
      </section>

      {/* Avenues Grid */}
      <section className={`section ${styles.avenuesSection}`}>
        <div className={`container ${styles.grid}`}>
          
          {/* Volunteer */}
          <div id="volunteer" className={`reveal ${styles.card}`}>
            <div className={styles.cardHeader}>
              <div className={styles.icon}>🤝</div>
              <h2 className="heading-md">Volunteer</h2>
            </div>
            <p className={styles.desc}>
              Offer your time, skills, and energy to our on-ground campaigns. We need passionate individuals for everything from tree plantation drives to teaching rural students.
            </p>
            <ul className={styles.list}>
              <li>Field work and ground operations</li>
              <li>Awareness campaigns</li>
              <li>Administrative & digital support</li>
            </ul>
            <Link href="/contact?subject=volunteer" className="btn btn--outline" style={{ marginTop: 'auto' }}>Apply to Volunteer</Link>
          </div>

          {/* Partner */}
          <div id="partner" className={`reveal reveal-delay-1 ${styles.card}`}>
            <div className={styles.cardHeader}>
              <div className={styles.icon}>🏢</div>
              <h2 className="heading-md">Partner With Us</h2>
            </div>
            <p className={styles.desc}>
              We welcome corporate social responsibility (CSR) initiatives, NGOs, and government bodies to collaborate with us for large-scale, sustainable impact.
            </p>
            <ul className={styles.list}>
              <li>Corporate funding & CSR matching</li>
              <li>Joint conservation projects</li>
              <li>Resource and knowledge sharing</li>
            </ul>
            <Link href="/contact?subject=partner" className="btn btn--outline" style={{ marginTop: 'auto' }}>Discuss Partnership</Link>
          </div>

          {/* Sponsor */}
          <div className={`reveal reveal-delay-2 ${styles.card}`}>
            <div className={styles.cardHeader}>
              <div className={styles.icon}>🌱</div>
              <h2 className="heading-md">Support a Conservation Project</h2>
            </div>
            <p className={styles.desc}>
              Support a specific initiative and help us create measurable impact in wildlife conservation, biodiversity, environmental education, citizen science, habitat restoration, and community-based conservation.
            </p>
            <ul className={styles.list}>
              <li>Direct, targeted financial impact</li>
              <li>Regular progress and audit reports</li>
              <li>Naming rights for major infrastructure</li>
            </ul>
            <Link href="/news" className="btn btn--outline" style={{ marginTop: 'auto' }}>Read About Our Initiatives</Link>
          </div>

        </div>
      </section>

      {/* Become a Member CTA */}
      <section className={`section section-dark ${styles.memberSection}`}>
        <div className={`container ${styles.memberContainer}`}>
          <div className={`reveal ${styles.memberContent}`}>
            <h2 className="heading-lg" style={{ color: 'var(--gold-light)', marginBottom: 'var(--space-4)' }}>Become a Foundation Member</h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: 'var(--space-6)', maxWidth: '600px' }}>
              Join an exclusive network of deeply committed supporters. Members receive quarterly physical reports, invitations to closed-door strategy meetings, and VIP access to our annual gala.
            </p>
            <Link href="/contact?subject=membership" className="btn btn--gold btn--lg">Inquire About Membership</Link>
          </div>
          <div className={`reveal reveal-delay-2 ${styles.memberImage}`} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=1200&auto=format&fit=crop")' }}></div>
        </div>
      </section>

    </div>
  );
}
