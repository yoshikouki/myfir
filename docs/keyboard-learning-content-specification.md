# キーボード学習コンテンツ「ことばとともだち」技術仕様書

## 1. プロジェクト概要

### 1.1 コンテンツ概要
**名称**: ことばとともだち (Words Friends)  
**対象年齢**: 3-6歳児  
**学習目標**: キーボード操作とひらがな入力の基礎習得  
**開発期間**: 3-6ヶ月（中期実装フェーズ）  

### 1.2 教育的目標
- キーボードの基本配置理解
- ひらがな入力の基礎習得
- 文字と音の関連性強化
- タイピング基礎技能獲得
- デジタル文字コミュニケーションの基礎理解

### 1.3 技術的目標
- 既存のMyFirアーキテクチャとの完全統合
- 年齢別適応学習システムの実装
- リアルタイム学習分析機能
- アクセシビリティ対応の完全実装

## 2. システムアーキテクチャ

### 2.1 ディレクトリ構造
```
src/features/learn-keyboard-basics/
├── components/
│   ├── KeyboardVisualizer.tsx      # キーボード視覚化コンポーネント
│   ├── FingerGuide.tsx            # 指位置ガイドコンポーネント
│   ├── CharacterInteraction.tsx    # キャラクター相互作用
│   ├── TypingPractice.tsx         # タイピング練習エリア
│   ├── ProgressTracker.tsx        # 進捗追跡コンポーネント
│   └── WordFriendsGame.tsx        # メインゲームコンポーネント
├── hooks/
│   ├── useKeyboardInput.ts        # キーボード入力管理
│   ├── useTypingAnalytics.ts      # タイピング分析
│   ├── useCharacterAnimation.ts   # キャラクターアニメーション
│   └── useProgressTracking.ts     # 進捗管理
├── utils/
│   ├── keyboardLayout.ts          # キーボードレイアウト定義
│   ├── hiraganaMapping.ts         # ひらがなマッピング
│   ├── difficultyCalculator.ts    # 難易度計算
│   └── typingAnalyzer.ts          # タイピング分析ロジック
├── data.ts                        # ステージ・キャラクターデータ
└── types.ts                       # 型定義
```

### 2.2 コンポーネント設計原則

**1. 子ども向けUX原則の厳格適用**
- 最小タッチターゲット: 44px以上
- テキストサイズ: 最小18px
- コントラスト: WCAG AA準拠
- アニメーション: 過度でない適度なフィードバック

**2. 段階的開示設計**
- 情報過多を避ける段階的表示
- 年齢に応じた複雑度調整
- 注意散漫要素の最小化

**3. エラー予防・回復設計**
- 破壊的操作の防止
- 失敗を学習機会に変換
- 励ましメッセージによる動機維持

## 3. データ構造設計

### 3.1 基本型定義

