export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

// GET /api/admin/site-settings - public. Singleton: creates the default
// document on first read so the site always has settings to fall back on.
// The admin Site Settings page reads from this same endpoint (there's no
// separate "-all" variant), so a signed-in admin must always get a fresh,
// uncached response — otherwise their own just-saved edits can appear to
// not have persisted for up to a minute. Only anonymous/public callers get
// the shared cache.
export async function GET() {
  const { session } = await requireAdmin();

  try {
    await dbConnect();
    let settings = await SiteSettings.findOne({}).lean();
    if (!settings) {
      settings = (await SiteSettings.create({})).toObject();
    }
    return NextResponse.json(settings, {
      headers: {
        'Cache-Control': session ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 });
  }
}

// PUT /api/admin/site-settings - admin only (upserts the singleton)
export async function PUT(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbConnect();
    const body = await request.json();
    delete body._id;
    const settings = await SiteSettings.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
