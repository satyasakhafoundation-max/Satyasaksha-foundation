'use client';
import styles from './page.module.css';

export default function ClientTeamPage({ members, content }) {

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

      {/* Team Grid */}
      <section className={`section ${styles.teamSection}`}>
        <div className="container">
          <div className="section-header reveal">
            <p className="label">{content.gridLabel}</p>
            <h2 className="heading-xl">{content.gridHeading}</h2>
            <div className="divider-gold"></div>
          </div>

          <div className={styles.teamGrid}>
            {members.map((member, i) => (
              <div key={member.id || member._id || member.name} className={`reveal reveal-delay-${(i % 3) + 1} ${styles.teamCard}`}>
                <div className={styles.memberImageWrap}>
                  <div className={styles.memberImage} style={{ backgroundImage: `url(${member.image})` }}></div>
                </div>
                <div className={styles.memberInfo}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberRole}>{member.role}</p>
                  {member.bio && <p className={styles.memberBio}>{member.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
