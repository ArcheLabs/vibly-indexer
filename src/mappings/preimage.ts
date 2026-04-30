/**
 * Mapping handlers for pallet_preimage events.
 *
 * Events handled: Noted, Requested, Cleared
 */

import type { SubstrateEvent } from "@subql/types-substrate";
import { Preimage } from "../../types/models/Preimage.js";
import { CHAIN_ID } from "./utils.js";

export async function handlePreimageNoted(
  event: SubstrateEvent,
): Promise<void> {
  const { event: { data }, block } = event;

  // data: [hash: H256]
  const hash = (data[0] as { toHex(): string }).toHex();
  const blockNumber = BigInt(block.block.header.number.toString());
  const timestamp = block.timestamp ?? new Date();

  let preimage = await Preimage.get(hash);
  if (!preimage) {
    preimage = Preimage.create({
      id: hash,
      chainId: CHAIN_ID,
      hash,
      data: "",   // filled when preimage bytes are available via storage query
      len: 0,
      status: "Noted",
      blockNumber,
      updatedAt: timestamp,
    });
  } else {
    preimage.status = "Noted";
    preimage.blockNumber = blockNumber;
    preimage.updatedAt = timestamp;
  }
  await preimage.save();
}

export async function handlePreimageRequested(
  event: SubstrateEvent,
): Promise<void> {
  const { event: { data }, block } = event;

  const hash = (data[0] as { toHex(): string }).toHex();
  const blockNumber = BigInt(block.block.header.number.toString());
  const timestamp = block.timestamp ?? new Date();

  let preimage = await Preimage.get(hash);
  if (!preimage) {
    preimage = Preimage.create({
      id: hash,
      chainId: CHAIN_ID,
      hash,
      data: "",
      len: 0,
      status: "Requested",
      blockNumber,
      updatedAt: timestamp,
    });
  } else {
    preimage.status = "Requested";
    preimage.updatedAt = timestamp;
  }
  await preimage.save();
}

export async function handlePreimageCleared(
  event: SubstrateEvent,
): Promise<void> {
  const { event: { data }, block } = event;

  const hash = (data[0] as { toHex(): string }).toHex();
  const preimage = await Preimage.get(hash);
  if (preimage) {
    preimage.status = "Cleared";
    preimage.updatedAt = block.timestamp ?? new Date();
    await preimage.save();
  }
}
