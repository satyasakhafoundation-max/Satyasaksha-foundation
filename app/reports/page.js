import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';
import styles from './page.module.css';

export const revalidate = 60;

export const metadata = {
  title: 'Reports & Transparency | Satyasaksha Foundation',
  description: 'Browse annual impact reports, financial statements, and project documentation from Satyasaksha Foundation. Committed to full transparency.',
};

const DEFAULT_REPORTS = [
  {
    id: 'report-2025', year: '2025', title: 'Annual Impact Report 2025',
    description: "A comprehensive overview of Satyasaksha Foundation's conservation achievements, community programs, and financial transparency for the fiscal year 2025.",
    pdfUrl: '', highlights: ['50,000 trees planted', '12 rural schools supported', '3,200 animals treated'],
    publishedDate: 'March 2026',
  },
  {
    id: 'report-2024', year: '2024', title: 'Annual Impact Report 2024',
    description: 'Documenting our milestones in wildlife conservation, animal welfare, and sustainable education outreach across 9 focus areas throughout 2024.',
    pdfUrl: '', highlights: ['8 biodiversity surveys', '600+ volunteers mobilised', '₹2.4 Cr raised'],
    publishedDate: 'March 2025',
  },
  {
    id: 'report-2023', year: '2023', title: 'Annual Impact Report 2023',
    description: "Our inaugural public report, detailing the foundation's launch, early partnerships, and first-year field activities across conservation and community welfare domains.",
    pdfUrl: '', highlights: ['Foundation established', '4 partner NGOs onboarded', 'First rescue centre opened'],
    publishedDate: 'March 2024',
  },
];

async function getReports() {
  try {
    await dbConnect();
    const items = await Report.find({ isVisible: true }).sort({ order: 1 }).lean();
    if (items.length > 0) {
      return items.map((r) => ({
        id: r._id.toString(),
        year: r.year,
        title: r.title,
        description: r.description,
        pdfUrl: r.pdfUrl || '',
        highlights: r.highlights || [],
        publishedDate: r.publishedDate ? new Date(r.publishedDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '',
      }));
    }
    return DEFAULT_REPORTS;
  } catch {
    return DEFAULT_REPORTS;
  }
}

export default async function ReportsPage() {
  const reports = await getReports();

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
            {reports.map((report, i) => (
              <div key={report.id} className={`reveal reveal-delay-${(i % 3) + 1} ${styles.reportCard}`}>
                <div className={styles.reportYear}>
                  <span className={styles.yearBadge}>{report.year}</span>
                </div>
                <div className={styles.reportBody}>
                  <h3 className={styles.reportTitle}>{report.title}</h3>
                  <p className={styles.reportDesc}>{report.description}</p>
                  {report.highlights.length > 0 && (
                    <div className={styles.highlights}>
                      {report.highlights.map((h) => (
                        <span key={h} className={styles.highlightTag}>✓ {h}</span>
                      ))}
                    </div>
                  )}
                  {report.publishedDate && <p className={styles.publishedDate}>Published: {report.publishedDate}</p>}
                </div>
                <div className={styles.reportActions}>
                  {report.pdfUrl ? (
                    <a
                      href={report.pdfUrl}
                      className={`btn btn--gold ${styles.downloadBtn}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Download ${report.title}`}
                    >
                      ⬇ Download PDF
                    </a>
                  ) : (
                    <span className={`btn btn--outline ${styles.downloadBtn} ${styles.disabledBtn}`}>Coming Soon</span>
                  )}
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
