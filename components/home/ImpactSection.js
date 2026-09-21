// Server Component — queries the DB directly, cached for 60s so the public site stays fast
import ClientImpactSection from './ClientImpactSection';
import dbConnect from '@/lib/mongodb';
import ImpactStat from '@/models/ImpactStat';
import { getPageContent } from '@/lib/pageContent';

export const revalidate = 60;

async function getStats() {
  try {
    await dbConnect();
    const stats = await ImpactStat.find({}).sort({ order: 1 }).lean();

    return stats.map((stat) => ({
      ...stat,
      _id: stat._id.toString(),
    }));
  } catch {
    // Fallback to local JSON if DB is not available
    return (await import('@/data/impact-stats.json')).default;
  }
}

export default async function ImpactSection() {
  const [stats, content] = await Promise.all([getStats(), getPageContent('home')]);
  return <ClientImpactSection stats={stats} content={content} />;
}
