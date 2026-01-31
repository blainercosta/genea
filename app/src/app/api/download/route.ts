import { NextRequest, NextResponse } from "next/server";
import { addWatermark } from "@/lib/watermark";

export const runtime = "nodejs";

/**
 * Allowed hosts for download proxy (security whitelist)
 */
const ALLOWED_HOSTS = [
  "genea-photos.s3.sa-east-1.amazonaws.com",
  "genea-photos.s3.amazonaws.com",
  "fal.media", // fal.ai CDN
  "storage.googleapis.com", // if using GCS
];

/**
 * Validates if a URL is from an allowed host
 */
function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow HTTPS
    if (parsed.protocol !== "https:") {
      return false;
    }
    // Check against whitelist
    return ALLOWED_HOSTS.some(host => parsed.host === host || parsed.host.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

/**
 * GET /api/download?url=xxx&trial=true
 * Proxy download to avoid CORS issues with S3
 * Adds watermark if trial=true
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const isTrial = request.nextUrl.searchParams.get("trial") === "true";

  if (!url) {
    return NextResponse.json({ error: "URL não fornecida" }, { status: 400 });
  }

  // Security: Validate URL against whitelist
  if (!isAllowedUrl(url)) {
    return NextResponse.json({ error: "URL não permitida" }, { status: 403 });
  }

  try {
    // Fetch the image from allowed source
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const imageData = new Uint8Array(arrayBuffer);

    // Add watermark for trial users, otherwise use original
    const finalImage: Uint8Array = isTrial
      ? await addWatermark(imageData)
      : imageData;

    // Get filename from URL or generate one
    const urlParts = url.split("/");
    const originalFilename =
      urlParts[urlParts.length - 1] || `genea-restored-${Date.now()}.png`;
    const filename = originalFilename.includes("restored")
      ? originalFilename
      : `genea-restored-${Date.now()}.png`;

    // Return the image with download headers
    // Use slice to get a clean ArrayBuffer and cast for type safety
    const responseBuffer = finalImage.buffer.slice(
      finalImage.byteOffset,
      finalImage.byteOffset + finalImage.byteLength
    ) as ArrayBuffer;
    return new Response(responseBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Download proxy error:", error);
    return NextResponse.json(
      { error: "Erro ao baixar imagem" },
      { status: 500 }
    );
  }
}
