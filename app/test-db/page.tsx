import { isSupabaseConfigured, supabase } from "@/app/lib/supabase";

export default async function TestDatabase() {
    if (!isSupabaseConfigured || !supabase) {
        return <div>Supabase is not configured. Add the URL and publishable key to the project-root .env.local file.</div>;
    }

    const { data, error } = await supabase
        .from("properties")
        .select("*");

    if (error) {
        return (
            <div>
                Database error: {error.message}
            </div>
        );
    }

    return (
        <div>
            <h1>Database connected!</h1>

            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}
