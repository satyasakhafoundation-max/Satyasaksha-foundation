import reportsData from '@/data/reports.json';
import styles from './page.module.css';

export const metadata = {
  title: 'Reports & Transparency | Satyasaksha Foundation',
  description: 'Browse annual impact reports, financial statements, and project documentation from Satyasaksha Foundation. Committed to full transparency.',
};

export default function ReportsPage() {
  return (
    <div className={styles.pageWrap}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=2500&auto=format&fit=crop")' }}></div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <p className="label" style={{ color: 'var(--gold-light)' }}>Transparency &amp; Accountability</p>
          <h1 className="heading-hero reveal">Reports &amp; Documents</h1>
          <p className={`reveal reveal-delay-1 ${styles.heroSub}`}>
            We believe every donor and partner deserves full visibility into how resources are utilised. Our annual reports detail every initiative, outcome, and rupee spent.
          </p>
        </div>
      </section>

      {/* Commitment Banner */}
      <section className={styles.commitmentBanner}>
        <div className="container">
          <div className={styles.commitmentGrid}>
            {[
              { icon: '🔍', label: 'Full Transparency', desc: '100% of our financials are disclosed annually' },
              { icon: '✅', label: '80G Certified', desc: 'All donations eligible for tax exemption' },
              { icon: '📋', label: 'Audited Accounts', desc: 'Independently audited by a registered CA firm' },
              { icon: '🌿', label: 'Impact Verified', desc: 'Field outcomes verified by third-party partners' },
            ].map((item) => (
              <div key={item.label} className={`reveal ${styles.commitItem}`}>
                <span className={styles.commitIcon}>{item.icon}</span>
                <div>
                  <strong className={styles.commitLabel}>{item.label}</strong>
                  <p className={styles.commitDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports List */}
      <section className={`section ${styles.reportsSection}`}>
        <div className="container">
          <div className="section-header reveal">
            <p className="label">Annual Publications</p>
            <h2 className="heading-lg">Impact Reports</h2>
            <div className="divider-gold"></div>
            <p className="text-muted">
              Download and review our comprehensive annual reports. Each report includes programme outcomes, financial statements, and future roadmaps.
            </p>
          </div>

          <div className={styles.reportsList}>
            {reportsData.map((report, i) => (
              <div key={report.id} className={`reveal reveal-delay-${(i % 3) + 1} ${styles.reportCard}`}>
                <div className={styles.reportYear}>
                  <span className={styles.yearBadge}>{report.year}</span>
                </div>
                <div className={styles.reportBody}>
                  <h3 className={styles.reportTitle}>{report.title}</h3>
                  <p className={styles.reportDesc}>{report.description}</p>
                  <div className={styles.highlights}>
                    {report.highlights.map((h) => (
                      <span key={h} className={styles.highlightTag}>✓ {h}</span>
                    ))}
                  </div>
                  <p className={styles.publishedDate}>Published: {report.publishedDate}</p>
                </div>
                <div className={styles.reportActions}>
                  <a
                    href={report.pdfUrl}
                    className={`btn btn--gold ${styles.downloadBtn}`}
                    download
                    aria-label={`Download ${report.title}`}
                  >
                    ⬇ Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request CTA */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <div className={`reveal ${styles.ctaCard}`}>
            <h2 className="heading-md" style={{ color: 'var(--ivory)' }}>Need a Specific Document?</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '12px', marginBottom: '32px', maxWidth: '560px', margin: '12px auto 32px' }}>
              For additional financial statements, project-specific reports, or due-diligence documents, please reach out to our team directly.
            </p>
            <a href="/contact" className="btn btn--glass btn--lg">Contact Us for Documents</a>
          </div>
        </div>
      </section>

    </div>
  );
}
