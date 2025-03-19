import { sleep } from "bun";
import type { Channel } from "fiber";
import { parseArgs } from "util";
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
  funding_amount: "0x174876E808", // 1000.00000008 CKB
};

const rpc = new FiberRPC(FIBER_RPC_URL);

// open channel
// TODO: connect the peer first
// await rpc.connectPeer(addr, true);

const channel = await rpc.openChannel(channelParams);
console.log("Open Channel:", channel);

const channels: Channel[] = await rpc.listChannels({
  peer_id: values.peer_id,
  include_closed: true,
});
const latestChannel = channels.reduce((latest, channel) => {
  return BigInt(channel.created_at) > BigInt(latest.created_at) ? channel : latest;
}, channels[0]);
console.log("Latest Channel:", latestChannel);


const getChannelStatus = async (channelId: string) => {
  const channels = await rpc.listChannels({
    peer_id: values.peer_id,
    include_closed: true,
  });

  const chanInfo = channels.findLast(chan => chan.channel_id === channelId);
  if (chanInfo === undefined) {
    return;
  }

  console.debug("Channel Status:", chanInfo);
  return chanInfo.state;
}


// wait until the channel is ready
const startTime = Date.now();
while (Date.now() - startTime < 300 * 1000) {
  console.log("Waiting for channel to be ready...");
  await sleep(5000);

  const chanState = await getChannelStatus(latestChannel.channel_id);
  if (!chanState) {
    console.log("Channel state not found");
    continue;
  }

  console.log("The funding channel:", latestChannel);
  if (chanState.state_name === 'CHANNEL_READY') {
    console.log("Channel is ready");
    break;
  }
}
