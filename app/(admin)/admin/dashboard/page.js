'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const cards = [
  { href: '/admin/dashboard/stats', icon: '📈', title: 'Impact Stats', desc: 'Edit live impact numbers shown on the homepage and impact page.' },
  { href: '/admin/dashboard/focus-areas', icon: '🌿', title: 'Focus Areas', desc: 'Add, edit or hide the 9 work domains shown site-wide.' },
  { href: '/admin/dashboard/core-values', icon: '🐘', title: 'About — Core Values', desc: 'Edit the Core Values cards on the About Us page.' },
  { href: '/admin/dashboard/team', icon: '👤', title: 'Our Team', desc: 'Manage photos, names, roles and bios on the Team page.' },
  { href: '/admin/dashboard/news', icon: '📰', title: 'News & Blog', desc: 'Publish articles with images, manage drafts, and keep the community updated.' },
  { href: '/admin/dashboard/products', icon: '🛍️', title: 'Products', desc: 'Manage merchandise like key chains, brooches, book marks, wind chimes, and tote bags.' },
  { href: '/admin/dashboard/testimonials', icon: '💬', title: 'Testimonials', desc: 'Manage the voices of impact quotes shown on the homepage.' },
  { href: '/admin/dashboard/partners', icon: '🤝', title: 'Partners', desc: 'Add or remove logos from the scrolling partners marquee.' },
  { href: '/admin/dashboard/contacts', icon: '📬', title: 'Messages', desc: 'View contact form submissions from visitors.' },
];

const superAdminCards = [
  { href: '/admin/dashboard/users', icon: '👥', title: 'Admin Users', desc: 'Invite new admins or manage access for existing ones.' },
];

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Welcome back, <span style={s.accentText}>{session?.user?.name?.split(' ')[0]}</span> 👋</h1>
          <p style={s.sub}>Manage the Satyasaksha Foundation website content from your central hub.</p>
        </div>
      </div>

      <div style={s.grid}>
        {cards.map((card) => (
          <Link key={card.href} href={card.href} style={s.card}>
            <div style={s.cardTop}>
              <div style={s.cardIcon}>{card.icon}</div>
              <span style={s.cardArrow}>→</span>
            </div>
            <div style={s.cardContent}>
              <h2 style={s.cardTitle}>{card.title}</h2>
              <p style={s.cardDesc}>{card.desc}</p>
            </div>
          </Link>
        ))}
        {session?.user?.role === 'super_admin' && superAdminCards.map((card) => (
          <Link key={card.href} href={card.href} style={{ ...s.card, borderColor: 'rgba(212,175,55,0.2)' }}>
            <div style={s.cardTop}>
              <div style={{ ...s.cardIcon, color: '#D4AF37' }}>{card.icon}</div>
              <span style={s.cardArrow}>→</span>
            </div>
            <div style={s.cardContent}>
              <h2 style={s.cardTitle}>{card.title}</h2>
              <p style={s.cardDesc}>{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div style={s.noticeWrap}>
        <div style={s.noticeGlow}></div>
        <div style={s.notice}>
          <strong style={{ color: '#D4AF37', display: 'block', marginBottom: '4px' }}>⚡ Performance Architecture</strong>
          <span style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            To keep the public website blazing fast, all pages use Incremental Static Regeneration. After saving changes here, the public site will automatically update within ~60 seconds globally.
          </span>
        </div>
      </div>
    </div>
  );
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px', gap: '16px', flexWrap: 'wrap' },
  title: { color: '#fff', fontSize: '2.2rem', fontWeight: '700', margin: '0 0 10px', letterSpacing: '-0.5px' },
  accentText: { background: 'linear-gradient(135deg, #D4AF37, #B8960C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  sub: { color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '1.05rem', fontWeight: '400' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' },
  card: {
    display: 'flex', flexDirection: 'column',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '16px', padding: '32px', textDecoration: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  cardIcon: { 
    fontSize: '2.2rem', 
    background: 'rgba(255,255,255,0.05)', 
    width: '60px', height: '60px', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)'
  },
  cardContent: { display: 'flex', flexDirection: 'column', gap: '8px' },
  cardTitle: { color: '#fff', fontSize: '1.25rem', fontWeight: '600', margin: 0, letterSpacing: '-0.3px' },
  cardDesc: { color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 },
  cardArrow: { 
    color: '#D4AF37', fontSize: '1.5rem', fontWeight: '300', 
    transition: 'transform 0.3s ease', opacity: 0.8
  },
  noticeWrap: { position: 'relative', maxWidth: '800px' },
  noticeGlow: {
    position: 'absolute', top: '-10px', left: '-10px', right: '-10px', bottom: '-10px',
    background: 'linear-gradient(135deg, rgba(212,175,55,0.1), transparent)',
    borderRadius: '24px', zIndex: 0, filter: 'blur(20px)'
  },
  notice: {
    position: 'relative', zIndex: 1,
    background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '16px', padding: '24px 32px', fontSize: '0.95rem',
    backdropFilter: 'blur(10px)',
  },
};
