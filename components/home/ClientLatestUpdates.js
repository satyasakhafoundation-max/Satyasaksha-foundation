'use client';
import Link from 'next/link';
import styles from './LatestUpdates.module.css';

export default function ClientLatestUpdates({ news, content }) {

  return (
    <section className="section" id="latest-updates">
      <div className="container">

        <div className={`reveal ${styles.headerWrap}`}>
          <p className="label">News & Updates</p>
          <div className="divider-gold" style={{ margin: 'var(--space-4) auto 0' }}></div>
          <h2 className="heading-lg" style={{ textAlign: 'center' }}>{content.newsHeading}</h2>
        </div>

        <div className={styles.newsList}>
          {news.map((item, i) => (
            <Link href={item.link} key={item.id} className={`reveal reveal-delay-${i + 1} ${styles.newsCard}`}>
              <div className={styles.newsImage} style={{ backgroundImage: `url(${item.image})` }}></div>
              <div className={styles.newsContent}>
                <div className={styles.newsMeta}>
                  <span className={styles.newsCategory}>{item.category}</span>
                  <span className={styles.newsDate}>{item.date}</span>
                </div>
                <h3 className={styles.newsTitle}>{item.title}</h3>
                <p className={styles.newsExcerpt}>{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className={`reveal reveal-delay-3 ${styles.actionWrap}`}>
          <Link href="/news" className="btn btn--outline">
            Read All News
          </Link>
        </div>

      </div>
    </section>
  );
}
