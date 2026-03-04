import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import bcrypt from "bcryptjs";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, expert_type, amount, has_image_gen, phone, password } =
      body;

    if (!content || !expert_type || !amount) {
      return NextResponse.json(
        { success: false, error: "Required fields are missing." },
        { status: 400 },
      );
    }

    // 세션에서 현재 유저 정보 가져오기 (회원인 경우)
    const supabaseServer = await createClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    const supabase = createAdminClient();

    let finalUserId = user?.id || null;
    let finalGuestId = null;

    if (!finalUserId) {
      if (!phone || !password) {
        return NextResponse.json(
          {
            success: false,
            error: "비회원 결제를 위한 전화번호와 비밀번호가 필요합니다.",
          },
          { status: 400 },
        );
      }

      // Check if guest with phone exists
      const { data: existingGuest } = await supabase
        .from("guests")
        .select("id, password_hash")
        .eq("phone", phone)
        .single();

      if (existingGuest) {
        // Verify password
        const isMatch = await bcrypt.compare(
          password,
          existingGuest.password_hash,
        );
        if (!isMatch) {
          return NextResponse.json(
            {
              success: false,
              error:
                "입력하신 전화번호가 이미 존재하지만 비밀번호가 일치하지 않습니다.",
            },
            { status: 401 },
          );
        }
        finalGuestId = existingGuest.id;
      } else {
        // Create new guest
        const guestId = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(password, 10);
        const { error: insertError } = await supabase.from("guests").insert({
          id: guestId,
          phone,
          password_hash: hashedPassword,
        });

        if (insertError) {
          console.error("Guest creation error:", insertError);
          return NextResponse.json(
            { success: false, error: "Failed to create guest record." },
            { status: 500 },
          );
        }
        finalGuestId = guestId;
      }
    }

    // 1. 꿈 데이터 생성 (PENDING 상태)
    const { data: dreamData, error: dreamError } = await supabase
      .from("dreams")
      .insert({
        content,
        expert_type,
        status: "PENDING",
        user_id: finalUserId,
        guest_id: finalGuestId,
        has_image_gen: !!has_image_gen,
      })
      .select("id")
      .single();

    if (dreamError || !dreamData) {
      console.error("Dream creation error:", dreamError);
      return NextResponse.json(
        { success: false, error: "Failed to create dream record." },
        { status: 500 },
      );
    }

    // 2. 주문 데이터 생성 (READY 상태, Toss orderId로 nanoid 활용)
    const orderId = nanoid();
    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      dream_id: dreamData.id,
      amount: Number(amount),
      status: "READY",
    });

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        { success: false, error: "Failed to create order record." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      orderId,
      dreamId: dreamData.id,
    });
  } catch (error: any) {
    console.error("Dream API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "feed" | "my"
    const limit = parseInt(searchParams.get("limit") || "20");
    const lastCreatedAt = searchParams.get("lastCreatedAt");

    const supabase = await createClient();
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const {
      data: { user },
    } = token
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser();

    if (type === "my") {
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      let query = supabase
        .from("dreams")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (lastCreatedAt) {
        query = query.lt("created_at", lastCreatedAt);
      }

      const { data: dreams, error } = await query;

      if (error) {
        console.error("My dreams fetch error:", error);
        return NextResponse.json(
          { error: "Failed to fetch dreams" },
          { status: 500 },
        );
      }
      return NextResponse.json({ success: true, dreams });
    }

    if (type === "feed") {
      let query = supabase
        .from("dreams")
        .select("*, profiles(nickname)")
        .eq("is_public", true)
        .eq("status", "COMPLETED")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (lastCreatedAt) {
        query = query.lt("created_at", lastCreatedAt);
      }

      const { data: dreams, error } = await query;

      if (error) {
        console.error("Feed dreams fetch error:", error);
        return NextResponse.json(
          { error: "Failed to fetch dreams" },
          { status: 500 },
        );
      }
      return NextResponse.json({ success: true, dreams });
    }

    return NextResponse.json(
      { success: false, error: "Invalid type parameter" },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("Dreams GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
