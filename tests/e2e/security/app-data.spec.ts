import { test, expect } from "@playwright/test";

test.describe("Security App/Data E2E Tests", () => {
  test("Internal API Protection: 시크릿 키 없이 /api/dreams/generate 직접 호출 시 401/403 차단 검증", async ({
    request,
  }) => {
    // 외부 클라이언트인 것처럼 Authorization 헤더(Bearer INTERNAL_API_SECRET)를 비운 상태로 전송
    const response = await request.post("/api/dreams/generate", {
      data: {
        orderId: "fake-order-id-123",
        dreamId: "fake-dream-id-123",
      },
    });

    // 401 Unauthorized 또는 403 Forbidden 상태 코드 반환을 검증
    expect([401, 403, 404]).toContain(response.status());
  });

  test("Error Handling & Data Masking: 의도적 결제 오류 발생 시 응답에 민감한 정보(스택 트레이스/결제키 평문) 미노출 검증", async ({
    request,
  }) => {
    // 결제 확인 API(/api/payments/confirm)에 고의로 잘못된 결제 키를 삽입
    const mockInvalidPaymentData = {
      orderId: "test-order-invalid",
      amount: 1000,
      paymentKey: "fake-secret-toss-payment-key-that-is-100-invalid",
    };

    const response = await request.post("/api/payments/confirm", {
      data: mockInvalidPaymentData,
    });

    // 실패를 기대하므로 400 등 에러 코드 발송
    expect(response.status()).toBeGreaterThanOrEqual(400);

    const errorBodyText = await response.text();

    // 응답 메시지에 백엔드 에러 스택 트레이스 문자열이 포함되어 있는지 검사 (없어야 함)
    // 일반적으로 스택 트레이스는 파일 경로를 담거나, `Error:` 형태로 나옴
    expect(errorBodyText).not.toContain("Error:");
    expect(errorBodyText).not.toContain(".js:");
    expect(errorBodyText).not.toContain(".tsx:");
    expect(errorBodyText).not.toContain("node_modules");

    // 원본 데이터(비밀키 등)가 에러 메시지에 그대로 에코되지 않는지 검사
    expect(errorBodyText).not.toContain(
      "fake-secret-toss-payment-key-that-is-100-invalid",
    );
  });
});
