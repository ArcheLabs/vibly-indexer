import type { SubstrateEvent } from "@subql/types";
import { AgentRewardEvent } from "../types/models/AgentRewardEvent";
import { AgentRewardLedger } from "../types/models/AgentRewardLedger";
import { RewardDayState } from "../types/models/RewardDayState";
import { RoundRewardSettlement } from "../types/models/RoundRewardSettlement";
import { TaskRewardSettlement } from "../types/models/TaskRewardSettlement";
import {
  CHAIN_ID,
  agentRewardEventEntityId,
  agentRewardLedgerEntityId,
  rewardDayStateEntityId,
  roundRewardSettlementEntityId,
  taskRewardSettlementEntityId,
} from "./utils";

type RewardLedgerSnapshot = {
  claimableTotal: bigint;
  claimedTotal: bigint;
  claimableBase: bigint;
  claimableObserver: bigint;
  claimableReviewer: bigint;
  claimableTask: bigint;
  claimedBase: bigint;
  claimedObserver: bigint;
  claimedReviewer: bigint;
  claimedTask: bigint;
};

type AgentRef = {
  identityId: string;
  agentId: string;
};

function str(v: unknown): string {
  return (v as { toString(): string }).toString();
}

function num(v: unknown): number {
  return Number(str(v));
}

function big(v: unknown): bigint {
  return BigInt(str(v));
}

function blockNum(block: SubstrateEvent["block"]): bigint {
  return BigInt(block.block.header.number.toString());
}

function extrinsicIndex(event: SubstrateEvent): number | undefined {
  return event.extrinsic ? (event.extrinsic as { idx?: number }).idx ?? undefined : undefined;
}

function zeroSnapshot(): RewardLedgerSnapshot {
  return {
    claimableTotal: BigInt(0),
    claimedTotal: BigInt(0),
    claimableBase: BigInt(0),
    claimableObserver: BigInt(0),
    claimableReviewer: BigInt(0),
    claimableTask: BigInt(0),
    claimedBase: BigInt(0),
    claimedObserver: BigInt(0),
    claimedReviewer: BigInt(0),
    claimedTask: BigInt(0),
  };
}

function deltaSnapshot(next: RewardLedgerSnapshot, prev: RewardLedgerSnapshot): RewardLedgerSnapshot {
  return {
    claimableTotal: next.claimableTotal - prev.claimableTotal,
    claimedTotal: next.claimedTotal - prev.claimedTotal,
    claimableBase: next.claimableBase - prev.claimableBase,
    claimableObserver: next.claimableObserver - prev.claimableObserver,
    claimableReviewer: next.claimableReviewer - prev.claimableReviewer,
    claimableTask: next.claimableTask - prev.claimableTask,
    claimedBase: next.claimedBase - prev.claimedBase,
    claimedObserver: next.claimedObserver - prev.claimedObserver,
    claimedReviewer: next.claimedReviewer - prev.claimedReviewer,
    claimedTask: next.claimedTask - prev.claimedTask,
  };
}

function parseLedgerJson(raw: Record<string, unknown> | null): RewardLedgerSnapshot {
  if (!raw) return zeroSnapshot();
  return {
    claimableTotal: big(raw["claimableTotal"] ?? 0),
    claimedTotal: big(raw["claimedTotal"] ?? 0),
    claimableBase: big(raw["claimableBase"] ?? 0),
    claimableObserver: big(raw["claimableObserver"] ?? 0),
    claimableReviewer: big(raw["claimableReviewer"] ?? 0),
    claimableTask: big(raw["claimableTask"] ?? 0),
    claimedBase: big(raw["claimedBase"] ?? 0),
    claimedObserver: big(raw["claimedObserver"] ?? 0),
    claimedReviewer: big(raw["claimedReviewer"] ?? 0),
    claimedTask: big(raw["claimedTask"] ?? 0),
  };
}

async function fetchRewardLedger(identityId: string, agentId: string): Promise<RewardLedgerSnapshot> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const record = await (api as any).query.agentIncentives.agentRewardLedgers([identityId, agentId]);
    const json = record.toJSON() as Record<string, unknown> | null;
    return parseLedgerJson(json);
  } catch (_) {
    return zeroSnapshot();
  }
}

