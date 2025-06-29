# 子供向けデザインガイドライン

## 概要

3-6歳の子供を対象としたMyFirプロジェクトのデザインガイドラインです。子供の認知発達、視覚的知覚、およびモータースキルの特性を考慮した、アクセシブルで楽しい学習体験を提供するための指針をまとめています。

## 対象ユーザーの特性

### 3-4歳（未就学児前期）
- **認知発達**: 具体的思考が中心、抽象的概念の理解が限定的
- **言語発達**: ひらがなの読みが主体、漢字は一部のみ
- **集中力**: 3-5分程度の短時間集中
- **モータースキル**: 大きな動きが中心、細かい操作は発達中

### 4-6歳（未就学児後期）
- **認知発達**: 因果関係の理解、簡単なルールの理解
- **言語発達**: ひらがなの習得、簡単な漢字の認識
- **集中力**: 5-10分程度の集中が可能
- **モータースキル**: マウスクリック、タッチ操作の習得

## 色彩設計

### メインカラーパレット

#### プライマリカラー（青系）
```css
/* Tailwind CSSクラス */
.primary-50  { color: #eff6ff; }   /* 深い背景 */
.primary-100 { color: #dbeafe; }   /* 淡い背景 */
.primary-500 { color: #3b82f6; }   /* メイン色 */
.primary-600 { color: #2563eb; }   /* ホバー色 */
.primary-800 { color: #1e40af; }   /* テキスト色 */
```

**使用理由**: 青色は子供にとって安心感と信頼感を与え、学習に集中しやすい環境を作ります。

#### アクセントカラー（オレンジ系）
```css
.accent-100 { color: #fed7aa; }    /* 成功背景 */
.accent-400 { color: #fb923c; }    /* アクセント */
.accent-600 { color: #ea580c; }    /* 強調色 */
.accent-800 { color: #9a3412; }    /* テキスト色 */
```

**使用理由**: オレンジ色はエネルギーと成功を表現し、子供の達成感を高めます。

#### サポートカラー（緑系）
```css
.support-500 { color: #10b981; }   /* 進捗インジケーター */
.support-600 { color: #059669; }   /* ホバー色 */
```

**使用理由**: 緑色は進捗と安心感を表現し、学習の進捗状況を明確に伝えます。

### 色彩アクセシビリティ

#### コントラスト比準拠
- **AAレベル**: 最低4.5:1（小さいテキスト）
- **AAAレベル**: 7:1以上（推奨レベル）

#### 実装例
```css
/* 高コントラストテキスト */
.text-high-contrast {
  color: #1f2937;        /* 灰色900 */
  background: #ffffff;   /* 白背景 */
  /* コントラスト比: 16.75:1 */
}

/* 中コントラストテキスト */
.text-medium-contrast {
  color: #4b5563;        /* 灰色600 */
  background: #ffffff;   /* 白背景 */
  /* コントラスト比: 7.4:1 */
}
```

#### 色覚異常対応
- **赤緑色覚異常**: 赤と緑の組み合わせを避ける
- **青黄色覚異常**: 青と黄色の組み合わせを避ける
- **色以外の情報**: アイコン、形状、テキストでも情報を伝達

## タイポグラフィ

### 文字サイズ階層

```css
/* メインタイトル */
.title-main {
  font-size: 2.25rem;    /* 36px */
  line-height: 2.5rem;   /* 40px */
  font-weight: 700;      /* bold */
}

/* サブタイトル */
.title-sub {
  font-size: 1.875rem;   /* 30px */
  line-height: 2.25rem;  /* 36px */
  font-weight: 700;      /* bold */
}

/* コンテンツタイトル */
.title-content {
  font-size: 1.5rem;     /* 24px */
  line-height: 2rem;     /* 32px */
  font-weight: 600;      /* semibold */
}

/* 本文テキスト */
.text-body {
  font-size: 1.25rem;    /* 20px */
  line-height: 1.75rem;  /* 28px */
  font-weight: 400;      /* normal */
}

/* 小さいテキスト */
.text-small {
  font-size: 1.125rem;   /* 18px */
  line-height: 1.5rem;   /* 24px */
  font-weight: 400;      /* normal */
}
```

### フォント選択指針

#### 推奨フォント
1. **システムフォント**: パフォーマンスと読みやすさを重視
2. **Noto Sans JP**: 日本語の美しい表示
3. **システムUIフォント**: Apple System、Segoe UI等

```css
.font-family-base {
  font-family: 
    'Noto Sans JP',           /* 日本語メイン */
    -apple-system,            /* iOS/macOS */
    BlinkMacSystemFont,       /* macOS */
    'Segoe UI',               /* Windows */
    'Roboto',                 /* Android */
    'Helvetica Neue',         /* フォールバック */
    Arial,                    /* フォールバック */
    sans-serif;               /* 最終フォールバック */
}
```

#### 文字種別と使用指針
- **ひらがな**: メインコンテンツで積極的に使用
- **カタカナ**: 外来語、擬音語に限定
- **漢字**: 小学1年生レベルまで、ふりがな付き
- **英数字**: UIラベル、数値表示に使用

