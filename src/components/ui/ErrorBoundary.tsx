"use client";

import { motion } from "framer-motion";
import { Home, RefreshCw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import {
  AppError,
  ErrorCode,
  ErrorSeverity,
  getChildFriendlyErrorMessage,
  handleError,
} from "@/src/lib/errorHandling";

interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: AppError, retry: () => void) => ReactNode;
  onError?: (error: AppError, errorInfo: ErrorInfo) => void;
  level?: "app" | "page" | "component";
}

/**
 * 子ども向けエラー境界コンポーネント
 * 分かりやすいエラーメッセージとリカバリー機能を提供
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: "",
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    let appError: AppError;
    if (error instanceof AppError) {
      appError = error;
    } else {
      appError = handleError(error, ErrorCode.COMPONENT_ERROR, ErrorSeverity.HIGH);
    }

    return {
      hasError: true,
      error: appError,
      errorId,
    };
  }

  componentDidCatch(_error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    const { error: appError } = this.state;

    // 追加のコンテキスト情報をログに記録
    if (appError) {
      const enhancedError = new AppError(
        appError.code,
        appError.severity,
        appError.message,
        {
          ...appError.context,
          componentStack: errorInfo.componentStack,
          errorBoundaryLevel: this.props.level || "component",
        },
        appError.originalError,
      );

      onError?.(enhancedError, errorInfo);
    }
  }

  handleRetry = () => {
    // 連続リトライを防ぐ
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorId: "",
      });
      this.retryTimeoutId = null;
    }, 300);
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, level = "component" } = this.props;

    if (!hasError || !error) {
      return children;
    }

    // カスタムフォールバックが提供されている場合
    if (fallback) {
      return fallback(error, this.handleRetry);
    }

    // デフォルトのエラーUI
    return (
      <DefaultErrorUI
        error={error}
        level={level}
        onRetry={this.handleRetry}
        onGoHome={this.handleGoHome}
      />
    );
  }
}

interface DefaultErrorUIProps {
  error: AppError;
  level: "app" | "page" | "component";
  onRetry: () => void;
  onGoHome: () => void;
}

function DefaultErrorUI({ error, level, onRetry, onGoHome }: DefaultErrorUIProps) {
  const friendlyError = getChildFriendlyErrorMessage(error);

  // レベルに応じてUIの大きさを調整
  const isFullPage = level === "app" || level === "page";
  const containerClass = isFullPage
    ? "min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50"
    : "flex items-center justify-center rounded-lg bg-red-50 p-8";

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-md text-center"
      >
        {/* エラーアイコン */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
          className="mb-6 text-8xl"
        >
          {friendlyError.emoji}
        </motion.div>

        {/* エラータイトル */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 font-bold text-2xl text-gray-800 sm:text-3xl"
        >
          {friendlyError.title}
        </motion.h2>

        {/* エラーメッセージ */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-gray-600 text-lg"
        >
          {friendlyError.message}
        </motion.p>

        {/* アクションボタン */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          {friendlyError.showRetry && (
            <motion.button
              onClick={onRetry}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 px-6 py-3 font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <RefreshCw className="size-5" />
              <span>{friendlyError.action || "もういちど やってみる"}</span>
            </motion.button>
          )}

          {isFullPage && (
            <motion.button
              onClick={onGoHome}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <Home className="size-5" />
              <span>ホームに もどる</span>
            </motion.button>
          )}
        </motion.div>

        {/* 開発モードでのエラー詳細 */}
        {process.env.NODE_ENV === "development" && (
          <motion.details
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-left"
          >
            <summary className="cursor-pointer text-gray-500 text-sm">
              開発者向け詳細情報
            </summary>
            <div className="mt-2 rounded bg-gray-100 p-4 font-mono text-xs">
              <p>
                <strong>Error Code:</strong> {error.code}
              </p>
              <p>
                <strong>Severity:</strong> {error.severity}
              </p>
              <p>
                <strong>Message:</strong> {error.message}
              </p>
              {error.context && (
                <div>
                  <strong>Context:</strong>
                  <pre className="mt-1 overflow-auto">
                    {JSON.stringify(error.context, null, 2)}
                  </pre>
                </div>
              )}
              {error.originalError && (
                <div>
                  <strong>Original Error:</strong>
                  <pre className="mt-1 overflow-auto">{error.originalError.stack}</pre>
                </div>
              )}
            </div>
          </motion.details>
        )}
      </motion.div>
    </div>
  );
}

// より具体的なエラー境界コンポーネント
export function TypingGameErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      level="component"
      onError={(error) => {
        // タイピングゲーム固有のエラーハンドリング
        console.error("Typing Game Error:", error);
      }}
      fallback={(_error, retry) => (
        <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-red-50 p-8">
          <div className="text-center">
            <div className="mb-4 text-6xl">😅</div>
            <h3 className="mb-2 font-bold text-gray-800 text-xl">
              タイピングゲームに もんだいが あったよ
            </h3>
            <p className="mb-6 text-gray-600">もういちど はじめから やってみよう</p>
            <motion.button
              onClick={retry}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-gradient-to-r from-green-400 to-blue-500 px-6 py-3 font-bold text-white shadow-lg"
            >
              🔄 やりなおす
            </motion.button>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
