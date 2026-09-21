'use client';
import styles from './page.module.css';

export default function ClientTeamPage({ members }) {

  return (
    <div className={styles.pageWrap}>

      {/* Page Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2500&auto=format&fit=crop")' }}></div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className="heading-hero reveal">Our Team</h1>
          <p className={`reveal reveal-delay-1 ${styles.heroSub}`}>
            Meet the people driving Satyasaksha Foundation&apos;s mission forward, on the ground and behind the scenes.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className={`section ${styles.teamSection}`}>
        <div className="container">
          <div className="section-header reveal">
            <p className="label">Leadership</p>
            <h2 className="heading-xl">Board of Directors</h2>
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
