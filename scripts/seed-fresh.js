import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Schemas matching the application models
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
    isActive: { type: Boolean, default: true },
    inviteToken: { type: String, select: false },
    inviteTokenExpiry: { type: Date, select: false },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  logoUrl: { type: String, required: true },
  websiteUrl: { type: String, default: '' },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  quote: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const NewsArticleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, trim: true, lowercase: true },
  excerpt: { type: String, required: true },
  content: { type: String, default: '' },
  category: {
    type: String,
    required: true,
    enum: ['Environment', 'Animal Welfare', 'Community', 'Wildlife', 'Foundation', 'Education', 'Other'],
    default: 'Foundation',
  },
  imageUrl: { type: String, default: '' },
  author: { type: String, default: 'Satyasaksha Foundation' },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

const GalleryImageSchema = new mongoose.Schema(
  {
    caption: { type: String, required: true, trim: true },
    publicId: { type: String, default: '' },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    category: {
      type: String,
      enum: ['All', 'Wildlife', 'Community', 'Events', 'Environment', 'Other'],
      default: 'All',
    },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ImpactStatSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    label: { type: String, required: true, trim: true },
    value: { type: Number, required: true, min: 0 },
    prefix: { type: String, default: '' },
    suffix: { type: String, default: '' },
    icon: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const FocusAreaSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    icon: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    color: { type: String, required: true },
    link: { type: String, required: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, enum: ['general', 'volunteer', 'partner', 'rescue'], default: 'general' },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Partner = mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
const NewsArticle = mongoose.models.NewsArticle || mongoose.model('NewsArticle', NewsArticleSchema);
const GalleryImage = mongoose.models.GalleryImage || mongoose.model('GalleryImage', GalleryImageSchema);
const ImpactStat = mongoose.models.ImpactStat || mongoose.model('ImpactStat', ImpactStatSchema);
const FocusArea = mongoose.models.FocusArea || mongoose.model('FocusArea', FocusAreaSchema);
const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);

async function seedData() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment.');
  }

  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB successfully.');

  // 1. Seed Admins
  console.log('--- Seeding Admin Users ---');
  await User.deleteMany({});
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@satyasaksha.org';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin98765';

  const superAdmin = new User({
    name: 'Satyasaksha Super Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'super_admin',
    isActive: true,
  });
  await superAdmin.save();

  const secondaryAdmin = new User({
    name: 'Field Operations Admin',
    email: 'editor@satyasaksha.org',
    password: adminPassword,
    role: 'admin',
    isActive: true,
  });
  await secondaryAdmin.save();
  console.log(`Created 2 Admins: ${adminEmail} (super_admin) & editor@satyasaksha.org (admin)`);

  // 2. Seed Partners
  console.log('--- Seeding Partners ---');
  await Partner.deleteMany({});
  const partners = [
    {
      name: 'Wildlife Trust of India',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Wildlife_Trust_of_India_logo.svg/1200px-Wildlife_Trust_of_India_logo.svg.png',
      websiteUrl: 'https://www.wti.org.in/',
      isVisible: true,
      order: 1,
    },
    {
      name: 'WWF India',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/24/WWF_logo.svg/1200px-WWF_logo.svg.png',
      websiteUrl: 'https://www.wwfindia.org/',
      isVisible: true,
      order: 2,
    },
    {
      name: 'Nature Forever Society',
      logoUrl: 'https://www.natureforever.org/images/logo.png',
      websiteUrl: 'https://www.natureforever.org/',
      isVisible: true,
      order: 3,
    },
    {
      name: 'Bombay Natural History Society',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ce/BNHS_Logo.jpg',
      websiteUrl: 'https://www.bnhs.org/',
      isVisible: true,
      order: 4,
    },
    {
      name: 'Wildlife SOS',
      logoUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=300&h=120&fit=crop&q=80',
      websiteUrl: 'https://wildlifesos.org/',
      isVisible: true,
      order: 5,
    },
    {
      name: 'Sanctuary Nature Foundation',
      logoUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=300&h=120&fit=crop&q=80',
      websiteUrl: 'https://sanctuarynaturefoundation.org/',
      isVisible: true,
      order: 6,
    },
    {
      name: 'EcoRestore India',
      logoUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300&h=120&fit=crop&q=80',
      websiteUrl: 'https://example.org/ecorestore',
      isVisible: true,
      order: 7,
    },
    {
      name: 'Centre for Wildlife Studies',
      logoUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&h=120&fit=crop&q=80',
      websiteUrl: 'https://cwsindia.org/',
      isVisible: true,
      order: 8,
    },
  ];
  await Partner.insertMany(partners);
  console.log(`Seeded ${partners.length} Partners.`);

  // 3. Seed Testimonials
  console.log('--- Seeding Testimonials ---');
  await Testimonial.deleteMany({});
  const testimonials = [
    {
      name: 'Dr. Priya Sharma',
      title: 'Senior Wildlife Biologist, WWF India',
      quote: "Satyasaksha Foundation's commitment to evidence-based conservation is rare and deeply inspiring. Their field teams operate with both heart and scientific rigour across critical wildlife corridors.",
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
      isVisible: true,
      order: 1,
    },
    {
      name: 'Rahul Menon',
      title: 'Rural Education Volunteer & Tech Mentor',
      quote: "Volunteering with the foundation changed my perspective on what genuine community-led change looks like. The transformation in children's confidence in these villages is both real and lasting.",
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      isVisible: true,
      order: 2,
    },
    {
      name: 'Anita Joshi',
      title: 'Philanthropist & Supporter since 2023',
      quote: "I have supported several NGOs, but Satyasaksha Foundation's granular transparency reports and direct field stories make me confident every single rupee is creating measurable impact on the ground.",
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80',
      isVisible: true,
      order: 3,
    },
    {
      name: 'Vikramaditya Rathore',
      title: 'Forest Range Officer, Western Ghats Division',
      quote: "The rapid response rescue unit established by Satyasaksha Foundation has averted dozens of human-wildlife conflict incidents in our jurisdiction over the past 12 months alone.",
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
      isVisible: true,
      order: 4,
    },
    {
      name: 'Sunita Patel',
      title: 'Village Pradhan & Community Leader',
      quote: "Before the foundation arrived, our village had neither emergency vet care nor digital classes for children. Today, our community is self-sufficient and protective of our forest borders.",
      avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&q=80',
      isVisible: true,
      order: 5,
    },
    {
      name: 'David Anderson',
      title: 'Ecological Policy Advisor, Global Green Alliance',
      quote: "Their grassroots methodology sets a gold standard for NGO field work. Transparent governance combined with relentless community trust.",
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80',
      isVisible: true,
      order: 6,
    },
  ];
  await Testimonial.insertMany(testimonials);
  console.log(`Seeded ${testimonials.length} Testimonials.`);

  // 4. Seed News Articles
  console.log('--- Seeding News Articles ---');
  await NewsArticle.deleteMany({});
  const now = new Date();
  const news = [
    {
      title: 'New Wildlife Emergency Rescue Center Inaugurated in Western Ghats',
      slug: 'wildlife-rescue-center-western-ghats',
      excerpt: 'Our newly opened state-of-the-art facility will provide 24/7 critical veterinary trauma care to injured wildlife along high-risk transit corridors.',
      content: `
        <p>The Western Ghats is one of the world's eight biodiversity hotspots, yet wildlife encounters with roads and agricultural fencing have caused steady casualties. Today, Satyasaksha Foundation proudly inaugurates its <strong>Western Ghats Wildlife Emergency Care Station</strong>.</p>
        <p>Equipped with mobile surgery capabilities, dedicated quarantine wards for leopards and deer, and an emergency hotline for forest patrol guards, this facility will slash medical response times from 6 hours down to under 45 minutes.</p>
        <h3>Core Facilities</h3>
        <ul>
          <li>Mobile veterinary ambulance with oxygen concentrator and digital X-ray.</li>
          <li>Species-specific rehabilitation enclosures designed for minimal human contact.</li>
          <li>Direct integration with district forest officer dispatch teams.</li>
        </ul>
      `,
      category: 'Wildlife',
      imageUrl: 'https://images.unsplash.com/photo-1564750541785-5b43064e4210?w=1200&q=80',
      author: 'Conservation Desk',
      isPublished: true,
      publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Empowering 500 Rural Girls with Digital Literacy & STEM Skills',
      slug: 'empowering-500-rural-girls-stem',
      excerpt: 'Through our grassroots rural learning centres, over 500 adolescent girls in remote taluks have begun receiving coding instruction and digital tools.',
      content: `
        <p>Bridging the digital divide is paramount for equitable social progress. Satyasaksha Foundation completed Phase II of the <em>Gyan Setu</em> initiative this week, establishing computer learning labs across six remote village schools.</p>
        <p>Each student receives 120 hours of mentored training covering computer fundamentals, typing, internet research, and basic Python programming.</p>
      `,
      category: 'Education',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80',
      author: 'Education Outreach Team',
      isPublished: true,
      publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Annual Coastal Clean-up Removes Over 2.5 Tons of Marine Plastic',
      slug: 'annual-coastal-cleanup-2-tons-plastic',
      excerpt: 'More than 350 volunteer conservationists mobilized across three coastal stretches to intercept marine plastic debris before high tide.',
      content: `
        <p>Discarded fishing nets, single-use plastics, and industrial packaging pose an existential threat to olive ridley turtle nesting sites along our coasts. This past weekend, our volunteers cleared 2,640 kilograms of marine litter.</p>
        <p>All collected plastics were sorted and handed over to certified local recyclers for transformation into construction pavers.</p>
      `,
      category: 'Environment',
      imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80fbea5?w=1200&q=80',
      author: 'Marine & Coast Initiative',
      isPublished: true,
      publishedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Community-Led Afforestation Revives 50 Hectares of Native Scrub Forest',
      slug: 'community-afforestation-50-hectares',
      excerpt: 'Working alongside indigenous farmers, our afforestation drive successfully planted 25,000 native saplings with an 88% survival rate.',
      content: `
        <p>Monoculture tree plantations often do more harm than good to local hydrology. Our Miyawaki and native reforestation projects focus exclusively on endemic species like Neem, Banyan, Jamun, and Mahua.</p>
        <p>By employing local guardians as paid stewards, we ensure high sapling survival and sustained groundwater recharge.</p>
      `,
      category: 'Environment',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80',
      author: 'Eco Stewardship Council',
      isPublished: true,
      publishedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Mass Anti-Rabies Vaccination & Health Camp Treats 1,200 Community Animals',
      slug: 'anti-rabies-vaccination-1200-animals',
      excerpt: 'Our veterinary outreach unit conducted a three-day intensive vaccination drive ensuring human-animal safety and rabies prevention.',
      content: `
        <p>Humane population management and preventive healthcare are essential to peaceful community coexistence. Over 72 hours, our veterinary team vaccinated, dewormed, and micro-collared 1,240 street canines and equines.</p>
      `,
      category: 'Animal Welfare',
      imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200&q=80',
      author: 'Veterinary Services Desk',
      isPublished: true,
      publishedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Satyasaksha Foundation Announces 2026 Grassroots Conservation Fellowship',
      slug: 'grassroots-conservation-fellowship-2026',
      excerpt: 'Applications are now open for early-career researchers, wildlife photographers, and rural organizers passionate about ecological protection.',
      content: `
        <p>We are delighted to announce our inaugural 12-month Fellowship offering stipends, mentorship, and field logistics to six passionate youth working at the frontlines of conservation.</p>
      `,
      category: 'Foundation',
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&q=80',
      author: 'Leadership Board',
      isPublished: true,
      publishedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
    },
  ];
  await NewsArticle.insertMany(news);
  console.log(`Seeded ${news.length} News Articles.`);

  // 5. Seed Gallery Images
  console.log('--- Seeding Gallery Images ---');
  await GalleryImage.deleteMany({});
  const gallery = [
    {
      caption: 'Rescued Elephant Calf safely returned to wild herd in reserve forest',
      imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=1200&auto=format&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=600&h=400&auto=format&fit=crop',
      category: 'Wildlife',
      order: 1,
      isVisible: true,
    },
    {
      caption: 'Community education workshop on organic and pesticide-free farming',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&h=400&auto=format&fit=crop',
      category: 'Community',
      order: 2,
      isVisible: true,
    },
    {
      caption: 'Native saplings plantation drive restoring degraded catchment areas',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&h=400&auto=format&fit=crop',
      category: 'Environment',
      order: 3,
      isVisible: true,
    },
    {
      caption: 'Field camera trap monitoring of endangered leopard populations',
      imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&h=400&auto=format&fit=crop',
      category: 'Wildlife',
      order: 4,
      isVisible: true,
    },
    {
      caption: 'Volunteer teams cleaning plastic waste from natural riverbeds',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&h=400&auto=format&fit=crop',
      category: 'Events',
      order: 5,
      isVisible: true,
    },
    {
      caption: 'Free distribution of educational kits to tribal primary school children',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&h=400&auto=format&fit=crop',
      category: 'Community',
      order: 6,
      isVisible: true,
    },
    {
      caption: 'Rejuvenated lush riparian canopy after two seasons of care',
      imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1200&auto=format&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=600&h=400&auto=format&fit=crop',
      category: 'Environment',
      order: 7,
      isVisible: true,
    },
    {
      caption: 'Mobile Veterinary Trauma Unit on daily patrol for injured strays',
      imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=1200&auto=format&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=600&h=400&auto=format&fit=crop',
      category: 'Wildlife',
      order: 8,
      isVisible: true,
    },
    {
      caption: 'Gram Panchayat meeting aligning villagers on wildlife conflict prevention',
      imageUrl: 'https://images.unsplash.com/photo-1473649085228-583485e6e4d7?q=80&w=1200&auto=format&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1473649085228-583485e6e4d7?q=80&w=600&h=400&auto=format&fit=crop',
      category: 'Community',
      order: 9,
      isVisible: true,
    },
    {
      caption: 'Youth environmental awareness camp and forest flora tour',
      imageUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=1200&auto=format&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=600&h=400&auto=format&fit=crop',
      category: 'Events',
      order: 10,
      isVisible: true,
    },
    {
      caption: 'Healthcare and preventive screening camp for rural elderly citizens',
      imageUrl: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?q=80&w=1200&auto=format&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?q=80&w=600&h=400&auto=format&fit=crop',
      category: 'Community',
      order: 11,
      isVisible: true,
    },
    {
      caption: 'Pristine mountain stream protected under Community Forest Conservation Pact',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600&h=400&auto=format&fit=crop',
      category: 'Environment',
      order: 12,
      isVisible: true,
    },
  ];
  await GalleryImage.insertMany(gallery);
  console.log(`Seeded ${gallery.length} Gallery Images.`);

  // 6. Seed Impact Stats
  console.log('--- Seeding Impact Stats ---');
  await ImpactStat.deleteMany({});
  const impactStats = [
    { id: 'lives', label: 'Lives Touched', value: 18500, prefix: '', suffix: '+', icon: '👥', order: 1 },
    { id: 'students', label: 'Students Supported', value: 5400, prefix: '', suffix: '+', icon: '📚', order: 2 },
    { id: 'animals', label: 'Animals Assisted', value: 3100, prefix: '', suffix: '+', icon: '🐾', order: 3 },
    { id: 'communities', label: 'Communities Reached', value: 145, prefix: '', suffix: '', icon: '🏡', order: 4 },
    { id: 'trees', label: 'Trees Planted', value: 62000, prefix: '', suffix: '+', icon: '🌱', order: 5 },
    { id: 'partners', label: 'Active Partners', value: 58, prefix: '', suffix: '+', icon: '🤝', order: 6 },
    { id: 'projects', label: 'Completed Projects', value: 52, prefix: '', suffix: '', icon: '✅', order: 7 },
    { id: 'years', label: 'Years of Service', value: 2, prefix: '', suffix: '+', icon: '🗓️', order: 8 },
  ];
  await ImpactStat.insertMany(impactStats);
  console.log(`Seeded ${impactStats.length} Impact Stats.`);

  // 7. Seed Focus Areas
  console.log('--- Seeding Focus Areas ---');
  await FocusArea.deleteMany({});
  const focusAreas = [
    { id: 'environment', title: 'Environment', icon: '🌱', description: 'Protecting fragile ecosystems, clean water, and native forests', color: '#1B4332', link: '/our-work#environment', order: 1, isVisible: true },
    { id: 'wildlife', title: 'Wildlife Conservation', icon: '🐾', description: 'Mitigating human-wildlife conflict and protecting habitats', color: '#2D6A4F', link: '/our-work#wildlife', order: 2, isVisible: true },
    { id: 'animal-welfare', title: 'Animal Welfare', icon: '🩺', description: 'Compassionate medical care, anti-rabies vaccination & rescue', color: '#40916C', link: '/our-work#animal-welfare', order: 3, isVisible: true },
    { id: 'education', title: 'Rural Education', icon: '📚', description: 'STEM labs, digital literacy, and scholarship for underprivileged children', color: '#52B788', link: '/our-work#education', order: 4, isVisible: true },
    { id: 'healthcare', title: 'Community Health', icon: '🏥', description: 'Mobile medical clinics, maternal support, and health awareness', color: '#B7E4C7', link: '/our-work#healthcare', order: 5, isVisible: true },
    { id: 'sports', title: 'Youth & Sports', icon: '🏃', description: 'Nurturing grassroots sports talent and healthy recreation', color: '#C9A84C', link: '/our-work#sports', order: 6, isVisible: true },
    { id: 'food', title: 'Annadan & Nutrition', icon: '🌾', description: 'Nutritious meals for impoverished families and disaster relief', color: '#D4AF37', link: '/our-work#food', order: 7, isVisible: true },
    { id: 'agriculture', title: 'Sustainable Farming', icon: '🚜', description: 'Promoting regenerative agriculture, seed banks, and water conservation', color: '#5C4827', link: '/our-work#agriculture', order: 8, isVisible: true },
    { id: 'research', title: 'Ecological Research', icon: '🔬', description: 'Data-driven ecological studies and policy recommendations', color: '#1F2937', link: '/our-work#research', order: 9, isVisible: true },
  ];
  await FocusArea.insertMany(focusAreas);
  console.log(`Seeded ${focusAreas.length} Focus Areas.`);

  // 8. Seed Contact Submissions
  console.log('--- Seeding Contact Inbox Submissions ---');
  await ContactMessage.deleteMany({});
  const contactMessages = [
    {
      name: 'Rohan Deshmukh',
      email: 'rohan.deshmukh@gmail.com',
      subject: 'volunteer',
      message: 'Hello, I am a software engineer and avid birdwatcher based in Bangalore. I would love to volunteer my weekends for digital education and wildlife telemetry mapping.',
      isRead: false,
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    },
    {
      name: 'Dr. Meenakshi Sundaram',
      email: 'm.sundaram@eco-institute.ac.in',
      subject: 'partner',
      message: 'We are conducting an assessment on riparian forest corridors in Karnataka and would like to partner with Satyasaksha Foundation for ground logistics and community outreach.',
      isRead: false,
      createdAt: new Date(now.getTime() - 14 * 60 * 60 * 1000),
    },
    {
      name: 'Girish Kumar',
      email: 'girish.vetcare@outlook.com',
      subject: 'rescue',
      message: 'Urgent rescue notification: Injured sambar deer spotted near the perimeter of Bannerghatta outer forest reserve. Kindly dispatch mobile rescue squad if available.',
      isRead: true,
      createdAt: new Date(now.getTime() - 28 * 60 * 60 * 1000),
    },
    {
      name: 'Aarav Mehta',
      email: 'aarav.mehta@yahoo.co.in',
      subject: 'general',
      message: 'I would like to organize an environmental awareness talk by your foundation representatives at our high school in Mysore next month. Whom should I coordinate with?',
      isRead: true,
      createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
    },
  ];
  await ContactMessage.insertMany(contactMessages);
  console.log(`Seeded ${contactMessages.length} Contact Messages.`);

  console.log('\n=============================================');
  console.log('All fresh database data seeded successfully!');
  console.log('=============================================');
  process.exit(0);
}

seedData().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
