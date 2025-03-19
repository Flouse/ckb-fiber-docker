import { describe, expect, test } from "bun:test";
import { getGraphNodes } from '../peers';

describe("getGraphNodes", () => {
  test("should return valid data from real fetch", async () => {
    const res = await fetch(`https://testnet-api.explorer.nervos.org/api/v2/fiber/graph_nodes?page=1&page_size=2`);
    const json = await res.json();
    
    expect(json).toBeDefined();
    expect(json).toHaveProperty('data');
    expect(json).toHaveProperty('meta');
    
    const resultMeta = json.meta as { total: number; page_size: number };
    expect(resultMeta).toHaveProperty('total');
    expect(resultMeta).toHaveProperty('page_size');

    const nodes = await getGraphNodes();
    expect(nodes).toBeArray();
    expect(nodes.length).toBeGreaterThan(0);
    console.log(`Total nodes: ${nodes.length}`);
  });
});
