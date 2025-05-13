#!/bin/bash
set -e

has_cap() {
	/usr/bin/setpriv -d | grep -q 'Capability bounding set:.*\b'$1'\b'
}

echo "$(whoami) command: $0 $@"

# Ensure proper ownership - will only succeed if we have permissions
if [ "$(id -u)" = '0' ]; then
  echo "Changing ownership of /fiber and current_workspace_dir to user fiber"

  # chown -R fiber for /fiber and current_workspace_dir
  find /fiber \! -user fiber -exec chown fiber '{}' + || true
  find . \! -user fiber -exec chown fiber '{}' + || true

  # enhance security by running processes with the least privilege necessary
  exec setpriv \
    --reuid fiber --regid fiber \
    --clear-groups --nnp \
    --inh-caps=-all \
    --ambient-caps=-all \
    --bounding-set=-all \
    "$0" "$@"
fi

# set an appropriate umask (if one isn't set already)
# - https://github.com/docker-library/redis/issues/305
# - https://github.com/redis/redis/blob/bb875603fb7ff3f9d19aad906bd45d7db98d9a39/utils/systemd-redis_server.service#L37
if [ "$(umask)" = '0022' ]; then
  umask 0077
fi

# Initialize CKB wallet if it doesn't exist
if [[ ! -f "${BASE_DIR}/ckb/key" ]]; then
  echo "Initializing new CKB wallet..."
  mkdir --mode=700 -p ${BASE_DIR}/ckb
  gpg --gen-random 2 32 | od -An -tx1 | tr -d ' \n' > ${BASE_DIR}/ckb/key
  chmod 600 ${BASE_DIR}/ckb/key
fi

echo "Current working directory: $(pwd), umask: $(umask)"

# Export selected environment variables if they exist
[ -n "${BASE_DIR}" ] && export BASE_DIR
if [[ -n "${FIBER_SECRET_KEY_PASSWORD}" ]]; then
  export FIBER_SECRET_KEY_PASSWORD
else
  echo "FIBER_SECRET_KEY_PASSWORD environment variable is required" >&2
  exit 1
fi
export HOME=/fiber

if [[ "$(tr -d ' \n\r\t' < "${BASE_DIR}/ckb/key")" =~ ^[0-9A-Fa-f]+$ ]]; then
  echo "Import the account to ckb-cli before the key is encrypted"

  # TODO: use FIBER_SECRET_KEY_PASSWORD as ckb-cli wallet password
  echo -e "\n" \
    | ckb-cli account import --privkey-path ${BASE_DIR}/ckb/key \
    | grep -A 1 'testnet:' | grep 'ckt1' | awk '{print $2}' | head --lines=1
fi

ckb-cli account list

echo "Starting as user fiber $(id -u):$(id -g)... "
exec "$@"
