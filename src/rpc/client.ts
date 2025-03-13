import { randomUUID } from "crypto";
import type { Script, Channel } from "fiber";

export interface RPCResponse<T> {
  jsonrpc: "2.0";
  id: string;
  result?: T;
  error?: {
    code: number;
    message: string;
  };
}

export class FiberRPC {
  /**
   * Creates an instance of FiberRPC.
   * @param {string} uri - The URI of the RPC server.
   */
  constructor(private readonly uri: string) { }

  /**
   * Makes an RPC call to the specified method with the given parameters.
   * @template T The expected return type of the RPC call.
   * @param {string} method - The RPC method to call.
   * @param {unknown[]} [params=[]] - The parameters to pass to the RPC method.
   * @returns {Promise<T>} A promise that resolves to the result of the RPC call.
   */
  async call<T>(method: string, params: unknown[] = []): Promise<T> {
    const body = {
      id: randomUUID(),
      jsonrpc: "2.0",
      method,
      params,
    };

    const res: Response = await fetch(this.uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`HTTP error status: ${res.status}`);
    }
    const data: RPCResponse<T> = await res.json();

    if (data.error) {
      throw new Error(`RPC call "${method}" failed due to error: ${data.error.message}`)
    }
    if (data.result === undefined) {
      throw new Error("RPC response result is undefined");
    }
    return data.result as T;
  }

  async getNodeInfo() {
    return this.call<any>("node_info");
  }

  /**
   * Connect to a peer.
   * @param {string} address - The address of the peer to connect to.
   * @param {boolean} [save=false] - Whether to save the peer address to the peer store.
   * @returns {Promise<void>}
   */
  async connectPeer(address: string, save: boolean = false): Promise<void> { // Using string for MultiAddr
    return this.call<void>("connect_peer", [{ address, save }]);
  }

  /**
   * Opens a Fiber channel with a peer.
   * @param {Object} params - The parameters for opening the channel
   * @param {string} params.peer_id - The peer ID to open the channel with
   * @param {string} params.funding_amount - The funding amount (CKB or UDT)
   * @param {boolean} [params.public] - Whether this is a public channel (default: true)
   * @param {Script} [params.funding_udt_type_script] - The type script of the UDT to fund the channel
   * @param {Script} [params.shutdown_script] - The script used to receive the channel balance
   * @param {string} [params.commitment_delay_epoch] - The delay time for commitment transaction in u64 format
   * @param {number} [params.commitment_fee_rate] - The fee rate for commitment transaction
   * @param {number} [params.funding_fee_rate] - The fee rate for funding transaction
   * @param {number} [params.tlc_expiry_delta] - The expiry delta for TLC in milliseconds
   * @param {string} [params.tlc_min_value] - The minimum value for a TLC
   * @param {string} [params.tlc_fee_proportional_millionths] - The fee proportional millionths for TLC
   * @param {string} [params.max_tlc_value_in_flight] - Maximum value in flight for TLCs
   * @param {number} [params.max_tlc_number_in_flight] - Maximum number of TLCs in flight
   * @returns {Promise<{ temporary_channel_id: string }>} The temporary channel ID
   */
  async openChannel(params: {
    peer_id: string;
    funding_amount: string;
    public?: boolean;
    funding_udt_type_script?: Script;
    shutdown_script?: Script;
    commitment_delay_epoch?: string;
    commitment_fee_rate?: number;
    funding_fee_rate?: number;
    tlc_expiry_delta?: number;
    tlc_min_value?: string;
    tlc_fee_proportional_millionths?: string;
    max_tlc_value_in_flight?: string;
    max_tlc_number_in_flight?: number;
  }): Promise<{ temporary_channel_id: string }> {
    return this.call<{ temporary_channel_id: string }>("open_channel", [params]);
  }

  /**
   * Lists all channels.
   * @param {Object} [params] - The parameters for listing channels
   * @param {string} [params.peer_id] - The peer ID to list channels for
   * @param {boolean} [params.include_closed=false] - Whether to include closed channels in the list
   * @returns {Promise<Channel[]>} The list of channels
   */
  async listChannels(params?: { peer_id?: string; include_closed?: boolean }): Promise<Channel[]> {
    return (await this.call<{ channels: Channel[] }>("list_channels", [params])).channels;
  }

  /**
   * Shuts down a channel.
   * @param {Object} params - The parameters for shutting down the channel
   * @param {string} params.channel_id - The channel ID of the channel to shut down
   * @param {Script} params.close_script - The script used to receive the channel balance
   * @param {boolean} [params.force] - Whether to force the channel to close
   * @param {string} [params.fee_rate] - The fee rate for the closing transaction
   * @returns {Promise<void>}
   */
  async closeChannel(params: {
    channel_id: string;
    close_script: Script;
    force?: boolean;
    fee_rate?: string;
  }): Promise<void> {
    return this.call<void>("shutdown_channel", [params]);
  }
}
