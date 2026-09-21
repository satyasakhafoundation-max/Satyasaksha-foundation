'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './layout.module.css';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/dashboard/site-settings', label: 'Site Settings', icon: '⚙️' },
  { href: '/admin/dashboard/page-content', label: 'Page Content', icon: '📝' },
  { href: '/admin/dashboard/hero-images', label: 'Homepage Background', icon: '🌄' },
  { href: '/admin/dashboard/stats', label: 'Impact Stats', icon: '📈' },
  { href: '/admin/dashboard/work-highlights', label: 'Our Work — Pictures', icon: '📸' },
  { href: '/admin/dashboard/focus-areas', label: 'Focus Areas', icon: '🌿' },
  { href: '/admin/dashboard/pillars', label: 'Core Program Highlights', icon: '🏛️' },
  { href: '/admin/dashboard/core-values', label: 'About — Core Values', icon: '🐘' },
  { href: '/admin/dashboard/team', label: 'Our Team', icon: '👤' },
  { href: '/admin/dashboard/news', label: 'News & Blog', icon: '📰' },
  { href: '/admin/dashboard/products', label: 'Products', icon: '🛍️' },
  { href: '/admin/dashboard/involvement-options', label: 'Get Involved — Options', icon: '🙌' },
  { href: '/admin/dashboard/testimonials', label: 'Testimonials', icon: '💬' },
  { href: '/admin/dashboard/partners', label: 'Partners', icon: '🤝' },
  { href: '/admin/dashboard/reports', label: 'Reports & Transparency', icon: '📄' },
  { href: '/admin/dashboard/contacts', label: 'Messages', icon: '📬' },
];

const superAdminItems = [
  { href: '/admin/dashboard/users', label: 'Admin Users', icon: '👥' },
];

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const renderNavLink = (item) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        title={collapsed ? item.label : ''}
        className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
      >
        <span className={styles.navIcon}>{item.icon}</span>
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <div className={styles.shell}>
      {/* Mobile top bar */}
      <div className={styles.mobileBar}>
        <div className={styles.mobileBarBrand}>
          <div className={styles.brandIcon} style={{ width: 34, height: 34, fontSize: 16 }}>S</div>
          Satyasaksha Admin
        </div>
        <button className={styles.hamburger} onClick={() => setMobileOpen(true)} aria-label="Open menu">☰</button>
      </div>

      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>S</div>
            {!collapsed && (
              <div className={styles.brandTextWrap}>
                <div className={styles.brandName}>Satyasaksha</div>
                <div className={styles.brandRole}>Admin Portal</div>
              </div>
            )}
          </div>

          <nav className={styles.nav}>
            {navItems.map(renderNavLink)}
            {session?.user?.role === 'super_admin' && (
              <>
                {!collapsed && <div className={styles.navDivider}>Admin</div>}
                {superAdminItems.map(renderNavLink)}
              </>
            )}
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={styles.collapseBtn}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? '→' : '← Collapse'}
          </button>

          {!collapsed && (
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {session?.user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className={styles.userDetails}>
                <div className={styles.userName}>{session?.user?.name}</div>
                <div className={styles.userEmail}>{session?.user?.email}</div>
              </div>
            </div>
          )}

          <div className={styles.bottomActions}>
            <Link href="/" target="_blank" className={styles.viewSiteBtn} title="View Live Site">
              {collapsed ? '↗' : 'View Site ↗'}
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: `${window.location.origin}/admin` })}
              className={styles.signOutBtn}
              title="Sign Out"
            >
              {collapsed ? '✕' : 'Sign Out'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.mainInner}>
          {children}
        </div>
      </main>
    </div>
  );
}
