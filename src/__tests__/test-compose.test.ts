import { describe, expect, test } from "bun:test";
import { FIBER_RPC_URL } from "../common/constants";

describe("Docker Compose Setup", () => {
  test("should start containers and verify health", async () => {
    // Test RPC endpoint
    const res = await fetch(FIBER_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: 2,
        jsonrpc: "2.0",
        method: "node_info",
        params: []
      })
    }).then(r => r.json());
    
    expect(res.result.version).toBeDefined();
  });
});
