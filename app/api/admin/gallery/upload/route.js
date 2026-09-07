export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import cloudinary from '@/lib/cloudinary';

// POST /api/admin/gallery/upload
// Accepts a form with a 'file' field, uploads to Cloudinary
// Returns: { imageUrl, thumbnailUrl, publicId }
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert the file to a buffer then to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary with optimization settings
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'satyasaksha-foundation/gallery',
      transformation: [
        // Auto-optimize quality and format (WebP where supported)
        { quality: 'auto', fetch_format: 'auto' },
        // Max width for full size display
        { width: 1600, crop: 'limit' },
      ],
    });

    // Generate an optimized thumbnail URL
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
