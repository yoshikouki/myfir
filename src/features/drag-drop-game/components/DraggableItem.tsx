"use client";

import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import type { DragItem } from "../types";

interface DraggableItemProps {
  item: DragItem;
  isPlaced?: boolean;
}

export function DraggableItem({ item, isPlaced = false }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled: isPlaced,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isPlaced ? 0 : 1,
        opacity: isPlaced ? 0 : 1,
      }}
      whileHover={!isPlaced ? { scale: 1.05 } : {}}
      className={`relative cursor-grab touch-none select-none ${isDragging ? "z-50 cursor-grabbing" : ""} ${isPlaced ? "pointer-events-none" : ""} `}
      {...listeners}
      {...attributes}
    >
      <div
        className={`rounded-2xl bg-gradient-to-br ${item.color} p-1 shadow-lg transition-all ${isDragging ? "rotate-3 scale-110 shadow-2xl" : "hover:shadow-xl"} ${isPlaced ? "opacity-50" : ""} `}
      >
        <div className="rounded-2xl bg-white p-4">
          <div className="text-center">
            <div className="mb-2 text-4xl">{item.emoji}</div>
            <p className="font-bold text-gray-800 text-sm">{item.name}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
