// Best-effort in-memory limiter (per server instance). Add Upstash/Vercel KV later for strict limits.
const hits = new Map<string, number[]>();
export function limited(key: string, max = 12, windowMs = 60_000) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now); hits.set(key, arr);
  return arr.length > max;
}
export const ipOf = (req: Request) => req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
