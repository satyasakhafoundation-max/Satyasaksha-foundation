'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

function AdminSetupInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/users/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  if (!token) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.icon}>⚠️</div>
          <h1 className={styles.title}>Invalid Link</h1>
          <p className={styles.sub}>This setup link is missing a token. Please ask your administrator for a valid invite link.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.icon}>✅</div>
          <h1 className={styles.title}>Account Activated!</h1>
          <p className={styles.sub}>Your admin account is ready. You can now log in with your email and new password.</p>
          <a href="/admin" className={styles.loginBtn}>Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🌿 Satyasaksha Foundation</div>
        <h1 className={styles.title}>Set Up Your Account</h1>
        <p className={styles.sub}>You&apos;ve been invited as an admin. Create a password to activate your account.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>New Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Minimum 8 characters"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Repeat your password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {status === 'error' && (
            <div className={styles.error}>{errorMsg}</div>
          )}

          <button type="submit" className={styles.btn} disabled={status === 'loading'}>
            {status === 'loading' ? 'Activating…' : 'Activate Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminSetupPage() {
  return (
    <Suspense fallback={<div className={styles.page}><div className={styles.card}><p style={{ color: 'rgba(255,255,255,0.6)' }}>Loading…</p></div></div>}>
      <AdminSetupInner />
    </Suspense>
  );
}
