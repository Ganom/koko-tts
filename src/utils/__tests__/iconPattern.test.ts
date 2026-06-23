import { describe, expect, it } from "vitest";
import {
  getMaxDevicePixelRatio,
  getScrollOffsets,
  parsePoints,
  toNumber,
} from "@/utils/iconPattern";

describe("iconPattern helpers", () => {
  it("parses svg points strings into numbers", () => {
    expect(parsePoints("1 2 3 4")).toEqual([1, 2, 3, 4]);
    expect(parsePoints("1,2 3,4")).toEqual([1, 2, 3, 4]);
    expect(parsePoints("-1.5 2.25 -3 4")).toEqual([-1.5, 2.25, -3, 4]);
    expect(parsePoints("")).toEqual([]);
    expect(parsePoints("nope")).toEqual([]);
  });

  it("coerces numbers safely", () => {
    expect(toNumber(12)).toBe(12);
    expect(toNumber("12.5")).toBe(12.5);
    expect(toNumber("nope", 7)).toBe(7);
    expect(toNumber(null, 7)).toBe(7);
  });

  it("computes scroll offsets", () => {
    expect(
      getScrollOffsets({
        elapsedSeconds: 1,
        enabled: false,
        slideAnimationSpeed: 1,
        slideDirection: "right",
      }),
    ).toEqual({ x: 0, y: 0 });

    expect(
      getScrollOffsets({
        elapsedSeconds: 1,
        enabled: true,
        slideAnimationSpeed: 1,
        slideDirection: "right",
      }),
    ).toEqual({ x: -30, y: 0 });

    expect(
      getScrollOffsets({
        elapsedSeconds: 2,
        enabled: true,
        slideAnimationSpeed: 0.5,
        slideDirection: "left",
      }),
    ).toEqual({ x: 30, y: 0 });

    const diagonal = getScrollOffsets({
      elapsedSeconds: 1,
      enabled: true,
      slideAnimationSpeed: 1,
      slideDirection: "diagonal-down-right",
    });

    expect(diagonal.x).toBeCloseTo(-30 * 0.707);
    expect(diagonal.y).toBeCloseTo(-30 * 0.707);
  });

  it("caps device pixel ratio to a max pixel budget", () => {
    expect(getMaxDevicePixelRatio({ width: 100, height: 100, rawDevicePixelRatio: 2 })).toBe(2);

    const capped = getMaxDevicePixelRatio({
      width: 4000,
      height: 4000,
      rawDevicePixelRatio: 3,
      maxPixels: 16_000_000,
    });
    expect(capped).toBeCloseTo(1);
  });
});
