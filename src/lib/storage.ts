/**
 * LocalStorage管理ユーティリティ
 * 型安全性とエラーハンドリングを提供
 */

// ストレージキーの定数定義
export const STORAGE_KEYS = {
  PLAYER_PROGRESS: "myfir-player-progress",
  TYPING_COMPLETED_LESSONS: "myfir-typing-completed-lessons",
  TYPING_RECENT_STATS: "myfir-typing-recent-stats",
  USER_SETTINGS: "myfir-user-settings",
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * LocalStorageへの安全な書き込み
 */
export function setStorageItem<T>(key: StorageKey, value: T): boolean {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.warn(`Failed to save to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * LocalStorageからの安全な読み込み
 */
export function getStorageItem<T>(key: StorageKey): T | null;
export function getStorageItem<T>(key: StorageKey, defaultValue: T): T;
export function getStorageItem<T>(key: StorageKey, defaultValue?: T): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue ?? null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Failed to read from localStorage (${key}):`, error);
    return defaultValue ?? null;
  }
}

/**
 * LocalStorageからアイテムを削除
 */
export function removeStorageItem(key: StorageKey): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove from localStorage (${key}):`, error);
    return false;
  }
}

/**
 * LocalStorageをクリア
 */
export function clearStorage(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.warn("Failed to clear localStorage:", error);
    return false;
  }
}

/**
 * ストレージ容量をチェック
 */
export function getStorageInfo(): {
  isAvailable: boolean;
  usedSpace: number;
  totalSpace: number;
} {
  if (typeof localStorage === "undefined") {
    return { isAvailable: false, usedSpace: 0, totalSpace: 0 };
  }

  try {
    // 使用容量を計算
    let usedSpace = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        usedSpace += key.length + (value?.length || 0);
      }
    }

    // 総容量の推定（実際の制限を正確に取得するのは困難）
    const totalSpace = 5 * 1024 * 1024; // 5MB（一般的な制限）

    return {
      isAvailable: true,
      usedSpace,
      totalSpace,
    };
  } catch (error) {
    console.warn("Failed to get storage info:", error);
    return { isAvailable: false, usedSpace: 0, totalSpace: 0 };
  }
}

/**
 * ストレージ変更を監視するためのイベントリスナー
 */
export function addStorageListener(
  key: StorageKey,
  callback: (newValue: string | null, oldValue: string | null) => void,
): () => void {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === key) {
      callback(e.newValue, e.oldValue);
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}

/**
 * データバックアップ機能
 */
export function exportStorageData(): string {
  try {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("myfir-")) {
        const value = localStorage.getItem(key);
        if (value) {
          data[key] = value;
        }
      }
    }
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Failed to export storage data:", error);
    throw new Error("データのエクスポートに失敗しました");
  }
}

/**
 * データインポート機能
 */
export function importStorageData(dataString: string): boolean {
  try {
    const data = JSON.parse(dataString) as Record<string, string>;

    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith("myfir-") && Object.values(STORAGE_KEYS).includes(key as StorageKey)) {
        localStorage.setItem(key, value);
      }
    }

    return true;
  } catch (error) {
    console.error("Failed to import storage data:", error);
    return false;
  }
}

/**
 * 開発用：ストレージの内容をデバッグ表示
 */
export function debugStorage(): void {
  if (process.env.NODE_ENV === "development") {
    console.group("LocalStorage Debug");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("myfir-")) {
        const value = localStorage.getItem(key);
        console.log(`${key}:`, value);
      }
    }
    console.groupEnd();
  }
}
