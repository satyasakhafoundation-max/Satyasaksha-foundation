import mongoose from 'mongoose';

// Singleton document — there is only ever one SiteSettings row.
const SiteSettingsSchema = new mongoose.Schema(
  {
    // Branding
    siteName: { type: String, default: 'Satyasaksha Foundation' },
    tagline: { type: String, default: 'the witness of truth' },

    // SEO / social share
    metaDescription: {
      type: String,
      default: 'A premium, modern foundation dedicated to protecting nature, supporting communities, and acting with compassion.',
    },
    metaKeywords: {
      type: String,
      default: 'NGO, Foundation, Wildlife Conservation, Rural Education, Animal Welfare, Sustainability, India',
    },
    shareImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1200&auto=format&fit=crop',
    },

    // Contact info — single source of truth for both /contact and the Footer
    address: { type: String, default: 'Satyasaksha Foundation\nSector 12, Dwarka\nNew Delhi, 110075, India' },
    phone: { type: String, default: '+91 98765 43210' },
    phoneHours: { type: String, default: 'Mon-Sat, 9am - 6pm' },
    emergencyPhone: { type: String, default: '+91 98765 11111' },
    emergencyPhoneLabel: { type: String, default: 'Animal Rescue' },
    email: { type: String, default: 'contact@satyasakshafoundation.org' },
    partnershipsEmail: { type: String, default: 'partnerships@satyasakshafoundation.org' },

    // Social links — empty means "not linked yet" on the public site
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },

    // Footer
    footerDescription: {
      type: String,
      default: 'A non-profit organisation dedicated to protecting nature, supporting communities and empowering lives across the nation.',
    },
    copyrightName: { type: String, default: 'Satyasaksha Foundation' },

    // Donation settings — single source of truth for the homepage CTA and /donate page
    donationPresets: {
      type: [
        {
          amount: { type: Number, required: true, min: 1 },
          description: { type: String, default: '' },
        },
      ],
      default: [
        { amount: 500, description: 'Supports educational materials and outreach activities.' },
        { amount: 1000, description: 'Supports citizen-science and biodiversity documentation activities.' },
        { amount: 2500, description: 'Supports field-based conservation and awareness activities.' },
        { amount: 5000, description: 'Helps support a community or student-focused conservation programme.' },
      ],
    },
    donationTaxNote: {
      type: String,
      default: 'All donations are eligible for tax exemption under Section 80G of the Income Tax Act.',
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
