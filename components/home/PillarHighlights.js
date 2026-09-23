// Server Component — queries Pillar from DB, cached for 60s
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Pillar from '@/models/Pillar';
import styles from './PillarHighlights.module.css';

export const revalidate = 60;

const DEFAULT_PILLARS = [
  {
    id: 'wildlife',
    title: 'Wildlife Conservation',
    image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1600&auto=format&fit=crop',
    description: 'Protecting endangered species and restoring natural habitats is at the heart of our mission. We work tirelessly to mitigate human-wildlife conflict and ensure a thriving ecosystem for all living beings.',
    bullets: ['Habitat Restoration & Anti-Poaching', 'Rescue & Rehabilitation of Injured Animals', 'Community Awareness Programs'],
    ctaLabel: 'Discover More',
    ctaLink: '/news',
  },
  {
    id: 'education',
    title: 'Education for All',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop',
    description: 'Knowledge is the most powerful tool for change. We build schools, provide scholarships, and implement environmental education to empower the next generation of mindful leaders.',
    bullets: ['Free Rural Education Initiatives', 'Green School Infrastructure', 'Vocational Training & Skill Development'],
    ctaLabel: 'Discover More',
    ctaLink: '/news',
  },
];

async function getPillars() {
  try {
    await dbConnect();
    const items = await Pillar.find({ isVisible: true }).sort({ order: 1 }).lean();
    // A successful query with zero results means there's genuinely nothing
    // to show yet — distinct from the DB being unreachable, so it shouldn't
    // fall back to fabricated placeholder pillars as if they were real.
    return items.map((item) => ({ ...item, _id: item._id.toString() }));
  } catch {
    return DEFAULT_PILLARS;
  }
}

export default async function PillarHighlights() {
  const pillars = await getPillars();
  if (pillars.length === 0) return null;

  return (
    <section className="section" id="core-pillars">
      <div className="container">
        {pillars.map((pillar, i) => (
          <div key={pillar._id || pillar.id} className={`${styles.row} ${i % 2 === 1 ? styles.rowReverse : ''}`}>
            <div className={`${styles.imageCol} reveal`}>
              <div className={styles.image} style={{ backgroundImage: `url(${pillar.image})` }}></div>
            </div>
            <div className={`${styles.contentCol} reveal reveal-delay-2`}>
              <p className="label">Core Pillar</p>
              <h2 className="heading-xl">{pillar.title}</h2>
              <div className="divider-gold" style={{ marginLeft: 0 }}></div>
              <p className="text-muted" style={{ marginBottom: 'var(--space-6)', fontSize: '1.1rem' }}>
                {pillar.description}
              </p>
              {pillar.bullets?.length > 0 && (
                <ul className={styles.list}>
                  {pillar.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              )}
              <Link href={pillar.ctaLink} className="btn btn--outline">{pillar.ctaLabel}</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
