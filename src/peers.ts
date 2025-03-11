import { FiberRPC } from "./rpc/client";
import { parsePeerAddr } from "./utils";

export async function getGraphNodes() {
  const graphNodes = await fetch("https://testnet-api.explorer.nervos.org/api/v2/fiber/graph_nodes");
  const nodes = await graphNodes.json();
  return nodes;
}

export async function connectToPeers(rpc: FiberRPC, knownPeers: string[]) {
  const connectedPeers = await rpc.getPeers();
  console.log("Currently connected peers:", connectedPeers);

  for (const peer of knownPeers) {
    if (!connectedPeers.includes(peer)) {
      try {
        await rpc.connect(peer);
        console.log(`Successfully connected to peer: ${peer}`);
      } catch (error) {
        console.error(`Failed to connect to peer ${peer}:`, error);
      }
    }
  }

  return await rpc.getPeers();
}

export async function connectToPeersByAddr(rpc: FiberRPC, peerAddrs: string[]) {
  for (const addr of peerAddrs) {
    try {
      const { rpcAddr, peerId } = parsePeerAddr(addr);
      console.log(`Attempting to connect to peer ${peerId} at ${rpcAddr}`);
      await rpc.connect(addr);
    } catch (error) {
      console.error(`Failed to parse or connect to peer ${addr}:`, error);
    }
  }
}

// Usage example:
// const rpc = new FiberRPC("http://localhost:58227");
// const knownPeers = ["peer1", "peer2"];
// await connectToPeers(rpc, knownPeers);
