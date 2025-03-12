// Figlet the project name
console.log(
  require("figlet").textSync(require("../package.json").name)
);


import { getGraphNodes } from "./peers";
import { FiberRPC } from "./rpc/client";
const rpcUrl = process.env["FIBER_RPC_URL"] ?? "http://localhost:58227";
const rpc = new FiberRPC(rpcUrl);

// call get node info
const nodeInfo = await rpc.getNodeInfo();
console.log("Node Info:", nodeInfo);
console.log("Peers Count:", nodeInfo.peers_count);

// connect to all the peers from the graph
const graphNodes = await getGraphNodes();
let successCount = 0;
let totalAttempts = 0;
for (const node of graphNodes) {
  for (const addr of node.addresses) {
    totalAttempts++;
    try {
      await rpc.connectPeer(addr, true);
      successCount++;
      console.log(`Connected to peer ${addr}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Failed to connect to peer ${addr}:`, errorMessage);
    }
  }
}

const successRate = (successCount / totalAttempts) * 100;
console.log(`Successfully connected to ${successRate.toFixed(2)}% of peers (${successCount}/${totalAttempts})`);

// check peers count again
const updatedNodeInfo = await rpc.getNodeInfo();
console.log("Updated Peers Count:", updatedNodeInfo.peers_count);
