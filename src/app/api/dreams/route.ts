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
