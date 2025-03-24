import type { GraphNode } from "fiber";
import { FIBER_RPC_URL, TESTNET_KNOWN_PEERS } from "./common/constants";
import { FiberRPC } from "./rpc/client";
import logger from "./utils/logger";

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

/**
 * This function connects to known peers in the CKB testnet.
 * 
 * @constant {number} totalAttempts - The total number of connection attempts made.
 * @constant {number} startTime - The start time of the peer connection waiting period.
 * @constant {BigInt} peerCount - The initial number of peers connected.
 * @constant {BigInt} successCount - The number of new peers connected.
 */
export async function connectKnowPeers() {
  console.info(require("figlet").textSync("Connect Known Peers"));

  const rpc = new FiberRPC(FIBER_RPC_URL);

  let totalAttempts = 0;
  /**
   * Attempts to connect to a testnet peer at the specified address.
   * 
   * @param addr - The address of the peer to connect to.
   * @returns A promise that resolves when the connection attempt is complete.
   * 
   * @throws Will log an error message if the connection attempt fails.
   */
  const connectPeer = async (addr: string) => {
    totalAttempts++;
    try {
      await rpc.connectPeer(addr, true);
      logger.info(`Connecting to testnet peer ${addr}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ err: errorMessage }, `Failed to connect to testnet peer ${addr}`);
    }
  }

  // all the peers from the graph
  const graphNodes = getGraphNodes();

  const connectJobs = TESTNET_KNOWN_PEERS.map(connectPeer);
  for (const node of await graphNodes) {
    for (const addr of node.addresses) {
      connectJobs.push(connectPeer(addr));
    }
  }
  await Promise.all(connectJobs);

  // wait until the peers are connected
  const peerCount = BigInt((await rpc.getNodeInfo()).peers_count)
  const startTime = Date.now();
  while (Date.now() - startTime < 10 * 1000) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const latestPeerCount = BigInt((await rpc.getNodeInfo()).peers_count);
    logger.info({ peerCount: latestPeerCount }, "Peers Count");

    if (latestPeerCount > peerCount) {
      break;
    }
    logger.info("Waiting for peers to be connected...");
  }

  const successCount = BigInt((await rpc.getNodeInfo()).peers_count) - peerCount;
  logger.info({ successCount }, `New peers count`);
}
