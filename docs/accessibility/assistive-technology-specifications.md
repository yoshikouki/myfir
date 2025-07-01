# 支援技術対応仕様書

**プロジェクト:** MyFir（3-6歳児向け学習プラットフォーム）  
**対象:** 支援技術との互換性確保  
**準拠基準:** WCAG 2.1 AA + 児童向け追加要件  
**更新日:** 2025年6月30日  

## 概要

本仕様書では、MyFir プラットフォームが様々な支援技術（Assistive Technology）と適切に連携し、すべての子どもが等しく学習機会を得られるための技術的要件を定義します。

## 対象支援技術

### 1. スクリーンリーダー

#### 1.1 対象製品
| 製品名 | OS | 対象ユーザー | 優先度 | 備考 |
|--------|----|-----------|---------|----- |
| NVDA | Windows | 視覚障害 | 高 | 無料、教育機関での利用多数 |
| JAWS | Windows | 視覚障害 | 中 | 有料、高機能 |
| VoiceOver | macOS/iOS | 視覚障害 | 高 | Apple製品標準搭載 |
| TalkBack | Android | 視覚障害 | 高 | Android標準搭載 |
| ChromeVox | Chrome OS | 視覚障害 | 中 | 教育機関でのChromebook利用 |

#### 1.2 技術要件

**基本構造の提供**
```html
<!-- セマンティックHTML構造 -->
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>MyFir - はじめてのパソコン</title>
  <meta name="description" content="3歳から6歳の子ども向け、初めてのパソコン学習">
</head>
<body>
  <!-- メイン構造 -->
  <header role="banner">
    <h1>MyFir</h1>
    <nav role="navigation" aria-label="メインメニュー">
      <!-- ナビゲーション -->
    </nav>
  </header>
  
  <main role="main">
    <section aria-labelledby="learning-title">
      <h2 id="learning-title">はじめてのパソコン</h2>
      <!-- 学習コンテンツ -->
    </section>
  </main>
  
  <aside role="complementary" aria-label="学習支援機能">
    <!-- サポート機能 -->
  </aside>
  
  <footer role="contentinfo">
    <!-- フッター -->
  </footer>
</body>
</html>
```

**ARIAラベル実装標準**
```typescript
// React コンポーネントでのARIA実装例
interface AccessibleComponentProps {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  invalid?: boolean;
  children: React.ReactNode;
}

const AccessibleGameButton: React.FC<AccessibleComponentProps> = ({
  id,
  label,
  description,
  required = false,
  invalid = false,
  children,
  ...props
}) => {
  return (
    <button
      id={id}
      aria-label={label}
      aria-describedby={description ? `${id}-description` : undefined}
      aria-required={required}
      aria-invalid={invalid}
      role="button"
      {...props}
    >
      {children}
      {description && (
        <div id={`${id}-description`} className="sr-only">
          {description}
        </div>
      )}
    </button>
  );
};

// ゲーム要素の状態変化通知
const GameStateAnnouncer: React.FC = () => {
  const [announcement, setAnnouncement] = useState('');
  
  const announceGameEvent = useCallback((event: GameEvent) => {
    const messages = {
      'star-collected': '星を取得しました！',
      'level-complete': 'レベル完了！次のステージに進みます。',
      'game-paused': 'ゲームを一時停止しました。',
      'help-available': 'ヘルプが利用できます。',
    };
    
    const message = messages[event.type];
    if (message) {
      setAnnouncement(message);
      // 1秒後にクリアして重複読み上げを防ぐ
      setTimeout(() => setAnnouncement(''), 1000);
    }
  }, []);
  
  return (
    <>
      {/* 丁寧な通知用 */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="polite-announcements"
      >
        {announcement}
      </div>
      
      {/* 緊急通知用 */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        id="urgent-announcements"
      >
        {/* 緊急時のみ使用 */}
      </div>
    </>
  );
};
```

**読み上げ最適化**
```typescript
// スクリーンリーダー向けテキスト最適化
const ScreenReaderOptimizedText = {
  // 数字の読み上げ
  formatNumber: (num: number): string => {
    // "3個" ではなく "3つ" など、自然な読み上げに
    return `${num}つ`;
  },
  
  // 進捗の説明
  formatProgress: (current: number, total: number): string => {
    return `${total}つのうち ${current}つ 完了しました`;
  },
  
  // 操作指示
  formatInstruction: (action: string, target: string): string => {
    return `${target}を ${action}してください`;
  },
  
  // ゲーム状態の説明
  formatGameState: (state: GameState): string => {
    const states = {
      waiting: 'ゲーム開始を待っています',
      playing: 'ゲーム中です',
      paused: 'ゲームを一時停止中です',
      completed: 'ゲームが完了しました'
    };
    return states[state] || '状態不明';
  }
};

// 読み上げ順序の制御
const ScreenReaderNavigationOrder: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  useEffect(() => {
    // ページ読み込み時にメインコンテンツにフォーカス
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
    }
  }, []);
  
  return (
    <div>
      {/* スキップリンク */}
      <a 
        href="#main-content" 
        className="skip-link"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            document.getElementById('main-content')?.focus();
          }
        }}
      >
        メインコンテンツにスキップ
      </a>
      
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
    </div>
  );
};
```

