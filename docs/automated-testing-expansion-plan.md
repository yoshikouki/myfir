# 自動テスト拡張計画・実装ガイド

## 🎯 テスト拡張戦略概要

MyFirの子ども向け学習プラットフォームに特化した包括的自動テストスイートを構築し、安全性・教育効果・アクセシビリティを継続的に保証します。

## 📋 テスト拡張計画

### Phase 1: 基盤テスト強化（Week 1-2）

#### 1.1 子ども向けUI要件テスト
```typescript
// e2e/child-friendly-ui.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Child-Friendly UI Requirements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pc');
  });

  test('All interactive elements meet minimum touch target size', async ({ page }) => {
    // 全ての操作可能要素を取得
    const interactiveElements = await page.locator(
      'button, [role="button"], input, [role="tab"], [role="menuitem"]'
    ).all();

    for (const element of interactiveElements) {
      const boundingBox = await element.boundingBox();
      
      // 最小44pxサイズを確認
      expect(boundingBox.width).toBeGreaterThanOrEqual(44);
      expect(boundingBox.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('Font sizes meet minimum requirements', async ({ page }) => {
    // 全てのテキスト要素のフォントサイズをチェック
    const textElements = await page.locator('p, span, div, h1, h2, h3, h4, h5, h6').all();
    
    for (const element of textElements) {
      const fontSize = await element.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      
      const fontSizeNum = parseFloat(fontSize);
      expect(fontSizeNum).toBeGreaterThanOrEqual(16);
    }
  });

  test('Color contrast meets WCAG AA standards', async ({ page }) => {
    // axe-coreライブラリを使用した自動アクセシビリティテスト
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    )).toHaveLength(0);
  });

  test('Touch targets have adequate spacing', async ({ page }) => {
    const buttons = await page.locator('button').all();
    
    for (let i = 0; i < buttons.length - 1; i++) {
      const currentBox = await buttons[i].boundingBox();
      const nextBox = await buttons[i + 1].boundingBox();
      
      // 8px以上の間隔を確認
      const spacing = Math.min(
        Math.abs(nextBox.x - (currentBox.x + currentBox.width)),
        Math.abs(nextBox.y - (currentBox.y + currentBox.height))
      );
      
      expect(spacing).toBeGreaterThanOrEqual(8);
    }
  });
});
```

#### 1.2 コンテンツ安全性テスト
```typescript
// e2e/content-safety.spec.ts
import { test, expect } from '@playwright/test';

const PROHIBITED_WORDS = [
  'エラー', '失敗', '間違い', '問題', 'ダメ',
  '怖い', '暗い', '悲しい', '痛い'
];

const ENCOURAGING_WORDS = [
  'すごい', 'がんばって', 'やったね', 'たのしい',
  'いっしょに', 'がんばろう'
];

test.describe('Content Safety Verification', () => {
  test('No prohibited negative words in content', async ({ page }) => {
    await page.goto('/pc');
    
    const pageText = await page.textContent('main');
    
    for (const word of PROHIBITED_WORDS) {
      expect(pageText).not.toContain(word);
    }
  });

  test('Contains encouraging positive expressions', async ({ page }) => {
    await page.goto('/pc');
    
    const pageText = await page.textContent('main');
    
    // 少なくとも1つの励ましの言葉が含まれていることを確認
    const hasEncouragingWord = ENCOURAGING_WORDS.some(word => 
      pageText.includes(word)
    );
    
    expect(hasEncouragingWord).toBeTruthy();
  });

  test('All images have appropriate alt text', async ({ page }) => {
    await page.goto('/pc');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const altText = await img.getAttribute('alt');
      expect(altText).toBeTruthy();
      expect(altText.length).toBeGreaterThan(0);
    }
  });

  test('No flashy or potentially seizure-inducing animations', async ({ page }) => {
    await page.goto('/pc');
    
    // CSSアニメーションの検査
    const animatedElements = await page.locator('[style*="animation"]').all();
    
    for (const element of animatedElements) {
      const animationDuration = await element.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.animationDuration;
      });
      
      // アニメーション速度が適切であることを確認（最低0.3秒）
      const durationMs = parseFloat(animationDuration) * 1000;
      expect(durationMs).toBeGreaterThanOrEqual(300);
    }
  });
});
```

