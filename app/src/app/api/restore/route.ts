import { NextRequest, NextResponse } from "next/server";
import { restorePhoto } from "@/lib/fal";
import { uploadToS3 } from "@/lib/s3";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rateLimit";
import {
  getUserByEmail,
  createRestoration,
  updateRestorationStatus,
} from "@/lib/supabase";

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

  let restorationId: string | null = null;

  try {
    const body = await request.json();
    const { imageUrl, isTrial = false, email } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "URL da imagem não fornecida" },
        { status: 400 }
      );
    }

    console.log("Starting restoration for:", imageUrl, isTrial ? "(trial - 1K)" : "(paid - 2K)");

    // Get user from Supabase to save restoration record
    let userId: string | null = null;
    if (email) {
      const user = await getUserByEmail(email);
      if (user) {
        userId = user.id;

        // Create restoration record in Supabase
        const restoration = await createRestoration({
          userId: user.id,
          originalUrl: imageUrl,
          isTrial,
        });

        if (restoration) {
          restorationId = restoration.id;
          console.log("Created restoration record:", restorationId);
        }
      }
    }

    // Restore photo via fal.ai (trial gets 1K, paid gets 2K resolution)
    const result = await restorePhoto(imageUrl, { isTrial });
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

    // Update restoration record in Supabase with the result
    if (restorationId) {
      await updateRestorationStatus(restorationId, {
        status: "completed",
        restoredUrl: finalUrl,
      });
      console.log("Updated restoration record:", restorationId);
    }

    return NextResponse.json({
      success: true,
      status: "completed",
      restoredUrl: finalUrl,
      restorationId,
    });
  } catch (error) {
    console.error("Restore error:", error);

    // Update restoration record as failed if it was created
    if (restorationId) {
      await updateRestorationStatus(restorationId, { status: "failed" });
    }

    return NextResponse.json(
      {
        success: false,
        status: "failed",
        error: error instanceof Error ? error.message : "Erro ao restaurar. Tente novamente.",
        restorationId,
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
