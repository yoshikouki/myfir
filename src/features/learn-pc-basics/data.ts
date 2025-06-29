import type { MouseFriendStage, PCPart } from "./types";

export const pcParts: PCPart[] = [
  {
    id: "monitor",
    name: "モニター",
    description: "がめんにえがうつるよ！",
    imageUrl: "🖥️",
  },
  {
    id: "keyboard",
    name: "キーボード",
    description: "もじをかくときにつかうよ！",
    imageUrl: "⌨️",
  },
  {
    id: "mouse",
    name: "マウス",
    description: "クリックやスクロールができるよ！",
    imageUrl: "🖱️",
  },
  {
    id: "computer",
    name: "ほんたい",
    description: "パソコンのあたまのぶぶんだよ！",
    imageUrl: "💻",
  },
];

export const learningSteps = [
  {
    id: "introduction",
    title: "パソコンってなに？",
    description: "パソコンのなまえややくわりをおぼえよう！",
    content:
      "パソコンは、いろんなことができるきかいだよ！ゲームをしたり、えをかいたり、おんがくをきいたりできるんだ。",
  },
  {
    id: "parts",
    title: "パソコンのぶひん",
    description: "パソコンのいろんなぶぶんをみてみよう！",
    content: "パソコンにはいろんなぶぶんがあるよ。それぞれにたいせつなやくわりがあるんだ！",
  },
  {
    id: "interaction",
    title: "パソコンとあそぼう",
    description: "マウスやキーボードをつかってみよう！",
    content: "マウスでクリックしたり、キーボードでもじをかいたりしてみよう！",
  },
  {
    id: "mouse-friend",
    title: "マウスとなかよくなろう",
    description: "マウくんといっしょにたのしいぼうけんをしよう！",
    content:
      "マウくんっていうなまえのともだちがいるよ。いっしょにふしぎながめんのなかをぼうけんして、たからものをみつけよう！",
  },
];

// マウスと仲良くなろうゲームのステージデータ
export const mouseFriendStages: MouseFriendStage[] = [
  {
    id: "greeting",
    title: "マウくんとあいさつ",
    description: "マウくんといっしょにあいさつしよう！",
    instruction: "マウスをうごかすと、マウくんもいっしょにうごくよ！",
    duration: 30,
    difficulty: "easy",
  },
  {
    id: "star-collecting",
    title: "きらきらをあつめよう",
    description: "マウくんといっしょにきらきらのほしをあつめよう！",
    instruction: "きらきらをクリックしてあつめてね！",
    duration: 90,
    targetCount: 5,
    difficulty: "easy",
  },
  {
    id: "treasure-hunt",
    title: "たからばこをひらこう",
    description: "どのたからばこをひらく？マウくんといっしょにえらんでね！",
    instruction: "たからばこをクリックしてひらいてみよう！",
    duration: 90,
    targetCount: 3,
    difficulty: "medium",
  },
  {
    id: "mouse-walk",
    title: "マウくんとおさんぽ",
    description: "マウくんといっしょにみちをあるこう！",
    instruction: "マウくんをみちにそってゆっくりうごかそう！",
    duration: 60,
    difficulty: "medium",
  },
  {
    id: "photo-time",
    title: "ありがとうのきもち",
    description: "マウくんといっしょにきねんしゃしんをとろう！",
    instruction: "マウくんをクリックしてしゃしんをとろう！",
    duration: 30,
    targetCount: 1,
    difficulty: "easy",
  },
];
