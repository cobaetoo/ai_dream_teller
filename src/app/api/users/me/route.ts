import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyGuestSession } from "@/lib/auth/guest";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();

  // 1. Check User Session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Fetch Profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      type: "user",
      user: {
        id: user.id,
        email: user.email,
        nickname: profile?.nickname || "Unknown",
        role: profile?.role || "USER",
      },
    });
  }

  // 2. Check Guest Session
  const guestSession = await verifyGuestSession();
  if (guestSession) {
    // Fetch Guest Info (optional, or just return ID)
    // Need admin client to fetch guest phone? No, for security avoid returning phone unless needed.
    // Let's just return minimal info.
    return NextResponse.json({
      type: "guest",
      user: {
        id: guestSession.sub,
        role: "GUEST",
      },
    });
  }

  return NextResponse.json({ user: null }, { status: 401 });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nickname } = body;

    if (!nickname) {
      return NextResponse.json(
        { error: "닉네임을 입력해주세요." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("profiles")
      .update({ nickname })
      .eq("id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
