import { sleep } from "bun";
import { parseArgs } from "util";
import { getChannelStatus, getNewChannel } from "../src/channel";
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

let tmpChannel = await rpc.openChannel(channelParams);
console.log("Open Channel:", tmpChannel);

const TIMEOUT = 120 * 1000; // 2 minute timeout
const start = Date.now();

// get the new channel
let newChannel;
while (!newChannel) {
  if (Date.now() - start > TIMEOUT) {
    console.error("Timeout while waiting for new channel");
    process.exit(1);
  }

  newChannel = await getNewChannel(rpc, values.peer_id);
  if (!newChannel) {
    console.log("Waiting for new channel...");
    await sleep(2000);
  }
}
console.log("New Channel:", newChannel);

// wait until the channel is ready
while (Date.now() - start < TIMEOUT) {
  console.log("Waiting for channel to be ready...");
  await sleep(8000);

  const channelStatus = await getChannelStatus(rpc, newChannel.channel_id, values.peer_id);

  if (!channelStatus) {
    console.log("Failed to get channel status");
  }

  console.log(`Channel Status:`, channelStatus);
  if (channelStatus?.state_name === 'CHANNEL_READY') {
    console.log("Channel is ready");
    break;
  }
}
