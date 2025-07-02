import type { DragItem, DropZone } from "./types";

export const gameItems: DragItem[] = [
  // おもちゃ
  {
    id: "toy-1",
    name: "ボール",
    emoji: "⚽",
    category: "toys",
    color: "from-red-400 to-pink-500",
  },
  {
    id: "toy-2",
    name: "くま",
    emoji: "🧸",
    category: "toys",
    color: "from-red-400 to-pink-500",
  },
  {
    id: "toy-3",
    name: "つみき",
    emoji: "🧱",
    category: "toys",
    color: "from-red-400 to-pink-500",
  },

  // たべもの
  {
    id: "food-1",
    name: "りんご",
    emoji: "🍎",
    category: "food",
    color: "from-green-400 to-emerald-500",
  },
  {
    id: "food-2",
    name: "バナナ",
    emoji: "🍌",
    category: "food",
    color: "from-green-400 to-emerald-500",
  },
  {
    id: "food-3",
    name: "パン",
    emoji: "🍞",
    category: "food",
    color: "from-green-400 to-emerald-500",
  },

  // ふく
  {
    id: "clothes-1",
    name: "Tシャツ",
    emoji: "👕",
    category: "clothes",
    color: "from-blue-400 to-cyan-500",
  },
  {
    id: "clothes-2",
    name: "ぼうし",
    emoji: "👒",
    category: "clothes",
    color: "from-blue-400 to-cyan-500",
  },
  {
    id: "clothes-3",
    name: "くつ",
    emoji: "👟",
    category: "clothes",
    color: "from-blue-400 to-cyan-500",
  },

  // ぶんぼうぐ
  {
    id: "stationery-1",
    name: "えんぴつ",
    emoji: "✏️",
    category: "stationery",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "stationery-2",
    name: "ほん",
    emoji: "📚",
    category: "stationery",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "stationery-3",
    name: "はさみ",
    emoji: "✂️",
    category: "stationery",
    color: "from-yellow-400 to-orange-500",
  },
];

export const dropZones: DropZone[] = [
  {
    id: "toys",
    name: "おもちゃばこ",
    category: "toys",
    color: "from-red-400 to-pink-500",
    emoji: "🧸",
  },
  {
    id: "food",
    name: "れいぞうこ",
    category: "food",
    color: "from-green-400 to-emerald-500",
    emoji: "🧊",
  },
  {
    id: "clothes",
    name: "たんす",
    category: "clothes",
    color: "from-blue-400 to-cyan-500",
    emoji: "👚",
  },
  {
    id: "stationery",
    name: "つくえ",
    category: "stationery",
    color: "from-yellow-400 to-orange-500",
    emoji: "📝",
  },
];

export const gameConfig = {
  encouragingMessages: [
    "すごいね！",
    "よくできました！",
    "おしい！ がんばって！",
    "いいかんじ！",
    "もうすこし！",
    "やったね！",
  ],
  completionMessages: [
    "🎉 ぜんぶ きれいに かたづいたね！",
    "✨ おかたづけ めいじん！",
    "🌟 とても じょうず！",
    "🎊 かんぺき！",
  ],
};
