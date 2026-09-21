'use client';
import styles from './page.module.css';

const isImageIcon = (icon) => typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('data:image'));

export default function ClientAboutPage({ coreValues }) {

  return (
    <div className={styles.pageWrap}>

      {/* Page Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2500&auto=format&fit=crop")' }}></div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className="heading-hero reveal">About Us</h1>
          <p className={`reveal reveal-delay-1 ${styles.heroSub}`}>
            Discover the origins, the people, and the unwavering philosophy behind Satyasaksha Foundation.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className={`section ${styles.storySection}`}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={`reveal ${styles.storyTextCol}`}>
              <p className="label">Our Origin</p>
              <h2 className="heading-lg" style={{ marginBottom: 'var(--space-6)' }}>
                Rooted in <span className="italic-accent">Compassion</span>
              </h2>
              <p className={styles.dropCap}>
                Founded with a deep commitment to truth and environmental stewardship, the Satyasaksha Foundation began as a small collective of conservationists and educators. Today, we have grown into a nationwide movement, bound by the simple belief that every action, no matter how small, can protect a life and preserve our natural world.
              </p>
              <p>
                Our name, meaning &quot;the witness of truth,&quot; dictates our operational transparency. We don&apos;t just advocate for change; we act. Whether it is reforesting barren lands, rescuing injured wildlife, or building schools in remote villages, our work is a testament to what collective human compassion can achieve.
              </p>
            </div>
            <div className={`reveal reveal-delay-2 ${styles.storyImageCol}`}>
              <div className={styles.storyImage} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1200&auto=format&fit=crop")' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className={`section section-dark ${styles.valuesSection}`}>
        <div className="container">
          <div className="section-header reveal">
            <h2 className="heading-xl">Our Core Values</h2>
            <div className="divider-gold"></div>
          </div>

          <div className={styles.valuesGrid}>
            {coreValues.map((value, i) => (
              <div key={value.id || value._id || value.title} className={`reveal reveal-delay-${(i % 3) + 1} ${styles.valueCard}`}>
                <div className={styles.valueIcon}>
                  {isImageIcon(value.icon)
                    ? <img src={value.icon} alt="" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '50%', display: 'inline-block' }} />
                    : value.icon}
                </div>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
