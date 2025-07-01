# MyFir パフォーマンス最適化計画

## 🎯 目標設定

### パフォーマンス目標（Core Web Vitals）
- **LCP (Largest Contentful Paint)**: 2.5秒以下
- **FID (First Input Delay)**: 100ms以下
- **CLS (Cumulative Layout Shift)**: 0.1以下
- **Time to Interactive**: 3.8秒以下

### 子ども向け特別要件
- **アニメーション**: 60fps維持
- **タッチ反応**: 16ms以下
- **読み込み体感**: 「すぐに始まる」感覚

## 📊 現状分析

### 現在のバンドルサイズ
```
Route                     Size    First Load JS    問題点
/                       5.63kB      107kB         ✅ 良好
/pc                    42.1kB      143kB         ❌ 大きすぎ
Shared                               101kB         △ 改善余地
```

### 主要な課題
1. **PCページの肥大化（42.1kB）**
   - Framer Motion: ~25kB
   - 複雑なゲームロジック: ~10kB
   - 重複コンポーネント: ~7kB

2. **Shared Bundleの重さ（101kB）**
   - React/Next.js基盤: ~60kB
   - Tailwind CSS: ~25kB
   - その他ライブラリ: ~16kB

## 🚀 最適化戦略

### 1. Code Splitting & Lazy Loading

#### Dynamic Imports実装
```typescript
// 🔧 実装例
// src/features/learn-pc-basics/components/lazy-components.ts
export const MouseFriendGame = dynamic(
  () => import('./MouseFriendGame'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl">🎮 ゲームを じゅんびちゅう...</div>
      </div>
    ),
    ssr: false // ゲームはクライアントサイドのみ
  }
);

export const InteractiveDemo = dynamic(
  () => import('./InteractiveDemo'),
  {
    loading: () => <div className="animate-pulse bg-blue-100 h-64 rounded-lg" />,
    ssr: true // 教育コンテンツはSSR対応
  }
);
```

#### Route-based Splitting
```typescript
// app/pc/loading.tsx - ルートレベルローディング
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            がくしゅうを はじめるよ！
          </h1>
          <div className="text-xl text-gray-700">
            ちょっと まってね...
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 2. アニメーション最適化

#### CSS Animations移行
```css
/* 軽量なCSS Animationsに移行 */
@keyframes gentle-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.animate-gentle-bounce {
  animation: gentle-bounce 2s ease-in-out infinite;
}

.animate-twinkle {
  animation: twinkle 1.5s ease-in-out infinite;
}
```

#### Framer Motion最適化
```typescript
// 🔧 メモ化とパフォーマンス最適化
const OptimizedMotionDiv = React.memo(({ children, ...props }) => (
  <motion.div
    {...props}
    style={{ willChange: 'transform' }} // GPUアクセラレーション
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  >
    {children}
  </motion.div>
));

// 🔧 アニメーション制御
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
};
```

### 3. 画像・アセット最適化

#### Next.js Image最適化
```typescript
// 🔧 画像最適化コンポーネント
export const OptimizedCharacterImage = ({ 
  character, 
  size = 64, 
  priority = false 
}: {
  character: string;
  size?: number;
  priority?: boolean;
}) => {
  return (
    <Image
      src={`/characters/${character}.webp`}
      alt={`${character}のキャラクター`}
      width={size}
      height={size}
      priority={priority}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      className="select-none"
      sizes="(max-width: 768px) 48px, 64px"
    />
  );
};
```

#### WebP変換とサイズ最適化
```bash
# 🔧 画像最適化スクリプト
#!/bin/bash
# scripts/optimize-images.sh

find public/characters -name "*.png" -o -name "*.jpg" | while read file; do
  # WebP変換
  cwebp -q 80 "$file" -o "${file%.*}.webp"
  
  # 元ファイルサイズ削減
  if command -v optipng &> /dev/null; then
    optipng -o7 "$file"
  fi
done
```

### 4. Font Loading最適化

#### 子ども向けフォント最適化
```typescript
// 🔧 フォント最適化
import { Noto_Sans_JP } from 'next/font/google';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap', // FOUT対策
  weight: ['400', '700'],
  preload: true,
  variable: '--font-noto-sans-jp',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true, // Layout Shift対策
});

