# 🎨 Favicons

An open-source and free favicon provider with caching and resizing support.

## Features

- 🎯 Fetch favicons from any domain
- 💾 Persistent caching via Vercel Blob Storage
- 📏 On-the-fly image resizing
- ⚡ Fast response times with intelligent caching
- 🆓 Free and open-source

## Usage Examples

### Get Original Favicon

```
https://your-favicons-service/github.com
```

Returns a 302 redirect to GitHub's favicon (cached for fast subsequent requests).

### Get Resized Favicon

```
https://your-favicons-service/github.com?size=medium
```

Returns a 64x64 pixel version of the favicon (cached separately).

### Size Presets

Use convenient preset names instead of pixel values:

- `/example.com?size=tiny` - 16x16 pixels
- `/example.com?size=small` - 32x32 pixels
- `/example.com?size=medium` - 64x64 pixels
- `/example.com?size=large` - 128x128 pixels
- `/example.com?size=xlarge` - 256x256 pixels
- `/example.com?size=xxlarge` - 512x512 pixels

Or use exact pixel values (1-512):

- `/example.com?size=48` - 48x48 pixels
- `/example.com?size=96` - 96x96 pixels

## Deployment

Deploy your own instance to Vercel with persistent caching:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourselfhosted%2Ffavicons&project-name=favicons)

### Setup Requirements

1. Create a Vercel Blob store in your project
2. Add `BLOB_READ_WRITE_TOKEN` environment variable
3. Deploy!

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed setup instructions.
