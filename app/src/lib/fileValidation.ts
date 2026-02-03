/**
 * File type validation using magic bytes
 * SECURITY: Validates actual file content, not just MIME type header
 */

// Magic bytes for common image formats
const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  "image/heic": [
    // ftyp followed by heic, heix, mif1, etc.
    // HEIC files start with ftyp box at offset 4
  ],
  "image/heif": [],
};

// For HEIC/HEIF, we check for 'ftyp' at offset 4 and valid brand
const HEIC_BRANDS = ["heic", "heix", "mif1", "msf1", "hevc", "hevx"];

/**
 * Validate file content matches declared MIME type using magic bytes
 * @param buffer File content as Buffer
 * @param declaredType MIME type claimed by the client
 * @returns true if file content matches declared type
 */
export function validateFileMagicBytes(
  buffer: Buffer,
  declaredType: string
): boolean {
  if (buffer.length < 12) {
    return false; // File too small to validate
  }

  // Handle JPEG
  if (declaredType === "image/jpeg") {
    return (
      buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
    );
  }

  // Handle PNG
  if (declaredType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  // Handle HEIC/HEIF
  if (declaredType === "image/heic" || declaredType === "image/heif") {
    // Check for 'ftyp' at offset 4
    const ftyp = buffer.slice(4, 8).toString("ascii");
    if (ftyp !== "ftyp") {
      return false;
    }

    // Check brand at offset 8-12
    const brand = buffer.slice(8, 12).toString("ascii");
    return HEIC_BRANDS.includes(brand);
  }

  // Unknown type - reject
  return false;
}

/**
 * Get the actual file type from magic bytes
 * @param buffer File content as Buffer
 * @returns Detected MIME type or null if unknown
 */
export function detectFileType(buffer: Buffer): string | null {
  if (buffer.length < 12) {
    return null;
  }

  // Check JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // Check PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }

  // Check HEIC/HEIF
  const ftyp = buffer.slice(4, 8).toString("ascii");
  if (ftyp === "ftyp") {
    const brand = buffer.slice(8, 12).toString("ascii");
    if (HEIC_BRANDS.includes(brand)) {
      return "image/heic";
    }
  }

  return null;
}
