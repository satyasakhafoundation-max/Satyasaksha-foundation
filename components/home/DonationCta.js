// Server Component — queries SiteSettings from DB, cached for 60s
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import styles from './DonationCta.module.css';

export const revalidate = 60;

const DEFAULT_PRESETS = [{ amount: 500 }, { amount: 1000 }, { amount: 2500 }, { amount: 5000 }];

async function getPresets() {
  try {
    await dbConnect();
    const settings = await SiteSettings.findOne({}).lean();
    return settings?.donationPresets?.length ? settings.donationPresets : DEFAULT_PRESETS;
  } catch {
    return DEFAULT_PRESETS;
  }
}

export default async function DonationCta() {
  const presets = await getPresets();

  return (
    <section className={styles.section} id="donate-cta">
      <div className={styles.bgImage}></div>
      <div className={styles.overlay}></div>

      <div className={`container ${styles.contentWrap}`}>
        <div className={`reveal ${styles.glassPanel}`}>
          <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
            <p className="label" style={{ color: 'var(--gold-light)' }}>Support Our Cause</p>
            <div className="divider-gold"></div>
            <h2 className="heading-xl" style={{ color: 'var(--white)' }}>
              Your Contribution Creates <span className="italic-accent">Lasting Change</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '500px', margin: 'var(--space-4) auto 0' }}>
              Together, we can protect wildlife, restore habitats, and empower communities to thrive in harmony with nature.
            </p>
          </div>

          <div className={styles.presetGrid}>
            {presets.map((preset) => (
              <Link key={preset.amount} href={`/donate?amount=${preset.amount}`} className={styles.presetBtn}>
                ₹{preset.amount.toLocaleString('en-IN')}
              </Link>
            ))}
          </div>

          <div className={styles.actionWrap}>
            <Link href="/donate" className="btn btn--gold btn--lg" style={{ width: '100%', maxWidth: '300px' }}>
              Donate Now
            </Link>
          </div>

          <p className={styles.note}>All donations are securely processed. Tax exemption details will be provided upon successful contribution.</p>
        </div>
      </div>
    </section>
  );
}
