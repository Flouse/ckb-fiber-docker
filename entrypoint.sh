#!/bin/bash
set -e

# Ensure proper ownership - will only succeed if we have permissions
setup_directories() {
  # Create required directories if they don't exist
  mkdir -p "${BASE_DIR}/ckb"

  # chown -R fiber for /fiber and current_workspace_dir
  find /fiber \! -user fiber -exec chown fiber '{}' +
  ls -la /fiber
  find . \! -user fiber -exec chown fiber '{}' +
  ls -la

  # set an appropriate umask (if one isn't set already)
  # - https://github.com/docker-library/redis/issues/305
  # - https://github.com/redis/redis/blob/bb875603fb7ff3f9d19aad906bd45d7db98d9a39/utils/systemd-redis_server.service#L37
  if [ "$(umask)" = '0022' ]; then
    umask 0077
  fi
}

# Initialize CKB wallet if it doesn't exist
initialize_ckb_wallet() {
  if [ ! -f "${BASE_DIR}/ckb/key" ]; then
    echo "Initializing new CKB wallet..."
    gpg --gen-random 2 32 | od -An -tx1 | tr -d ' \n' > ${BASE_DIR}/ckb/key
  fi
}

# Main entrypoint logic
setup_directories
initialize_ckb_wallet

echo "Current working directory: $(pwd), umask: $(umask)"
echo "Starting Fiber Network Node as user $(id -u):$(id -g)..."
exec "$@"
