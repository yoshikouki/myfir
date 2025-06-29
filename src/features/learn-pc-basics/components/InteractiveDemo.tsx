"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface InteractiveDemoProps {
  type: "mouse" | "keyboard";
  onComplete: () => void;
}

export function InteractiveDemo({ type, onComplete }: InteractiveDemoProps) {
  const [clicks, setClicks] = useState(0);
  const [keyPresses, setKeyPresses] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const targetWord = "こんにちは";
  const requiredClicks = 5;
  const progressKeys = Array.from({ length: requiredClicks }, (_, i) => `dot-${i}`);

  useEffect(() => {
    if (type === "keyboard") {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key.length === 1) {
          setKeyPresses((prev) => {
            const newPresses = [...prev, e.key];
            if (newPresses.join("").includes(targetWord)) {
              setShowSuccess(true);
              setTimeout(() => onComplete(), 1500);
            }
            return newPresses.slice(-10); // 最後の10文字だけ保持
          });
        }
      };

      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [type, onComplete]);

  const handleClick = () => {
    if (type === "mouse") {
      const newClicks = clicks + 1;
      setClicks(newClicks);
      if (newClicks >= requiredClicks) {
        setShowSuccess(true);
        setTimeout(() => onComplete(), 1500);
      }
    }
  };

  if (type === "mouse") {
    return (
      <motion.div
        className="space-y-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="rounded-2xl bg-white p-8 shadow-lg"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <motion.h3
            className="mb-4 font-bold text-2xl text-blue-800"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            マウスでクリックしてみよう！
          </motion.h3>
          <motion.p
            className="mb-6 text-gray-700 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            したのボタンを{requiredClicks}かいクリックしてね！
          </motion.p>

          <motion.button
            type="button"
            onClick={handleClick}
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.9, rotate: 10 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            className="rounded-full bg-gradient-to-r from-pink-400 to-purple-500 px-12 py-8 font-bold text-2xl text-white shadow-xl"
          >
            🐭 クリック！
          </motion.button>

          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.p
              className="font-bold text-green-600 text-xl"
              animate={{ scale: clicks > 0 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              クリック: {clicks} / {requiredClicks}
            </motion.p>
            <div className="mt-4 flex justify-center space-x-2">
              {progressKeys.map((key, i) => (
                <motion.div
                  key={key}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    backgroundColor: i < clicks ? "#10b981" : "#d1d5db",
                  }}
                  transition={{ delay: 0.7 + i * 0.1, type: "spring", stiffness: 300 }}
                  className="h-4 w-4 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="rounded-2xl border-4 border-orange-400 bg-gradient-to-r from-yellow-100 to-orange-100 p-6"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.p
                className="font-bold text-2xl text-orange-800"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 0.8, repeat: 1 }}
              >
                すごい！マウスがつかえたね！ 🎉
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (type === "keyboard") {
    return (
      <div className="space-y-6 text-center">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h3 className="mb-4 font-bold text-2xl text-blue-800">
            キーボードで文字をうってみよう！
          </h3>
          <p className="mb-6 text-gray-700 text-lg">"こんにちは" とうってね！</p>

          <div className="mb-6 rounded-lg bg-gray-100 p-4">
            <p className="font-mono text-xl">{keyPresses.join("") || "ここにもじがでるよ"}</p>
          </div>

          <div className="text-gray-600 text-lg">💬 キーボードで文字をうってみてね！</div>
        </div>

        {showSuccess && (
          <div className="rounded-2xl border-4 border-orange-400 bg-gradient-to-r from-yellow-100 to-orange-100 p-6">
            <p className="font-bold text-2xl text-orange-800">
              すごい！キーボードがつかえたね！ 🎉
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
