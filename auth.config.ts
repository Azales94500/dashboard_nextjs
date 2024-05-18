import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // In the tutorial they use "Response" instead of NextResponse, 
        // but i don't know why, the redirect doesn't work as intended (in my knowledge)
        // and with NextResponse it's a bit better, with Response i can't sign out without
        // navigating to another page, with NextResponse i can, it's rather strange
        // , but i'm too stupid to figure what the problem is for now
        // so i'll let this and pray that the next time i do something similar, i won't have
        // this problem
        return NextResponse.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;