# Copilot Instructions for Favicons

## Project Overview

Next.js favicon provider service that fetches, caches, and optionally resizes favicons for any domain. Uses Vercel Blob Storage for persistent caching and Sharp for image processing.

**Request flow**: URL path → handler → cache check → fetch → resize (optional) → cache → 302 redirect

## Architecture & Data Flow

### Entry Points & Routing
- **[../src/app/[domain]/route.ts](../src/app/[domain]/route.ts)**: Primary route (`/github.com?size=medium`)
- **[../src/app/route.ts](../src/app/route.ts)**: Legacy route (`/?domain=github.com&size=medium`)
- Both delegate to `handleFaviconRequest()` in [../src/lib/handler.ts](../src/lib/handler.ts)

### Core Components
1. **Handler** ([../src/lib/handler.ts](../src/lib/handler.ts)): Central orchestrator
   - Checks Vercel Blob cache first (original or resized versions)
   - Uses in-memory `Map<string, string[]>` for favicon URL caching
   - Tries multiple URL prefixes: `https://`, `http://`, `http://www.`
   - Returns 302 redirect to cached Blob URL or 404

2. **Fetchers** ([../src/fetchers/index.ts](../src/fetchers/index.ts)): Two-tier fetch strategy
   - **Primary**: Parses HTML with cheerio for `<link rel="icon">`, `<link rel="apple-touch-icon">`, `<meta itemprop="image">`, fallback to `/favicon.ico`
   - **Fallback**: Google favicon service (`t2.gstatic.com/faviconV2`)
   - `makeAbsoluteUrl()`: Converts relative URLs using redirected base URL

3. **Cache** ([../src/lib/cache.ts](../src/lib/cache.ts)): Vercel Blob operations
   - `getCachedIcon()`: Checks Blob with prefix `favicons/{domain}` or `favicons/{domain}-{size}`
   - `cacheIcon()`: Uploads to Blob with `access: "public"`, `addRandomSuffix: false`
   - `fetchIconBuffer()`: Downloads icon as Buffer for processing

4. **Resize** ([../src/lib/resize.ts](../src/lib/resize.ts)): Sharp image processing
   - Maintains aspect ratio with transparent background
   - Uses "contain" fit mode, outputs PNG

5. **Presets** ([../src/lib/presets.ts](../src/lib/presets.ts)): Size parameter parsing
   - Maps presets to pixels: `tiny=16, small=32, medium=64, large=128, xlarge=256, xxlarge=512`
   - Validates pixel values: 1-512 range

### Configuration
- **Path aliases**: `@/*` → `./src/*` (tsconfig.json)
- **Environment**: Requires `BLOB_READ_WRITE_TOKEN` for Vercel Blob
- **Timeouts**: 5s HTTP requests, 10s function execution (vercel.json)
- **User-Agent**: Simulates iPad Safari for mobile-optimized sites

## Development Workflow

### Required Before Changes
1. **Create feature branch** (never commit to `main`):
   ```bash
   git checkout -b feature/descriptive-name
   # Or: fix/, refactor/, docs/, chore/
   ```

2. **Test before committing**:
   ```bash
   npm run build    # Verify build succeeds
   npm run lint     # Check for linting issues
   ```

3. **Use Conventional Commits** (triggers auto-versioning):
   - `feat:` → minor bump (0.1.0 → 0.2.0)
   - `fix:` → patch bump (0.1.0 → 0.1.1)
   - `BREAKING CHANGE:` or `feat!:`/`fix!:` → major bump (1.0.0 → 2.0.0)
   - `docs:`, `chore:`, `refactor:` → no version bump
   - See [../docs/VERSIONING.md](../docs/VERSIONING.md)

### Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
```

## Key Implementation Patterns

### Adding New Size Presets
Update [../src/lib/presets.ts](../src/lib/presets.ts):
```typescript
export const SIZE_PRESETS = {
  tiny: 16,
  custom: 48,  // Add new preset here
  // ...
} as const;
```

### Cache Key Format
- Original: `favicons/{domain}.{ext}`
- Resized: `favicons/{domain}-{size}.{ext}`
- Example: `favicons/github.com-64.png`

### Error Handling Philosophy
- Continue on cache failures (log and proceed)
- Try multiple URL prefixes before failing
- Fall back to Google service if HTML parsing fails
- Return original URL if processing fails

### External Dependencies
- **@vercel/blob**: Persistent storage (requires token)
- **sharp**: Image resizing (external package in next.config.mjs)
- **cheerio**: HTML parsing for favicon extraction
- **axios**: HTTP requests with 5s timeout

## Documentation Conventions

When creating a new feature branch, optionally add history documentation to `docs/history/YYYY-MM-DD-description.md` matching branch name. Update same file as work progresses on that branch. Do NOT create new history files for every change.

### Syncing AI Instructions

This file and [../CLAUDE.md](../CLAUDE.md) should remain synchronized to ensure consistent code generation across different AI coding assistants. When updating architectural patterns, workflows, or conventions:
- Update **both files** with the same information
- Keep the core patterns identical (branching workflow, commit conventions, cache key formats, error handling)
- File-specific details can differ (CLAUDE.md may have Claude-specific context), but foundational guidance must match
