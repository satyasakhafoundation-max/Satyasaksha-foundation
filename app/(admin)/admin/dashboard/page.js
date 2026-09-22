'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './page.module.css';

const cards = [
  { href: '/admin/dashboard/hero-images', icon: '🌄', title: 'Homepage Background', desc: 'Upload multiple images to rotate the homepage hero background.' },
  { href: '/admin/dashboard/stats', icon: '📈', title: 'Impact Stats', desc: 'Edit live impact numbers shown on the homepage and impact page.' },
  { href: '/admin/dashboard/work-highlights', icon: '📸', title: 'Our Work — Pictures', desc: 'Manage the photo showcase on the Impact & Our Work page.' },
  { href: '/admin/dashboard/focus-areas', icon: '🌿', title: 'Focus Areas', desc: 'Add, edit or hide the work domains shown site-wide.' },
  { href: '/admin/dashboard/core-values', icon: '🐘', title: 'About — Core Values', desc: 'Edit the Core Values cards on the About Us page.' },
  { href: '/admin/dashboard/team', icon: '👤', title: 'Our Team', desc: 'Manage photos, names, roles and bios on the Team page.' },
  { href: '/admin/dashboard/news', icon: '📰', title: 'News & Blog', desc: 'Publish articles with images, manage drafts, and keep the community updated.' },
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
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back, <span className={styles.accentText}>{session?.user?.name?.split(' ')[0]}</span> 👋</h1>
          <p className={styles.sub}>Manage the Satyasaksha Foundation website content from your central hub.</p>
        </div>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.cardIcon}>{card.icon}</div>
              <span className={styles.cardArrow}>→</span>
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{card.title}</h2>
              <p className={styles.cardDesc}>{card.desc}</p>
            </div>
          </Link>
        ))}
        {session?.user?.role === 'super_admin' && superAdminCards.map((card) => (
          <Link key={card.href} href={card.href} className={`${styles.card} ${styles.cardSuperAdmin}`}>
            <div className={styles.cardTop}>
              <div className={`${styles.cardIcon} ${styles.cardIconGold}`}>{card.icon}</div>
              <span className={styles.cardArrow}>→</span>
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{card.title}</h2>
              <p className={styles.cardDesc}>{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.noticeWrap}>
        <div className={styles.noticeGlow}></div>
        <div className={styles.notice}>
          <strong className={styles.noticeTitle}>⚡ Performance Architecture</strong>
          <span className={styles.noticeBody}>
            To keep the public website blazing fast, all pages use Incremental Static Regeneration. After saving changes here, the public site will automatically update within ~60 seconds globally.
          </span>
        </div>
      </div>
    </div>
  );
}
