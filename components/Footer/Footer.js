'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();

  // Do not render public Footer on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          
          <div className={styles.brandCol}>
            <div className={styles.logo}>
              <span className={styles.logoText}>SATYASAKSHA</span>
              <span className={styles.logoTagline}>the witness of truth</span>
            </div>
            <p className={styles.desc}>
              A non-profit organisation dedicated to protecting nature, supporting communities and empowering lives across the nation.
            </p>
            <div className={styles.socials}>
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="Twitter">X</a>
              <a href="#" aria-label="LinkedIn">LI</a>
            </div>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Foundation</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/our-work">Our Work</Link></li>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/impact">Impact Metrics</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
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
              <p>Satyasaksha Foundation</p>
              <p>New Delhi, India</p>
              <p className={styles.email}>contact@satyasakshafoundation.org</p>
              <p className={styles.phone}>+91 98765 43210</p>
            </address>
          </div>

        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Satyasaksha Foundation. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
