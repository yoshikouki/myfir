# PC学習コンテンツ 技術仕様書

## アーキテクチャ概要

### 設計原則

PC学習コンテンツは、MyFirプロジェクトの **Package by Features** アーキテクチャに従い、独立した機能モジュールとして設計されています。

#### 主要特徴
- **自己完結性**: 必要なすべてのコンポーネント、フック、型定義を内包
- **ユーザー中心設計**: 「はじめてのPC学習」というユースケースを中心に構成
- **コンポーネント再利用性**: 他の学習コンテンツでの流用可能性を考慮

### ディレクトリ構成

```
src/features/learn-pc-basics/
├── components/              # UIコンポーネント
│   ├── PCPartCard.tsx      # PC部品表示カード
│   ├── LearningStep.tsx    # 学習ステップコンテナ
│   └── InteractiveDemo.tsx # インタラクティブデモ
├── data.ts                 # 静的コンテンツデータ
└── types.ts                # TypeScript型定義

app/pc/
└── page.tsx                # Next.js App Routerページ
```

## コンポーネント設計

### 1. PCPartCardコンポーネント

#### 責任
- PC部品の視覚的表示
- ユーザーインタラクションのハンドリング
- 選択状態の視覚的フィードバック

#### プロパティ
```typescript
interface PCPartCardProps {
  part: PCPart;           // 表示するPC部品情報
  onClick?: () => void;   // クリックハンドラ
  isActive?: boolean;     // 選択状態フラグ
}
```

#### アニメーション仕様
- **初期表示**: スケール0.8から1.0へのフェードイン
- **ホバー**: スケール1.05、Y軸方向に-5px移動
- **クリック**: スケール0.95への一時的縮小
- **Spring物理演算**: stiffness=300, damping=20

### 2. LearningStepコンポーネント

#### 責任
- 学習ステップのコンテンツ表示
- PC部品一覧の表示制御
- ステップ完了コールバックの実行
- インタラクティブデモの条件付き表示

#### プロパティ
```typescript
interface LearningStepProps {
  title: string;          // ステップタイトル
  description: string;    // ステップ説明
  content: string;        // 学習コンテンツ
  stepId: string;         // ステップ識別子
  onComplete?: () => void; // 完了コールバック
}
```

#### 状態管理
```typescript
const [selectedPart, setSelectedPart] = useState<string | null>(null);
const [showParts, setShowParts] = useState(false);
```

#### アニメーションシーケンス
1. **コンテナフェードイン** (0.6s)
2. **タイトルアニメーション** (0.3s遅延)
3. **説明テキスト** (0.4s遅延)
4. **コンテンツカード** (0.5s遅延)
5. **ボタン表示** (0.6s遅延)

### 3. InteractiveDemoコンポーネント

#### 責任
- マウスクリック練習の実装
- キーボード入力練習の実装
- 進捗状況の視覚的表示
- 成功時のお祝い演出

#### プロパティ
```typescript
interface InteractiveDemoProps {
  type: "mouse" | "keyboard"; // デモタイプ
  onComplete: () => void;      // 完了コールバック
}
```

#### 状態管理
```typescript
// マウス練習用
const [clicks, setClicks] = useState(0);
const requiredClicks = 5;

// キーボード練習用
const [keyPresses, setKeyPresses] = useState<string[]>([]);
const targetWord = "こんにちは";

// 共通
const [showSuccess, setShowSuccess] = useState(false);
```

## データ構造

### PC部品情報
```typescript
export interface PCPart {
  id: string;          // 一意識別子
  name: string;        // 部品名（ひらがな）
  description: string; // 説明文（子供向け）
  imageUrl?: string;   // 絵文字またはアイコン
  audioUrl?: string;   // 音声ファイル（将来用）
}
```

### 学習進捗情報
```typescript
export interface LearningProgress {
  userId?: string;        // ユーザーID（将来用）
  completedParts: string[]; // 完了部品ID一覧
  currentPart?: string;   // 現在の部品ID
  lastAccessedAt: Date;   // 最終アクセス日時
}
```

### 学習ステップデータ
```typescript
export const learningSteps = [
  {
    id: "introduction",
    title: "パソコンってなに？",
    description: "パソコンのなまえややくわりをおぼえよう！",
    content: "..."
  },
  // ...
];
```

## 状態管理

### メインページ状態
```typescript
export default function FirstPCPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const goToNextStep = () => {
    if (currentStep < learningSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
}
```

### 状態遷移フロー
1. **初期状態**: currentStep=0, completedSteps=[]
2. **ステップ進行**: ユーザー操作により次のステップへ
3. **完了記録**: 各ステップでのインタラクション完了時
4. **全体完了**: すべてのステップが完了した状態

## パフォーマンス最適化

### Reactレンダリング最適化

#### コンポーネントメモ化
現在の実装では不要ですが、将来的に複雑化した場合の備え:

```typescript
// 将来的な最適化例
const PCPartCard = memo(function PCPartCard(props: PCPartCardProps) {
  // ...
});

const LearningStep = memo(function LearningStep(props: LearningStepProps) {
  // ...
}, (prevProps, nextProps) => {
  return prevProps.stepId === nextProps.stepId;
});
```

