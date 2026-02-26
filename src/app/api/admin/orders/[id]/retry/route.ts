import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await verifyAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const supabase = createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("dream_id")
    .eq("id", id)
    .single();

  if (!order || !order.dream_id) {
    return NextResponse.json(
      { error: "Order/Dream not found" },
      { status: 404 },
    );
  }

  // AI를 재생성하기 위해 dreams 상태를 변경합니다.
  const adminClient = createAdminClient();
  const { error: resetError } = await adminClient
    .from("dreams")
    .update({ status: "PENDING" })
    .eq("id", order.dream_id);

  if (resetError) {
    return NextResponse.json(
      { error: "Failed to reset dream state" },
      { status: 500 },
    );
  }

  try {
    // 백그라운드 서버로 Generate API 호출
    const host = request.headers.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const generateRes = await fetch(
      `${protocol}://${host}/api/dreams/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ dreamId: order.dream_id }),
      },
    );

    if (!generateRes.ok) {
      throw new Error("Generation request failed");
    }

    // 성공 시 반환
    return NextResponse.json({
      success: true,
      message: "AI 해몽 재수행 요청 완료",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
