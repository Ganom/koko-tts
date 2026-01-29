export type SlideDirection =
  | "right"
  | "left"
  | "down"
  | "up"
  | "diagonal-down-right"
  | "diagonal-up-left";

export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

export function parsePoints(points: string): number[] {
  const matches = points.match(/-?\d*\.?\d+/g);
  if (!matches) return [];
  return matches.map((p) => Number.parseFloat(p)).filter((n) => Number.isFinite(n));
}

export function getScrollOffsets({
  elapsedSeconds,
  enabled,
  slideAnimationSpeed,
  slideDirection,
}: {
  elapsedSeconds: number;
  enabled: boolean;
  slideAnimationSpeed: number;
  slideDirection: SlideDirection;
}): { x: number; y: number } {
  if (!enabled) return { x: 0, y: 0 };

  const speed = slideAnimationSpeed * 30;
  let deltaX = 0;
  let deltaY = 0;

  switch (slideDirection) {
    case "right":
      deltaX = -elapsedSeconds * speed;
      break;
    case "left":
      deltaX = elapsedSeconds * speed;
      break;
    case "down":
      deltaY = -elapsedSeconds * speed;
      break;
    case "up":
      deltaY = elapsedSeconds * speed;
      break;
    case "diagonal-down-right":
      deltaX = -elapsedSeconds * speed * 0.707;
      deltaY = -elapsedSeconds * speed * 0.707;
      break;
    case "diagonal-up-left":
      deltaX = elapsedSeconds * speed * 0.707;
      deltaY = elapsedSeconds * speed * 0.707;
      break;
  }

  return { x: deltaX, y: deltaY };
}

export function getMaxDevicePixelRatio({
  width,
  height,
  rawDevicePixelRatio = 1,
  maxPixels = 16_000_000,
}: {
  width: number;
  height: number;
  rawDevicePixelRatio?: number;
  maxPixels?: number;
}): number {
  const targetPixels = width * height * rawDevicePixelRatio * rawDevicePixelRatio;
  if (targetPixels <= maxPixels) return rawDevicePixelRatio;

  return Math.sqrt(maxPixels / (width * height));
}