### 2. キーボード操作支援

#### 2.1 基本要件

**フォーカス管理**
```typescript
// 包括的なキーボードナビゲーション
class KeyboardNavigationManager {
  private focusableElements: HTMLElement[] = [];
  private currentIndex: number = 0;
  private trapEnabled: boolean = false;
  
  constructor() {
    this.updateFocusableElements();
    this.attachEventListeners();
  }
  
  private updateFocusableElements(): void {
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="link"]:not([disabled])'
    ].join(', ');
    
    this.focusableElements = Array.from(
      document.querySelectorAll(selector)
    ) as HTMLElement[];
  }
  
  private attachEventListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // DOM変更の監視
    const observer = new MutationObserver(() => {
      this.updateFocusableElements();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Tab':
        if (this.trapEnabled) {
          event.preventDefault();
          this.moveFocus(event.shiftKey ? -1 : 1);
        }
        break;
        
      case 'ArrowDown':
      case 'ArrowRight':
        if (this.isInGameArea()) {
          event.preventDefault();
          this.moveFocus(1);
        }
        break;
        
      case 'ArrowUp':
      case 'ArrowLeft':
        if (this.isInGameArea()) {
          event.preventDefault();
          this.moveFocus(-1);
        }
        break;
        
      case 'Home':
        if (this.isInGameArea()) {
          event.preventDefault();
          this.moveFocus(0, true);
        }
        break;
        
      case 'End':
        if (this.isInGameArea()) {
          event.preventDefault();
          this.moveFocus(this.focusableElements.length - 1, true);
        }
        break;
        
      case 'Escape':
        this.handleEscape();
        break;
    }
  }
  
  private moveFocus(direction: number, absolute: boolean = false): void {
    if (absolute) {
      this.currentIndex = direction;
    } else {
      this.currentIndex = (this.currentIndex + direction + this.focusableElements.length) % this.focusableElements.length;
    }
    
    const targetElement = this.focusableElements[this.currentIndex];
    if (targetElement) {
      targetElement.focus();
      
      // フォーカス移動をスクリーンリーダーに通知
      this.announceElementInfo(targetElement);
    }
  }
  
  private announceElementInfo(element: HTMLElement): void {
    const announcement = this.getElementDescription(element);
    this.announce(announcement);
  }
  
  private getElementDescription(element: HTMLElement): string {
    const role = element.getAttribute('role') || element.tagName.toLowerCase();
    const label = element.getAttribute('aria-label') || 
                  element.textContent?.trim() || 
                  'ラベルなし';
    
    const descriptions = {
      button: `${label} ボタン`,
      input: `${label} 入力欄`,
      link: `${label} リンク`,
      'game-element': `${label} ゲーム要素`
    };
    
    return descriptions[role as keyof typeof descriptions] || `${label} ${role}`;
  }
  
  enableFocusTrap(): void {
    this.trapEnabled = true;
  }
  
  disableFocusTrap(): void {
    this.trapEnabled = false;
  }
  
  private isInGameArea(): boolean {
    const activeElement = document.activeElement as HTMLElement;
    return activeElement?.closest('[role="application"]') !== null;
  }
  
  private handleEscape(): void {
    // モーダルやゲームの終了
    const modal = document.querySelector('[role="dialog"]');
    if (modal) {
      const closeButton = modal.querySelector('[aria-label*="閉じる"]') as HTMLElement;
      closeButton?.click();
    }
  }
  
  private announce(message: string): void {
    const announcer = document.getElementById('polite-announcements');
    if (announcer) {
      announcer.textContent = message;
    }
  }
}
```

