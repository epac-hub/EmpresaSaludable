import { type AddressInfo, createServer } from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import { createApp } from "./app";

const servers: ReturnType<typeof createServer>[] = [];

async function request(path: string, init?: RequestInit) {
  const server = createServer(
    createApp({ allowedOrigins: ["https://empresasaludable.com"] })
  );
  servers.push(server);

  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address() as AddressInfo;
  return fetch(`http://127.0.0.1:${address.port}${path}`, init);
}

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      server =>
        new Promise<void>((resolve, reject) => {
          server.close(error => (error ? reject(error) : resolve()));
        })
    )
  );
});

describe("Vercel API app", () => {
  it("exposes a minimal health check with security headers", async () => {
    const response = await request("/api/health");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "ok" });
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("x-frame-options")).toBe("DENY");
  });

  it("allows credentialed requests from the configured frontend", async () => {
    const response = await request("/api/health", {
      headers: { Origin: "https://empresasaludable.com" },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("access-control-allow-origin")).toBe(
      "https://empresasaludable.com"
    );
    expect(response.headers.get("access-control-allow-credentials")).toBe(
      "true"
    );
  });

  it("rejects untrusted browser origins before API handlers run", async () => {
    const response = await request("/api/health", {
      headers: { Origin: "https://attacker.example" },
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "Origin not allowed",
    });
  });

  it("answers preflight requests for the configured frontend", async () => {
    const response = await request("/api/trpc/auth.me", {
      method: "OPTIONS",
      headers: { Origin: "https://empresasaludable.com" },
    });

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-methods")).toContain(
      "POST"
    );
  });
});
