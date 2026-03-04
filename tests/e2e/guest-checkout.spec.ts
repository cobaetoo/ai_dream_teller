import { test, expect } from "@playwright/test";

test.describe("Guest Checkout Frontend UX", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Mock /api/users/me to return unauthorized 401
    await page.route("**/api/users/me", (route) => {
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Unauthorized" }),
      });
    });
  });

  test("should display guest checkout form and require inputs", async ({
    page,
  }) => {
    // 2. Visit dream teller page
    await page.goto("/dream-teller");

    // Check if guest info area is visible
    const guestSection = page.locator("text=비회원 결제 정보");
    await expect(guestSection).toBeVisible();

    const phoneInput = page.getByPlaceholder("010-1234-5678");
    const passwordInput = page.getByPlaceholder(
      "결제 확인용 비밀번호 (4자리 이상) 입력",
    );
    await expect(phoneInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // 3. Type dream content
    await page
      .getByPlaceholder(/꿈에서 본 장면/)
      .fill("호랑이가 담배를 피우며 나타났습니다.");

    // 4. Try to submit without filling guest form
    let alertMessage = "";
    // Listen for dialog events
    page.on("dialog", (dialog) => {
      alertMessage = dialog.message();
      dialog.accept();
    });

    const submitButton = page.getByRole("button", {
      name: /분석 요청 및 결제하기/,
    });
    await submitButton.click();

    // Give it a short moment for the alert logic
    await page.waitForTimeout(500);

    // Alert should have shown
    expect(alertMessage).toContain(
      "비회원 결제를 위해 전화번호와 비밀번호를 입력해주세요.",
    );

    // 5. Fill guest form and prepare to intercept POST /api/dreams
    await phoneInput.fill("010-9999-8888");
    await passwordInput.fill("1234abcd");

    let postPayload: any = null;
    let apiCalled = false;
    await page.route("**/api/dreams", async (route) => {
      apiCalled = true;
      postPayload = route.request().postDataJSON();
      // Fulfill with dummy success to prevent failing
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          orderId: "guest_order_123",
          dreamId: "guest_dream_123",
        }),
      });
    });

    // 6. Navigate/Mock payment page so the router.push doesn't fail
    await page.route("**/payments?**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<html><body><p>Mock Payment Page</p></body></html>",
      });
    });

    // Reset dialog listener just in case
    page.removeAllListeners("dialog");

    // Submit form
    await submitButton.click();

    // Give it a moment to send the request and route
    await page.waitForTimeout(1000);

    // Verify payload includes phone and password
    expect(apiCalled).toBe(true);
    expect(postPayload).not.toBeNull();
    expect(postPayload.phone).toBe("010-9999-8888");
    expect(postPayload.password).toBe("1234abcd");
    expect(postPayload.content).toBe("호랑이가 담배를 피우며 나타났습니다.");
  });
});
