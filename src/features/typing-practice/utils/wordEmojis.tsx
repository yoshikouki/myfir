import type { TypingLesson } from "../types";
import type { JSX } from "react";

/**
 * テキスト内の単語を絵文字付きで表示するためのユーティリティ
 */
export function renderTextWithEmojis(text: string, lesson: TypingLesson): JSX.Element[] {
  if (!lesson.wordEmojis) {
    // 絵文字マッピングがない場合は通常のテキストを返す
    return [<span key="text">{text}</span>];
  }

  const words = text.split(" ");
  const elements: JSX.Element[] = [];

  words.forEach((word, index) => {
    const emoji = lesson.wordEmojis?.[word];

    if (emoji) {
      // 絵文字がある場合は、単語の上に絵文字を表示
      elements.push(
        <span key={`word-${index}`} className="relative mx-1 inline-block">
          <span className="-top-8 -translate-x-1/2 absolute left-1/2 transform text-2xl">
            {emoji}
          </span>
          <span>{word}</span>
        </span>,
      );
    } else {
      // 絵文字がない場合は通常のテキスト
      elements.push(
        <span key={`word-${index}`} className="mx-1">
          {word}
        </span>,
      );
    }

    // 最後の単語でなければスペースを追加
    if (index < words.length - 1) {
      elements.push(<span key={`space-${index}`}> </span>);
    }
  });

  return elements;
}

/**
 * 入力中のテキストに対して絵文字を表示する関数
 * 完了した単語の上に絵文字を表示する
 */
export function renderTypedTextWithEmojis(
  typedText: string,
  lesson: TypingLesson,
): JSX.Element[] {
  if (!lesson.wordEmojis) {
    return [<span key="typed">{typedText}</span>];
  }

  const words = typedText.split(" ");
  const elements: JSX.Element[] = [];

  words.forEach((word, index) => {
    const emoji = lesson.wordEmojis?.[word];

    if (emoji && word.length > 0) {
      // 完了した単語に絵文字を表示
      elements.push(
        <span key={`typed-word-${index}`} className="relative mx-1 inline-block">
          <span className="-top-8 -translate-x-1/2 absolute left-1/2 transform animate-bounce text-2xl">
            {emoji}
          </span>
          <span>{word}</span>
        </span>,
      );
    } else if (word.length > 0) {
      elements.push(
        <span key={`typed-word-${index}`} className="mx-1">
          {word}
        </span>,
      );
    }

    // 最後の単語でなければスペースを追加
    if (index < words.length - 1) {
      elements.push(<span key={`typed-space-${index}`}> </span>);
    }
  });

  return elements;
}
