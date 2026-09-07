export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ImpactStat from '@/models/ImpactStat';
import FocusArea from '@/models/FocusArea';
import GalleryImage from '@/models/GalleryImage';
import User from '@/models/User';

// Seed data from existing JSON files (Women removed)
const impactStats = [
  { id: 'lives', label: 'Lives Touched', value: 15000, prefix: '', suffix: '+', icon: '👥', order: 1 },
  { id: 'students', label: 'Students Supported', value: 5000, prefix: '', suffix: '+', icon: '📚', order: 2 },
  { id: 'animals', label: 'Animals Assisted', value: 2500, prefix: '', suffix: '+', icon: '🐾', order: 3 },
  { id: 'communities', label: 'Communities Reached', value: 120, prefix: '', suffix: '', icon: '🏡', order: 4 },
  { id: 'trees', label: 'Trees Planted', value: 50000, prefix: '', suffix: '+', icon: '🌱', order: 5 },
  { id: 'partners', label: 'Active Partners', value: 50, prefix: '', suffix: '+', icon: '🤝', order: 6 },
  { id: 'projects', label: 'Completed Projects', value: 45, prefix: '', suffix: '', icon: '✅', order: 7 },
  { id: 'years', label: 'Years of Impact', value: 1, prefix: '', suffix: '', icon: '🗓️', order: 8 },
];

const focusAreas = [
  { id: 'environment', title: 'Environment', icon: '🌱', description: 'Protecting our planet for future generations', color: '#1B4332', link: '/our-work#environment', order: 1 },
  { id: 'wildlife', title: 'Wildlife', icon: '🐾', description: 'Guardians of biodiversity', color: '#2D6A4F', link: '/our-work#wildlife', order: 2 },
  { id: 'animal-welfare', title: 'Animal Welfare', icon: '🩺', description: 'Every life deserves compassion', color: '#40916C', link: '/our-work#animal-welfare', order: 3 },
  { id: 'education', title: 'Education', icon: '📚', description: 'Empowering minds, building futures', color: '#52B788', link: '/our-work#education', order: 4 },
  { id: 'healthcare', title: 'Healthcare', icon: '🏥', description: 'Accessible wellness for all', color: '#B7E4C7', link: '/our-work#healthcare', order: 5 },
  { id: 'sports', title: 'Sports', icon: '🏃', description: 'Nurturing youth potential', color: '#C9A84C', link: '/our-work#sports', order: 6 },
  { id: 'food', title: 'Annadan', icon: '🌾', description: 'Food distribution & support', color: '#D4AF37', link: '/our-work#food', order: 7 },
  { id: 'agriculture', title: 'Agriculture', icon: '🚜', description: 'Sustainable rural development', color: '#5C4827', link: '/our-work#agriculture', order: 8 },
  { id: 'research', title: 'Research', icon: '🔬', description: 'Innovation for social good', color: '#1F2937', link: '/our-work#research', order: 9 },
];

const galleryImages = [
  { caption: 'Forest Restoration', imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop', thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&h=400&auto=format&fit=crop', category: 'Environment', order: 1 },
  { caption: 'Wildlife Monitoring', imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop', thumbnailUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&h=400&auto=format&fit=crop', category: 'Wildlife', order: 2 },
  { caption: 'Community Outreach', imageUrl: 'https://images.unsplash.com/photo-1473649085228-583485e6e4d7?q=80&w=1200&auto=format&fit=crop', thumbnailUrl: 'https://images.unsplash.com/photo-1473649085228-583485e6e4d7?q=80&w=600&h=400&auto=format&fit=crop', category: 'Community', order: 3 },
  { caption: 'Local Education', imageUrl: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=1200&auto=format&fit=crop', thumbnailUrl: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=600&h=400&auto=format&fit=crop', category: 'Community', order: 4 },
  { caption: 'Rural Health Checkup', imageUrl: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?q=80&w=1200&auto=format&fit=crop', thumbnailUrl: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?q=80&w=600&h=400&auto=format&fit=crop', category: 'Community', order: 5 },
  { caption: 'Community Clean-up Drive', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop', thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&h=400&auto=format&fit=crop', category: 'Events', order: 6 },
  { caption: 'Nature Walk & Awareness', imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1200&auto=format&fit=crop', thumbnailUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=600&h=400&auto=format&fit=crop', category: 'Environment', order: 7 },
  { caption: 'Tree Plantation Camp', imageUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=1200&auto=format&fit=crop', thumbnailUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=600&h=400&auto=format&fit=crop', category: 'Environment', order: 8 },
];

// POST /api/seed - ONE TIME USE. Protected by a secret token.
export async function POST(request) {
  // This route is protected by a secret seed token
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (token !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();

    // Clear existing data and re-seed
    await ImpactStat.deleteMany({});
    await FocusArea.deleteMany({});
    await GalleryImage.deleteMany({});

    await ImpactStat.insertMany(impactStats);
    await FocusArea.insertMany(focusAreas);
    await GalleryImage.insertMany(galleryImages);

    // Create initial admin user only if no users exist
    const existingUser = await User.findOne({});
    let adminCreated = false;
    if (!existingUser) {
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      adminCreated = true;
    }

    return NextResponse.json({
      message: 'Database seeded successfully!',
      stats: impactStats.length,
      focusAreas: focusAreas.length,
      gallery: galleryImages.length,
      adminCreated,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

