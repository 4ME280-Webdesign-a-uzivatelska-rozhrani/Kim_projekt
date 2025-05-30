import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    const cookieStore = await cookies();
    const supabase = await createClient();

    // Sign out the user from Supabase with global scope
    await supabase.auth.signOut({ scope: 'global' });

    // Get all cookie names and delete them
    const allCookies = cookieStore.getAll();
    allCookies.forEach(cookie => {
        cookieStore.delete(cookie.name);
    });

    // Create a response
    const response = NextResponse.json(
        { success: true },
        {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        }
    );

    // Delete all cookies in the response
    allCookies.forEach(cookie => {
        response.cookies.delete(cookie.name);
    });

    return response;
}