import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TOSS_WEBHOOK_IPS = [
  "13.124.18.147",
  "13.124.108.35",
  "3.36.173.151",
  "3.38.81.32",
  "115.92.221.121",
  "115.92.221.122",
  "115.92.221.123",
  "115.92.221.125",
  "115.92.221.126",
  "115.92.221.127",
];

export async function POST(req: Request) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip");

    const isDevelopment = process.env.NODE_ENV === "development";
    const isTossIp = clientIp && TOSS_WEBHOOK_IPS.includes(clientIp);

    if (!isDevelopment && !isTossIp) {
      console.warn(`Unauthorized webhook attempt from IP: ${clientIp}`);
      return NextResponse.json({ error: "Unauthorized IP" }, { status: 403 });
    }

    const body = await req.json();
    const { eventType, data } = body;

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
