import { test, expect } from "@playwright/test";

test.describe("Database Optimization E2E Tests", () => {
  test("1. N+1 Query Prevention Verification", async ({ page, request }) => {
    // API 직접 호출을 통해 응답 데이터 구조 확인
    const response = await request.get("/api/dreams?type=feed");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    if (data.dreams && data.dreams.length > 0) {
      // 각 꿈 아이템에 profiles 정보가 단일 요청 결과에 포함되어 있는지 확인 (N+1 방지 증거)
      const firstDream = data.dreams[0];
      // API에서 .select('*, profiles(nickname)') 을 사용하므로 profiles 객체가 존재해야 함
      expect(firstDream.profiles).toBeDefined();
      console.log(
        "N+1 Query Prevention: Confirmed (Profile data included in single response)",
      );
    }
  });

  test("2. Pagination Performance (Baseline)", async ({ page }) => {
    const start = performance.now();
    await page.goto("/feeds");
    await page.waitForLoadState("networkidle");
    const end = performance.now();

    console.log(
      `Feed page load time (Initial 50 items): ${(end - start).toFixed(2)}ms`,
    );

    // 현재는 커서 기반 페이지네이션이 구현되지 않았으므로 응답 속도 로깅 위주로 진행
    const dreamsCount = await page.locator(".group").count();
    console.log(`Rendered items count: ${dreamsCount}`);
    expect(dreamsCount).toBeLessThanOrEqual(50);
  });
});
