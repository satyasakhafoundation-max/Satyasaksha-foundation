export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GalleryImage from '@/models/GalleryImage';

// GET /api/gallery - public alias for the gallery (visible images only)
export async function GET() {
  try {
    await dbConnect();
    const images = await GalleryImage.find({ isVisible: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return NextResponse.json(images, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}
