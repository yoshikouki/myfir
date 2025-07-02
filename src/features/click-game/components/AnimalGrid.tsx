"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { gameConfig } from "../data";
import type { Animal } from "../types";

interface AnimalGridProps {
  animals: Animal[];
  targetAnimal: Animal | null;
  onAnimalFound: (animal: Animal) => void;
  onWrongClick: () => void;
  gameActive: boolean;
}

interface GridCell {
  id: string;
  animal: Animal | null;
  isVisible: boolean;
  position: { row: number; col: number };
}

export function AnimalGrid({
  animals,
  targetAnimal,
  onAnimalFound,
  onWrongClick,
  gameActive,
}: AnimalGridProps) {
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [_visibleAnimals, setVisibleAnimals] = useState<Set<string>>(new Set());

  // グリッドを初期化
  const initializeGrid = useCallback(() => {
    const newGrid: GridCell[] = [];
    for (let row = 0; row < gameConfig.gridSize; row++) {
      for (let col = 0; col < gameConfig.gridSize; col++) {
        newGrid.push({
          id: `${row}-${col}`,
          animal: null,
          isVisible: false,
          position: { row, col },
        });
      }
    }
    setGrid(newGrid);
  }, []);

  // ランダムな位置に動物を配置
  const placeAnimalsRandomly = useCallback(() => {
    if (!gameActive || animals.length === 0) return;

    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];

      // 全てのセルをクリア
      newGrid.forEach((cell) => {
        cell.animal = null;
        cell.isVisible = false;
      });

      // ランダムに動物を配置
      const shuffledAnimals = [...animals].sort(() => Math.random() - 0.5);
      const numAnimalsToPlace = Math.min(4, shuffledAnimals.length);

      for (let i = 0; i < numAnimalsToPlace; i++) {
        let attempts = 0;
        let placed = false;

        while (!placed && attempts < 50) {
          const randomIndex = Math.floor(Math.random() * newGrid.length);
          if (!newGrid[randomIndex].animal) {
            newGrid[randomIndex].animal = shuffledAnimals[i];
            newGrid[randomIndex].isVisible = true;
            placed = true;
          }
          attempts++;
        }
      }

      return newGrid;
    });

    // 表示中の動物IDをセット
    const newVisibleAnimals = new Set<string>();
    animals.slice(0, 4).forEach((animal) => {
      newVisibleAnimals.add(animal.id);
    });
    setVisibleAnimals(newVisibleAnimals);

    // 一定時間後に隠す
    setTimeout(() => {
      setGrid((prevGrid) => prevGrid.map((cell) => ({ ...cell, isVisible: false })));
      setVisibleAnimals(new Set());
    }, gameConfig.animalVisibilityTime);
  }, [animals, gameActive]);

  // ゲーム開始時とターゲット変更時に動物を再配置
  useEffect(() => {
    if (gameActive && targetAnimal) {
      const timer = setTimeout(() => {
        placeAnimalsRandomly();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameActive, targetAnimal, placeAnimalsRandomly]);

  // 定期的に動物を再配置
  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      placeAnimalsRandomly();
    }, gameConfig.animalVisibilityTime + gameConfig.hideTime);

    return () => clearInterval(interval);
  }, [gameActive, placeAnimalsRandomly]);

  // 初期化
  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const handleCellClick = (cell: GridCell) => {
    if (!gameActive || !cell.animal || !cell.isVisible) {
      onWrongClick();
      return;
    }

    if (targetAnimal && cell.animal.id === targetAnimal.id) {
      onAnimalFound(cell.animal);

      // 見つけた動物を隠す
      setGrid((prevGrid) =>
        prevGrid.map((c) => (c.id === cell.id ? { ...c, isVisible: false } : c)),
      );
    } else {
      onWrongClick();
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="grid grid-cols-8 gap-1 rounded-2xl bg-gradient-to-br from-green-100 to-blue-100 p-4 shadow-lg">
        {grid.map((cell) => (
          <motion.button
            key={cell.id}
            onClick={() => handleCellClick(cell)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative aspect-square rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
            disabled={!gameActive}
          >
            <AnimatePresence>
              {cell.animal && cell.isVisible && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span
                    className="text-2xl sm:text-3xl"
                    role="img"
                    aria-label={cell.animal.name}
                  >
                    {cell.animal.emoji}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 草や花のランダムな装飾 */}
            {!cell.animal && Math.random() > 0.7 && (
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <span className="text-lg">{Math.random() > 0.5 ? "🌱" : "🌸"}</span>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* ヒント */}
      <div className="mt-4 text-center">
        <p className="text-gray-600 text-sm">どうぶつが でてきたら すばやく クリックしてね！</p>
      </div>
    </div>
  );
}
