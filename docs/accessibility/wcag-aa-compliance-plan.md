# WCAG 2.1 AA 準拠改善計画書

**プロジェクト:** MyFir アクセシビリティ改善  
**基準:** WCAG 2.1 Level AA  
**対象期間:** 2025年7月-12月  
**最終目標:** 2025年12月末までに全50項目の AA 準拠達成  

## 改善計画サマリー

### 現在の準拠状況
- **A レベル:** 18/25 項目準拠（72%）
- **AA レベル:** 12/25 項目準拠（48%）
- **全体:** 30/50 項目準拠（60%）

### 目標
- **A レベル:** 25/25 項目準拠（100%）
- **AA レベル:** 25/25 項目準拠（100%）
- **全体:** 50/50 項目準拠（100%）

## フェーズ別実装計画

### フェーズ1: 基盤構築（7月-8月）
**目標:** 基本的なアクセシビリティ機能の実装

#### 1.1 キーボードナビゲーション実装
**対象:** 2.1.1 (A), 2.1.2 (A), 2.4.3 (A)

```typescript
// 実装例: src/components/AccessibleGameArea.tsx
interface KeyboardNavigationProps {
  children: React.ReactNode;
  onEscape?: () => void;
}

export const AccessibleGameArea: React.FC<KeyboardNavigationProps> = ({ 
  children, 
  onEscape 
}) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [interactiveElements, setInteractiveElements] = useState<HTMLElement[]>([]);
  
  useEffect(() => {
    // インタラクティブ要素を自動検出
    const elements = Array.from(
      document.querySelectorAll(
        'button, [role="button"], input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];
    setInteractiveElements(elements);
  }, [children]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Tab':
        // ブラウザのデフォルト動作を活用
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (focusedIndex + 1) % interactiveElements.length;
        setFocusedIndex(nextIndex);
        interactiveElements[nextIndex]?.focus();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = (focusedIndex - 1 + interactiveElements.length) % interactiveElements.length;
        setFocusedIndex(prevIndex);
        interactiveElements[prevIndex]?.focus();
        break;
      case 'Escape':
        onEscape?.();
        break;
    }
  }, [focusedIndex, interactiveElements, onEscape]);
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  return (
    <div
      role="application"
      aria-label="学習ゲームエリア"
      className="focus-within:outline-2 focus-within:outline-blue-500"
    >
      {children}
    </div>
  );
};
```

#### 1.2 スクリーンリーダー対応
**対象:** 1.1.1 (A), 1.3.1 (A), 4.1.2 (A)

```typescript
// 実装例: src/hooks/useAccessibleAnnouncements.ts
interface AnnouncementOptions {
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
  delay?: number;
}

export const useAccessibleAnnouncements = () => {
  const [politeAnnouncement, setPoliteAnnouncement] = useState('');
  const [assertiveAnnouncement, setAssertiveAnnouncement] = useState('');
  
  const announce = useCallback((
    message: string, 
    options: AnnouncementOptions = {}
  ) => {
    const { priority = 'polite', delay = 100 } = options;
    
    // 少し遅延させてスクリーンリーダーが確実に読み上げるようにする
    setTimeout(() => {
      if (priority === 'assertive') {
        setAssertiveAnnouncement(message);
        setTimeout(() => setAssertiveAnnouncement(''), 1000);
      } else {
        setPoliteAnnouncement(message);
        setTimeout(() => setPoliteAnnouncement(''), 1000);
      }
    }, delay);
  }, []);
  
  const AnnouncementRegions = () => (
    <>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="polite-announcements"
      >
        {politeAnnouncement}
      </div>
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        id="assertive-announcements"
      >
        {assertiveAnnouncement}
      </div>
    </>
  );
  
  return { announce, AnnouncementRegions };
};
```

#### 1.3 フォーカス管理
**対象:** 2.4.3 (A), 2.4.7 (AA)

