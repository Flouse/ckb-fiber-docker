import { FIBER_RPC_URL } from "./common/constants";
import { connectKnowPeers } from "./peers";
import { FiberRPC } from "./rpc/client";
import { ensureEnoughCapacity } from "./utils";
import logger from "./utils/logger";
import { helpers, config } from "@ckb-lumos/lumos";

const rpc = new FiberRPC(FIBER_RPC_URL);

// Figlet the project name
console.log(require("figlet").textSync(require("../package.json").name));

// Get node info
const nodeInfo = await rpc.getNodeInfo();
logger.info({ nodeInfo }, "Node Info");

// Get Balance and get faucet if the balance is less than 10000 CKB
const { default_funding_lock_script } = nodeInfo;
const lockScript = {
  codeHash: default_funding_lock_script.code_hash,
  hashType: default_funding_lock_script.hash_type,
  args: default_funding_lock_script.args,
};
config.initializeConfig(config.TESTNET);
const testnetAddr = helpers.encodeToAddress(lockScript);
logger.info(`Default funding address: ${testnetAddr}`);
ensureEnoughCapacity(testnetAddr);

// list channels
const channels = await rpc.listChannels({});
logger.info({ channels }, "Channels");

const peerCount = BigInt(nodeInfo.peers_count);
logger.info({ peerCount }, "Peers Count");

await connectKnowPeers();
logger.info("Connected to known peers");
