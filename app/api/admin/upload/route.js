export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { fileTypeFromBuffer } from 'file-type';
import { requireAdmin } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const ALLOWED_FOLDERS = ['focus-areas', 'news', 'about', 'team', 'hero', 'products', 'work'];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

// POST /api/admin/upload
// Accepts a form with a 'file' field and an optional 'folder' field.
// Returns: { imageUrl, thumbnailUrl, publicId }
export async function POST(request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const requestedFolder = formData.get('folder');
    const folder = ALLOWED_FOLDERS.includes(requestedFolder) ? requestedFolder : 'misc';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File is too large (max 8MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Don't trust the browser-reported file.type (spoofable) — verify the
    // actual file signature (magic bytes) matches an allowed image type.
    const detected = await fileTypeFromBuffer(buffer);
    if (!detected || !ALLOWED_TYPES.includes(detected.mime)) {
      return NextResponse.json({ error: 'Only PNG, JPEG, or WebP images are allowed' }, { status: 400 });
    }

    const base64 = `data:${detected.mime};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: `satyasaksha-foundation/${folder}`,
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1600, crop: 'limit' },
      ],
    });

    const thumbnailUrl = cloudinary.url(result.public_id, {
      width: 600,
      height: 400,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    });

    return NextResponse.json({
      imageUrl: result.secure_url,
      thumbnailUrl,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}