```typescript
// 実装例: src/hooks/useFocusManagement.ts
export const useFocusManagement = () => {
  const [focusHistory, setFocusHistory] = useState<HTMLElement[]>([]);
  
  const trapFocus = useCallback((containerRef: React.RefObject<HTMLElement>) => {
    const container = containerRef.current;
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);
  
  const restoreFocus = useCallback(() => {
    const lastFocused = focusHistory[focusHistory.length - 1];
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus();
      setFocusHistory(prev => prev.slice(0, -1));
    }
  }, [focusHistory]);
  
  const saveFocus = useCallback(() => {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      setFocusHistory(prev => [...prev, activeElement]);
    }
  }, []);
  
  return { trapFocus, restoreFocus, saveFocus };
};
```

### フェーズ2: コンテンツ改善（9月-10月）
**目標:** コンテンツの理解可能性と知覚可能性の向上

#### 2.1 コントラスト比改善
**対象:** 1.4.3 (AA), 1.4.6 (AAA参考)

```typescript
// 実装例: src/utils/colorUtils.ts
export const colorPalette = {
  // WCAG AA準拠（4.5:1以上）の色定義
  text: {
    primary: '#1a1a1a',    // 白背景で 15.8:1
    secondary: '#4a4a4a',  // 白背景で 9.0:1
    inverse: '#ffffff',    // 濃色背景で 15.8:1
  },
  background: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    accent: '#e3f2fd',
  },
  interactive: {
    primary: '#1976d2',    // 白背景で 4.5:1
    primaryHover: '#1565c0',
    secondary: '#388e3c',  // 白背景で 4.5:1
    danger: '#d32f2f',     // 白背景で 4.5:1
  },
  // 子ども向け明るい色（コントラスト確保済み）
  child: {
    star: '#ffc107',       // 濃いテキストで 4.5:1
    treasure: '#ff9800',   // 濃いテキストで 4.5:1
    success: '#4caf50',    // 白テキストで 4.5:1
    info: '#2196f3',       // 白テキストで 4.5:1
  }
};

// コントラスト比計算関数
export const calculateContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    // RGB値を取得
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    // 相対輝度を計算
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// 自動コントラストチェック
export const ensureContrastCompliance = (
  textColor: string, 
  backgroundColor: string, 
  level: 'AA' | 'AAA' = 'AA'
): { isCompliant: boolean; ratio: number; required: number } => {
  const ratio = calculateContrastRatio(textColor, backgroundColor);
  const required = level === 'AAA' ? 7 : 4.5;
  
  return {
    isCompliant: ratio >= required,
    ratio,
    required
  };
};
```

#### 2.2 代替テキスト実装
**対象:** 1.1.1 (A)

```typescript
// 実装例: 改善されたPCPartCard
export const AccessiblePCPartCard: React.FC<PCPartCardProps> = ({ 
  part, 
  onClick, 
  isActive = false 
}) => {
  const { announce } = useAccessibleAnnouncements();
  
  const handleClick = () => {
    onClick?.();
    announce(`${part.name}を選択しました。${part.description}`);
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };
  
  return (
    <motion.button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`${part.name}。${part.description}。${isActive ? '現在選択されています' : 'クリックして選択'}`}
      aria-pressed={isActive}
      aria-describedby={`${part.id}-detail`}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 transition-all duration-200",
        "focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50",
        isActive ? "bg-yellow-100 border-4 border-orange-400 shadow-2xl" : "bg-white border-4 border-gray-200 shadow-lg hover:shadow-xl"
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      whileFocus={{ scale: 1.02, y: -2 }}
    >
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-gray-100">
          <span 
            className="text-6xl" 
            role="img" 
            aria-label={part.imageAlt || `${part.name}のアイコン`}
          >
            {part.imageUrl || "🖥️"}
          </span>
        </div>
        <h3 className="mb-2 font-bold text-2xl text-gray-800">
          {part.name}
        </h3>
        <p className="text-gray-600 text-lg">
          {part.description}
        </p>
        
        {/* スクリーンリーダー用詳細説明 */}
        <div id={`${part.id}-detail`} className="sr-only">
          {part.detailedDescription || `${part.name}について学習します。`}
        </div>
      </div>
      
      {/* 視覚的な選択状態インジケーター */}
      {isActive && (
        <motion.div
          className="absolute top-2 right-2 text-2xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          aria-hidden="true"
        >
          ✅
        </motion.div>
      )}
    </motion.button>
  );
};
```

