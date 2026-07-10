import type { IconNode } from "@/utils/iconRegistry";

export const ICON_TILE_SIZE = 640;
export const ICON_SIZE = 40;
export const ICON_GAP = 40;

const DEFAULT_COLOR = "#ffffff";
const ICONS_PER_AXIS = ICON_TILE_SIZE / (ICON_SIZE + ICON_GAP);

export interface IconPatternTileOptions {
  icons: readonly IconNode[];
  colors: readonly string[];
}

const escapeAttribute = (value: string | number) =>
  String(value).replace(/[&<>"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
    };

    return entities[character];
  });

const serializeIconNode = (icon: IconNode) =>
  icon
    .map(([tag, attributes]) => {
      const serializedAttributes = Object.entries(attributes)
        .filter(([name]) => name !== "key")
        .map(([name, value]) => `${name}="${escapeAttribute(value)}"`)
        .join(" ");

      return `<${tag}${serializedAttributes ? ` ${serializedAttributes}` : ""} />`;
    })
    .join("");

const positiveModulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;

export function buildIconPatternSvg({ icons, colors }: IconPatternTileOptions): string {
  const palette = colors.length > 0 ? colors : [DEFAULT_COLOR];
  const iconNodes = icons.length > 0 ? icons : [];
  const cells: string[] = [];

  for (let row = 0; row < ICONS_PER_AXIS; row += 1) {
    for (let column = 0; column < ICONS_PER_AXIS; column += 1) {
      const icon = iconNodes[positiveModulo(column * 37 + row * 23, iconNodes.length)];
      if (!icon) continue;

      const rotation = positiveModulo(column * 73 + row * 31, 180) - 90;
      const opacity = (0.05 + positiveModulo(column * 47 + row * 59, 50) / 1000).toFixed(3);
      const color = palette[positiveModulo(column * 61 + row * 67, palette.length)];
      const x = column * (ICON_SIZE + ICON_GAP) + ICON_GAP / 2;
      const y = row * (ICON_SIZE + ICON_GAP) + ICON_GAP / 2;

      cells.push(
        `<g transform="translate(${x} ${y}) rotate(${rotation}) translate(-${ICON_SIZE / 2} -${ICON_SIZE / 2})" opacity="${opacity}" stroke="${escapeAttribute(color)}">` +
          `<svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24">${serializeIconNode(icon)}</svg>` +
          "</g>",
      );
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON_TILE_SIZE}" height="${ICON_TILE_SIZE}" viewBox="0 0 ${ICON_TILE_SIZE} ${ICON_TILE_SIZE}" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${cells.join("")}</svg>`;
}

export const toSvgDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
