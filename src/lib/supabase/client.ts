import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

// Creates a Supabase client for use in Client Components and hooks.
// Since we're using static export (output: "export"), all Supabase
// interactions happen client-side — this is the only client you need.
//
// This uses a singleton pattern so you don't create a new client on
// every render — import and call createClient() wherever you need it.

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
