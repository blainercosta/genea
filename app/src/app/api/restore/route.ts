import { NextRequest, NextResponse } from "next/server";
import { restorePhoto } from "@/lib/fal";
import { uploadToS3 } from "@/lib/s3";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60 seconds for restoration

/**
 * POST /api/restore
 * Restore a photo synchronously and save to S3
 */
export async function POST(request: NextRequest) {
  // Check rate limit
  const rateLimitResponse = checkRateLimit(request, "restore", RATE_LIMITS.restore);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "URL da imagem não fornecida" },
        { status: 400 }
      );
    }

    console.log("Starting restoration for:", imageUrl);

    // Restore photo via fal.ai
    const result = await restorePhoto(imageUrl);
    const falUrl = result.image.url;

    console.log("Restoration complete from fal.ai:", falUrl);

    // Download restored image from fal.ai and upload to S3
    let finalUrl = falUrl;

    const hasS3 = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

    if (hasS3) {
      try {
        // Fetch image from fal.ai
        const imageResponse = await fetch(falUrl);
        if (!imageResponse.ok) {
          throw new Error("Failed to fetch restored image from fal.ai");
        }

        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        const contentType = result.image.content_type || "image/png";
        const fileName = `restored-${Date.now()}.${contentType.split("/")[1] || "png"}`;

        // Upload to S3
        finalUrl = await uploadToS3(imageBuffer, fileName, contentType);
        console.log("Saved to S3:", finalUrl);
      } catch (s3Error) {
        console.error("Failed to save to S3, using fal.ai URL:", s3Error);
        // Fall back to fal.ai URL if S3 upload fails
      }
    }

    return NextResponse.json({
      success: true,
      status: "completed",
      restoredUrl: finalUrl,
    });
  } catch (error) {
    console.error("Restore error:", error);
    return NextResponse.json(
      {
        success: false,
        status: "failed",
        error: error instanceof Error ? error.message : "Erro ao restaurar. Tente novamente.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/restore?requestId=xxx
 * Not needed for sync mode, kept for compatibility
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: false,
    error: "Use POST para restaurar",
  }, { status: 400 });
}