```typescript
// 文字キャラクター定義
export interface CharacterFriend {
  id: string;
  character: string;        // 'あ', 'か', etc.
  name: string;            // 'あーくん', 'かーちゃん', etc.
  personality: string;     // キャラクター性格
  color: string;           // テーマカラー
  animation: {
    idle: string;          // 待機アニメーション
    happy: string;         // 成功時アニメーション
    encourage: string;     // 励ましアニメーション
  };
  sound: {
    greeting: string;      // 挨拶音声
    success: string;       // 成功音声
    hint: string;         // ヒント音声
  };
}

// キーボードキー情報
export interface KeyInfo {
  id: string;
  character: string;       // 表示文字
  romaji?: string;        // ローマ字（該当する場合）
  position: {
    row: number;          // キーボード行位置
    column: number;       // キーボード列位置
  };
  finger: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
  hand: 'left' | 'right';
  difficulty: 1 | 2 | 3 | 4 | 5;  // 習得難易度
}

// ステージ定義
export interface KeyboardStage {
  id: string;
  title: string;
  description: string;
  instruction: string;
  targetCharacters: string[];    // 学習対象文字
  minAge: 3 | 4 | 5 | 6;        // 推奨最小年齢
  maxAge: 3 | 4 | 5 | 6;        // 推奨最大年齢
  duration: number;              // 推奨学習時間（秒）
  difficulty: 'easy' | 'medium' | 'hard';
  objectives: string[];          // 学習目標
  rewards: RewardItem[];         // 獲得可能報酬
}

// 学習進捗情報
export interface TypingProgress {
  userId?: string;
  currentStage: number;
  stagesCompleted: boolean[];
  charactersLearned: string[];   // 習得済み文字
  typingSpeed: number;           // 文字/分
  accuracy: number;              // 正確率 (0-1)
  bestTimes: number[];           // ステージ別最短時間
  totalPracticeTime: number;     // 総練習時間
  weakCharacters: string[];      // 苦手文字リスト
  streakDays: number;           // 連続学習日数
  lastAccessedAt: Date;
}

// タイピング分析データ
export interface TypingAnalytics {
  sessionId: string;
  keyStrokes: KeyStroke[];
  errors: TypingError[];
  speed: SpeedMetrics;
  accuracy: AccuracyMetrics;
  patterns: TypingPattern[];
}

export interface KeyStroke {
  timestamp: number;
  key: string;
  duration: number;      // キー押下時間
  correct: boolean;
  fingerId: string;      // 使用した指
  position: { x: number; y: number };  // クリック位置
}
```

### 3.2 ステージデータ構造

```typescript
export const keyboardStages: KeyboardStage[] = [
  {
    id: "welcome-to-word-land",
    title: "もじもじランドへようこそ",
    description: "もじもじランドのともだちとあってみよう！",
    instruction: "キーボードをそっとさわってみてね",
    targetCharacters: ["あ", "い", "う", "え", "お"],
    minAge: 3,
    maxAge: 6,
    duration: 120,
    difficulty: "easy",
    objectives: [
      "キーボードに慣れ親しむ",
      "文字キャラクターと友達になる",
      "基本的な指の位置を覚える"
    ],
    rewards: [
      { type: "badge", id: "first-friend", name: "はじめてのともだち" },
      { type: "character", id: "guide-chan", name: "がいどちゃん" }
    ]
  },
  {
    id: "aiueo-song",
    title: "あいうえおのうた",
    description: "あいうえおをうたってタイピング！",
    instruction: "うたにあわせてもじをおしてみよう",
    targetCharacters: ["あ", "い", "う", "え", "お"],
    minAge: 3,
    maxAge: 5,
    duration: 180,
    difficulty: "easy",
    objectives: [
      "母音の位置を覚える",
      "音と文字の関連を理解する",
      "リズムに合わせた入力を体験する"
    ],
    rewards: [
      { type: "song", id: "aiueo-master", name: "あいうえおマスター" },
      { type: "animation", id: "character-dance", name: "みんなでダンス" }
    ]
  },
  // ... 他のステージ定義
];

// 文字キャラクターデータ
export const characterFriends: CharacterFriend[] = [
  {
    id: "a-kun",
    character: "あ",
    name: "あーくん",
    personality: "元気いっぱいで明るい性格。みんなのリーダー的存在",
    color: "#FF6B6B",
    animation: {
      idle: "bounce-gentle",
      happy: "jump-celebration",
      encourage: "wave-friendly"
    },
    sound: {
      greeting: "/sounds/characters/a-kun-hello.mp3",
      success: "/sounds/characters/a-kun-success.mp3",
      hint: "/sounds/characters/a-kun-hint.mp3"
    }
  },
  // ... 他のキャラクター定義（あ行〜わ行まで）
];
```

## 4. コンポーネント詳細仕様

### 4.1 KeyboardVisualizer コンポーネント

**目的**: キーボードの視覚的表現と学習支援