### Phase 2: 学習機能テスト（Week 3-4）

#### 2.1 マウス学習ゲームテスト
```typescript
// e2e/mouse-friend-game.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Mouse Friend Game Learning Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pc');
    
    // マウス学習ゲームまでナビゲート
    while (await page.locator('text=マウスと仲良くなろう').isVisible() === false) {
      await page.click('text=つぎへ');
      await page.waitForTimeout(500);
    }
  });

  test('Complete all mouse friend game stages', async ({ page }) => {
    const stages = [
      'greeting',
      'star-collecting', 
      'treasure-hunt',
      'mouse-walk',
      'photo-time'
    ];

    for (const stage of stages) {
      // ゲーム開始
      await page.click('text=はじめよう');
      
      switch (stage) {
        case 'greeting':
          // マウス移動でグリーティング完了
          await page.mouse.move(200, 200);
          await page.waitForTimeout(3000);
          break;
          
        case 'star-collecting':
          // 5つの星をクリック
          const stars = await page.locator('button:has-text("⭐")').all();
          for (const star of stars) {
            await star.click();
            await page.waitForTimeout(200);
          }
          break;
          
        case 'treasure-hunt':
          // 3つの宝箱をクリック
          const treasures = await page.locator('button:has-text("📦")').all();
          for (const treasure of treasures) {
            await treasure.click();
            await page.waitForTimeout(200);
          }
          break;
          
        case 'mouse-walk':
          // 円を描くようにマウス移動
          for (let angle = 0; angle < 360; angle += 30) {
            const x = 200 + 50 * Math.cos(angle * Math.PI / 180);
            const y = 150 + 50 * Math.sin(angle * Math.PI / 180);
            await page.mouse.move(x, y);
            await page.waitForTimeout(100);
          }
          break;
          
        case 'photo-time':
          // 写真フレームをクリック
          await page.click('[role="application"]');
          break;
      }
      
      // 成功メッセージを確認
      await expect(page.locator('text=すごい！やったね！')).toBeVisible();
      await page.waitForTimeout(3000);
    }
    
    // 全ステージ完了確認
    await expect(page.locator('text=マウくんとなかよくなれたね！')).toBeVisible();
  });

  test('Game provides immediate visual feedback', async ({ page }) => {
    await page.click('text=はじめよう');
    
    // マウス移動でキャラクターが追従することを確認
    await page.mouse.move(100, 100);
    await page.waitForTimeout(100);
    
    const mouseCharacter = page.locator('text=🐭');
    const characterPosition = await mouseCharacter.boundingBox();
    
    expect(characterPosition.x).toBeCloseTo(75, 25); // 100 - 25 (half width)
    expect(characterPosition.y).toBeCloseTo(75, 25); // 100 - 25 (half height)
  });

  test('Game never shows failure or error states', async ({ page }) => {
    await page.click('text=はじめよう');
    
    // 時間切れまで待機
    await page.waitForTimeout(35000); // 30秒 + マージン
    
    // 失敗メッセージが表示されないことを確認
    await expect(page.locator('text=失敗')).not.toBeVisible();
    await expect(page.locator('text=エラー')).not.toBeVisible();
    await expect(page.locator('text=だめ')).not.toBeVisible();
    
    // 代わりに励ましメッセージが表示されることを確認
    await expect(page.locator('text=すごい！やったね！')).toBeVisible();
  });
});
```

