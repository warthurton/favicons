# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Favicons is a Next.js-based favicon provider service that fetches and serves favicon images for any domain. The service accepts a domain parameter and optional size parameter, caches icons to Vercel Blob Storage, and returns a redirect to the (optionally resized) favicon URL.

**Usage**:
- `/github.com` returns a 302 redirect to GitHub's favicon (cached)
- `/github.com?size=medium` returns a 302 redirect to a 64x64 resized version (cached)
- `/github.com?size=128` returns a 302 redirect to a 128x128 resized version (cached)
- Legacy: `/?domain=github.com` still supported for backward compatibility

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Git Workflow for AI Agents

**IMPORTANT**: Before making any code changes, AI agents must create a feature branch.

### Branch Naming Convention
Use descriptive branch names with prefixes:
- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `chore/` - Maintenance tasks

Examples:
- `feature/icon-caching`
- `feature/size-presets`
- `fix/blob-storage-timeout`
- `refactor/typescript-improvements`

### Workflow Steps
1. **Before any edits**: Create a branch
   ```bash
   git checkout -b feature/descriptive-name
   ```

2. **During development**: Make changes and test
   ```bash
   npm run build    # Verify build works
   npm run lint     # Check for issues
   ```

3. **After completion**: Commit with clear message using [Conventional Commits](https://www.conventionalcommits.org/)
   ```bash
   git add .
   git commit -m "feat: add size presets for favicon resizing"
   ```
   See [docs/VERSIONING.md](docs/VERSIONING.md) for commit message format and automatic versioning.

4. **Never**:
   - Make changes directly on `main` branch
   - Commit without testing build/lint
   - Skip branch creation for code changes
   - Use non-conventional commit messages (breaks automatic versioning)

## Architecture

### Request Flow

1. **Entry Points**:
   - **[src/app/[domain]/route.ts](src/app/[domain]/route.ts)**: Path-based routing (e.g., `/github.com`)
     - Extracts domain from URL path parameter
     - Accepts optional `size` query parameter
   - **[src/app/route.ts](src/app/route.ts)**: Legacy query parameter support (e.g., `/?domain=github.com`)
     - Accepts `domain` query parameter (backward compatibility)
     - Accepts optional `size` query parameter
   - Both routes delegate to shared `handleFaviconRequest()` function

2. **Shared Handler** ([src/lib/handler.ts](src/lib/handler.ts)): Core favicon processing logic
   - Size parameter supports presets (tiny, small, medium, large, xlarge, xxlarge) or pixel values (1-512)
   - Checks Vercel Blob Storage cache first for previously fetched/resized icons
   - Implements in-memory caching via `faviconCache` Map for favicon URLs
   - Tries multiple URL prefixes (https://, http://, http://www.) to handle various domain formats
   - Fetches, optionally resizes, and caches icons to Vercel Blob
   - Returns 302 redirect to cached Blob URL or 404 if not found

3. **Favicon Fetching** ([src/fetchers/index.ts](src/fetchers/index.ts)): Two-tier fetching strategy
   - **Primary**: `fetchHTMLFaviconUrls()` - Parses HTML with cheerio to extract favicons from:
     - `<link rel="icon">`, `<link rel="shortcut icon">`, `<link rel="apple-touch-icon">`
     - `<meta itemprop="image">`
     - Falls back to `/favicon.ico`
   - **Fallback**: `fetchGoogleFaviconUrls()` - Uses Google's favicon service as last resort
   - Helper: `makeAbsoluteUrl()` converts relative URLs to absolute based on redirected base URL

4. **Caching** ([src/lib/cache.ts](src/lib/cache.ts)): Persistent storage via Vercel Blob
   - `getCachedIcon()` - Checks if icon exists in Blob storage
   - `cacheIcon()` - Uploads icon buffer to Blob with public access
   - `fetchIconBuffer()` - Downloads icon as Buffer for processing
   - Cache key format: `{domain}` or `{domain}-{size}` for resized versions

5. **Image Processing** ([src/lib/resize.ts](src/lib/resize.ts)): Sharp-based resizing
   - `resizeImage()` - Resizes icon to specified dimensions maintaining aspect ratio
   - Uses transparent background and "contain" fit mode
   - Outputs PNG format for consistent transparency support

6. **Size Presets** ([src/lib/presets.ts](src/lib/presets.ts)): Size preset handling
   - `parseSize()` - Parses size parameter (preset name or pixel value)
   - Preset mappings: tiny=16, small=32, medium=64, large=128, xlarge=256, xxlarge=512
   - Validates pixel values are between 1-512

### Key Technical Details

- **Persistent Caching**: Icons stored in Vercel Blob Storage for cross-deployment persistence
- **In-Memory Caching**: Favicon URLs cached in Map for faster lookup within same function instance
- **URL Handling**: Automatically follows redirects and uses the final URL's base for resolving relative favicon paths
- **Timeout**: 5-second timeout on HTTP requests to prevent hanging
- **User Agent**: Simulates iPad Safari to ensure compatibility with mobile-optimized sites
- **Image Processing**: Sharp library for high-quality resizing with transparent backgrounds
- **Size Presets**: User-friendly preset names (tiny, small, medium, large, xlarge, xxlarge)
- **Size Limits**: Resize parameter accepts values 1-512 pixels or preset names
- **Path Aliases**: `@/*` maps to `./src/*` (configured in [tsconfig.json](tsconfig.json))
- **Environment Variables**: Requires `BLOB_READ_WRITE_TOKEN` for Vercel Blob access

### Project Structure

```
src/
├── app/
│   ├── route.ts          # Root route (backward compatibility: /?domain=...&size=...)
│   ├── [domain]/
│   │   └── route.ts      # Dynamic path-based route (/github.com?size=...)
│   ├── layout.tsx        # Root layout with metadata
│   └── about/page.tsx    # About page (redirect destination when no domain provided)
├── fetchers/
│   └── index.ts          # Favicon fetching logic
└── lib/
    ├── cache.ts          # Vercel Blob caching utilities
    ├── resize.ts         # Sharp-based image resizing
    ├── presets.ts        # Size preset definitions and parsing
    └── handler.ts        # Shared favicon request handler (used by both routes)
```

## Deployment

Designed for Vercel deployment with Blob Storage integration. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for setup instructions.

**Required Setup**:
1. Create a Vercel Blob store in your project
2. Add `BLOB_READ_WRITE_TOKEN` environment variable
3. Deploy to Vercel

**Features**:
- Persistent caching across deployments
- Automatic icon resizing with `?size=` parameter
- 10-second function timeout for processing

## Documentation Guidelines for AI Agents

When working on this codebase, AI coding agents (Claude Code, Cursor, etc.) should follow these documentation practices:

### When to Create History Documentation

**IMPORTANT**: Only create history documentation files when starting a NEW feature branch.

#### Branch-Based Documentation Tracking
1. When creating a new feature branch, record the initial commit hash
2. Create ONE history document per branch that tracks all changes made on that branch
3. Update the same history file as work progresses on the branch
4. Only create a NEW history file when creating a NEW branch

**Example Workflow**:
```bash
# Create new branch
git checkout -b feature/new-feature

# Get the current commit hash (branch point)
git rev-parse HEAD
# Output: abc123def456...

# Create history file referencing this branch point
# docs/history/2025-12-12-new-feature.md
# Include commit hash in file metadata
```

**Do NOT create a new history file**:
- For every small change
- For documentation updates
- For minor refactoring within the same branch
- When continuing work on an existing branch

### Summary Files Location
All change summaries, improvement documents, and session notes should be stored in:
```
docs/history/YYYY-MM-DD-description.md
```

### Naming Convention
- Use ISO date format: `YYYY-MM-DD` (date the branch was created)
- Follow with a descriptive slug matching the branch name
- Examples:
  - Branch: `feature/improvements-and-size-presets` → File: `docs/history/2025-12-12-improvements-and-size-presets.md`
  - Branch: `feature/caching-feature` → File: `docs/history/2025-12-12-caching-feature.md`
  - Branch: `fix/typescript-bug` → File: `docs/history/2025-12-12-typescript-bug.md`

### What to Document
Create dated summary files for NEW branches that involve:
- Major feature additions
- Significant refactoring or improvements
- Bug fixes with complex changes
- Architecture decisions
- Performance optimizations
- Security enhancements

### File Structure
Each summary file should include:
1. **Title**: Brief description of changes
2. **Date**: ISO format date
3. **Branch**: Branch name this history tracks
4. **Branch Point**: Commit hash where the branch was created (for reference)
5. **Summary**: Overview of what was done
6. **Changes**: Detailed list of modifications
7. **Files Modified**: List of affected files with links
8. **Impact**: How this affects the codebase
9. **Testing**: Build/test status

### General Documentation
Non-historical documentation goes in:
- `docs/` - Permanent documentation (DEPLOYMENT.md, VERSIONING.md, etc.)
- `README.md` - Project overview and quick start
- `CLAUDE.md` - This file (AI agent instructions)

## Versioning

This project uses **automated semantic versioning** via GitHub Actions. Version bumps happen automatically when commits are pushed to `main` based on [Conventional Commits](https://www.conventionalcommits.org/) format.

**Quick Reference**:
- `feat:` → Minor version bump (0.1.0 → 0.2.0)
- `fix:` → Patch version bump (0.1.0 → 0.1.1)
- `feat!:` or `BREAKING CHANGE:` → Major version bump (0.1.0 → 1.0.0)
- Other commits (docs, chore, refactor) → No version bump

See [docs/VERSIONING.md](docs/VERSIONING.md) for complete details on commit message format, versioning strategy, and workflow configuration.
