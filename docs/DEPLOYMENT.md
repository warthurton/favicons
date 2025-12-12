# Deployment Guide

This guide covers deploying the Favicons service to Vercel with caching and resizing features.

## Prerequisites

- Vercel account
- GitHub repository connected to Vercel

## Vercel Blob Storage Setup

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Create Database** → **Blob**
3. Create a new Blob store
4. Copy the `BLOB_READ_WRITE_TOKEN` environment variable
5. Add it to your Vercel project's environment variables

## Environment Variables

Add the following environment variable in your Vercel project settings:

```
BLOB_READ_WRITE_TOKEN=vercel_blob_***
```

## Features

### Icon Caching

Icons are automatically cached to Vercel Blob Storage for persistent storage across deployments:
- First request fetches the icon and stores it in Blob
- Subsequent requests serve from Blob (much faster)
- Cache persists across deployments and cold starts

### Icon Resizing

Add a `size` parameter to resize icons:

```
/?domain=github.com&size=64
```

- Valid sizes: 1-512 pixels
- Icons are resized maintaining aspect ratio with transparent background
- Resized versions are cached separately from originals

## Usage Examples

```
# Original size (cached)
/?domain=github.com

# 32x32 pixels (cached)
/?domain=github.com&size=32

# 128x128 pixels (cached)
/?domain=github.com&size=128
```

## Deployment

Push to your main branch and Vercel will automatically deploy:

```bash
git push origin main
```

## Cost Considerations

- **Blob Storage**: Free tier includes 100GB bandwidth/month
- **Function Duration**: Set to 10 seconds max for fetching/processing
- Cached icons reduce API calls and function execution time significantly

## Monitoring

Monitor your Blob storage usage at:
- Vercel Dashboard → Your Project → Storage → Blob
