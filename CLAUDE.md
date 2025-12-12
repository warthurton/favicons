# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Favicons is a Next.js-based favicon provider service that fetches and serves favicon images for any domain. The service accepts a domain parameter and optional size parameter, caches icons to Vercel Blob Storage, and returns a redirect to the (optionally resized) favicon URL.

**Usage**:
- `/?domain=github.com` returns a 302 redirect to GitHub's favicon (cached)
- `/?domain=github.com&size=64` returns a 302 redirect to a 64x64 resized version (cached)

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Request Flow

1. **Entry Point** ([src/app/route.ts](src/app/route.ts)): GET handler at the root route
   - Accepts `domain` query parameter (required) and `size` query parameter (optional, 1-512 pixels)
   - Checks Vercel Blob Storage cache first for previously fetched/resized icons
   - Implements in-memory caching via `faviconCache` Map for favicon URLs
   - Tries multiple URL prefixes (https://, http://, http://www.) to handle various domain formats
   - Fetches, optionally resizes, and caches icons to Vercel Blob
   - Returns 302 redirect to cached Blob URL or 404 if not found

2. **Favicon Fetching** ([src/fetchers/index.ts](src/fetchers/index.ts)): Two-tier fetching strategy
   - **Primary**: `fetchHTMLFaviconUrls()` - Parses HTML with cheerio to extract favicons from:
     - `<link rel="icon">`, `<link rel="shortcut icon">`, `<link rel="apple-touch-icon">`
     - `<meta itemprop="image">`
     - Falls back to `/favicon.ico`
   - **Fallback**: `fetchGoogleFaviconUrls()` - Uses Google's favicon service as last resort
   - Helper: `makeAbsoluteUrl()` converts relative URLs to absolute based on redirected base URL

3. **Caching** ([src/lib/cache.ts](src/lib/cache.ts)): Persistent storage via Vercel Blob
   - `getCachedIcon()` - Checks if icon exists in Blob storage
   - `cacheIcon()` - Uploads icon buffer to Blob with public access
   - `fetchIconBuffer()` - Downloads icon as Buffer for processing
   - Cache key format: `{domain}` or `{domain}-{size}` for resized versions

4. **Image Processing** ([src/lib/resize.ts](src/lib/resize.ts)): Sharp-based resizing
   - `resizeImage()` - Resizes icon to specified dimensions maintaining aspect ratio
   - Uses transparent background and "contain" fit mode
   - Outputs PNG format for consistent transparency support

### Key Technical Details

- **Persistent Caching**: Icons stored in Vercel Blob Storage for cross-deployment persistence
- **In-Memory Caching**: Favicon URLs cached in Map for faster lookup within same function instance
- **URL Handling**: Automatically follows redirects and uses the final URL's base for resolving relative favicon paths
- **Timeout**: 5-second timeout on HTTP requests to prevent hanging
- **User Agent**: Simulates iPad Safari to ensure compatibility with mobile-optimized sites
- **Image Processing**: Sharp library for high-quality resizing with transparent backgrounds
- **Size Limits**: Resize parameter accepts values 1-512 pixels
- **Path Aliases**: `@/*` maps to `./src/*` (configured in [tsconfig.json](tsconfig.json))
- **Environment Variables**: Requires `BLOB_READ_WRITE_TOKEN` for Vercel Blob access

### Project Structure

```
src/
├── app/
│   ├── route.ts          # Main API endpoint (GET /?domain=...&size=...)
│   ├── layout.tsx        # Root layout with metadata
│   └── about/page.tsx    # About page (redirect destination when no domain provided)
├── fetchers/
│   └── index.ts          # Favicon fetching logic
└── lib/
    ├── cache.ts          # Vercel Blob caching utilities
    └── resize.ts         # Sharp-based image resizing
```

## Deployment

Designed for Vercel deployment with Blob Storage integration. See [DEPLOYMENT.md](DEPLOYMENT.md) for setup instructions.

**Required Setup**:
1. Create a Vercel Blob store in your project
2. Add `BLOB_READ_WRITE_TOKEN` environment variable
3. Deploy to Vercel

**Features**:
- Persistent caching across deployments
- Automatic icon resizing with `?size=` parameter
- 10-second function timeout for processing