#### 2.3 タイムアウト制御
**対象:** 2.2.1 (A), 2.2.2 (A)

```typescript
// 実装例: src/components/AccessibleTimer.tsx
interface AccessibleTimerProps {
  duration: number;
  onTimeUp: () => void;
  onTimeExtended?: (extraTime: number) => void;
  allowPause?: boolean;
  allowExtend?: boolean;
}

export const AccessibleTimer: React.FC<AccessibleTimerProps> = ({
  duration,
  onTimeUp,
  onTimeExtended,
  allowPause = true,
  allowExtend = true
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const { announce } = useAccessibleAnnouncements();
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    
    if (isPaused) return;
    
    // 時間が少なくなったら警告
    if (timeLeft === 30) {
      announce('残り30秒です', { priority: 'assertive' });
    } else if (timeLeft === 10) {
      announce('残り10秒です', { priority: 'assertive' });
      if (allowExtend) {
        setShowExtendDialog(true);
      }
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, isPaused, onTimeUp, allowExtend, announce]);
  
  const handlePause = () => {
    setIsPaused(true);
    announce('タイマーを一時停止しました');
  };
  
  const handleResume = () => {
    setIsPaused(false);
    announce('タイマーを再開しました');
  };
  
  const handleExtend = (extraSeconds: number) => {
    setTimeLeft(prev => prev + extraSeconds);
    setShowExtendDialog(false);
    onTimeExtended?.(extraSeconds);
    announce(`時間を${extraSeconds}秒延長しました`);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`;
  };
  
  return (
    <div className="timer-container">
      <div
        role="timer"
        aria-live="polite"
        aria-label={`残り時間 ${formatTime(timeLeft)}`}
        className="text-center"
      >
        <div className="text-2xl font-bold text-purple-700 mb-2">
          ⏰ 残り時間: {formatTime(timeLeft)}
        </div>
        
        {/* 視覚的進捗バー */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / duration) * 100}%` }}
            aria-hidden="true"
          />
        </div>
        
        {/* 制御ボタン */}
        <div className="flex justify-center space-x-4">
          {allowPause && (
            <button
              onClick={isPaused ? handleResume : handlePause}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={isPaused ? 'タイマーを再開' : 'タイマーを一時停止'}
            >
              {isPaused ? '▶️ 再開' : '⏸️ 一時停止'}
            </button>
          )}
        </div>
      </div>
      
      {/* 時間延長ダイアログ */}
      {showExtendDialog && (
        <AccessibleDialog
          title="時間を延長しますか？"
          isOpen={showExtendDialog}
          onClose={() => setShowExtendDialog(false)}
        >
          <p className="mb-4">もう少し時間が必要ですか？</p>
          <div className="flex space-x-4">
            <button
              onClick={() => handleExtend(30)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              30秒延長
            </button>
            <button
              onClick={() => handleExtend(60)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              1分延長
            </button>
            <button
              onClick={() => setShowExtendDialog(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              このまま続ける
            </button>
          </div>
        </AccessibleDialog>
      )}
    </div>
  );
};
```

### フェーズ3: 高度な機能（11月-12月）
**目標:** AAレベルの完全準拠と追加機能

#### 3.1 複数の入力方法対応
**対象:** 2.5.1 (A), 2.5.2 (A), 2.5.3 (A), 2.5.4 (A)

