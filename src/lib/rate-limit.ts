import { AppError } from "@/lib/errors";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** In-memory limiter for a single instance; replace with Redis before horizontal scaling. */
export function enforceRateLimit(key: string, maxRequests = 10, windowMs = 60_000): void {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (bucket.count >= maxRequests) {
    throw new AppError("Prea multe încercări. Reîncercați într-un minut.", 429, "RATE_LIMITED");
  }

  bucket.count += 1;
}
