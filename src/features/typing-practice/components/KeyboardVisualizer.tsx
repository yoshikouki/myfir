"use client";

import { motion } from "framer-motion";

interface KeyboardVisualizerProps {
  pressedKey?: string;
  nextKey?: string;
  highlightHand?: "left" | "right" | "both" | null;
}

const keyboardLayout = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

// 左手担当キー (左から6つまで)
const leftHandKeys = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "q",
  "w",
  "e",
  "r",
  "t",
  "a",
  "s",
  "d",
  "f",
  "g",
  "z",
  "x",
  "c",
  "v",
  "b",
];

// 右手担当キー (右から5つまで)
const rightHandKeys = [
  "6",
  "7",
  "8",
  "9",
  "0",
  "-",
  "y",
  "u",
  "i",
  "o",
  "p",
  "h",
  "j",
  "k",
  "l",
  "n",
  "m",
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

export function KeyboardVisualizer({
  pressedKey,
  nextKey,
  highlightHand,
}: KeyboardVisualizerProps) {
  const getKeyStatus = (key: string) => {
    if (pressedKey?.toLowerCase() === key) return "pressed";
    if (nextKey?.toLowerCase() === key) return "next";
    return "normal";
  };

  const getHandType = (key: string) => {
    if (leftHandKeys.includes(key)) return "left";
    if (rightHandKeys.includes(key)) return "right";
    return "neutral";
  };

  const getKeyColorClass = (key: string, status: string) => {
    const handType = getHandType(key);

    if (status === "pressed") return "bg-blue-500 text-white shadow-sm";
    if (status === "next")
      return "bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold ring-2 ring-orange-400 shadow-lg";

    // 手のハイライト機能
    if (highlightHand === "left" && handType === "left") {
      return "bg-green-200 text-gray-800 ring-2 ring-green-400";
    }
    if (highlightHand === "right" && handType === "right") {
      return "bg-blue-200 text-gray-800 ring-2 ring-blue-400";
    }
    if (highlightHand === "both") {
      if (handType === "left") return "bg-green-100 text-gray-800 ring-1 ring-green-300";
      if (handType === "right") return "bg-blue-100 text-gray-800 ring-1 ring-blue-300";
    }

    return "bg-white text-gray-700";
  };

  return (
    <div
      className="mx-auto max-w-2xl rounded-2xl bg-gray-100 p-6 shadow-inner"
      data-testid="keyboard-visualizer"
    >
      <div className="space-y-2">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex justify-center gap-2">
            {row.map((key) => {
              const status = getKeyStatus(key);
              return (
                <motion.div
                  key={key}
                  animate={{
                    scale: status === "pressed" ? 0.9 : status === "next" ? [1, 1.1, 1] : 1,
                    y: status === "pressed" ? 2 : 0,
                  }}
                  transition={{
                    scale: status === "next" ? { repeat: Infinity, duration: 1.5 } : {},
                  }}
                  className={`relative flex h-12 w-12 items-center justify-center rounded-lg font-bold text-lg shadow-md transition-all ${getKeyColorClass(key, status)}`}
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
              scale: pressedKey === " " ? 0.95 : nextKey === " " ? [1, 1.05, 1] : 1,
              y: pressedKey === " " ? 2 : 0,
            }}
            transition={{
              scale: nextKey === " " ? { repeat: Infinity, duration: 1.5 } : {},
            }}
            className={`flex h-12 w-64 items-center justify-center rounded-lg font-bold shadow-md transition-all ${getKeyColorClass(" ", pressedKey === " " ? "pressed" : nextKey === " " ? "next" : "normal")}`}
          >
            スペース
          </motion.div>
        </div>
      </div>

      <div className="mt-4 text-center text-gray-600 text-sm">
        <p>オレンジ色の キーを おしてね！</p>
      </div>
    </div>
  );
}
