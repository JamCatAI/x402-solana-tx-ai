import { Redis } from "@upstash/redis";

const fallback = new Map<string, { value: string; expiresAt: number }>();

const redis = process.env.REDIS_URL && process.env.REDIS_TOKEN
  ? new Redis({ url: process.env.REDIS_URL, token: process.env.REDIS_TOKEN })
  : null;

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (redis) {
    const out = await redis.get<T>(key);
    return out || null;
  }
  const item = fallback.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    fallback.delete(key);
    return null;
  }
  return JSON.parse(item.value) as T;
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  if (redis) {
    await redis.set(key, value, { ex: ttlSeconds });
    return;
  }
  fallback.set(key, { value: JSON.stringify(value), expiresAt: Date.now() + ttlSeconds * 1000 });
}
