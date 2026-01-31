import sharp from "sharp";

// Logo SVG with white color and opacity for watermark
const LOGO_SVG = `
<svg width="60" height="84" viewBox="0 0 458 640" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M228.571 0L265.522 199.043L457.143 131.379L302.472 262.759L457.143 394.138L265.522 326.474L228.571 640L191.621 326.474L0 394.138L154.671 262.759L0 131.379L191.621 199.043L228.571 0Z" fill="white" fill-opacity="0.35"/>
</svg>
`;

// Text SVG for "feito no genea.cc"
const TEXT_SVG = `
<svg width="120" height="20" xmlns="http://www.w3.org/2000/svg">
  <text x="60" y="14" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="500" fill="white" fill-opacity="0.35">feito no genea.cc</text>
</svg>
`;

/**
 * Creates a tiled watermark pattern for the given image dimensions
 * Each tile contains the logo + text "feito no genea.cc"
 */
async function createWatermarkPattern(
  width: number,
  height: number
): Promise<Buffer> {
  const logoWidth = 60;
  const logoHeight = 84;
  const textWidth = 120;
  const textHeight = 20;
  const tileHeight = logoHeight + textHeight + 8; // logo + gap + text
  const spacing = 100; // Space between tiles
  const stepX = textWidth + spacing;
  const stepY = tileHeight + spacing;

  // Calculate how many tiles fit
  const cols = Math.ceil(width / stepX) + 1;
  const rows = Math.ceil(height / stepY) + 1;

  // Create buffers for logo and text
  const logoBuffer = Buffer.from(LOGO_SVG);
  const textBuffer = Buffer.from(TEXT_SVG);

  // Create composite operations for tiled pattern
  const composites: sharp.OverlayOptions[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Offset every other row for diagonal effect
      const offsetX = row % 2 === 0 ? 0 : stepX / 2;
      const baseX = Math.round(col * stepX + offsetX - stepX / 2);
      const baseY = Math.round(row * stepY - stepY / 2);

      // Add logo (centered in tile)
      const logoX = baseX + (textWidth - logoWidth) / 2;
      const logoY = baseY;

      if (logoX < width && logoY < height && logoX > -logoWidth && logoY > -logoHeight) {
        composites.push({
          input: logoBuffer,
          top: Math.max(0, logoY),
          left: Math.max(0, Math.round(logoX)),
        });
      }

      // Add text below logo
      const textX = baseX;
      const textY = baseY + logoHeight + 8;

      if (textX < width && textY < height && textX > -textWidth && textY > -textHeight) {
        composites.push({
          input: textBuffer,
          top: Math.max(0, textY),
          left: Math.max(0, textX),
        });
      }
    }
  }

  // Create transparent canvas and add all logos
  const pattern = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer();

  return pattern;
}

const MAX_DIMENSION = 1024;

/**
 * Adds a watermark pattern to an image
 * Resizes to max 1K to save costs
 * Accepts Uint8Array or Buffer for compatibility
 * Returns Uint8Array for web API compatibility
 */
export async function addWatermark(
  imageData: Uint8Array | Buffer
): Promise<Uint8Array> {
  // Get image metadata
  const metadata = await sharp(imageData).metadata();
  const originalWidth = metadata.width || MAX_DIMENSION;
  const originalHeight = metadata.height || MAX_DIMENSION;

  // Calculate resize dimensions (max 1K, maintain aspect ratio)
  let width = originalWidth;
  let height = originalHeight;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    if (width > height) {
      height = Math.round((height / width) * MAX_DIMENSION);
      width = MAX_DIMENSION;
    } else {
      width = Math.round((width / height) * MAX_DIMENSION);
      height = MAX_DIMENSION;
    }
  }

  // Create watermark pattern
  const watermarkPattern = await createWatermarkPattern(width, height);

  // Resize image (if needed) and composite watermark
  const watermarkedBuffer = await sharp(imageData)
    .resize(width, height, { fit: "inside", withoutEnlargement: true })
    .composite([
      {
        input: watermarkPattern,
        blend: "over",
      },
    ])
    .png()
    .toBuffer();

  // Convert to Uint8Array for web API compatibility
  return new Uint8Array(watermarkedBuffer);
}
