import { NextResponse } from "next/server";

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
      // 결제가 최종적으로 성공했으므로, 여기서 Supabase DB 업데이트 로직 처리
      // 현재는 일단 성공 상태만 리턴합니다.
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
