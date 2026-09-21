// Server Component — queries SiteSettings from DB, cached for 60s
import ClientContactPage from './ClientContactPage';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { getPageContent } from '@/lib/pageContent';

export const revalidate = 60;

export const metadata = {
  title: 'Contact Us | Satyasaksha Foundation',
  description: 'Have a question, partnership proposal, or want to report an animal in need? We are here to listen.',
};

const DEFAULT_SETTINGS = {
  address: 'Satyasaksha Foundation\nSector 12, Dwarka\nNew Delhi, 110075, India',
  phone: '+91 98765 43210',
  phoneHours: 'Mon-Sat, 9am - 6pm',
  emergencyPhone: '+91 98765 11111',
  emergencyPhoneLabel: 'Animal Rescue',
  email: 'contact@satyasakshafoundation.org',
  partnershipsEmail: 'partnerships@satyasakshafoundation.org',
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

export default async function ContactPage() {
  const [settings, content] = await Promise.all([getSettings(), getPageContent('contact')]);
  return <ClientContactPage settings={settings} content={content} />;
}
