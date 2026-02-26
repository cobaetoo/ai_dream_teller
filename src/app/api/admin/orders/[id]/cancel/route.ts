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
    .select("payment_key, status, amount")
    .eq("id", id)
    .single();

  if (!order || !order.payment_key) {
    return NextResponse.json(
      { error: "Order/Payment Key not found" },
      { status: 404 },
    );
  }

  if (order.status === "CANCELED") {
    return NextResponse.json({ error: "Already canceled" }, { status: 400 });
  }

  const widgetSecretKey = process.env.TOSS_SECRET_KEY;
  if (!widgetSecretKey) {
    return NextResponse.json(
      { error: "Toss Secret Key is missing" },
      { status: 500 },
    );
  }

  const encryptedSecretKey =
    "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");

  try {
    const response = await fetch(
      `https://api.tosspayments.com/v1/payments/${order.payment_key}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: encryptedSecretKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancelReason: "관리자 검수 결과 직권 결제 취소",
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Cancel failed" },
        { status: response.status },
      );
    }

    // DB 업데이트
    const adminClient = createAdminClient();
    const { error: updateError } = await adminClient
      .from("orders")
      .update({ status: "CANCELED" })
      .eq("id", id);

    if (updateError) {
      console.error("Failed to update status in DB:", updateError);
    }

    return NextResponse.json({
      success: true,
      message: "결제 취소 및 환불 처리가 완료되었습니다.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
