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

// In-memory store for rate limiting (fallback when Redis not configured)
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
 * SECURITY: Validates forwarded headers to prevent IP spoofing
 */
function getClientIp(request: NextRequest): string {
  // In Vercel, x-forwarded-for is trusted and set by the platform
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Take the first IP (client's real IP)
    const ip = forwarded.split(",")[0].trim();
    // Basic validation - should be a valid IP format
    if (ip && /^[\d.:a-fA-F]+$/.test(ip)) {
      return ip;
    }
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp && /^[\d.:a-fA-F]+$/.test(realIp)) {
    return realIp;
  }

  // Fallback
  return "unknown";
}

/**
 * Check if Upstash Redis is configured
 */
function isRedisConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

/**
 * Check rate limit using Upstash Redis (distributed)
 */
async function checkRateLimitRedis(
  key: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;

  const now = Date.now();
  const windowKey = `ratelimit:${key}:${Math.floor(now / config.windowMs)}`;

  try {
    // Increment counter with expiry
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", windowKey],
        ["PEXPIRE", windowKey, config.windowMs],
      ]),
    });

    if (!response.ok) {
      console.error("Redis rate limit error:", response.status);
      // Fallback to allow on Redis error (fail open for availability)
      return { allowed: true, remaining: config.limit, resetTime: now + config.windowMs };
    }

    const results = await response.json();
    const count = results[0]?.result || 1;
    const remaining = Math.max(0, config.limit - count);
    const resetTime = (Math.floor(now / config.windowMs) + 1) * config.windowMs;

    return {
      allowed: count <= config.limit,
      remaining,
      resetTime,
    };
  } catch (error) {
    console.error("Redis rate limit error:", error);
    // Fallback to allow on error
    return { allowed: true, remaining: config.limit, resetTime: now + config.windowMs };
  }
}

/**
 * Check rate limit using in-memory store (fallback)
 */
function checkRateLimitMemory(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  cleanup();

  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    // First request or window expired
    const resetTime = now + config.windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: config.limit - 1, resetTime };
  }

  // Within window
  if (entry.count >= config.limit) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  // Increment
  entry.count += 1;
  rateLimitStore.set(key, entry);
  return {
    allowed: true,
    remaining: config.limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Check rate limit for a request
 * Uses Redis if configured, falls back to in-memory
 * Returns null if allowed, or a NextResponse if rate limited
 */
export async function checkRateLimit(
  request: NextRequest,
  endpoint: string,
  config: RateLimitConfig
): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const key = `${endpoint}:${ip}`;

  let result: { allowed: boolean; remaining: number; resetTime: number };

  if (isRedisConfigured()) {
    result = await checkRateLimitRedis(key, config);
  } else {
    result = checkRateLimitMemory(key, config);
    // Log warning in production if Redis not configured
    if (process.env.NODE_ENV === "production") {
      console.warn("SECURITY: Rate limiting using in-memory store - configure UPSTASH_REDIS for distributed rate limiting");
    }
  }

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);

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
          "X-RateLimit-Reset": String(Math.ceil(result.resetTime / 1000)),
        },
      }
    );
  }

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
  // SECURITY: Combined with strong auth codes, this limits brute force
  authVerify: { limit: 5, windowMs: 60 * 1000 },
} as const;
