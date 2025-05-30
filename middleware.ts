// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Special handling for sign-out
  if (request.nextUrl.pathname === '/auth/signin' &&
      request.nextUrl.searchParams.has('t')) {

    // Create a response that redirects to the sign-in page
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));

    // Delete all cookies related to authentication
    for (const cookie of request.cookies.getAll()) {
      response.cookies.delete(cookie.name);
    }

    return response;
  }



  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name, options) {
            response.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
            });
          },
        },
      }
  );

  // Try to get the session
  const { data: { session } } = await supabase.auth.getSession();

  // Public paths that don't require authentication
  const publicPaths = [
    '/auth/signin',
    '/auth/signup',
    '/api/auth',
    '/_next',
    '/favicon.ico',
  ];

  if (request.nextUrl.pathname.startsWith('/auth/signout')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  const isPublicPath = publicPaths.some(path =>
      request.nextUrl.pathname.startsWith(path)
  );

  // If the user is not logged in and trying to access a protected route
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // If user is signed in and trying to access auth pages, redirect to home
  if (session &&
      (request.nextUrl.pathname.startsWith('/auth/signin') ||
          request.nextUrl.pathname.startsWith('/auth/signup'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};