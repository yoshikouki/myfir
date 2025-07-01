import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Child-Friendly UI Requirements Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pc");
  });

  test("All interactive elements meet minimum 44px touch target size", async ({ page }) => {
    // 全ての操作可能要素を取得
    const interactiveElements = await page
      .locator('button, [role="button"], input, [role="tab"], [role="menuitem"], a')
      .all();

    for (const element of interactiveElements) {
      const boundingBox = await element.boundingBox();

      if (boundingBox) {
        // 最小44pxサイズを確認（子ども向け要件）
        expect(
          boundingBox.width,
          `Element width should be >= 44px: ${await element.textContent()}`,
        ).toBeGreaterThanOrEqual(44);
        expect(
          boundingBox.height,
          `Element height should be >= 44px: ${await element.textContent()}`,
        ).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test("Font sizes meet minimum 16px requirement", async ({ page }) => {
    // 全てのテキスト要素のフォントサイズをチェック
    const textElements = await page
      .locator("p, span, div, h1, h2, h3, h4, h5, h6, button")
      .all();

    for (const element of textElements) {
      const fontSize = await element.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });

      const fontSizeNum = parseFloat(fontSize);
      const elementText = await element.textContent();

      // デバッグ用の詳細情報と共にアサーション
      expect(
        fontSizeNum,
        `Font size should be >= 16px for element: "${elementText?.substring(0, 30)}..."`,
      ).toBeGreaterThanOrEqual(16);
    }
  });

  test("Interactive elements have adequate spacing (8px minimum)", async ({ page }) => {
    const buttons = await page.locator("button").all();

    if (buttons.length > 1) {
      for (let i = 0; i < buttons.length - 1; i++) {
        const currentBox = await buttons[i].boundingBox();
        const nextBox = await buttons[i + 1].boundingBox();

        if (currentBox && nextBox) {
          // 水平・垂直方向の間隔を計算
          const horizontalSpacing = Math.abs(nextBox.x - (currentBox.x + currentBox.width));
          const verticalSpacing = Math.abs(nextBox.y - (currentBox.y + currentBox.height));
          const minSpacing = Math.min(horizontalSpacing, verticalSpacing);

          // 8px以上の間隔を確認（隣接要素のみ）
          if (minSpacing < 200) {
            // 隣接要素の判定（200px以内）
            expect(minSpacing, `Button spacing should be >= 8px`).toBeGreaterThanOrEqual(8);
          }
        }
      }
    }
  });

  test("Color contrast meets WCAG AA standards (4.5:1 ratio)", async ({ page }) => {
    // axe-coreライブラリを使用した自動アクセシビリティテスト
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .include("main")
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === "color-contrast",
    );

    expect(contrastViolations, "No color contrast violations should exist").toHaveLength(0);
  });

  test("Navigation buttons are appropriately sized and labeled", async ({ page }) => {
    // ナビゲーションボタンの確認
    const prevButton = page.getByRole("button", { name: /まえへ|前へ|戻る/ });
    const nextButton = page.getByRole("button", { name: /つぎへ|次へ|進む/ });

    // ボタンの存在確認
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();

    // ボタンサイズの確認
    const prevBox = await prevButton.boundingBox();
    const nextBox = await nextButton.boundingBox();

    if (prevBox) {
      expect(prevBox.width).toBeGreaterThanOrEqual(60); // ナビボタンは少し大きめ
      expect(prevBox.height).toBeGreaterThanOrEqual(44);
    }

    if (nextBox) {
      expect(nextBox.width).toBeGreaterThanOrEqual(60);
      expect(nextBox.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("Progress indicators are visually clear and accessible", async ({ page }) => {
    // 進捗インジケーターの確認
    const progressDots = await page.locator(".h-4.w-4.rounded-full").all();

    expect(progressDots.length, "Progress indicators should exist").toBeGreaterThan(0);

    for (const dot of progressDots) {
      const boundingBox = await dot.boundingBox();

      if (boundingBox) {
        // 16px以上のサイズ（視認性確保）
        expect(boundingBox.width).toBeGreaterThanOrEqual(16);
        expect(boundingBox.height).toBeGreaterThanOrEqual(16);
      }

      // アクセシビリティのためのラベルまたはaria属性確認
      const hasAriaLabel = await dot.getAttribute("aria-label");
      const hasTitle = await dot.getAttribute("title");
      const hasRole = await dot.getAttribute("role");

      expect(
        hasAriaLabel || hasTitle || hasRole,
        "Progress indicators should have accessibility labels",
      ).toBeTruthy();
    }
  });

  test("All clickable elements provide visual feedback on interaction", async ({ page }) => {
    const clickableElements = await page.locator('button, [role="button"], a').all();

    for (const element of clickableElements) {
      // ホバー時のスタイル変化を確認
      await element.hover();

      const hoverStyles = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          cursor: styles.cursor,
          transform: styles.transform,
          backgroundColor: styles.backgroundColor,
          borderColor: styles.borderColor,
        };
      });

      // カーソルがpointerに変わることを確認
      expect(hoverStyles.cursor).toBe("pointer");

      // 何らかの視覚的変化があることを確認（transform、色変化など）
      const hasVisualFeedback =
        hoverStyles.transform !== "none" ||
        hoverStyles.backgroundColor !== "rgba(0, 0, 0, 0)" ||
        hoverStyles.borderColor !== "rgba(0, 0, 0, 0)";

      expect(
        hasVisualFeedback,
        `Element should provide visual feedback: ${await element.textContent()}`,
      ).toBeTruthy();
    }
  });

  test("Text content uses child-appropriate expressions only", async ({ page }) => {
    const pageText = await page.textContent("main");

    // 禁止語句のチェック
    const prohibitedWords = [
      "エラー",
      "失敗",
      "間違い",
      "問題",
      "ダメ",
      "怖い",
      "暗い",
      "悲しい",
      "痛い",
      "困った",
    ];

    for (const word of prohibitedWords) {
      expect(pageText, `Prohibited word "${word}" should not appear in content`).not.toContain(
        word,
      );
    }

    // 推奨表現の存在確認
    const encouragingWords = [
      "すごい",
      "がんばって",
      "やったね",
      "たのしい",
      "いっしょに",
      "がんばろう",
      "できた",
      "よくできました",
    ];

    const hasEncouragingWord = encouragingWords.some((word) => pageText?.includes(word));
    expect(hasEncouragingWord, "Content should include encouraging expressions").toBeTruthy();
  });

  test("Loading states and transitions are smooth and non-jarring", async ({ page }) => {
    // ページ遷移のスムーズさをテスト
    const nextButton = page.getByRole("button", { name: /つぎへ/ });

    if (await nextButton.isEnabled()) {
      await nextButton.click();

      // 遷移中のローディング時間測定
      const startTime = Date.now();
      await page.waitForLoadState("networkidle");
      const loadTime = Date.now() - startTime;

      // 3秒以内の読み込み（子どもの注意持続時間考慮）
      expect(loadTime, "Page transitions should complete within 3 seconds").toBeLessThan(3000);
    }
  });

  test("No content triggers potential seizures (rapid flashing)", async ({ page }) => {
    // 高速点滅要素の検出
    const animatedElements = await page
      .locator('[style*="animation"], .animate-pulse, .animate-bounce')
      .all();

    for (const element of animatedElements) {
      const animationDuration = await element.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.animationDuration;
      });

      if (animationDuration && animationDuration !== "none") {
        const durationMs = parseFloat(animationDuration) * 1000;

        // アニメーション速度が適切であることを確認（最低0.3秒、推奨0.5秒以上）
        expect(
          durationMs,
          `Animation duration should be >= 300ms for safety: ${await element.textContent()}`,
        ).toBeGreaterThanOrEqual(300);
      }
    }
  });
});
