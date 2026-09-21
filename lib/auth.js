import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Shared guards for admin API routes. Each returns { session } on success,
// or { error: <NextResponse> } to return immediately — callers do:
//   const { session, error } = await requireAdmin();
//   if (error) return error;
// Centralizing this (instead of each route repeating getServerSession(authOptions))
// is what prevents a route from ever shipping with a missing/incorrect auth check.

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { session };
}

export async function requireSuperAdmin() {
  const { session, error } = await requireAdmin();
  if (error) return { error };
  if (session.user.role !== 'super_admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { session };
}
