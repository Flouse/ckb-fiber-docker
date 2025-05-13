import { beforeAll, describe, expect, mock, test } from "bun:test";
import { FiberRPC } from '../client';

const mockNodeInfoResponse = {
  jsonrpc: "2.0",
  result: {
    "version": "0.5.1",
    "commit_hash": "b11941a 2025-05-08",
    "node_id": "034877ff5f91793ded678a0113d10f88e1959e4223c92ce71756e210d2deddeb25",
    "node_name": "FTN20250512",
    "addresses": [
      "/ip4/52.45.221.66/tcp/50001/p2p/QmcWUnFXVikZh4sz14N9P729j5m9k8PTNiUacNBxjLw6VH"
    ],
    "chain_hash": "0x10639e0895502b5688a6be8cf69460d76541bfa4821629d86d62ba0aae3f9606",
    "open_channel_auto_accept_min_ckb_funding_amount": "0x2540be400",
    "auto_accept_channel_ckb_funding_amount": "0x1718c7e00",
    "default_funding_lock_script": {
      "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      "hash_type": "type",
      "args": "0x5066cf38b10e42393c42444decfda1bca60e073e"
    },
    "tlc_expiry_delta": "0x5265c00",
    "tlc_min_value": "0x0",
    "tlc_fee_proportional_millionths": "0x3e8",
    "channel_count": "0x0",
    "pending_channel_count": "0x0",
    "peers_count": "0x9",
    "udt_cfg_infos": [
      {
        "name": "USDI",
        "script": {
          "code_hash": "0xcc9dc33ef234e14bc788c43a4848556a5fb16401a04662fc55db9bb201987037",
          "hash_type": "type",
          "args": "0x71fd1985b2971a9903e4d8ed0d59e6710166985217ca0681437883837b86162f"
        },
        "auto_accept_amount": "0xa",
        "cell_deps": [
          {
            "type_id": {
              "code_hash": "0x00000000000000000000000000000000000000000000000000545950455f4944",
              "hash_type": "type",
              "args": "0xf0bad0541211603bf14946e09ceac920dd7ed4f862f0ffd53d0d477d6e1d0f0b"
            }
          }
        ]
      },
      {
        "name": "RUSD",
        "script": {
          "code_hash": "0x1142755a044bf2ee358cba9f2da187ce928c91cd4dc8692ded0337efa677d21a",
          "hash_type": "type",
          "args": "0x878fcc6f1f08d48e87bb1c3b3d5083f23f8a39c5d5c764f253b55b998526439b"
        },
        "auto_accept_amount": "0x3b9aca00",
        "cell_deps": [
          {
            "type_id": {
              "code_hash": "0x00000000000000000000000000000000000000000000000000545950455f4944",
              "hash_type": "type",
              "args": "0x97d30b723c0b2c66e9cb8d4d0df4ab5d7222cbb00d4a9a2055ce2e5d7f0d8b0f"
            }
          }
        ]
      },
      {
        "name": "SEAL",
        "script": {
          "code_hash": "0x25c29dc317811a6f6f3985a7a9ebc4838bd388d19d0feeecf0bcd60f6c0975bb",
          "hash_type": "type",
          "args": "0x122ae563f351bcaffef58bb57d5f4f863034721b361c645099501039a51d5936"
        },
        "auto_accept_amount": "0x9184e72a000",
        "cell_deps": [
          {
            "type_id": {
              "code_hash": "0x00000000000000000000000000000000000000000000000000545950455f4944",
              "hash_type": "type",
              "args": "0x44ec8b96663e06cc94c8c468a4d46d7d9af69eaf418f6390c9f11bb763dda0ae"
            }
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
    if (process.env['GITHUB_ACTIONS']) {
      // Use real fetch in GitHub Actions
      rpc = new FiberRPC('http://localhost:58227');
    } else {
      // Use mock fetch for local development
      const mockFetch = mock(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockNodeInfoResponse),
        } as Response)
      );
      global.fetch = mockFetch as unknown as typeof fetch;
      rpc = new FiberRPC('http://localhost:8227');
    }
  });
  test('should get node info', async () => {
    const nodeInfo = await rpc.getNodeInfo();
    if (!process.env['GITHUB_ACTIONS']) {
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