```typescript
interface KeyboardVisualizerProps {
  targetKeys?: string[];           // ハイライト対象キー
  pressedKeys: string[];          // 現在押されているキー
  showFingerHints: boolean;       // 指ガイド表示フラグ
  layout: 'qwerty' | 'hiragana';  // レイアウト種別
  size: 'small' | 'medium' | 'large';  // サイズ
  disabled?: boolean;             // 無効化状態
  onKeyClick?: (key: string) => void;  // キークリックハンドラ
  className?: string;
}

const KeyboardVisualizer: React.FC<KeyboardVisualizerProps> = ({
  targetKeys = [],
  pressedKeys,
  showFingerHints,
  layout,
  size,
  disabled = false,
  onKeyClick,
  className
}) => {
  // キーボードレイアウト状態管理
  const [keyStates, setKeyStates] = useState<Map<string, KeyState>>(new Map());
  
  // アニメーション管理
  const [animations, setAnimations] = useState<Map<string, string>>(new Map());
  
  // キー押下効果
  const handleKeyPress = useCallback((key: string) => {
    // 視覚的フィードバック
    // 音声フィードバック
    // 分析データ記録
  }, []);

  return (
    <div className={`keyboard-visualizer keyboard-${size} ${className}`}>
      {/* キーボード行別レンダリング */}
      {keyboardLayout[layout].map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((keyInfo) => (
            <KeyButton
              key={keyInfo.id}
              keyInfo={keyInfo}
              isTarget={targetKeys.includes(keyInfo.character)}
              isPressed={pressedKeys.includes(keyInfo.character)}
              showFingerHint={showFingerHints}
              disabled={disabled}
              onClick={() => onKeyClick?.(keyInfo.character)}
              animation={animations.get(keyInfo.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
```

### 4.2 WordFriendsGame メインコンポーネント

```typescript
interface WordFriendsGameProps {
  initialStage?: number;
  userId?: string;
  onComplete: (results: GameResults) => void;
  onProgress: (progress: TypingProgress) => void;
}

const WordFriendsGame: React.FC<WordFriendsGameProps> = ({
  initialStage = 0,
  userId,
  onComplete,
  onProgress
}) => {
  // ゲーム状態管理
  const [gameState, setGameState] = useState<KeyboardGameState>({
    currentStage: initialStage,
    isPlaying: false,
    timeRemaining: 0,
    score: 0,
    currentChallenge: null,
    inputBuffer: "",
    errors: []
  });

  // 学習分析フック
  const {
    analytics,
    recordKeyStroke,
    recordError,
    calculateMetrics
  } = useTypingAnalytics(userId);

  // キーボード入力管理
  const {
    handleKeyPress,
    handleKeyRelease,
    inputState
  } = useKeyboardInput({
    onValidInput: handleValidInput,
    onInvalidInput: handleInvalidInput,
    disabled: !gameState.isPlaying
  });

  // ステージ管理
  const currentStage = keyboardStages[gameState.currentStage];
  const [stageProgress, setStageProgress] = useState(0);

  // キャラクター管理
  const [activeCharacters, setActiveCharacters] = useState<CharacterFriend[]>([]);
  const [characterStates, setCharacterStates] = useState<Map<string, CharacterState>>(new Map());

  // ゲーム開始処理
  const startStage = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      timeRemaining: currentStage.duration,
      score: 0,
      inputBuffer: "",
      errors: []
    }));

    // ステージ別初期化処理
    initializeStage(currentStage);
  }, [currentStage]);

  // 入力検証処理
  const handleValidInput = useCallback((input: string) => {
    // 正解処理
    // スコア更新
    // キャラクターリアクション
    // 進捗更新
  }, []);

  const handleInvalidInput = useCallback((input: string, expected: string) => {
    // エラー処理（子ども向けなので優しく）
    // 励ましメッセージ
    // ヒント提供
  }, []);

  return (
    <div className="word-friends-game">
      {/* ステージヘッダー */}
      <StageHeader stage={currentStage} progress={stageProgress} />
      
      {/* キャラクター表示エリア */}
      <CharacterInteraction
        characters={activeCharacters}
        states={characterStates}
        currentInput={inputState.buffer}
      />
      
      {/* キーボードビジュアライザー */}
      <KeyboardVisualizer
        targetKeys={getCurrentTargetKeys()}
        pressedKeys={inputState.pressedKeys}
        showFingerHints={shouldShowFingerHints()}
        layout="hiragana"
        size="large"
        onKeyClick={handleKeyClick}
      />
      
      {/* 入力練習エリア */}
      <TypingPractice
        challenge={gameState.currentChallenge}
        inputBuffer={inputState.buffer}
        onInput={handleInput}
      />
      
      {/* 進捗・スコア表示 */}
      <ProgressTracker
        stage={currentStage}
        progress={stageProgress}
        score={gameState.score}
        timeRemaining={gameState.timeRemaining}
      />
      
      {/* ゲームコントロール */}
      <GameControls
        isPlaying={gameState.isPlaying}
        onStart={startStage}
        onPause={pauseGame}
        onRestart={restartStage}
      />
    </div>
  );
};
```

