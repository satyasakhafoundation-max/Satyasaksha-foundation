import './globals.css'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import RevealProvider from '@/components/RevealProvider'
import dbConnect from '@/lib/mongodb'
import SiteSettings from '@/models/SiteSettings'

const DEFAULTS = {
  siteName: 'Satyasaksha Foundation',
  tagline: 'the witness of truth',
  metaDescription: 'A premium, modern foundation dedicated to protecting nature, supporting communities, and acting with compassion.',
  metaKeywords: 'NGO, Foundation, Wildlife Conservation, Rural Education, Animal Welfare, Sustainability, India',
  shareImage: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1200&auto=format&fit=crop',
};

async function getSettings() {
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne({}).lean();
    return settings ? { ...DEFAULTS, ...settings } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export async function generateMetadata() {
  const s = await getSettings();
  const title = `${s.siteName} | The Witness of Truth`;
  const keywords = s.metaKeywords.split(',').map((k) => k.trim()).filter(Boolean);

  return {
    title,
    description: s.metaDescription,
    keywords,
    authors: [{ name: s.siteName }],
    creator: s.siteName,
    publisher: s.siteName,
    openGraph: {
      title,
      description: s.metaDescription,
      url: 'https://satyasakshafoundation.org',
      siteName: s.siteName,
      images: [{ url: s.shareImage, width: 1200, height: 630, alt: `${s.siteName} Hero Image` }],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: s.siteName,
      description: s.metaDescription,
      images: [s.shareImage],
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RevealProvider />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
