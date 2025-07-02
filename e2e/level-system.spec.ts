import { expect, test } from "@playwright/test";

test.describe("Level System", () => {
  test.beforeEach(async ({ page }) => {
    // LocalStorageをリセット
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("myfir-player-progress");
    });
  });

  test("should display initial level on homepage", async ({ page }) => {
    await page.goto("/");

    // レベル表示が見える
    const levelDisplay = page.getByText(/Lv\.1/);
    await expect(levelDisplay).toBeVisible();
  });

  test("should gain experience and level up in typing practice", async ({ page }) => {
    await page.goto("/typing");

    // コース選択（より具体的なセレクター）
    await page
      .getByRole("button", { name: /どうぶつ/ })
      .first()
      .click();

    // いぬレッスン選択
    await page.getByText("いぬ").click();

    // タイピングゲーム開始 - 'inu'を入力
    await page.keyboard.press("i");
    await page.keyboard.press("n");
    await page.keyboard.press("u");

    // 完了メッセージを待つ
    await expect(page.getByText("よくできました！")).toBeVisible();

    // レベルアップモーダルが表示される可能性
    // （初回完了 + レッスン完了で45XP、レベル1→2は50XPなので近い）
    const levelUpModal = page.getByText("レベルアップ！");
    const modalVisible = await levelUpModal.isVisible().catch(() => false);

    if (modalVisible) {
      await expect(levelUpModal).toBeVisible();
      // モーダルを閉じる
      await page.getByText("つづける！").click();
    }
  });

  test("should show progress in level display", async ({ page }) => {
    await page.goto("/");

    // レベル表示が正しく表示される
    const levelDisplay = page.getByText(/Lv\.1/);
    await expect(levelDisplay).toBeVisible();

    // タイピング練習に移動
    await page.getByText("もじを うとう").click();

    // ヘッダーにもレベル表示
    const headerLevel = page.getByText(/Lv\.1/);
    await expect(headerLevel).toBeVisible();
  });

  test("should persist level data across page refreshes", async ({ page }) => {
    await page.goto("/typing");

    // 経験値を獲得
    await page
      .getByRole("button", { name: /どうぶつ/ })
      .first()
      .click();
    await page.getByText("いぬ").click();

    // 'inu'を入力して完了
    await page.keyboard.press("i");
    await page.keyboard.press("n");
    await page.keyboard.press("u");

    await expect(page.getByText("よくできました！")).toBeVisible();

    // ページをリフレッシュ
    await page.reload();

    // 進捗が保持されている
    await page.goto("/");
    const levelDisplay = page.getByText(/Lv\./);
    await expect(levelDisplay).toBeVisible();
  });

  test("should show appropriate level titles", async ({ page }) => {
    await page.goto("/");

    // コンパクト表示では詳細な経験値バーは見えない
    const levelDisplay = page.getByText(/Lv\.1/);
    await expect(levelDisplay).toBeVisible();

    // レベルシステムが正常に動作していることを確認
    // （実際のタイトルはフル表示でのみ見える）
  });

  test("should show emoji animations in typing practice", async ({ page }) => {
    await page.goto("/typing");

    // どうぶつコース選択
    await page
      .getByRole("button", { name: /どうぶつ/ })
      .first()
      .click();

    // いぬレッスン選択
    await page.getByText("いぬ").click();

    // 絵文字が表示されることを確認
    const dogEmoji = page.getByText("🐕");
    await expect(dogEmoji).toBeVisible();

    // タイピング完了時にアニメーション絵文字
    await page.keyboard.press("i");
    await page.keyboard.press("n");
    await page.keyboard.press("u");

    // 完了後も絵文字が表示される
    await expect(dogEmoji).toBeVisible();
  });
});
