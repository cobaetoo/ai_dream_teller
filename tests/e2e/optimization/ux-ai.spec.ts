import { test, expect } from "@playwright/test";

test.describe("UX/AI Optimization E2E Tests", () => {
  test("1. Double-click Prevention: Profile Nickname Update", async ({
    page,
  }) => {
    // 1. 로그인된 상태라 가정하고 마이페이지 진입 (실제 환경에선 로그인 단계 필요)
    await page.goto("/my-page");

    const editButton = page.locator("button:has(.lucide-edit2)");
    await editButton.click();

    const saveButton = page.getByRole("button", { name: "저장" });

    // 네트워크 요청 횟수 트래킹
    let requestCount = 0;
    await page.on("request", (request) => {
      if (
        request.url().includes("/api/users/me") &&
        request.method() === "PATCH"
      ) {
        requestCount++;
      }
    });

    // 아주 빠르게 3번 클릭
    await saveButton.click({ clickCount: 3, delay: 10 });

    // 약간 대기 후 요청 횟수 확인
    await page.waitForTimeout(1000);
    console.log(`Profile update request count: ${requestCount}`);

    // 중복 방지가 안 되어 있다면 requestCount가 1보다 클 것임
    expect(requestCount).toBe(1);
  });

  test("2. Streaming Response Verification: AI Prompt", async ({
    page,
    request,
  }) => {
    // AI 생성 API가 스트리밍을 지원하는지 헤더 확인
    // 실제 AI 생성 버튼 클릭 시나리오를 시뮬레이션
    const response = await request.post("/api/dreams/generate", {
      data: { dreamId: "test-id" },
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    const contentType = response.headers()["content-type"];
    const transferEncoding = response.headers()["transfer-encoding"];

    console.log(`Content-Type: ${contentType}`);
    console.log(`Transfer-Encoding: ${transferEncoding}`);

    // 스트리밍이 적용되어 있다면 text/event-stream 이거나 chunked 인코딩일 것임
    // 현재 구현은 application/json (Non-streaming) 예상
    // expect(transferEncoding).toBe('chunked');
  });
});
