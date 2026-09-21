// Server Component — fetches stats + work highlights from MongoDB with 60s revalidation cache
import ClientImpactPage from './ClientImpactPage';
import dbConnect from '@/lib/mongodb';
import ImpactStat from '@/models/ImpactStat';
import WorkHighlight from '@/models/WorkHighlight';
import { getPageContent } from '@/lib/pageContent';

export const revalidate = 60;

export const metadata = {
  title: 'Our Impact & Work | Satyasaksha Foundation',
  description: 'See how your support translates into real-world change — our impact by the numbers, and our work in pictures.',
};

async function getStats() {
  try {
    await dbConnect();
    const stats = await ImpactStat.find({}).sort({ order: 1 }).lean();

    return stats.map(stat => ({
      ...stat,
      _id: stat._id.toString()
    }));
  } catch {
    return (await import('@/data/impact-stats.json')).default;
  }
}

async function getWorkHighlights() {
  try {
    await dbConnect();
    const items = await WorkHighlight.find({ isVisible: true }).sort({ order: 1 }).lean();
    return items.map((item) => ({ ...item, _id: item._id.toString() }));
  } catch {
    return [];
  }
}

export default async function ImpactPage() {
  const [stats, workHighlights, content] = await Promise.all([getStats(), getWorkHighlights(), getPageContent('impact')]);
  return <ClientImpactPage stats={stats} workHighlights={workHighlights} content={content} />;
}
