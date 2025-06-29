"use client";

import { motion } from "framer-motion";
import type { PCPart } from "../types";

interface PCPartCardProps {
  part: PCPart;
  onClick?: () => void;
  isActive?: boolean;
}

export function PCPartCard({ part, onClick, isActive = false }: PCPartCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={`relative overflow-hidden rounded-2xl p-6 ${isActive ? "shadow-2xl" : "shadow-lg"} ${isActive ? "bg-gradient-to-br from-yellow-100 to-orange-100" : "bg-white"} border-4 ${isActive ? "border-orange-400" : "border-gray-200"}`}
    >
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-gray-100">
          <span className="text-6xl">{part.imageUrl || "🖥️"}</span>
        </div>
        <h3 className="mb-2 font-bold text-2xl text-gray-800">{part.name}</h3>
        <p className="text-gray-600 text-lg">{part.description}</p>
      </div>
    </motion.button>
  );
}
