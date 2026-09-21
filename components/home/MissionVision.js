// Server Component — queries PageContent from DB, cached for 60s
import { getPageContent } from '@/lib/pageContent';
import styles from './MissionVision.module.css';

export const revalidate = 60;

export default async function MissionVision() {
  const content = await getPageContent('home');

  return (
    <section className={`section ${styles.section}`} id="mission-vision">
      <div className="container">

        {/* Central Quote Panel */}
        <div className={`reveal ${styles.quotePanel}`}>
          <div className={styles.quoteMark}>&quot;</div>
          <h2 className={`heading-lg ${styles.quoteText}`}>
            {content.missionQuote}
          </h2>
          <div className="divider-gold"></div>
          <p className="label">Satyasaksha Foundation</p>
        </div>

        {/* Vision & Mission Cards */}
        <div className={styles.cardsGrid}>
          <div className={`reveal reveal-delay-1 ${styles.card}`}>
            <div className={styles.cardIcon}>{content.visionIcon}</div>
            <p className="label">Our Vision</p>
            <h3 className={`heading-md ${styles.cardTitle}`}>
              {content.visionTitle}
            </h3>
            <p className="text-muted">
              {content.visionText}
            </p>
          </div>

          <div className={`reveal reveal-delay-2 ${styles.card}`}>
            <div className={styles.cardIcon}>{content.missionIcon}</div>
            <p className="label">Our Mission</p>
            <h3 className={`heading-md ${styles.cardTitle}`}>
              {content.missionTitle}
            </h3>
            <p className="text-muted">
              {content.missionText}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
