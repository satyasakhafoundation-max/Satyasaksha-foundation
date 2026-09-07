import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

// POST — Activate invited admin account by setting their password
export async function POST(request) {
  try {
    await dbConnect();
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    // Hash the raw token to compare with stored hash
    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      inviteToken: hashed,
      inviteTokenExpiry: { $gt: new Date() },
    }).select('+inviteToken +inviteTokenExpiry');

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired invite link. Please ask your administrator for a new one.' }, { status: 400 });
    }

    // Set password, activate account, clear invite token
    user.password = password;
    user.isActive = true;
    user.inviteToken = undefined;
    user.inviteTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: 'Account activated! You can now log in.' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
