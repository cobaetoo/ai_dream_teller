import { test, expect } from "@playwright/test";

test.describe("My Page Dream Calendar E2E Test (MECE)", () => {
  const TODAY = new Date();

  // Create dates for scenario
  const completedDate = new Date(TODAY);
  completedDate.setDate(TODAY.getDate() - 1); // Yesterday

  const pendingDate = new Date(TODAY);
  pendingDate.setDate(TODAY.getDate() - 2); // 2 Days ago

  test.beforeEach(async ({ page }) => {
    // 1. Mock user session
    await page.route("/api/users/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "tester",
            nickname: "테스트",
            email: "test@example.com",
            role: "USER",
          },
        }),
      });
    });

    // 2. Mock dreams api
    await page.route("/api/dreams?type=my", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          dreams: [
            {
              id: "d1",
              status: "COMPLETED",
              created_at: completedDate.toISOString(),
              content: "완료된 꿈",
              expert_type: "FREUD",
            },
            {
              id: "d2",
              status: "PENDING",
              created_at: pendingDate.toISOString(),
              content: "해몽 진행중 꿈",
              expert_type: "JUNG",
            },
          ],
        }),
      });
    });
  });

  test("Calendar selectively highlights COMPLETED dreams", async ({ page }) => {
    await page.goto("/my-page");

    // Wait for data load
    await expect(page.locator("text=최근 해몽 기록")).toBeVisible();

    // Check specific dates using day picker's button properties
    const completedStr = completedDate.getDate().toString();
    const pendingStr = pendingDate.getDate().toString();

    // Verify Calendar is rendered inside the Card
    const calendarCard = page
      .locator("text=나의 꿈 캘린더")
      .locator("xpath=ancestor::div[contains(@class, 'border-slate-100')]")
      .first();
    await expect(calendarCard).toBeVisible();

    // Verify properties of the date buttons
    // The date cell button contains the date text inside calendarCard
    // Avoid outside days from previous/next months by adding .rdp-day_outside limitation or just picking the exact visible active one.
    // However, react-day-picker default class for a day is .rdp-day
    const completedButton = calendarCard.locator(`.rdp-day:not(.rdp-day_outside)`, { hasText: new RegExp(`^${completedStr}$`) }).first();
    const pendingButton = calendarCard.locator(`.rdp-day:not(.rdp-day_outside)`, { hasText: new RegExp(`^${pendingStr}$`) }).first();

    // Wait bounds
    await expect(completedButton).toBeVisible();
    await expect(pendingButton).toBeVisible();

    // evaluate inline styles computed by react-day-picker modifiers
    const cStyle = await completedButton.evaluate(
      (b) => window.getComputedStyle(b).backgroundColor,
    );
    const pStyle = await pendingButton.evaluate(
      (b) => window.getComputedStyle(b).backgroundColor,
    );

    // Assert: completedDate cell must be purple
    expect(cStyle).toMatch(/139, 92, 246|#8b5cf6|rgb\(139,\s*92,\s*246\)/);

    // Assert: pendingDate cell must be transparent/default
    expect(pStyle).not.toMatch(/139, 92, 246|#8b5cf6|rgb\(139,\s*92,\s*246\)/);
  });
});
