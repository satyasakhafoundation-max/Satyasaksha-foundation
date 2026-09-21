export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ImpactStat from '@/models/ImpactStat';
import FocusArea from '@/models/FocusArea';
import CoreValue from '@/models/CoreValue';
import TeamMember from '@/models/TeamMember';
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
  { id: 'environment', title: 'Environment', icon: '🌱', description: 'Protecting our planet for future generations', color: '#1B4332', link: '/news', order: 1 },
  { id: 'wildlife', title: 'Wildlife', icon: '🐾', description: 'Guardians of biodiversity', color: '#2D6A4F', link: '/news', order: 2 },
  { id: 'animal-welfare', title: 'Animal Welfare', icon: '🩺', description: 'Every life deserves compassion', color: '#40916C', link: '/news', order: 3 },
  { id: 'education', title: 'Education', icon: '📚', description: 'Empowering minds, building futures', color: '#52B788', link: '/news', order: 4 },
  { id: 'healthcare', title: 'Healthcare', icon: '🏥', description: 'Accessible wellness for all', color: '#B7E4C7', link: '/news', order: 5 },
  { id: 'sports', title: 'Sports', icon: '🏃', description: 'Nurturing youth potential', color: '#C9A84C', link: '/news', order: 6 },
  { id: 'food', title: 'Annadan', icon: '🌾', description: 'Food distribution & support', color: '#D4AF37', link: '/news', order: 7 },
  { id: 'agriculture', title: 'Agriculture', icon: '🚜', description: 'Sustainable rural development', color: '#5C4827', link: '/news', order: 8 },
  { id: 'research', title: 'Research', icon: '🔬', description: 'Innovation for social good', color: '#1F2937', link: '/news', order: 9 },
];

const coreValues = [
  { icon: '🐘', title: 'Wisdom & Patience', description: 'Inspired by the elephant, we take calculated, long-term approaches to conservation, ensuring lasting impact rather than quick fixes.', order: 1 },
  { icon: '🦉', title: 'Discernment', description: 'Like the owl, we see through the darkness. We rely on scientific research and verifiable truth to guide our initiatives and funding.', order: 2 },
  { icon: '🌳', title: 'Rootedness', description: 'Our foundation is built like a tree—deeply connected to the local communities we serve, providing shelter, support, and sustenance.', order: 3 },
];

const teamMembers = [
  { name: 'Mr. Rishikesh Panvelkar', role: 'Founder & Chairman', image: 'https://raw.githubusercontent.com/satyasakhafoundation-max/Satyasaksha-foundation/fe9c435bc4021946d6ba26dc13765e8571d51611/WhatsApp%20Image%202026-09-11%20at%2010.06.29%20AM.jpeg', order: 1 },
  { name: 'Ashutosh', role: 'Project Manager', image: 'https://raw.githubusercontent.com/satyasakhafoundation-max/Satyasaksha-foundation/fe9c435bc4021946d6ba26dc13765e8571d51611/ashutosh.jpeg', order: 2 },
  { name: 'Sneha', role: 'Project Coordinator', image: 'https://raw.githubusercontent.com/satyasakhafoundation-max/Satyasaksha-foundation/fe9c435bc4021946d6ba26dc13765e8571d51611/WhatsApp%20Image%202026-09-13%20at%2010.18.40%20PM.jpeg', order: 3 },
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
    await CoreValue.deleteMany({});
    await TeamMember.deleteMany({});

    await ImpactStat.insertMany(impactStats);
    await FocusArea.insertMany(focusAreas);
    await CoreValue.insertMany(coreValues);
    await TeamMember.insertMany(teamMembers);

    // Create initial admin user only if no users exist
    const existingUser = await User.findOne({});
    let adminCreated = false;
    if (!existingUser) {
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'super_admin',
      });
      adminCreated = true;
    }

    return NextResponse.json({
      message: 'Database seeded successfully!',
      stats: impactStats.length,
      focusAreas: focusAreas.length,
      coreValues: coreValues.length,
      teamMembers: teamMembers.length,
      adminCreated,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
