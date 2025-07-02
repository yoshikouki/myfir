"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Home, RotateCcw, Trophy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { completionMessages } from "../data";
import type { Book, ReadingProgress } from "../types";
import { BookPage } from "./BookPage";

interface BookReaderProps {
  book: Book;
  onBack: () => void;
  onComplete: (progress: ReadingProgress) => void;
}

export function BookReader({ book, onBack, onComplete }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [startTime] = useState(Date.now());
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(""), 3000);
  }, []);

  const getRandomMessage = useCallback((messages: string[]): string => {
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  // スクロール進捗を監視
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollTop / docHeight, 1);
    setScrollProgress(progress);

    // 現在のページを計算
    const pageHeight = window.innerHeight;
    const currentPageIndex = Math.floor(scrollTop / pageHeight);
    setCurrentPage(Math.min(currentPageIndex, book.pages.length - 1));

    // 完了チェック
    if (progress > 0.95 && !completed) {
      setCompleted(true);
      const readingProgress: ReadingProgress = {
        currentPage: book.pages.length - 1,
        scrollProgress: 1,
        timeSpent: Math.round((Date.now() - startTime) / 1000),
        completed: true,
      };
      onComplete(readingProgress);
      showFeedback(getRandomMessage(completionMessages));
    }
  }, [book.pages.length, completed, startTime, onComplete, showFeedback, getRandomMessage]);

  // スクロールイベントリスナー
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ページ移動関数
  const scrollToPage = (pageIndex: number) => {
    const pageHeight = window.innerHeight;
    const targetScroll = pageIndex * pageHeight;
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const handleRestart = () => {
    setCurrentPage(0);
    setScrollProgress(0);
    setCompleted(false);
    setFeedback("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* 固定ヘッダー */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={onBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
              >
                <Home className="size-4" />
                <span className="hidden sm:inline">もどる</span>
              </motion.button>
              <h1 className="font-bold text-gray-800 text-lg sm:text-xl">{book.title}</h1>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleRestart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 font-bold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl"
              >
                <RotateCcw className="size-4" />
                <span className="hidden sm:inline">はじめから</span>
              </motion.button>
            </div>
          </div>

          {/* 進捗バー */}
          <div className="mt-2 h-2 rounded-full bg-gray-200">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500"
              style={{ width: `${scrollProgress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* ページ情報 */}
          <div className="mt-1 text-center text-gray-600 text-sm">
            {currentPage + 1} / {book.pages.length} ページ
          </div>
        </div>
      </header>

      {/* フィードバック */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="-translate-x-1/2 fixed top-24 left-1/2 z-50 rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 p-4 font-bold text-white text-xl shadow-xl"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 完了メッセージ */}
      {completed && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="rounded-3xl bg-gradient-to-r from-green-400 to-blue-500 p-8 text-center text-white shadow-2xl">
            <Trophy className="mx-auto mb-4 size-20" />
            <h2 className="mb-4 font-bold text-4xl">おめでとう！</h2>
            <p className="mb-2 text-xl">「{book.title}」を さいごまで よみました！</p>
            <p className="text-lg">
              よんだ じかん: {Math.round((Date.now() - startTime) / 1000)}びょう
            </p>
          </div>
        </motion.div>
      )}

      {/* ページナビゲーション */}
      <div className="-translate-y-1/2 fixed top-1/2 right-4 z-30 space-y-2">
        <motion.button
          onClick={() => scrollToPage(Math.max(0, currentPage - 1))}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={currentPage === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:shadow-xl disabled:bg-gray-300 disabled:opacity-50"
        >
          <ChevronUp className="size-6 text-gray-700" />
        </motion.button>

        <motion.button
          onClick={() => scrollToPage(Math.min(book.pages.length - 1, currentPage + 1))}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={currentPage === book.pages.length - 1}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:shadow-xl disabled:bg-gray-300 disabled:opacity-50"
        >
          <ChevronDown className="size-6 text-gray-700" />
        </motion.button>
      </div>

      {/* 書籍コンテンツ */}
      <main className="pt-32">
        {book.pages.map((page, index) => (
          <BookPage
            key={page.id}
            page={page}
            pageNumber={index + 1}
            isVisible={Math.abs(currentPage - index) <= 1}
          />
        ))}

        {/* 最後のスペース */}
        <div className="h-screen"></div>
      </main>
    </div>
  );
}
