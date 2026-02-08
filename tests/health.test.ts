import { describe, expect, test } from "vitest";
import { GET } from "@/app/api/health/route";

describe("health route", () => {
  test("returns ok", async () => {
    const res = await GET();
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
  });
});
