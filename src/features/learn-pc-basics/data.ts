import type { PCPart } from "./types";

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
];
