"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Clock, Home, Trophy } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { books } from "../data";
import type { Book, ReadingProgress } from "../types";
import { BookReader } from "./BookReader";

const difficultyColors = {
  easy: "from-green-400 to-emerald-500",
  medium: "from-yellow-400 to-orange-500",
  hard: "from-red-400 to-pink-500",
};

const difficultyLabels = {
  easy: "かんたん",
  medium: "ちゅうきゅう",
  hard: "むずかしい",
};

export function ScrollBook() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [completedBooks, setCompletedBooks] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<string>("");

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(""), 3000);
  }, []);

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
  };

  const handleBackToSelection = () => {
    setSelectedBook(null);
  };

  const handleBookComplete = (progress: ReadingProgress) => {
    if (selectedBook && progress.completed) {
      setCompletedBooks((prev) => new Set([...prev, selectedBook.id]));
      showFeedback(`「${selectedBook.title}」を よみおわりました！`);
    }
  };

  if (selectedBook) {
    return (
      <BookReader
        book={selectedBook}
        onBack={handleBackToSelection}
        onComplete={handleBookComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
                >
                  <Home className="size-4" />
                  <span className="hidden sm:inline">ホームに もどる</span>
                </motion.button>
              </Link>
              <h1 className="font-bold text-2xl text-gray-800 sm:text-3xl">ながい えほん</h1>
            </div>
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

      {/* メインコンテンツ */}
      <main className="p-6">
        <div className="mx-auto max-w-6xl">
          {/* 説明セクション */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-3xl bg-white p-8 shadow-lg"
          >
            <div className="text-center">
              <div className="mb-4 text-6xl">📚</div>
              <h2 className="mb-4 font-bold text-3xl text-gray-800">
                スクロールして えほんを よもう！
              </h2>
              <p className="text-gray-600 text-lg">
                マウスの ホイールを まわしたり、がめんを したに うごかして
                <br />
                ながい えほんを さいごまで よんでみよう！
              </p>
            </div>
          </motion.div>

          {/* 書籍一覧 */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book, index) => {
              const isCompleted = completedBooks.has(book.id);
              const colorClass = difficultyColors[book.difficulty];
              const difficultyLabel = difficultyLabels[book.difficulty];

              return (
                <motion.button
                  key={book.id}
                  onClick={() => handleBookSelect(book)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative w-full"
                >
                  <div
                    className={`rounded-3xl bg-gradient-to-br ${colorClass} p-1 shadow-lg transition-shadow hover:shadow-xl`}
                  >
                    <div className="rounded-3xl bg-white p-6">
                      {/* 完了マーク */}
                      {isCompleted && (
                        <div className="-top-2 -right-2 absolute flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white text-xl">
                          ✓
                        </div>
                      )}

                      {/* 表紙アイコン */}
                      <div className="mb-4 text-6xl">{book.pages[0]?.illustration || "📖"}</div>

                      {/* タイトル */}
                      <h3 className="mb-2 font-bold text-gray-800 text-xl">{book.title}</h3>

                      {/* 説明 */}
                      <p className="mb-4 text-gray-600 text-sm">{book.description}</p>

                      {/* 詳細情報 */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <BookOpen className="size-4 text-gray-500" />
                            <span className="text-gray-600">レベル：</span>
                          </div>
                          <span className="font-bold text-gray-800">{difficultyLabel}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Clock className="size-4 text-gray-500" />
                            <span className="text-gray-600">じかん：</span>
                          </div>
                          <span className="font-bold text-gray-800">
                            やく {book.estimatedTime}ふん
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ページすう：</span>
                          <span className="font-bold text-gray-800">
                            {book.pages.length}ページ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* 進捗表示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 rounded-2xl bg-white p-6 shadow-lg"
          >
            <h3 className="mb-4 font-bold text-gray-800 text-xl">よんだ えほん</h3>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-gray-600">
                よみおわった えほん: {completedBooks.size} / {books.length}
              </span>
              <span className="font-bold text-green-600 text-lg">
                {Math.round((completedBooks.size / books.length) * 100)}%
              </span>
            </div>
            <div className="h-4 rounded-full bg-gray-200">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                style={{
                  width: `${(completedBooks.size / books.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {completedBooks.size === books.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 text-center"
              >
                <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 p-4 font-bold text-white text-xl shadow-lg">
                  <Trophy className="size-6" />
                  <span>🎉 えほん マスター おめでとう！ 🎉</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
