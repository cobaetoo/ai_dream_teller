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

  // orders 테이블은 dream_id만 가지고 있으므로 dreams를 통해 유저와 조인합니다.
  const {
    data: rawOrders,
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
      dreams (
        user_id,
        guest_id,
        expert_type,
        profiles ( nickname, id ),
        guests ( phone, id )
      )
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Frontend에서 기대하는 구조로 매핑
  const orders = rawOrders?.map((o: any) => {
    // dreams가 배열일 경우 (one-to-many) 처리, 여기서는 one-to-one이므로 o.dreams로 단일객체 반환될 수 있음
    const d = Array.isArray(o.dreams) ? o.dreams[0] : o.dreams;
    return {
      id: o.id,
      amount: o.amount,
      status: o.status,
      created_at: o.created_at,
      user_id: d?.user_id,
      guest_id: d?.guest_id,
      profiles: d?.profiles,
      guests: d?.guests,
      dreams: [d], // FE expects dreams[0]?.expert_type (but wait, FE had o.dreams?.expert)
    };
  });

  return NextResponse.json({
    orders,
    total: count,
    page,
    limit,
    totalPages: count ? Math.ceil(count / limit) : 0,
  });
}