## 5. 学習分析システム

### 5.1 リアルタイム分析機能

```typescript
// useTypingAnalytics フック
export const useTypingAnalytics = (userId?: string) => {
  const [analytics, setAnalytics] = useState<TypingAnalytics>({
    sessionId: generateSessionId(),
    keyStrokes: [],
    errors: [],
    speed: { wpm: 0, cpm: 0 },
    accuracy: { correct: 0, total: 0, rate: 0 },
    patterns: []
  });

  // キーストローク記録
  const recordKeyStroke = useCallback((stroke: KeyStroke) => {
    setAnalytics(prev => ({
      ...prev,
      keyStrokes: [...prev.keyStrokes, stroke]
    }));

    // リアルタイム分析更新
    updateRealTimeMetrics(stroke);
  }, []);

  // エラー記録
  const recordError = useCallback((error: TypingError) => {
    setAnalytics(prev => ({
      ...prev,
      errors: [...prev.errors, error]
    }));

    // エラーパターン分析
    analyzeErrorPattern(error);
  }, []);

  // メトリクス計算
  const calculateMetrics = useCallback(() => {
    const timeSpan = getAnalyticsTimeSpan(analytics.keyStrokes);
    const speed = calculateTypingSpeed(analytics.keyStrokes, timeSpan);
    const accuracy = calculateAccuracy(analytics.keyStrokes, analytics.errors);
    const patterns = identifyTypingPatterns(analytics.keyStrokes);

    return {
      speed,
      accuracy,
      patterns,
      recommendations: generateRecommendations(speed, accuracy, patterns)
    };
  }, [analytics]);

  return {
    analytics,
    recordKeyStroke,
    recordError,
    calculateMetrics
  };
};
```

### 5.2 個別化学習機能

```typescript
// 個別適応システム
export class AdaptiveLearningEngine {
  constructor(private userProfile: UserProfile) {}

  // 難易度動的調整
  adjustDifficulty(currentPerformance: PerformanceMetrics): DifficultySettings {
    const { accuracy, speed, errorRate } = currentPerformance;
    
    // 年齢別基準値との比較
    const ageBaseline = this.getAgeBaseline(this.userProfile.age);
    
    // パフォーマンス比較
    const performanceRatio = this.calculatePerformanceRatio(
      currentPerformance, 
      ageBaseline
    );

    // 難易度調整ロジック
    if (performanceRatio > 1.2) {
      // 優秀な場合：チャレンジを上げる
      return this.increaseDifficulty();
    } else if (performanceRatio < 0.8) {
      // 困っている場合：サポートを強化
      return this.provideSupportiveSettings();
    } else {
      // 適切な場合：現状維持
      return this.maintainCurrentSettings();
    }
  }

  // 個別学習パス生成
  generateLearningPath(progress: TypingProgress): LearningPath {
    const weakAreas = this.identifyWeakAreas(progress);
    const strengths = this.identifyStrengths(progress);
    
    return {
      nextStages: this.recommendNextStages(weakAreas, strengths),
      practiceActivities: this.generatePracticeActivities(weakAreas),
      reviewSchedule: this.createReviewSchedule(progress),
      motivationalElements: this.selectMotivationalElements(this.userProfile)
    };
  }
}
```

