import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paymentKey, orderId, amount } = body;

    const widgetSecretKey = process.env.TOSS_SECRET_KEY;
    if (!widgetSecretKey) {
      return NextResponse.json(
        { success: false, error: "Toss payment secret key is not configured." },
        { status: 500 },
      );
    }

    const encryptedSecretKey =
      "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");

    const response = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: encryptedSecretKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount,
          paymentKey,
        }),
      },
    );

    if (response.ok) {
      const data = await response.json();

      try {
        const supabase = createAdminClient();

        const { error: orderError } = await supabase
          .from("orders")
          .update({
            status: "DONE",
            payment_key: paymentKey,
            approved_at: data.approvedAt || new Date().toISOString(),
          })
          .eq("id", orderId);

        if (orderError) {
          console.error(
            "Order DB update failed after successful payment:",
            orderError,
          );
        }
      } catch (dbErr) {
        console.error(
          "Supabase integration error during payment confirm:",
          dbErr,
        );
      }

      return NextResponse.json({
        success: true,
        data,
        message: "Payment confirmed successfully",
      });
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, error: errorData },
        { status: response.status },
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
