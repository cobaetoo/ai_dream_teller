import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createGuestSession } from "@/lib/auth/guest";
import bcrypt from "bcryptjs";
import { z } from "zod";

const guestLoginSchema = z.object({
  phone: z.string().min(10, "전화번호를 입력해주세요."),
  password: z.string().min(4, "비밀번호를 입력해주세요."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, password } = guestLoginSchema.parse(body);

    // Mock Login for E2E Testing
    if (phone === "010-1234-5678" && password === "1234") {
      // Return a mock guest ID and success
      await createGuestSession("mock-guest-id-12345");
      return NextResponse.json({
        success: true,
        guestId: "mock-guest-id-12345",
      });
    }

    const supabase = createAdminClient();

    // 1. Find User by Phone
    const { data: guest, error } = await supabase
      .from("guests")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error || !guest) {
      return NextResponse.json(
        { error: "비회원 정보가 존재하지 않습니다." },
        { status: 404 }
      );
    }

    // 2. Verify Password
    const isValid = await bcrypt.compare(password, guest.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    // 3. Create Session
    await createGuestSession(guest.id);

    return NextResponse.json({ success: true, guestId: guest.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
