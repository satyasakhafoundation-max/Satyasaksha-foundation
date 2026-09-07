'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/dashboard/stats', label: 'Impact Stats', icon: '📈' },
  { href: '/admin/dashboard/focus-areas', label: 'Focus Areas', icon: '🌿' },
  { href: '/admin/dashboard/gallery', label: 'Gallery', icon: '🖼️' },
  { href: '/admin/dashboard/news', label: 'News & Blog', icon: '📰' },
  { href: '/admin/dashboard/testimonials', label: 'Testimonials', icon: '💬' },
  { href: '/admin/dashboard/partners', label: 'Partners', icon: '🤝' },
  { href: '/admin/dashboard/contacts', label: 'Messages', icon: '📬' },
];

const superAdminItems = [
  { href: '/admin/dashboard/users', label: 'Admin Users', icon: '👥' },
];

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={s.shell}>
      {/* Sidebar */}
      <aside style={{ ...s.sidebar, width: collapsed ? '80px' : '280px', minWidth: collapsed ? '80px' : '280px' }}>
        <div style={s.sidebarTop}>
          <div style={{ ...s.brand, justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <div style={s.brandIcon}>S</div>
            {!collapsed && (
              <div style={s.brandTextWrap}>
                <div style={s.brandName}>Satyasaksha</div>
                <div style={s.brandRole}>Admin Portal</div>
              </div>
            )}
          </div>

          <nav style={s.nav}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : ''}
                  style={{ ...s.navItem, ...(isActive ? s.navItemActive : {}), justifyContent: collapsed ? 'center' : 'flex-start' }}
                >
                  <span style={s.navIcon}>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
            {/* Super Admin only section */}
            {session?.user?.role === 'super_admin' && (
              <>
                {!collapsed && <div style={s.navDivider}>Admin</div>}
                {superAdminItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : ''}
                      style={{ ...s.navItem, ...(isActive ? s.navItemActive : {}), justifyContent: collapsed ? 'center' : 'flex-start' }}
                    >
                      <span style={s.navIcon}>{item.icon}</span>
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>
        </div>

        <div style={s.sidebarBottom}>
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            style={s.collapseBtn}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? '→' : '← Collapse'}
          </button>
          
          {!collapsed && (
            <div style={s.userInfo}>
              <div style={s.userAvatar}>
                {session?.user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div style={s.userDetails}>
                <div style={s.userName}>{session?.user?.name}</div>
                <div style={s.userEmail}>{session?.user?.email}</div>
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: collapsed ? 'column' : 'row', gap: '8px', marginTop: collapsed ? '24px' : '16px' }}>
            <Link href="/" target="_blank" style={s.viewSiteBtn} title="View Live Site">
              {collapsed ? '↗' : 'View Site ↗'}
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: `${window.location.origin}/admin` })}
              style={s.signOutBtn}
              title="Sign Out"
            >
              {collapsed ? '✕' : 'Sign Out'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={s.main}>
        <div style={s.mainInner}>
          {children}
        </div>
      </main>
    </div>
  );
}

const s = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    background: 'radial-gradient(circle at top left, #121e12 0%, #0a110a 100%)',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  sidebar: {
    background: 'rgba(255,255,255,0.02)',
    borderRight: '1px solid rgba(212,175,55,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '32px 16px',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'hidden',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    zIndex: 10,
  },
  sidebarTop: { display: 'flex', flexDirection: 'column', gap: '40px' },
  brand: { display: 'flex', alignItems: 'center', gap: '14px', padding: '0 8px', overflow: 'hidden' },
  brandIcon: {
    width: '44px', height: '44px', borderRadius: '12px',
    background: 'linear-gradient(135deg, #D4AF37, #B8960C)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px', fontWeight: '700', color: '#0f1a0f', flexShrink: 0,
    boxShadow: '0 4px 12px rgba(212,175,55,0.2)',
  },
  brandTextWrap: { flexShrink: 0 },
  brandName: { color: '#fff', fontWeight: '700', fontSize: '1.1rem', letterSpacing: '-0.3px' },
  brandRole: { color: '#D4AF37', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '12px 16px', borderRadius: '10px',
    color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
    fontSize: '0.95rem', fontWeight: '500', transition: 'all 0.2s ease',
    overflow: 'hidden', whiteSpace: 'nowrap',
  },
  navItemActive: {
    background: 'rgba(212,175,55,0.1)',
    color: '#D4AF37',
  },
  navIcon: { fontSize: '1.2rem', flexShrink: 0 },
  sidebarBottom: { display: 'flex', flexDirection: 'column' },
  collapseBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.3)',
    cursor: 'pointer',
    fontSize: '0.8rem',
    textAlign: 'left',
    padding: '8px',
    marginBottom: '16px',
    transition: 'color 0.2s',
    fontWeight: '500',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  userInfo: { 
    display: 'flex', alignItems: 'center', gap: '12px', 
    padding: '16px', background: 'rgba(0,0,0,0.2)', 
    borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)',
    overflow: 'hidden'
  },
  userAvatar: {
    width: '38px', height: '38px', borderRadius: '50%',
    background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', color: '#D4AF37', fontSize: '15px', flexShrink: 0,
  },
  userDetails: { flexShrink: 0 },
  userName: { color: '#fff', fontSize: '0.9rem', fontWeight: '600' },
  userEmail: { color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' },
  viewSiteBtn: {
    flex: 1, textAlign: 'center', padding: '10px',
    background: 'rgba(255,255,255,0.05)', borderRadius: '8px',
    color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
    fontSize: '0.85rem', fontWeight: '500', transition: 'background 0.2s',
  },
  signOutBtn: {
    flex: 1, padding: '10px',
    background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.2)',
    borderRadius: '8px', color: '#ff6b6b', cursor: 'pointer',
    fontSize: '0.85rem', fontWeight: '500', transition: 'background 0.2s',
  },
  main: {
    flex: 1,
    overflowX: 'hidden',
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
  },
  mainInner: {
    width: '100%',
    maxWidth: '1200px', // Restricts the width so it looks elegant on ultra-wide screens
  }
};
