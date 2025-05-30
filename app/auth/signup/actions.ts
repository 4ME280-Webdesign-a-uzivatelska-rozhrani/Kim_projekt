import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    // Sign up using Supabase with email and password
    const { data: sessionData, error } = await supabase.auth.signUp(data);

    if (error) {
        console.error('Signup error:', error.message);
        redirect('/error'); // Redirect to an error page
    }

    if (sessionData?.session) {
        console.log('Newly registered user ID:', sessionData.user?.id);
    }

    revalidatePath('/', 'layout'); // Optional: Revalidate path cache
    redirect('/'); // Redirect user to the home page or dashboard
}