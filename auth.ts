// Server-side auth utilities
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

// Get current user (server-side only)
export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Check authentication and redirect if not logged in
export async function requireAuth() {
  const user = await getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return user;
}

// Get session data
export async function getSession() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}