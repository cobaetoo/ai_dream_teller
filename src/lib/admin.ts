import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * 어드민 권한 로직 공통 헬퍼
 * role === 'ADMIN'이 아닌 경우 null을 반환하고,
 * 권한이 확인된 사용자 정보를 반환합니다.
 */
export async function verifyAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "ADMIN") {
    return null;
  }

  return user;
}
