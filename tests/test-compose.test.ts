import { describe, expect, test } from "bun:test";

describe("Docker Compose Setup", () => {
  test("should start containers and verify health", async () => {
    // Test RPC endpoint
    const response = await fetch("http://localhost:58227", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: 2,
        jsonrpc: "2.0",
        method: "node_info",
        params: []
      })
    }).then(r => r.json());
    
    expect(response.result.version).toBeDefined();
  });
});
