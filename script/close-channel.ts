import { parseArgs } from "util";
import { FiberRPC } from "../src/rpc/client";
import type { Script, Channel } from "fiber";
import { sleep } from "bun";
import { FIBER_RPC_URL } from "../src/common/constants";

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
      short: "f",
    },
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

const rpcUrl = FIBER_RPC_URL;
const rpc = new FiberRPC(rpcUrl);


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
 * If not provided, a default close script will be used.
 *
 * @returns {Promise<void>} - A promise that resolves when the channel is closed.
 */
async function closeChannel(channelId: string, closeScript?: Script) {
  // Get default_funding_lock_script from node info
  const nodeInfo = await rpc.getNodeInfo();
  const defaultCloseScript: Script = nodeInfo.default_funding_lock_script
    ?? {
    // https://testnet.explorer.nervos.org/address/ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsq2svm8n3vgwgguncsjyfhk0mgdu5c8qw0s4ju2vk
    code_hash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
    hash_type: "type",
    args: "0x5066cf38b10e42393c42444decfda1bca60e073e"
  };

  console.log("Using the following default close script to close the channel:", defaultCloseScript);

  await rpc.closeChannel({
    channel_id: channelId,
    close_script: closeScript ?? defaultCloseScript,
    fee_rate: `0x${feeRate.toString(16)}`
  });
  console.log(`Closing channel ${channelId}`);
}

await checkChannelBalance(channelId);
await closeChannel(channelId);

const intervalId = setInterval(async () => {
  await checkChannelBalance(channelId);

  const channel = await getChannel(channelId);
  console.log(channel);

  if (channel?.state?.state_name === "CLOSED") {
    console.log("Channel is closed");
    clearInterval(intervalId);
  }
}, 8000);


// TODO: check on-chain balance
