'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

const SOCIAL_ICONS = [
  { key: 'facebookUrl', label: 'Facebook', abbr: 'FB' },
  { key: 'instagramUrl', label: 'Instagram', abbr: 'IG' },
  { key: 'twitterUrl', label: 'Twitter', abbr: 'X' },
  { key: 'linkedinUrl', label: 'LinkedIn', abbr: 'LI' },
];

export default function ClientFooter({ settings }) {
  const pathname = usePathname();

  // Do not render public Footer on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const activeSocials = SOCIAL_ICONS.filter((s) => settings[s.key]);

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>

          <div className={styles.brandCol}>
            <div className={styles.logo}>
              <span className={styles.logoText}>{settings.siteName?.toUpperCase()}</span>
              <span className={styles.logoTagline}>{settings.tagline}</span>
            </div>
            <p className={styles.desc}>{settings.footerDescription}</p>
            {activeSocials.length > 0 && (
              <div className={styles.socials}>
                {activeSocials.map((s) => (
                  <a key={s.key} href={settings[s.key]} target="_blank" rel="noopener noreferrer" aria-label={s.label}>{s.abbr}</a>
                ))}
              </div>
            )}
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Foundation</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/team">Our Team</Link></li>
              <li><Link href="/impact">Impact &amp; Work</Link></li>
              <li><Link href="/news">News &amp; Blogs</Link></li>
              <li><Link href="/products">Merchandise</Link></li>
              <li><Link href="/reports">Reports &amp; Transparency</Link></li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Get Involved</h4>
            <ul>
              <li><Link href="/donate">Donate</Link></li>
              <li><Link href="/get-involved#volunteer">Volunteer</Link></li>
              <li><Link href="/get-involved#partner">Partner with Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>Contact Us</h4>
            <address className={styles.address}>
              <p>{settings.address}</p>
              <p className={styles.email}>{settings.email}</p>
              <p className={styles.phone}>{settings.phone}</p>
            </address>
          </div>

        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} {settings.copyrightName}. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
