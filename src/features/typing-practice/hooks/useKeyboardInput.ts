import { useCallback, useEffect } from "react";

interface UseKeyboardInputOptions {
  onKeyPress: (key: string) => void;
  onKeyDown?: (key: string) => void;
  enabled?: boolean;
}

/**
 * キーボード入力を処理するカスタムフック
 * タイピングゲームに特化した入力処理を提供
 */
export function useKeyboardInput({
  onKeyPress,
  onKeyDown,
  enabled = true,
}: UseKeyboardInputOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // 印刷可能文字とスペースキーのみを処理
      if (e.key.length === 1 || e.key === " ") {
        // デフォルトの動作を防ぐ（ページスクロールなど）
        e.preventDefault();

        onKeyDown?.(e.key);
        onKeyPress(e.key);
      }
    },
    [enabled, onKeyPress, onKeyDown],
  );

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // keydownとの重複を避けるため、keypressでは追加処理のみ
      if (e.key.length === 1 || e.key === " ") {
        e.preventDefault();
      }
    },
    [enabled],
  );

  useEffect(() => {
    if (!enabled) return;

    // フォーカスを確保
    document.body.focus();
    document.body.tabIndex = -1;

    // イベントリスナーを追加
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keypress", handleKeyPress);
      document.body.removeAttribute("tabindex");
    };
  }, [handleKeyDown, handleKeyPress, enabled]);

  // フォーカス確保のためのユーティリティ関数
  const ensureFocus = useCallback(() => {
    if (enabled) {
      document.body.focus();
    }
  }, [enabled]);

  return {
    ensureFocus,
  };
}
