// Server Component — queries HeroImage from DB, cached for 60s
import ClientHeroSection from './ClientHeroSection';
import dbConnect from '@/lib/mongodb';
import HeroImage from '@/models/HeroImage';

export const revalidate = 60;

const DEFAULT_BG = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2500&auto=format&fit=crop';

async function getHeroImages() {
  try {
    await dbConnect();
    const images = await HeroImage.find({ isVisible: true }).sort({ order: 1 }).lean();
    if (images.length > 0) {
      return images.map((img) => img.imageUrl);
    }
    return [DEFAULT_BG];
  } catch {
    return [DEFAULT_BG];
  }
}

export default async function HeroSection() {
  const images = await getHeroImages();
  return <ClientHeroSection images={images} />;
}
