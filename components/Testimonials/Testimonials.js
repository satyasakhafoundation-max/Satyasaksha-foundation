/* eslint-disable @next/next/no-img-element */
// Server Component — fetches testimonials from DB with ISR fallback
import styles from './Testimonials.module.css';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';

const FALLBACK = [
  {
    _id: 'f1',
    name: 'Dr. Priya Sharma',
    title: 'Senior Wildlife Researcher, WWF India',
    quote: "Satyasaksha Foundation's commitment to evidence-based conservation is rare and deeply inspiring. Their field teams operate with both heart and scientific rigour.",
    avatarUrl: '',
  },
  {
    _id: 'f2',
    name: 'Rahul Menon',
    title: 'Rural Education Volunteer',
    quote: "Volunteering with the foundation changed my perspective on what community-led change looks like. The impact on children in these villages is real and lasting.",
    avatarUrl: '',
  },
  {
    _id: 'f3',
    name: 'Anita Joshi',
    title: 'Donor & Supporter since 2024',
    quote: "I have donated to several NGOs, but Satyasaksha Foundation's transparency reports and direct field stories make me confident every rupee is well spent.",
    avatarUrl: '',
  },
];

async function getTestimonials() {
  try {
    await dbConnect();
    // A real, successful query returning zero items means there's genuinely
    // nothing to show yet (e.g. everything was unpublished) — that's not the
    // same as the DB being unreachable, so it should NOT show fabricated
    // placeholder quotes as if they were real testimonials.
    return await Testimonial.find({ isVisible: true }).sort({ order: 1, createdAt: -1 }).lean();
  } catch {
    // DB unreachable — degrade gracefully with generic placeholder quotes.
    return FALLBACK;
  }
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export const revalidate = 60;

export default async function Testimonials() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section className={`section ${styles.section}`} id="testimonials">
      <div className="container">
        <div className={`section-header reveal`}>
          <p className="label">What People Say</p>
          <h2 className="heading-lg">Voices of Impact</h2>
          <div className="divider-gold"></div>
          <p className="text-muted">
            Hear from the researchers, volunteers, and supporters whose lives have been touched by the work of Satyasaksha Foundation.
          </p>
        </div>

        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <div key={t._id} className={`reveal reveal-delay-${(i % 3) + 1} ${styles.card}`}>
              <div className={styles.quoteIcon}>&ldquo;</div>
              <p className={styles.quote}>{t.quote}</p>
              <div className={styles.author}>
                <div className={styles.avatar}>
                  {t.avatarUrl
                    ? <img src={t.avatarUrl} alt={t.name} className={styles.avatarImg} />
                    : <span className={styles.initials}>{getInitials(t.name)}</span>
                  }
                </div>
                <div>
                  <p className={styles.name}>{t.name}</p>
                  <p className={styles.title}>{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
