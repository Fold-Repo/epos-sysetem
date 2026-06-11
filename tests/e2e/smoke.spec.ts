import { test, expect } from "@playwright/test";

const email = process.env.TEST_USER_EMAIL ?? "";
const password = process.env.TEST_USER_PASSWORD ?? "";

test.describe("e-pos browser smoke", () => {
  test("login page renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  test.skip(!email || !password, "requires TEST_USER_EMAIL and TEST_USER_PASSWORD");

  test("login redirects to dashboard", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /sign in|log in|login/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 30_000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("key dashboard pages load", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /sign in|log in|login/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 30_000 });

    for (const route of [
      "/dashboard",
      "/dashboard/sales",
      "/dashboard/products",
      "/dashboard/reports/sales",
    ]) {
      const response = await page.goto(route);
      expect(response?.status() ?? 0).toBeLessThan(500);
    }
  });
});
