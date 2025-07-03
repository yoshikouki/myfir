/**
 * メモ化とパフォーマンス最適化ユーティリティ
 * 子ども向けアプリケーション用の軽量化された実装
 */

// 単純なLRUキャッシュ実装
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private readonly maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // アクセスしたアイテムを最新にするため、削除して再追加
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return undefined;
  }

  set(key: K, value: V): void {
    // 既存のキーの場合は削除してから再追加
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // 最古のアイテムを削除
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// 関数の結果をメモ化するヘルパー
export function memoize<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  options: {
    maxSize?: number;
    ttl?: number; // Time to live in milliseconds
    keyGenerator?: (...args: TArgs) => string;
  } = {},
): (...args: TArgs) => TReturn {
  const { maxSize = 50, ttl, keyGenerator } = options;
  const cache = new LRUCache<string, { value: TReturn; timestamp?: number }>(maxSize);

  const defaultKeyGenerator = (...args: TArgs): string => {
    return JSON.stringify(args);
  };

  const getKey = keyGenerator || defaultKeyGenerator;

  return (...args: TArgs): TReturn => {
    const key = getKey(...args);
    const cached = cache.get(key);

    // TTLチェック
    if (cached && ttl) {
      const now = Date.now();
      if (cached.timestamp && now - cached.timestamp > ttl) {
        cache.clear(); // 簡単のため全削除（実際はキーごとに管理すべき）
      } else if (cached) {
        return cached.value;
      }
    } else if (cached) {
      return cached.value;
    }

    // キャッシュにない場合は計算
    const result = fn(...args);
    cache.set(key, {
      value: result,
      timestamp: ttl ? Date.now() : undefined,
    });

    return result;
  };
}

// 非同期関数のメモ化
export function memoizeAsync<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: {
    maxSize?: number;
    ttl?: number;
    keyGenerator?: (...args: TArgs) => string;
  } = {},
): (...args: TArgs) => Promise<TReturn> {
  const { maxSize = 50, ttl, keyGenerator } = options;
  const cache = new LRUCache<string, { promise: Promise<TReturn>; timestamp?: number }>(
    maxSize,
  );

  const defaultKeyGenerator = (...args: TArgs): string => {
    return JSON.stringify(args);
  };

  const getKey = keyGenerator || defaultKeyGenerator;

  return async (...args: TArgs): Promise<TReturn> => {
    const key = getKey(...args);
    const cached = cache.get(key);

    // TTLチェック
    if (cached && ttl) {
      const now = Date.now();
      if (cached.timestamp && now - cached.timestamp > ttl) {
        cache.clear();
      } else {
        return cached.promise;
      }
    } else if (cached) {
      return cached.promise;
    }

    // キャッシュにない場合は計算
    const promise = fn(...args);
    cache.set(key, {
      promise,
      timestamp: ttl ? Date.now() : undefined,
    });

    return promise;
  };
}

// デバウンス関数
export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delay: number,
): (...args: TArgs) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: TArgs) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

// スロットル関数
export function throttle<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  limit: number,
): (...args: TArgs) => void {
  let inThrottle = false;

  return (...args: TArgs) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// 重い計算を分割して実行するヘルパー
export function createChunkedProcessor<T, R>(
  processor: (item: T) => R,
  chunkSize: number = 10,
  delay: number = 5,
) {
  return async function processChunked(items: T[]): Promise<R[]> {
    const results: R[] = [];

    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      const chunkResults = chunk.map(processor);
      results.push(...chunkResults);

      // 次のチャンクの前に少し待機（UIがブロックされるのを防ぐ）
      if (i + chunkSize < items.length) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    return results;
  };
}

// requestIdleCallback のポリフィル
const idleCallback =
  typeof requestIdleCallback !== "undefined"
    ? requestIdleCallback
    : (fn: () => void) => setTimeout(fn, 1);

const cancelIdleCallbackFn =
  typeof cancelIdleCallback !== "undefined" ? cancelIdleCallback : clearTimeout;

// アイドル時間に実行する関数
export function runWhenIdle(fn: () => void): () => void {
  const id = idleCallback(fn);
  return () => cancelIdleCallbackFn(id as number);
}

// 画像のプリロード
export function preloadImages(urls: string[]): Promise<undefined[]> {
  const promises = urls.map((url) => {
    return new Promise<undefined>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(undefined);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  });

  return Promise.all(promises);
}

// リソースのプリロード
export function preloadResource(
  url: string,
  as: "script" | "style" | "image" | "font" = "script",
): void {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = url;
  link.as = as;

  if (as === "font") {
    link.crossOrigin = "anonymous";
  }

  document.head.appendChild(link);
}

// WeakMap を使った効率的なオブジェクトキャッシュ
export class WeakObjectCache<K extends object, V> {
  private cache = new WeakMap<K, V>();

  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  set(key: K, value: V): void {
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }
}

// React 向けのメモ化ヘルパー
export function createMemoizedSelector<TState, TResult>(
  selector: (state: TState) => TResult,
  equalityFn?: (a: TResult, b: TResult) => boolean,
) {
  let lastState: TState | undefined;
  let lastResult: TResult;

  const defaultEqualityFn = (a: TResult, b: TResult): boolean => {
    return Object.is(a, b);
  };

  const isEqual = equalityFn || defaultEqualityFn;

  return (state: TState): TResult => {
    if (lastState === undefined || lastState !== state) {
      const newResult = selector(state);

      if (lastState === undefined || !isEqual(lastResult, newResult)) {
        lastResult = newResult;
      }

      lastState = state;
    }

    return lastResult;
  };
}

// 開発時のパフォーマンス監視
export function withPerformanceLogging<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  label: string,
): (...args: TArgs) => TReturn {
  if (process.env.NODE_ENV !== "development") {
    return fn;
  }

  return (...args: TArgs): TReturn => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();

    if (end - start > 5) {
      // 5ms以上の場合のみログ
      console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
    }

    return result;
  };
}
