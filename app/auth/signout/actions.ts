'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function serverSignOut() {
    const cookieStore = await cookies();
    const supabase = await createClient();

    // Sign out the user
    await supabase.auth.signOut();

    // Clear all Supabase-related cookies
    const cookiesToClear = [
        'sb-access-token',
        'sb-refresh-token',
        'supabase-auth-token',
        '__supabase_session'
    ];

    cookiesToClear.forEach(name => {
        cookieStore.delete(name);
    });

    // Redirect to sign-in page with a timestamp to prevent caching
    redirect(`/auth/signin?signedout=${Date.now()}`);
}