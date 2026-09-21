'use client';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/admin/ui/ToastProvider';

// This layout ONLY wraps admin routes.
// Public website routes do NOT get this provider.
export default function AdminRootLayout({ children }) {
  return (
    <SessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}
