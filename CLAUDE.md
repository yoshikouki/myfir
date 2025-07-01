# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL: 子ども向け開発の最重要ルール

**このプロジェクトは3-6歳児向けです。すべての実装・テキスト・UI設計において、以下を厳格に遵守してください。**

### 安全性・適切性の必須チェック
- **暴力的・恐怖的な表現を一切使用しない**（「エラー」「失敗」「間違い」も含む）
- **成人向けコンテンツや不適切な表現の排除**
- **子どもが理解できない専門用語や複雑な概念を避ける**
- **ネガティブな言葉を使わず、常に励ましの表現を使用**

### UI/UX 必須要件
- **最小タッチターゲット: 44px以上（指が小さい子どもに配慮）**
- **テキストサイズ: 最小16px、推奨18px以上**
- **色のコントラスト: WCAG AA準拠（視覚的配慮）**
- **操作は1ステップで完了できる設計**

### 言語・表現ルール
- **ひらがな優先、漢字は簡単なもののみ**
- **子どもが親しみやすい表現（「〜しよう」「すごいね」「がんばったね」等）**
- **エラーメッセージ例**: ❌「エラーが発生しました」→ ⭕「もういちど やってみよう！」

## Project Overview

**MyFir (初めての〜〜)** is an interactive learning platform for children aged 3-6, focusing on safe, encouraging "first-time" experiences with various concepts and technologies.

### Target Audience
- **Primary**: Children aged 3-6 years (pre-school/kindergarten)
- **Secondary**: Parents/guardians (co-learning experience)
- **Accessibility**: Children with diverse abilities and learning needs

### Content Philosophy
- **Safety First**: All content must be age-appropriate and encouraging
- **Visual Learning**: Colorful, intuitive design with large, friendly UI elements
- **Progressive Learning**: Step-by-step content that builds confidence
- **Accessibility**: Universal design for diverse abilities
- **Parent Guidance**: Features to help parents support their children
- **Cultural Sensitivity**: Japanese educational values and parenting approaches

### Current Content Series

#### 1. First PC Experience (`/pc`)
Located at `src/features/learn-pc-basics/`
- Introduces basic computer components with friendly characters
- Mouse and keyboard usage through game-like interactions
- Screen navigation with clear visual feedback
- Uses hiragana and simple kanji with furigana support

## 開発フロー（必須手順）

### 新機能実装の標準手順
1. **要件確認**: 子ども向け適切性チェック
2. **既存コード理解**: 関連ファイルを読み、パターンを把握
3. **テスト実装**: 子どもの操作パターンを考慮したE2Eテスト
4. **UI実装**: 44px以上のタッチターゲット、励ましメッセージ
5. **アクセシビリティ確認**: コントラスト・フォントサイズ・ナビゲーション
6. **テスト実行**: 必ず全テストをパス
7. **コミット前チェックリスト実行**

### コミット前チェックリスト
- [ ] テスト全件パス（`bun run test && bun run test:e2e`）
- [ ] 型チェック完了（`bun run typecheck`）
- [ ] リンター・フォーマッター適用（`bun run format && bun run lint`）
- [ ] 子ども向け表現確認（ネガティブ表現なし）
- [ ] UIサイズ要件確認（44px以上）
- [ ] アクセシビリティ確認

## Common Development Commands

**Note: This project uses Bun as the package manager**

### Development & Build
- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build production application
- `bun run start` - Start production server

### Code Quality (必須実行)
- `bun run lint` - Run Biome linter (check only)
- `bun run format` - Format code with Biome (safe fixes)
- `bun run typecheck` - Run TypeScript type checking

### Testing (子ども向けUIテスト重要)
- `bun run test` - Run unit tests with Vitest
- `bun run test:e2e` - **必須**: Run Playwright E2E tests（UI操作テスト）
- `bun run test:e2e:headed` - Run E2E tests in headed mode（デバッグ用）
- `bun run test:coverage` - Run tests with coverage report

### Development Helper Commands
- `bun run test:watch` - Run tests in watch mode
- `bun run test:ui` - Run tests with Vitest UI
- `bun run test:e2e:ui` - Run E2E tests in interactive mode
- `bun run format:unsafe` - Format with unsafe fixes
- `bun run update:all` - Update all dependencies to latest versions

## Architecture Overview

This is a Next.js 15 application using the App Router with TypeScript and modern tooling:

### Core Stack
- **Next.js 15** with App Router (`app/` directory structure)
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library (new-york style)
- **Bun** as package manager and runtime

### Development Tools
- **Biome** for linting and formatting
  - 96 character line width, double quotes
  - Unused imports/variables warnings with auto-fix
  - Sorted classes warning for Tailwind
- **Vitest** with React Testing Library for unit testing
- **Playwright** for E2E testing across browsers
- **Husky** for pre-commit hooks
- **Zod** for schema validation

### Architecture Pattern: Package by Features

The project follows a **Package by Features** (use-case based) pattern:

#### Feature Organization
- Each feature represents a distinct user goal
- Features are organized in `src/features/[use-case-name]/`
- No public API - direct imports allowed from features
- Naming convention: user-focused verb-object format (e.g., `learn-pc-basics`)

