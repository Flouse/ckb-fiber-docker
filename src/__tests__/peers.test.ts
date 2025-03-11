import { describe, expect, mock, test, beforeEach } from "bun:test";
import { getGraphNodes } from '../peers';

const originalFetch = global.fetch;

describe("getGraphNodes", () => {
  beforeEach(() => {
    // Reset fetch to original implementation
    global.fetch = originalFetch;
  });

  test("should fetch and return graph nodes successfully", async () => {
    const mockNodes = [
      { id: 1, address: 'node1' },
      { id: 2, address: 'node2' }
    ];

    global.fetch = mock(() => Promise.resolve({
      json: () => Promise.resolve(mockNodes)
    }));

    const result = await getGraphNodes();

    expect(fetch).toHaveBeenCalledWith(
      'https://testnet-api.explorer.nervos.org/api/v2/fiber/graph_nodes'
    );
    expect(result).toEqual(mockNodes);
  });

  test("should return valid data from real fetch", async () => {
    const result = await getGraphNodes();
    expect(result).toBeDefined();
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('meta');
    expect(result.meta).toHaveProperty('total');
    expect(result.meta).toHaveProperty('page_size');
  });

  // todo test parse peerAddr from getGraphNodes
  test("should parse peerAddr from getGraphNodes", async () => {
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
