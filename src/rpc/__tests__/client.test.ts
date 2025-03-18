import { beforeAll, describe, expect, mock, test } from "bun:test";
import { FiberRPC } from '../client';

const mockNodeInfoResponse = {
  jsonrpc: "2.0",
  result: {
    version: "0.4.1",
    commit_hash: "3c405c1",
    node_id: "02e21c23828b03ca4dd0d891d1a2d5a431f4d9abae5faebd40b56df4b25ee3b2d9",
    node_name: null,
    addresses: [],
    chain_hash: "0x10639e0895502b5688a6be8cf69460d76541bfa4821629d86d62ba0aae3f9606",
    open_channel_auto_accept_min_ckb_funding_amount: "0x2540be400",
    auto_accept_channel_ckb_funding_amount: "0x1718c7e00",
    default_funding_lock_script: {
      code_hash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      hash_type: "type",
      args: "0x5545ca1d997842dba3c28e15f7e89ac582c6f2ca"
    },
    tlc_expiry_delta: "0x5265c00",
    tlc_min_value: "0x0",
    tlc_max_value: "0x0",
    tlc_fee_proportional_millionths: "0x3e8",
    channel_count: "0x0",
    pending_channel_count: "0x0",
    peers_count: "0x2",
    udt_cfg_infos: [
      {
        name: "USDI",
        script: {
          code_hash: "0xcc9dc33ef234e14bc788c43a4848556a5fb16401a04662fc55db9bb201987037",
          hash_type: "type",
          args: "0x71fd1985b2971a9903e4d8ed0d59e6710166985217ca0681437883837b86162f"
        },
        auto_accept_amount: "0xa",
        cell_deps: [
          {
            dep_type: "code",
            tx_hash: "0xaec423c2af7fe844b476333190096b10fc5726e6d9ac58a9b71f71ffac204fee",
            index: "0x0"
          }
        ]
      },
      {
        name: "RUSD",
        script: {
          code_hash: "0x1142755a044bf2ee358cba9f2da187ce928c91cd4dc8692ded0337efa677d21a",
          hash_type: "type",
          args: "0x878fcc6f1f08d48e87bb1c3b3d5083f23f8a39c5d5c764f253b55b998526439b"
        },
        auto_accept_amount: "0x3b9aca00",
        cell_deps: [
          {
            dep_type: "code",
            tx_hash: "0xed7d65b9ad3d99657e37c4285d585fea8a5fcaf58165d54dacf90243f911548b",
            index: "0x0"
          }
        ]
      }
    ]
  },
  id: 2
};

describe('FiberRPC', () => {
  let rpc: FiberRPC;

  beforeAll(() => {
    if (process.env.GITHUB_ACTIONS) {
      // Use real fetch in GitHub Actions
      rpc = new FiberRPC('http://localhost:58227');
    } else {
      // Use mock fetch for local development
      global.fetch = mock(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockNodeInfoResponse),
        } as Response)
      );
      rpc = new FiberRPC('http://localhost:8227');
    }
  });

  test('should get node info', async () => {
    const nodeInfo = await rpc.getNodeInfo();
    if (!process.env.GITHUB_ACTIONS) {
      expect(nodeInfo).toEqual(mockNodeInfoResponse.result);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8227', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"method":"node_info"'),
      });
    } else {
      expect(nodeInfo).toBeDefined();
      expect(nodeInfo.version).toBe(mockNodeInfoResponse.result.version);
      expect(nodeInfo.chain_hash).toBe("0x10639e0895502b5688a6be8cf69460d76541bfa4821629d86d62ba0aae3f9606");
      expect(nodeInfo.node_id).toBeDefined();
    }
  });
});
