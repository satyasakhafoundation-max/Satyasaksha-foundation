import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import NewsArticle from '@/models/NewsArticle';

// Public endpoint — only published articles, cached for 60s
export const revalidate = 60;

export async function GET() {
  try {
    await dbConnect();
    const articles = await NewsArticle.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .select('title slug excerpt category imageUrl author publishedAt')
      .lean();
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles.' }, { status: 500 });
  }
}
