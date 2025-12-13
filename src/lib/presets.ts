// Size presets for common favicon dimensions
export const SIZE_PRESETS = {
  tiny: 16,
  small: 32,
  medium: 64,
  large: 128,
  xlarge: 256,
  xxlarge: 512,
} as const;

export type SizePreset = keyof typeof SIZE_PRESETS;

/**
 * Parse size parameter - accepts either a number (1-512) or a preset name
 * @param sizeParam - The size parameter from query string
 * @returns The resolved pixel size, or undefined if invalid
 */
export function parseSize(sizeParam: string | null): number | undefined {
  if (!sizeParam) {
    return undefined;
  }

  // Check if it's a preset name
  const lowerParam = sizeParam.toLowerCase();
  if (lowerParam in SIZE_PRESETS) {
    return SIZE_PRESETS[lowerParam as SizePreset];
  }

  // Try parsing as a number
  const parsedSize = parseInt(sizeParam, 10);
  if (isNaN(parsedSize) || parsedSize <= 0 || parsedSize > 512) {
    return undefined;
  }

  return parsedSize;
}
