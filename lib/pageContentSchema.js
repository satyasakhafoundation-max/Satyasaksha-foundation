// Registry of admin-editable text/image fields per public page.
// Each page gets one PageContent document (see models/PageContent.js).
// The admin "Page Content" screen renders a form driven entirely by this
// file — add a field here and it shows up in the admin UI automatically.

export const PAGE_CONTENT_SCHEMA = {
  home: {
    label: 'Homepage',
    sections: [
      {
        title: 'Hero',
        fields: [
          { key: 'heroLabel', label: 'Label', type: 'text', default: 'Satyasaksha Foundation' },
          { key: 'heroTitleLine1', label: 'Title — Line 1', type: 'text', default: 'Protecting Nature.' },
          { key: 'heroTitleLine2', label: 'Title — Line 2 (italic accent)', type: 'text', default: 'Empowering People.' },
          { key: 'heroTitleLine3', label: 'Title — Line 3', type: 'text', default: 'Creating Impact.' },
          { key: 'heroSubtitle', label: 'Subtitle', type: 'textarea', default: 'The witness of truth — committed to protecting nature, empowering communities and acting with compassion across every initiative we undertake.' },
          { key: 'heroCta1Label', label: 'Primary Button Label', type: 'text', default: 'Donate Now' },
          { key: 'heroCta2Label', label: 'Secondary Button Label', type: 'text', default: 'Explore Our Work' },
          { key: 'stat1Number', label: 'Stat 1 — Number', type: 'text', default: '10+' },
          { key: 'stat1Label', label: 'Stat 1 — Label', type: 'text', default: 'Focus Areas' },
          { key: 'stat2Number', label: 'Stat 2 — Number', type: 'text', default: '2026' },
          { key: 'stat2Label', label: 'Stat 2 — Label', type: 'text', default: 'Established' },
          { key: 'stat3Number', label: 'Stat 3 — Number', type: 'text', default: '∞' },
          { key: 'stat3Label', label: 'Stat 3 — Label', type: 'text', default: 'Compassion' },
        ],
      },
      {
        title: 'About Snippet',
        fields: [
          { key: 'aboutLabel', label: 'Label', type: 'text', default: 'Who We Are' },
          { key: 'aboutHeadingLine1', label: 'Heading — Line 1', type: 'text', default: 'A Foundation Built on' },
          { key: 'aboutHeadingLine2', label: 'Heading — Line 2 (italic accent)', type: 'text', default: 'Truth and Compassion' },
          { key: 'aboutPara1', label: 'Paragraph 1', type: 'textarea', default: 'Satyasaksha Foundation — the witness of truth — is a non-profit organisation dedicated to protecting nature, supporting communities and empowering lives. Our name reflects our commitment to honest, transparent and accountable action across every initiative we undertake.' },
          { key: 'aboutPara2', label: 'Paragraph 2', type: 'textarea', default: "Inspired by the elephant's wisdom, the owl's discernment and the tree's rootedness, we work across wildlife conservation, environmental sustainability, education, animal welfare and community development." },
          { key: 'aboutButtonLabel', label: 'Button Label', type: 'text', default: 'Learn Our Story' },
          { key: 'aboutImage', label: 'Image', type: 'image', default: 'https://images.unsplash.com/photo-1587401138472-887e5b2254be?q=80&w=1200&auto=format&fit=crop' },
        ],
      },
      {
        title: 'Mission & Vision',
        fields: [
          { key: 'missionQuote', label: 'Central Quote', type: 'textarea', default: 'The witness of truth — committed to protecting nature, empowering communities and acting with compassion.' },
          { key: 'visionIcon', label: 'Vision — Icon', type: 'text', default: '🌱' },
          { key: 'visionTitle', label: 'Vision — Title', type: 'text', default: 'A Thriving World for All Living Beings' },
          { key: 'visionText', label: 'Vision — Text', type: 'textarea', default: 'A world where nature thrives, every community flourishes, and truth guides purposeful action — a future built on compassion, knowledge and collective harmony.' },
          { key: 'missionIcon', label: 'Mission — Icon', type: 'text', default: '🎯' },
          { key: 'missionTitle', label: 'Mission — Title', type: 'text', default: 'Protect. Empower. Act With Truth.' },
          { key: 'missionText', label: 'Mission — Text', type: 'textarea', default: 'To protect wildlife, conserve natural environments, empower communities through education and skill development, and uphold animal welfare through honest, impactful action.' },
        ],
      },
      {
        title: 'Section Intros',
        fields: [
          { key: 'focusAreasLabel', label: 'Focus Areas — Label', type: 'text', default: 'What We Do' },
          { key: 'focusAreasHeading', label: 'Focus Areas — Heading', type: 'text', default: 'Our Areas of Work' },
          { key: 'focusAreasIntro', label: 'Focus Areas — Intro', type: 'textarea', default: 'Nine interconnected domains — each a critical pillar of our mission for a more just, compassionate and sustainable world.' },
          { key: 'impactLabel', label: 'Impact Section — Label', type: 'text', default: 'Our Impact & Work' },
          { key: 'impactHeading', label: 'Impact Section — Heading', type: 'text', default: 'Every Action, Every Life' },
          { key: 'newsHeading', label: 'Latest Stories — Heading', type: 'text', default: 'Latest Stories' },
        ],
      },
    ],
  },

  about: {
    label: 'About Page',
    sections: [
      {
        title: 'Hero',
        fields: [
          { key: 'heroTitle', label: 'Title', type: 'text', default: 'About Us' },
          { key: 'heroSubtitle', label: 'Subtitle', type: 'textarea', default: 'Discover the origins, the people, and the unwavering philosophy behind Satyasaksha Foundation.' },
          { key: 'heroImage', label: 'Background Image', type: 'image', default: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2500&auto=format&fit=crop' },
        ],
      },
      {
        title: 'Our Story',
        fields: [
          { key: 'storyLabel', label: 'Label', type: 'text', default: 'Our Origin' },
          { key: 'storyHeadingLine1', label: 'Heading — Plain', type: 'text', default: 'Rooted in' },
          { key: 'storyHeadingLine2', label: 'Heading — Italic Accent', type: 'text', default: 'Compassion' },
          { key: 'storyPara1', label: 'Paragraph 1', type: 'textarea', default: 'Founded with a deep commitment to truth and environmental stewardship, the Satyasaksha Foundation began as a small collective of conservationists and educators. Today, we have grown into a nationwide movement, bound by the simple belief that every action, no matter how small, can protect a life and preserve our natural world.' },
          { key: 'storyPara2', label: 'Paragraph 2', type: 'textarea', default: 'Our name, meaning "the witness of truth," dictates our operational transparency. We don\'t just advocate for change; we act. Whether it is reforesting barren lands, rescuing injured wildlife, or building schools in remote villages, our work is a testament to what collective human compassion can achieve.' },
          { key: 'storyImage', label: 'Image', type: 'image', default: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1200&auto=format&fit=crop' },
        ],
      },
      {
        title: 'Core Values Section',
        fields: [
          { key: 'coreValuesHeading', label: 'Heading', type: 'text', default: 'Our Core Values' },
        ],
      },
    ],
  },

  team: {
    label: 'Team Page',
    sections: [
      {
        title: 'Hero',
        fields: [
          { key: 'heroTitle', label: 'Title', type: 'text', default: 'Our Team' },
          { key: 'heroSubtitle', label: 'Subtitle', type: 'textarea', default: "Meet the people driving Satyasaksha Foundation's mission forward, on the ground and behind the scenes." },
          { key: 'heroImage', label: 'Background Image', type: 'image', default: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2500&auto=format&fit=crop' },
        ],
      },
      {
        title: 'Team Grid',
        fields: [
          { key: 'gridLabel', label: 'Label', type: 'text', default: 'Leadership' },
          { key: 'gridHeading', label: 'Heading', type: 'text', default: 'Board of Directors' },
        ],
      },
    ],
  },

  donate: {
    label: 'Donate Page',
    sections: [
      {
        title: 'Hero',
        fields: [
          { key: 'heroTitle', label: 'Title', type: 'text', default: 'Make a Donation' },
          { key: 'heroSubtitle', label: 'Subtitle', type: 'textarea', default: 'Your contribution directly funds on-ground conservation, rural education, and animal welfare.' },
          { key: 'heroImage', label: 'Background Image', type: 'image', default: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2500&auto=format&fit=crop' },
        ],
      },
      {
        title: 'Why Donate',
        fields: [
          { key: 'whyDonateHeading', label: 'Heading', type: 'text', default: 'Why Donate?' },
          { key: 'whyDonateIntro', label: 'Intro', type: 'textarea', default: 'Satyasaksha Foundation operates on a model of absolute transparency. 100% of public donations are routed directly to field projects, while administrative costs are covered by our founding board.' },
        ],
      },
    ],
  },

  getInvolved: {
    label: 'Get Involved Page',
    sections: [
      {
        title: 'Hero',
        fields: [
          { key: 'heroTitle', label: 'Title', type: 'text', default: 'Get Involved' },
          { key: 'heroSubtitle', label: 'Subtitle', type: 'textarea', default: 'It takes a collective effort to create lasting change. Join us in our mission to protect nature and empower communities.' },
          { key: 'heroImage', label: 'Background Image', type: 'image', default: 'https://images.unsplash.com/photo-1593113544331-591dc45e8568?q=80&w=2500&auto=format&fit=crop' },
        ],
      },
      {
        title: 'Member CTA',
        fields: [
          { key: 'memberHeading', label: 'Heading', type: 'text', default: 'Become a Foundation Member' },
          { key: 'memberText', label: 'Text', type: 'textarea', default: 'Join an exclusive network of deeply committed supporters. Members receive quarterly physical reports, invitations to closed-door strategy meetings, and VIP access to our annual gala.' },
          { key: 'memberButtonLabel', label: 'Button Label', type: 'text', default: 'Inquire About Membership' },
          { key: 'memberImage', label: 'Image', type: 'image', default: 'https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=1200&auto=format&fit=crop' },
        ],
      },
    ],
  },

  contact: {
    label: 'Contact Page',
    sections: [
      {
        title: 'Hero',
        fields: [
          { key: 'heroTitle', label: 'Title', type: 'text', default: 'Contact Us' },
          { key: 'heroSubtitle', label: 'Subtitle', type: 'textarea', default: 'Have a question, partnership proposal, or want to report an animal in need? We are here to listen.' },
          { key: 'heroImage', label: 'Background Image', type: 'image', default: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2500&auto=format&fit=crop' },
        ],
      },
      {
        title: 'Info Section',
        fields: [
          { key: 'sectionHeading', label: 'Heading', type: 'text', default: 'Get in Touch' },
          { key: 'sectionIntro', label: 'Intro', type: 'textarea', default: 'Our headquarters are located in New Delhi, but our operations span across the country. Feel free to reach out to our primary desk.' },
        ],
      },
    ],
  },

  impact: {
    label: 'Impact & Work Page',
    sections: [
      {
        title: 'Hero',
        fields: [
          { key: 'heroTitle', label: 'Title', type: 'text', default: 'Our Impact & Work' },
          { key: 'heroSubtitle', label: 'Subtitle', type: 'textarea', default: 'Transparency and measurable outcomes. See how your support translates into real-world change — and the work behind it.' },
          { key: 'heroImage', label: 'Background Image', type: 'image', default: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2500&auto=format&fit=crop' },
        ],
      },
      {
        title: 'Stats Section',
        fields: [
          { key: 'statsLabel', label: 'Label', type: 'text', default: 'By The Numbers' },
          { key: 'statsHeading', label: 'Heading', type: 'text', default: 'Cumulative Impact' },
        ],
      },
      {
        title: 'Narrative',
        fields: [
          { key: 'narrativeHeading', label: 'Heading', type: 'text', default: 'Beyond the Numbers' },
          { key: 'narrativePara1', label: 'Paragraph 1', type: 'textarea', default: "While statistics provide a measurable snapshot of our work, the true impact is found in the stories of the lives we've touched. It's in the eyes of a rescued elephant returning to the wild, the smile of a child holding their first textbook, and the pride of a farmer who now sustains their family with dignity." },
          { key: 'narrativePara2', label: 'Paragraph 2', type: 'textarea', default: 'We are committed to rigorous monitoring and evaluation, ensuring that every rupee donated is maximized for ecological and social return on investment.' },
          { key: 'narrativeButtonLabel', label: 'Button Label', type: 'text', default: 'Read Impact Stories' },
          { key: 'narrativeImage', label: 'Image', type: 'image', default: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop' },
        ],
      },
    ],
  },

  news: {
    label: 'News Page',
    sections: [
      {
        title: 'Hero',
        fields: [
          { key: 'heroTitle', label: 'Title', type: 'text', default: 'News & Updates' },
          { key: 'heroSubtitle', label: 'Subtitle', type: 'textarea', default: 'Stay informed about our latest initiatives, milestones, and stories from the field.' },
          { key: 'heroImage', label: 'Background Image', type: 'image', default: 'https://images.unsplash.com/photo-1584907600572-0402b85e0503?q=80&w=2500&auto=format&fit=crop' },
        ],
      },
    ],
  },

  privacyPolicy: {
    label: 'Privacy Policy',
    sections: [
      {
        title: 'Content',
        fields: [
          { key: 'title', label: 'Page Title', type: 'text', default: 'Privacy Policy' },
          { key: 'lastUpdated', label: 'Last Updated', type: 'text', default: '' },
          { key: 'body', label: 'Body (HTML supported)', type: 'richtext', default: '<p>Add your privacy policy content here from the admin panel.</p>' },
        ],
      },
    ],
  },

  terms: {
    label: 'Terms of Service',
    sections: [
      {
        title: 'Content',
        fields: [
          { key: 'title', label: 'Page Title', type: 'text', default: 'Terms of Service' },
          { key: 'lastUpdated', label: 'Last Updated', type: 'text', default: '' },
          { key: 'body', label: 'Body (HTML supported)', type: 'richtext', default: '<p>Add your terms of service content here from the admin panel.</p>' },
        ],
      },
    ],
  },
};

export const PAGE_CONTENT_SLUGS = Object.keys(PAGE_CONTENT_SCHEMA);

export function getPageDefaults(slug) {
  const page = PAGE_CONTENT_SCHEMA[slug];
  if (!page) return {};
  const defaults = {};
  for (const section of page.sections) {
    for (const field of section.fields) {
      defaults[field.key] = field.default ?? '';
    }
  }
  return defaults;
}
