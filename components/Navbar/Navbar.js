'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Our Team', path: '/team' },
  { name: 'Impact & Work', path: '/impact' },
  { name: 'News & Blogs', path: '/news' },
  { name: 'Merchandise', path: '/products' },
  { name: 'Get Involved', path: '/get-involved' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Do not render public Navbar on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>SATYASAKSHA</span>
          <span className={styles.logoTagline}>the witness of truth</span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  href={link.path} 
                  className={`${styles.link} ${pathname === link.path ? styles.active : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/donate" className={`btn btn--gold ${styles.donateBtn}`}>
            Donate
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className={`${styles.mobileToggle} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.menuOpen : ''}`}>
        <nav className={styles.mobileNav}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  href={link.path}
                  className={`${styles.mobileLink} ${pathname === link.path ? styles.mobileActive : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/donate" className={`btn btn--gold ${styles.mobileDonateBtn}`}>
            Donate Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
