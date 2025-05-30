// This route isn't needed with Supabase auth
// Keeping it empty for now to avoid 404s
export async function GET() {
    return new Response("Auth endpoint", { status: 200 });
}

export async function POST() {
    return new Response("Auth endpoint", { status: 200 });
}