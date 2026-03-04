import { test, expect } from "@playwright/test";

test.describe("Guest Checkout Full-Flow (No Mocks)", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Ensure /api/users/me returns 401 (Guest state)
    await page.route("**/api/users/me", (route) => {
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Unauthorized" }),
      });
    });
  });

  test("should successfully create dream record and order for guest", async ({
    page,
  }) => {
    const uniqueId = Date.now().toString().slice(-6);
    const guestPhone = `010-0000-${uniqueId}`;
    const guestPassword = "password1234!";

    // 2. Visit dream teller page
    await page.goto("/dream-teller");

    // 3. Fill Dream Content
    await page
      .getByPlaceholder(/꿈에서 본 장면/)
      .fill(`무의식의 숲에서 길을 찾는 꿈입니다. ID: ${uniqueId}`);

    // 4. Fill Guest Info
    await page.getByPlaceholder("010-1234-5678").fill(guestPhone);
    await page
      .getByPlaceholder("결제 확인용 비밀번호 (4자리 이상) 입력")
      .fill(guestPassword);

    // 5. Submit and Intercept API response (Real call)
    const apiPromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/dreams") &&
        response.request().method() === "POST",
    );

    await page.getByRole("button", { name: /분석 요청 및 결제하기/ }).click();

    // 6. Verify Backend Response
    const response = await apiPromise;
    const result = await response.json();

    expect(response.status()).toBe(200);
    expect(result.success).toBe(true);
    expect(result.orderId).toBeDefined();

    // 7. Verify Navigation to Payments
    await expect(page).toHaveURL(/\/payments/);
    await expect(page).toHaveURL(new RegExp(`orderId=${result.orderId}`));
  });
});
