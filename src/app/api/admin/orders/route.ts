import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/admin";

export async function GET(request: Request) {
  const user = await verifyAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  // Supabase의 Join을 활용하여 orders, profiles(or guests), dreams의 요약을 함께 가져올 수 있음
  // 단, orders 테이블이 profiles_id와 guests_id를 가지고 있으므로 둘 중 하나를 엮어 유저 정보를 보여줍니다.
  const {
    data: orders,
    count,
    error,
  } = await supabase
    .from("orders")
    .select(
      `
      id,
      amount,
      status,
      created_at,
      user_id,
      guest_id,
      profiles ( email, nickname ),
      guests ( email, nickname ),
      dreams ( expert )
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    orders,
    total: count,
    page,
    limit,
    totalPages: count ? Math.ceil(count / limit) : 0,
  });
}
