import type { SubstrateBlock } from "@subql/types";
import { ChainCheckpoint } from "../types/models/ChainCheckpoint";
import { CHAIN_ID } from "./utils";

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  const blockNumber = BigInt(block.block.header.number.toString());
  const blockHash = block.block.header.hash.toHex();

  let checkpoint = await ChainCheckpoint.get(CHAIN_ID);
  if (!checkpoint) {
    checkpoint = ChainCheckpoint.create({
      id: CHAIN_ID,
      chainId: CHAIN_ID,
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
