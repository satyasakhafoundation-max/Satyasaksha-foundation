'use client';
import { SessionProvider } from 'next-auth/react';

// This layout ONLY wraps admin routes.
// Public website routes do NOT get this provider.
export default function AdminRootLayout({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