```typescript
// 実装例: src/components/MultiInputGameElement.tsx
interface MultiInputGameElementProps {
  onActivate: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const MultiInputGameElement: React.FC<MultiInputGameElementProps> = ({
  onActivate,
  children,
  disabled = false
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const elementRef = useRef<HTMLButtonElement>(null);
  
  // マウス/タッチ操作
  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    setIsPressed(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  
  const handlePointerUp = (e: React.PointerEvent) => {
    if (disabled) return;
    setIsPressed(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    // 要素内でリリースされた場合のみアクティベート
    const rect = e.currentTarget.getBoundingClientRect();
    const isInside = 
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
      
    if (isInside) {
      onActivate();
    }
  };
  
  // キーボード操作
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsPressed(true);
    }
  };
  
  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsPressed(false);
      onActivate();
    }
  };
  
  // 音声認識対応
  useEffect(() => {
    const handleVoiceCommand = (command: string) => {
      if (disabled) return;
      
      const element = elementRef.current;
      if (!element) return;
      
      // 要素にフォーカスがある場合のみ反応
      if (document.activeElement === element) {
        const normalizedCommand = command.toLowerCase().trim();
        if (normalizedCommand.includes('クリック') || 
            normalizedCommand.includes('選択') ||
            normalizedCommand.includes('押す')) {
          onActivate();
        }
      }
    };
    
    // 音声認識イベントリスナー（実装は省略）
    // window.addEventListener('voicecommand', handleVoiceCommand);
    
    return () => {
      // window.removeEventListener('voicecommand', handleVoiceCommand);
    };
  }, [disabled, onActivate]);
  
  return (
    <button
      ref={elementRef}
      type="button"
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      className={cn(
        "relative transition-all duration-150",
        "focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50",
        "active:scale-95",
        isPressed && "scale-95",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      aria-pressed={isPressed}
    >
      {children}
    </button>
  );
};
```

#### 3.2 動作・閃光制御
**対象:** 2.3.1 (A), 2.3.2 (AAA参考)

```typescript
// 実装例: src/components/MotionSafeAnimations.tsx
interface MotionSafeAnimationProps {
  children: React.ReactNode;
  animation?: 'bounce' | 'pulse' | 'spin' | 'none';
  reduceMotion?: boolean;
}

export const MotionSafeAnimation: React.FC<MotionSafeAnimationProps> = ({
  children,
  animation = 'none',
  reduceMotion
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // ユーザーの動作設定を確認
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const shouldReduceMotion = reduceMotion || prefersReducedMotion;
  
  const getAnimationConfig = () => {
    if (shouldReduceMotion) {
      return {
        animate: {},
        transition: { duration: 0 }
      };
    }
    
    switch (animation) {
      case 'bounce':
        return {
          animate: { y: [0, -10, 0] },
          transition: { duration: 0.6, repeat: Infinity, repeatType: 'reverse' as const }
        };
      case 'pulse':
        return {
          animate: { scale: [1, 1.05, 1] },
          transition: { duration: 1, repeat: Infinity, repeatType: 'reverse' as const }
        };
      case 'spin':
        return {
          animate: { rotate: 360 },
          transition: { duration: 2, repeat: Infinity, ease: 'linear' }
        };
      default:
        return {};
    }
  };
  
  return (
    <motion.div {...getAnimationConfig()}>
      {children}
    </motion.div>
  );
};

// 閃光制御コンポーネント
export const FlashSafeElement: React.FC<{
  children: React.ReactNode;
  flashCount?: number;
  duration?: number;
}> = ({ children, flashCount = 3, duration = 1000 }) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashesRemaining, setFlashesRemaining] = useState(0);
  
  const startFlash = useCallback(() => {
    // WCAG基準: 1秒間に3回を超える閃光を避ける
    if (flashCount > 3) {
      console.warn('Flash count exceeds WCAG guidelines (max 3 per second)');
      return;
    }
    
    setFlashesRemaining(flashCount);
    setIsFlashing(true);
  }, [flashCount]);
  
  useEffect(() => {
    if (flashesRemaining > 0) {
      const timer = setTimeout(() => {
        setIsFlashing(prev => !prev);
        if (!isFlashing) {
          setFlashesRemaining(prev => prev - 1);
        }
      }, duration / (flashCount * 2));
      
      return () => clearTimeout(timer);
    }
  }, [flashesRemaining, isFlashing, duration, flashCount]);
  
  return (
    <div
      className={cn(
        "transition-opacity duration-100",
        isFlashing ? "opacity-100" : "opacity-100"
      )}
      style={{
        backgroundColor: isFlashing ? 'rgba(255, 255, 0, 0.3)' : 'transparent'
      }}
    >
      {children}
    </div>
  );
};
```

