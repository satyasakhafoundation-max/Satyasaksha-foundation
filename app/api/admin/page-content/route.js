export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import PageContent from '@/models/PageContent';
import { getPageDefaults, PAGE_CONTENT_SCHEMA } from '@/lib/pageContentSchema';
import { sanitizeRichText } from '@/lib/sanitize';

// GET /api/admin/page-content?slug=home - public, returns merged defaults + saved data.
// The admin Page Content editor reads from this same endpoint, so a
// signed-in admin must always get a fresh, uncached response — otherwise
// their own just-saved edits can appear to not have persisted for up to a
// minute. Only anonymous/public callers get the shared cache.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug || !PAGE_CONTENT_SCHEMA[slug]) {
    return NextResponse.json({ error: 'Unknown page slug' }, { status: 400 });
  }

  const { session } = await requireAdmin();
  const defaults = getPageDefaults(slug);
  try {
    await dbConnect();
    const doc = await PageContent.findOne({ slug }).lean();
    return NextResponse.json(
      { slug, data: { ...defaults, ...(doc?.data || {}) } },
      { headers: { 'Cache-Control': session ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (error) {
    return NextResponse.json({ slug, data: defaults });
  }
}

// PUT /api/admin/page-content - admin only. Body: { slug, data }
export async function PUT(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { slug, data } = await request.json();
    const schema = PAGE_CONTENT_SCHEMA[slug];
    if (!slug || !schema) {
      return NextResponse.json({ error: 'Unknown page slug' }, { status: 400 });
    }

    // Sanitize any 'richtext' fields server-side, same as NewsArticle.content
    for (const section of schema.sections) {
      for (const field of section.fields) {
        if (field.type === 'richtext' && data[field.key]) {
          data[field.key] = sanitizeRichText(data[field.key]);
        }
      }
    }

    await dbConnect();
    const doc = await PageContent.findOneAndUpdate(
      { slug },
      { slug, data },
      { new: true, upsert: true, runValidators: true }
    );
    return NextResponse.json(doc);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