## 6. アクセシビリティ対応

### 6.1 多様な能力への配慮

```typescript
// アクセシビリティ設定
export interface AccessibilitySettings {
  visualSupport: {
    highContrastMode: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    reduceMotion: boolean;
    colorBlindSupport: boolean;
  };
  auditorySupport: {
    soundEnabled: boolean;
    speechRate: number;        // 音声速度 0.5-2.0
    soundEffectsLevel: number; // 効果音レベル 0-100
    backgroundMusicLevel: number; // BGMレベル 0-100
  };
  motorSupport: {
    keyRepeatDelay: number;    // キーリピート遅延
    stickyKeys: boolean;       // スティッキーキー
    mouseKeys: boolean;        // マウスキー
    touchAssist: boolean;      // タッチ支援
  };
  cognitiveSupport: {
    simplifiedInterface: boolean;
    extraTime: boolean;        // 時間延長
    stepByStepMode: boolean;   // ステップバイステップモード
    repetitionMode: boolean;   // 繰り返し学習モード
  };
}

// アクセシビリティ適用コンポーネント
const AccessibleKeyboardGame: React.FC<KeyboardGameProps> = (props) => {
  const { settings } = useAccessibilitySettings();
  
  // 設定に基づくコンポーネント調整
  const adjustedProps = useMemo(() => {
    let adjusted = { ...props };
    
    if (settings.visualSupport.highContrastMode) {
      adjusted = applyHighContrastTheme(adjusted);
    }
    
    if (settings.cognitiveSupport.simplifiedInterface) {
      adjusted = simplifyInterface(adjusted);
    }
    
    if (settings.motorSupport.touchAssist) {
      adjusted = enhanceTouchTargets(adjusted);
    }
    
    return adjusted;
  }, [props, settings]);

  return <WordFriendsGame {...adjustedProps} />;
};
```

### 6.2 多言語・多文化対応

```typescript
// 国際化対応
export const i18nConfig = {
  defaultLocale: 'ja-JP',
  supportedLocales: [
    'ja-JP',  // 日本語（ひらがな・カタカナ）
    'en-US',  // 英語（QWERTY）
    'zh-CN',  // 中国語（簡体字）
    'ko-KR'   // 韓国語（ハングル）
  ],
  
  // 文字体系別設定
  scriptSystems: {
    'ja-JP': {
      inputMethod: 'hiragana',
      keyboardLayout: 'japanese',
      writingDirection: 'ltr',
      characterSet: 'hiragana-katakana-kanji'
    },
    'en-US': {
      inputMethod: 'direct',
      keyboardLayout: 'qwerty',
      writingDirection: 'ltr',
      characterSet: 'latin'
    }
  }
};
```

## 7. パフォーマンス要件

### 7.1 技術要件

**フロントエンド性能**:
- 初期ロード時間: < 2秒
- キー入力応答時間: < 50ms
- アニメーション: 60fps維持
- メモリ使用量: < 100MB

**ブラウザ対応**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**デバイス対応**:
- デスクトップ（Windows/Mac/Linux）
- タブレット（iPad/Android）
- ハイブリッドデバイス（Surface等）

### 7.2 最適化戦略

