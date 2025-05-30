import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '<your-supabase-url>';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '<your-supabase-anon-key>';

let supabasePromise: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
    if (!supabasePromise) {
        supabasePromise = createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabasePromise;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);