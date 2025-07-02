"use client";

import { motion } from "framer-motion";

interface BrushSizePickerProps {
  selectedSize: number;
  onSizeChange: (size: number) => void;
}

const brushSizes = [
  { name: "ほそい", value: 2, displaySize: 8 },
  { name: "ふつう", value: 5, displaySize: 16 },
  { name: "ふとい", value: 10, displaySize: 24 },
  { name: "すごくふとい", value: 20, displaySize: 32 },
];

export function BrushSizePicker({ selectedSize, onSizeChange }: BrushSizePickerProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      <span className="font-bold text-gray-700 text-lg">ふでのおおきさ：</span>
      <div className="flex gap-3">
        {brushSizes.map((size) => (
          <motion.button
            key={size.value}
            onClick={() => onSizeChange(size.value)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`relative flex flex-col items-center gap-2 rounded-lg p-3 transition-all ${
              selectedSize === size.value
                ? "bg-purple-100 ring-2 ring-purple-500"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            aria-label={`${size.name}ふでをえらぶ`}
          >
            <div
              className="rounded-full bg-gray-800"
              style={{
                width: `${size.displaySize}px`,
                height: `${size.displaySize}px`,
              }}
            />
            <span className="font-medium text-gray-700 text-sm">{size.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
