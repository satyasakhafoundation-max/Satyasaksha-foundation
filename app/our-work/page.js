// Server Component — no 'use client'
import Link from 'next/link';
import styles from './page.module.css';
import dbConnect from '@/lib/mongodb';
import FocusArea from '@/models/FocusArea';

export const revalidate = 60;

async function getFocusAreas() {
  try {
    await dbConnect();
    const areas = await FocusArea.find({ isVisible: true })
      .sort({ order: 1 })
      .lean();

    return areas.map(area => ({
      ...area,
      _id: area._id.toString()
    }));
  } catch {
    return (await import('@/data/focus-areas.json')).default;
  }
}

export default async function OurWorkPage() {
  const focusData = await getFocusAreas();

  return (
    <div className={styles.pageWrap}>
      
      {/* Page Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2500&auto=format&fit=crop")' }}></div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className="heading-hero reveal">Our Work</h1>
          <p className={`reveal reveal-delay-1 ${styles.heroSub}`}>
            A comprehensive overview of our nine core domains, working in synergy to create a sustainable and compassionate future.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className={`section ${styles.introSection}`}>
        <div className="container text-center">
          <p className="label reveal">The Blueprint</p>
          <div className="divider-gold reveal"></div>
          <h2 className="heading-lg reveal" style={{ maxWidth: '800px', margin: '0 auto' }}>
            We do not believe in isolated solutions. True transformation requires a <span className="italic-accent">holistic approach</span>.
          </h2>
          <p className="text-muted reveal" style={{ maxWidth: '700px', margin: 'var(--space-6) auto 0', fontSize: '1.1rem' }}>
            From the deep forests to rural classrooms, our initiatives are deeply interconnected. By addressing environment, education, and welfare simultaneously, we ensure that every community we touch becomes self-sustaining and harmonious with nature.
          </p>
        </div>
      </section>

      {/* Domains List */}
      <section className={`section section-dark ${styles.domainsSection}`}>
        <div className="container">
          <div className={styles.domainsGrid}>
            {focusData.map((domain, i) => (
              <div 
                key={domain.id} 
                id={domain.id}
                className={`reveal reveal-delay-${(i % 2) + 1} ${styles.domainCard}`}
              >
                <div className={styles.domainHeader}>
                  <div className={styles.domainIcon} style={{ color: domain.color }}>{domain.icon}</div>
                  <h3 className={styles.domainTitle}>{domain.title}</h3>
                </div>
                <div className={styles.domainContent}>
                  <p className={styles.domainDesc}>{domain.description}</p>
                  
                  {/* Detailed mock content for the page view */}
                  <p className={styles.domainDetail}>
                    Our commitment to {domain.title.toLowerCase()} is driven by active fieldwork, rigorous research, and deep community integration. We collaborate with local authorities and global experts to deploy scalable, high-impact programs that drive real, measurable change.
                  </p>
                  
                  <Link href="/projects" className={styles.domainLink} style={{ color: domain.color }}>
                    View Related Projects <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container text-center">
          <h2 className="heading-xl reveal">Join the Movement</h2>
          <p className="text-muted reveal reveal-delay-1" style={{ maxWidth: '600px', margin: 'var(--space-4) auto var(--space-8)' }}>
            Our work is entirely supported by the kindness of people like you. Be the change you wish to see in the world.
          </p>
          <div className={`reveal reveal-delay-2 ${styles.ctaButtons}`}>
            <Link href="/donate" className="btn btn--gold btn--lg">Donate Now</Link>
            <Link href="/get-involved" className="btn btn--outline btn--lg">Volunteer</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
