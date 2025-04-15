# https://github.com/nervosnetwork/fiber/blob/ace6ed0bf5da72bc6495e51d1e6cea901796e6f3/rust-toolchain.toml#L2 is using rust 1.81.0
FROM rust:1.81-bookworm AS builder

RUN apt-get update && \
    apt-get install -y clang

# Set FIBER_VERSION to the version you want to build
ARG FIBER_VERSION=v0.5.0

# clone from https://github.com/nervosnetwork/fiber and build
RUN git clone -b main https://github.com/nervosnetwork/fiber.git /fiber
WORKDIR /fiber

# Build the application
RUN git checkout $FIBER_VERSION && cargo build --release \
 && lscpu \
 && ./target/release/fnn --version


# Build the final image
FROM debian:bookworm-slim
LABEL maintainer="Flouse" \
      description="Fiber Network Node"

# Install dependencies
RUN apt-get update && apt-get upgrade -y \
 && DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y \
    ca-certificates \
    tini \
    curl \
    gnupg \
 && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# add ckb-cli into the docker image
# https://github.com/nervosnetwork/ckb-cli/releases/tag/v1.12.0
ARG CKB_CLI_VERSION=v1.12.0
ARG Nervos_CI_SIGNATURE=8D09AC56856F84AFDB2CEB12E21C4F2E34FF2E93

RUN cd /tmp \
 && curl -LO https://github.com/nervosnetwork/ckb-cli/releases/download/${CKB_CLI_VERSION}/ckb-cli_${CKB_CLI_VERSION}_x86_64-unknown-linux-gnu.tar.gz \
 && curl -LO https://github.com/nervosnetwork/ckb-cli/releases/download/${CKB_CLI_VERSION}/ckb-cli_${CKB_CLI_VERSION}_x86_64-unknown-linux-gnu.tar.gz.asc \
 && gpg --verify --status-fd 1 \
        --verify ckb-cli_${CKB_CLI_VERSION}_x86_64-unknown-linux-gnu.tar.gz.asc \
                 ckb-cli_${CKB_CLI_VERSION}_x86_64-unknown-linux-gnu.tar.gz 2>&1 \
    | grep -C1 "using RSA key ${Nervos_CI_SIGNATURE}" \
 && echo "Found the signature of bot@nervos.org" \
 && tar xzf ckb-cli_${CKB_CLI_VERSION}_x86_64-unknown-linux-gnu.tar.gz \
 && cp ckb-cli_${CKB_CLI_VERSION}_x86_64-unknown-linux-gnu/ckb-cli /usr/local/bin/ckb-cli \
 && rm -rf /tmp \
 && chmod 755 /usr/local/bin/ckb-cli

# Copy application binary amd entrypoint script
COPY --from=builder /fiber/target/release/fnn /usr/local/bin/fnn
COPY entrypoint.sh /usr/local/bin/

# System accounts (-r flag) are specifically designed for running services/daemons
RUN useradd -r fiber --create-home --home-dir /fiber

# Setup default fiber storage location
ENV BASE_DIR=/fiber/.fiber-node
VOLUME ["${BASE_DIR}"]
WORKDIR /fiber

EXPOSE 8227 8228
STOPSIGNAL SIGINT

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -s -X POST -H "Content-Type: application/json" \
      --data '{"id":2,"jsonrpc":"2.0","method":"local_node_info","params":[]}' \
      http://localhost:8227 > /dev/null \
      || exit 1

# Set the entrypoint to https://github.com/krallin/tini
# ENTRYPOINT ["tini", "--", "entrypoint.sh"]
ENTRYPOINT ["tini", "--", "/usr/local/bin/entrypoint.sh"]
CMD [ "fnn", "--version" ]
