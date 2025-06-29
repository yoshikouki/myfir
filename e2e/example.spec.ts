import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Create Next App/);
});

test("navigate to PC learning page", async ({ page }) => {
  await page.goto("/pc");

  // Check if PC learning page loads correctly
  await expect(page.getByRole("heading", { name: "はじめてのパソコン" })).toBeVisible();
  await expect(page.getByText("パソコンってなにかな？いっしょにまなぼう！")).toBeVisible();
});

test("PC learning navigation works", async ({ page }) => {
  await page.goto("/pc");

  // Check if navigation buttons are present
  const prevButton = page.getByRole("button", { name: "← まえへ" });
  const nextButton = page.getByRole("button", { name: "つぎへ →" });

  await expect(prevButton).toBeVisible();
  await expect(nextButton).toBeVisible();

  // First step should disable prev button
  await expect(prevButton).toBeDisabled();
  await expect(nextButton).toBeEnabled();
});