```typescript
// パフォーマンス最適化実装例
const OptimizedKeyboardGame = React.memo(
  WordFriendsGame,
  (prevProps, nextProps) => {
    // 効率的な再レンダリング制御
    return isGameStateEqual(prevProps, nextProps);
  }
);

// 仮想化によるキーボード描画最適化
const VirtualizedKeyboard = () => {
  const visibleKeys = useVirtualization({
    totalKeys: keyboardLayout.totalKeys,
    containerHeight: keyboardHeight,
    itemHeight: keyHeight
  });

  return (
    <div className="virtualized-keyboard">
      {visibleKeys.map(key => (
        <KeyButton key={key.id} {...key} />
      ))}
    </div>
  );
};

// Web Workers による分析処理オフロード
const AnalyticsWorker = new Worker('/workers/typing-analytics.js');

const processAnalytics = (data: TypingData) => {
  return new Promise<AnalyticsResult>((resolve) => {
    AnalyticsWorker.postMessage(data);
    AnalyticsWorker.onmessage = (event) => {
      resolve(event.data);
    };
  });
};
```

## 8. テスト戦略

### 8.1 単体テスト

```typescript
// キーボード入力テスト例
describe('KeyboardInput', () => {
  test('正しいひらがな入力が記録される', () => {
    const mockRecorder = jest.fn();
    const { result } = renderHook(() => 
      useKeyboardInput({ onValidInput: mockRecorder })
    );

    act(() => {
      result.current.handleKeyPress('あ');
    });

    expect(mockRecorder).toHaveBeenCalledWith('あ');
  });

  test('年齢に適さない難易度は調整される', () => {
    const youngChild = { age: 3, abilities: 'beginner' };
    const difficulty = calculateAgeDifficulty(youngChild, 'hard');
    
    expect(difficulty).toBe('easy');
  });
});
```

### 8.2 統合テスト

```typescript
// E2Eテスト例
describe('キーボード学習フロー', () => {
  test('3歳児が最初のステージを完了できる', async () => {
    await page.goto('/learn/keyboard');
    
    // ステージ開始
    await page.click('[data-testid="start-button"]');
    
    // キー押下シミュレーション
    await page.keyboard.press('あ');
    
    // 成功フィードバック確認
    await expect(page.locator('[data-testid="success-message"]'))
      .toBeVisible();
    
    // 次のステージへの進行確認
    await expect(page.locator('[data-testid="next-stage-button"]'))
      .toBeEnabled();
  });
});
```

### 8.3 ユーザビリティテスト

```typescript
// ユーザビリティ測定
export class ChildUsabilityTracker {
  trackInteraction(event: UserEvent) {
    // 子ども特有の行動パターン分析
    const patterns = {
      hesitationTime: this.measureHesitation(event),
      explorationBehavior: this.trackExploration(event),
      frustrationIndicators: this.detectFrustration(event),
      successJoy: this.measurePositiveEmotions(event)
    };

    return this.generateUsabilityInsights(patterns);
  }

  generateChildFriendlyFeedback(insights: UsabilityInsights) {
    // 子ども向けの建設的フィードバック生成
    return {
      encouragement: this.selectEncouragementMessage(insights),
      nextSteps: this.recommendNextSteps(insights),
      parentGuidance: this.generateParentGuidance(insights)
    };
  }
}
```

## 9. 展開・運用計画

### 9.1 段階的リリース計画

**Phase 1（開発開始+3ヶ月）**: 
- 基本ステージ3つの実装
- 基本分析機能
- デスクトップ対応

**Phase 2（開発開始+5ヶ月）**:
- 全5ステージ完成
- 高度な分析機能
- タブレット対応

**Phase 3（開発開始+6ヶ月）**:
- アクセシビリティ完全対応
- 多言語対応
- 運用開始

### 9.2 品質保証計画

**子ども安全性検証**:
- 教育専門家による内容審査
- 小児心理学者による年齢適合性検証  
- 実際の子どもによるユーザビリティテスト

**技術品質検証**:
- セキュリティ監査
- パフォーマンステスト
- アクセシビリティ監査

**継続的改善**:
- 学習効果データの継続分析
- ユーザーフィードバックの定期収集
- コンテンツの定期更新

---

本仕様書は、MyFirプラットフォームの教育価値を最大化する「ことばとともだち」コンテンツの実装指針を定めたものです。子ども中心の設計思想と最新の教育技術を融合し、安全で効果的な学習体験を提供することを目標としています。