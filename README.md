# CKB Fiber Docker

[![Automatic builds badge](https://github.com/Flouse/ckb-fiber-docker/actions/workflows/docker.yml/badge.svg)](https://github.com/Flouse/ckb-fiber-docker/actions/workflows/docker.yml)
[![Docker Image Size](https://ghcr-badge.egpl.dev/flouse/ckb-fiber/size)][GHCR]

Docker image that contains the CKB [Fiber Network Node (FNN)](https://github.com/nervosnetwork/fiber) and [ckb-cli](https://github.com/nervosnetwork/ckb-cli) for easy deployment.


## Check the version
```bash
# https://github.com/nervosnetwork/fiber/releases/tag/v0.4.0
export FIBER_IMAGE=ghcr.io/flouse/ckb-fiber:fiber-commit-3c405c126a10527090f06c74abc318334dd4ed32

docker run --rm ${FIBER_IMAGE} ckb-cli --version
# Output: ckb-cli 1.12.0 (278c7be 2024-09-20)

docker run --rm ${FIBER_IMAGE}
# Ouptut: fnn 0.4.0

# Usage
docker run --rm ${FIBER_IMAGE} fnn --help
```


## How to Run a testnet node
See https://github.com/nervosnetwork/fiber?tab=readme-ov-file#build-and-run-a-testnet-node


## RPC docs of Fiber Network Node
See https://github.com/nervosnetwork/fiber/blob/main/src/rpc/README.md


### TODO Checklist

#### Faucet Testing Section

- [x] Add balance check before faucet request
- [ ] Implement faucet request using the nervos-functions API
- [ ] Verify balance increase after faucet receipt

#### Peer Connection Section

- [ ] Fetch peer list from testnet explorer
- [ ] Implement connection to known peers
- [ ] Verify successful peer connections

#### Channel Operations Section

- [ ] Test channel opening functionality
- [ ] Implement channel listing
- [ ] Verify channel states

#### Payment Testing Section

- [ ] Setup key_send payment test
- [ ] Execute payment transactions
- [ ] Verify payment success

