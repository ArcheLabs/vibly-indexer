/**
 * Mapping handlers for pallet_referenda events.
 *
 * Events handled:
 *   Submitted, DecisionStarted, ConfirmStarted, ConfirmAborted,
 *   Approved, Rejected, Cancelled, TimedOut, Killed
 */

import type { SubstrateEvent } from "@subql/types-substrate";
import { GovernanceSubject } from "../../types/models/GovernanceSubject.js";
import { CHAIN_ID, subjectId } from "./utils.js";

// ─── helpers ─────────────────────────────────────────────────────────────────

async function getOrCreate(
  index: number,
  track: number,
  blockNumber: bigint,
  timestamp: Date,
): Promise<GovernanceSubject> {
  const id = subjectId(index);
  let subject = await GovernanceSubject.get(id);
  if (!subject) {
    subject = GovernanceSubject.create({
      id,
      chainId: CHAIN_ID,
      referendumIndex: index,
      status: "Submitted",
      track,
      submittedAt: blockNumber,
      ayeVotes: BigInt(0),
      nayVotes: BigInt(0),
      abstainVotes: BigInt(0),
      updatedAt: timestamp,
    });
  }
  return subject;
}

// ─── Submitted ───────────────────────────────────────────────────────────────

export async function handleReferendumSubmitted(
  event: SubstrateEvent,
): Promise<void> {
  const {
    event: { data },
    block,
    extrinsic,
  } = event;

  // data: [index: u32, track: u16, proposal: Bounded<RuntimeCall, Hashing>]
  const index = (data[0] as { toNumber(): number }).toNumber();
  const track = (data[1] as { toNumber(): number }).toNumber();
  const proposalData = data[2] as { toHex(): string; toJSON(): unknown };

  const blockNumber = BigInt(block.block.header.number.toString());
  const timestamp = block.timestamp ?? new Date();
  const subject = await getOrCreate(index, track, blockNumber, timestamp);

  subject.status = "Submitted";
  subject.submittedAt = blockNumber;
  subject.proposalHash = proposalData.toHex();
  subject.updatedAt = timestamp;
  await subject.save();
}

// ─── DecisionStarted ─────────────────────────────────────────────────────────

export async function handleReferendumDecisionStarted(
  event: SubstrateEvent,
): Promise<void> {
  const { event: { data }, block } = event;

  // data: [index: u32, track: u16, proposal, tally: Tally]
  const index = (data[0] as { toNumber(): number }).toNumber();
  const track = (data[1] as { toNumber(): number }).toNumber();
  const tallyRaw = (data[3] as { toJSON(): unknown }).toJSON() as {
    ayes?: string;
    nays?: string;
    abstain?: string;
    support?: string;
  };

  const blockNumber = BigInt(block.block.header.number.toString());
  const timestamp = block.timestamp ?? new Date();
  const subject = await getOrCreate(index, track, blockNumber, timestamp);

  subject.status = "Deciding";
  subject.decidingSince = blockNumber;
  subject.ayeVotes = BigInt(tallyRaw.ayes ?? "0");
  subject.nayVotes = BigInt(tallyRaw.nays ?? "0");
  subject.abstainVotes = BigInt(tallyRaw.abstain ?? "0");
  subject.updatedAt = timestamp;
  await subject.save();
}

// ─── ConfirmStarted ──────────────────────────────────────────────────────────

export async function handleReferendumConfirmStarted(
  event: SubstrateEvent,
): Promise<void> {
  const { event: { data }, block } = event;

  const index = (data[0] as { toNumber(): number }).toNumber();
  const blockNumber = BigInt(block.block.header.number.toString());
  const timestamp = block.timestamp ?? new Date();
  const subject = await GovernanceSubject.get(subjectId(index));
  if (!subject) return;

  subject.status = "Confirming";
  subject.confirmingSince = blockNumber;
  subject.updatedAt = timestamp;
  await subject.save();
}

// ─── ConfirmAborted ──────────────────────────────────────────────────────────

export async function handleReferendumConfirmAborted(
  event: SubstrateEvent,
): Promise<void> {
  const { event: { data }, block } = event;

  const index = (data[0] as { toNumber(): number }).toNumber();
  const subject = await GovernanceSubject.get(subjectId(index));
  if (!subject) return;

  subject.status = "Deciding";
  subject.confirmingSince = undefined;
  subject.updatedAt = block.timestamp ?? new Date();
  await subject.save();
}

// ─── Approved ────────────────────────────────────────────────────────────────

export async function handleReferendumApproved(
  event: SubstrateEvent,
): Promise<void> {
  const { event: { data }, block } = event;

  const index = (data[0] as { toNumber(): number }).toNumber();
  const blockNumber = BigInt(block.block.header.number.toString());
  const subject = await GovernanceSubject.get(subjectId(index));
  if (!subject) return;

  subject.status = "Approved";
  subject.decidedAt = blockNumber;
  subject.updatedAt = block.timestamp ?? new Date();
  await subject.save();
}

// ─── Rejected ────────────────────────────────────────────────────────────────

export async function handleReferendumRejected(
  event: SubstrateEvent,
): Promise<void> {
  const { event: { data }, block } = event;

  const index = (data[0] as { toNumber(): number }).toNumber();
  const blockNumber = BigInt(block.block.header.number.toString());
  const subject = await GovernanceSubject.get(subjectId(index));
  if (!subject) return;

  subject.status = "Rejected";
  subject.decidedAt = blockNumber;
  subject.updatedAt = block.timestamp ?? new Date();
  await subject.save();
}

// ─── Cancelled ───────────────────────────────────────────────────────────────

export async function handleReferendumCancelled(
  event: SubstrateEvent,
): Promise<void> {
  const { event: { data }, block } = event;

  const index = (data[0] as { toNumber(): number }).toNumber();
  const blockNumber = BigInt(block.block.header.number.toString());
  const subject = await GovernanceSubject.get(subjectId(index));
  if (!subject) return;

  subject.status = "Cancelled";
  subject.decidedAt = blockNumber;
  subject.updatedAt = block.timestamp ?? new Date();
  await subject.save();
}

// ─── TimedOut ────────────────────────────────────────────────────────────────

export async function handleReferendumTimedOut(
  event: SubstrateEvent,
): Promise<void> {
  const { event: { data }, block } = event;

  const index = (data[0] as { toNumber(): number }).toNumber();
  const blockNumber = BigInt(block.block.header.number.toString());
  const subject = await GovernanceSubject.get(subjectId(index));
  if (!subject) return;

  subject.status = "TimedOut";
  subject.decidedAt = blockNumber;
  subject.updatedAt = block.timestamp ?? new Date();
  await subject.save();
}

// ─── Killed ──────────────────────────────────────────────────────────────────

export async function handleReferendumKilled(
  event: SubstrateEvent,
): Promise<void> {
  const { event: { data }, block } = event;

  const index = (data[0] as { toNumber(): number }).toNumber();
  const blockNumber = BigInt(block.block.header.number.toString());
  const subject = await GovernanceSubject.get(subjectId(index));
  if (!subject) return;

  subject.status = "Killed";
  subject.decidedAt = blockNumber;
  subject.updatedAt = block.timestamp ?? new Date();
  await subject.save();
}
