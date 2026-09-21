'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

const VALID_SUBJECTS = ['general', 'volunteer', 'partner', 'membership', 'rescue'];

function ContactContent() {
  const searchParams = useSearchParams();
  const presetSubject = searchParams.get('subject');
  const initialSubject = VALID_SUBJECTS.includes(presetSubject) ? presetSubject : '';

  const [form, setForm] = useState({ name: '', email: '', subject: initialSubject, message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className={styles.pageWrap}>
      
      {/* Page Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2500&auto=format&fit=crop")' }}></div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className="heading-hero reveal">Contact Us</h1>
          <p className={`reveal reveal-delay-1 ${styles.heroSub}`}>
            Have a question, partnership proposal, or want to report an animal in need? We are here to listen.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className={`section ${styles.contactSection}`}>
        <div className={`container ${styles.grid}`}>
          
          {/* Left: Contact Info */}
          <div className={`reveal ${styles.infoCol}`}>
            <h2 className="heading-lg" style={{ marginBottom: 'var(--space-6)' }}>Get in Touch</h2>
            <p className="text-muted" style={{ marginBottom: 'var(--space-8)' }}>
              Our headquarters are located in New Delhi, but our operations span across the country. Feel free to reach out to our primary desk.
            </p>

            <div className={styles.infoBlock}>
              <div className={styles.icon}>📍</div>
              <div>
                <h4 className={styles.infoTitle}>Headquarters</h4>
                <p>Satyasaksha Foundation<br/>Sector 12, Dwarka<br/>New Delhi, 110075, India</p>
              </div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.icon}>📞</div>
              <div>
                <h4 className={styles.infoTitle}>Helpline</h4>
                <p>+91 98765 43210 (Mon-Sat, 9am - 6pm)</p>
                <p>Animal Rescue: +91 98765 11111 (24/7)</p>
              </div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.icon}>✉️</div>
              <div>
                <h4 className={styles.infoTitle}>Email</h4>
                <p>contact@satyasakshafoundation.org</p>
                <p>partnerships@satyasakshafoundation.org</p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className={`reveal reveal-delay-2 ${styles.formCol}`}>
            {status === 'success' ? (
              <div className={styles.successCard}>
                <div className={styles.successIcon}>✅</div>
                <h3 className="heading-md" style={{ marginBottom: '12px' }}>Message Received!</h3>
                <p className="text-muted">Thank you for reaching out. Our team will review your message and get back to you within 1-2 business days.</p>
                <button className="btn btn--primary" style={{ marginTop: '24px' }} onClick={() => setStatus('idle')}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <h3 className="heading-md" style={{ marginBottom: 'var(--space-6)' }}>Send a Message</h3>
                
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" placeholder="John Doe" required value={form.name} onChange={handleChange} />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" placeholder="john@example.com" required value={form.email} onChange={handleChange} />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" required value={form.subject} onChange={handleChange}>
                    <option value="" disabled>Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="volunteer">Volunteering</option>
                    <option value="partner">Partnership</option>
                    <option value="membership">Foundation Membership</option>
                    <option value="rescue">Animal Rescue Report</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea id="message" rows="5" placeholder="How can we help you?" required value={form.message} onChange={handleChange}></textarea>
                </div>

                {status === 'error' && (
                  <div className={styles.errorBanner}>{errorMsg}</div>
                )}
                
                <button type="submit" className="btn btn--gold" style={{ width: '100%' }} disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <ContactContent />
    </Suspense>
  );
}

