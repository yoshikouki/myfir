"use client";

import { motion } from "framer-motion";
import type { BookPage as BookPageType } from "../types";

interface BookPageProps {
  page: BookPageType;
  pageNumber: number;
  isVisible: boolean;
}

export function BookPage({ page, pageNumber, isVisible }: BookPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: isVisible ? 1 : 0.3,
        y: 0,
        scale: isVisible ? 1 : 0.95,
      }}
      transition={{ duration: 0.6 }}
      className={`relative min-h-screen bg-gradient-to-br ${page.backgroundColor} flex items-center justify-center p-8`}
    >
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-8 shadow-2xl sm:p-12">
          {/* ページ番号 */}
          <div className="mb-6 text-center">
            <span className="inline-block rounded-full bg-purple-500 px-4 py-2 font-bold text-lg text-white">
              {pageNumber}ページ
            </span>
          </div>

          {/* イラスト */}
          <div className="mb-8 text-center">
            <div className="inline-block rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 p-8 shadow-lg">
              <span className="text-9xl sm:text-[12rem]" role="img" aria-label={page.title}>
                {page.illustration}
              </span>
            </div>
          </div>

          {/* タイトル */}
          <h2 className={`mb-6 text-center font-bold text-3xl ${page.textColor} sm:text-4xl`}>
            {page.title}
          </h2>

          {/* 本文 */}
          <div className={`text-center leading-relaxed ${page.textColor} text-xl sm:text-2xl`}>
            <p className="mx-auto max-w-3xl">{page.content}</p>
          </div>

          {/* スクロールヒント */}
          {pageNumber === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-6 py-3 text-blue-800">
                <span className="text-lg">👆</span>
                <span className="font-medium">スクロールして つづきを よもう！</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 背景装飾 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="-top-10 -left-10 absolute h-20 w-20 rounded-full bg-white bg-opacity-20"></div>
        <div className="-bottom-10 -right-10 absolute h-32 w-32 rounded-full bg-white bg-opacity-10"></div>
        <div className="-right-5 absolute top-1/2 h-16 w-16 rounded-full bg-white bg-opacity-15"></div>
      </div>
    </motion.div>
  );
}
