import { describe, expect, mock, test, beforeEach } from "bun:test";
import { getGraphNodes } from '../peers';

const originalFetch = global.fetch;

describe("getGraphNodes", () => {
  test("should return valid data from real fetch", async () => {
    const result = await (await fetch(`https://testnet-api.explorer.nervos.org/api/v2/fiber/graph_nodes?page=1&page_size=2`)).json()
    
    expect(result).toBeDefined();
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('meta');
    expect(result.meta).toHaveProperty('total');
    expect(result.meta).toHaveProperty('page_size');

    const nodes = await getGraphNodes();
    expect(nodes).toBeArray();
    expect(nodes.length).toBeGreaterThan(0);
    console.log(`Total nodes: ${nodes.length}`);
  });

  // todo test parse peerAddr from getGraphNodes
  test.todo("should parse peerAddr from getGraphNodes", async () => {
    const mockNodes = [
      { id: 1, address: 'node1' },
      { id: 2, address: 'node2' }
    ];

    global.fetch = mock(() => Promise.resolve({
      json: () => Promise.resolve(mockNodes)
    }));

    const result = await getGraphNodes();
    expect(result).toEqual(mockNodes);
  });
});