**ショートカットキー**
```typescript
// 子ども向けショートカットキー設定
const ChildFriendlyShortcuts = {
  // 基本操作
  'Space': 'アクション実行（クリック相当）',
  'Enter': 'アクション実行（クリック相当）',
  'Escape': '前の画面に戻る',
  
  // ナビゲーション
  'ArrowKeys': '要素間移動',
  'Tab': '次の要素へ移動',
  'Shift+Tab': '前の要素へ移動',
  'Home': '最初の要素へ',
  'End': '最後の要素へ',
  
  // ゲーム制御
  'P': 'ゲーム一時停止/再開',
  'H': 'ヘルプ表示',
  'R': 'リスタート',
  
  // アクセシビリティ
  'Alt+1': 'メインコンテンツへジャンプ',
  'Alt+2': 'ナビゲーションへジャンプ',
  'Alt+3': 'サイドバーへジャンプ',
  
  // 緊急時
  'Ctrl+Alt+H': 'ヘルプとアクセシビリティ設定'
};

class ShortcutManager {
  private shortcuts: Map<string, () => void> = new Map();
  
  constructor() {
    this.initializeShortcuts();
    document.addEventListener('keydown', this.handleShortcut.bind(this));
  }
  
  private initializeShortcuts(): void {
    this.shortcuts.set('KeyP', this.togglePause.bind(this));
    this.shortcuts.set('KeyH', this.showHelp.bind(this));
    this.shortcuts.set('KeyR', this.restart.bind(this));
    
    // アクセシビリティ設定（Alt + キー）
    this.shortcuts.set('Alt+Digit1', () => this.jumpToLandmark('main'));
    this.shortcuts.set('Alt+Digit2', () => this.jumpToLandmark('navigation'));
    this.shortcuts.set('Alt+Digit3', () => this.jumpToLandmark('complementary'));
  }
  
  private handleShortcut(event: KeyboardEvent): void {
    const key = this.getKeyCombo(event);
    const action = this.shortcuts.get(key);
    
    if (action) {
      event.preventDefault();
      action();
      
      // ショートカット実行をアナウンス
      this.announceShortcut(key);
    }
  }
  
  private getKeyCombo(event: KeyboardEvent): string {
    const modifiers = [];
    if (event.ctrlKey) modifiers.push('Ctrl');
    if (event.altKey) modifiers.push('Alt');
    if (event.shiftKey) modifiers.push('Shift');
    
    const key = event.code;
    return modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key;
  }
  
  private togglePause(): void {
    const pauseButton = document.querySelector('[aria-label*="一時停止"], [aria-label*="再開"]') as HTMLElement;
    pauseButton?.click();
  }
  
  private showHelp(): void {
    const helpButton = document.querySelector('[aria-label*="ヘルプ"]') as HTMLElement;
    helpButton?.click();
  }
  
  private restart(): void {
    const restartButton = document.querySelector('[aria-label*="リスタート"], [aria-label*="最初から"]') as HTMLElement;
    restartButton?.click();
  }
  
  private jumpToLandmark(landmark: string): void {
    const element = document.querySelector(`[role="${landmark}"]`) as HTMLElement;
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  private announceShortcut(key: string): void {
    const descriptions = {
      'KeyP': 'ゲームを一時停止しました',
      'KeyH': 'ヘルプを表示しました',
      'KeyR': 'ゲームを最初から始めます',
      'Alt+Digit1': 'メインコンテンツに移動しました',
      'Alt+Digit2': 'ナビゲーションに移動しました',
      'Alt+Digit3': 'サイドバーに移動しました'
    };
    
    const message = descriptions[key as keyof typeof descriptions];
    if (message) {
      this.announce(message);
    }
  }
  
  private announce(message: string): void {
    const announcer = document.getElementById('polite-announcements');
    if (announcer) {
      announcer.textContent = message;
    }
  }
}
```

### 3. 音声認識・制御

#### 3.1 ブラウザ音声認識API

