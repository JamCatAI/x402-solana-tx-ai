const localHits = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit({ key, windowMs, max }: { key: string; windowMs: number; max: number }) {
  const now = Date.now();
  const current = localHits.get(key);
  if (!current || current.expiresAt < now) {
    localHits.set(key, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }

  current.count += 1;
  localHits.set(key, current);
  return { allowed: current.count <= max, remaining: Math.max(0, max - current.count) };
}
