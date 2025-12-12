import { parseSize } from "@/lib/presets";
import { handleFaviconRequest } from "@/lib/handler";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  const sizeParam = searchParams.get("size");

  // Backward compatibility: support ?domain= query parameter
  if (!domain) {
    const redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}/about`;
    return NextResponse.redirect(redirectUrl);
  }

  // Parse and validate size parameter (supports both numbers and presets)
  const size = parseSize(sizeParam);

  return handleFaviconRequest(domain, size);
};
