"use client";

import { Profile } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { User, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, ReactNode, useMemo } from "react";

interface UserState {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isEditor: boolean;
  supabase: SupabaseClient;
}

const UserContext = createContext<UserState | undefined>(undefined);

export function UserProvider({
  children,
  user,
  profile,
}: {
  children: ReactNode;
  user?: User | null;
  profile?: Profile | null;
}) {
  const supabase = useMemo(() => createClient(), []);
  const isAdmin = profile?.role === "admin";
  const isEditor = profile?.role === "editor" || isAdmin;

  // provide sensible defaults when no user is present so that
  // client components can read from context without needing to
  // guard against undefined.
  const value = {
    user: user ?? null,
    profile: profile ?? null,
    isAdmin: Boolean(isAdmin),
    isEditor: Boolean(isEditor),
    supabase,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    // return a default object instead of throwing — this makes it
    // safe to call useUser() even when there is no provider (for
    // example, during testing or on anonymous layout routes).
    return {
      user: null,
      profile: null,
      isAdmin: false,
      isEditor: false,
      supabase: createClient(),
    };
  }
  return context;
}
