import { sleep } from "bun";
import { parseArgs } from "util";
import { getChannelStatus, getNewChannel } from "../src/channel";
import { FIBER_RPC_URL } from "../src/common/constants";
import { FiberRPC } from "../src/rpc/client";
import { parsePeerId } from "../src/utils";

console.log(require("figlet").textSync('Open Channel'));

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    address: {
      type: "string",
      short: "a"
    },
    peer_id: {
      type: "string",
      short: "p",
    },
    funding_amount: {
      type: "string",
      short: "f",
      default: "0x3C5986200" // Default 16200000000 shannons
    },
  },
  strict: true,
  allowPositionals: true,
});

if (values.address) {
  values.peer_id = parsePeerId(values.address);
}
if (!values.peer_id) {
  console.error("Please specify a peer ID with --peer_id or -p");
  process.exit(1);
}
const channelParams = {
  peer_id: values.peer_id,
  funding_amount: values.funding_amount, // Use the provided funding amount or default
};

const rpc = new FiberRPC(FIBER_RPC_URL);

// Connect the peer first before opening the channel if address is provided
if (values.address) {
  console.log(`Connecting to peer at address: ${values.address}`);
  await rpc.connectPeer(values.address, true);

  // Verify peer connection
  console.log("Verifying peer connection...");
  const peers = await rpc.listPeers();
  const isConnected = peers.some(peer => peer.peer_id === values.peer_id);

  if (!isConnected) {
    console.error(`Failed to connect to peer ${values.peer_id}. Peer not found in list_peers.`);
    process.exit(1);
  } else {
    console.log(`Successfully connected to peer ${values.peer_id}.`);
  }
}

console.log("Opening channel with params:", channelParams);
let tmpChannel = await rpc.openChannel(channelParams);
console.log("Opening Channel:", tmpChannel);

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
