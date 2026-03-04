import { createServerClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// support creating a server-side Supabase client using either the
// public anon key or the service_role key.  we need the service role
// key when rendering pages for unauthenticated visitors so that row
// level security policies don't block reads. mutate operations in
// client components still rely on the normal browser client which uses
// the anon key and the user's session.
export const createClient = (
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  opts?: { useServiceRole?: boolean },
) => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const useServiceRole = opts?.useServiceRole && serviceRoleKey;

  if (!supabaseUrl || (!supabaseKey && !serviceRoleKey)) {
    // Return a dummy client to avoid crashing the render if accessed before redirect
    return {
      from: () => ({
        select: () => ({
          eq: () => ({ single: async () => ({ data: null, error: null }) }),
          order: () => ({ data: null, error: null }),
        }),
        insert: () => ({ error: null }),
        delete: () => ({ neq: () => ({ error: null }) }),
      }),
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
    } as unknown as SupabaseClient;
  }

  // at this point at least one key exists; we assert non-null for TS
  const key: string = useServiceRole ? serviceRoleKey! : supabaseKey!;

  return createServerClient(supabaseUrl, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
