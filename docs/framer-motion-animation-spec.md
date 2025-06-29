# Framer Motion アニメーション実装仕様書

## 概要

MyFir PC学習コンテンツにおけるFramer Motionを使用したアニメーション実装の詳細仕様書です。3-6歳の子供向けに最適化された、楽しく学習意欲を高めるアニメーション体験を提供します。

## 技術環境

### 使用ライブラリ
- **Framer Motion**: 12.0.0-alpha.2 (React 19対応版)
- **React**: 19.1.0
- **Next.js**: 15.3.4
- **TypeScript**: 5.8.3

### 互換性対応
現在、Framer MotionはReact 19の正式サポートを行っていないため、アルファ版を使用しています。将来的な安定版リリース時の移行計画も含めて実装しています。

```bash
# インストールコマンド
bun add framer-motion@12.0.0-alpha.2
```

## アニメーション設計原則

### 1. 子供向け体験の最適化
- **視覚的明確性**: 動きの開始と終了が明確
- **予測可能性**: 一貫したタイミングと動き方
- **楽しさ優先**: 遊び心のある bouncy なアニメーション
- **注意力配慮**: 過度な動きを避け、学習に集中できる設計

### 2. パフォーマンス優先
- **GPU加速**: transform と opacity プロパティの優先使用
- **will-change回避**: Framer Motionが自動管理
- **レイアウトアニメーション最小化**: reflow/repaint の削減

### 3. アクセシビリティ配慮
- **prefers-reduced-motion**: ユーザー設定の尊重
- **focus管理**: キーボードナビゲーション対応
- **aria-live**: 状態変更の音声通知

## コンポーネント別アニメーション実装

### 1. PCPartCard コンポーネント

#### 基本アニメーション設定
```typescript
// src/features/learn-pc-basics/components/PCPartCard.tsx
import { motion } from "framer-motion";

export function PCPartCard({ part, onClick, isActive = false }: PCPartCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={/* スタイリング */}
    >
      {/* コンテンツ */}
    </motion.button>
  );
}
```

#### アニメーション詳細解説

**初期表示アニメーション**
```typescript
initial={{ scale: 0.8, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
```
- **目的**: カードの段階的な出現で注意を引く
- **効果**: 0.8倍のサイズから1.0倍へスケールアップ
- **タイミング**: 透明度も同時に0→1で視覚的に自然

**ホバーアニメーション**
```typescript
whileHover={{ scale: 1.05, y: -5 }}
```
- **目的**: インタラクティブ要素であることの明示
- **効果**: 5%拡大 + 5px上方移動で「浮き上がり」演出
- **子供向け配慮**: 大きめの変化で認識しやすく

**クリックアニメーション**
```typescript
whileTap={{ scale: 0.95 }}
```
- **目的**: 押下感のフィードバック
- **効果**: 5%縮小で「押し込まれた」感覚
- **即応性**: タッチ開始と同時に反応

**Spring物理演算設定**
```typescript
transition={{
  type: "spring",
  stiffness: 300,  // バネの硬さ（高い=素早い反応）
  damping: 20,     // 減衰（低い=弾む感じ）
}}
```
- **stiffness: 300**: 子供が認識しやすい素早い反応
- **damping: 20**: 自然な弾みで楽しさ演出

### 2. LearningStep コンポーネント

#### コンテナアニメーション
```typescript
// メインコンテナ
<motion.div 
  className="space-y-8"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
```

#### 段階的コンテンツ表示
```typescript
// タイトル (0.3s遅延)
<motion.h2 
  className="text-3xl font-bold text-blue-800 mb-4"
  initial={{ scale: 0.9 }}
  animate={{ scale: 1 }}
  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
>
  {title}
</motion.h2>

// 説明文 (0.4s遅延)
<motion.p 
  className="text-xl text-gray-700 mb-6"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.4, duration: 0.5 }}
>
  {description}
</motion.p>

// コンテンツカード (0.5s遅延)
<motion.div 
  className="bg-white rounded-2xl p-6 shadow-lg"
  initial={{ scale: 0.95, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ delay: 0.5, duration: 0.4 }}
>
  <p className="text-lg text-gray-800 leading-relaxed">{content}</p>
</motion.div>
```

#### PC部品一覧のアニメーション
```typescript
<AnimatePresence>
  {showParts && (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {pcParts.map((part, index) => (
        <motion.div
          key={part.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <PCPartCard
            part={part}
            onClick={() => handlePartClick(part.id)}
            isActive={selectedPart === part.id}
          />
        </motion.div>
      ))}
    </motion.div>
  )}
</AnimatePresence>
```

**ポイント解説**
- **AnimatePresence**: 要素の出現・退場を管理
- **ステージング**: index * 0.1 で順次表示
- **方向性**: 左からスライドインで統一感

