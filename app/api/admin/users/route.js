import { NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

// GET — List all admin users (super_admin only)
export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    await dbConnect();
    // Select +password only to derive `pendingSetup` server-side — the hash
    // itself is stripped before the response goes out, never sent to the client.
    const users = await User.find({}).select('+password').sort({ createdAt: -1 }).lean();
    const sanitized = users.map(({ password, ...user }) => ({ ...user, pendingSetup: !password }));
    return NextResponse.json(sanitized);
  } catch { return NextResponse.json({ error: 'Failed to fetch users.' }, { status: 500 }); }
}

// POST — Generate invite link for a new admin (super_admin only)
export async function POST(request) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { name, email } = await request.json();

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: 'An admin with this email already exists.' }, { status: 400 });
    }

    const { rawToken, hashed } = User.generateInviteToken();
    const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    // Create a pending (inactive) admin user
    await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'admin',
      isActive: false,
      inviteToken: hashed,
      inviteTokenExpiry: expiry,
    });

    // Return the raw token — the admin UI will build the invite URL
    return NextResponse.json({ rawToken, expiry });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — Toggle user active status (super_admin only)
export async function PATCH(request) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { id, isActive } = await request.json();

    // Prevent deactivating yourself
    if (id === session.user.id) {
      return NextResponse.json({ error: 'You cannot deactivate your own account.' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(id, { isActive }, { new: true, runValidators: true });
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    return NextResponse.json({ success: true, isActive: user.isActive });
  } catch { return NextResponse.json({ error: 'Failed to update user.' }, { status: 500 }); }
}

// DELETE — Remove admin user (super_admin only)
export async function DELETE(request) {
  const { session, error } = await requireSuperAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id === session.user.id) {
      return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 }); }
}
