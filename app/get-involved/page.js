// Server Component — queries InvolvementOption from DB, cached for 60s
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import InvolvementOption from '@/models/InvolvementOption';
import { getPageContent } from '@/lib/pageContent';
import styles from './page.module.css';

export const revalidate = 60;

export const metadata = {
  title: 'Get Involved | Satyasaksha Foundation',
  description: 'It takes a collective effort to create lasting change. Join us in our mission to protect nature and empower communities.',
};

const isImageIcon = (icon) => typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('data:image'));

const DEFAULT_OPTIONS = [
  {
    id: 'volunteer', anchorId: 'volunteer', icon: '🤝', title: 'Volunteer',
    description: 'Offer your time, skills, and energy to our on-ground campaigns. We need passionate individuals for everything from tree plantation drives to teaching rural students.',
    bullets: ['Field work and ground operations', 'Awareness campaigns', 'Administrative & digital support'],
    ctaLabel: 'Apply to Volunteer', ctaLink: '/contact?subject=volunteer',
  },
  {
    id: 'partner', anchorId: 'partner', icon: '🏢', title: 'Partner With Us',
    description: 'We welcome corporate social responsibility (CSR) initiatives, NGOs, and government bodies to collaborate with us for large-scale, sustainable impact.',
    bullets: ['Corporate funding & CSR matching', 'Joint conservation projects', 'Resource and knowledge sharing'],
    ctaLabel: 'Discuss Partnership', ctaLink: '/contact?subject=partner',
  },
  {
    id: 'sponsor', anchorId: '', icon: '🌱', title: 'Support a Conservation Project',
    description: 'Support a specific initiative and help us create measurable impact in wildlife conservation, biodiversity, environmental education, citizen science, habitat restoration, and community-based conservation.',
    bullets: ['Direct, targeted financial impact', 'Regular progress and audit reports', 'Naming rights for major infrastructure'],
    ctaLabel: 'Read About Our Initiatives', ctaLink: '/news',
  },
];

async function getOptions() {
  try {
    await dbConnect();
    const items = await InvolvementOption.find({ isVisible: true }).sort({ order: 1 }).lean();
    if (items.length > 0) {
      return items.map((item) => ({ ...item, _id: item._id.toString() }));
    }
    return DEFAULT_OPTIONS;
  } catch {
    return DEFAULT_OPTIONS;
  }
}

export default async function GetInvolvedPage() {
  const [options, content] = await Promise.all([getOptions(), getPageContent('getInvolved')]);

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

      {/* Avenues Grid */}
      <section className={`section ${styles.avenuesSection}`}>
        <div className={`container ${styles.grid}`}>
          {options.map((option, i) => (
            <div key={option._id || option.id} id={option.anchorId || undefined} className={`reveal reveal-delay-${i % 3} ${styles.card}`}>
              <div className={styles.cardHeader}>
                <div className={styles.icon}>
                  {isImageIcon(option.icon) ? <img src={option.icon} alt="" className={styles.iconImg} /> : option.icon}
                </div>
                <h2 className="heading-md">{option.title}</h2>
              </div>
              <p className={styles.desc}>{option.description}</p>
              {option.bullets?.length > 0 && (
                <ul className={styles.list}>
                  {option.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              )}
              <Link href={option.ctaLink} className="btn btn--outline" style={{ marginTop: 'auto' }}>{option.ctaLabel}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Become a Member CTA */}
      <section className={`section section-dark ${styles.memberSection}`}>
        <div className={`container ${styles.memberContainer}`}>
          <div className={`reveal ${styles.memberContent}`}>
            <h2 className="heading-lg" style={{ color: 'var(--gold-light)', marginBottom: 'var(--space-4)' }}>{content.memberHeading}</h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: 'var(--space-6)', maxWidth: '600px' }}>
              {content.memberText}
            </p>
            <Link href="/contact?subject=membership" className="btn btn--gold btn--lg">{content.memberButtonLabel}</Link>
          </div>
          <div className={`reveal reveal-delay-2 ${styles.memberImage}`} style={{ backgroundImage: `url(${content.memberImage})` }}></div>
        </div>
      </section>

    </div>
  );
}
