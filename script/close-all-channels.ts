import type { Script } from "fiber";
import { parseArgs } from "util";
import { FIBER_RPC_URL } from "../src/common/constants";
import { FiberRPC } from "../src/rpc/client";

console.log(require("figlet").textSync('Close All Channels'));

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    fee_rate: {
      type: "string",
      short: "r",
    },
    force: {
      type: "boolean",
      short: "f",
    }
  },
  strict: true,
  allowPositionals: true,
});

const feeRate = values.fee_rate ? Number(values.fee_rate) : 1000;
const force = values.force;
const rpc = new FiberRPC(FIBER_RPC_URL);

// TODO: move to channel.ts
async function getChannel(channelId: string) {
  const channels = await rpc.listChannels({ include_closed: true });
  return channels.find(ch => ch.channel_id === channelId);
}

// TODO: refactor
async function closeChannel(channelId: string, closeScript?: Script, force?: boolean) {
  const nodeInfo = await rpc.getNodeInfo();
  const defaultCloseScript: Script = nodeInfo.default_funding_lock_script;

  await rpc.closeChannel({
    channel_id: channelId,
    close_script: closeScript ?? defaultCloseScript,
    fee_rate: `0x${feeRate.toString(16)}`,
    force
  });
  console.log(`Closing channel ${channelId}`);
}

// TODO: refactor
async function monitorChannelClose(channelId: string): Promise<void> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const timeoutMs = 5 * 60 * 1000; // 5 minutes timeout

    const intervalId = setInterval(async () => {
      const channel = await getChannel(channelId);
      console.log(`Channel ${channelId} state:`, channel?.state);

      if (channel?.state?.state_name === "CLOSED") {
        console.log(`Channel ${channelId} is closed`);
        clearInterval(intervalId);
        resolve();
      }

      if (Date.now() - startTime > timeoutMs) {
        clearInterval(intervalId);
        console.log(`Channel ${channelId} close timeout reached, attempting force close`);
        await closeChannel(channelId, undefined, true);
        resolve();
      }
    }, 8000);
  });
}

async function main() {
  const channels = await rpc.listChannels({ include_closed: false });
  console.log(`Found ${channels.length} open channels`);

  const closePromises = channels.map(async (channel) => {
    console.log(`Closing channel:`, channel);
    
    try {
      await closeChannel(channel.channel_id, undefined, force);
      await monitorChannelClose(channel.channel_id);
    } catch (error) {
      console.error(`Error closing channel ${channel.channel_id}:`, error);
      await closeChannel(channel.channel_id, undefined, true);
    }
  });
  await Promise.all(closePromises);
}

main().catch(console.error);
