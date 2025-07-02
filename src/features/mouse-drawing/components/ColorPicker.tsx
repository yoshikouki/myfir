"use client";

import { motion } from "framer-motion";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const colors = [
  { name: "あか", value: "#FF4444", emoji: "🔴" },
  { name: "だいだい", value: "#FF8844", emoji: "🟠" },
  { name: "きいろ", value: "#FFD700", emoji: "🟡" },
  { name: "みどり", value: "#44DD44", emoji: "🟢" },
  { name: "あお", value: "#4444FF", emoji: "🔵" },
  { name: "むらさき", value: "#9944FF", emoji: "🟣" },
  { name: "ピンク", value: "#FF44CC", emoji: "🩷" },
  { name: "くろ", value: "#333333", emoji: "⚫" },
];

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-3 p-4">
      {colors.map((color) => (
        <motion.button
          key={color.value}
          onClick={() => onColorChange(color.value)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-all ${
            selectedColor === color.value
              ? "ring-4 ring-gray-800 ring-offset-2"
              : "hover:ring-2 hover:ring-gray-400 hover:ring-offset-2"
          }`}
          style={{ backgroundColor: color.value }}
          aria-label={`${color.name}をえらぶ`}
        >
          <span className="text-2xl">{color.emoji}</span>
          {selectedColor === color.value && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="-bottom-6 absolute text-center font-bold text-gray-700 text-sm"
            >
              {color.name}
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
}
