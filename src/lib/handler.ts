import fetchFaviconUrls from "@/fetchers";
import { getCachedIcon, cacheIcon, fetchIconBuffer } from "@/lib/cache";
import { resizeImage } from "@/lib/resize";
import { NextResponse } from "next/server";

// faviconCache is a cache of favicon URLs for a given domain.
// The key is the domain and the value is an array of favicon URLs.
const faviconCache = new Map<string, string[]>();

/**
 * Handles favicon fetching, caching, and resizing
 * @param domain - The domain to fetch favicon for
 * @param size - Optional size (in pixels) to resize to
 * @returns NextResponse with redirect or error
 */
export async function handleFaviconRequest(
  domain: string,
  size?: number
): Promise<NextResponse> {
  // Check if we have a cached version in Vercel Blob (for both original and resized)
  try {
    const cachedBlobUrl = await getCachedIcon(domain, size);
    if (cachedBlobUrl) {
      return NextResponse.redirect(cachedBlobUrl, {
        status: 302,
      });
    }
  } catch (error: unknown) {
    // Continue if blob check fails
    console.error("Error checking Blob cache:", error);
  }

  // Check in-memory cache for favicon URL
  if (faviconCache.has(domain)) {
    const faviconUrls = faviconCache.get(domain);
    if (faviconUrls && faviconUrls.length > 0) {
      const faviconUrl = faviconUrls[0];

      try {
        const iconBuffer = await fetchIconBuffer(faviconUrl);

        if (size) {
          // Resize and cache
          const resizedBuffer = await resizeImage(iconBuffer, size);
          const blobUrl = await cacheIcon(domain, faviconUrl, resizedBuffer, size);
          return NextResponse.redirect(blobUrl, {
            status: 302,
          });
        } else {
          // Cache original and return
          const blobUrl = await cacheIcon(domain, faviconUrl, iconBuffer);
          return NextResponse.redirect(blobUrl, {
            status: 302,
          });
        }
      } catch (error: unknown) {
        console.error("Error processing cached icon:", error);
        // Fall back to original URL
        return NextResponse.redirect(faviconUrl, {
          status: 302,
        });
      }
    }
  }

  // Fetch favicon URL
  let faviconUrl = "";
  for (const urlPrefix of ["https://", "http://", , "http://www.", , "http://www."]) {
    try {
      const faviconUrls = await fetchFaviconUrls(`${urlPrefix}${domain}`);
      if (faviconUrls.length > 0) {
        faviconCache.set(domain, faviconUrls);
        faviconUrl = faviconUrls[0];
      }
    } catch (error: unknown) {
      // Ignore errors for individual URL attempts
      console.error(`Error fetching favicon for ${urlPrefix}${domain}:`, error);
    }
    if (faviconUrl) {
      break;
    }
  }

  if (!faviconUrl) {
    return new Response("Not Found", {
      status: 404,
    }) as NextResponse;
  }

  // Fetch and cache the icon
  try {
    const iconBuffer = await fetchIconBuffer(faviconUrl);

    if (size) {
      // Resize and cache
      const resizedBuffer = await resizeImage(iconBuffer, size);
      const blobUrl = await cacheIcon(domain, faviconUrl, resizedBuffer, size);
      return NextResponse.redirect(blobUrl, {
        status: 302,
      });
    } else {
      // Cache original size
      const blobUrl = await cacheIcon(domain, faviconUrl, iconBuffer);
      return NextResponse.redirect(blobUrl, {
        status: 302,
      });
    }
  } catch (error: unknown) {
    console.error("Error caching icon:", error);
    // Fall back to redirecting to original URL
    return NextResponse.redirect(faviconUrl, {
      status: 302,
    });
  }
}