### 行間と文字間設定

```css
/* 標準行間 */
.leading-comfortable {
  line-height: 1.75;      /* 175% */
}

/* タイトル用行間 */
.leading-title {
  line-height: 1.25;      /* 125% */
}

/* 文字間設定 */
.tracking-comfortable {
  letter-spacing: 0.025em; /* 2.5% */
}
```

## レイアウトとスペーシング

### グリッドシステム

#### ベースユニット: 4px
```css
/* 4pxの倦数で統一 */
.spacing-1  { margin: 4px; }     /* 4px */
.spacing-2  { margin: 8px; }     /* 8px */
.spacing-4  { margin: 16px; }    /* 16px */
.spacing-6  { margin: 24px; }    /* 24px */
.spacing-8  { margin: 32px; }    /* 32px */
.spacing-12 { margin: 48px; }    /* 48px */
.spacing-16 { margin: 64px; }    /* 64px */
```

#### コンテンツ間隔
- **要素間**: 16px (spacing-4)
- **コンポーネント間**: 32px (spacing-8)
- **セクション間**: 48px (spacing-12)
- **ページ間**: 64px (spacing-16)

### コンテナサイズ

```css
/* メインコンテント幅 */
.container-main {
  max-width: 1024px;      /* 4xl */
  margin: 0 auto;
  padding: 0 16px;
}

/* コンテンツ幅 */
.container-content {
  max-width: 768px;       /* 3xl */
  margin: 0 auto;
}

/* 狭いコンテンツ幅 */
.container-narrow {
  max-width: 512px;       /* 2xl */
  margin: 0 auto;
}
```

## インタラクション要素

### ボタン設計

#### サイズ指針
- **最小タッチターゲット**: 44px × 44px（WCAGガイドライン）
- **推奨サイズ**: 48px × 48px以上
- **大型ボタン**: 56px × 56px以上

#### ボタンバリエーション

```css
/* プライマリボタン */
.btn-primary {
  background: linear-gradient(to right, #3b82f6, #10b981);
  color: white;
  padding: 16px 32px;
  border-radius: 16px;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

/* セカンダリボタン */
.btn-secondary {
  background: white;
  color: #3b82f6;
  border: 3px solid #3b82f6;
  padding: 16px 32px;
  border-radius: 16px;
  font-size: 1.25rem;
  font-weight: 600;
}

/* 大型アクションボタン */
.btn-large {
  padding: 24px 48px;
  font-size: 1.5rem;
  border-radius: 24px;
  min-height: 80px;
}
```

#### アイコンボタン
- **アイコンサイズ**: 24px以上
- **パディング**: 最小12pxの余白
- **ラベル**: 絵文字 + テキストの組み合わせ推奨

### フォーム要素

#### 入力フィールド
```css
.input-field {
  width: 100%;
  padding: 16px 20px;
  font-size: 1.25rem;
  border: 3px solid #d1d5db;
  border-radius: 12px;
  background: white;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field:invalid {
  border-color: #ef4444;
}
```

#### チェックボックスとラジオボタン
- **サイズ**: 24px × 24px以上
- **クリックエリア**: ラベルも含めた全体
- **視覚的フィードバック**: 明確な選択状態表示

### ナビゲーション

#### パンくずナビ
```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.125rem;
  color: #6b7280;
}

.breadcrumb-item {
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.breadcrumb-item.active {
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
}
```

#### ステップインジケーター
```css
.step-indicator {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 32px 0;
}

.step-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.step-dot.current {
  background-color: #3b82f6;
  transform: scale(1.25);
}

.step-dot.completed {
  background-color: #10b981;
}

.step-dot.pending {
  background-color: #d1d5db;
}
```

## アクセシビリティ

### キーボードナビゲーション

#### Tabキー順序
1. **メインコンテンツ**: 学習エリアを最優先
2. **アクションボタン**: 主要な操作ボタン
3. **ナビゲーション**: 次のステップへの移動
4. **サブアクション**: サポート機能

#### フォーカス表示
```css
.focus-visible {
  outline: 3px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
}

/* マウスクリック時はフォーカスを非表示 */
.no-focus-visible:focus:not(.focus-visible) {
  outline: none;
}
```

### スクリーンリーダー対応

#### ARIAラベル
```html
<!-- ボタンの詳細説明 -->
<button 
  aria-label="モニターの説明を見る"
  aria-describedby="monitor-description"
>
  🖥️ モニター
</button>
<div id="monitor-description" class="sr-only">
  パソコンの画面を表示する部品です
</div>

<!-- 進捗状況 -->
<div 
  role="progressbar" 
  aria-valuenow="2" 
  aria-valuemin="1" 
  aria-valuemax="3"
  aria-label="学習進捗: 3つ中2つ目"
>
  2 / 3
</div>

<!-- ライブリージョン -->
<div aria-live="polite" aria-atomic="true">
  すごい！モニターをおぼえたね！
</div>
```

#### スクリーンリーダー専用テキスト
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 動きの減少対応

