export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { fileTypeFromBuffer } from 'file-type';
import { requireAdmin } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

// POST /api/admin/upload-document
// Accepts a form with a 'file' field (PDF only). Returns: { fileUrl }
export async function POST(request) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File is too large (max 20MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const detected = await fileTypeFromBuffer(buffer);
    if (!detected || detected.mime !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    const base64 = `data:application/pdf;base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'satyasaksha-foundation/reports',
      resource_type: 'raw',
    });

    return NextResponse.json({ fileUrl: result.secure_url });
  } catch (error) {
    console.error('Cloudinary document upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}
