import { describe, expect, test } from "bun:test";
import { getGraphNodes } from '../peers';
import { parsePeerId } from '../utils';

interface GraphNodesResponse {
  data: {
    fiber_graph_nodes: any[];
  };
  meta: {
    page_size: number;
    total: number;
  };
}

describe("Peer tests", () => {
  test("should return valid data from getGraphNodes", async () => {
    const res = await fetch(`https://testnet-api.explorer.nervos.org/api/v2/fiber/graph_nodes?page=1&page_size=2`);
    const json = await res.json() as GraphNodesResponse;

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

  test("should parse peer ID from multiaddr", () => {
    const addr = "/ip4/1.2.3.4/tcp/18228/p2p/QmapgHFsZ6k8mk9gzzSxZekYUbneicrnafwTZZbydbfSYe";
    const peerId = parsePeerId(addr);
    expect(peerId).toEqual("QmapgHFsZ6k8mk9gzzSxZekYUbneicrnafwTZZbydbfSYe");
  });
});
