import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

// Max file size: 20MB
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/heic", "image/heif"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Formato não suportado. Use JPG, PNG ou HEIC.",
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Arquivo muito grande. Máximo 20MB.",
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check if S3 is configured
    const hasS3 = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

    let url: string;

    if (hasS3) {
      // Upload to S3
      const { uploadToS3 } = await import("@/lib/s3");
      url = await uploadToS3(buffer, file.name, file.type);
    } else {
      // Local storage fallback for development
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      url = `/uploads/${fileName}`;
    }

    return NextResponse.json({
      success: true,
      url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao fazer upload. Tente novamente.",
      },
      { status: 500 }
    );
  }
}
