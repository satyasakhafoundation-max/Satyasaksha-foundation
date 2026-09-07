// Server Component — fetches gallery from MongoDB with caching
import ClientGalleryPage from './ClientGalleryPage';
import dbConnect from '@/lib/mongodb';
import GalleryImage from '@/models/GalleryImage';

export const revalidate = 60;

async function getGalleryImages() {
  try {
    await dbConnect();
    const images = await GalleryImage.find({ isVisible: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    return images.map(img => ({
      ...img,
      _id: img._id.toString()
    }));
  } catch {
    // Fallback to local JSON on failure
    const localData = (await import('@/data/gallery.json')).default;
    return localData.map((item) => ({
      ...item,
      imageUrl: item.image,
      thumbnailUrl: item.image,
      category: 'All',
      isVisible: true,
    }));
  }
}

export default async function GalleryPage() {
  const images = await getGalleryImages();
  return <ClientGalleryPage images={images} />;
}
