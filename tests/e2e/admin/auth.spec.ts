import { test, expect } from "@playwright/test";

test.describe("Admin Protected Routes Check", () => {
  test("unauthorized users should be redirected from /admin to /auth or home", async ({
    page,
  }) => {
    // Navigate to admin
    await page.goto("/admin");

    // In our logic, it redirects to /auth if no user, or / if not an admin.
    // So the URL should not be /admin anymore.
    await expect(page).not.toHaveURL("/admin");

    // Verify it redirects exactly to /auth or / based on the implementation
    // For local env with no users logged in, it redirects to /auth.
    const url = page.url();
    expect(url.includes("/auth") || url.endsWith("/")).toBeTruthy();
  });
});
