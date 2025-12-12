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
https://your-favicons-service/?domain=github.com
```

Returns a 302 redirect to GitHub's favicon (cached for fast subsequent requests).

### Get Resized Favicon

```
https://your-favicons-service/?domain=github.com&size=64
```

Returns a 64x64 pixel version of the favicon (cached separately).

### Common Sizes

- Small icons: `?domain=example.com&size=16`
- Standard icons: `?domain=example.com&size=32`
- Large icons: `?domain=example.com&size=64`
- Extra large: `?domain=example.com&size=128`
- Maximum size: `?domain=example.com&size=512`

## Deployment

Deploy your own instance to Vercel with persistent caching:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourselfhosted%2Ffavicons&project-name=favicons)

### Setup Requirements

1. Create a Vercel Blob store in your project
2. Add `BLOB_READ_WRITE_TOKEN` environment variable
3. Deploy!

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup instructions.
