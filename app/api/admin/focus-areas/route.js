export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import FocusArea from '@/models/FocusArea';

// GET /api/admin/focus-areas - public (visible only)
export async function GET() {
  try {
    await dbConnect();
    const areas = await FocusArea.find({ isVisible: true })
      .sort({ order: 1 })
      .lean();
    return NextResponse.json(areas, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch focus areas' }, { status: 500 });
  }
}

// POST /api/admin/focus-areas - admin only
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    // Auto-generate id from title if not provided
    if (!body.id) {
      body.id = body.title.toLowerCase().replace(/\s+/g, '-');
    }
    const area = await FocusArea.create(body);
    return NextResponse.json(area, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT /api/admin/focus-areas - admin only
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    const { _id, ...updateData } = body;

    const area = await FocusArea.findByIdAndUpdate(_id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!area) {
      return NextResponse.json({ error: 'Focus area not found' }, { status: 404 });
    }

    return NextResponse.json(area);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/admin/focus-areas?id=xxx - admin only
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const area = await FocusArea.findByIdAndDelete(id);
    if (!area) {
      return NextResponse.json({ error: 'Focus area not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
