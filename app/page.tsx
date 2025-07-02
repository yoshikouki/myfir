"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Gamepad2,
  Hand,
  Image,
  Keyboard,
  Monitor,
  Mouse,
  Play,
  Star,
  Volume2,
} from "lucide-react";
import Link from "next/link";

const learningContents = [
  {
    id: "pc-basics",
    title: "はじめての パソコン",
    description: "パソコンの ぶひんを まなぼう",
    icon: Monitor,
    href: "/pc",
    color: "from-blue-400 to-cyan-500",
    available: true,
  },
  {
    id: "mouse-drawing",
    title: "マウスで おえかき",
    description: "マウスを つかって えを かこう",
    icon: Mouse,
    href: "/mouse-drawing",
    color: "from-pink-400 to-purple-500",
    available: true,
  },
  {
    id: "typing",
    title: "もじを うとう",
    description: "キーボードで もじを いれよう",
    icon: Keyboard,
    href: "/typing",
    color: "from-green-400 to-emerald-500",
    available: true,
  },
  {
    id: "drag-drop",
    title: "おかたづけ ゲーム",
    description: "ドラッグで ものを うごかそう",
    icon: Hand,
    href: "/drag-drop",
    color: "from-yellow-400 to-orange-500",
    available: true,
  },
  {
    id: "click-game",
    title: "どうぶつを さがそう",
    description: "クリックで どうぶつを みつけよう",
    icon: Gamepad2,
    href: "/click-game",
    color: "from-purple-400 to-pink-500",
    available: true,
  },
  {
    id: "scroll-book",
    title: "ながい えほん",
    description: "スクロールで ページを よもう",
    icon: FileText,
    href: "/scroll-book",
    color: "from-indigo-400 to-blue-500",
    available: true,
  },
  {
    id: "sound-player",
    title: "がっきを ならそう",
    description: "おとや どうがを さいせい",
    icon: Volume2,
    href: "/sound-player",
    color: "from-red-400 to-rose-500",
    available: true,
  },
  {
    id: "name-input",
    title: "なまえを いれよう",
    description: "じぶんの なまえを タイプ",
    icon: Star,
    href: "/name-input",
    color: "from-cyan-400 to-teal-500",
    available: false,
  },
  {
    id: "window-control",
    title: "おへやを きりかえよう",
    description: "ウィンドウを つかいこなそう",
    icon: Play,
    href: "/window-control",
    color: "from-orange-400 to-amber-500",
    available: false,
  },
  {
    id: "photo-gallery",
    title: "しゃしんを せいりしよう",
    description: "ファイルの つかいかた",
    icon: Image,
    href: "/photo-gallery",
    color: "from-teal-400 to-green-500",
    available: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* ヘッダー */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-8 py-6"
      >
        <div className="mx-auto max-w-7xl">
          <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-center font-bold text-4xl text-transparent sm:text-5xl">
            MyFir へ ようこそ！
          </h1>
          <p className="mt-4 text-center text-gray-700 text-xl">
            パソコンを つかって たのしく まなぼう
          </p>
        </div>
      </motion.header>

      {/* メインコンテンツ */}
      <main className="px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 text-center"
          >
            <h2 className="font-bold text-2xl text-gray-800 sm:text-3xl">
              どれから はじめる？
            </h2>
            <p className="mt-2 text-gray-600 text-lg">すきな ものを えらんで やってみよう！</p>
          </motion.div>

          {/* コンテンツグリッド */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {learningContents.map((content, index) => {
              const Icon = content.icon;
              return (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={content.available ? { scale: 1.05 } : {}}
                  whileTap={content.available ? { scale: 0.95 } : {}}
                  className={`group relative ${content.available ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                >
                  {content.available ? (
                    <Link href={content.href} className="block">
                      <div
                        className={`rounded-3xl bg-gradient-to-br ${content.color} p-1 shadow-lg transition-shadow hover:shadow-xl`}
                      >
                        <div className="rounded-3xl bg-white p-8">
                          <div className="mb-4 flex justify-center">
                            <div
                              className={`rounded-2xl bg-gradient-to-br ${content.color} p-4`}
                            >
                              <Icon className="size-12 text-white" />
                            </div>
                          </div>
                          <h3 className="text-center font-bold text-gray-800 text-xl">
                            {content.title}
                          </h3>
                          <p className="mt-2 text-center text-gray-600">
                            {content.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div
                      className={`rounded-3xl bg-gradient-to-br ${content.color} p-1 opacity-50`}
                    >
                      <div className="rounded-3xl bg-white p-8">
                        <div className="mb-4 flex justify-center">
                          <div className={`rounded-2xl bg-gradient-to-br ${content.color} p-4`}>
                            <Icon className="size-12 text-white" />
                          </div>
                        </div>
                        <h3 className="text-center font-bold text-gray-800 text-xl">
                          {content.title}
                        </h3>
                        <p className="mt-2 text-center text-gray-600">{content.description}</p>
                        <p className="mt-4 text-center font-bold text-gray-500 text-sm">
                          じゅんび ちゅう
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* 総合学習へのリンク */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
              <div className="rounded-full bg-white px-8 py-4">
                <p className="font-bold text-gray-800 text-lg">ぜんぶ できたら...</p>
                <p className="mt-1 text-gray-600">「PCマスターへの みち」に ちょうせん！</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* フッター */}
      <footer className="mt-auto px-8 py-6">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-gray-600">おとなの ひとと いっしょに つかってね</p>
        </div>
      </footer>
    </div>
  );
}
