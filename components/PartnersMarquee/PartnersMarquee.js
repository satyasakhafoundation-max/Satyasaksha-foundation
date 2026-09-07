// Server Component — fetches partners from DB, renders infinite CSS marquee
import styles from './PartnersMarquee.module.css';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/Partner';

// Fallback placeholder partners shown until DB has real entries
const FALLBACK = [
  { _id: 'p1', name: 'Wildlife Trust of India', logoUrl: '', websiteUrl: '#' },
  { _id: 'p2', name: 'WWF India', logoUrl: '', websiteUrl: '#' },
  { _id: 'p3', name: 'Nature Forever Society', logoUrl: '', websiteUrl: '#' },
  { _id: 'p4', name: 'Bombay Natural History Society', logoUrl: '', websiteUrl: '#' },
  { _id: 'p5', name: 'Salim Ali Foundation', logoUrl: '', websiteUrl: '#' },
];

export const revalidate = 60;

async function getPartners() {
  try {
    await dbConnect();
    const items = await Partner.find({ isVisible: true }).sort({ order: 1, createdAt: -1 }).lean();
    return items.length > 0 ? items : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export default async function PartnersMarquee() {
  const partners = await getPartners();
  // Duplicate the list for seamless looping
  const doubled = [...partners, ...partners];

  return (
    <section className={styles.section} aria-label="Our Partners">
      <div className={styles.label}>Our Partners &amp; Collaborators</div>
      <div className={styles.track} aria-hidden="true">
        <div className={styles.inner}>
          {doubled.map((p, i) => (
            <a
              key={`${p._id}-${i}`}
              href={p.websiteUrl || '#'}
              className={styles.item}
              target={p.websiteUrl && p.websiteUrl !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              title={p.name}
            >
              {p.logoUrl ? (
                <img src={p.logoUrl} alt={p.name} className={styles.logo} loading="lazy" />
              ) : (
                <span className={styles.textLogo}>{p.name}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
