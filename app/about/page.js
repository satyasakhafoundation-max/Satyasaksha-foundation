'use client';
import Image from 'next/image';
import { useReveal } from '@/hooks/useReveal';
import styles from './page.module.css';

const teamMembers = [
  { name: 'Mr. Rishikesh Panvelkar', role: 'Founder & Chairman', image: 'https://github.com/satyasakhafoundation-max/Satyasaksha-foundation/blob/fe9c435bc4021946d6ba26dc13765e8571d51611/WhatsApp%20Image%202026-09-11%20at%2010.06.29%20AM.jpeg' },
  { name: 'Ashutosh', role: 'Project Manager', image: 'https://github.com/satyasakhafoundation-max/Satyasaksha-foundation/blob/fe9c435bc4021946d6ba26dc13765e8571d51611/ashutosh.jpeg' },
  { name: 'Sneha', role: 'Project Coordinator', image: 'https://github.com/satyasakhafoundation-max/Satyasaksha-foundation/blob/fe9c435bc4021946d6ba26dc13765e8571d51611/WhatsApp%20Image%202026-09-13%20at%2010.18.40%20PM.jpeg' },
];

export default function AboutPage() {
  useReveal();

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
            <div className={`reveal reveal-delay-1 ${styles.valueCard}`}>
              <div className={styles.valueIcon}>🐘</div>
              <h3 className={styles.valueTitle}>Wisdom & Patience</h3>
              <p>Inspired by the elephant, we take calculated, long-term approaches to conservation, ensuring lasting impact rather than quick fixes.</p>
            </div>
            <div className={`reveal reveal-delay-2 ${styles.valueCard}`}>
              <div className={styles.valueIcon}>🦉</div>
              <h3 className={styles.valueTitle}>Discernment</h3>
              <p>Like the owl, we see through the darkness. We rely on scientific research and verifiable truth to guide our initiatives and funding.</p>
            </div>
            <div className={`reveal reveal-delay-3 ${styles.valueCard}`}>
              <div className={styles.valueIcon}>🌳</div>
              <h3 className={styles.valueTitle}>Rootedness</h3>
              <p>Our foundation is built like a tree—deeply connected to the local communities we serve, providing shelter, support, and sustenance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`section ${styles.teamSection}`}>
        <div className="container">
          <div className="section-header reveal">
            <p className="label">Leadership</p>
            <h2 className="heading-xl">Board of Directors</h2>
            <div className="divider-gold"></div>
          </div>

          <div className={styles.teamGrid}>
            {teamMembers.map((member, i) => (
              <div key={i} className={`reveal reveal-delay-${(i%3)+1} ${styles.teamCard}`}>
                <div className={styles.memberImageWrap}>
                  <div className={styles.memberImage} style={{ backgroundImage: `url(${member.image})` }}></div>
                </div>
                <div className={styles.memberInfo}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberRole}>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
