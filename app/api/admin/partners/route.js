import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/Partner';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;
  try {
    await dbConnect();
    const items = await Partner.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch { return NextResponse.json({ error: 'Failed to fetch.' }, { status: 500 }); }
}

export async function POST(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  try {
    await dbConnect();
    const body = await request.json();
    const item = await Partner.create(body);
    revalidatePath('/');
    return NextResponse.json(item, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 400 }); }
}

export async function PUT(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  try {
    await dbConnect();
    const { _id, ...update } = await request.json();
    const item = await Partner.findByIdAndUpdate(_id, update, { new: true, runValidators: true });
    if (!item) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    revalidatePath('/');
    return NextResponse.json(item);
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 400 }); }
}

export async function DELETE(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const item = await Partner.findByIdAndDelete(id);
    if (!item) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Failed to delete.' }, { status: 500 }); }
}
