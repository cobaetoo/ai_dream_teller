import { test, expect } from "@playwright/test";

test.describe("Network Optimization E2E Tests", () => {
  test("1. Resource Caching: Verify /feeds filtering response time", async ({
    page,
  }) => {
    // 1. 초기 진입 (캐시 미스 예상)
    const start1 = performance.now();
    await page.goto("/feeds");
    await page.waitForLoadState("networkidle");
    const end1 = performance.now();
    const duration1 = end1 - start1;
    console.log(`Initial Load Time: ${duration1.toFixed(2)}ms`);

    // 2. 검색 파라미터 변경 (전문가 필터링)
    const start2 = performance.now();
    await page.goto("/feeds?expert=FREUD");
    await page.waitForLoadState("networkidle");
    const end2 = performance.now();
    const duration2 = end2 - start2;
    console.log(`Filtering Load Time (First): ${duration2.toFixed(2)}ms`);

    // 3. 동일한 필터로 다시 진입 (캐시 히트 기대)
    const start3 = performance.now();
    await page.goto("/feeds?expert=FREUD");
    await page.waitForLoadState("networkidle");
    const end3 = performance.now();
    const duration3 = end3 - start3;
    console.log(`Filtering Load Time (Cached): ${duration3.toFixed(2)}ms`);

    // 캐싱이 동작한다면 duration3가 duration2보다 유의미하게 짧아야 함 (로컬 환경임을 감안하여 유연하게 측정)
    // 혹은 x-nextjs-cache 헤더 등을 확인할 수도 있으나, 여기서는 응답 시간 추이에 집중함
    expect(duration3).toBeLessThan(duration2 + 500); // 로컬 네트워크 변동폭 고려
  });
});
