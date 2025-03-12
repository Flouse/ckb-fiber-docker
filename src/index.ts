// figlet the project name
console.log(
  require("figlet").textSync(require("../package.json").name)
);


import { getGraphNodes } from "./peers";
import { FiberRPC } from "./rpc/client";
const rpc = new FiberRPC("http://localhost:58227");

// call get node info
const nodeInfo = await rpc.getNodeInfo();
console.log("Node Info:", nodeInfo);
console.log("Peers Count:", nodeInfo.peers_count);

// connect to all the peers from the graph
const graphNodes = await getGraphNodes();
console.log("Graph Nodes:", graphNodes);

for (const node of graphNodes) {
  for (const addr of node.addresses) {
    try {
      await rpc.connect_peer(addr, true);
    } catch (error) {
      console.error(`Failed to connect to peer ${addr}:`, error.message);
    }
    console.log(`Connected to peer ${addr}`);
  }
}

// check peers count again
const updatedNodeInfo = await rpc.getNodeInfo();
console.log("Updated Peers Count:", updatedNodeInfo.peers_count);
