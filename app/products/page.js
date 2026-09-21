// Server Component — queries Product from DB, cached for 60s
import ClientProductsPage from './ClientProductsPage';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getPageContent } from '@/lib/pageContent';

export const revalidate = 60;

export const metadata = {
  title: 'Merchandise | Satyasaksha Foundation',
  description: 'Support our mission with handpicked merchandise — key chains, brooches, book marks, wind chimes, tote bags, and more.',
};

async function getProducts() {
  try {
    await dbConnect();
    const products = await Product.find({ isVisible: true }).sort({ order: 1 }).lean();
    return products.map((p) => ({ ...p, _id: p._id.toString() }));
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const [products, content] = await Promise.all([getProducts(), getPageContent('products')]);
  return <ClientProductsPage products={products} content={content} />;
}