// カスタムフォントCSS
const customFontStyles = `
  @font-face {
    font-family: 'Child Friendly';
    src: url('/fonts/child-friendly.woff2') format('woff2');
    font-display: swap;
    font-weight: 400 700;
    unicode-range: U+3040-309F, U+30A0-30FF, U+4E00-9FAF; /* ひらがな、カタカナ、漢字 */
  }
`;
```

### 5. Bundle Analyzer設定

#### webpack-bundle-analyzer設定
```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Bundle Analyzer
  ...(process.env.ANALYZE === 'true' && {
    experimental: {
      bundlePagesRouterDependencies: true,
    },
  }),
  
  // 画像最適化
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1年
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // 圧縮
  compress: true,
  
  // 実験的機能
  experimental: {
    optimizeCss: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

// Bundle Analyzer用のwrapper
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
```

#### 分析用スクリプト
```json
{
  "scripts": {
    "analyze": "cross-env ANALYZE=true next build",
    "analyze:server": "cross-env BUNDLE_ANALYZE=server next build",
    "analyze:browser": "cross-env BUNDLE_ANALYZE=browser next build"
  }
}
```

## 🎯 実装計画

### Week 1: 基盤整備
- [ ] Bundle Analyzer設定
- [ ] Dynamic Import導入
- [ ] 基本的な画像最適化

### Week 2: アニメーション最適化
- [ ] CSS Animations移行
- [ ] Framer Motion最適化
- [ ] Reduced Motion対応

### Week 3: アセット最適化
- [ ] WebP画像変換
- [ ] フォント最適化
- [ ] SVG最適化

### Week 4: 測定・調整
- [ ] パフォーマンス測定
- [ ] ボトルネック特定
- [ ] 細かな調整

## 📈 期待される効果

### バンドルサイズ削減
- **PCページ**: 42.1kB → 28kB (33%削減)
- **Shared Bundle**: 101kB → 80kB (21%削減)
- **Total First Load**: 143kB → 108kB (24%削減)

### パフォーマンス改善
- **LCP**: 3.2秒 → 2.1秒 (34%改善)
- **FID**: 150ms → 80ms (47%改善)
- **CLS**: 0.15 → 0.08 (47%改善)

### 子ども向け体験向上
- **読み込み体感**: 「遅い」→「すぐ始まる」
- **アニメーション**: 滑らかで楽しい
- **タッチ反応**: 即座に反応

## 🔍 測定・監視

### パフォーマンス測定ツール
```typescript
// 🔧 パフォーマンス測定
export const measurePerformance = () => {
  // Core Web Vitals測定
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
  
  // カスタム測定
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log(`${entry.name}: ${entry.duration}ms`);
    });
  });
  
  observer.observe({ entryTypes: ['measure', 'navigation'] });
};
```

### 継続的監視
```yaml
# .github/workflows/performance.yml
name: Performance Monitoring

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      - name: Install dependencies
        run: bun install
      - name: Build
        run: bun run build
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.json'
```

## 🎨 子ども向け最適化

### 視覚的フィードバック
```typescript
// 🔧 子ども向け読み込み表示
export const ChildFriendlyLoader = ({ message = "じゅんびちゅう..." }) => {
  const [emoji, setEmoji] = useState("🎮");
  const emojis = ["🎮", "📚", "🌟", "🎨", "🎵"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
      <div className="text-8xl animate-bounce">{emoji}</div>
      <p className="text-2xl font-bold text-blue-800">{message}</p>
      <div className="flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
};
```

## 🔄 継続的改善

### 月次レビュー項目
- [ ] Core Web Vitals確認
- [ ] Bundle Size変化
- [ ] ユーザーフィードバック
- [ ] 新技術動向調査

### 年次見直し項目
- [ ] 技術スタック評価
- [ ] パフォーマンスベンチマーク更新
- [ ] 子ども向け要件見直し
- [ ] 競合分析

---

**策定日**: 2025-06-30  
**実装期限**: 2025-08-30  
**レビュー**: 月次  
**担当**: MyFir パフォーマンスチーム