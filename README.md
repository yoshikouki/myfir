# MyFir (初めての〜〜)

「初めての〜〜」をテーマにした、3〜6歳の子どもを対象としたチュートリアル的なシリーズ作品です。

## プロジェクト概要

**MyFir**（My First の略）は、幼児が初めて触れる様々な概念や技術を楽しく学べるインタラクティブな学習プラットフォームです。

### 対象年齢
- **メインターゲット**: 3〜6歳
- 保護者と一緒に学習することを想定

### コンテンツシリーズ

現在開発中のコンテンツ：

#### 1. 初めてのパソコン (`/pc`)
- パソコンの基本的な構成要素を学ぶ
- マウスやキーボードの使い方
- 画面の見方や基本操作

### 技術的特徴
- **アクセシビリティ重視**: 幼児でも操作しやすいUI/UX
- **視覚的学習**: カラフルで分かりやすいデザイン
- **段階的学習**: 理解度に合わせたコンテンツ進行
- **親子学習**: 保護者向けのガイダンス機能

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing

This project includes comprehensive testing setup:

### Component Testing
- **Vitest** with React Testing Library for component tests
- **jsdom** environment for DOM simulation
- Run tests: `bun run test`
- Watch mode: `bun run test:watch`
- Coverage: `bun run test:coverage`

### E2E Testing
- **Playwright** for end-to-end testing
- Tests all major browsers (Chromium, Firefox, WebKit)
- Run E2E tests: `bun run test:e2e`
- Interactive mode: `bun run test:e2e:ui`
- Headed mode: `bun run test:e2e:headed`

### Development Tools
- **Biome** for linting and formatting
- **TypeScript** for type checking
- **Husky** for pre-commit hooks
- **shadcn/ui** for UI components

## CI/CD

### Continuous Integration
- **GitHub Actions** workflows for automated testing
- Runs on every push and pull request to main branch
- Jobs include:
  - Linting and type checking
  - Unit tests with coverage reporting
  - Build verification
  - E2E tests across multiple browsers

### Dependency Management
- Automated weekly dependency updates via GitHub Actions
- Creates pull requests with updated dependencies
- Runs full test suite to ensure compatibility

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
