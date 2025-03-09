#!/bin/bash
set -e

echo "$(whoami) command: $0 $@"

# Ensure proper ownership - will only succeed if we have permissions
if [ "$(id -u)" = '0' ]; then
  # chown -R fiber for /fiber and current_workspace_dir
  find /fiber \! -user fiber -exec chown fiber '{}' + || true
  find . \! -user fiber -exec chown fiber '{}' + || true
  # similar to: exec su -c "$0 $@" fiber
  exec gosu fiber "$0" "$@"
fi
ls -la /fiber

# set an appropriate umask (if one isn't set already)
# - https://github.com/docker-library/redis/issues/305
# - https://github.com/redis/redis/blob/bb875603fb7ff3f9d19aad906bd45d7db98d9a39/utils/systemd-redis_server.service#L37
if [ "$(umask)" = '0022' ]; then
  umask 0077
fi

# Initialize CKB wallet if it doesn't exist
if [ ! -f "${BASE_DIR}/ckb/key" ]; then
  echo "Initializing new CKB wallet..."
  mkdir --mode=700 -p ${BASE_DIR}/ckb
  gpg --gen-random 2 32 | od -An -tx1 | tr -d ' \n' > ${BASE_DIR}/ckb/key
  chmod 400 ${BASE_DIR}/ckb/key
fi

echo "Current working directory: $(pwd), umask: $(umask)"
echo "Starting Fiber Network Node as user $(id -u):$(id -g)..."
exec "$@"
