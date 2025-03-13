import { FiberRPC } from "../src/rpc/client";
import { parseArgs } from "util";

console.log(require("figlet").textSync('Open Channel'));

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    peer_id: {
      type: "string",
      short: "p",
    },
  },
  strict: true,
  allowPositionals: true,
});

if (!values.peer_id) {
  console.error("Please specify a peer ID with --peer_id or -p");
  process.exit(1);
}

const channelParams = {
  peer_id: values.peer_id,
  funding_amount: "0x174876E807", // 1000.00000007 CKB
};

const rpcUrl = process.env["FIBER_RPC_URL"] ?? "http://localhost:58227";
const rpc = new FiberRPC(rpcUrl);

// open channel
// TODO: connect the peer first
// await rpc.connectPeer(addr, true);
const channel = await rpc.openChannel(channelParams);
console.log("Open Channel:", channel);
// e.g.
// Open Channel: {
//   temporary_channel_id: "0xabdcd7e1fce10f3cd92af8c93d79a50a8da3379ad2bbc9e71bf506dce96b337b",
// }

// list channels
const channels = await rpc.listChannels({
  peer_id: values.peer_id,
  include_closed: true,
});
console.log("Channels:", channels);
