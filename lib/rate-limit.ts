/**
 * In-memory IP rate limiter for the contact form API route.
 *
 * NOTE FOR PRODUCTION:
 * In-memory rate limits are per server instance (or per serverless container).
 * For production deployments on serverless platforms (e.g. Vercel, AWS Lambda),
 * replace this in-memory Map with Upstash Redis (@upstash/ratelimit)
 * behind the same rateLimit(ip) function signature.
 */

const WINDOW_1_HOUR_MS = 60 * 60 * 1000;
const BURST_WINDOW_MS = 20 * 1000;
const MAX_PER_HOUR = 5;
const MAX_KEYS = 5000;

// Stores IP -> array of request timestamps (epoch ms)
const ipTimestampsMap = new Map<string, number[]>();

export interface RateLimitResult {
  success: boolean;
  retryAfter?: number; // seconds
}

export function rateLimit(ip: string): RateLimitResult {
  const now = Date.now();

  // 1. Periodic cleanup: prune timestamps older than 1 hour on each call
  for (const [key, timestamps] of ipTimestampsMap.entries()) {
    const valid = timestamps.filter((t) => now - t < WINDOW_1_HOUR_MS);
    if (valid.length === 0) {
      ipTimestampsMap.delete(key);
    } else {
      ipTimestampsMap.set(key, valid);
    }
  }

  // Hard cap of 5000 keys: if still over 5000, prune the earliest map keys
  if (ipTimestampsMap.size >= MAX_KEYS) {
    const keysToDelete = Array.from(ipTimestampsMap.keys()).slice(
      0,
      ipTimestampsMap.size - MAX_KEYS + 100
    );
    for (const k of keysToDelete) {
      ipTimestampsMap.delete(k);
    }
  }

  const existing = ipTimestampsMap.get(ip) || [];
  const recent = existing.filter((t) => now - t < WINDOW_1_HOUR_MS);

  // Check 1: 1 request per 20 seconds burst limit
  const lastRequest = recent[recent.length - 1];
  if (lastRequest && now - lastRequest < BURST_WINDOW_MS) {
    const retryAfter = Math.max(1, Math.ceil((BURST_WINDOW_MS - (now - lastRequest)) / 1000));
    return { success: false, retryAfter };
  }

  // Check 2: 5 requests per hour window limit
  if (recent.length >= MAX_PER_HOUR) {
    const oldestInWindow = recent[0];
    const retryAfter = Math.max(1, Math.ceil((WINDOW_1_HOUR_MS - (now - oldestInWindow)) / 1000));
    return { success: false, retryAfter };
  }

  // Record this request
  recent.push(now);
  ipTimestampsMap.set(ip, recent);

  return { success: true };
}
