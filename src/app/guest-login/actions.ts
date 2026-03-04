"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createGuestSession } from "@/lib/auth/guest";
import bcrypt from "bcryptjs";

export async function guestLoginAction(prevState: any, formData: FormData) {
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!phone || !password) {
    return { success: false, message: "전화번호와 비밀번호를 입력해주세요." };
  }

  try {
    const supabase = createAdminClient();

    // 1. Find User by Phone
    const { data: guest, error } = await supabase
      .from("guests")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error || !guest) {
      return { success: false, message: "비회원 정보가 존재하지 않습니다." };
    }

    // 2. Verify Password
    const isValid = await bcrypt.compare(password, guest.password_hash);
    if (!isValid) {
      return { success: false, message: "비밀번호가 일치하지 않습니다." };
    }

    // 3. Create Session Cookie
    await createGuestSession(guest.id);

    return { success: true, message: "조회 성공" };
  } catch (err: any) {
    console.error("Guest login error:", err);
    return { success: false, message: "시스템 오류가 발생했습니다." };
  }
}
