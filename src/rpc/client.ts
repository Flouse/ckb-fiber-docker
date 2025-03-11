import { randomUUID } from "crypto";

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
  constructor(private readonly uri: string) {}

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

  /**
   * Retrieves the list of peers.
   * @returns {Promise<Array<string>>} A promise that resolves to an array of peer addresses.
   *
   * Retrieves the list of peers.
   * @returns {Promise<Array<string>>} A promise that resolves to an array of peer addresses.
   */
  async getPeers() {}

  // Fiber-specific methods
  /**
   * Connects to a peer using the given peer address.
   * @param peerAddress - The address of the peer to connect to.
   * @returns A promise that resolves to a boolean indicating success.
   */
  async connect(peerAddress: string) {
    return this.call<Array<string>>("peers");
  }
}
