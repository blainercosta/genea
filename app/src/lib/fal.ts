import type { FalRestoreResponse } from "@/types";

const FAL_API_KEY = process.env.FAL_KEY || "";
const FAL_API_URL = "https://fal.run/fal-ai/nano-banana-pro/edit";

/**
 * Prompt padrão para restauração profissional de fotos
 */
const RESTORATION_PROMPT =
  "professional photo restoration of vintage photograph, repair all physical damage including scratches cracks tears and stains, reconstruct missing areas seamlessly, preserve exact facial features and bone structure without AI beautification, sharp focus on facial details and eyes, authentic period-appropriate colorization with natural skin tones, film grain texture consistent with original era, archival quality output, photorealistic";

/**
 * Valida se a API key está configurada
 */
function validateApiKey(): void {
  if (!FAL_API_KEY) {
    throw new Error(
      "FAL_KEY não configurada. Adicione FAL_KEY ao arquivo .env.local"
    );
  }
}

interface RestoreOptions {
  isTrial?: boolean;
}

/**
 * Restore a photo using fal.ai Nano Banana Pro
 * This model edits and enhances images based on prompts
 *
 * Trial users get 1K resolution (~1080p)
 * Paid users get 2K resolution
 */
export async function restorePhoto(
  imageUrl: string,
  options: RestoreOptions = {}
): Promise<FalRestoreResponse> {
  validateApiKey();

  // Trial: 1K (~1080p), Paid: 2K (higher quality)
  const resolution = options.isTrial ? "1K" : "2K";

  const response = await fetch(FAL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Key ${FAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: RESTORATION_PROMPT,
      image_urls: [imageUrl],
      num_images: 1,
      resolution,
      output_format: "png",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`fal.ai API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  // Transform response to match our FalRestoreResponse type
  return {
    image: {
      url: data.images?.[0]?.url || "",
      width: data.images?.[0]?.width || 0,
      height: data.images?.[0]?.height || 0,
      content_type: data.images?.[0]?.content_type || "image/png",
    },
  };
}

/**
 * Map Portuguese adjustment options to English prompts
 */
const adjustmentPromptMap: Record<string, string> = {
  "Clarear mais": "brighten the image more",
  "Escurecer": "darken the image",
  "Mais contraste": "increase contrast",
  "Menos ruído": "reduce noise and grain",
  "Mais nitidez": "enhance sharpness and details",
  "Corrigir cores": "fix color balance and make colors more natural",
  "Remover manchas": "remove stains and blemishes",
  "Outro": "", // Custom note will be used
};

/**
 * Sanitize user input for prompt injection prevention
 * Removes potentially dangerous characters and limits length
 */
function sanitizePromptInput(input: string): string {
  return input
    // Remove control characters and special prompt markers
    .replace(/[\x00-\x1F\x7F]/g, "")
    // Remove potential prompt injection patterns
    .replace(/\b(ignore|disregard|forget|override|system|assistant|user|human)\b/gi, "")
    // Remove special characters that could be used for injection
    .replace(/[<>{}[\]\\|`]/g, "")
    // Limit length
    .slice(0, 200)
    .trim();
}

/**
 * Adjust a previously restored photo with specific modifications
 */
export async function adjustPhoto(
  imageUrl: string,
  adjustments: string[],
  customNote?: string
): Promise<FalRestoreResponse> {
  validateApiKey();

  // Build adjustment instructions in English
  const adjustmentInstructions = adjustments
    .map((adj) => adjustmentPromptMap[adj])
    .filter(Boolean)
    .join(", ");

  // Build the complete prompt
  let prompt = "adjust this restored photo: ";

  if (adjustmentInstructions) {
    prompt += adjustmentInstructions;
  }

  if (customNote) {
    const sanitizedNote = sanitizePromptInput(customNote);
    if (sanitizedNote) {
      prompt += adjustmentInstructions ? `. Also: ${sanitizedNote}` : sanitizedNote;
    }
  }

  // Add preservation instructions
  prompt += ". Preserve faces, features, and overall composition. Keep the restoration quality.";

  const response = await fetch(FAL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Key ${FAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      image_urls: [imageUrl],
      num_images: 1,
      resolution: "2K",
      output_format: "png",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`fal.ai API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  return {
    image: {
      url: data.images?.[0]?.url || "",
      width: data.images?.[0]?.width || 0,
      height: data.images?.[0]?.height || 0,
      content_type: data.images?.[0]?.content_type || "image/png",
    },
  };
}
