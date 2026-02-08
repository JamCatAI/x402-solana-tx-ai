import { NextRequest } from "next/server";

export function getRequestId() {
  return crypto.randomUUID();
}

export function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function safeSigPrefix(signature: string) {
  return `${signature.slice(0, 8)}...`;
}

export function nowMs() {
  return Date.now();
}
