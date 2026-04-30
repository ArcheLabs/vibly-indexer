import type { SubstrateBlock } from "@subql/types-substrate";
import { GovernanceCheckpoint } from "../types/models/GovernanceCheckpoint.js";

const CHAIN_ID = process.env["CHAIN_ID"] ?? "substrate:vibly-solo";

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  const blockNumber = BigInt(block.block.header.number.toString());
  const blockHash = block.block.header.hash.toHex();

  let checkpoint = await GovernanceCheckpoint.get(CHAIN_ID);
  if (!checkpoint) {
    checkpoint = GovernanceCheckpoint.create({
      id: CHAIN_ID,
      blockNumber,
      blockHash,
      updatedAt: block.timestamp ?? new Date(),
    });
  } else {
    checkpoint.blockNumber = blockNumber;
    checkpoint.blockHash = blockHash;
    checkpoint.updatedAt = block.timestamp ?? new Date();
  }
  await checkpoint.save();
}
