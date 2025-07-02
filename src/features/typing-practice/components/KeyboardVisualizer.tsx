"use client";

import { motion } from "framer-motion";

interface KeyboardVisualizerProps {
  pressedKey?: string;
  nextKey?: string;
}

const keyboardLayout = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

const hiraganaMap: Record<string, string> = {
  a: "あ",
  i: "い",
  u: "う",
  e: "え",
  o: "お",
  ka: "か",
  ki: "き",
  ku: "く",
  ke: "け",
  ko: "こ",
  sa: "さ",
  si: "し",
  su: "す",
  se: "せ",
  so: "そ",
  ta: "た",
  ti: "ち",
  tu: "つ",
  te: "て",
  to: "と",
  na: "な",
  ni: "に",
  nu: "ぬ",
  ne: "ね",
  no: "の",
  ha: "は",
  hi: "ひ",
  hu: "ふ",
  he: "へ",
  ho: "ほ",
  ma: "ま",
  mi: "み",
  mu: "む",
  me: "め",
  mo: "も",
  ya: "や",
  yu: "ゆ",
  yo: "よ",
  ra: "ら",
  ri: "り",
  ru: "る",
  re: "れ",
  ro: "ろ",
  wa: "わ",
  wo: "を",
  n: "ん",
};

export function KeyboardVisualizer({ pressedKey, nextKey }: KeyboardVisualizerProps) {
  const getKeyStatus = (key: string) => {
    if (pressedKey?.toLowerCase() === key) return "pressed";
    if (nextKey?.toLowerCase() === key) return "next";
    return "normal";
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-gray-100 p-6 shadow-inner">
      <div className="space-y-2">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex justify-center gap-2">
            {row.map((key) => {
              const status = getKeyStatus(key);
              return (
                <motion.div
                  key={key}
                  animate={{
                    scale: status === "pressed" ? 0.9 : 1,
                    y: status === "pressed" ? 2 : 0,
                  }}
                  className={`relative flex h-12 w-12 items-center justify-center rounded-lg font-bold text-lg shadow-md transition-all ${status === "pressed" ? "bg-blue-500 text-white shadow-sm" : ""} ${status === "next" ? "bg-yellow-300 ring-2 ring-yellow-500" : ""} ${status === "normal" ? "bg-white text-gray-700" : ""} `}
                >
                  <span className="text-base">{key.toUpperCase()}</span>
                  {Object.entries(hiraganaMap).find(([romaji]) => romaji === key)?.[1] && (
                    <span className="-top-1 -right-1 absolute rounded bg-purple-500 px-1 text-white text-xs">
                      {Object.entries(hiraganaMap).find(([romaji]) => romaji === key)?.[1]}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}

        {/* スペースバー */}
        <div className="flex justify-center pt-2">
          <motion.div
            animate={{
              scale: pressedKey === " " ? 0.95 : 1,
              y: pressedKey === " " ? 2 : 0,
            }}
            className={`flex h-12 w-64 items-center justify-center rounded-lg font-bold shadow-md transition-all ${pressedKey === " " ? "bg-blue-500 text-white shadow-sm" : ""} ${nextKey === " " ? "bg-yellow-300 ring-2 ring-yellow-500" : ""} ${pressedKey !== " " && nextKey !== " " ? "bg-white text-gray-700" : ""} `}
          >
            スペース
          </motion.div>
        </div>
      </div>

      <div className="mt-4 text-center text-gray-600 text-sm">
        <p>きいろの キーを おしてね！</p>
      </div>
    </div>
  );
}
