// Server Component — no 'use client' directive
// Fetches from DB, cached for 60s, so public site stays fast

import ClientImpactSection from './ClientImpactSection';

async function getStats() {
  try {
    // In production, use absolute URL. In dev, relative works with base URL.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/admin/stats`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch {
    // Fallback to local JSON if DB is not available
    return (await import('@/data/impact-stats.json')).default;
  }
}

export default async function ImpactSection() {
  const stats = await getStats();
  return <ClientImpactSection stats={stats} />;
}
