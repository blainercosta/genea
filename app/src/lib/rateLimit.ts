import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in milliseconds */
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// Note: In serverless environments, each instance has its own memory
// For production at scale, consider using Redis or similar
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  rateLimitStore.forEach((entry, key) => {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  });
}

/**
 * Get client IP from request
 */
function getClientIp(request: NextRequest): string {
  // Try various headers that proxies/load balancers set
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback - may not be accurate behind proxies
  return "unknown";
}

/**
 * Check rate limit for a request
 * Returns null if allowed, or a NextResponse if rate limited
 */
export function checkRateLimit(
  request: NextRequest,
  endpoint: string,
  config: RateLimitConfig
): NextResponse | null {
  cleanup();

  const ip = getClientIp(request);
  const key = `${endpoint}:${ip}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    // First request or window expired - start fresh
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return null;
  }

  // Within window - check limit
  if (entry.count >= config.limit) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

    return NextResponse.json(
      {
        success: false,
        error: "Muitas requisições. Tente novamente em alguns segundos.",
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(config.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(entry.resetTime / 1000)),
        },
      }
    );
  }

  // Increment count
  entry.count += 1;
  rateLimitStore.set(key, entry);
  return null;
}

/**
 * Pre-configured rate limits for different endpoints
 */
export const RATE_LIMITS = {
  // Upload: 10 uploads per minute per IP
  upload: { limit: 10, windowMs: 60 * 1000 },

  // Restore: 5 restorations per minute per IP (expensive API calls)
  restore: { limit: 5, windowMs: 60 * 1000 },

  // Adjust: 5 adjustments per minute per IP (expensive API calls)
  adjust: { limit: 5, windowMs: 60 * 1000 },

  // PIX creation: 5 per minute per IP
  pix: { limit: 5, windowMs: 60 * 1000 },

  // Refund: 3 per minute per IP
  refund: { limit: 3, windowMs: 60 * 1000 },

  // Email: 5 per minute per IP
  email: { limit: 5, windowMs: 60 * 1000 },

  // Auth code: 3 per minute per IP (prevent brute force)
  authCode: { limit: 3, windowMs: 60 * 1000 },

  // Auth verify: 5 attempts per minute per IP
  authVerify: { limit: 5, windowMs: 60 * 1000 },
} as const;
