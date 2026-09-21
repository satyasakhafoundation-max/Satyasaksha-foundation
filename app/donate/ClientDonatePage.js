'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

function DonateContent({ presets, taxNote, content }) {
  const searchParams = useSearchParams();
  const preselectedAmount = searchParams.get('amount');

  const [amount, setAmount] = useState(preselectedAmount || String(presets[0]?.amount || '1000'));
  const [customAmount, setCustomAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handlePresetClick = (val) => {
    setAmount(val);
    setCustomAmount('');
    setAmountError('');
  };

  const handleCustomChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setAmount('custom');

    if (value === '') {
      setAmountError('');
    } else if (Number(value) <= 0) {
      setAmountError('Please enter an amount greater than ₹0.');
    } else {
      setAmountError('');
    }
  };

  const finalAmount = Number(amount === 'custom' ? customAmount : amount);
  const isAmountValid = finalAmount > 0;

  return (
    <div className={styles.pageWrap}>

      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${content.heroImage})` }}></div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className="heading-hero reveal">{content.heroTitle}</h1>
          <p className={`reveal reveal-delay-1 ${styles.heroSub}`}>
            {content.heroSubtitle}
          </p>
        </div>
      </section>

      <section className={`section ${styles.donateSection}`}>
        <div className={`container ${styles.grid}`}>

          {/* Info Side */}
          <div className={`reveal ${styles.infoCol}`}>
            <h2 className="heading-lg" style={{ marginBottom: 'var(--space-6)' }}>{content.whyDonateHeading}</h2>
            <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>
              {content.whyDonateIntro}
            </p>
            <ul className={styles.impactList}>
              {presets.map((preset) => (
                <li key={preset.amount}><strong>₹{preset.amount.toLocaleString('en-IN')}</strong> — {preset.description}</li>
              ))}
            </ul>
            <p className={styles.taxNote}>* {taxNote}</p>
          </div>

          {/* Form Side */}
          <div className={`reveal reveal-delay-2 ${styles.formCol}`}>
            <div className={styles.formCard}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>🙏</div>
                  <h3 className="heading-md" style={{ marginBottom: 'var(--space-3)' }}>Thank You for Your Intent to Give</h3>
                  <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>
                    Online payments aren&apos;t live on the site just yet. We&apos;ve noted your interest in donating ₹{finalAmount} — our team will reach out shortly to confirm your contribution.
                  </p>
                  <button type="button" className="btn btn--outline" onClick={() => setSubmitted(false)}>
                    Back to Donation Form
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="heading-md" style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>Choose Your Impact</h3>

                  <div className={styles.amountGrid}>
                    {presets.map((preset) => (
                      <button
                        key={preset.amount}
                        className={`${styles.amountBtn} ${amount === String(preset.amount) ? styles.active : ''}`}
                        onClick={() => handlePresetClick(String(preset.amount))}
                      >
                        ₹{preset.amount.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>

                  <div className={styles.customAmount}>
                    <label>Or enter custom amount:</label>
                    <div className={styles.inputWrap}>
                      <span className={styles.currency}>₹</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={handleCustomChange}
                      />
                    </div>
                    {amountError && (
                      <p className={styles.amountError} style={{ color: 'var(--error, #d9534f)', marginTop: 'var(--space-2)', fontSize: '0.875rem' }}>
                        {amountError}
                      </p>
                    )}
                  </div>

                  <form className={styles.detailsForm} onSubmit={(e) => {
                    e.preventDefault();
                    if (!isAmountValid) {
                      setAmountError('Please enter an amount greater than ₹0.');
                      return;
                    }
                    setSubmitted(true);
                  }}>
                    <div className={styles.formGroup}>
                      <label>Full Name</label>
                      <input type="text" required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Email Address</label>
                      <input type="email" required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>PAN Number (For Tax Receipt)</label>
                      <input type="text" />
                    </div>

                    <button
                      type="submit"
                      className="btn btn--gold"
                      disabled={!isAmountValid}
                      style={{ width: '100%', marginTop: 'var(--space-4)', opacity: isAmountValid ? 1 : 0.5, cursor: isAmountValid ? 'pointer' : 'not-allowed' }}
                    >
                      Proceed to Payment
                    </button>
                  </form>

                  <div className={styles.secureNote}>
                    🔒 Secure 256-bit SSL Encrypted Payment
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default function ClientDonatePage({ presets, taxNote, content }) {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-light)' }}>Loading...</div>}>
      <DonateContent presets={presets} taxNote={taxNote} content={content} />
    </Suspense>
  );
}