#### 成功フィードバックアニメーション
```typescript
<AnimatePresence>
  {selectedPart && (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div 
        className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 border-4 border-orange-400"
        animate={{ 
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 10px 25px rgba(0,0,0,0.1)", 
            "0 20px 40px rgba(0,0,0,0.15)", 
            "0 10px 25px rgba(0,0,0,0.1)"
          ]
        }}
        transition={{ duration: 0.6, repeat: 0 }}
      >
        {/* 成功メッセージ */}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

### 3. InteractiveDemo コンポーネント

#### マウスクリック練習アニメーション
```typescript
// メインボタン
<motion.button
  type="button"
  onClick={handleClick}
  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
  whileTap={{ scale: 0.9, rotate: 10 }}
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
  className="bg-gradient-to-r from-pink-400 to-purple-500 text-white text-2xl font-bold py-8 px-12 rounded-full shadow-xl"
>
  🐭 クリック！
</motion.button>
```

**特殊効果の解説**
- **rotate: [0, -5, 5, 0]**: ホバー時の「揺れ」効果
- **whileTap回転**: クリック時の楽しい回転
- **遅延表示**: ユーザーの注意を段階的に誘導

#### 進捗インジケーターアニメーション
```typescript
<div className="flex justify-center space-x-2 mt-4">
  {Array.from({ length: requiredClicks }, (_, i) => (
    <motion.div
      key={i}
      initial={{ scale: 0 }}
      animate={{ 
        scale: 1,
        backgroundColor: i < clicks ? "#10b981" : "#d1d5db"
      }}
      transition={{ 
        delay: 0.7 + i * 0.1, 
        type: "spring", 
        stiffness: 300 
      }}
      className="w-4 h-4 rounded-full"
    />
  ))}
</div>
```

#### 成功アニメーション
```typescript
<AnimatePresence>
  {showSuccess && (
    <motion.div 
      className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 border-4 border-orange-400"
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.p 
        className="text-2xl font-bold text-orange-800"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 0.8, repeat: 1 }}
      >
        すごい！マウスがつかえたね！ 🎉
      </motion.p>
    </motion.div>
  )}
</AnimatePresence>
```

### 4. メインページトランジション

#### ページ間アニメーション
```typescript
// app/pc/page.tsx
<AnimatePresence mode="wait">
  <motion.div
    key={currentStep}
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    <LearningStep
      title={learningSteps[currentStep].title}
      description={learningSteps[currentStep].description}
      content={learningSteps[currentStep].content}
      stepId={learningSteps[currentStep].id}
      onComplete={handleStepComplete}
    />
  </motion.div>
</AnimatePresence>
```

**mode="wait"の重要性**
- 前のステップが完全に退場してから次のステップが登場
- レイアウトの崩れを防止
- 子供にとって分かりやすい明確な切り替え

## アニメーション設定ガイドライン

### タイミング設定

```typescript
// 子供向け推奨タイミング設定
const ANIMATION_TIMINGS = {
  // 即座の反応 (ボタンフィードバック)
  instant: 0.1,
  
  // 素早い反応 (ホバー効果)
  fast: 0.2,
  
  // 標準的な動き (コンテンツ表示)
  normal: 0.3,
  
  // ゆったりした動き (ページ遷移)
  slow: 0.5,
  
  // ドラマチックな演出 (成功アニメーション)
  dramatic: 0.8,
};
```

### イージング関数

```typescript
// 推奨イージング設定
const EASING_FUNCTIONS = {
  // 自然な動き (一般的な用途)
  natural: "easeOut",
  
  // スムーズな動き (ページ遷移)
  smooth: "easeInOut",
  
  // 弾むような動き (楽しさ演出)
  bouncy: [0.68, -0.55, 0.265, 1.55],
  
  // 急激な動き (注意喚起)
  sharp: "easeIn",
};
```

### Spring物理設定

```typescript
// 用途別Spring設定
const SPRING_CONFIGS = {
  // 子供向け標準設定
  childFriendly: {
    type: "spring",
    stiffness: 300,
    damping: 20,
  },
  
  // より弾むような設定
  bouncy: {
    type: "spring",
    stiffness: 400,
    damping: 10,
  },
  
  // 重厚感のある設定
  heavy: {
    type: "spring",
    stiffness: 200,
    damping: 30,
  },
  
  // 素早い設定
  snappy: {
    type: "spring",
    stiffness: 500,
    damping: 25,
  },
};
```

## パフォーマンス最適化

### GPU加速プロパティの優先使用

```typescript
// 推奨: GPU加速されるプロパティ
const GPU_ACCELERATED_PROPS = [
  'transform',      // translate, scale, rotate
  'opacity',        // 透明度
  'filter',         // blur, brightness等
];

