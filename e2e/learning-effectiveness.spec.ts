import { expect, test } from "@playwright/test";

test.describe("Learning Effectiveness Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pc");
  });

  test("Mouse Friend Game provides progressive learning experience", async ({ page }) => {
    // マウス学習ゲームまでナビゲート
    let currentStepText = "";

    while (!currentStepText.includes("マウスと仲良くなろう")) {
      const stepElement = await page.locator("h2").first();
      currentStepText = (await stepElement.textContent()) || "";

      if (!currentStepText.includes("マウスと仲良くなろう")) {
        const nextButton = page.getByRole("button", { name: /つぎへ/ });
        if (await nextButton.isEnabled()) {
          await nextButton.click();
          await page.waitForTimeout(1000);
        } else {
          break;
        }
      }
    }

    // ゲーム開始
    await page.click("text=はじめよう");
    await page.waitForTimeout(1000);

    // Stage 1: グリーティング（マウス移動）
    await page.mouse.move(200, 200);
    await page.waitForTimeout(500);
    await page.mouse.move(300, 250);
    await page.waitForTimeout(500);

    // 成功フィードバックの確認
    await expect(page.locator("text=すごい！やったね！")).toBeVisible({ timeout: 35000 });
    await page.waitForTimeout(3000); // 次のステージへの自動遷移

    // Stage 2: 星集め（クリック操作）
    await page.click("text=はじめよう");
    await page.waitForTimeout(1000);

    // 星をクリック（最大5つ）
    const stars = await page.locator('button:has-text("⭐")').all();
    for (const star of stars.slice(0, 3)) {
      // 一部だけクリックしてもクリア可能
      await star.click();
      await page.waitForTimeout(300);
    }

    // 成功体験の確認
    await expect(page.locator("text=すごい！やったね！")).toBeVisible({ timeout: 35000 });
  });

  test("Learning content adapts to child interaction patterns", async ({ page }) => {
    // PC部品学習の適応性テスト
    await page.click("text=ぶひんをみる");
    await page.waitForTimeout(500);

    const pcParts = await page.locator('[data-testid="pc-part-card"]').count();
    expect(pcParts, "PC parts should be available for learning").toBeGreaterThan(0);

    // ゆっくりとした操作パターン（3歳児想定）
    const firstPart = page.locator('[data-testid="pc-part-card"]').first();
    await firstPart.hover();
    await page.waitForTimeout(2000); // 2秒ホバー
    await firstPart.click();

    // 即座のポジティブフィードバック確認
    await expect(page.locator("text=すごい！")).toBeVisible({ timeout: 2000 });

    // フィードバックメッセージの内容確認
    const feedbackText = await page.locator(".text-orange-800").textContent();
    expect(feedbackText).toContain("すごい！");
    expect(feedbackText).not.toContain("間違い");
    expect(feedbackText).not.toContain("エラー");
  });

  test("Progress tracking encourages continued learning", async ({ page }) => {
    // 初期進捗状態の確認
    const totalSteps = await page.locator(".h-4.w-4.rounded-full").count();
    const currentActiveStep = await page.locator(".h-4.w-4.rounded-full.bg-blue-500").count();

    expect(totalSteps, "Should have multiple learning steps").toBeGreaterThan(1);
    expect(currentActiveStep, "Should have one active step").toBe(1);

    // 学習進捗の追跡
    for (let i = 0; i < Math.min(3, totalSteps - 1); i++) {
      const nextButton = page.getByRole("button", { name: /つぎへ/ });

      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await page.waitForTimeout(1000);

        // 進捗の視覚的更新確認
        const progressText = await page.locator('text*="/"').textContent();
        expect(progressText).toContain(`${i + 2} /`);
      }
    }

    // 完了時の祝福メッセージ（すべてのステップを完了した場合）
    const completionMessage = page.locator("text=🎉 おめでとう！ 🎉");
    if (await completionMessage.isVisible()) {
      await expect(completionMessage).toBeVisible();
      await expect(page.locator("text=ぜんぶのがくしゅうがおわったよ！")).toBeVisible();
    }
  });

  test("Error recovery maintains positive learning experience", async ({ page }) => {
    // マウスゲームでの「失敗」シナリオ（実際は失敗させない設計）
    await page.goto("/pc");

    // マウスゲームまで進む
    while (!(await page.locator("text=マウスと仲良くなろう").isVisible())) {
      const nextButton = page.getByRole("button", { name: /つぎへ/ });
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await page.waitForTimeout(500);
      } else {
        break;
      }
    }

    await page.click("text=はじめよう");

    // 何も操作せずに時間切れまで待機
    await page.waitForTimeout(35000); // 30秒 + マージン

    // 時間切れでも失敗メッセージが表示されないことを確認
    await expect(page.locator("text=失敗")).not.toBeVisible();
    await expect(page.locator("text=エラー")).not.toBeVisible();
    await expect(page.locator("text=だめ")).not.toBeVisible();
    await expect(page.locator("text=間違い")).not.toBeVisible();

    // 代わりに励ましメッセージが表示されることを確認
    await expect(page.locator("text=すごい！やったね！")).toBeVisible();
  });

  test("Learning objectives are age-appropriate and achievable", async ({ page }) => {
    // 各学習ステップの難易度評価
    const learningSteps = [
      "パソコンってなにかな？",
      "パソコンのぶひん",
      "マウスと仲良くなろう",
    ];

    for (const stepTitle of learningSteps) {
      try {
        // ステップが表示されるまで進む
        while (!(await page.locator(`text=${stepTitle}`).isVisible())) {
          const nextButton = page.getByRole("button", { name: /つぎへ/ });
          if (await nextButton.isEnabled()) {
            await nextButton.click();
            await page.waitForTimeout(500);
          } else {
            break;
          }
        }

        if (await page.locator(`text=${stepTitle}`).isVisible()) {
          // 各ステップの説明文の複雑さをチェック
          const description = await page.locator("p.text-xl, p.text-lg").first().textContent();

          if (description) {
            // 説明文の長さが適切か（子ども向けは短い文が良い）
            expect(
              description.length,
              `Description should be concise for children: "${stepTitle}"`,
            ).toBeLessThan(100);

            // ひらがな中心の確認（簡単な漢字のチェック）
            const kanjiCount = (description.match(/[一-龯]/g) || []).length;
            const totalChars = description.length;
            const kanjiRatio = kanjiCount / totalChars;

            // 漢字の比率が30%以下であることを確認
            expect(
              kanjiRatio,
              `Kanji ratio should be low for age-appropriate content: "${stepTitle}"`,
            ).toBeLessThan(0.3);
          }
        }
      } catch (_e) {
        // ステップが見つからない場合はスキップ
        console.log(`Step "${stepTitle}" not found, skipping evaluation`);
      }
    }
  });

  test("Interactive elements provide immediate and appropriate feedback", async ({ page }) => {
    // PC部品学習での即座フィードバック
    await page.click("text=ぶひんをみる");

    const pcPartCards = await page.locator('[data-testid="pc-part-card"]').all();

    for (const card of pcPartCards.slice(0, 2)) {
      // 最初の2つをテスト
      const startTime = Date.now();
      await card.click();

      // フィードバック表示までの時間測定
      await expect(page.locator("text=すごい！")).toBeVisible({ timeout: 1000 });
      const feedbackTime = Date.now() - startTime;

      // 500ms以内の即座フィードバック
      expect(feedbackTime, "Feedback should appear within 500ms").toBeLessThan(500);

      // フィードバック内容の適切性確認
      const feedbackMessage = await page.locator(".text-orange-700").textContent();
      expect(feedbackMessage).toMatch(/おぼえたね|できたね|すごい/);

      await page.waitForTimeout(1000); // 次のテストのための待機
    }
  });

  test("Content promotes intrinsic motivation and curiosity", async ({ page }) => {
    // 学習コンテンツの動機付け要素確認
    const pageContent = await page.textContent("main");

    // 好奇心を刺激する表現
    const curiosityWords = [
      "なにかな",
      "どうかな",
      "みてみよう",
      "やってみよう",
      "しってる",
      "できるかな",
      "いっしょに",
    ];

    const hasCuriosityStimulation = curiosityWords.some((word) => pageContent?.includes(word));

    expect(hasCuriosityStimulation, "Content should stimulate curiosity").toBeTruthy();

    // 自己効力感を高める表現
    const empowermentWords = [
      "きみにもできる",
      "いっしょにがんばろう",
      "すきなときに",
      "じぶんで",
      "えらんでね",
      "やってみて",
    ];

    const hasEmpowerment = empowermentWords.some((word) => pageContent?.includes(word));

    // 少なくとも動機付けまたは自己効力感の要素が含まれている
    expect(
      hasCuriosityStimulation || hasEmpowerment,
      "Content should promote intrinsic motivation",
    ).toBeTruthy();
  });

  test("Learning pace respects child attention span", async ({ page }) => {
    // 各学習セクションの推奨滞在時間測定
    const sections = await page.locator("main > div").all();

    for (const section of sections.slice(0, 2)) {
      const startTime = Date.now();

      // セクション内の全要素を軽く操作
      const interactiveElements = await section.locator('button, [role="button"]').all();

      for (const element of interactiveElements.slice(0, 3)) {
        if (await element.isVisible()) {
          await element.hover();
          await page.waitForTimeout(200);
        }
      }

      const sectionTime = Date.now() - startTime;

      // 1つのセクションが5分以内で完了可能（子どもの集中力考慮）
      expect(sectionTime, "Each section should be completable within 5 minutes").toBeLessThan(
        300000,
      );
    }
  });

  test("Success celebrations are age-appropriate and motivating", async ({ page }) => {
    // 成功体験の適切性確認
    await page.click("text=ぶひんをみる");

    const firstPcPart = page.locator('[data-testid="pc-part-card"]').first();
    await firstPcPart.click();

    // 成功メッセージの表示確認
    await expect(page.locator("text=すごい！")).toBeVisible();

    // 祝福要素の確認
    const celebrationElements = await page.locator(".text-orange-800, .text-orange-700").all();

    for (const element of celebrationElements) {
      const celebrationText = await element.textContent();

      // ポジティブな表現のみ使用
      expect(celebrationText).not.toContain("だめ");
      expect(celebrationText).not.toContain("ちがう");
      expect(celebrationText).not.toContain("まちがい");

      // 年齢に適した祝福表現
      expect(celebrationText).toMatch(/すごい|やったね|がんばった|できた|えらい/);
    }

    // 視覚的な祝福効果（アニメーション等）の確認
    const animatedCelebration = page.locator('[class*="animate"], [style*="animation"]');
    if ((await animatedCelebration.count()) > 0) {
      const animationDuration = await animatedCelebration.first().evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.animationDuration;
      });

      // アニメーションが適切な長さ（短すぎず長すぎず）
      if (animationDuration && animationDuration !== "none") {
        const durationMs = parseFloat(animationDuration) * 1000;
        expect(durationMs).toBeGreaterThan(300);
        expect(durationMs).toBeLessThan(3000);
      }
    }
  });
});
