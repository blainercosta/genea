import { NextRequest, NextResponse } from "next/server";
import { addWatermark } from "@/lib/watermark";

export const runtime = "nodejs";

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

  try {
    // Fetch the image from S3
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