#### 2.2 学習進捗テスト
```typescript
// e2e/learning-progress.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Learning Progress Tracking', () => {
  test('Progress indicators update correctly', async ({ page }) => {
    await page.goto('/pc');
    
    // 初期状態の確認
    const initialProgress = await page.locator('.h-4.w-4.rounded-full.bg-blue-500').count();
    expect(initialProgress).toBe(1); // 最初のステップが active
    
    // 次のステップに進む
    await page.click('text=つぎへ');
    await page.waitForTimeout(500);
    
    // 進捗インジケーターの更新確認
    const updatedActiveStep = await page.locator('.h-4.w-4.rounded-full.bg-blue-500').count();
    const completedSteps = await page.locator('.h-4.w-4.rounded-full.bg-green-500').count();
    
    expect(updatedActiveStep).toBe(1);
    expect(completedSteps).toBeGreaterThanOrEqual(0);
  });

  test('Navigation maintains progress state', async ({ page }) => {
    await page.goto('/pc');
    
    // いくつかのステップを完了
    for (let i = 0; i < 3; i++) {
      await page.click('text=つぎへ');
      await page.waitForTimeout(500);
    }
    
    // 前に戻って再び進む
    await page.click('text=← まえへ');
    await page.waitForTimeout(500);
    await page.click('text=つぎへ');
    await page.waitForTimeout(500);
    
    // ページ状態の確認
    const stepNumber = await page.locator('text*="/ "').textContent();
    expect(stepNumber).toContain('4 /'); // 4番目のステップに戻ったことを確認
  });

  test('Completion celebration displays correctly', async ({ page }) => {
    await page.goto('/pc');
    
    // 全ステップを完了（実際にはテスト用に短縮）
    const totalSteps = await page.locator('.h-4.w-4.rounded-full').count();
    
    for (let i = 0; i < totalSteps - 1; i++) {
      await page.click('text=つぎへ');
      await page.waitForTimeout(500);
    }
    
    // 最終完了メッセージの確認
    await expect(page.locator('text=🎉 おめでとう！ 🎉')).toBeVisible();
    await expect(page.locator('text=ぜんぶのがくしゅうがおわったよ！')).toBeVisible();
  });
});
```

### Phase 3: パフォーマンス・アクセシビリティテスト（Week 5-6）

#### 3.1 Core Web Vitalsテスト
```typescript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Requirements', () => {
  test('Core Web Vitals meet child-friendly thresholds', async ({ page }) => {
    // パフォーマンス指標の測定
    await page.goto('/pc');
    
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              metrics.fcp = entry.loadEventEnd - entry.fetchStart;
            }
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.lcp = entry.startTime;
            }
          });
          
          resolve(metrics);
        }).observe({ entryTypes: ['navigation', 'largest-contentful-paint'] });
        
        // タイムアウト設定
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    // 子ども向け要件: より厳しい性能基準
    if (performanceMetrics.fcp) {
      expect(performanceMetrics.fcp).toBeLessThan(1500); // 1.5秒以内
    }
    if (performanceMetrics.lcp) {
      expect(performanceMetrics.lcp).toBeLessThan(2500); // 2.5秒以内
    }
  });

  test('Animations maintain 60fps performance', async ({ page }) => {
    await page.goto('/pc');
    
    // マウスゲームの開始
    await page.click('text=つぎへ');
    await page.waitForSelector('text=マウスと仲良くなろう');
    await page.click('text=はじめよう');
    
    // アニメーション中のフレームレート測定
    const frameRate = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frames = 0;
        let startTime = performance.now();
        
        function countFrames() {
          frames++;
          const currentTime = performance.now();
          
          if (currentTime - startTime >= 1000) {
            resolve(frames);
          } else {
            requestAnimationFrame(countFrames);
          }
        }
        
        requestAnimationFrame(countFrames);
      });
    });
    
    expect(frameRate).toBeGreaterThan(50); // 最低50fps
  });

  test('Page responds to input within 100ms', async ({ page }) => {
    await page.goto('/pc');
    
    const button = page.locator('text=つぎへ');
    
    const startTime = Date.now();
    await button.click();
    
    // 視覚的な変化が発生するまでの時間を測定
    await page.waitForFunction(() => {
      // ページの変化を検出する簡単な方法
      return document.readyState === 'complete';
    });
    
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(100);
  });
});
```