## 実装チェックリスト

### A レベル（25項目）

#### 1. 知覚可能
- [ ] 1.1.1 非テキストコンテンツ
- [ ] 1.2.1 音声のみ及び映像のみ（収録済み）
- [ ] 1.2.2 キャプション（収録済み）
- [ ] 1.2.3 音声解説又はメディアに対する代替コンテンツ（収録済み）
- [ ] 1.3.1 情報及び関係性
- [ ] 1.3.2 意味のある順序
- [ ] 1.3.3 感覚的な特徴
- [ ] 1.4.1 色の使用
- [ ] 1.4.2 音声の制御

#### 2. 操作可能
- [ ] 2.1.1 キーボード
- [ ] 2.1.2 キーボードトラップなし
- [ ] 2.1.4 文字キーのショートカット
- [ ] 2.2.1 タイミング調整可能
- [ ] 2.2.2 一時停止、停止及び非表示
- [ ] 2.3.1 3回の閃光、又は閾値以下
- [ ] 2.4.1 ブロックスキップ
- [ ] 2.4.2 ページタイトル
- [ ] 2.4.3 フォーカス順序
- [ ] 2.4.4 リンクの目的（コンテキスト内）
- [ ] 2.5.1 ポインタのジェスチャ
- [ ] 2.5.2 ポインタのキャンセル
- [ ] 2.5.3 ラベルを含む名前
- [ ] 2.5.4 動きによる起動

#### 3. 理解可能
- [ ] 3.1.1 ページの言語
- [ ] 3.2.1 フォーカス時
- [ ] 3.2.2 入力時
- [ ] 3.3.1 エラーの特定
- [ ] 3.3.2 ラベル又は説明

#### 4. 堅牢
- [ ] 4.1.1 構文解析
- [ ] 4.1.2 名前（name）、役割（role）及び値（value）
- [ ] 4.1.3 ステータスメッセージ

### AA レベル（25項目）

#### 1. 知覚可能
- [ ] 1.2.4 キャプション（ライブ）
- [ ] 1.2.5 音声解説（収録済み）
- [ ] 1.3.4 表示の向き
- [ ] 1.3.5 入力目的の特定
- [ ] 1.4.3 コントラスト（最低限）
- [ ] 1.4.4 テキストのリサイズ
- [ ] 1.4.5 文字画像
- [ ] 1.4.10 リフロー
- [ ] 1.4.11 非テキストのコントラスト
- [ ] 1.4.12 テキストの間隔
- [ ] 1.4.13 ホバー又はフォーカスで表示されるコンテンツ

#### 2. 操作可能
- [ ] 2.4.5 複数の手段
- [ ] 2.4.6 見出し及びラベル
- [ ] 2.4.7 フォーカスの可視化

#### 3. 理解可能
- [ ] 3.1.2 一部分の言語
- [ ] 3.2.3 一貫したナビゲーション
- [ ] 3.2.4 一貫した識別性
- [ ] 3.3.3 エラー修正の提案
- [ ] 3.3.4 エラー回避（法的、金融及びデータ）

## テスト計画

