export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import InvolvementOption from '@/models/InvolvementOption';

// GET /api/admin/involvement-options - public (visible only)
export async function GET() {
  try {
    await dbConnect();
    const items = await InvolvementOption.find({ isVisible: true }).sort({ order: 1 }).lean();
    return NextResponse.json(items, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch involvement options' }, { status: 500 });
  }
}

// POST /api/admin/involvement-options - admin only
export async function POST(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();
    const item = await InvolvementOption.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT /api/admin/involvement-options - admin only
export async function PUT(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();
    const { _id, ...updateData } = body;
    const item = await InvolvementOption.findByIdAndUpdate(_id, updateData, { returnDocument: 'after', runValidators: true });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/admin/involvement-options?id=xxx - admin only
export async function DELETE(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const item = await InvolvementOption.findByIdAndDelete(id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
