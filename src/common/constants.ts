/**
 * Public JSON RPC nodes
 * See https://github.com/nervosnetwork/ckb/wiki/Public-JSON-RPC-nodes
 */
export const PUBLIC_CKB_TESTNET_RPC = "https://testnet.ckb.dev";

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
export const TESTNET_KNOWN_PEERS: string[] = [
  // https://github.com/nervosnetwork/fiber/blob/develop/docs/testnet-nodes.md
  "/ip4/18.162.235.225/tcp/8119/p2p/QmXen3eUHhywmutEzydCsW4hXBoeVmdET2FJvMX69XJ1Eo",
  "/ip4/18.163.221.211/tcp/8119/p2p/QmbKyzq9qUmymW2Gi8Zq7kKVpPiNA1XUJ6uMvsUC4F3p89",
  
  // FTN20250512
  "/ip4/52.45.221.66/tcp/50001/p2p/QmcWUnFXVikZh4sz14N9P729j5m9k8PTNiUacNBxjLw6VH",

  // utxostack-hub peers
  "/ip4/52.45.221.66/tcp/18228/p2p/QmapgHFsZ6k8mk9gzzSxZekYUbneicrnafwTZZbydbfSYe",
  "/ip4/52.45.221.66/tcp/28228/p2p/QmdbU1YXxN9G7p3SAn4y8qBnGvisKU8ddh3ojEkWvuWEfW",
  "/ip4/52.45.221.66/tcp/38228/p2p/QmUjVWuqF7r3sh88izUtta8y4LUc3FgsGPBLJMZ4Co9Nxa",
  "/ip4/52.45.221.66/tcp/48228/p2p/QmYRNjy1sZVYiVotFBZUvvth9JH2kyNAabK2KBGYLFkhkD"
];
