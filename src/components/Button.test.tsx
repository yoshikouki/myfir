import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies default variant styles", () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary", "text-primary-foreground");
  });

  it("applies destructive variant styles", () => {
    render(<Button variant="destructive">Destructive Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive", "text-destructive-foreground");
  });

  it("applies outline variant styles", () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border", "border-input", "bg-background");
  });

  it("applies small size styles", () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-9", "px-3");
  });

  it("applies large size styles", () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-11", "px-8");
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Clickable Button</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:pointer-events-none", "disabled:opacity-50");
  });

  it("accepts custom className", () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref).toHaveBeenCalled();
  });
});
