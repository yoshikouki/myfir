"use client";

import { motion } from "framer-motion";
import {
  type ComponentType,
  lazy,
  type ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { ErrorBoundary } from "./ErrorBoundary";

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  minHeight?: number;
  showSkeleton?: boolean;
}

/**
 * 子ども向けのローディング表示
 */
function ChildFriendlyLoader({
  minHeight = 200,
  showSkeleton = false,
}: {
  minHeight?: number;
  showSkeleton?: boolean;
}) {
  if (showSkeleton) {
    return (
      <div className="animate-pulse space-y-4 p-6" style={{ minHeight }}>
        <div className="mx-auto h-16 w-16 rounded-full bg-gray-200"></div>
        <div className="space-y-2">
          <div className="h-4 rounded bg-gray-200"></div>
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
        </div>
        <div className="h-32 rounded-lg bg-gray-200"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex items-center justify-center"
      style={{ minHeight }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        {/* アニメーション化された絵文字 */}
        <motion.div
          className="mb-4 text-6xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          🌟
        </motion.div>

        {/* ローディングメッセージ */}
        <motion.p
          className="font-bold text-gray-600 text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          じゅんび しているよ...
        </motion.p>

        {/* ローディングドット */}
        <div className="mt-4 flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-blue-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 遅延読み込み対応のコンポーネントラッパー
 */
export function LazyLoad({
  children,
  fallback,
  minHeight = 200,
  showSkeleton = false,
}: LazyLoadProps) {
  const defaultFallback = (
    <ChildFriendlyLoader minHeight={minHeight} showSkeleton={showSkeleton} />
  );

  return (
    <ErrorBoundary level="component">
      <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

/**
 * 動的インポート用のヘルパー関数
 */
export function createLazyComponent<T extends ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ReactNode,
) {
  const LazyComponent = lazy(importFn);

  return function LazyWrapper(props: any) {
    return (
      <LazyLoad fallback={fallback}>
        <LazyComponent {...props} />
      </LazyLoad>
    );
  };
}

/**
 * 画像の遅延読み込みコンポーネント
 */
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  className = "",
  width,
  height,
  placeholder,
  onLoad,
  onError,
}: LazyImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      onLoad={onLoad}
      onError={onError}
      style={{
        backgroundColor: placeholder || "#f3f4f6",
      }}
    />
  );
}

/**
 * コンテンツの遅延読み込み（Intersection Observer使用）
 */
interface LazyContentProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  fallback?: ReactNode;
  once?: boolean;
}

export function LazyContent({
  children,
  threshold = 0.1,
  rootMargin = "50px",
  fallback,
  once = true,
}: LazyContentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            setHasLoaded(true);
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, once]);

  const shouldRender = once ? hasLoaded || isVisible : isVisible;

  return (
    <div ref={elementRef}>
      {shouldRender ? children : fallback || <ChildFriendlyLoader minHeight={100} />}
    </div>
  );
}

/**
 * 重いコンポーネントの描画を遅延させるhook
 */
export function useDeferredValue<T>(value: T, delay: number = 100): T {
  const [deferredValue, setDeferredValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeferredValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return deferredValue;
}
