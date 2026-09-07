import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/Partner';

export const revalidate = 60;

export async function GET() {
  try {
    await dbConnect();
    const items = await Partner.find({ isVisible: true }).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
