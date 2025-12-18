import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { removeGuestSession } from "@/lib/auth/guest";

export async function POST() {
  // 1. Clear Supabase User Session
  const supabase = await createClient();
  await supabase.auth.signOut();

  // 2. Clear Guest Session
  await removeGuestSession();

  return NextResponse.json({ success: true });
}
