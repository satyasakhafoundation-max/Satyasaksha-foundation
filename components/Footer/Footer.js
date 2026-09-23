// Server Component — queries SiteSettings from DB, cached for 60s
import ClientFooter from './ClientFooter';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export const revalidate = 60;

const DEFAULT_SETTINGS = {
  siteName: 'Satyasaksha Foundation',
  tagline: 'the witness of truth',
  footerDescription: 'A non-profit organisation dedicated to protecting nature, supporting communities and empowering lives across the nation.',
  copyrightName: 'Satyasaksha Foundation',
  address: 'Satyasaksha Foundation\nSector 12, Dwarka\nNew Delhi, 110075, India',
  email: 'contact@satyasakshafoundation.org',
  phone: '+91 98765 43210',
  facebookUrl: '',
  instagramUrl: '',
  twitterUrl: '',
  linkedinUrl: '',
};

async function getSettings() {
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne({}).lean();
    return settings ? { ...DEFAULT_SETTINGS, ...settings } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default async function Footer() {
  const settings = await getSettings();
  // Pass only the plain string fields ClientFooter actually renders — the
  // raw .lean() result also carries a Mongoose ObjectId (_id), Date fields,
  // and other non-plain values that React can't serialize across the
  // Server->Client Component boundary.
  const {
    siteName, tagline, footerDescription, copyrightName,
    address, email, phone,
    facebookUrl, instagramUrl, twitterUrl, linkedinUrl,
  } = settings;
  return (
    <ClientFooter
      settings={{
        siteName, tagline, footerDescription, copyrightName,
        address, email, phone,
        facebookUrl, instagramUrl, twitterUrl, linkedinUrl,
      }}
    />
  );
}
