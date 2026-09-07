export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import GalleryImage from '@/models/GalleryImage';

// GET /api/admin/gallery - public (only visible images)
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

// POST /api/admin/gallery - admin only (save image metadata after Cloudinary upload)
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    const image = await GalleryImage.create(body);
    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT /api/admin/gallery - admin only (update metadata / toggle visibility)
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    const { _id, ...updateData } = body;

    const image = await GalleryImage.findByIdAndUpdate(_id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/admin/gallery?id=xxx - admin only
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const image = await GalleryImage.findByIdAndDelete(id);
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Attempt to delete from Cloudinary if we have a publicId
    if (image.publicId) {
      const cloudinary = (await import('@/lib/cloudinary')).default;
      await cloudinary.uploader.destroy(image.publicId);
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
