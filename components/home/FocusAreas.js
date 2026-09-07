// Server Component — fetches from DB with 60s revalidation cache
import ClientFocusAreas from './ClientFocusAreas';

async function getFocusAreas() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/admin/focus-areas`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch {
    // Fallback to local JSON
    return (await import('@/data/focus-areas.json')).default;
  }
}

export default async function FocusAreas() {
  const areas = await getFocusAreas();
  return <ClientFocusAreas areas={areas} />;
}
