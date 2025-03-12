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
  funding_amount: "0x174876E806", // 1000.00000006 CKB
};

const rpcUrl = process.env["FIBER_RPC_URL"] ?? "http://localhost:58227";
const rpc = new FiberRPC(rpcUrl);
const channel = await rpc.openChannel(channelParams);
console.log("Open Channel:", channel);
console.log("Temporary Channel ID:", channel.temporary_channel_id);