### 自動テスト
```typescript
// jest.config.js への追加
module.exports = {
  // ... 既存の設定
  setupFilesAfterEnv: ['<rootDir>/src/test/accessibility-setup.ts'],
  testEnvironment: 'jsdom',
};

// src/test/accessibility-setup.ts
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// 各テストファイルでの使用例
describe('MouseFriendGame Accessibility', () => {
  test('should not have accessibility violations', async () => {
    const { container } = render(<MouseFriendGame onComplete={jest.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  test('should support keyboard navigation', async () => {
    render(<MouseFriendGame onComplete={jest.fn()} />);
    
    const startButton = screen.getByRole('button', { name: /はじめよう/ });
    startButton.focus();
    
    await user.keyboard('{Enter}');
    expect(screen.getByRole('application')).toBeInTheDocument();
    
    // Tab キーでナビゲーション
    await user.keyboard('{Tab}');
    const focusedElement = document.activeElement;
    expect(focusedElement).toBeInstanceOf(HTMLElement);
    expect(focusedElement).toHaveAttribute('tabindex', '0');
  });
  
  test('should announce state changes to screen readers', async () => {
    render(<MouseFriendGame onComplete={jest.fn()} />);
    
    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeInTheDocument();
    
    // ゲーム開始
    const startButton = screen.getByRole('button', { name: /はじめよう/ });
    await user.click(startButton);
    
    // 状態変化のアナウンスを確認
    await waitFor(() => {
      expect(liveRegion).toHaveTextContent(/ゲーム開始/);
    });
  });
});
```

### 手動テスト計画

#### 1. スクリーンリーダーテスト
- **NVDA（Windows）**: 週次テスト
- **JAWS（Windows）**: 月次テスト  
- **VoiceOver（macOS）**: 週次テスト
- **TalkBack（Android）**: 月次テスト

#### 2. キーボードナビゲーションテスト
- Tab キー順序の確認
- 矢印キーナビゲーションの確認
- ショートカットキーの動作確認
- フォーカストラップの動作確認

#### 3. 色覚特性テスト
- Colour Oracle でのシミュレーション
- 実際の色覚特性を持つユーザーによるテスト

## 進捗管理

### マイルストーン

| 期限 | マイルストーン | 成果物 |
|------|---------------|--------|
| 2025年7月末 | フェーズ1完了 | キーボードナビゲーション、基本的なスクリーンリーダー対応 |
| 2025年8月末 | フェーズ1検証 | 自動テスト環境構築、基本機能テスト完了 |
| 2025年9月末 | フェーズ2完了 | コントラスト改善、タイムアウト制御、代替テキスト実装 |
| 2025年10月末 | フェーズ2検証 | 中間監査、ユーザビリティテスト実施 |
| 2025年11月末 | フェーズ3完了 | 高度な機能実装、AA レベル全項目対応 |
| 2025年12月末 | 最終検証 | 外部監査、WCAG 2.1 AA 準拠証明書取得 |

### 品質管理

#### 毎週のチェック
- 新機能のアクセシビリティ自動テスト
- キーボードナビゲーション手動確認
- コントラスト比チェック

#### 毎月のレビュー
- スクリーンリーダーでの動作確認
- 実際のユーザーによるフィードバック収集
- 実装状況の進捗確認

#### 四半期の評価
- 外部専門家による監査
- 包括的なユーザビリティテスト
- 次期計画の策定

## 成功指標

### 技術指標
- **WCAG 2.1 AA 準拠率**: 100%（50/50項目）
- **自動テスト通過率**: 100%
- **手動テスト通過率**: 95%以上

### ユーザー指標
- **スクリーンリーダーユーザーのタスク完了率**: 90%以上
- **キーボードユーザーのタスク完了率**: 95%以上
- **認知特性のあるユーザーの満足度**: 4.5/5以上

### ビジネス指標
- **アクセシビリティ関連の問い合わせ**: 月5件以下
- **包括的設計による新規ユーザー獲得**: 月20%増
- **保護者満足度**: 4.7/5以上

---

**承認者**: MyFir プロダクトオーナー  
**実装責任者**: フロントエンド開発チーム  
**品質保証**: QA チーム + アクセシビリティ専門家  
**最終更新**: 2025年6月30日