import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TypingDisplay } from "../TypingDisplay";

describe("TypingDisplay", () => {
  const defaultProps = {
    displayText: "いぬ",
    typedText: "",
    currentChar: "i",
    currentIndex: 0,
    inputText: "inu",
    isCompleted: false,
  };

  it("正しく初期状態を表示する", () => {
    render(<TypingDisplay {...defaultProps} />);

    expect(screen.getByText("いぬ")).toBeInTheDocument();
    expect(screen.getByText("i")).toBeInTheDocument();
    expect(screen.getByText("nu")).toBeInTheDocument();
  });

  it("入力済みテキストを緑色で表示する", () => {
    render(<TypingDisplay {...defaultProps} typedText="i" currentChar="n" currentIndex={1} />);

    const typedElement = screen.getByText("i");
    expect(typedElement).toHaveClass("text-green-600");
  });

  it("現在の文字をハイライト表示する", () => {
    render(<TypingDisplay {...defaultProps} />);

    const currentElement = screen.getByText("i");
    expect(currentElement).toHaveClass(
      "text-blue-600",
      "underline",
      "rounded",
      "bg-yellow-100",
    );
  });

  it("未入力テキストをグレーで表示する", () => {
    render(<TypingDisplay {...defaultProps} typedText="i" currentChar="n" currentIndex={1} />);

    const remainingElement = screen.getByText("u");
    expect(remainingElement).toHaveClass("text-gray-400");
  });

  it("完了時は現在文字のハイライトを非表示にする", () => {
    render(
      <TypingDisplay {...defaultProps} typedText="inu" currentIndex={3} isCompleted={true} />,
    );

    // 現在文字のハイライトが表示されないことを確認
    expect(screen.queryByText("i")).not.toHaveClass("text-blue-600");
  });

  it("長いテキストも正しく表示する", () => {
    render(
      <TypingDisplay
        displayText="いぬ と ねこ"
        typedText="inu "
        currentChar="t"
        currentIndex={4}
        inputText="inu to neko"
        isCompleted={false}
      />,
    );

    expect(screen.getByText("いぬ と ねこ")).toBeInTheDocument();
    expect(screen.getByText("inu ")).toHaveClass("text-green-600");
    expect(screen.getByText("t")).toHaveClass("text-blue-600");
    expect(screen.getByText("o neko")).toHaveClass("text-gray-400");
  });

  it("空の入力でも正しく表示する", () => {
    render(<TypingDisplay {...defaultProps} typedText="" currentChar="i" currentIndex={0} />);

    expect(screen.getByText("いぬ")).toBeInTheDocument();
    expect(screen.getByText("i")).toHaveClass("text-blue-600");
    expect(screen.getByText("nu")).toHaveClass("text-gray-400");
  });
});
