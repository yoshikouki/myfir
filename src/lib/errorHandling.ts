/**
 * グローバルエラーハンドリングシステム
 * 子ども向けアプリケーション用の安全なエラー処理
 */

// エラーの種類定義
export enum ErrorCode {
  // ネットワーク関連
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  API_ERROR = "API_ERROR",

  // データ関連
  VALIDATION_ERROR = "VALIDATION_ERROR",
  PARSING_ERROR = "PARSING_ERROR",
  STORAGE_ERROR = "STORAGE_ERROR",

  // UI関連
  COMPONENT_ERROR = "COMPONENT_ERROR",
  RENDER_ERROR = "RENDER_ERROR",

  // ゲーム関連
  GAME_STATE_ERROR = "GAME_STATE_ERROR",
  LESSON_LOAD_ERROR = "LESSON_LOAD_ERROR",
  PROGRESS_SAVE_ERROR = "PROGRESS_SAVE_ERROR",

  // システム関連
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
}

// エラーの重要度
export enum ErrorSeverity {
  LOW = "low", // ログのみ、ユーザーに影響なし
  MEDIUM = "medium", // 警告表示、機能は継続可能
  HIGH = "high", // エラー表示、一部機能停止
  CRITICAL = "critical", // 致命的エラー、アプリ停止
}

// 子ども向けエラーメッセージ
export interface ChildFriendlyError {
  title: string;
  message: string;
  emoji: string;
  action?: string;
  showRetry?: boolean;
}

// アプリケーションエラー
export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly severity: ErrorSeverity,
    message: string,
    public readonly context?: Record<string, unknown>,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = "AppError";

    // Error.captureStackTrace が利用可能な場合のみ実行
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

// 子ども向けエラーメッセージの生成
export function getChildFriendlyErrorMessage(error: AppError): ChildFriendlyError {
  switch (error.code) {
    case ErrorCode.NETWORK_ERROR:
      return {
        title: "インターネットに つながらないよ",
        message: "おうちの ひとに きいてみてね",
        emoji: "🌐",
        showRetry: true,
      };

    case ErrorCode.TIMEOUT_ERROR:
      return {
        title: "ちょっと おそいみたい",
        message: "もういちど ためしてみよう",
        emoji: "⏰",
        showRetry: true,
      };

    case ErrorCode.STORAGE_ERROR:
      return {
        title: "データが ほぞんできないよ",
        message: "だいじょうぶ、また あそべるよ",
        emoji: "💾",
        showRetry: false,
      };

    case ErrorCode.LESSON_LOAD_ERROR:
      return {
        title: "レッスンが よみこめないよ",
        message: "べつの レッスンを ためしてみよう",
        emoji: "📚",
        showRetry: true,
      };

    case ErrorCode.GAME_STATE_ERROR:
      return {
        title: "ゲームに もんだいが あったよ",
        message: "もういちど はじめから やってみよう",
        emoji: "🎮",
        action: "リセット",
        showRetry: false,
      };

    default:
      return {
        title: "なにか うまくいかないみたい",
        message: "おうちの ひとに きいてみてね",
        emoji: "😅",
        showRetry: true,
      };
  }
}

// エラーログ機能
interface ErrorLog {
  timestamp: string;
  code: ErrorCode;
  severity: ErrorSeverity;
  message: string;
  context?: Record<string, unknown>;
  userAgent: string;
  url: string;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;

