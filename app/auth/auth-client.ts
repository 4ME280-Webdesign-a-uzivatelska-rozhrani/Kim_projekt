// auth-client.ts
'use client';

export function signIn() {
    window.location.href = '/auth/signin';
}

export async function signOut() {
    try {
        // First, call the signout API
        await fetch('/api/auth/signout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
            credentials: 'include', // Important for cookie operations
            cache: 'no-store'
        });

        // Clear all localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.clear();
        }

        // Clear all sessionStorage
        if (typeof window !== 'undefined' && window.sessionStorage) {
            sessionStorage.clear();
        }

        // Use a hardcoded different origin redirect to break any session state
        // This is the most aggressive approach but should work
        window.location.href = `${window.location.origin}/auth/signin?t=${Date.now()}`;

        // As a fallback, reload the page after a short delay
        setTimeout(() => {
            window.location.reload();
        }, 500);
    } catch (error) {
        console.error('Error signing out:', error);

        // Even if the API call fails, clear client-side state
        if (typeof window !== 'undefined') {
            localStorage.clear();
            sessionStorage.clear();
        }

        // Force reload to login page
        window.location.href = `/auth/signin?error=true&t=${Date.now()}`;
    }
}