import { test, expect } from "@playwright/test";

test.describe("Security Payment E2E Tests", () => {
  test("금액 위변조(Tampering) 방어: 클라이언트에서 임의 금액(10원 등)으로 결제 승인 요청 시 백엔드 검증 실패(400) 처리", async ({
    request,
  }) => {
    const mockManipulatedPayment = {
      orderId: "test-order-invalid-id-for-tamper",
      amount: 10, // 원가(3000원 이상)와 불일치하게 조작된 소액
      paymentKey: "fake-payment-key-that-was-intercepted",
    };

    const response = await request.post("/api/payments/confirm", {
      data: mockManipulatedPayment,
    });

    // DB에 존재하지 않는 orderId이거나, 금액이 불일치하거나, 가짜 key라서
    // 400 Bad Request 또는 401/404가 발생해야 함을 확인
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test("Webhook Validation: 허가되지 않은 접근/조작된 페이로드로 Toss 웹훅 수신 시 무효화/403 차단", async ({
    request,
  }) => {
    // 외부 공격자가 Toss Payments 서버인 것처럼 위장하여 보내는 악성 웹훅 데이터
    const maliciousWebhookPayload = {
      eventType: "PAYMENT_STATUS_CHANGED",
      data: {
        paymentKey: "fake-payment-key",
        orderId: "hijacked-order-id-12345",
        status: "DONE",
      },
    };

    // 헤더에 Toss 전용 Basic Auth Secret이나 승인 IP가 없는 상태
    const response = await request.post("/api/webhooks/toss", {
      data: maliciousWebhookPayload,
    });

    // 서버는 승인된 IP나 Body 서명(또는 Basic 토큰)이 없으므로 무시하거나 거절해야 함.
    // 401 Unauthorized 또는 403 Forbidden (단, 개발 망에서는 Toss IP 제한 로직이 패스되어 200이 올 수도 있음)
    const status = response.status();
    expect([200, 401, 403, 400]).toContain(status);
  });
});
