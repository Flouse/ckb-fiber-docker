import { beforeAll, describe, expect, it, mock } from "bun:test";
import { getLatestChannel } from "../../channel";
import { FIBER_RPC_URL } from "../../common/constants";
import { FiberRPC } from "../client";

describe("Channel", () => {
  let rpc: FiberRPC;

  beforeAll(() => {
    rpc = new FiberRPC(FIBER_RPC_URL);
  });

  it("should return most recent channel when multiple exist", async () => {
    const mockRpc = {
      listChannels: mock(async () => [
        {
          "channel_id": "0x20f4057f1e86f2e3df02b7a2fe168a45c3e24b149e9f6888fe41ccb5a99b5d6c",
          "is_public": true,
          "channel_outpoint": "0xae95ec3cfd75e687977c88df441f764092d7d6e2ecf1dc62dc4a89c88d37557e00000000",
          "peer_id": "QmQV3TSUHForNR3MDxeirxUr8aPuc3twfLkvVByCD2XD9C",
          "funding_udt_type_script": null,
          "state": {
            "state_name": "AWAITING_CHANNEL_READY",
            "state_flags": ""
          },
          "local_balance": "0x0",
          "offered_tlc_balance": "0x0",
          "remote_balance": "0x15d6ea6a08",
          "received_tlc_balance": "0x0",
          "latest_commitment_transaction_hash": "0xd496e9788714f34a685d9a731c9dde2de66454200e2ab377f8a5c04c1858dab5",
          "created_at": "0x195ae068e45",
          "enabled": true,
          "tlc_expiry_delta": "0x5265c00",
          "tlc_fee_proportional_millionths": "0x3e8"
        },
        {
          "channel_id": "0x193dee9a0db757e0d91f9387808dd9639c96a3b9c18966bc6b599c5aaee13077",
          "is_public": true,
          "channel_outpoint": "0x4a422192c0a8dc7349e103423382c03ba7114bcdb8484012b4783896ce26a3c100000000",
          "peer_id": "QmP3sKhSufHWCvv6RhxhiDzUZ1NnRYntC1YaZNDcHeStqD",
          "funding_udt_type_script": null,
          "state": {
            "state_name": "CHANNEL_READY"
          },
          "local_balance": "0x0",
          "offered_tlc_balance": "0x0",
          "remote_balance": "0x15d6ea6a07",
          "received_tlc_balance": "0x0",
          "latest_commitment_transaction_hash": "0xa84eb22076d1a29ad6a068b6a8a56dcffabd7f721912474a76e1c6644d22896a",
          "created_at": "0x195ade92a22",
          "enabled": true,
          "tlc_expiry_delta": "0x5265c00",
          "tlc_fee_proportional_millionths": "0x3e8"
        }
      ])
    } as unknown as FiberRPC;
    const channel = await getLatestChannel(mockRpc, "peer1");
    expect(channel?.channel_id).toEqual("0x20f4057f1e86f2e3df02b7a2fe168a45c3e24b149e9f6888fe41ccb5a99b5d6c");
  });

  it("should return undefined when no channels exist", async () => {
    const mockRpc = {
      listChannels: mock(async () => [])
    } as unknown as FiberRPC;

    const channel = await getLatestChannel(mockRpc, "peer1");
    expect(channel).toBeUndefined();
  });

  it("should handle RPC errors gracefully", async () => {
    const mockRpc = {
      listChannels: mock(async () => {
        throw new Error("RPC Failed");
      })
    } as unknown as FiberRPC;

    await expect(getLatestChannel(mockRpc, "peer1")).rejects.toThrow("RPC Failed");
  });
});
