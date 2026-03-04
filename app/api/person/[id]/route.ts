import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Public endpoint that returns a person's record by ID.
// Authentication is deliberately *not* enforced here so that anyone
// (including anonymous visitors) can fetch details. row-level security
// policies in the database should still be configured to allow
// unauthorized reads from `persons` (see docs/schema.sql).

export async function GET(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> },
) {
  // params comes through as a promise in the new app router API, so unwrap it.
  const { id } = (await params) as { id: string };

  // cookies() is also async; await before passing to our helper.
  const cookieStore = await cookies();

  // useServiceRole ensures the service‑role key is used when there is no
  // logged‑in session, preventing RLS from blocking the read.
  const supabase = await createClient(cookieStore, { useServiceRole: true });

  // fetch both the public row and any private details in one go using a
  // nested select. this returns something like
  // { id: ..., full_name: ..., person_details_private: [{ phone_number: ..., ... }] }
  const { data: personWithPrivate, error } = await supabase
    .from("persons")
    .select("*, person_details_private(*)")
    .eq("id", id)
    .single();

  if (error || !personWithPrivate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // merge the first private row (if any) into the top-level object so the
  // client doesn’t have to dig into `person_details_private[0]`.
  const privateRow =
    Array.isArray(personWithPrivate.person_details_private) &&
    personWithPrivate.person_details_private.length > 0
      ? personWithPrivate.person_details_private[0]
      : null;

  const merged = {
    ...personWithPrivate,
    ...(privateRow || {}),
  };

  // remove the nested array before returning
  delete (merged as any).person_details_private;

  return NextResponse.json(merged);
}
