/**
 * Mapping handlers for pallet_treasury events.
 *
 * Events handled: Proposed, Approved, Rejected, Awarded
 */

import type { SubstrateEvent } from "@subql/types";
import { TreasuryProposal } from "../types/models/TreasuryProposal";
import { CHAIN_ID } from "./utils";

function treasuryId(proposalIndex: number): string {
  return `${CHAIN_ID}:${proposalIndex}`;
}

export async function handleTreasuryProposed(
  event: SubstrateEvent,
): Promise<void> {
  const { event: { data }, block } = event;

  // data: [proposalIndex: ProposalIndex]
  // Proposer/beneficiary/value/bond come from the extrinsic call.
  // For now we index the index + defaults; call handler can enrich later.
  const proposalIndex = (data[0] as unknown as { toNumber(): number }).toNumber();
  const blockNumber = BigInt(block.block.header.number.toString());
  const timestamp = block.timestamp ?? new Date();
  const id = treasuryId(proposalIndex);

  const proposal = TreasuryProposal.create({
    id,
    chainId: CHAIN_ID,
    proposalIndex,
    proposer: "",
    beneficiary: "",
    value: BigInt(0),
    bond: BigInt(0),
    status: "Proposed",
    blockNumber,
    updatedAt: timestamp,
  });
  await proposal.save();
}

export async function handleTreasuryApproved(
  event: SubstrateEvent,
): Promise<void> {
  const { event: { data }, block } = event;

  const proposalIndex = (data[0] as unknown as { toNumber(): number }).toNumber();
  const proposal = await TreasuryProposal.get(treasuryId(proposalIndex));
  if (proposal) {
    proposal.status = "Approved";
    proposal.updatedAt = block.timestamp ?? new Date();
    await proposal.save();
  }
}

export async function handleTreasuryRejected(
  event: SubstrateEvent,
): Promise<void> {
  const { event: { data }, block } = event;

  const proposalIndex = (data[0] as unknown as { toNumber(): number }).toNumber();
  const proposal = await TreasuryProposal.get(treasuryId(proposalIndex));
  if (proposal) {
    proposal.status = "Rejected";
    proposal.updatedAt = block.timestamp ?? new Date();
    await proposal.save();
  }
}

export async function handleTreasuryAwarded(
  event: SubstrateEvent,
): Promise<void> {
  const { event: { data }, block } = event;

  const proposalIndex = (data[0] as unknown as { toNumber(): number }).toNumber();
  const proposal = await TreasuryProposal.get(treasuryId(proposalIndex));
  if (proposal) {
    proposal.status = "Awarded";
    proposal.updatedAt = block.timestamp ?? new Date();
    await proposal.save();
  }
}