  log(error: AppError): void {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      code: error.code,
      severity: error.severity,
      message: error.message,
      context: error.context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.logs.push(errorLog);

    // 古いログを削除
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // コンソールに出力（開発時のみ）
    if (process.env.NODE_ENV === "development") {
      console.group(`🚨 ${error.severity.toUpperCase()} Error: ${error.code}`);
      console.error("Message:", error.message);
      console.error("Context:", error.context);
      console.error("Original Error:", error.originalError);
      console.groupEnd();
    }

    // 重要度に応じた処理
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        // 致命的エラーの場合、外部サービスに送信することも考慮
        this.reportCriticalError(errorLog);
        break;
      case ErrorSeverity.HIGH:
        // 高重要度エラーの場合、ユーザーに通知
        break;
      default:
        // その他は通常ログのみ
        break;
    }
  }

  private reportCriticalError(errorLog: ErrorLog): void {
    // 本番環境では外部エラー監視サービスに送信
    // 開発時はコンソールに出力
    if (process.env.NODE_ENV === "development") {
      console.error("🔥 CRITICAL ERROR:", errorLog);
    }
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// シングルトンインスタンス
export const errorLogger = new ErrorLogger();

// エラーハンドリングユーティリティ
export function handleError(
  error: unknown,
  code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  context?: Record<string, unknown>,
): AppError {
  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof Error) {
    appError = new AppError(code, severity, error.message, context, error);
  } else {
    appError = new AppError(
      code,
      severity,
      typeof error === "string" ? error : "予期しないエラーが発生しました",
      context,
    );
  }

  errorLogger.log(appError);
  return appError;
}

// 非同期関数のエラーハンドリング
export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  code: ErrorCode,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw handleError(error, code, severity, { functionName: fn.name, args });
    }
  };
}

// React用エラーハンドリングヘルパー
export function useErrorHandler() {
  return (
    error: unknown,
    code: ErrorCode = ErrorCode.COMPONENT_ERROR,
    context?: Record<string, unknown>,
  ) => {
    const appError = handleError(error, code, ErrorSeverity.HIGH, context);
    // ここでReactのエラー境界にエラーを投げるか、状態管理でエラーを設定
    throw appError;
  };
}

// LocalStorage操作の安全なラッパー
export function safeStorageOperation<T>(
  operation: () => T,
  fallback: T,
  context?: Record<string, unknown>,
): T {
  try {
    return operation();
  } catch (error) {
    handleError(error, ErrorCode.STORAGE_ERROR, ErrorSeverity.LOW, context);
    return fallback;
  }
}

// ネットワークリクエストのリトライ機能
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  backoff: boolean = true,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        break;
      }

      // 指数バックオフ
      const waitTime = backoff ? delay * 2 ** (attempt - 1) : delay;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw handleError(
    lastError || new Error("Unknown error"),
    ErrorCode.NETWORK_ERROR,
    ErrorSeverity.HIGH,
    {
      maxRetries,
      finalAttempt: maxRetries,
    },
  );
}

// パフォーマンス監視
export class PerformanceMonitor {
  private measurements: Map<string, number> = new Map();

  start(label: string): void {
    this.measurements.set(label, performance.now());
  }

  end(label: string): number {
    const startTime = this.measurements.get(label);
    if (!startTime) {
      console.warn(`Performance measurement '${label}' was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.measurements.delete(label);

    if (process.env.NODE_ENV === "development") {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }

    // 閾値を超えた場合は警告
    if (duration > 1000) {
      handleError(
        new Error(`Performance issue: ${label} took ${duration.toFixed(2)}ms`),
        ErrorCode.UNKNOWN_ERROR,
        ErrorSeverity.LOW,
        { label, duration },
      );
    }

    return duration;
  }

  measure<T>(label: string, operation: () => T): T {
    this.start(label);
    try {
      const result = operation();
      return result;
    } finally {
      this.end(label);
    }
  }

  async measureAsync<T>(label: string, operation: () => Promise<T>): Promise<T> {
    this.start(label);
    try {
      const result = await operation();
      return result;
    } finally {
      this.end(label);
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// グローバルエラーハンドラーの設定
export function setupGlobalErrorHandlers(): void {
  // 未処理のPromise拒否をキャッチ
  window.addEventListener("unhandledrejection", (event) => {
    const error = handleError(event.reason, ErrorCode.UNKNOWN_ERROR, ErrorSeverity.HIGH, {
      type: "unhandledrejection",
    });

    // デフォルトの動作を防ぐ
    event.preventDefault();

    console.error("Unhandled Promise Rejection:", error);
  });

  // 一般的なJavaScriptエラーをキャッチ
  window.addEventListener("error", (event) => {
    const error = handleError(
      event.error || event.message,
      ErrorCode.UNKNOWN_ERROR,
      ErrorSeverity.HIGH,
      {
        type: "javascript-error",
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
      },
    );

    console.error("Global JavaScript Error:", error);
  });
}
