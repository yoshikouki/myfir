import { describe, expect, it } from "vitest";
import { sum } from "./sum";

describe("sum", () => {
  it("should add two numbers correctly", () => {
    expect(sum(2, 3)).toBe(5);
    expect(sum(-1, 1)).toBe(0);
    expect(sum(0, 0)).toBe(0);
  });
});
