import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await verifyAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Retrieve complete order details
  const { data: rawOrder, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      dreams (
        user_id,
        guest_id,
        content,
        expert_type,
        status,
        has_image_gen,
        analysis_result,
        image_url,
        is_public,
        created_at,
        profiles ( nickname, id ),
        guests ( phone, id )
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error || !rawOrder) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const d: any = Array.isArray(rawOrder.dreams)
    ? rawOrder.dreams[0]
    : rawOrder.dreams;

  const order = {
    ...rawOrder,
    user_id: d?.user_id || (rawOrder as any).user_id,
    guest_id: d?.guest_id || (rawOrder as any).guest_id,
    profiles: d?.profiles,
    guests: d?.guests,
    dreams: d ? [d] : [], // 빈 배열인 경우 빈 배열 할당
  };

  console.log(
    "---- ADMIN ORDER DETAIL FETCHED:",
    JSON.stringify(order, null, 2),
  );

  return NextResponse.json(order);
}
