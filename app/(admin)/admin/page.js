'use client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin/dashboard');
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error === 'CredentialsSignin' ? 'Invalid email or password. Please try again.' : result.error);
    } else {
      router.push('/admin/dashboard');
    }
  };

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinner} />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.bgImage}></div>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoCircle}>S</div>
          <h1 style={styles.logoText}>Satyasaksha</h1>
          <p style={styles.logoSub}>Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@satyasaksha.org"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>

        <p style={styles.footer}>
          &copy; {new Date().getFullYear()} Satyasaksha Foundation
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#0a110a',
  },
  bgImage: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: 'linear-gradient(to bottom, rgba(10, 17, 10, 0.8), rgba(10, 17, 10, 0.95)), url("https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2500&auto=format&fit=crop")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
  },
  card: {
    background: 'rgba(20, 30, 20, 0.6)',
    border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '24px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '400px',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
    position: 'relative',
    zIndex: 1,
  },
  logoWrap: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  logoCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #D4AF37, #B8960C)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f1a0f',
    margin: '0 auto 16px',
    boxShadow: '0 4px 20px rgba(212,175,55,0.3)',
  },
  logoText: {
    color: '#fff',
    fontSize: '1.4rem',
    fontWeight: '600',
    margin: '0',
    letterSpacing: '-0.3px',
  },
  logoSub: {
    color: '#D4AF37',
    fontSize: '0.8rem',
    margin: '6px 0 0',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.8rem',
    fontWeight: '500',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  input: {
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '14px 16px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  error: {
    background: 'rgba(220,53,69,0.1)',
    border: '1px solid rgba(220,53,69,0.2)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#ff6b6b',
    fontSize: '0.85rem',
    textAlign: 'center',
  },
  btn: {
    background: 'linear-gradient(135deg, #D4AF37, #B8960C)',
    color: '#0a110a',
    border: 'none',
    borderRadius: '10px',
    padding: '16px',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'all 0.2s',
    letterSpacing: '0.5px',
    boxShadow: '0 8px 20px rgba(212,175,55,0.2)',
  },
  footer: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.3)',
    fontSize: '0.75rem',
    marginTop: '36px',
    marginBottom: '0',
  },
  loadingWrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a110a',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(212,175,55,0.2)',
    borderTopColor: '#D4AF37',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};
