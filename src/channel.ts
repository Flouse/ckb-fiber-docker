
import type { Channel } from "fiber";
import { FiberRPC } from "./rpc/client";

/**
 * Retrieves the status of a specific channel for a given peer.
 * 
 * @param rpc - The FiberRPC client used to interact with the network
 * @param peerId - The unique identifier of the peer
 * @param channelId - The unique identifier of the channel
 * @returns The state of the specified channel, or undefined if not found
 */
export async function getChannelStatus(rpc: FiberRPC, channelId: string, peerId?: string) {
  const channels: Channel[] = await rpc.listChannels({
    peer_id: peerId,
    include_closed: true,
  });

  const chanInfo = channels.find(chan => chan.channel_id === channelId);
  return chanInfo?.state;
}

/**
 * Finds the most recently created channel for a given peer.
 * 
 * @param rpc - The FiberRPC client used to interact with the network
 * @param peerId - The unique identifier of the peer
 * @returns The most recently created channel, or undefined if no channels exist
 */
export async function getNewChannel(rpc: FiberRPC, peerId: string) {
  const channels: Channel[] = await rpc.listChannels({
    peer_id: peerId,
    include_closed: true,
  });

  if (!channels.length) {
    return undefined;
  }

  const latestChannel = channels.reduce((latest, channel) => {
    return BigInt(channel.created_at) > BigInt(latest.created_at) ? channel : latest;
  }, channels[0]);

  if (latestChannel.state.state_name === 'CHANNEL_READY') {
    return undefined;
  }

  return latestChannel;
}
