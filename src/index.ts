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
const peerCount = BigInt(nodeInfo.peers_count);
console.log("Peers Count:", peerCount);

// list channels
const channels = await rpc.listChannels({ include_closed: true });
console.log("Channels:", channels);


// connect to all the peers from the graph

let totalAttempts = 0;
const connectPeer = async (addr: string) => {
  totalAttempts++;
  try {
    await rpc.connectPeer(addr, true);
    console.log(`Connecting to testnet peer ${addr}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to connect to testnet peer ${addr}:`, errorMessage);
  }
}

const graphNodes = getGraphNodes();
const testnetPublicNodes = [
  "/ip4/18.162.235.225/tcp/8119/p2p/QmXen3eUHhywmutEzydCsW4hXBoeVmdET2FJvMX69XJ1Eo",
  "/ip4/18.163.221.211/tcp/8119/p2p/QmbKyzq9qUmymW2Gi8Zq7kKVpPiNA1XUJ6uMvsUC4F3p89"
];
const connectJobs = testnetPublicNodes.map(connectPeer);
for (const node of await graphNodes) {
  for (const addr of node.addresses) {
    connectJobs.push(connectPeer(addr));
  }
}
await Promise.all(connectJobs);


// wait until the peers are connected
const startTime = Date.now();
while (Date.now() - startTime < 10 * 1000) {
  await new Promise(resolve => setTimeout(resolve, 3000));
  const latestPeerCount = BigInt((await rpc.getNodeInfo()).peers_count);
  console.log("Peers Count:", latestPeerCount);

  if (latestPeerCount > peerCount) {
    break;
  }
  console.log("Waiting for peers to be connected...");
}

const successCount = BigInt((await rpc.getNodeInfo()).peers_count) - peerCount;
console.log(`New peers count: ${successCount}`);