#### Feature Structure
```
src/features/[use-case-name]/
├── components/      # UI components
├── hooks/          # Custom hooks
├── api/            # API communication
├── utils/          # Utility functions
└── types.ts        # Type definitions
```

#### Current Features
- `learn-pc-basics/` - First PC experience tutorial

### Data Management Strategy

#### Data Fetching
1. **Server-First Approach**: Use React Server Components (RSC) for data fetching
2. **Client-Side When Needed**: Use Server Actions for user interactions
3. **Dependency Injection**: Props-based injection preferred, Context only when necessary

#### State Management
- Each feature maintains independent state
- Shared state requires separate feature (e.g., `user-context/`)
- Server Actions and fetch treated as external dependencies

### Project Structure
- `app/` - Next.js App Router pages and layouts
- `src/features/` - Feature-based organization
- `src/components/` - Shared UI components
- `lib/` - Utility functions
- `e2e/` - Playwright E2E tests

### Path Aliases
- `@/*` maps to root directory
- Components: `@/components`
- Utils: `@/lib/utils`
- UI components: `@/components/ui`

### Testing Configuration
- Unit tests use jsdom environment with setup in `src/test/setup.ts`
- Test files: `src/**/*.{test,spec}.{js,ts,tsx}`
- Coverage includes `src/**/*.{ts,tsx}` excluding test files and configs
- **E2E tests focus on child-friendly interactions**: large buttons, simple navigation, encouraging feedback

### CI/CD
- GitHub Actions for automated testing on push/PR to main
- Weekly dependency updates via automated workflow
- Pre-commit hooks enforce code quality
- **Child safety validation in CI**: Text content scanned for inappropriate language

## 子ども向け開発の具体例

### 良いコード例 vs 悪いコード例

#### メッセージ・文言
```typescript
// ❌ 悪い例
const errorMessage = "エラーが発生しました。操作を再試行してください。";
const warningMessage = "入力内容が間違っています";

// ⭕ 良い例
const encouragingMessage = "もういちど やってみよう！";
const helpfulMessage = "ちがう みちを えらんでみよう";
```

#### UI コンポーネント
```typescript
// ❌ 悪い例 - 小さすぎるボタン
<button className="px-2 py-1 text-sm">
  クリック
</button>

// ⭕ 良い例 - 44px以上のタッチターゲット
<button className="px-6 py-4 text-lg min-h-[44px] min-w-[44px]">
  はじめよう！
</button>
```

#### 色・アクセシビリティ
```typescript
// ❌ 悪い例 - コントラスト不足
<p className="text-gray-400 bg-gray-200">
  せつめい
</p>

// ⭕ 良い例 - 十分なコントラスト
<p className="text-gray-900 bg-yellow-100 text-lg">
  やってみよう！
</p>
```

### 子ども向け表現集

#### 励ましの言葉
- "すごいね！" / "よくできました！"
- "もうすこしで できるよ！"
- "いっしょに がんばろう！"
- "たのしく やってみよう！"

#### 操作説明
- "ここを ぽちっと おしてね"
- "まうすを うごかしてみよう"
- "ゆっくり やってみよう"
- "すきな いろを えらんでね"

### アクセシビリティ必須チェック項目
- [ ] 色だけでなく形・テキストでも情報を伝える
- [ ] 音声読み上げ対応（alt属性、aria-label）
- [ ] キーボード操作可能
- [ ] フォーカス表示が明確
- [ ] 動きの激しいアニメーションを避ける

## Knowledge Documentation (知見の記録)

### Documentation Philosophy
このプロジェクトでは、アジャイル開発を通じて得られた「知見」を重要な資産として記録します。

### What to Document
- **子どもの反応**: 実際の子どもユーザーのフィードバック
- **保護者の意見**: 安全性・教育的価値に関する意見
- **アクセシビリティ配慮**: 多様な能力を持つ子どもへの対応
- **文化的配慮**: 日本の子育て・教育環境への適応
- **技術的制約**: 子ども向け要件による技術選択

### What NOT to Document
- 実装の詳細（コードは作り直される前提）
- 特定の技術スタックに依存する内容
- 一時的な回避策やハック

### Documentation Location
- `/docs/` ディレクトリに知見を蓄積
- ファイル命名: `knowledge-[topic].md`
- 例: `knowledge-child-ux.md`, `knowledge-accessibility.md`

### Current Knowledge Base

**📁 体系化されたドキュメント構成**
- `docs/README.md` - ドキュメント全体の構成とナビゲーション
- `docs/strategy/` - プロダクト戦略・実装計画
- `docs/content-design/` - 教育コンテンツ設計・最適化  
- `docs/technical/` - 技術アーキテクチャ・パフォーマンス
- `docs/quality/` - 品質保証・テスト戦略
- `docs/accessibility/` - アクセシビリティ・インクルーシブデザイン
- `docs/business/` - ビジネスモデル・サービス設計
- `docs/knowledge/` - 実践的知見・学習成果

**🎯 重要な戦略文書**
- `docs/strategy/myfir-master-strategy-2025.md` - 最重要：全体戦略とビジョン
- `docs/strategy/implementation-roadmap-2025.md` - 36ヶ月実装計画