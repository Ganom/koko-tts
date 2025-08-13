// composables/useIconPattern.ts

interface PatternItem {
  row: number;
  col: number;
  iconIndex: number;
  rotation: number;
  opacity: number;
  scale?: number;
}

interface PatternOptions {
  randomRotation?: boolean;
  randomOpacity?: boolean;
  baseOpacity?: number;
  minOpacity?: number;
  maxOpacity?: number;
  rotationRange?: number;
  seed?: number;
}

export function useIconPattern() {
  // Seeded random number generator for consistent patterns
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const generatePattern = (
    icons: string[],
    rows: number,
    columns: number,
    options: PatternOptions = {},
  ): PatternItem[] => {
    const {
      randomRotation = true,
      randomOpacity = true,
      baseOpacity = 0.15,
      minOpacity = 0.05,
      maxOpacity = 0.25,
      rotationRange = 45,
      seed = 12345,
    } = options;

    const pattern: PatternItem[] = [];
    let currentSeed = seed;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const iconIndex = (row * columns + col) % icons.length;

        // Generate random values using seeded random
        const rand1 = seededRandom(currentSeed++);
        const rand2 = seededRandom(currentSeed++);
        const rand3 = seededRandom(currentSeed++);

        // Calculate rotation
        let rotation = 0;
        if (randomRotation) {
          rotation = (rand1 - 0.5) * rotationRange * 2;
        }

        // Calculate opacity
        let opacity = baseOpacity;
        if (randomOpacity) {
          opacity = minOpacity + rand2 * (maxOpacity - minOpacity);
        }

        // Optional scale variation
        const scale = 0.9 + rand3 * 0.2; // 0.9 to 1.1

        pattern.push({
          row,
          col,
          iconIndex,
          rotation,
          opacity,
          scale,
        });
      }
    }

    return pattern;
  };

  const getIconComponent = (iconName: string, variant: "outline" | "solid" = "outline") => {
    // This is a helper function that would be used with dynamic imports
    // In the component, we'll directly import the icon sets
    return null;
  };

  const createDiagonalPattern = (
    icons: string[],
    size: number,
    options: PatternOptions = {},
  ): PatternItem[] => {
    const pattern: PatternItem[] = [];
    const diagonalOffset = 2; // Offset for diagonal arrangement

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const row = i;
        const col = (j + i * diagonalOffset) % size;
        const iconIndex = (i + j) % icons.length;

        pattern.push({
          row,
          col,
          iconIndex,
          rotation: options.randomRotation ? (Math.random() - 0.5) * 30 : 0,
          opacity: options.baseOpacity || 0.15,
        });
      }
    }

    return pattern;
  };

  const createHexagonalPattern = (
    icons: string[],
    rows: number,
    columns: number,
    options: PatternOptions = {},
  ): PatternItem[] => {
    const pattern: PatternItem[] = [];
    const hexOffset = 0.5; // Offset for hexagonal arrangement

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const actualCol = row % 2 === 0 ? col : col + hexOffset;
        const iconIndex = (row * columns + col) % icons.length;

        pattern.push({
          row,
          col: actualCol,
          iconIndex,
          rotation: options.randomRotation ? (Math.random() - 0.5) * 45 : 0,
          opacity: options.baseOpacity || 0.15,
        });
      }
    }

    return pattern;
  };

  return {
    generatePattern,
    getIconComponent,
    createDiagonalPattern,
    createHexagonalPattern,
  };
}
