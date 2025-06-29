"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { pcParts } from "../data";
import { InteractiveDemo } from "./InteractiveDemo";
import { PCPartCard } from "./PCPartCard";

interface LearningStepProps {
  title: string;
  description: string;
  content: string;
  stepId: string;
  onComplete?: () => void;
}

export function LearningStep({
  title,
  description,
  content,
  stepId,
  onComplete,
}: LearningStepProps) {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [showParts, setShowParts] = useState(false);

  const handlePartClick = (partId: string) => {
    setSelectedPart(partId);
    // 音声フィードバックの代わりに視覚的フィードバック
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1000);
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h2
          className="mb-4 font-bold text-3xl text-blue-800"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="mb-6 text-gray-700 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {description}
        </motion.p>
        <motion.div
          className="rounded-2xl bg-white p-6 shadow-lg"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <p className="text-gray-800 text-lg leading-relaxed">{content}</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.button
          type="button"
          onClick={() => setShowParts(!showParts)}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 px-8 py-4 font-bold text-white text-xl shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          {showParts ? "かくす" : "ぶひんをみる"}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showParts && (
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {pcParts.map((part, index) => (
              <motion.div
                key={part.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <PCPartCard
                  part={part}
                  onClick={() => handlePartClick(part.id)}
                  isActive={selectedPart === part.id}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPart && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="rounded-2xl border-4 border-orange-400 bg-gradient-to-r from-yellow-100 to-orange-100 p-6"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 10px 25px rgba(0,0,0,0.1)",
                  "0 20px 40px rgba(0,0,0,0.15)",
                  "0 10px 25px rgba(0,0,0,0.1)",
                ],
              }}
              transition={{ duration: 0.6, repeat: 0 }}
            >
              <motion.p
                className="font-bold text-2xl text-orange-800"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                すごい！
              </motion.p>
              <motion.p
                className="mt-2 text-lg text-orange-700"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {pcParts.find((p) => p.id === selectedPart)?.name}をおぼえたね！
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* インタラクティブデモ */}
      {stepId === "interaction" && (
        <div className="space-y-8">
          <InteractiveDemo type="mouse" onComplete={() => setShowParts(true)} />
          {showParts && <InteractiveDemo type="keyboard" onComplete={() => onComplete?.()} />}
        </div>
      )}
    </motion.div>
  );
}
