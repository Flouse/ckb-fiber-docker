import { FiberRPC } from "../src/rpc/client";
import { parseArgs } from "util";
import { sleep } from "bun";
import { ChannelStateName } from "fiber";

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

const getChannelStatus = async (channelId: string) => {
  const channels = await rpc.listChannels({
    peer_id: values.peer_id,
    include_closed: true,
  });
  const chanInfo = channels.findLast(chan => chan.channel_id === channelId);

  if (chanInfo === undefined) {
    console.log("Channel not found");
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

  const chanState = await getChannelStatus(channel.temporary_channel_id);
  if (!chanState) {
    console.log("Channel state not found");
    continue;
  }

  if (chanState.state_name === ChannelStateName.CHANNEL_READY) {
    console.log("Channel is ready");
    break;
  }
}