#### イベントハンドラ最適化
```typescript
// useCallbackを使用した最適化例
const handlePartClick = useCallback((partId: string) => {
  setSelectedPart(partId);
  setTimeout(() => {
    if (onComplete) onComplete();
  }, 1000);
}, [onComplete]);
```

### アニメーション最適化

#### GPU加速最適化
- **transformプロパティ使用**: scale, translate, rotateのGPU加速利用
- **opacityアニメーション**: レイヤー合成の最適化
- **will-change回避**: Framer Motionが自動管理

#### パフォーマンスモニタリング
```typescript
// フレームレートモニタリング例
const [renderTime, setRenderTime] = useState(0);

useEffect(() => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.name === 'component-render') {
        setRenderTime(entry.duration);
      }
    });
  });
  observer.observe({ entryTypes: ['measure'] });

  return () => observer.disconnect();
}, []);
```

## エラーハンドリング

### コンポーネントレベルエラー境界
```typescript
class PCLearningErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PC Learning Error:', error, errorInfo);
    // エラーログ送信処理
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            あれ？なんかおかしいぞ？
          </h2>
          <p className="text-lg text-gray-700">
            もういちどやってみてね！
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg"
          >
            もういちど
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### ローディング状態
```typescript
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <motion.div
        className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="ml-4 text-lg text-gray-700">ちょっとまってね...</p>
    </div>
  );
}
```

## テスト戦略

### 単体テスト
```typescript
// PCPartCardコンポーネントテスト
describe('PCPartCard', () => {
  const mockPart: PCPart = {
    id: 'test-monitor',
    name: 'テストモニター',
    description: 'テスト用の説明',
    imageUrl: '🖥️'
  };

  it('部品情報を正しく表示する', () => {
    render(<PCPartCard part={mockPart} />);
    
    expect(screen.getByText('テストモニター')).toBeInTheDocument();
    expect(screen.getByText('テスト用の説明')).toBeInTheDocument();
    expect(screen.getByText('🖥️')).toBeInTheDocument();
  });

  it('クリックイベントが発生する', () => {
    const handleClick = jest.fn();
    render(<PCPartCard part={mockPart} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('アクティブ状態が正しく反映される', () => {
    render(<PCPartCard part={mockPart} isActive={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-orange-400');
    expect(button).toHaveClass('bg-gradient-to-br');
  });
});
```

### 結合テスト
```typescript
describe('PC Learning Integration', () => {
  it('学習フローが正しく動作する', async () => {
    render(<FirstPCPage />);
    
    // 初期状態確認
    expect(screen.getByText('パソコンってなに？')).toBeInTheDocument();
    
    // 部品表示ボタンクリック
    fireEvent.click(screen.getByText('ぶひんをみる'));
    
    // PC部品カードの表示確認
    await waitFor(() => {
      expect(screen.getByText('モニター')).toBeInTheDocument();
    });
    
    // 部品クリック
    fireEvent.click(screen.getByText('モニター'));
    
    // 成功メッセージ確認
    await waitFor(() => {
      expect(screen.getByText('すごい！')).toBeInTheDocument();
    });
  });
});
```

### E2Eテスト
```typescript
// Playwrightテスト
import { test, expect } from '@playwright/test';

test.describe('PC Learning Content', () => {
  test('子供がPC学習を完了できる', async ({ page }) => {
    await page.goto('/pc');

    // 初期表示確認
    await expect(page.locator('h1')).toContainText('はじめてのパソコン');

    // 部品学習ステップへ進む
    await page.click('text=つぎへ');
    await expect(page.locator('h2')).toContainText('パソコンのぶひん');

    // PC部品を表示
    await page.click('text=ぶひんをみる');
    
    // アニメーション待機
    await page.waitForTimeout(1000);
    
    // モニターカードクリック
    await page.click('text=モニター');
    
    // 成功メッセージ確認
    await expect(page.locator('text=すごい！')).toBeVisible();
    
    // インタラクティブステップへ進む
    await page.click('text=つぎへ');
    await page.click('text=つぎへ');
    
    // マウスクリック練習
    const clickButton = page.locator('text=🐭 クリック！');
    for (let i = 0; i < 5; i++) {
      await clickButton.click();
      await page.waitForTimeout(200);
    }
    
    // マウス練習完了確認
    await expect(page.locator('text=すごい！マウスがつかえたね！')).toBeVisible();
    
    // キーボード練習
    await page.type('body', 'こんにちは');
    
    // 全体完了確認
    await expect(page.locator('text=おめでとう！')).toBeVisible();
  });
});
```

## デプロイメント考慮事項

### ビルド最適化
- **コード分割**: メインバンドルからPC学習機能を分離
- **遅延読み込み**: インタラクティブデモの条件付き読み込み
- **静的生成**: Next.jsのSSG機能を活用した高速表示

### セキュリティ
- **XSS対策**: Reactの自動エスケープ機能を活用
- **CSP設定**: インラインスクリプトの禁止
- **入力バリデーション**: キーボード入力のサニタイズ

### モニタリング
- **パフォーマンス指標**: Core Web Vitalsの監視
- **エラートラッキング**: JavaScriptエラーの自動収集
- **ユーザー行動解析**: 学習完了率や数操作時間の追跡
