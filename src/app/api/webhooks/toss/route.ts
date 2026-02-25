import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventType, data } = body;

    // TODO: Verify Webhook source (e.g., using Toss Payments provided IP list or secret tokens)
    // if (!isValidSource(req)) return NextResponse.json({}, { status: 403 });

    const supabase = createAdminClient();

    if (eventType === "PAYMENT_STATUS_CHANGED") {
      const { paymentKey, orderId, status, approvedAt } = data;

      // Update Order DB based on Toss event
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          status: status, // CANCELED, DONE, etc
          payment_key: paymentKey,
          approved_at: approvedAt || null,
        })
        .eq("id", orderId);

      if (orderError) {
        console.error("Webhook Order Update Failed:", orderError);
        return NextResponse.json(
          { success: false, error: "DB Update Failed" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error: any) {
    console.error("Toss Webhook Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