```css
/* ユーザーがアニメーションを減らしたい場合 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .motion-safe-only {
    display: none;
  }
}

/* アニメーションを好むユーザー向け */
@media (prefers-reduced-motion: no-preference) {
  .motion-reduce-hide {
    display: none;
  }
}
```

## レスポンシブデザイン

### ブレイクポイント

```css
/* Tailwind CSSブレイクポイント */
.mobile-first {
  /* モバイル: 375px〜 */
}

.sm-up {
  /* タブレット: 640px〜 */
}

.md-up {
  /* タブレット横: 768px〜 */
}

.lg-up {
  /* デスクトップ: 1024px〜 */
}

.xl-up {
  /* 大型デスクトップ: 1280px〜 */
}
```

### デバイス別最適化

#### モバイル（375px〜639px）
- **単一列レイアウト**: シンプルな縦並び
- **大型タッチターゲット**: 48px以上
- **フルスクリーン**: コンテンツに集中

#### タブレット（640px〜1023px）
- **2列レイアウト**: 効率的なスペース活用
- **ホバー効果**: マウス操作を想定
- **横向き対応**: 景観モードでの使用

#### デスクトップ（1024px〜）
- **複数列レイアウト**: コンテンツの並列表示
- **キーボードナビ**: Tabキーでの操作性
- **マルチタスク**: 複数ウィンドウ対応

## アニメーションガイドライン

### アニメーション原則

1. **意味のある動き**: 装飾ではなく機能的な動き
2. **予測可能性**: 一貫したタイミングと動き
3. **子供フレンドリー**: 楽しく、親しみやすい動き
4. **パフォーマンス**: 60fpsでスムーズな動作

### タイミング設定

```css
/* 瞬間的な反応 */
.duration-instant { transition-duration: 100ms; }

/* 素早い反応 */
.duration-fast { transition-duration: 200ms; }

/* 標準的な動き */
.duration-normal { transition-duration: 300ms; }

/* ゆったりした動き */
.duration-slow { transition-duration: 500ms; }

/* ドラマティックな動き */
.duration-dramatic { transition-duration: 700ms; }
```

### イージング関数

```css
/* 自然な動き */
.ease-natural { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }

/* 弾むような動き */
.ease-bounce { transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); }

/* スムーズな動き */
.ease-smooth { transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); }
```

### アニメーションタイプ

#### ホバーアニメーション
```css
.hover-lift {
  transition: transform 200ms ease-natural;
}

.hover-lift:hover {
  transform: translateY(-4px) scale(1.02);
}
```

#### クリックアニメーション
```css
.click-press {
  transition: transform 100ms ease-natural;
}

.click-press:active {
  transform: scale(0.95);
}
```

#### 出現アニメーション
```css
.fade-in {
  animation: fadeIn 500ms ease-natural;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## エラーハンドリングとフィードバック

### エラーメッセージ

#### 子供向けエラー表現
```html
<!-- 優しいエラーメッセージ -->
<div class="error-gentle">
  <div class="text-2xl mb-2">😊</div>
  <h3 class="text-lg font-semibold text-orange-800">
    あれ？なんかうまくいかないな〜
  </h3>
  <p class="text-orange-700 mt-2">
    もういちどやってみよう！
  </p>
  <button class="btn-primary mt-4">
    もういちど
  </button>
</div>
```

### 成功フィードバック

```html
<!-- お祝いメッセージ -->
<div class="success-celebration">
  <div class="text-4xl mb-4">🎉</div>
  <h3 class="text-2xl font-bold text-green-800">
    すごい！よくできたね！
  </h3>
  <p class="text-green-700 mt-2">
    つぎもがんばろう！
  </p>
</div>
```

### ローディング状態

```html
<!-- 子供向けローディング -->
<div class="loading-child-friendly">
  <div class="loading-spinner"></div>
  <p class="text-lg text-gray-700 mt-4">
    ちょっとまってね〜
  </p>
</div>

<style>
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
```

## パフォーマンス最適化

### 画像最適化
- **WebP形式**: モダンブラウザ向け
- **絵文字活用**: ファイルサイズを最小化
- **遅延読み込み**: スクロール連動での読み込み

### CSS最適化
- **Critical CSS**: Above the foldコンテンツのインライン化
- **プリロード**: 重要フォントの先行読み込み
- **コンポーネントスコープ**: スタイルの組の分離

### JavaScript最適化
- **コード分割**: ページ別の非同期読み込み
- **Tree Shaking**: 使用しないコードの除去
- **メモ化**: 高頻度計算のキャッシュ

## テスト戦略

### ユーザビリティテスト
1. **子供テスト**: 3-6歳の子供での実際の使用テスト
2. **保護者テスト**: 保護者目線での使いやすさテスト
3. **アクセシビリティテスト**: 支援技術でのテスト

### パフォーマンステスト
- **Core Web Vitals**: LCP, FID, CLSの測定
- **低速ネットワーク**: 3G環境でのテスト
- **低性能デバイス**: 古いタブレットでのテスト

### ブラウザテスト
- **主要ブラウザ**: Chrome, Safari, Firefox, Edge
- **モバイルブラウザ**: iOS Safari, Chrome Mobile
- **レスポンシブテスト**: 異なる画面サイズでの確認
