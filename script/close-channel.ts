import type { Channel, Script } from "fiber";
import { parseArgs } from "util";
import { FIBER_RPC_URL } from "../src/common/constants";
import { FiberRPC } from "../src/rpc/client";

console.log(require("figlet").textSync('Close Channel'));

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    channel_id: {
      type: "string",
      short: "c",
    },
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

if (!values.channel_id) {
  console.error("Please specify a channel ID with --channel_id or -c");
  process.exit(1);
}
const channelId = values.channel_id;
const feeRate = values.fee_rate ? Number(values.fee_rate) : 1000;
const force = values.force;

const rpc = new FiberRPC(FIBER_RPC_URL);

/**
 * Retrieves a channel by its ID.
 *
 * @param channelId - The ID of the channel to retrieve.
 * @returns A promise that resolves to the channel object if found, otherwise undefined.
 */
const getChannel = async (channelId: string) => {
  const channels = await rpc.listChannels({ include_closed: true });
  const channel = channels.find(ch => ch.channel_id === channelId);
  return channel;
}

/**
 * Checks the balance of a channel.
 *
 * @param channelId - The ID of the channel to check the balance for
 * @returns The balance of the channel
 */
async function checkChannelBalance(channelId: string) {
  const channel: Channel | undefined = await getChannel(channelId);

  if (channel) {
    console.log('Channel:', channel);
    const balances = {
      local_balance: BigInt(channel.local_balance),
      remote_balance: BigInt(channel.remote_balance),
    };
    console.log(`Channel balance for ID ${channelId} (shannons):`, balances);
    return balances;
  } else {
    console.log(`Channel with ID ${channelId} not found.`);
  }
}

/**
 * Closes a channel with the given channel ID using the provided close script.
 * If no close script is provided, a default close script will be used.
 *
 * @param {string} channelId - The ID of the channel to be closed.
 * @param {Script} [closeScript] - Optional. The script to be used for closing the channel.
 *
 * @returns {Promise<void>} - A promise that resolves when the channel is closed.
 */
async function closeChannel(channelId: string, closeScript?: Script, force?: boolean) {
  // Get default_funding_lock_script from node info
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

await checkChannelBalance(channelId);
await closeChannel(channelId, undefined, force)
  .catch((err) => {
    console.error("Error closing channel:", err);
    closeChannel(channelId, undefined, true);
  })

const startTime = Date.now();
const timeoutMs = 5 * 60 * 1000; // 5 minutes timeout

const intervalId = setInterval(async () => {
  const channel = await getChannel(channelId);  
  console.log(`Channel state:`, channel?.state);

  if (channel?.state?.state_name === "CLOSED") {
    console.log("Channel is closed");
    clearInterval(intervalId);
  }

  if (Date.now() - startTime > timeoutMs) {
    clearInterval(intervalId);
    console.log("Channel close timeout reached, attempting force close");
    await closeChannel(channelId, undefined, true);
  }
}, 8000);
// TODO: check on-chain balance
