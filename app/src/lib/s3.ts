import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "genea-photos";

/**
 * Upload a file to S3
 */
export async function uploadToS3(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `uploads/${Date.now()}-${fileName}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  // Return the public URL
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;
}

/**
 * Generate a presigned URL for uploading directly from browser
 */
export async function getPresignedUploadUrl(
  fileName: string,
  contentType: string
): Promise<{ uploadUrl: string; fileUrl: string }> {
  const key = `uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;

  return { uploadUrl, fileUrl };
}

/**
 * Generate a presigned URL for downloading
 */
export async function getPresignedDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
