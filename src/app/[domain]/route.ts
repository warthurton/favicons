import { parseSize } from "@/lib/presets";
import { handleFaviconRequest } from "@/lib/handler";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { domain: string } }
) => {
  const domain = params.domain;
  const searchParams = request.nextUrl.searchParams;
  const sizeParam = searchParams.get("size");

  // Parse and validate size parameter (supports both numbers and presets)
  const size = parseSize(sizeParam);

  return handleFaviconRequest(domain, size);
};
