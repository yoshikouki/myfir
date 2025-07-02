import { expect, test } from "@playwright/test";

test.describe("タイピング機能の入力バグテスト", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/typing");
  });

  test("レッスン選択から入力テストまでの流れ", async ({ page }) => {
    // レッスン一覧が表示されることを確認
    await expect(page.locator("h1")).toContainText("もじを うとう");

    // 最初のレッスン（どうぶつ）を選択（2タップフロー）
    const firstLesson = page
      .locator("button")
      .filter({ hasText: "どうぶつ (かんたん)" })
      .first();
    await expect(firstLesson).toBeVisible();
    await firstLesson.click();

    // ゲーム画面に遷移したことを確認
    await expect(page.locator("text=つぎの もじを うとう：")).toBeVisible();

    // キーボード表示が出ていることを確認
    await expect(page.locator("[data-testid='keyboard-visualizer']")).toBeVisible();

    // 現在の文字が表示されていることを確認
    const targetText = await page.locator(".font-mono .text-blue-600").textContent();
    expect(targetText).toBeTruthy();
    console.log("ターゲット文字:", targetText);

    // 統計の初期値を確認
    const initialKeystrokes = await page
      .locator("text=うった もじ")
      .locator("..")
      .locator(".text-2xl")
      .textContent();
    expect(initialKeystrokes).toBe("0");

    // フォーカス可能な要素があるかチェック
    const focusableElements = page.locator("input, textarea, [tabindex], [contenteditable]");
    const focusableCount = await focusableElements.count();
    console.log("フォーカス可能な要素数:", focusableCount);

    // 入力テスト: 正しい文字を入力
    if (targetText) {
      console.log(`文字 "${targetText}" を入力テスト中...`);

      // ページにフォーカス
      await page.focus("body");

      // キー入力を実行
      await page.keyboard.press(targetText);

      // 短時間待機して状態変更を確認
      await page.waitForTimeout(100);

      // 統計が更新されたかチェック
      const updatedKeystrokes = await page
        .locator("text=うった もじ")
        .locator("..")
        .locator(".text-2xl")
        .textContent();
      console.log("更新後のキーストローク数:", updatedKeystrokes);

      // 入力が反映されているかチェック
      const typedText = await page.locator(".font-mono .text-green-600").textContent();
      console.log("入力された文字:", typedText);

      // 期待される動作: キーストローク数が1に、入力文字が表示される
      if (updatedKeystrokes === "0") {
        console.log("❌ バグ確認: キー入力が反応していない");

        // デバッグ情報収集
        const keydownListeners = await page.evaluate(() => {
          return "イベントリスナー情報は省略";
        });
        console.log("イベントリスナー:", keydownListeners);

        // 別の入力方法を試す
        await page.keyboard.type(targetText);
        await page.waitForTimeout(100);

        const retryKeystrokes = await page
          .locator("text=うった もじ")
          .locator("..")
          .locator(".text-2xl")
          .textContent();
        console.log("type()での試行結果:", retryKeystrokes);
      } else {
        console.log("✅ 入力が正常に動作している");
      }
    }
  });

  test("キーボードイベントリスナーの確認", async ({ page }) => {
    // レッスンを選択してゲーム画面へ
    await page.click("button:has-text('きほんの ひらがな')");
    await expect(page.locator("text=つぎの もじを うとう：")).toBeVisible();

    // イベントリスナーの状態を確認
    const listenerInfo = await page.evaluate(() => {
      const events = ["keydown", "keyup", "keypress"];
      const info: Record<string, number> = {};

      events.forEach((eventType) => {
        // document上のリスナー数を概算（完全ではないが目安）
        const originalAdd = EventTarget.prototype.addEventListener;
        let count = 0;
        EventTarget.prototype.addEventListener = function (...args) {
          if (args[0] === eventType) count++;
          return originalAdd.apply(this, args);
        };
        info[eventType] = count;
      });

      return info;
    });

    console.log("イベントリスナー情報:", listenerInfo);

    // コンソールエラーがないかチェック
    const logs: string[] = [];
    page.on("console", (msg) => logs.push(msg.text()));
    page.on("pageerror", (err) => logs.push(`Error: ${err.message}`));

    await page.keyboard.press("a");
    await page.waitForTimeout(100);

    console.log("コンソールログ:", logs);
  });

  test("手動フォーカス設定での入力テスト", async ({ page }) => {
    // レッスンを選択
    await page.click("button:has-text('きほんの ひらがな')");
    await expect(page.locator("text=つぎの もじを うとう：")).toBeVisible();

    // 強制的にbodyにフォーカス
    await page.focus("body");
    await page.evaluate(() => document.body.focus());

    // 現在の文字を取得
    const targetText = await page.locator(".font-mono .text-blue-600").textContent();

    if (targetText) {
      console.log(`強制フォーカス後の入力テスト: "${targetText}"`);

      // dispatchEventを使った入力テスト
      await page.evaluate((char) => {
        const event = new KeyboardEvent("keypress", {
          key: char,
          code: `Key${char.toUpperCase()}`,
          charCode: char.charCodeAt(0),
          keyCode: char.charCodeAt(0),
          bubbles: true,
        });
        document.dispatchEvent(event);
      }, targetText);

      await page.waitForTimeout(100);

      const keystrokesAfterDispatch = await page
        .locator("text=うった もじ")
        .locator("..")
        .locator(".text-2xl")
        .textContent();
      console.log("dispatchEvent後のキーストローク:", keystrokesAfterDispatch);
    }
  });
});
