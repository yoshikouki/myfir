"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { LearningStep } from "@/src/features/learn-pc-basics/components/LearningStep";
import { learningSteps } from "@/src/features/learn-pc-basics/data";

export default function FirstPCPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const goToNextStep = () => {
    if (currentStep < learningSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 font-bold text-4xl text-blue-800">はじめてのパソコン</h1>
          <p className="mb-6 text-gray-700 text-xl">
            パソコンってなにかな？いっしょにまなぼう！
          </p>

          {/* ステップインジケーター */}
          <div className="mb-8 flex justify-center space-x-4">
            {learningSteps.map((step, index) => (
              <div
                key={step.id}
                className={`h-4 w-4 rounded-full ${
                  index === currentStep
                    ? "bg-blue-500"
                    : completedSteps.includes(index)
                      ? "bg-green-500"
                      : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 学習ステップ */}
        <div className="mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <LearningStep
                title={learningSteps[currentStep].title}
                description={learningSteps[currentStep].description}
                content={learningSteps[currentStep].content}
                stepId={learningSteps[currentStep].id}
                onComplete={handleStepComplete}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ナビゲーションボタン */}
        <div className="mx-auto mt-12 flex max-w-4xl justify-between">
          <button
            type="button"
            onClick={goToPrevStep}
            disabled={currentStep === 0}
            className="rounded-xl bg-gray-500 px-6 py-3 font-bold text-lg text-white shadow-lg transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← まえへ
          </button>

          <div className="text-center">
            <p className="text-gray-600 text-lg">
              {currentStep + 1} / {learningSteps.length}
            </p>
          </div>

          <button
            type="button"
            onClick={goToNextStep}
            disabled={currentStep === learningSteps.length - 1}
            className="rounded-xl bg-blue-500 px-6 py-3 font-bold text-lg text-white shadow-lg transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            つぎへ →
          </button>
        </div>

        {/* 完了メッセージ */}
        {completedSteps.length === learningSteps.length && (
          <div className="mt-12 text-center">
            <div className="mx-auto max-w-2xl rounded-2xl border-4 border-orange-400 bg-gradient-to-r from-yellow-100 to-orange-100 p-8">
              <p className="mb-4 font-bold text-3xl text-orange-800">🎉 おめでとう！ 🎉</p>
              <p className="text-orange-700 text-xl">
                ぜんぶのがくしゅうがおわったよ！パソコンのことがよくわかったね！
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
