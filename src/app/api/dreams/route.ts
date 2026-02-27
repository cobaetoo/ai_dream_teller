import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, expert_type, amount } = body;

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

    // 1. 꿈 데이터 생성 (PENDING 상태)
    const { data: dreamData, error: dreamError } = await supabase
      .from("dreams")
      .insert({
        content,
        expert_type,
        status: "PENDING",
        user_id: user?.id || null, // 회원이면 user_id 저장
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