```typescript
// 子ども向け音声コマンド認識
class ChildVoiceController {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private commands: Map<string, () => void> = new Map();
  
  constructor() {
    this.initializeSpeechRecognition();
    this.setupCommands();
  }
  
  private initializeSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new SpeechRecognition();
    }
    
    if (this.recognition) {
      this.recognition.lang = 'ja-JP';
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 3;
      
      this.recognition.onresult = this.handleVoiceResult.bind(this);
      this.recognition.onerror = this.handleVoiceError.bind(this);
      this.recognition.onend = this.handleVoiceEnd.bind(this);
    }
  }
  
  private setupCommands(): void {
    // 基本操作
    this.commands.set('スタート', () => this.clickElement('[aria-label*="はじめよう"], [aria-label*="スタート"]'));
    this.commands.set('始める', () => this.clickElement('[aria-label*="はじめよう"], [aria-label*="スタート"]'));
    this.commands.set('ストップ', () => this.clickElement('[aria-label*="停止"], [aria-label*="ストップ"]'));
    this.commands.set('一時停止', () => this.clickElement('[aria-label*="一時停止"]'));
    
    // ゲーム操作
    this.commands.set('星を取る', () => this.clickElement('[aria-label*="星"]'));
    this.commands.set('宝箱を開ける', () => this.clickElement('[aria-label*="宝箱"]'));
    this.commands.set('次へ', () => this.clickElement('[aria-label*="次へ"], [aria-label*="つぎ"]'));
    this.commands.set('前へ', () => this.clickElement('[aria-label*="前へ"], [aria-label*="まえ"]'));
    
    // ヘルプとアクセシビリティ
    this.commands.set('ヘルプ', () => this.clickElement('[aria-label*="ヘルプ"]'));
    this.commands.set('設定', () => this.clickElement('[aria-label*="設定"]'));
    this.commands.set('音量を上げて', () => this.adjustVolume(10));
    this.commands.set('音量を下げて', () => this.adjustVolume(-10));
    this.commands.set('音を消して', () => this.muteAudio());
    
    // 数字による選択
    for (let i = 1; i <= 10; i++) {
      this.commands.set(`${i}番`, () => this.selectByNumber(i));
      this.commands.set(`${i}番目`, () => this.selectByNumber(i));
    }
  }
  
  private handleVoiceResult(event: SpeechRecognitionEvent): void {
    const results = Array.from(event.results);
    const lastResult = results[results.length - 1];
    
    if (lastResult.isFinal) {
      const transcript = lastResult[0].transcript.trim();
      this.processVoiceCommand(transcript);
    }
  }
  
  private processVoiceCommand(transcript: string): void {
    // 複数の候補を試す
    const normalizedTranscript = transcript.toLowerCase().replace(/[。、！？]/g, '');
    
    // 完全一致
    if (this.commands.has(normalizedTranscript)) {
      this.commands.get(normalizedTranscript)!();
      this.announceCommandExecuted(normalizedTranscript);
      return;
    }
    
    // 部分一致
    for (const [command, action] of this.commands.entries()) {
      if (normalizedTranscript.includes(command.toLowerCase())) {
        action();
        this.announceCommandExecuted(command);
        return;
      }
    }
    
    // コマンドが認識されなかった場合
    this.announceCommandNotRecognized(transcript);
  }
  
  private clickElement(selector: string): void {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.click();
      element.focus();
    }
  }
  
  private selectByNumber(number: number): void {
    const buttons = document.querySelectorAll('button, [role="button"]');
    if (buttons[number - 1]) {
      (buttons[number - 1] as HTMLElement).click();
    }
  }
  
  private adjustVolume(delta: number): void {
    const volumeSlider = document.querySelector('input[type="range"][aria-label*="音量"]') as HTMLInputElement;
    if (volumeSlider) {
      const currentValue = parseInt(volumeSlider.value);
      volumeSlider.value = Math.max(0, Math.min(100, currentValue + delta)).toString();
      volumeSlider.dispatchEvent(new Event('change'));
    }
  }
  
  private muteAudio(): void {
    const muteButton = document.querySelector('[aria-label*="音を消す"], [aria-label*="ミュート"]') as HTMLElement;
    muteButton?.click();
  }
  
  private announceCommandExecuted(command: string): void {
    this.announce(`${command} を実行しました`);
  }
  
  private announceCommandNotRecognized(transcript: string): void {
    this.announce(`「${transcript}」は認識できませんでした。「ヘルプ」と言うとコマンド一覧を聞けます。`);
  }
  
  private handleVoiceError(event: SpeechRecognitionErrorEvent): void {
    console.error('音声認識エラー:', event.error);
    
    const errorMessages = {
      'no-speech': '音声が認識されませんでした。もう一度お話しください。',
      'audio-capture': 'マイクが利用できません。設定を確認してください。',
      'not-allowed': '音声認識の許可が必要です。',
      'network': 'ネットワークエラーが発生しました。'
    };
    
    const message = errorMessages[event.error as keyof typeof errorMessages] || '音声認識でエラーが発生しました。';
    this.announce(message);
  }
  
  private handleVoiceEnd(): void {
    if (this.isListening) {
      // 自動的に再開
      setTimeout(() => {
        this.startListening();
      }, 1000);
    }
  }
  
  public startListening(): void {
    if (this.recognition && !this.isListening) {
      this.isListening = true;
      this.recognition.start();
      this.announce('音声コマンドを聞いています');
    }
  }
  
  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
      this.announce('音声コマンドを停止しました');
    }
  }
  
  private announce(message: string): void {
    const announcer = document.getElementById('polite-announcements');
    if (announcer) {
      announcer.textContent = message;
    }
  }
}
```

### 4. スイッチコントロール

#### 4.1 シングルスイッチ対応

