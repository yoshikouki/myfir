"use client";

import { motion } from "framer-motion";
import { Download, Eraser, Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { DrawingPath } from "../types";
import { BrushSizePicker } from "./BrushSizePicker";
import { ColorPicker } from "./ColorPicker";
import { DrawingCanvas } from "./DrawingCanvas";

export function MouseDrawing() {
  const [selectedColor, setSelectedColor] = useState("#FF4444");
  const [brushSize, setBrushSize] = useState(5);
  const [paths, setPaths] = useState<DrawingPath[]>([]);

  const handleClear = () => {
    if (paths.length === 0) return;

    const shouldClear = window.confirm("えを ぜんぶ けして あたらしく かきますか？");
    if (shouldClear) {
      setPaths([]);
    }
  };

  const handleSave = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `おえかき-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
                >
                  <Home className="size-5" />
                  <span>もどる</span>
                </motion.button>
              </Link>
              <h1 className="font-bold text-2xl text-gray-800 sm:text-3xl">
                マウスで おえかき
              </h1>
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={handleClear}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={paths.length === 0}
                className="flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-red-600 hover:shadow-xl disabled:bg-gray-300 disabled:opacity-50"
              >
                <Eraser className="size-5" />
                <span className="hidden sm:inline">ぜんぶけす</span>
              </motion.button>

              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={paths.length === 0}
                className="flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-green-600 hover:shadow-xl disabled:bg-gray-300 disabled:opacity-50"
              >
                <Download className="size-5" />
                <span className="hidden sm:inline">ほぞんする</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl p-4">
        {/* ツールバー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl bg-white p-4 shadow-lg"
        >
          <div className="space-y-4">
            {/* 色選択 */}
            <div>
              <h2 className="mb-2 font-bold text-gray-700 text-lg">いろをえらぼう</h2>
              <ColorPicker selectedColor={selectedColor} onColorChange={setSelectedColor} />
            </div>

            {/* ブラシサイズ */}
            <div className="border-t pt-4">
              <BrushSizePicker selectedSize={brushSize} onSizeChange={setBrushSize} />
            </div>
          </div>
        </motion.div>

        {/* キャンバス */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white p-4 shadow-xl"
        >
          <DrawingCanvas
            color={selectedColor}
            brushSize={brushSize}
            paths={paths}
            onPathsChange={setPaths}
          />
        </motion.div>

        {/* 使い方のヒント */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 rounded-xl bg-yellow-100 p-4 shadow-lg"
        >
          <h3 className="mb-2 font-bold text-gray-800 text-lg">つかいかた</h3>
          <ul className="space-y-1 text-gray-700">
            <li>🎨 すきな いろを えらんでね</li>
            <li>🖌️ ふでの おおきさも かえられるよ</li>
            <li>🖱️ マウスを おしながら うごかすと せんが かけるよ</li>
            <li>💾 できたら 「ほぞんする」で がぞうに できるよ</li>
          </ul>
        </motion.div>
      </main>
    </div>
  );
}
