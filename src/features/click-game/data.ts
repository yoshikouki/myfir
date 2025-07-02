import type { Animal, GameLevel } from "./types";

export const animals: Animal[] = [
  // やさしい動物
  {
    id: "dog",
    name: "いぬ",
    emoji: "🐕",
    sound: "わんわん",
    habitat: "いえ",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "cat",
    name: "ねこ",
    emoji: "🐱",
    sound: "にゃーにゃー",
    habitat: "いえ",
    color: "from-pink-400 to-purple-500",
  },
  {
    id: "rabbit",
    name: "うさぎ",
    emoji: "🐰",
    sound: "ぴょんぴょん",
    habitat: "もり",
    color: "from-pink-300 to-rose-400",
  },
  {
    id: "bird",
    name: "とり",
    emoji: "🐦",
    sound: "ちゅんちゅん",
    habitat: "そら",
    color: "from-blue-400 to-cyan-500",
  },

  // のりもの動物
  {
    id: "elephant",
    name: "ぞう",
    emoji: "🐘",
    sound: "ぱおーん",
    habitat: "サバンナ",
    color: "from-gray-400 to-gray-600",
  },
  {
    id: "lion",
    name: "らいおん",
    emoji: "🦁",
    sound: "がおー",
    habitat: "サバンナ",
    color: "from-yellow-500 to-orange-600",
  },
  {
    id: "giraffe",
    name: "きりん",
    emoji: "🦒",
    sound: "もぐもぐ",
    habitat: "サバンナ",
    color: "from-yellow-300 to-orange-400",
  },
  {
    id: "monkey",
    name: "さる",
    emoji: "🐵",
    sound: "うきうき",
    habitat: "ジャングル",
    color: "from-orange-400 to-red-500",
  },

  // みずの動物
  {
    id: "fish",
    name: "さかな",
    emoji: "🐟",
    sound: "ぷくぷく",
    habitat: "うみ",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "whale",
    name: "くじら",
    emoji: "🐋",
    sound: "ぽーん",
    habitat: "うみ",
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: "dolphin",
    name: "いるか",
    emoji: "🐬",
    sound: "きゅーきゅー",
    habitat: "うみ",
    color: "from-cyan-400 to-blue-500",
  },
  {
    id: "penguin",
    name: "ぺんぎん",
    emoji: "🐧",
    sound: "よちよち",
    habitat: "こおり",
    color: "from-gray-300 to-blue-400",
  },

  // ちいさな動物
  {
    id: "bee",
    name: "はち",
    emoji: "🐝",
    sound: "ぶんぶん",
    habitat: "はな",
    color: "from-yellow-400 to-amber-500",
  },
  {
    id: "butterfly",
    name: "ちょう",
    emoji: "🦋",
    sound: "ひらひら",
    habitat: "はな",
    color: "from-purple-400 to-pink-500",
  },
  {
    id: "ladybug",
    name: "てんとうむし",
    emoji: "🐞",
    sound: "ちょこちょこ",
    habitat: "はっぱ",
    color: "from-red-400 to-pink-500",
  },
  {
    id: "frog",
    name: "かえる",
    emoji: "🐸",
    sound: "けろけろ",
    habitat: "いけ",
    color: "from-green-400 to-emerald-500",
  },
];

export const gameLevels: GameLevel[] = [
  {
    id: "easy",
    name: "かんたん",
    description: "いえの どうぶつを さがそう",
    animals: animals.filter((a) => a.habitat === "いえ"),
    timeLimit: 60,
    targetCount: 2,
  },
  {
    id: "normal",
    name: "ふつう",
    description: "サバンナの どうぶつを さがそう",
    animals: animals.filter((a) => a.habitat === "サバンナ" || a.habitat === "ジャングル"),
    timeLimit: 90,
    targetCount: 4,
  },
  {
    id: "hard",
    name: "むずかしい",
    description: "うみの どうぶつを さがそう",
    animals: animals.filter((a) => a.habitat === "うみ" || a.habitat === "こおり"),
    timeLimit: 120,
    targetCount: 4,
  },
  {
    id: "expert",
    name: "たいへん",
    description: "ちいさな どうぶつを さがそう",
    animals: animals.filter((a) => ["はな", "はっぱ", "いけ"].includes(a.habitat)),
    timeLimit: 90,
    targetCount: 4,
  },
];

export const gameConfig = {
  gridSize: 8, // 8x8のグリッド
  animalVisibilityTime: 3000, // 3秒間表示
  hideTime: 2000, // 2秒間隠れる
  successMessages: [
    "やったね！みつけた！",
    "すごい！よくみつけたね！",
    "かしこいね！",
    "さすが！",
    "とってもじょうず！",
  ],
  encourageMessages: [
    "がんばって！",
    "もうすこしだよ！",
    "よくみて さがしてね！",
    "しゅうちゅうして！",
  ],
  completionMessages: [
    "🎉 ぜんぶ みつけられたね！",
    "✨ どうぶつはかせだね！",
    "🌟 かんぺき！",
    "🎊 すばらしい！",
  ],
};
