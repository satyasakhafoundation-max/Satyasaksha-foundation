import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ImpactStat from '@/models/ImpactStat';

export const dynamic = 'force-dynamic';

// GET /api/admin/stats - public (also used by public site). The admin Stats
// page reads from this same endpoint (there's no separate "-all" variant),
// so a signed-in admin must always get a fresh, uncached response —
// otherwise their own just-saved edits can appear to not have persisted for
// up to a minute. Only anonymous/public callers get the shared cache.
export async function GET() {
  const { session } = await requireAdmin();

  try {
    await dbConnect();
    const stats = await ImpactStat.find({}).sort({ order: 1 }).lean();
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': session ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

// POST /api/admin/stats - admin only
export async function POST(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();
    const stat = await ImpactStat.create(body);
    revalidatePath('/');
    revalidatePath('/impact');
    return NextResponse.json(stat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT /api/admin/stats - admin only (update by id field)
export async function PUT(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();
    const { _id, ...updateData } = body;

    const stat = await ImpactStat.findByIdAndUpdate(_id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!stat) {
      return NextResponse.json({ error: 'Stat not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/impact');
    return NextResponse.json(stat);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/admin/stats?id=xxx - admin only
export async function DELETE(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const stat = await ImpactStat.findByIdAndDelete(id);
    if (!stat) {
      return NextResponse.json({ error: 'Stat not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/impact');
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
