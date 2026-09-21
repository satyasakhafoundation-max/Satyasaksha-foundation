import dbConnect from './mongodb';
import PageContent from '@/models/PageContent';
import { getPageDefaults } from './pageContentSchema';

// Used by public pages: returns a plain { key: value } object — the
// registry's defaults with any admin-saved overrides merged on top, so a
// page never has to handle "field not set yet" itself.
export async function getPageContent(slug) {
  const defaults = getPageDefaults(slug);
  try {
    await dbConnect();
    const doc = await PageContent.findOne({ slug }).lean();
    return { ...defaults, ...(doc?.data || {}) };
  } catch {
    return defaults;
  }
}
