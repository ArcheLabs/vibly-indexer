/**
 * Mapping handlers for pallet_agent_staking events.
 */

import type { SubstrateEvent } from "@subql/types";
import { AgentStakeEvent } from "../types/models/AgentStakeEvent";
import { AgentStakeLedger } from "../types/models/AgentStakeLedger";
import {
  CHAIN_ID,
  agentStakeEventEntityId,
  agentStakeLedgerEntityId,
} from "./utils";

function str(v: unknown): string {
  return (v as { toString(): string }).toString();
}

function blockNum(block: SubstrateEvent["block"]): bigint {
  return BigInt(block.block.header.number.toString());
}

function extrinsicIndex(event: SubstrateEvent): number | undefined {
  return event.extrinsic ? (event.extrinsic as { idx?: number }).idx ?? undefined : undefined;
}

function refToString(v: unknown): string | undefined {
  if (v == null) return undefined;
  const json = (v as { toJSON?: () => unknown }).toJSON?.() ?? v;
  if (json == null) return undefined;
  if (typeof json === "string") return json;
  return JSON.stringify(json);
}

async function appendStakeEvent(
  event: SubstrateEvent,
  input: {
    identityId: string;
    agentId: string;
    fundingAccount?: string;
    eventType: string;
    amount?: bigint;
    activeAmount?: bigint;
    unlockAtBlock?: bigint;
    reasonRef?: string;
  },
): Promise<void> {
  const bn = blockNum(event.block);
  const eventIndex = event.idx ?? 0;
  const row = AgentStakeEvent.create({
    id: agentStakeEventEntityId(input.identityId, input.agentId, bn, eventIndex),
    chainId: CHAIN_ID,
    identityId: input.identityId,
    agentId: input.agentId,
    fundingAccount: input.fundingAccount,
    eventType: input.eventType,
    amount: input.amount,
    activeAmount: input.activeAmount,
    unlockAtBlock: input.unlockAtBlock,
    reasonRef: input.reasonRef,
    blockNumber: bn,
    extrinsicIndex: extrinsicIndex(event),
    eventIndex,
    blockHash: event.block.block.header.hash.toHex(),
    timestamp: event.block.timestamp ?? undefined,
  });
  await row.save();
}

async function upsertLedger(
  event: SubstrateEvent,
  input: {
    identityId: string;
    agentId: string;
    fundingAccount?: string;
    activeDelta?: bigint;
    unbondingDelta?: bigint;
    activeAmount?: bigint;
    unlockAtBlock?: bigint;
    releaseBlocked?: boolean;
    releaseBlockReason?: string | null;
  },
): Promise<AgentStakeLedger> {
  const id = agentStakeLedgerEntityId(input.identityId, input.agentId);
  const existing = await AgentStakeLedger.get(id);
  const zero = BigInt(0);
  const activeAmount = input.activeAmount ?? ((existing?.activeAmount ?? zero) + (input.activeDelta ?? zero));
  const unbondingAmount = (existing?.unbondingAmount ?? zero) + (input.unbondingDelta ?? zero);
  const releaseBlocked = input.releaseBlocked ?? existing?.releaseBlocked ?? false;
  const status = activeAmount > zero ? "Active" : unbondingAmount > zero ? "Unbonding" : "Released";
  const ledger = AgentStakeLedger.create({
    id,
    chainId: CHAIN_ID,
    identityId: input.identityId,
    agentId: input.agentId,
    fundingAccount: input.fundingAccount ?? existing?.fundingAccount,
    activeAmount,
    unbondingAmount,
    status,
    unlockAtBlock: input.unlockAtBlock ?? existing?.unlockAtBlock,
    releaseBlocked,
    releaseBlockReason: input.releaseBlockReason === null ? undefined : input.releaseBlockReason ?? existing?.releaseBlockReason,
    updatedAtBlock: blockNum(event.block),
  });
  await ledger.save();
  return ledger;
}

export async function handleAgentStakeBonded(event: SubstrateEvent): Promise<void> {
  const { data } = event.event;
  const identityId = str(data[0]);
  const agentId = str(data[1]);
  const fundingAccount = str(data[2]);
  const amount = BigInt(str(data[3]));
  const activeAmount = BigInt(str(data[4]));
  await upsertLedger(event, { identityId, agentId, fundingAccount, activeAmount });
  await appendStakeEvent(event, { identityId, agentId, fundingAccount, eventType: "Bonded", amount, activeAmount });
}

export async function handleAgentStakeUnbondRequested(event: SubstrateEvent): Promise<void> {
  const { data } = event.event;
  const identityId = str(data[0]);
  const agentId = str(data[1]);
  const fundingAccount = str(data[2]);
  const amount = BigInt(str(data[3]));
  const unlockAtBlock = BigInt(str(data[4]));
  await upsertLedger(event, { identityId, agentId, fundingAccount, activeDelta: -amount, unbondingDelta: amount, unlockAtBlock });
  await appendStakeEvent(event, { identityId, agentId, fundingAccount, eventType: "UnbondRequested", amount, unlockAtBlock });
}

export async function handleAgentStakeUnbondCancelled(event: SubstrateEvent): Promise<void> {
  const { data } = event.event;
  const identityId = str(data[0]);
  const agentId = str(data[1]);
  const fundingAccount = str(data[2]);
  const amount = BigInt(str(data[3]));
  await upsertLedger(event, { identityId, agentId, fundingAccount, activeDelta: amount, unbondingDelta: -amount });
  await appendStakeEvent(event, { identityId, agentId, fundingAccount, eventType: "UnbondCancelled", amount });
}

export async function handleAgentStakeReleaseBlocked(event: SubstrateEvent): Promise<void> {
  const { data } = event.event;
  const identityId = str(data[0]);
  const agentId = str(data[1]);
  const reasonRef = refToString(data[2]);
  await upsertLedger(event, { identityId, agentId, releaseBlocked: true, releaseBlockReason: reasonRef });
  await appendStakeEvent(event, { identityId, agentId, eventType: "ReleaseBlocked", reasonRef });
}

export async function handleAgentStakeReleaseCleared(event: SubstrateEvent): Promise<void> {
  const { data } = event.event;
  const identityId = str(data[0]);
  const agentId = str(data[1]);
  await upsertLedger(event, { identityId, agentId, releaseBlocked: false, releaseBlockReason: null });
  await appendStakeEvent(event, { identityId, agentId, eventType: "ReleaseCleared" });
}

export async function handleAgentStakeReleased(event: SubstrateEvent): Promise<void> {
  const { data } = event.event;
  const identityId = str(data[0]);
  const agentId = str(data[1]);
  const fundingAccount = str(data[2]);
  const amount = BigInt(str(data[3]));
  await upsertLedger(event, { identityId, agentId, fundingAccount, unbondingDelta: -amount });
  await appendStakeEvent(event, { identityId, agentId, fundingAccount, eventType: "Released", amount });
}