```typescript
// スイッチコントロール対応
class SwitchController {
  private scanningMode: boolean = false;
  private scanIndex: number = 0;
  private scanInterval: NodeJS.Timeout | null = null;
  private scanSpeed: number = 1000; // ミリ秒
  private scanElements: HTMLElement[] = [];
  
  constructor() {
    this.initializeSwitchControl();
    this.setupScanElements();
  }
  
  private initializeSwitchControl(): void {
    // スイッチ入力の監視（キーボード、ゲームパッド、外部デバイス）
    document.addEventListener('keydown', this.handleSwitchInput.bind(this));
    
    // ゲームパッド対応
    window.addEventListener('gamepadconnected', this.setupGamepad.bind(this));
    
    // 外部スイッチデバイス対応（WebHID API）
    if ('hid' in navigator) {
      this.setupHIDDevices();
    }
  }
  
  private setupScanElements(): void {
    // スキャン対象要素の更新
    const selector = [
      'button:not([disabled])',
      '[role="button"]:not([disabled])',
      'input:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    this.scanElements = Array.from(
      document.querySelectorAll(selector)
    ) as HTMLElement[];
    
    // 要素に番号を付ける
    this.scanElements.forEach((element, index) => {
      element.setAttribute('data-scan-index', index.toString());
    });
  }
  
  private handleSwitchInput(event: KeyboardEvent): void {
    // スイッチ入力として認識するキー
    const switchKeys = ['Space', 'Enter', 'NumpadEnter'];
    
    if (switchKeys.includes(event.code)) {
      event.preventDefault();
      
      if (!this.scanningMode) {
        this.startScanning();
      } else {
        this.selectCurrentElement();
      }
    }
    
    // ESCでスキャン停止
    if (event.code === 'Escape' && this.scanningMode) {
      this.stopScanning();
    }
  }
  
  private startScanning(): void {
    this.scanningMode = true;
    this.scanIndex = 0;
    
    this.announce('スキャンを開始します');
    
    this.scanInterval = setInterval(() => {
      this.highlightCurrentElement();
      this.scanIndex = (this.scanIndex + 1) % this.scanElements.length;
    }, this.scanSpeed);
  }
  
  private stopScanning(): void {
    this.scanningMode = false;
    
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
    
    // ハイライトを削除
    this.scanElements.forEach(element => {
      element.classList.remove('scan-highlight');
    });
    
    this.announce('スキャンを停止しました');
  }
  
  private highlightCurrentElement(): void {
    // 前のハイライトを削除
    this.scanElements.forEach(element => {
      element.classList.remove('scan-highlight');
    });
    
    // 現在の要素をハイライト
    const currentElement = this.scanElements[this.scanIndex];
    if (currentElement) {
      currentElement.classList.add('scan-highlight');
      
      // 要素の説明を読み上げ
      const description = this.getElementDescription(currentElement);
      this.announce(description, 'polite');
      
      // 画面に表示させる
      currentElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }
  
  private selectCurrentElement(): void {
    const currentElement = this.scanElements[this.scanIndex];
    if (currentElement) {
      this.stopScanning();
      
      // 要素をクリック
      currentElement.click();
      currentElement.focus();
      
      const description = this.getElementDescription(currentElement);
      this.announce(`${description} を選択しました`);
    }
  }
  
  private getElementDescription(element: HTMLElement): string {
    const label = element.getAttribute('aria-label') || 
                  element.textContent?.trim() || 
                  '要素';
    
    const role = element.getAttribute('role') || element.tagName.toLowerCase();
    
    return `${label} ${role === 'button' ? 'ボタン' : role}`;
  }
  
  private setupGamepad(): void {
    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      
      for (const gamepad of gamepads) {
        if (gamepad) {
          // ボタン0（通常はAボタン）をスイッチとして使用
          if (gamepad.buttons[0]?.pressed) {
            this.handleSwitchInput(new KeyboardEvent('keydown', { code: 'Space' }));
          }
        }
      }
      
      requestAnimationFrame(checkGamepad);
    };
    
    checkGamepad();
  }
  
  private async setupHIDDevices(): void {
    try {
      // スイッチデバイスの検出と設定
      const devices = await (navigator as any).hid.getDevices();
      
      devices.forEach((device: any) => {
        if (this.isSwitchDevice(device)) {
          this.connectSwitchDevice(device);
        }
      });
    } catch (error) {
      console.warn('HIDデバイスの設定に失敗しました:', error);
    }
  }
  
  private isSwitchDevice(device: any): boolean {
    // 一般的なスイッチデバイスのベンダーID/プロダクトIDをチェック
    const switchDeviceIds = [
      { vendorId: 0x1234, productId: 0x5678 }, // 例：某スイッチデバイス
    ];
    
    return switchDeviceIds.some(id => 
      device.vendorId === id.vendorId && device.productId === id.productId
    );
  }
  
  private async connectSwitchDevice(device: any): Promise<void> {
    try {
      await device.open();
      
      device.addEventListener('inputreport', (event: any) => {
        // スイッチの押下を検出
        const data = new Uint8Array(event.data.buffer);
        if (data[0] === 1) { // スイッチが押された
          this.handleSwitchInput(new KeyboardEvent('keydown', { code: 'Space' }));
        }
      });
      
      this.announce('スイッチデバイスが接続されました');
    } catch (error) {
      console.error('スイッチデバイスの接続に失敗しました:', error);
    }
  }
  
  public setScanSpeed(speed: number): void {
    this.scanSpeed = Math.max(500, Math.min(3000, speed));
    
    if (this.scanningMode) {
      this.stopScanning();
      this.startScanning();
    }
  }
  
  private announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcerId = priority === 'assertive' ? 'urgent-announcements' : 'polite-announcements';
    const announcer = document.getElementById(announcerId);
    
    if (announcer) {
      announcer.textContent = message;
    }
  }
}
```

### 5. アイトラッキング（視線追跡）

#### 5.1 WebGazer.js統合

