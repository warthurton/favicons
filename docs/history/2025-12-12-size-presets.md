# Size Presets Feature

**Date**: 2025-12-12

## Summary

Added user-friendly size presets for the favicon resizing API, allowing users to use memorable names like "small", "medium", "large" instead of remembering specific pixel values.

## Changes

### New Files

- **[src/lib/presets.ts](../../src/lib/presets.ts)**: Size preset definitions and parsing logic
  - `SIZE_PRESETS` object with 6 preset sizes
  - `parseSize()` function that accepts both preset names and pixel values
  - TypeScript types for type safety

### Modified Files

- **[src/app/route.ts](../../src/app/route.ts)**:
  - Import `parseSize` from presets module
  - Replace manual size parsing with `parseSize()` function
  - Simplified size validation logic

- **[README.md](../../README.md)**:
  - Added "Size Presets" section with all preset names
  - Updated examples to show preset usage
  - Changed primary example from `size=64` to `size=medium`

- **[CLAUDE.md](../../CLAUDE.md)**:
  - Updated request flow documentation
  - Added Size Presets section to architecture
  - Updated project structure diagram
  - Added presets to key technical details

## Size Preset Mappings

| Preset   | Pixels |
|----------|--------|
| tiny     | 16     |
| small    | 32     |
| medium   | 64     |
| large    | 128    |
| xlarge   | 256    |
| xxlarge  | 512    |

## Usage Examples

### With Presets
```
/?domain=github.com&size=small    # 32x32
/?domain=github.com&size=medium   # 64x64
/?domain=github.com&size=large    # 128x128
```

### With Pixel Values (still supported)
```
/?domain=github.com&size=48       # 48x48
/?domain=github.com&size=96       # 96x96
```

## Impact

### User Experience
- **Improved**: Users can use memorable preset names instead of pixel values
- **Backward Compatible**: All existing pixel-based URLs continue to work
- **Flexible**: Supports both presets and custom pixel values

### Implementation
- **Type Safe**: Full TypeScript support with proper types
- **Validated**: Invalid presets or out-of-range values return undefined
- **Case Insensitive**: Preset names work in any case (SMALL, small, Small)

## Testing

- ✅ Build passes successfully
- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ Backward compatible with existing pixel values
- ✅ All preset names validated

## Future Enhancements

Potential additions:
- Aspect ratio presets (square, wide, tall)
- Format-specific presets (favicon, apple-touch-icon, etc.)
- Device-specific presets (mobile, tablet, desktop)
