import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * GET /api/download?url=xxx
 * Proxy download to avoid CORS issues with S3
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL não fornecida" },
      { status: 400 }
    );
  }

  try {
    // Fetch the image from S3
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    const contentType = response.headers.get("content-type") || "image/png";

    // Get filename from URL or generate one
    const urlParts = url.split("/");
    const originalFilename = urlParts[urlParts.length - 1] || `genea-restored-${Date.now()}.png`;
    const filename = originalFilename.includes("restored")
      ? originalFilename
      : `genea-restored-${Date.now()}.png`;

    // Return the image with download headers
    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
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
