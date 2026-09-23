export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import CoreValue from '@/models/CoreValue';

// GET /api/admin/core-values - public (visible only)
export async function GET() {
  try {
    await dbConnect();
    const values = await CoreValue.find({ isVisible: true })
      .sort({ order: 1 })
      .lean();
    return NextResponse.json(values, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch core values' }, { status: 500 });
  }
}

// POST /api/admin/core-values - admin only
export async function POST(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();
    const value = await CoreValue.create(body);
    revalidatePath('/about');
    return NextResponse.json(value, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT /api/admin/core-values - admin only
export async function PUT(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();
    const { _id, ...updateData } = body;

    const value = await CoreValue.findByIdAndUpdate(_id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!value) {
      return NextResponse.json({ error: 'Core value not found' }, { status: 404 });
    }

    revalidatePath('/about');
    return NextResponse.json(value);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/admin/core-values?id=xxx - admin only
export async function DELETE(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const value = await CoreValue.findByIdAndDelete(id);
    if (!value) {
      return NextResponse.json({ error: 'Core value not found' }, { status: 404 });
    }

    revalidatePath('/about');
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
