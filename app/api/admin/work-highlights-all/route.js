export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import WorkHighlight from '@/models/WorkHighlight';

// GET /api/admin/work-highlights-all - admin only, returns ALL including hidden
export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const items = await WorkHighlight.find({}).sort({ order: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
