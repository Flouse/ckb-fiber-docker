## RPC docs
- RPC docs: https://github.com/nervosnetwork/fiber/blob/main/README.md

## Useful CMDs

### Build
```bash
sudo docker build --memory=6G -t fnn . 
```


### node_info
```bash
curl -X POST http://localhost:14227 -H 'Content-Type: application/json' \
 -d '{"jsonrpc": "2.0", "method": "node_info", "params": [], "id": 1}'
```
```json
{
  "jsonrpc": "2.0",
  "result": {
    "version": "0.1.0",
    "commit_hash": "b95013e-modified",
    "public_key": "02aedc0aac0476b9ae479cad4cae00ff770b4b5607dd73d90b96806d768f5452aa",
    "node_name": null,
    "peer_id": "QmQfKG2wwZpN4Ti8wxYsVUBMUS1BpQA4YYR3WqECyqyuPB",
    "addresses": [],
    "chain_hash": "0x10639e0895502b5688a6be8cf69460d76541bfa4821629d86d62ba0aae3f9606",
    "open_channel_auto_accept_min_ckb_funding_amount": "0x3c5986200",
    "auto_accept_channel_ckb_funding_amount": "0x1718c7e00",
    "tlc_expiry_delta": "0x5265c00",
    "tlc_min_value": "0x0",
    "tlc_max_value": "0x0",
    "tlc_fee_proportional_millionths": "0x3e8",
    "channel_count": "0x0",
    "pending_channel_count": "0x0",
    "peers_count": "0x2",
    "network_sync_status": "Done",
    "udt_cfg_infos": [
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
            "dep_type": "code",
            "tx_hash": "0xed7d65b9ad3d99657e37c4285d585fea8a5fcaf58165d54dacf90243f911548b",
            "index": "0x0"
          }
        ]
      }
    ]
  },
  "id": 1
}
```

### connect_peer
```bash
curl -X POST http://localhost:14227 -H 'Content-Type: application/json' \
  -d '{"jsonrpc": "2.0", "method": "connect_peer", "params": [{"address": "/ip4/52.45.221.66/tcp/18228/p2p/QmNMpmhch3FByx82ZGMBHEPNCvryjmkUDbhsp1rGcSbGoC"}, true], "id": 42}'
curl -X POST http://localhost:14227 -H 'Content-Type: application/json' \
  -d '{"jsonrpc": "2.0", "method": "connect_peer", "params": [{"address": "/ip4/52.45.221.66/tcp/28228/p2p/QmSJRWSN4tieP87dXrAkSWx6vY5wz3PBAU3osVLZnCftZh"}, true], "id": 42}'
curl -X POST http://localhost:14227 -H 'Content-Type: application/json' \
  -d '{"jsonrpc": "2.0", "method": "connect_peer", "params": [{"address": "/ip4/13.212.140.156/tcp/38228/p2p/QmTFf1FoSPTiVMvBJzPjydYcK2LNBquoVBpCGuJ6oMtutC"}, true], "id": 42}'
curl -X POST http://localhost:14227 -H 'Content-Type: application/json' \
  -d '{"jsonrpc": "2.0", "method": "connect_peer", "params": [{"address": "/ip4/52.45.221.66/tcp/48228/p2p/QmYmWQGQdFom837aNPTmuruomSCPxpDbt9v4cf7jXLzL9v"}, true], "id": 42}'
```


- [Fiber Testnet Nodes by JoyID team](https://www.notion.so/Tests-for-CKB-Fiber-Node-10c100f5beba80fbad87e6b04ecb9aac?pvs=4#11f100f5beba80e29b80d54f5e3b0c72)


## CKB
