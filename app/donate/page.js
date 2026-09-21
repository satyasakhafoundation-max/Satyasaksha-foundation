// Server Component — queries SiteSettings from DB, cached for 60s
import ClientDonatePage from './ClientDonatePage';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { getPageContent } from '@/lib/pageContent';

export const revalidate = 60;

export const metadata = {
  title: 'Donate | Satyasaksha Foundation',
  description: 'Your contribution directly funds on-ground conservation, rural education, and animal welfare.',
};

const DEFAULT_PRESETS = [
  { amount: 500, description: 'Supports educational materials and outreach activities.' },
  { amount: 1000, description: 'Supports citizen-science and biodiversity documentation activities.' },
  { amount: 2500, description: 'Supports field-based conservation and awareness activities.' },
  { amount: 5000, description: 'Helps support a community or student-focused conservation programme.' },
];
const DEFAULT_TAX_NOTE = 'All donations are eligible for tax exemption under Section 80G of the Income Tax Act.';

async function getDonationSettings() {
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne({}).lean();
    return {
      presets: settings?.donationPresets?.length ? settings.donationPresets : DEFAULT_PRESETS,
      taxNote: settings?.donationTaxNote || DEFAULT_TAX_NOTE,
    };
  } catch {
    return { presets: DEFAULT_PRESETS, taxNote: DEFAULT_TAX_NOTE };
  }
}

export default async function DonatePage() {
  const [{ presets, taxNote }, content] = await Promise.all([getDonationSettings(), getPageContent('donate')]);
  return <ClientDonatePage presets={presets} taxNote={taxNote} content={content} />;
}