async function upsertRewardLedger(
  event: SubstrateEvent,
  identityId: string,
  agentId: string,
): Promise<{ next: RewardLedgerSnapshot; delta: RewardLedgerSnapshot }> {
  const id = agentRewardLedgerEntityId(identityId, agentId);
  const existing = await AgentRewardLedger.get(id);
  const prev: RewardLedgerSnapshot = existing
    ? {
        claimableTotal: existing.claimableTotal,
        claimedTotal: existing.claimedTotal,
        claimableBase: existing.claimableBase,
        claimableObserver: existing.claimableObserver,
        claimableReviewer: existing.claimableReviewer,
        claimableTask: existing.claimableTask,
        claimedBase: existing.claimedBase,
        claimedObserver: existing.claimedObserver,
        claimedReviewer: existing.claimedReviewer,
        claimedTask: existing.claimedTask,
      }
    : zeroSnapshot();
  const next = await fetchRewardLedger(identityId, agentId);
  const ledger = AgentRewardLedger.create({
    id,
    chainId: CHAIN_ID,
    identityId,
    agentId,
    ...next,
    updatedAtBlock: blockNum(event.block),
  });
  await ledger.save();
  return { next, delta: deltaSnapshot(next, prev) };
}

async function upsertRewardDayState(event: SubstrateEvent, dayIndex: number): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const record = await (api as any).query.agentIncentives.dailyEmissionStates(dayIndex);
    const json = record.toJSON() as Record<string, unknown> | null;
    if (!json) return;
    const row = RewardDayState.create({
      id: rewardDayStateEntityId(dayIndex),
      chainId: CHAIN_ID,
      dayIndex,
      baseStakingBudget: big(json["baseStakingBudget"] ?? 0),
      observerReviewerBudget: big(json["observerReviewerBudget"] ?? 0),
      taskMarketBudget: big(json["taskMarketBudget"] ?? 0),
      baseStakingReleased: big(json["baseStakingReleased"] ?? 0),
      observerReviewerReleased: big(json["observerReviewerReleased"] ?? 0),
      taskMarketReleased: big(json["taskMarketReleased"] ?? 0),
      rolloverBaseStaking: big(json["rolloverBaseStaking"] ?? 0),
      rolloverObserverReviewer: big(json["rolloverObserverReviewer"] ?? 0),
      rolloverTaskMarket: big(json["rolloverTaskMarket"] ?? 0),
      baseStakingSettled: Boolean(json["baseStakingSettled"]),
      observerRoundsSettled: Number(json["observerRoundsSettled"] ?? 0),
      reviewerRoundsSettled: Number(json["reviewerRoundsSettled"] ?? 0),
      taskRewardsSettled: Number(json["taskRewardsSettled"] ?? 0),
      updatedAtBlock: blockNum(event.block),
    });
    await row.save();
  } catch (_) {
    // Ignore transient storage decoding errors.
  }
}

function parseAgentRefs(raw: unknown): AgentRef[] {
  const json = (raw as { toJSON?: () => unknown }).toJSON?.() ?? raw;
  if (!Array.isArray(json)) return [];
  return json
    .map((item) => item as Record<string, unknown>)
    .filter((item) => item && item["identityId"] != null && item["agentId"] != null)
    .map((item) => ({
      identityId: String(item["identityId"]),
      agentId: String(item["agentId"]),
    }));
}

function extrinsicArgs(event: SubstrateEvent): unknown[] {
  const extrinsic = event.extrinsic as
    | { extrinsic?: { method?: { args?: unknown[] } } }
    | undefined;
  return extrinsic?.extrinsic?.method?.args ?? [];
}

async function appendRewardEvent(
  event: SubstrateEvent,
  input: {
    identityId: string;
    agentId: string;
    eventType: string;
    rewardKind: string;
    amount: bigint;
    baseAmount?: bigint;
    observerAmount?: bigint;
    reviewerAmount?: bigint;
    taskAmount?: bigint;
    dayIndex?: number;
    roundId?: string;
    taskId?: string;
    ownerAccount?: string;
  },
): Promise<void> {
  const bn = blockNum(event.block);
  const eventIndex = event.idx ?? 0;
  const row = AgentRewardEvent.create({
    id: agentRewardEventEntityId(input.identityId, input.agentId, bn, eventIndex, input.eventType),
    chainId: CHAIN_ID,
    identityId: input.identityId,
    agentId: input.agentId,
    eventType: input.eventType,
    rewardKind: input.rewardKind,
    amount: input.amount,
    baseAmount: input.baseAmount ?? BigInt(0),
    observerAmount: input.observerAmount ?? BigInt(0),
    reviewerAmount: input.reviewerAmount ?? BigInt(0),
    taskAmount: input.taskAmount ?? BigInt(0),
    dayIndex: input.dayIndex,
    roundId: input.roundId,
    taskId: input.taskId,
    ownerAccount: input.ownerAccount,
    blockNumber: bn,
    extrinsicIndex: extrinsicIndex(event),
    eventIndex,
    blockHash: event.block.block.header.hash.toHex(),
    timestamp: event.block.timestamp ?? undefined,
  });
  await row.save();
}

