"use client";

import { motion } from "framer-motion";
import type { SoundCategory } from "../types";

interface CategorySelectorProps {
  categories: SoundCategory[];
  selectedCategory: SoundCategory | null;
  onSelectCategory: (category: SoundCategory) => void;
}

export function CategorySelector({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category, index) => {
        const isSelected = selectedCategory?.id === category.id;

        return (
          <motion.button
            key={category.id}
            onClick={() => onSelectCategory(category)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative w-full`}
          >
            <div
              className={`rounded-3xl bg-gradient-to-br ${category.color} p-1 shadow-lg transition-all duration-300 ${
                isSelected
                  ? "scale-105 shadow-2xl ring-4 ring-white ring-opacity-60"
                  : "hover:shadow-xl"
              }`}
            >
              <div className="rounded-3xl bg-white p-6">
                {/* カテゴリー絵文字 */}
                <div className="mb-3 text-4xl">{category.emoji}</div>

                {/* カテゴリー名 */}
                <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>

                {/* 音の数 */}
                <p className="mt-2 text-gray-600 text-sm">{category.sounds.length}つの おと</p>

                {/* 選択状態インジケーター */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="-top-2 -right-2 absolute flex h-8 w-8 items-center justify-center rounded-full bg-green-500 font-bold text-sm text-white"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
