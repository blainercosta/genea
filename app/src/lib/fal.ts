import type { FalRestoreResponse } from "@/types";

const FAL_API_KEY = process.env.FAL_KEY || "";
const FAL_API_URL = "https://fal.run/fal-ai/nano-banana-pro/edit";

/**
 * Restore a photo using fal.ai Nano Banana Pro
 * This model edits and enhances images based on prompts
 */
export async function restorePhoto(imageUrl: string): Promise<FalRestoreResponse> {
  const response = await fetch(FAL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Key ${FAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: "professional photo restoration of vintage photograph, repair all physical damage including scratches cracks tears and stains, reconstruct missing areas seamlessly, preserve exact facial features and bone structure without AI beautification, sharp focus on facial details and eyes, authentic period-appropriate colorization with natural skin tones, film grain texture consistent with original era, archival quality output, photorealistic",
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
 * Alternative: Use fal.ai queue for long-running tasks
 * Returns a request ID that can be polled for status
 */
export async function restorePhotoAsync(imageUrl: string): Promise<{ request_id: string }> {
  const response = await fetch(`${FAL_API_URL}?fal_webhook=true`, {
    method: "POST",
    headers: {
      Authorization: `Key ${FAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: "professional photo restoration of vintage photograph, repair all physical damage including scratches cracks tears and stains, reconstruct missing areas seamlessly, preserve exact facial features and bone structure without AI beautification, sharp focus on facial details and eyes, authentic period-appropriate colorization with natural skin tones, film grain texture consistent with original era, archival quality output, photorealistic",
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

  return response.json();
}

/**
 * Check the status of an async restoration request
 */
export async function checkRestoreStatus(requestId: string): Promise<{
  status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  response?: FalRestoreResponse;
  error?: string;
}> {
  const response = await fetch(`https://queue.fal.run/fal-ai/nano-banana-pro/edit/requests/${requestId}/status`, {
    headers: {
      Authorization: `Key ${FAL_API_KEY}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`fal.ai status check error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Get the result of a completed restoration
 */
export async function getRestoreResult(requestId: string): Promise<FalRestoreResponse> {
  const response = await fetch(`https://queue.fal.run/fal-ai/nano-banana-pro/edit/requests/${requestId}`, {
    headers: {
      Authorization: `Key ${FAL_API_KEY}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`fal.ai result fetch error: ${response.status} - ${errorText}`);
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
 * Adjust a previously restored photo with specific modifications
 */
export async function adjustPhoto(
  imageUrl: string,
  adjustments: string[],
  customNote?: string
): Promise<FalRestoreResponse> {
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
    prompt += adjustmentInstructions ? `. Also: ${customNote}` : customNote;
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
