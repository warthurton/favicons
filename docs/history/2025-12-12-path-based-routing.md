# Path-Based Routing Feature

**Date**: 2025-12-12

## Summary

Added cleaner URL structure by supporting path-based routing (`/domain.com`) instead of query parameters (`?domain=domain.com`). The old query parameter approach is maintained for backward compatibility.

## Motivation

- **Cleaner URLs**: `/github.com` is simpler than `/?domain=github.com`
- **More RESTful**: Domain as a path parameter follows REST conventions
- **Easier to remember**: Shorter, cleaner URLs are more user-friendly
- **Backward Compatible**: Existing URLs continue to work

## Changes

### New Files

- **[src/app/[domain]/route.ts](../../src/app/[domain]/route.ts)**: Dynamic route handler for path-based domains
- **[src/lib/handler.ts](../../src/lib/handler.ts)**: Shared favicon request handler (DRY principle)

### Modified Files

- **[src/app/route.ts](../../src/app/route.ts)**:
  - Refactored to use shared `handleFaviconRequest()` function
  - Maintains backward compatibility with `?domain=` query parameter
  - Simplified from ~120 lines to ~20 lines

- **[README.md](../../README.md)**:
  - Updated all examples to use path-based syntax
  - Changed from `/?domain=example.com` to `/example.com`
  - Cleaner, more modern documentation

## URL Formats

### New Path-Based (Recommended)
```
/github.com                    # Original favicon
/github.com?size=medium        # 64x64 resized
/github.com?size=128           # 128x128 custom size
```

### Legacy Query Parameter (Still Supported)
```
/?domain=github.com            # Original favicon
/?domain=github.com&size=medium # 64x64 resized
```

## Technical Implementation

### Route Structure
```
src/app/
├── route.ts           # Root route (backward compatibility)
├── [domain]/
│   └── route.ts       # Dynamic route (new path-based)
└── about/
    └── page.tsx       # About page
```

### Shared Handler Pattern
Both routes use the same `handleFaviconRequest()` function from `src/lib/handler.ts`:

```typescript
// src/app/[domain]/route.ts
export const GET = async (request, { params }) => {
  const domain = params.domain;
  const size = parseSize(request.nextUrl.searchParams.get("size"));
  return handleFaviconRequest(domain, size);
};

// src/app/route.ts (backward compatibility)
export const GET = async (request) => {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return redirect("/about");
  const size = parseSize(request.nextUrl.searchParams.get("size"));
  return handleFaviconRequest(domain, size);
};
```

## Benefits

1. **Code Reusability**: Shared handler eliminates ~100 lines of duplicated code
2. **Maintainability**: Single source of truth for favicon logic
3. **User Experience**: Cleaner URLs are easier to share and remember
4. **Backward Compatibility**: No breaking changes for existing users
5. **RESTful Design**: Follows modern API conventions

## Examples

### Before
```
https://favicons.vercel.app/?domain=github.com&size=medium
https://favicons.vercel.app/?domain=stackoverflow.com&size=large
```

### After
```
https://favicons.vercel.app/github.com?size=medium
https://favicons.vercel.app/stackoverflow.com?size=large
```

## Testing

- ✅ Build passes successfully
- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ Dynamic route `/[domain]` detected in build
- ✅ Backward compatibility maintained
- ✅ Size parameters work with both formats

## Migration

No migration required! Both URL formats work simultaneously:
- New users can use the cleaner path-based format
- Existing URLs with `?domain=` continue to work
- Documentation shows only the new format to encourage adoption

## Future Considerations

Potential enhancements:
- Subdomain support: `github-com.favicons.app` → `github.com` favicon
- Nested paths: `/github.com/microsoft` for org-specific icons
- Format specification: `/github.com.svg` for SVG passthrough
