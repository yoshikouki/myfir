import type { TypingLesson } from "./types";

export const typingLessons: TypingLesson[] = [
  // 左手専用練習 - 5歳向けひらがな
  {
    id: "left-hand-vowels",
    title: "ひだりて あえ",
    description: "ひだりてで あ と え を うとう",
    targetText: "あ え あ え",
    romajiText: "a e a e",
    level: "beginner",
    icon: "🫷",
  },

  // 右手専用練習 - 5歳向けひらがな
  {
    id: "right-hand-vowels",
    title: "みぎて いうお",
    description: "みぎてで い う お を うとう",
    targetText: "い う お い う お",
    romajiText: "i u o i u o",
    level: "beginner",
    icon: "🫸",
  },

  // 基本のひらがな練習
  {
    id: "hiragana-a",
    title: "あいうえお",
    description: "きほんの ひらがなを うとう",
    targetText: "あいうえお",
    romajiText: "aiueo",
    level: "beginner",
    icon: "🌸",
  },
  {
    id: "hiragana-ka",
    title: "かきくけこ",
    description: "か ぎょうを うとう",
    targetText: "かきくけこ",
    romajiText: "kakikukeko",
    level: "beginner",
    icon: "🍎",
  },
  {
    id: "hiragana-sa",
    title: "さしすせそ",
    description: "さ ぎょうを うとう",
    targetText: "さしすせそ",
    romajiText: "sasisuseso",
    level: "beginner",
    icon: "🐟",
  },
  {
    id: "simple-words",
    title: "かんたんな ことば",
    description: "みじかい ことばを うとう",
    targetText: "いぬ ねこ とり",
    romajiText: "inu neko tori",
    level: "beginner",
    icon: "🐕",
  },
  {
    id: "greetings",
    title: "あいさつ",
    description: "あいさつの ことばを うとう",
    targetText: "おはよう",
    romajiText: "ohayou",
    level: "intermediate",
    icon: "☀️",
  },
  {
    id: "thanks",
    title: "ありがとう",
    description: "かんしゃの きもちを つたえよう",
    targetText: "ありがとう",
    romajiText: "arigatou",
    level: "intermediate",
    icon: "🙏",
  },
  {
    id: "mama",
    title: "ママ",
    description: "ママ って うとう",
    targetText: "ママ",
    romajiText: "mama",
    level: "intermediate",
    icon: "👩",
  },
  // 両手連携練習 - 5歳向けひらがな
  {
    id: "both-hands-aiueo",
    title: "りょうて あいうえお",
    description: "りょうてで あいうえお を うとう",
    targetText: "あいうえお",
    romajiText: "aiueo",
    level: "intermediate",
    icon: "👐",
  },

  {
    id: "numbers",
    title: "すうじ",
    description: "かんたんな すうじを うとう",
    targetText: "1 2 3",
    level: "beginner",
    icon: "🔢",
  },
];
