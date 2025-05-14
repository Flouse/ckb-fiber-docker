import { describe, expect, test, spyOn, mock } from "bun:test";
import { unlinkSync, writeFileSync } from "fs";
import { getCapacity, getTestnetAddress, ensureEnoughCapacity } from '../utils/index';

describe('Utility Functions', () => {
  test('getTestnetAddress should derive address and log it', () => {
    const mockPrivateKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const expectedTestnetAddress = 'ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqvqdeg5xpmqwhfk9na359mh6epkuf5wpxslsudvk';
    const tempKeyPath = 'mock_plain.key';
    writeFileSync(tempKeyPath, mockPrivateKey, 'utf-8');

    const derivedAddress = getTestnetAddress(tempKeyPath);
    expect(typeof derivedAddress).toBe('string');
    expect(derivedAddress.length).toBeGreaterThan(10);
    expect(derivedAddress).toMatch(/^ckt1/);
    expect(derivedAddress).toBe(expectedTestnetAddress);

    unlinkSync(tempKeyPath);
  });

  test('getCapacity should return balance in shannons', async () => {
    const addr = 'ckt1qrfrwcdnvssswdwpn3s9v8fp87emat306ctjwsm3nmlkjg8qyza2cqgqqxfnlwyyw50gmykqddfgyddgz8n72auesyy8yx05';

    const balance = await getCapacity(addr);
    expect(typeof balance).toBe('bigint');
    expect(balance).toBeGreaterThan(0n);

    console.log(`Balance of address ${addr}: ${balance} shannons`);
  });

  test.skip('ensureEnoughCapacity should call faucet and log response if balance is insufficient', async () => {
    const testAddr = 'ckt1qrfrwcdnvssswdwpn3s9v8fp87emat306ctjwsm3nmlkjg8qyza2cqgqqygc55c6r005l3jpg6d25qtrj37qk0rlpyh0agze';
    const balance1 = await getCapacity(testAddr);
    if (balance1 < 10000n * 100000000n) {
      await ensureEnoughCapacity(testAddr);

      // Wait for 10 seconds to allow the faucet to process
      await Bun.sleep(50000);

      const balance2 = await getCapacity(testAddr);
      console.log(`New balance of address ${testAddr}: ${balance2} shannons`);
      expect(balance2).toBeGreaterThan(balance1);
    }
  }, { timeout: 60000 });

});