// 非推奨: レイアウトに影響するプロパティ
const LAYOUT_AFFECTING_PROPS = [
  'width', 'height',
  'top', 'left', 'right', 'bottom',
  'margin', 'padding',
];
```

### アニメーション最適化例

```typescript
// ❌ 非効率: レイアウトを変更
<motion.div
  animate={{ width: isExpanded ? 300 : 100 }}
/>

// ✅ 効率的: transformを使用
<motion.div
  animate={{ scaleX: isExpanded ? 3 : 1 }}
  style={{ transformOrigin: 'left' }}
/>

// ❌ 非効率: position変更
<motion.div
  animate={{ left: isOpen ? 0 : -100 }}
/>

// ✅ 効率的: translateX使用
<motion.div
  animate={{ x: isOpen ? 0 : -100 }}
/>
```

### メモリ使用量の最適化

```typescript
// アニメーション値の事前定義
const PREDEFINED_ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },
  
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.4 }
  },
  
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

// 使用例
<motion.div {...PREDEFINED_ANIMATIONS.fadeIn}>
  コンテンツ
</motion.div>
```

## アクセシビリティ対応

### prefers-reduced-motion対応

```typescript
// hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
}

// 使用例
function AnimatedComponent() {
  const reducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.3 }}
    >
      コンテンツ
    </motion.div>
  );
}
```

### ARIA対応

```typescript
// アニメーション状態の通知
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  onAnimationComplete={() => {
    // スクリーンリーダーに状態変更を通知
    announceToScreenReader('コンテンツが表示されました');
  }}
  aria-live="polite"
>
  {content}
</motion.div>

// スクリーンリーダー通知関数
function announceToScreenReader(message: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
```

## デバッグとツール

### 開発時デバッグ

```typescript
// アニメーション完了の監視
<motion.div
  animate={{ x: 100 }}
  onAnimationStart={() => console.log('アニメーション開始')}
  onAnimationComplete={() => console.log('アニメーション完了')}
  onUpdate={(latest) => console.log('現在値:', latest)}
>
  要素
</motion.div>

// パフォーマンス測定
const [animationDuration, setAnimationDuration] = useState(0);

<motion.div
  animate={{ x: 100 }}
  onAnimationStart={() => {
    const start = performance.now();
    setAnimationDuration(start);
  }}
  onAnimationComplete={() => {
    const end = performance.now();
    console.log('アニメーション時間:', end - animationDuration, 'ms');
  }}
>
  要素
</motion.div>
```

### パフォーマンス監視

```typescript
// フレームレート監視
function useFrameRate() {
  const [fps, setFps] = useState(0);
  
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function measureFPS() {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    }
    
    measureFPS();
  }, []);
  
  return fps;
}
```

## 今後の改善計画

### 短期的改善
1. **音声連動**: アニメーションと音声効果の同期
2. **カスタムイージング**: より子供らしい動きの研究
3. **パフォーマンス計測**: 実際の使用状況でのフレームレート測定

### 中期的改善
1. **安定版移行**: Framer Motion正式版のReact 19対応待ち
2. **Web Animations API**: ブラウザネイティブAPI併用検討
3. **Three.js連携**: 3Dアニメーション要素の追加

### 長期的展望
1. **VR/AR対応**: 没入感のある学習体験
2. **AI連動**: 子供の反応に応じたアニメーション調整
3. **物理演算**: より自然な動きの実現

## トラブルシューティング

### よくある問題と解決法

#### 1. アニメーションが表示されない
```typescript
// 原因: 初期値と終了値が同じ
// ❌ 問題のあるコード
<motion.div
  initial={{ opacity: 1 }}
  animate={{ opacity: 1 }}  // 変化なし
>

// ✅ 修正版
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
```

#### 2. パフォーマンスの問題
```typescript
// 原因: layout triggerの多用
// ❌ 重い処理
<motion.div animate={{ width: '100%' }} />  // reflow発生

// ✅ 軽量化
<motion.div animate={{ scaleX: 1 }} />      // GPU加速
```

#### 3. AnimatePresenceが動作しない
```typescript
// 原因: keyが設定されていない
// ❌ 問題のあるコード
<AnimatePresence>
  {show && <motion.div>コンテンツ</motion.div>}
</AnimatePresence>

// ✅ 修正版
<AnimatePresence>
  {show && (
    <motion.div key="content">  {/* key必須 */}
      コンテンツ
    </motion.div>
  )}
</AnimatePresence>
```

## 結論

Framer Motionを使用したアニメーション実装により、3-6歳の子供にとって魅力的で学習効果の高いPC学習体験を実現しました。Spring物理演算による自然な動きと、段階的な情報提示により、子供の注意力と理解力を最大化する設計となっています。

今後も継続的なパフォーマンス最適化とユーザビリティ向上に取り組み、より良い学習体験を提供していきます。