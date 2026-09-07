export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import FocusArea from '@/models/FocusArea';

// GET /api/admin/focus-areas-all - admin only, returns ALL including hidden
export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const areas = await FocusArea.find({}).sort({ order: 1 }).lean();
    return NextResponse.json(areas);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

