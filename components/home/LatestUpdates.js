// Server Component — queries published news directly from MongoDB, cached for 60s
import Link from 'next/link';
import ClientLatestUpdates from './ClientLatestUpdates';
import dbConnect from '@/lib/mongodb';
import NewsArticle from '@/models/NewsArticle';
import newsStaticData from '@/data/news.json';

export const revalidate = 60;

async function getLatestNews() {
  try {
    await dbConnect();
    const articles = await NewsArticle.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();

    if (articles.length > 0) {
      return articles.map((a) => ({
        id: a._id.toString(),
        title: a.title,
        date: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
        category: a.category,
        excerpt: a.excerpt,
        image: a.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
        link: `/news/${a.slug}`,
      }));
    }
  } catch {
    // fall through to static data
  }
  return newsStaticData;
}

export default async function LatestUpdates() {
  const news = await getLatestNews();
  return <ClientLatestUpdates news={news} />;
}
