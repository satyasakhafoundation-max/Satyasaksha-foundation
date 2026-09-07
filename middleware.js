import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Must have a valid JWT token
    },
    pages: {
      signIn: '/admin',
    },
  }
);

// Protect all /admin/dashboard/* routes
export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