```typescript
// アイトラッキング制御
class EyeTrackingController {
  private isInitialized: boolean = false;
  private gazeData: { x: number; y: number; timestamp: number }[] = [];
  private dwellTime: number = 1000; // ミリ秒
  private dwellThreshold: number = 50; // ピクセル
  private currentDwellElement: HTMLElement | null = null;
  private dwellStartTime: number = 0;
  
  constructor() {
    this.initializeEyeTracking();
  }
  
  private async initializeEyeTracking(): Promise<void> {
    try {
      // WebGazer.jsの初期化
      await this.loadWebGazer();
      
      if (typeof webgazer !== 'undefined') {
        await webgazer
          .setRegression('ridge')
          .setTracker('clmtrackr')
          .setGazeListener(this.handleGazeData.bind(this))
          .begin();
        
        // キャリブレーション
        await this.runCalibration();
        
        this.isInitialized = true;
        this.announce('アイトラッキングが開始されました');
      }
    } catch (error) {
      console.error('アイトラッキングの初期化に失敗しました:', error);
      this.announce('アイトラッキングを利用できません');
    }
  }
  
  private loadWebGazer(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof webgazer !== 'undefined') {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://webgazer.cs.brown.edu/webgazer.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('WebGazer.jsの読み込みに失敗しました'));
      document.head.appendChild(script);
    });
  }
  
  private async runCalibration(): Promise<void> {
    // 子ども向けの楽しいキャリブレーション
    const calibrationPoints = [
      { x: 0.1, y: 0.1 }, // 左上
      { x: 0.9, y: 0.1 }, // 右上
      { x: 0.5, y: 0.5 }, // 中央
      { x: 0.1, y: 0.9 }, // 左下
      { x: 0.9, y: 0.9 }, // 右下
    ];
    
    this.announce('目の動きを覚えるよ！星を見つめてね');
    
    for (const point of calibrationPoints) {
      await this.calibratePoint(point);
    }
    
    this.announce('キャリブレーション完了！これで目で操作できるよ');
  }
  
  private calibratePoint(point: { x: number; y: number }): Promise<void> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        pointer-events: none;
      `;
      
      const star = document.createElement('div');
      star.innerHTML = '⭐';
      star.style.cssText = `
        position: absolute;
        left: ${point.x * 100}%;
        top: ${point.y * 100}%;
        transform: translate(-50%, -50%);
        font-size: 4rem;
        animation: twinkle 0.5s ease-in-out infinite alternate;
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes twinkle {
          0% { transform: translate(-50%, -50%) scale(1); }
          100% { transform: translate(-50%, -50%) scale(1.2); }
        }
      `;
      
      document.head.appendChild(style);
      overlay.appendChild(star);
      document.body.appendChild(overlay);
      
      // 2秒間データを収集
      setTimeout(() => {
        document.body.removeChild(overlay);
        document.head.removeChild(style);
        resolve();
      }, 2000);
    });
  }
  
  private handleGazeData(data: any, elapsedTime: number): void {
    if (!data || !this.isInitialized) return;
    
    const gazePoint = { x: data.x, y: data.y, timestamp: elapsedTime };
    this.gazeData.push(gazePoint);
    
    // 古いデータを削除（5秒以上前）
    const cutoffTime = elapsedTime - 5000;
    this.gazeData = this.gazeData.filter(point => point.timestamp > cutoffTime);
    
    // 要素の視線検出
    this.detectGazeOnElements(gazePoint);
  }
  
  private detectGazeOnElements(gazePoint: { x: number; y: number; timestamp: number }): void {
    const element = document.elementFromPoint(gazePoint.x, gazePoint.y) as HTMLElement;
    
    if (!element) return;
    
    // インタラクティブ要素かチェック
    const isInteractive = element.matches('button, [role="button"], input, a[href], [tabindex]:not([tabindex="-1"])');
    
    if (isInteractive) {
      this.handleElementGaze(element, gazePoint);
    } else {
      this.resetDwell();
    }
  }
  
  private handleElementGaze(element: HTMLElement, gazePoint: { x: number; y: number; timestamp: number }): void {
    if (element !== this.currentDwellElement) {
      // 新しい要素
      this.currentDwellElement = element;
      this.dwellStartTime = gazePoint.timestamp;
      this.highlightElement(element);
      
      const description = this.getElementDescription(element);
      this.announce(`${description} を見ています`, 'polite');
    } else {
      // 同じ要素を見続けている
      const dwellDuration = gazePoint.timestamp - this.dwellStartTime;
      
      if (dwellDuration >= this.dwellTime) {
        this.activateElement(element);
        this.resetDwell();
      } else {
        // 進捗表示
        this.updateDwellProgress(element, dwellDuration / this.dwellTime);
      }
    }
  }
  
  private highlightElement(element: HTMLElement): void {
    // 前のハイライトを削除
    document.querySelectorAll('.gaze-highlight').forEach(el => {
      el.classList.remove('gaze-highlight');
    });
    
    // 新しい要素をハイライト
    element.classList.add('gaze-highlight');
  }
  
  private updateDwellProgress(element: HTMLElement, progress: number): void {
    let progressIndicator = element.querySelector('.gaze-progress') as HTMLElement;
    
    if (!progressIndicator) {
      progressIndicator = document.createElement('div');
      progressIndicator.className = 'gaze-progress';
      progressIndicator.style.cssText = `
        position: absolute;
        top: -5px;
        left: 0;
        height: 5px;
        background: linear-gradient(90deg, #4caf50 0%, #4caf50 ${progress * 100}%, transparent ${progress * 100}%);
        width: 100%;
        border-radius: 3px;
        z-index: 1000;
      `;
      element.style.position = 'relative';
      element.appendChild(progressIndicator);
    } else {
      progressIndicator.style.background = `linear-gradient(90deg, #4caf50 0%, #4caf50 ${progress * 100}%, transparent ${progress * 100}%)`;
    }
  }
  
  private activateElement(element: HTMLElement): void {
    element.click();
    element.focus();
    
    const description = this.getElementDescription(element);
    this.announce(`${description} を選択しました`);
  }
  
  private resetDwell(): void {
    this.currentDwellElement = null;
    this.dwellStartTime = 0;
    
    // ハイライトと進捗を削除
    document.querySelectorAll('.gaze-highlight').forEach(el => {
      el.classList.remove('gaze-highlight');
    });
    
    document.querySelectorAll('.gaze-progress').forEach(el => {
      el.remove();
    });
  }
  
  private getElementDescription(element: HTMLElement): string {
    const label = element.getAttribute('aria-label') || 
                  element.textContent?.trim() || 
                  '要素';
    
    const role = element.getAttribute('role') || element.tagName.toLowerCase();
    
    return `${label} ${role === 'button' ? 'ボタン' : role}`;
  }
  
  public setDwellTime(time: number): void {
    this.dwellTime = Math.max(500, Math.min(3000, time));
  }
  
  public startEyeTracking(): void {
    if (typeof webgazer !== 'undefined') {
      webgazer.resume();
      this.announce('アイトラッキングを開始しました');
    }
  }
  
  public stopEyeTracking(): void {
    if (typeof webgazer !== 'undefined') {
      webgazer.pause();
      this.resetDwell();
      this.announce('アイトラッキングを停止しました');
    }
  }
  
  private announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcerId = priority === 'assertive' ? 'urgent-announcements' : 'polite-announcements';
    const announcer = document.getElementById(announcerId);
    
    if (announcer) {
      announcer.textContent = message;
    }
  }
}
```

## テスト仕様

### 自動テスト

```typescript
// 支援技術対応の自動テスト
describe('Assistive Technology Support', () => {
  describe('Screen Reader Support', () => {
    test('should have proper ARIA labels', async () => {
      const { container } = render(<MouseFriendGame onComplete={jest.fn()} />);
      
      // すべてのインタラクティブ要素にラベルがあることを確認
      const interactiveElements = container.querySelectorAll(
        'button, input, [role="button"], [role="link"]'
      );
      
      interactiveElements.forEach(element => {
        const hasLabel = element.hasAttribute('aria-label') || 
                         element.hasAttribute('aria-labelledby') ||
                         element.textContent?.trim();
        expect(hasLabel).toBeTruthy();
      });
    });
    
    test('should announce state changes', async () => {
      const { container } = render(<MouseFriendGame onComplete={jest.fn()} />);
      
      const liveRegion = container.querySelector('[aria-live]');
      expect(liveRegion).toBeInTheDocument();
      
      // ゲーム開始
      const startButton = screen.getByRole('button', { name: /はじめよう/ });
      await user.click(startButton);
      
      // 状態変化のアナウンスを確認
      await waitFor(() => {
        expect(liveRegion).toHaveTextContent(/ゲーム|開始|スタート/);
      });
    });
  });
  
  describe('Keyboard Navigation', () => {
    test('should support tab navigation', async () => {
      render(<MouseFriendGame onComplete={jest.fn()} />);
      
      const firstButton = screen.getByRole('button', { name: /はじめよう/ });
      firstButton.focus();
      
      // Tab キーで次の要素に移動
      await user.keyboard('{Tab}');
      expect(document.activeElement).not.toBe(firstButton);
      
      // フォーカスが見える状態になっていることを確認
      expect(document.activeElement).toHaveClass(/focus/);
    });
    
    test('should support arrow key navigation in game area', async () => {
      render(<MouseFriendGame onComplete={jest.fn()} />);
      
      const gameArea = screen.getByRole('application');
      gameArea.focus();
      
      // 矢印キーでナビゲーション
      await user.keyboard('{ArrowRight}');
      // フォーカスが移動したことを確認
      expect(document.activeElement).toBeInstanceOf(HTMLElement);
    });
  });
  
  describe('Voice Commands', () => {
    test('should process voice commands', () => {
      const controller = new ChildVoiceController();
      
      // モックの音声入力をシミュレート
      const mockResult = {
        results: [[{ transcript: 'スタート', confidence: 0.9 }]],
        resultIndex: 0
      };
      
      controller['processVoiceCommand']('スタート');
      
      // スタートボタンがクリックされることを確認
      const startButton = screen.queryByRole('button', { name: /はじめよう|スタート/ });
      expect(startButton).toHaveBeenClicked();
    });
  });
  
  describe('Switch Control', () => {
    test('should support switch scanning', async () => {
      const controller = new SwitchController();
      
      // スキャン開始
      const spaceKeyEvent = new KeyboardEvent('keydown', { code: 'Space' });
      document.dispatchEvent(spaceKeyEvent);
      
      // スキャンが開始されることを確認
      await waitFor(() => {
        const highlightedElement = document.querySelector('.scan-highlight');
        expect(highlightedElement).toBeInTheDocument();
      });
    });
  });
});
```

### 手動テスト計画

#### スクリーンリーダーテスト
1. **NVDA での基本操作**
   - ページ読み込み時の情報読み上げ
   - ナビゲーション構造の理解
   - ゲーム要素の状態変化アナウンス

2. **VoiceOver での操作**
   - ローター機能での要素検索
   - ジェスチャーナビゲーション
   - フォーカス管理の動作

#### キーボードテスト
1. **基本ナビゲーション**
   - Tab順序の論理性
   - すべての機能へのキーボードアクセス
   - フォーカス表示の明確性

2. **ゲーム操作**
   - 矢印キーでのゲーム要素選択
   - Enter/Space での要素アクティベート
   - Escape での操作キャンセル

## パフォーマンス最適化

### 支援技術向け最適化

```typescript
// パフォーマンス監視と最適化
class AssistiveTechPerformanceMonitor {
  private announcements: string[] = [];
  private lastAnnouncementTime: number = 0;
  private debounceTime: number = 100;
  
