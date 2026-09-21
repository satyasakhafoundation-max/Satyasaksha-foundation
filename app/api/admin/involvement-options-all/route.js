export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import InvolvementOption from '@/models/InvolvementOption';

// GET /api/admin/involvement-options-all - admin only, returns ALL including hidden
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const items = await InvolvementOption.find({}).sort({ order: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
