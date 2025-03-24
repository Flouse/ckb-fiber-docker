import { FIBER_RPC_URL } from "./common/constants";
import { connectKnowPeers } from "./peers";
import { FiberRPC } from "./rpc/client";
import logger from "./utils/logger";

const rpc = new FiberRPC(FIBER_RPC_URL);

// Figlet the project name
console.log(require("figlet").textSync(require("../package.json").name));

// call get node info
const nodeInfo = await rpc.getNodeInfo();
logger.info({ nodeInfo }, "Node Info");
const peerCount = BigInt(nodeInfo.peers_count);
logger.info({ peerCount }, "Peers Count");

// list channels
const channels = await rpc.listChannels({});
logger.info({ channels }, "Channels");

await connectKnowPeers();