  constructor() {
    this.setupPerformanceMonitoring();
  }
  
  private setupPerformanceMonitoring(): void {
    // スクリーンリーダーのパフォーマンス監視
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        if (entry.entryType === 'measure' && entry.name.includes('screen-reader')) {
          if (entry.duration > 100) { // 100ms以上は遅い
            console.warn(`スクリーンリーダー応答が遅い: ${entry.name} - ${entry.duration}ms`);
          }
        }
      });
    });
    
    observer.observe({ entryTypes: ['measure'] });
  }
  
  public optimizeAnnouncement(message: string): void {
    const now = Date.now();
    
    // 短期間での重複アナウンスを防ぐ
    if (now - this.lastAnnouncementTime < this.debounceTime) {
      return;
    }
    
    // 冗長なアナウンスを削除
    const optimizedMessage = this.deduplicateMessage(message);
    
    if (optimizedMessage) {
      this.announcements.push(optimizedMessage);
      this.lastAnnouncementTime = now;
      
      // バッチ処理でアナウンス
      this.scheduleAnnouncement(optimizedMessage);
    }
  }
  
  private deduplicateMessage(message: string): string | null {
    // 直前の同じメッセージは省略
    const lastMessage = this.announcements[this.announcements.length - 1];
    if (lastMessage === message) {
      return null;
    }
    
    // 類似メッセージの統合
    if (lastMessage && this.isSimilarMessage(lastMessage, message)) {
      return this.mergeMessages(lastMessage, message);
    }
    
    return message;
  }
  
  private isSimilarMessage(message1: string, message2: string): boolean {
    // 単語の50%以上が共通している場合は類似とみなす
    const words1 = message1.split(' ');
    const words2 = message2.split(' ');
    
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length) > 0.5;
  }
  
  private mergeMessages(message1: string, message2: string): string {
    // より情報量の多いメッセージを選択
    return message1.length > message2.length ? message1 : message2;
  }
  
  private scheduleAnnouncement(message: string): void {
    // ブラウザの次のフレームでアナウンス
    requestAnimationFrame(() => {
      const announcer = document.getElementById('polite-announcements');
      if (announcer) {
        announcer.textContent = message;
      }
    });
  }
}
```

## 継続的改善

### フィードバック収集
- ユーザーテストの定期実施
- 支援技術コミュニティとの連携
- 専門機関からの評価

### 技術動向への対応
- 新しい支援技術の評価
- ブラウザAPI の更新対応
- WCAG の新版への準拠

### メンテナンス計画
- 月次: 基本機能テスト
- 四半期: 包括的監査
- 年次: 外部評価

---

**承認**: プロダクトオーナー、アクセシビリティ専門家  
**実装責任**: フロントエンド開発チーム  
**テスト責任**: QA チーム + 支援技術ユーザー  
**次回更新**: 2025年9月30日