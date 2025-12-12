import { put, list } from "@vercel/blob";
import axios from "axios";

// Check if an icon is cached in Vercel Blob
export async function getCachedIcon(domain: string, size?: number): Promise<string | null> {
  const cacheKey = size ? `${domain}-${size}` : domain;

  try {
    // List blobs with the prefix
    const { blobs } = await list({
      prefix: `favicons/${cacheKey}`,
      limit: 1,
    });

    if (blobs.length > 0) {
      return blobs[0].url;
    }
    return null;
  } catch (error: unknown) {
    console.error("Error checking cached icon:", error);
    return null;
  }
}

// Cache an icon to Vercel Blob
export async function cacheIcon(
  domain: string,
  iconUrl: string,
  imageBuffer: Buffer,
  size?: number
): Promise<string> {
  const cacheKey = size ? `${domain}-${size}` : domain;
  const extension = iconUrl.split('.').pop()?.split('?')[0] || 'png';
  const filename = `favicons/${cacheKey}.${extension}`;

  try {
    const blob = await put(filename, imageBuffer, {
      access: "public",
      addRandomSuffix: false,
    });
    return blob.url;
  } catch (error: unknown) {
    console.error("Error caching icon to Vercel Blob:", error);
    throw error;
  }
}

// Fetch icon as buffer
export async function fetchIconBuffer(iconUrl: string): Promise<Buffer> {
  const response = await axios.get(iconUrl, {
    responseType: "arraybuffer",
    timeout: 5000,
    headers: {
      "user-agent":
        "Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
    },
  });
  return Buffer.from(response.data);
}
