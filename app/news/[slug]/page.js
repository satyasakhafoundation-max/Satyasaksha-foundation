// Server Component — fetches a single published article by slug from MongoDB
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import NewsArticle from '@/models/NewsArticle';
import ClientNewsArticlePage from './ClientNewsArticlePage';

export const revalidate = 60;

async function getArticle(slug) {
  try {
    await dbConnect();
    const article = await NewsArticle.findOne({ slug, isPublished: true }).lean();
    if (!article) return null;

    return {
      id: article._id.toString(),
      title: article.title,
      date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
      category: article.category,
      excerpt: article.excerpt,
      content: article.content || '',
      imageUrl: article.imageUrl || '',
      images: article.images || [],
      author: article.author,
    };
  } catch {
    return null;
  }
}

// Random "You Might Also Like" suggestions — a fresh pick of other published stories on every visit
async function getRandomSuggestions(excludeSlug, limit = 3) {
  try {
    await dbConnect();
    const articles = await NewsArticle.aggregate([
      { $match: { isPublished: true, slug: { $ne: excludeSlug } } },
      { $sample: { size: limit } },
    ]);

    return articles.map((a) => ({
      id: a._id.toString(),
      title: a.title,
      category: a.category,
      excerpt: a.excerpt,
      image: a.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
      link: `/news/${a.slug}`,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug);
  if (!article) return { title: 'Article Not Found | Satyasaksha Foundation' };
  return {
    title: `${article.title} | Satyasaksha Foundation`,
    description: article.excerpt,
  };
}

export default async function NewsArticlePage({ params }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();
  const suggestions = await getRandomSuggestions(params.slug);
  return <ClientNewsArticlePage article={article} suggestions={suggestions} />;
}
