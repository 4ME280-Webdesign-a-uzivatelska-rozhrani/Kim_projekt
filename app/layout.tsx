import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Navigation } from '@toolpad/core/AppProvider';
import theme from '../theme';
import { createClient } from '@/utils/supabase/server';
import { signIn, signOut } from './auth/auth-client';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Anime',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'watchlist',
    title: 'Watchlist',
    icon: <PersonIcon />,
  },
];

// Client-side authentication functions that match the expected types
const AUTHENTICATION = {
  signIn, // This is a function that takes no parameters
  signOut // This is a function that takes no parameters
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Get session data for initial render
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
      <html lang="en" data-toolpad-color-scheme="light">
      <body>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <NextAppProvider
            theme={theme}
            navigation={NAVIGATION}
            session={session}
            authentication={AUTHENTICATION}
        >
          {children}
        </NextAppProvider>
      </AppRouterCacheProvider>
      </body>
      </html>
  );
}