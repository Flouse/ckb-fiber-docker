import { sleep } from "bun";
import { parseArgs } from "util";
import { getNewChannel } from "../src/channel";
import { FIBER_RPC_URL } from "../src/common/constants";
import { FiberRPC } from "../src/rpc/client";

console.log(require("figlet").textSync('Open Channel'));

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    peer_id: {
      type: "string",
      short: "p",
    },
    funding_amount: {
      type: "string",
      short: "a",
      default: "0x3C5986200" // Default 16200000000 shannons
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
  funding_amount: values.funding_amount, // Use the provided funding amount or default
};
const rpc = new FiberRPC(FIBER_RPC_URL);

// open channel
// TODO: connect the peer first
// await rpc.connectPeer(addr, true);

const newChannel = await rpc.openChannel(channelParams);
console.log("Open Channel:", newChannel);


// wait until the channel is ready
const startTime = Date.now();
while (Date.now() - startTime < 300 * 1000) {
  console.log("Waiting for channel to be ready...");
  await sleep(5000);

  const channel = await getNewChannel(rpc, values.peer_id);
  if (!channel) continue;

  console.debug("The funding channel:", channel);
  if (channel.state.state_name === 'CHANNEL_READY') {
    console.log("Channel is ready");
    break;
  }
}
