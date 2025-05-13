import { multiaddr } from '@multiformats/multiaddr';
import { readFileSync } from 'fs';
import { hd, helpers, config, RPC } from '@ckb-lumos/lumos';
import { PUBLIC_CKB_TESTNET_RPC } from '../common/constants';

export const parsePeerId = (addr: string): string => {
  const ma = multiaddr(addr);
  const peerId = ma.getPeerId();
  if (!peerId) {
    throw new Error('The multiaddr is missing peerId.');
  }
  return peerId;
};

/**
 * Retrieves the testnet address derived from a private key stored in the specified key file (default: 'plain.key').
 *
 * Reads the private key from the given file path, derives the account using Lumos, and returns the associated address as a string. The address is also logged to the console.
 *
 * @param {string} [keyPath='plain.key'] - Path to the private key file.
 * @returns {string} The derived testnet address.
 *
 * @throws {Error} If the key file cannot be read or the address cannot be derived.
 */
export const getTestnetAddress = (keyPath: string = 'plain.key'): string => {
  // Initialize config for testnet (AGGRON4)
  config.initializeConfig(config.TESTNET);

  const privateKey = readFileSync(keyPath, 'utf-8').trim();
  const args = hd.key.privateKeyToBlake160(privateKey);

  // Create a lock script using the Blake160 hash
  const template = config.TESTNET.SCRIPTS.SECP256K1_BLAKE160;
  const lockScript = {
    codeHash: template.CODE_HASH,
    hashType: template.HASH_TYPE,
    args: args,
  };

  return helpers.encodeToAddress(lockScript);
};

/**
 * Retrieves the total capacity (in shannons) for a given CKB address.
 *
 * @param addr - The CKB address whose capacity is to be fetched.
 * @returns A promise that resolves to the total capacity as a number (in shannons).
 */
export const getCapacity = async (addr: string): Promise<bigint> => {
  // TODO: use diff rpc for testnet and mainnet
  const rpc = new RPC(PUBLIC_CKB_TESTNET_RPC);
  const lock = helpers.parseAddress(addr);

  const result = await rpc.getCellsCapacity({
    script: lock,
    scriptType: 'lock',
  });
  const totalCapacity = BigInt(result.capacity || '0');

  return totalCapacity;
};

/**
 * Ensures that the specified CKB address has at least the minimum required capacity.
 * If the balance is insufficient, attempts to request additional funds from a faucet.
 *
 * @param address - The CKB address to check.
 * @param minimumCKB - The minimum required capacity in CKB (default is 10,000 CKB).
 * @returns A promise that resolves when the check (and possible faucet request) is complete.
 * @throws Exits the process if there is an error checking the balance or requesting from the faucet.
 */
export const ensureEnoughCapacity = async (address: string, minimumCKB: bigint = 10000n): Promise<void> => {
  try {
    const balanceShannons = await getCapacity(address);

    if (balanceShannons > minimumCKB * 100000000n) {
      console.log(`Balance of ${address}: ${balanceShannons} shannons is sufficient.`);
      return;
    }

    console.log(`Balance ${balanceShannons} shannons is less than ${minimumCKB} CKB, requesting faucet`);
    const faucetUrl = `https://nervos-functions.vercel.app/api/faucet?target_ckt_address=${address}`;
    const response = await fetch(faucetUrl);
    const responseBody = await response.text();
    console.log(`Faucet response: ${responseBody}`);
  } catch (error: any) {
    console.error(`Error checking balance or requesting faucet: ${error.message}`);
    process.exit(1);
  }
};
