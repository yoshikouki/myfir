import type { Book } from "./types";

export const books: Book[] = [
  {
    id: "animal-adventure",
    title: "どうぶつの ぼうけん",
    description: "みんなで たのしい ぼうけんに でかけよう",
    difficulty: "easy",
    estimatedTime: 3,
    pages: [
      {
        id: "page-1",
        title: "はじまり",
        content:
          "ある あさ、こぐまの コロンは もりで あたらしい ともだちを さがしに いくことに しました。「きょうは どんな ともだちに あえるかな？」コロンは わくわく しながら もりへ むかいました。",
        illustration: "🐻",
        backgroundColor: "from-green-100 to-blue-100",
        textColor: "text-gray-800",
      },
      {
        id: "page-2",
        title: "うさぎさんとの であい",
        content:
          "もりの おくで、コロンは しろい うさぎさんに であいました。「こんにちは！ いっしょに あそびませんか？」うさぎさんは とても やさしくて、コロンと いっしょに かけっこを しました。",
        illustration: "🐰",
        backgroundColor: "from-pink-100 to-purple-100",
        textColor: "text-gray-800",
      },
      {
        id: "page-3",
        title: "とりさんの うた",
        content:
          "つぎに、きれいな こえで うたう とりさんに であいました。「ちゅんちゅん♪ いっしょに うたいましょう！」コロンも うさぎさんも、とりさんの うたに あわせて たのしく うたいました。",
        illustration: "🐦",
        backgroundColor: "from-yellow-100 to-orange-100",
        textColor: "text-gray-800",
      },
      {
        id: "page-4",
        title: "みんなで あそぼう",
        content:
          "さいごに、みんなで おおきな きの したで あそびました。かけっこしたり、うたったり、おはなしたり。「あたらしい ともだちが できて とても うれしいな！」コロンは にっこり わらいました。",
        illustration: "🌳",
        backgroundColor: "from-green-100 to-teal-100",
        textColor: "text-gray-800",
      },
      {
        id: "page-5",
        title: "おわり",
        content:
          "たのしい いちにちが おわって、コロンは おうちに かえりました。「また あした、みんなで あそぼうね！」そして、すてきな ゆめを みながら ぐっすり ねむりました。おしまい。",
        illustration: "🏠",
        backgroundColor: "from-indigo-100 to-purple-100",
        textColor: "text-gray-800",
      },
    ],
  },
  {
    id: "space-journey",
    title: "うちゅうの たび",
    description: "ろけっとに のって ほしの せかいへ",
    difficulty: "medium",
    estimatedTime: 5,
    pages: [
      {
        id: "space-1",
        title: "ろけっと はっしゃ",
        content:
          "ゆうじんの ケンタくんは、うちゅうひこうしに なるのが ゆめです。きょうは とうとう ほんものの ろけっとに のって、うちゅうへ たびだつ ひです。「3、2、1、はっしゃ！」ろけっとは そらたかく とんでいきました。",
        illustration: "🚀",
        backgroundColor: "from-blue-200 to-indigo-200",
        textColor: "text-gray-800",
      },
      {
        id: "space-2",
        title: "つきで であった ともだち",
        content:
          "さいしょに ついたのは つきでした。そこには うちゅうじんの ピカくんが すんでいました。「ようこそ つきへ！ いっしょに つきの うえを とんでみませんか？」ケンタくんは ピカくんと つきで ジャンプして あそびました。",
        illustration: "🌙",
        backgroundColor: "from-gray-200 to-blue-200",
        textColor: "text-gray-800",
      },
      {
        id: "space-3",
        title: "きらきら ほしぞら",
        content:
          "つぎに、ケンタくんと ピカくんは きれいな ほしぞらを とびました。「わあ！ほしが こんなに きれい！」たくさんの ほしが きらきら ひかって、とても きれいでした。ながれぼしも みることが できました。",
        illustration: "⭐",
        backgroundColor: "from-purple-200 to-pink-200",
        textColor: "text-gray-800",
      },
      {
        id: "space-4",
        title: "たいようの ちかく",
        content:
          "とても あつい たいようの ちかくも とんでみました。「あつい けれど、とても あかるくて きれいですね！」たいようは おおきくて、あたたかい ひかりを だしていました。ケンタくんは うちゅうの すばらしさに かんどうしました。",
        illustration: "☀️",
        backgroundColor: "from-yellow-200 to-orange-200",
        textColor: "text-gray-800",
      },
      {
        id: "space-5",
        title: "ちきゅうに きかん",
        content:
          "たのしい うちゅうの たびが おわって、ケンタくんは ちきゅうに もどりました。「うちゅうは とても ひろくて きれいでした。また いつか たびに いきたいな！」ケンタくんの うちゅうの ゆめは もっと おおきく なりました。",
        illustration: "🌍",
        backgroundColor: "from-green-200 to-blue-200",
        textColor: "text-gray-800",
      },
    ],
  },
  {
    id: "ocean-adventure",
    title: "うみの ぼうけん",
    description: "ふかい うみの そこで すてきな はっけん",
    difficulty: "hard",
    estimatedTime: 7,
    pages: [
      {
        id: "ocean-1",
        title: "うみへ もぐる",
        content:
          "みちこちゃんは すいえいが だいすき。きょうは おとうさんと いっしょに、うみの そこを たんけんします。「すごい！さかなが いっぱいいるね！」あおい うみの なかは、ふしぎで きれいな せかいでした。",
        illustration: "🏊‍♀️",
        backgroundColor: "from-blue-300 to-cyan-300",
        textColor: "text-gray-800",
      },
      {
        id: "ocean-2",
        title: "いるかと およぐ",
        content:
          "つめたい うみの なかで、やさしい いるかに であいました。「きゅーきゅー♪ いっしょに およごう！」いるかは みちこちゃんの まわりを げんきよく およいで、とても たのしそうでした。みちこちゃんも いるかと いっしょに およぎました。",
        illustration: "🐬",
        backgroundColor: "from-cyan-300 to-teal-300",
        textColor: "text-gray-800",
      },
      {
        id: "ocean-3",
        title: "サンゴの もり",
        content:
          "うみの そこには、にじいろの サンゴが たくさん そだっていました。「まるで うみの なかの もり みたい！」ちいさな さかなたちが サンゴの あいだを たのしそうに およいでいます。とても カラフルで きれいでした。",
        illustration: "🪸",
        backgroundColor: "from-pink-300 to-red-300",
        textColor: "text-gray-800",
      },
      {
        id: "ocean-4",
        title: "くじらの おはなし",
        content:
          "おおきな くじらが ゆっくりと ちかづいてきました。「ぽーん、ぽーん。うみの ふかいところに すてきな ばしょが あるんだよ」くじらは みちこちゃんに うみの ひみつを おしえてくれました。",
        illustration: "🐋",
        backgroundColor: "from-indigo-300 to-blue-300",
        textColor: "text-gray-800",
      },
      {
        id: "ocean-5",
        title: "たからもの はっけん",
        content:
          "くじらが おしえてくれた ばしょには、ふるい たからばこが ありました。なかには きれいな しんじゅが はいっていました。「うみの たからものを みつけた！」みちこちゃんは とても うれしくなりました。",
        illustration: "💎",
        backgroundColor: "from-yellow-300 to-amber-300",
        textColor: "text-gray-800",
      },
      {
        id: "ocean-6",
        title: "うみの おもいで",
        content:
          "すばらしい うみの ぼうけんが おわり、みちこちゃんは りくに あがりました。「うみには こんなに すてきな せかいが あったんだね！」たからものの しんじゅを だいじに もって、またいつか うみに いくことを ちかいました。",
        illustration: "🏖️",
        backgroundColor: "from-orange-300 to-yellow-300",
        textColor: "text-gray-800",
      },
    ],
  },
];

export const scrollInstructions = [
  "マウスの ホイールを まわしてみて！",
  "がめんを したに うごかしてみよう",
  "ゆっくり スクロールしてね",
  "つぎの ページも みてみよう！",
];

export const completionMessages = [
  "🎉 さいごまで よめたね！",
  "📚 よく がんばりました！",
  "⭐ すばらしい！ ぜんぶ よんだね！",
  "🌟 えほん マスターだね！",
];
