"use client";

import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import type { DragItem, DropZone } from "../types";

interface DropZoneAreaProps {
  zone: DropZone;
  placedItems: DragItem[];
  isOver?: boolean;
}

export function DropZoneArea({ zone, placedItems, isOver = false }: DropZoneAreaProps) {
  const { setNodeRef } = useDroppable({
    id: zone.id,
  });

  return (
    <motion.div
      ref={setNodeRef}
      whileHover={{ scale: 1.02 }}
      className={`relative min-h-[200px] rounded-3xl border-4 border-dashed p-6 transition-all ${isOver ? "border-purple-500 bg-purple-100 shadow-lg" : "border-gray-300 bg-gray-50"} `}
    >
      {/* ゾーンヘッダー */}
      <div className="mb-4 text-center">
        <div
          className={`mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${zone.color} text-3xl text-white shadow-lg `}
        >
          {zone.emoji}
        </div>
        <h3 className="font-bold text-gray-800 text-lg">{zone.name}</h3>
      </div>

      {/* 配置されたアイテム */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {placedItems.map((item) => (
          <motion.div
            key={`placed-${item.id}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-xl bg-white p-3 shadow-md"
          >
            <div className="text-center">
              <div className="mb-1 text-2xl">{item.emoji}</div>
              <p className="font-medium text-gray-700 text-xs">{item.name}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 空の状態 */}
      {placedItems.length === 0 && (
        <div className="absolute inset-6 flex items-center justify-center rounded-2xl border-2 border-gray-400 border-dashed">
          <p className="text-gray-500">ここに ドラッグしてね</p>
        </div>
      )}

      {/* ホバー効果 */}
      {isOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-3xl bg-purple-200 bg-opacity-50"
        />
      )}
    </motion.div>
  );
}
