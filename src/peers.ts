import type { GraphNode } from "fiber";
import { FiberRPC } from "./rpc/client";
import { parsePeerAddr } from "./utils";

export async function getGraphNodes() {
  let allNodes: GraphNode[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`https://testnet-api.explorer.nervos.org/api/v2/fiber/graph_nodes?page=${page}`);
    const json = await res.json() as {
      data: {
        fiber_graph_nodes: GraphNode[];
      };
      meta: {
        page_size: number;
        total: number;
      };
    };
    allNodes = allNodes.concat(json.data.fiber_graph_nodes);
    hasMore = json.meta.page_size * page < json.meta.total;
    page++;
  }

  return allNodes;
}

// TODO
// export async function connectToPeers(rpc: FiberRPC, knownPeers: string[]) {
//   const connectedPeers = await rpc.getPeers();
//   console.log("Currently connected peers:", connectedPeers);

//   for (const peer of knownPeers) {
//     if (!connectedPeers.includes(peer)) {
//       try {
//         await rpc.connect(peer);
//         console.log(`Successfully connected to peer: ${peer}`);
//       } catch (error) {
//         console.error(`Failed to connect to peer ${peer}:`, error);
//       }
//     }
//   }

//   return await rpc.getPeers();
// }

// Usage example:
// const rpc = new FiberRPC("http://localhost:58227");
// const knownPeers = ["peer1", "peer2"];
// await connectToPeers(rpc, knownPeers);