#### 3.2 包括的アクセシビリティテスト
```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Comprehensive Accessibility', () => {
  test('Full WCAG AA compliance', async ({ page }) => {
    await page.goto('/pc');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Keyboard navigation works for all interactive elements', async ({ page }) => {
    await page.goto('/pc');
    
    // Tabキーでの移動テスト
    let focusedElements = [];
    
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      
      const focusedElement = await page.evaluate(() => {
        const focused = document.activeElement;
        return {
          tagName: focused.tagName,
          role: focused.getAttribute('role'),
          text: focused.textContent?.trim().substring(0, 20)
        };
      });
      
      focusedElements.push(focusedElement);
    }
    
    // フォーカス可能な要素が適切に見つかることを確認
    const interactiveElements = focusedElements.filter(el => 
      el.tagName === 'BUTTON' || el.role === 'button' || el.tagName === 'A'
    );
    
    expect(interactiveElements.length).toBeGreaterThan(0);
  });

  test('Screen reader announcements are appropriate', async ({ page }) => {
    await page.goto('/pc');
    
    // ARIA labelとdescriptionの確認
    const ariaElements = await page.locator('[aria-label], [aria-describedby]').all();
    
    for (const element of ariaElements) {
      const ariaLabel = await element.getAttribute('aria-label');
      const ariaDescribedby = await element.getAttribute('aria-describedby');
      
      if (ariaLabel) {
        expect(ariaLabel.length).toBeGreaterThan(0);
        expect(ariaLabel).not.toContain('エラー');
        expect(ariaLabel).not.toContain('失敗');
      }
      
      if (ariaDescribedby) {
        const description = await page.locator(`#${ariaDescribedby}`).textContent();
        expect(description).toBeTruthy();
      }
    }
  });

  test('Color is not the only means of conveying information', async ({ page }) => {
    await page.goto('/pc');
    
    // 進捗インジケーターなどで色以外の情報も提供されているかチェック
    const progressDots = await page.locator('.h-4.w-4.rounded-full').all();
    
    for (const dot of progressDots) {
      const classes = await dot.getAttribute('class');
      const hasAriaLabel = await dot.getAttribute('aria-label');
      const hasTitle = await dot.getAttribute('title');
      
      // 色以外の識別手段があることを確認
      expect(hasAriaLabel || hasTitle || classes.includes('border')).toBeTruthy();
    }
  });
});
```

### Phase 4: 統合・回帰テスト（Week 7-8）

#### 4.1 ユーザージャーニー統合テスト
```typescript
// e2e/user-journey.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Complete Learning Journey', () => {
  test('3-year-old typical usage pattern', async ({ page }) => {
    await page.goto('/pc');
    
    // ゆっくりとした操作をシミュレート
    const slowClick = async (selector: string) => {
      await page.locator(selector).hover();
      await page.waitForTimeout(1000); // 1秒ホバー
      await page.locator(selector).click();
      await page.waitForTimeout(2000); // 2秒待機
    };
    
    // PC部品を1つずつゆっくり学習
    await slowClick('text=ぶひんをみる');
    
    const pcParts = await page.locator('[data-testid="pc-part-card"]').all();
    for (const part of pcParts.slice(0, 2)) { // 最初の2つだけ
      await part.click();
      await page.waitForTimeout(3000); // 成功メッセージを見る時間
    }
    
    // 次のステップへゆっくり進む
    await slowClick('text=つぎへ');
    
    // マウスゲームで遊ぶ
    await page.waitForSelector('text=マウスと仲良くなろう');
    await slowClick('text=はじめよう');
    
    // ゆっくりマウス移動
    for (let i = 0; i < 5; i++) {
      await page.mouse.move(100 + i * 50, 100 + i * 30);
      await page.waitForTimeout(500);
    }
    
    // 成功体験の確認
    await expect(page.locator('text=すごい！やったね！')).toBeVisible();
  });

  test('6-year-old advanced usage pattern', async ({ page }) => {
    await page.goto('/pc');
    
    // より高速な操作パターン
    const quickInteraction = async () => {
      // 全PC部品を素早く学習
      await page.click('text=ぶひんをみる');
      
      const pcParts = await page.locator('[data-testid="pc-part-card"]').all();
      for (const part of pcParts) {
        await part.click();
        await page.waitForTimeout(500);
      }
      
      // 全学習ステップを完了
      const totalSteps = await page.locator('.h-4.w-4.rounded-full').count();
      
      for (let i = 0; i < totalSteps - 1; i++) {
        await page.click('text=つぎへ');
        await page.waitForTimeout(300);
      }
    };
    
    await quickInteraction();
    
    // 高度な学習完了の確認
    await expect(page.locator('text=🎉 おめでとう！ 🎉')).toBeVisible();
  });

  test('Parent supervision scenario', async ({ page }) => {
    await page.goto('/pc');
    
    // 保護者が一緒に学習するシナリオ
    // 説明を読む時間
    await page.waitForTimeout(3000);
    
    // 保護者による説明後、子どもの操作
    await page.click('text=ぶひんをみる');
    
    // 保護者が読み上げる間の待機
    const descriptions = await page.locator('[data-testid="pc-part-description"]').all();
    for (const desc of descriptions) {
      await desc.click();
      await page.waitForTimeout(5000); // 読み上げ時間
    }
    
    // 学習効果の確認
    await expect(page.locator('text=すごい！')).toBeVisible();
  });
});
```

## 🔧 テスト実装設定

### 必要な依存関係追加
```json
{
  "devDependencies": {
    "@axe-core/playwright": "^4.8.2",
    "lighthouse": "^11.4.0",
    "playwright-lighthouse": "^4.0.0",
    "@testing-library/jest-dom": "^6.1.5",
    "jest-axe": "^8.0.0"
  }
}
```

### Playwrightカスタム設定
```typescript
// playwright.config.ts (拡張版)
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // 子ども向け特化設定
    actionTimeout: 10000, // より長いタイムアウト
    navigationTimeout: 15000,
  },
  projects: [
    {
      name: 'child-friendly-tests',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/child-friendly-*.spec.ts'
    },
    {
      name: 'learning-features',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/learning-*.spec.ts'
    },
    {
      name: 'accessibility',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/accessibility.spec.ts'
    },
    {
      name: 'mobile-child-experience',
      use: { ...devices['iPad'] },
      testMatch: '**/mobile-*.spec.ts'
    }
  ],
  webServer: {
    command: process.env.CI ? 'bun run start' : 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## 📊 テスト指標・レポート

### 品質ダッシュボード用メトリクス
```typescript
// scripts/generate-quality-report.ts
interface QualityMetrics {
  accessibility: {
    wcagViolations: number;
    contrastIssues: number;
    keyboardNavigationScore: number;
  };
  childFriendliness: {
    touchTargetCompliance: number;
    fontSizeCompliance: number;
    contentSafetyScore: number;
  };
  learningEffectiveness: {
    gameCompletionRate: number;
    averageEngagementTime: number;
    errorRecoverySuccess: number;
  };
  performance: {
    coreWebVitals: {
      fcp: number;
      lcp: number;
      fid: number;
      cls: number;
    };
    animationPerformance: number;
  };
}
```

## 🚀 実装ロードマップ

### Week 1-2: 基盤構築
- [ ] 子ども向けUI要件テスト実装
- [ ] コンテンツ安全性テスト実装
- [ ] 基本アクセシビリティテスト追加

### Week 3-4: 学習機能テスト
- [ ] マウスゲーム完全テスト実装
- [ ] 学習進捗テスト実装
- [ ] インタラクション品質テスト

### Week 5-6: パフォーマンス・詳細
- [ ] Core Web Vitalsテスト
- [ ] 包括的アクセシビリティテスト
- [ ] モバイル体験テスト

### Week 7-8: 統合・最適化
- [ ] ユーザージャーニーテスト
- [ ] 回帰テストスイート
- [ ] CI/CD最適化

この計画により、MyFirが真に子どもたちにとって安全で楽しい学習体験を提供できることを継続的に保証できます。