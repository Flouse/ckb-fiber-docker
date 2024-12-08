# CKB Fiber Docker

[![Automatic builds badge](https://github.com/Flouse/ckb-fiber-docker/actions/workflows/docker.yml/badge.svg)](https://github.com/Flouse/ckb-fiber-docker/actions/workflows/docker.yml)
[![Docker Image Size](https://ghcr-badge.egpl.dev/flouse/ckb-fiber/size)][GHCR]

Docker image that contains the CKB [Fiber Network Node (FNN)](https://github.com/nervosnetwork/fiber) and [ckb-cli](https://github.com/nervosnetwork/ckb-cli) for easy deployment.


## Check the version
```bash
export FIBER_IMAGE=ghcr.io/flouse/ckb-fiber:fiber-commit-d72a274c30d89b50f668e3b04b594195102f387e-ckb-cli-v1.12.0

docker run --rm ${FIBER_IMAGE} ckb-cli --version
# Output: ckb-cli 1.12.0 (278c7be 2024-09-20)

docker run --rm ${FIBER_IMAGE}
# Ouptut: fnn 0.1.0

# Usage
docker run --rm ${FIBER_IMAGE} fnn --help
```


## How to Run a testnet node
See https://github.com/nervosnetwork/fiber?tab=readme-ov-file#build-and-run-a-testnet-node


## RPC docs of Fiber Network Node

See https://github.com/nervosnetwork/fiber/blob/main/README.md

<!--
## Useful CMDs

### node_info
```bash
curl -X POST http://localhost:14227 -H 'Content-Type: application/json' \
 -d '{"jsonrpc": "2.0", "method": "node_info", "params": [], "id": 1}'
```
-->


[GHCR]: https://github.com/Flouse/ckb-fiber-docker/pkgs/container/ckb-fiber