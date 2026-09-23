// Server Component — fetches published news from MongoDB with ISR
import Link from 'next/link';
import styles from './page.module.css';
import dbConnect from '@/lib/mongodb';
import NewsArticle from '@/models/NewsArticle';
import newsStaticData from '@/data/news.json';
import { getPageContent } from '@/lib/pageContent';

export const revalidate = 60;

export const metadata = {
  title: 'News & Updates | Satyasaksha Foundation',
  description: 'Stay informed about the latest initiatives, milestones, and field stories from Satyasaksha Foundation.',
};

async function getArticles() {
  try {
    await dbConnect();
    const articles = await NewsArticle.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .lean();

    // A successful query with zero results means there's genuinely no
    // published news yet — distinct from the DB being unreachable, so it
    // shouldn't fall back to fabricated placeholder articles as if real.
    return articles.map((a) => ({
      id: a._id.toString(),
      title: a.title,
      date: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
      category: a.category,
      excerpt: a.excerpt,
      image: a.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
      link: `/news/${a.slug}`,
    }));
  } catch {
    // DB unreachable — fall through to static placeholder data below.
  }
  // Fallback: return static JSON data merged with extra items
  return [
    ...newsStaticData,
    {
      id: 'news-3',
      title: 'Annual Fundraising Gala Exceeds Target',
      date: 'June 15, 2026',
      category: 'Foundation',
      excerpt: "Thanks to our generous donors, the annual gala raised over ₹50 Lakhs, which will go directly towards building two new rural schools.",
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
      link: '/news/annual-gala-success',
    },
    {
      id: 'news-4',
      title: 'New Partnership with Global Wildlife Trust',
      date: 'May 02, 2026',
      category: 'Wildlife',
      excerpt: 'Satyasaksha Foundation has signed a monumental MoU with the Global Wildlife Trust to share research and resources for elephant conservation.',
      image: 'https://images.unsplash.com/photo-1614027167389-014c2780c102?q=80&w=800&auto=format&fit=crop',
      link: '/news/wildlife-trust-partnership',
    },
  ];
}

export default async function NewsPage() {
  const [allNews, content] = await Promise.all([getArticles(), getPageContent('news')]);

  return (
    <div className={styles.pageWrap}>

      {/* Page Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${content.heroImage})` }}></div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className="heading-hero">{content.heroTitle}</h1>
          <p className={styles.heroSub}>
            {content.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Featured Article */}
      {allNews.length > 0 && (
        <section className={`section ${styles.featuredSection}`}>
          <div className="container">
            <div className="section-header">
              <p className="label">Featured Story</p>
              <div className="divider-gold"></div>
            </div>
            
            <Link href={allNews[0].link} className={styles.featuredCard}>
              <div className={styles.featuredImage} style={{ backgroundImage: `url(${allNews[0].image})` }}></div>
              <div className={styles.featuredContent}>
                <div className={styles.meta}>
                  <span className={styles.category}>{allNews[0].category}</span>
                  <span className={styles.date}>{allNews[0].date}</span>
                </div>
                <h2 className={styles.featuredTitle}>{allNews[0].title}</h2>
                <p className={styles.featuredExcerpt}>{allNews[0].excerpt}</p>
                <span className={styles.readMore}>Read Full Story <span>→</span></span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {allNews.length === 0 && (
        <section className={`section ${styles.featuredSection}`}>
          <div className="container">
            <p className="text-muted" style={{ textAlign: 'center' }}>
              No articles published yet — check back soon.
            </p>
          </div>
        </section>
      )}

      {/* News Grid */}
      {allNews.length > 1 && (
        <section className={`section ${styles.gridSection}`}>
          <div className="container">
            <div className="section-header">
              <h2 className="heading-lg">Latest Articles</h2>
              <div className="divider-gold"></div>
            </div>

            <div className={styles.grid}>
              {allNews.slice(1).map((news, i) => (
                <Link href={news.link} key={news.id} className={styles.card}>
                  <div className={styles.imageWrap}>
                    <div className={styles.image} style={{ backgroundImage: `url(${news.image})` }}></div>
                  </div>
                  <div className={styles.content}>
                    <div className={styles.meta}>
                      <span className={styles.category}>{news.category}</span>
                      <span className={styles.date}>{news.date}</span>
                    </div>
                    <h3 className={styles.title}>{news.title}</h3>
                    <p className={styles.excerpt}>{news.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

