/**
 * The URL for the FIBER RPC server. Defaults to "http://localhost:58227" if the
 * environment variable "FIBER_RPC_URL" is not set.
 */
export const FIBER_RPC_URL: string = process.env["FIBER_RPC_URL"] ?? "http://localhost:58227";

/**
 * A list of known peers for the testnet. These peers are used to connect to the
 * Nervos Network testnet. The list includes IP addresses, ports, and peer IDs.
 * 
 * @see {@link https://github.com/nervosnetwork/fiber/blob/develop/docs/testnet-nodes.md}
 */
export const testnetKnownPeers: string[] = [
  // https://github.com/nervosnetwork/fiber/blob/develop/docs/testnet-nodes.md
  "/ip4/18.162.235.225/tcp/8119/p2p/QmXen3eUHhywmutEzydCsW4hXBoeVmdET2FJvMX69XJ1Eo",
  "/ip4/18.163.221.211/tcp/8119/p2p/QmbKyzq9qUmymW2Gi8Zq7kKVpPiNA1XUJ6uMvsUC4F3p89",
  // FTN004
  "/ip4/52.45.221.66/tcp/50001/p2p/QmVxgZrgZESD5U3m2cq8qXpsGPXubERvZs3eXy9fpFeVtE"
];
