// Server Component — queries CoreValue from DB, cached for 60s
import ClientAboutPage from './ClientAboutPage';
import dbConnect from '@/lib/mongodb';
import CoreValue from '@/models/CoreValue';
import { getPageContent } from '@/lib/pageContent';

export const revalidate = 60;

const DEFAULT_CORE_VALUES = [
  { id: 'wisdom', icon: '🐘', title: 'Wisdom & Patience', description: 'Inspired by the elephant, we take calculated, long-term approaches to conservation, ensuring lasting impact rather than quick fixes.' },
  { id: 'discernment', icon: '🦉', title: 'Discernment', description: 'Like the owl, we see through the darkness. We rely on scientific research and verifiable truth to guide our initiatives and funding.' },
  { id: 'rootedness', icon: '🌳', title: 'Rootedness', description: 'Our foundation is built like a tree—deeply connected to the local communities we serve, providing shelter, support, and sustenance.' },
];

async function getCoreValues() {
  try {
    await dbConnect();
    const values = await CoreValue.find({ isVisible: true }).sort({ order: 1 }).lean();
    if (values.length > 0) {
      return values.map((v) => ({ ...v, _id: v._id.toString() }));
    }
    return DEFAULT_CORE_VALUES;
  } catch {
    return DEFAULT_CORE_VALUES;
  }
}

export const metadata = {
  title: 'About Us | Satyasaksha Foundation',
  description: 'Discover the origins, the people, and the unwavering philosophy behind Satyasaksha Foundation.',
};

export default async function AboutPage() {
  const [coreValues, content] = await Promise.all([getCoreValues(), getPageContent('about')]);
  return <ClientAboutPage coreValues={coreValues} content={content} />;
}
