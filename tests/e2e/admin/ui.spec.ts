import { test, expect } from "@playwright/test";

test.describe("Admin UI Components Check", () => {
  test("Dashboard displays correctly", async ({ page }) => {
    await page.goto("/admin");

    // Check titles and KPI cards
    await expect(page.locator("h1", { hasText: "대시보드" })).toBeVisible();
    await expect(page.locator("text=총 매출 (주간)")).toBeVisible();
    await expect(page.locator("text=신규 가입자")).toBeVisible();
    await expect(page.locator("text=총 결제 건수")).toBeVisible();
    await expect(page.locator("text=해몽 생성 성공률")).toBeVisible();
    await expect(page.locator("text=매출 추이")).toBeVisible();
  });

  test("Order List displays table and pagination", async ({ page }) => {
    await page.goto("/admin/order-list");

    await expect(
      page.locator("h1", { hasText: "주문/결제 목록" }),
    ).toBeVisible();
    // Check table headers
    await expect(page.locator("th", { hasText: "주문번호" })).toBeVisible();
    await expect(page.locator("th", { hasText: "유저 정보" })).toBeVisible();
    await expect(page.locator("th", { hasText: "결제액" })).toBeVisible();

    // The first row should contain a detail link
    const viewDetailLink = page.locator("a", { hasText: "상세보기" }).first();
    await expect(viewDetailLink).toBeVisible();

    // Click on detail
    await viewDetailLink.click();
    await expect(page).toHaveURL(/\/admin\/order-list\/order-.*/);

    // Assert detail page
    await expect(page.locator("h1", { hasText: /주문 상세:/ })).toBeVisible();
    await expect(page.locator("text=사용자 입력 내용 (Prompt)")).toBeVisible();

    // Assert CS actionable buttons exist
    await expect(
      page.locator("button", { hasText: "AI 해몽 결과 다시 생성하기" }),
    ).toBeVisible();
    await expect(
      page.locator("button", { hasText: "결제 강제 취소 (환불)" }),
    ).toBeVisible();
  });

  test("User List displays hybrid table and filters", async ({ page }) => {
    await page.goto("/admin/user-list");

    await expect(page.locator("h1", { hasText: "회원 목록" })).toBeVisible();
    await expect(
      page.getByPlaceholder("이메일 또는 연락처 검색"),
    ).toBeVisible();

    // Test filter buttons exist
    await expect(
      page.locator("button", { hasText: "전체 사용자" }),
    ).toBeVisible();
    await expect(
      page.locator("button", { hasText: "가입 회원" }),
    ).toBeVisible();
    await expect(
      page.locator("button", { hasText: "비회원(결제)" }),
    ).toBeVisible();

    // Check table headers
    await expect(page.locator("th", { hasText: "식별자(ID)" })).toBeVisible();
    await expect(
      page.locator("th", { hasText: "누적 결제금액" }),
    ).toBeVisible();
  });

  test("Feed List displays moderation actions", async ({ page }) => {
    await page.goto("/admin/feed-list");

    await expect(
      page.locator("h1", { hasText: "공개 피드 관리" }),
    ).toBeVisible();

    // Check search
    await expect(page.getByPlaceholder("꿈 내용 검색...")).toBeVisible();

    // By default, mock data has at least one "강제 숨김" button
    const hideBtn = page.locator("button", { hasText: "강제 숨김" }).first();
    await expect(hideBtn).toBeVisible();
  });
});
