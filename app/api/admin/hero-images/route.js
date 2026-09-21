export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import HeroImage from '@/models/HeroImage';

// GET /api/admin/hero-images - public (visible only)
export async function GET() {
  try {
    await dbConnect();
    const images = await HeroImage.find({ isVisible: true })
      .sort({ order: 1 })
      .lean();
    return NextResponse.json(images, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hero images' }, { status: 500 });
  }
}

// POST /api/admin/hero-images - admin only
export async function POST(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();
    const image = await HeroImage.create(body);
    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT /api/admin/hero-images - admin only
export async function PUT(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();
    const { _id, ...updateData } = body;

    const image = await HeroImage.findByIdAndUpdate(_id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!image) {
      return NextResponse.json({ error: 'Hero image not found' }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/admin/hero-images?id=xxx - admin only
export async function DELETE(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const image = await HeroImage.findByIdAndDelete(id);
    if (!image) {
      return NextResponse.json({ error: 'Hero image not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
