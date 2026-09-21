'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

function DonateContent() {
  const searchParams = useSearchParams();
  const preselectedAmount = searchParams.get('amount');
  
  const [amount, setAmount] = useState(preselectedAmount || '1000');
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
        <div className={styles.heroBg} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2500&auto=format&fit=crop")' }}></div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className="heading-hero reveal">Make a Donation</h1>
          <p className={`reveal reveal-delay-1 ${styles.heroSub}`}>
            Your contribution directly funds on-ground conservation, rural education, and animal welfare.
          </p>
        </div>
      </section>

      <section className={`section ${styles.donateSection}`}>
        <div className={`container ${styles.grid}`}>
          
          {/* Info Side */}
          <div className={`reveal ${styles.infoCol}`}>
            <h2 className="heading-lg" style={{ marginBottom: 'var(--space-6)' }}>Why Donate?</h2>
            <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>
              Satyasaksha Foundation operates on a model of absolute transparency. 100% of public donations are routed directly to field projects, while administrative costs are covered by our founding board.
            </p>
            <ul className={styles.impactList}>
              <li><strong>₹500</strong> — Supports educational materials and outreach activities.</li>
              <li><strong>₹1,000</strong> — Supports citizen-science and biodiversity documentation activities.</li>
              <li><strong>₹2,500</strong> — Supports field-based conservation and awareness activities.</li>
              <li><strong>₹5,000</strong> — Helps support a community or student-focused conservation programme.</li>
            </ul>
            <p className={styles.taxNote}>
              * All donations are eligible for tax exemption under Section 80G of the Income Tax Act.
            </p>
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
                    {['500', '1000', '2500', '5000'].map((preset) => (
                      <button
                        key={preset}
                        className={`${styles.amountBtn} ${amount === preset ? styles.active : ''}`}
                        onClick={() => handlePresetClick(preset)}
                      >
                        ₹{preset}
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

export default function DonatePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-light)' }}>Loading...</div>}>
      <DonateContent />
    </Suspense>
  );
}
