import { test, expect } from "@playwright/test";

test.describe("SEO Optimization E2E Tests", () => {
  test("1. Dynamic Metadata Verification on /dream-result/[id]", async ({
    page,
  }) => {
    // 1. 피드 페이지에서 첫 번째 결과 아이템의 상세 페이지로 이동
    await page.goto("/feeds");

    // 피드 카드 중 상태가 COMPLETED인 첫 번째 카드를 찾습니다.
    const completedFeedCard = page.locator("div.group").first();
    const resultLink = completedFeedCard;

    // ID를 추출하기 위해 클릭하거나 URL을 직접 얻습니다.
    // 여기서는 테스트 편의상 피드 목록에서 상세 페이지로 이동하는 행위를 시뮬레이션하거나
    // DB에 있는 특정 ID를 사용해야 하는데, 앞선 테스트 결과를 참고하여 이동합니다.
    await completedFeedCard.click();
    await page.waitForLoadState("networkidle");

    // 2. 헤드 내 메타데이터 확인
    const title = await page.title();
    // 기본 제목(AI Dream Teller)이 아닌 분석 결과가 포함된 제목인지 확인
    console.log(`Current Page Title: ${title}`);

    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute("content")
      .catch(() => null);
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content")
      .catch(() => null);
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content")
      .catch(() => null);

    console.log(`OG Title: ${ogTitle}`);
    console.log(`OG Image: ${ogImage}`);
    console.log(`Description: ${description}`);

    // 현재는 generateMetadata가 없으므로 실패하거나 기본값일 것임
    // 테스트에서는 존재 여부 및 동적 매칭 여부를 검증
    expect(title).not.toBe("AI Dream Teller");
    expect(ogTitle).toBeTruthy();
    expect(ogImage).toBeTruthy();
    expect(description).toBeTruthy();
  });
});
