'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  // Clear any existing cookies first to prevent conflicts
  const cookieStore = await cookies();
  const cookiesToClear = [
    'sb-access-token',
    'sb-refresh-token',
    'supabase-auth-token',
    '__supabase_session'
  ];

  cookiesToClear.forEach(name => {
    cookieStore.delete(name);
  });

  // Now attempt to log in with clean state
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error("Login error:", error.message);
    // Instead of redirecting, throw an error so the client can handle it
    throw new Error(error.message);
  }

  if (!authData.session) {
    throw new Error("No session created");
  }

  revalidatePath('/', 'layout');
  redirect('/');
}