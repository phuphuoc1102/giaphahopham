import { Profile } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";

// Hàm này được cache lại để đảm bảo chỉ tạo 1 Supabase Client duy nhất cho mỗi request
export const getSupabase = cache(async () => {
  const cookieStore = await cookies();
  // create a client with the normal anon key first (so we can check the
  // current session). if the user is not logged in and we have a
  // service role key available, recreate the client with the service role
  // key so that RLS policies don't block SELECT queries for anonymous
  // visitors. mutation operations (in client components) will still run
  // through the browser client which uses the anon key and the user's
  // session token.
  let supabase = await createClient(cookieStore);
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      supabase = await createClient(cookieStore, { useServiceRole: true });
    }
  } catch {
    // ignore – if auth call fails just fall back to anon client
  }
  return supabase;
});

export const getUser = cache(async () => {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

export const getProfile = cache(async (userId?: string) => {
  let id = userId;
  if (!id) {
    const user = await getUser();
    if (!user) return null;
    id = user.id;
  }

  const supabase = await getSupabase();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  return profile as Profile | null;
});

export const getIsAdmin = cache(async () => {
  const profile = await getProfile();
  return profile?.role === "admin";
});
