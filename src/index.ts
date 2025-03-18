// Figlet the project name
console.log(require("figlet").textSync(require("../package.json").name));


import { FIBER_RPC_URL } from "./common/constants";
import { connectKnowPeers } from "./peers";
import { FiberRPC } from "./rpc/client";

const rpc = new FiberRPC(FIBER_RPC_URL);

// call get node info
const nodeInfo = await rpc.getNodeInfo();
console.log("Node Info:", nodeInfo);
const peerCount = BigInt(nodeInfo.peers_count);
console.log("Peers Count:", peerCount);

// list channels
const channels = await rpc.listChannels({ include_closed: true });
console.log("Channels:", channels);

await connectKnowPeers();
