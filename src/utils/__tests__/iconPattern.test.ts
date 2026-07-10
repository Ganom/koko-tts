import { describe, expect, it } from "vitest";
import { buildIconPatternSvg, ICON_TILE_SIZE, toSvgDataUri } from "@/utils/iconPattern";

import type { IconNode } from "@/utils/iconRegistry";

const testIcon: IconNode = [["circle", { cx: "12", cy: "12", r: "8" }]];

describe("icon pattern tile", () => {
  it("builds a deterministic, repeatable SVG tile", () => {
    const options = { icons: [testIcon], colors: ["#f06292", "#f59e0b"] };
    const first = buildIconPatternSvg(options);
    const second = buildIconPatternSvg(options);

    expect(first).toBe(second);
    expect(first).toContain(`width="${ICON_TILE_SIZE}"`);
    expect(first.match(/<g transform=/g)).toHaveLength(64);
    expect(first).toContain('stroke="#f06292"');
    expect(first).toContain('stroke="#f59e0b"');
    expect(first).toContain('<circle cx="12" cy="12" r="8" />');
  });

  it("encodes SVG markup as a CSS-ready data URI", () => {
    expect(toSvgDataUri("<svg>#</svg>")).toBe("data:image/svg+xml;utf8,%3Csvg%3E%23%3C%2Fsvg%3E");
  });
});