export async function handleBaseStakingDaySettled(event: SubstrateEvent): Promise<void> {
  const { data } = event.event;
  const dayIndex = num(data[0]);
  await upsertRewardDayState(event, dayIndex);
  const participants = parseAgentRefs(extrinsicArgs(event)[1]);
  for (const participant of participants) {
    const { delta } = await upsertRewardLedger(event, participant.identityId, participant.agentId);
    if (delta.claimableBase === BigInt(0)) continue;
    await appendRewardEvent(event, {
      identityId: participant.identityId,
      agentId: participant.agentId,
      eventType: "BaseStakingDaySettled",
      rewardKind: "Base",
      amount: delta.claimableBase,
      baseAmount: delta.claimableBase,
      dayIndex,
    });
  }
}

async function handleRoundSettled(
  event: SubstrateEvent,
  role: "Observer" | "Reviewer",
): Promise<void> {
  const { data } = event.event;
  const roundId = str(data[0]);
  const dayIndex = num(data[1]);
  const participantCount = num(data[2]);
  const totalEffectiveStake = big(data[3]);
  const released = big(data[4]);
  const rollover = big(data[5]);
  const participants = parseAgentRefs(extrinsicArgs(event)[2]);

  await upsertRewardDayState(event, dayIndex);
  const settlement = RoundRewardSettlement.create({
    id: roundRewardSettlementEntityId(role, roundId),
    chainId: CHAIN_ID,
    roundId,
    role,
    dayIndex,
    participantCount,
    totalEffectiveStake,
    released,
    rollover,
    blockNumber: blockNum(event.block),
  });
  await settlement.save();

  for (const participant of participants) {
    const { delta } = await upsertRewardLedger(event, participant.identityId, participant.agentId);
    const amount = role === "Observer" ? delta.claimableObserver : delta.claimableReviewer;
    if (amount === BigInt(0)) continue;
    await appendRewardEvent(event, {
      identityId: participant.identityId,
      agentId: participant.agentId,
      eventType: `${role}RoundSettled`,
      rewardKind: role,
      amount,
      observerAmount: role === "Observer" ? amount : undefined,
      reviewerAmount: role === "Reviewer" ? amount : undefined,
      dayIndex,
      roundId,
    });
  }
}

export async function handleObserverRoundSettled(event: SubstrateEvent): Promise<void> {
  await handleRoundSettled(event, "Observer");
}

export async function handleReviewerRoundSettled(event: SubstrateEvent): Promise<void> {
  await handleRoundSettled(event, "Reviewer");
}

export async function handleTaskRewardSettled(event: SubstrateEvent): Promise<void> {
  const { data } = event.event;
  const taskId = str(data[0]);
  const dayIndex = num(data[1]);
  const identityId = str(data[2]);
  const agentId = str(data[3]);
  const difficultyJson = (data[4] as { toJSON?: () => unknown }).toJSON?.() ?? data[4];
  const difficulty = typeof difficultyJson === "string" ? difficultyJson : JSON.stringify(difficultyJson);
  const amount = big(data[5]);

  await upsertRewardDayState(event, dayIndex);
  await upsertRewardLedger(event, identityId, agentId);

  const settlement = TaskRewardSettlement.create({
    id: taskRewardSettlementEntityId(taskId),
    chainId: CHAIN_ID,
    taskId,
    identityId,
    agentId,
    difficulty,
    amount,
    dayIndex,
    blockNumber: blockNum(event.block),
  });
  await settlement.save();

  await appendRewardEvent(event, {
    identityId,
    agentId,
    eventType: "TaskRewardSettled",
    rewardKind: "Task",
    amount,
    taskAmount: amount,
    dayIndex,
    taskId,
  });
}

export async function handleAgentRewardClaimed(event: SubstrateEvent): Promise<void> {
  const { data } = event.event;
  const identityId = str(data[0]);
  const agentId = str(data[1]);
  const ownerAccount = str(data[2]);
  const amount = big(data[3]);
  const { delta } = await upsertRewardLedger(event, identityId, agentId);

  await appendRewardEvent(event, {
    identityId,
    agentId,
    eventType: "AgentRewardClaimed",
    rewardKind: "Claim",
    amount,
    baseAmount: delta.claimedBase,
    observerAmount: delta.claimedObserver,
    reviewerAmount: delta.claimedReviewer,
    taskAmount: delta.claimedTask,
    ownerAccount,
  });
}
