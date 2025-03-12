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

graphNodes.forEach((node) => {
  const multiAddr = node.addresses;
  multiAddr.forEach((addr) => {
    rpc.connect_peer(addr, true);
  });
});

// check peers count again
const updatedNodeInfo = await rpc.getNodeInfo();
console.log("Updated Peers Count:", updatedNodeInfo.peers_count);
