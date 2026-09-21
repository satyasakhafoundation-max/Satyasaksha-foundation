// Server Component — queries the DB directly, cached for 60s
import ClientFocusAreas from './ClientFocusAreas';
import dbConnect from '@/lib/mongodb';
import FocusArea from '@/models/FocusArea';

export const revalidate = 60;

async function getFocusAreas() {
  try {
    await dbConnect();
    const areas = await FocusArea.find({ isVisible: true })
      .sort({ order: 1 })
      .lean();

    return areas.map((area) => ({
      ...area,
      _id: area._id.toString(),
    }));
  } catch {
    // Fallback to local JSON if DB is not available
    return (await import('@/data/focus-areas.json')).default;
  }
}

export default async function FocusAreas() {
  const areas = await getFocusAreas();
  return <ClientFocusAreas areas={areas} />;
}
