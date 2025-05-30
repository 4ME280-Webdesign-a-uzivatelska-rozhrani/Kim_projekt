import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: 'Email Address', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials) {
        throw new Error('Missing credentials');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email as string,
        password: credentials.password as string
        }
      );

      if (error || !data?.user) {
        console.log(error);
        throw new Error(error?.message || 'Invalid email or password');
      }

      // Returning user data to store in the session
      return {
        id: data.user.id,
        name: data.user.email,
        email: data.user.email,
        access_token: data.session.access_token
      };
    },
  }),
];
//
// const providers: Provider[] = [
//   Credentials({
//     credentials: {
//       email: { label: 'Email Address', type: 'email' },
//       password: { label: 'Password', type: 'password' },
//     },
//     authorize(c) {
//       if (c.password === '@demo1' && c.email === 'toolpad-demo@mui.com') {
//         return {
//           id: 'test',
//           name: 'Toolpad Demo',
//           email: String(c.email),
//         };
//       }
//       return null;
//     },
//   }),
// ];

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  }
  return { id: provider.id, name: provider.name };
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  trustHost: true,
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isPublicPage = nextUrl.pathname.startsWith('/public');

      return isPublicPage || isLoggedIn;
    },
  },
});
