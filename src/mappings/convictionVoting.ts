/**
 * Mapping handlers for pallet_conviction_voting events.
 *
 * Events handled: Voted, VoteRemoved, Delegated, Undelegated
 */

import type { SubstrateEvent } from "@subql/types-substrate";
import { GovernanceVote } from "../../types/models/GovernanceVote.js";
import { GovernanceDelegation } from "../../types/models/GovernanceDelegation.js";
import { CHAIN_ID, subjectId, voteId, delegationId } from "./utils.js";

// ─── Voted ───────────────────────────────────────────────────────────────────

export async function handleVoteCast(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block, extrinsic } = event;

  // data: [who: AccountId, vote: AccountVote, index: u32]
  // AccountVote: { Standard: { vote: Vote, balance: Balance } } | { Split: ... } | { SplitAbstain: ... }
  const voter = (data[0] as { toString(): string }).toString();
  const voteRaw = (data[1] as { toJSON(): unknown }).toJSON() as Record<
    string,
    unknown
  >;
  const index = (data[2] as { toNumber(): number }).toNumber();
  const blockNumber = BigInt(block.block.header.number.toString());
  const timestamp = block.timestamp ?? new Date();

  // Decode stance + conviction from AccountVote variants
  let stance = "Aye";
  let conviction = 0;
  let balance = BigInt(0);

  const standard = getVariant(voteRaw, "standard");
  const splitAbstain = getVariant(voteRaw, "splitAbstain");
  const split = getVariant(voteRaw, "split");

  if (standard) {
    const std = standard as { vote: { aye: boolean; conviction: string | number }; balance: string };
    stance = std.vote.aye ? "Aye" : "Nay";
    conviction = typeof std.vote.conviction === "string"
      ? Number(std.vote.conviction.replace(/\D/g, ""))
      : std.vote.conviction;
    balance = BigInt(std.balance ?? "0");
  } else if (splitAbstain) {
    stance = "Abstain";
    const sa = splitAbstain as { aye: string; nay: string; abstain: string };
    balance = BigInt(sa.abstain ?? "0");
  } else if (split) {
    const sp = split as { aye: string; nay: string };
    // Treat split as Aye if aye > nay, else Nay
    const aye = BigInt(sp.aye ?? "0");
    const nay = BigInt(sp.nay ?? "0");
    stance = aye >= nay ? "Aye" : "Nay";
    balance = aye + nay;
  }

  const id = voteId(index, voter);
  let vote = await GovernanceVote.get(id);
  if (!vote) {
    vote = GovernanceVote.create({
      id,
      chainId: CHAIN_ID,
      referendumIndex: index,
      voter,
      stance,
      conviction,
      balance,
      isRemoved: false,
      subjectId: subjectId(index),
      blockNumber,
      extrinsicIndex: extrinsic?.idx ?? null,
      updatedAt: timestamp,
    });
  } else {
    vote.stance = stance;
    vote.conviction = conviction;
    vote.balance = balance;
    vote.isRemoved = false;
    vote.blockNumber = blockNumber;
    vote.updatedAt = timestamp;
  }
  await vote.save();
}

// ─── VoteRemoved ─────────────────────────────────────────────────────────────

export async function handleVoteRemoved(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;

  // data: [who: AccountId, index: u32, vote: AccountVote]
  const voter = (data[0] as { toString(): string }).toString();
  const index = (data[1] as { toNumber(): number }).toNumber();

  const id = voteId(index, voter);
  const vote = await GovernanceVote.get(id);
  if (vote) {
    vote.isRemoved = true;
    vote.updatedAt = block.timestamp ?? new Date();
    await vote.save();
  }
}

// ─── Delegated ───────────────────────────────────────────────────────────────

export async function handleDelegated(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;

  // data: [who: AccountId, target: AccountId]
  // NOTE: pallet_conviction_voting Delegated event only carries who+target;
  // track/conviction/balance come from the extrinsic call args, but SubQuery
  // event handlers only receive event data. We store what we can and default
  // track=0 since Delegated events don't include it reliably pre-decode.
  const delegator = (data[0] as { toString(): string }).toString();
  const delegatee = (data[1] as { toString(): string }).toString();

  // Use track 0 as the delegation key when track is not available from event.
  // The SubQuery project can be enhanced with call handlers for full fidelity.
  const track = 0;
  const id = delegationId(track, delegator);
  const blockNumber = BigInt(block.block.header.number.toString());
  const timestamp = block.timestamp ?? new Date();

  let delegation = await GovernanceDelegation.get(id);
  if (!delegation) {
    delegation = GovernanceDelegation.create({
      id,
      chainId: CHAIN_ID,
      track,
      delegator,
      delegatee,
      conviction: 0,
      balance: BigInt(0),
      isActive: true,
      blockNumber,
      updatedAt: timestamp,
    });
  } else {
    delegation.delegatee = delegatee;
    delegation.isActive = true;
    delegation.blockNumber = blockNumber;
    delegation.updatedAt = timestamp;
  }
  await delegation.save();
}

function getVariant(record: Record<string, unknown>, key: string): unknown {
  return record[key] ?? record[upperFirst(key)];
}

function upperFirst(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// ─── Undelegated ─────────────────────────────────────────────────────────────

export async function handleUndelegated(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;

  // data: [account: AccountId]
  const delegator = (data[0] as { toString(): string }).toString();
  const track = 0;
  const id = delegationId(track, delegator);
  const delegation = await GovernanceDelegation.get(id);
  if (delegation) {
    delegation.isActive = false;
    delegation.updatedAt = block.timestamp ?? new Date();
    await delegation.save();
  }
}
