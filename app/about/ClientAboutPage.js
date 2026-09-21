'use client';
import styles from './page.module.css';

const isImageIcon = (icon) => typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('data:image'));

export default function ClientAboutPage({ coreValues, content }) {

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

      {/* Our Story */}
      <section className={`section ${styles.storySection}`}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={`reveal ${styles.storyTextCol}`}>
              <p className="label">{content.storyLabel}</p>
              <h2 className="heading-lg" style={{ marginBottom: 'var(--space-6)' }}>
                {content.storyHeadingLine1} <span className="italic-accent">{content.storyHeadingLine2}</span>
              </h2>
              <p className={styles.dropCap}>
                {content.storyPara1}
              </p>
              <p>
                {content.storyPara2}
              </p>
            </div>
            <div className={`reveal reveal-delay-2 ${styles.storyImageCol}`}>
              <div className={styles.storyImage} style={{ backgroundImage: `url(${content.storyImage})` }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className={`section section-dark ${styles.valuesSection}`}>
        <div className="container">
          <div className="section-header reveal">
            <h2 className="heading-xl">{content.coreValuesHeading}</h2>
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
