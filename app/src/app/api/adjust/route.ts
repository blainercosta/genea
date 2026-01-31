import { NextRequest, NextResponse } from "next/server";
import { adjustPhoto } from "@/lib/fal";
import { uploadToS3 } from "@/lib/s3";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/adjust
 * Apply adjustments to a restored photo
 */
export async function POST(request: NextRequest) {
  // Check rate limit
  const rateLimitResponse = checkRateLimit(request, "adjust", RATE_LIMITS.adjust);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { imageUrl, adjustments, customNote } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "URL da imagem não fornecida" },
        { status: 400 }
      );
    }

    if (!adjustments || adjustments.length === 0) {
      return NextResponse.json(
        { success: false, error: "Nenhum ajuste selecionado" },
        { status: 400 }
      );
    }

    console.log("Starting adjustment for:", imageUrl);
    console.log("Adjustments:", adjustments);
    console.log("Custom note:", customNote);

    // Apply adjustments via fal.ai
    const result = await adjustPhoto(imageUrl, adjustments, customNote);
    const falUrl = result.image.url;

    console.log("Adjustment complete from fal.ai:", falUrl);

    // Download adjusted image from fal.ai and upload to S3
    let finalUrl = falUrl;

    const hasS3 = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

    if (hasS3) {
      try {
        const imageResponse = await fetch(falUrl);
        if (!imageResponse.ok) {
          throw new Error("Failed to fetch adjusted image from fal.ai");
        }

        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        const contentType = result.image.content_type || "image/png";
        const fileName = `adjusted-${Date.now()}.${contentType.split("/")[1] || "png"}`;

        finalUrl = await uploadToS3(imageBuffer, fileName, contentType);
        console.log("Saved to S3:", finalUrl);
      } catch (s3Error) {
        console.error("Failed to save to S3, using fal.ai URL:", s3Error);
      }
    }

    return NextResponse.json({
      success: true,
      status: "completed",
      adjustedUrl: finalUrl,
    });
  } catch (error) {
    console.error("Adjust error:", error);
    return NextResponse.json(
      {
        success: false,
        status: "failed",
        error: error instanceof Error ? error.message : "Erro ao ajustar. Tente novamente.",
      },
      { status: 500 }
    );
  }
}
