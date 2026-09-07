// Server Component — fetches stats from MongoDB with 60s revalidation cache
import ClientImpactPage from './ClientImpactPage';
import dbConnect from '@/lib/mongodb';
import ImpactStat from '@/models/ImpactStat';

export const revalidate = 60;

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

export default async function ImpactPage() {
  const stats = await getStats();
  return <ClientImpactPage stats={stats} />;
}
