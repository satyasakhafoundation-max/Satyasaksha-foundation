export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';

// GET /api/admin/team - public (visible only)
export async function GET() {
  try {
    await dbConnect();
    const members = await TeamMember.find({ isVisible: true })
      .sort({ order: 1 })
      .lean();
    return NextResponse.json(members, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

// POST /api/admin/team - admin only
export async function POST(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();
    const member = await TeamMember.create(body);
    revalidatePath('/team');
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT /api/admin/team - admin only
export async function PUT(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();
    const { _id, ...updateData } = body;

    const member = await TeamMember.findByIdAndUpdate(_id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    revalidatePath('/team');
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/admin/team?id=xxx - admin only
export async function DELETE(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const member = await TeamMember.findByIdAndDelete(id);
    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    revalidatePath('/team');
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
