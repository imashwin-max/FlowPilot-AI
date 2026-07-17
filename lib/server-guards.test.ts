import { describe, expect, it, beforeEach } from "vitest";
import { rateLimit, assertManagerAuthorized } from "./server-guards";

describe("rateLimit", () => {
  it("allows requests under the limit and blocks once exceeded", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, 3, 60_000).ok).toBe(true);
    }
    expect(rateLimit(key, 3, 60_000).ok).toBe(false);
  });

  it("tracks separate keys independently", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    expect(rateLimit(a, 1, 60_000).ok).toBe(true);
    expect(rateLimit(a, 1, 60_000).ok).toBe(false);
    expect(rateLimit(b, 1, 60_000).ok).toBe(true);
  });
});

describe("assertManagerAuthorized", () => {
  beforeEach(() => {
    delete process.env.MANAGER_ACCESS_CODE;
  });

  it("rejects requests with the wrong code when a code is configured", async () => {
    process.env.MANAGER_ACCESS_CODE = "correct-code";
    const request = new Request("https://example.com", { headers: { "x-manager-code": "wrong-code" } });
    const result = await assertManagerAuthorized(request);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(401);
  });

  it("allows requests with the correct code", async () => {
    process.env.MANAGER_ACCESS_CODE = "correct-code";
    const request = new Request("https://example.com", { headers: { "x-manager-code": "correct-code" } });
    expect(await assertManagerAuthorized(request)).toBeNull();
  });
});
