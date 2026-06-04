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
  } catch (cause) {
    console.warn(`agentIncentives ledger storage read failed for ${identityId}/${agentId}: ${cause instanceof Error ? cause.message : String(cause)}`);
    return zeroSnapshot();
  }
}

async function readIndexedRewardLedger(identityId: string, agentId: string): Promise<RewardLedgerSnapshot> {
  const existing = await AgentRewardLedger.get(agentRewardLedgerEntityId(identityId, agentId));
  return existing
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
}

async function saveRewardLedgerSnapshot(
  event: SubstrateEvent,
  identityId: string,
  agentId: string,
  snapshot: RewardLedgerSnapshot,
): Promise<void> {
  const id = agentRewardLedgerEntityId(identityId, agentId);
  const ledger = AgentRewardLedger.create({
    id,
    chainId: CHAIN_ID,
    identityId,
    agentId,
    ...snapshot,
    updatedAtBlock: blockNum(event.block),
  });
  await ledger.save();
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
  } catch (cause) {
    console.warn(`agentIncentives day storage read failed for day ${dayIndex}: ${cause instanceof Error ? cause.message : String(cause)}`);
  }
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

function normalizeRewardKind(value: unknown): "Base" | "Observer" | "Reviewer" | "Task" {
  const json = (value as { toJSON?: () => unknown }).toJSON?.() ?? value;
  if (typeof json === "string") {
    const lower = json.toLowerCase();
    if (lower === "observer") return "Observer";
    if (lower === "reviewer") return "Reviewer";
    if (lower === "task") return "Task";
    return "Base";
  }
  if (json && typeof json === "object") {
    const key = Object.keys(json as Record<string, unknown>)[0]?.toLowerCase();
    if (key === "observer") return "Observer";
    if (key === "reviewer") return "Reviewer";
    if (key === "task") return "Task";
  }
  return "Base";
}

function creditSnapshot(snapshot: RewardLedgerSnapshot, kind: "Base" | "Observer" | "Reviewer" | "Task", amount: bigint): RewardLedgerSnapshot {
  const next = { ...snapshot, claimableTotal: snapshot.claimableTotal + amount };
  if (kind === "Base") next.claimableBase += amount;
  if (kind === "Observer") next.claimableObserver += amount;
  if (kind === "Reviewer") next.claimableReviewer += amount;
  if (kind === "Task") next.claimableTask += amount;
  return next;
}

export async function handleAgentRewardCredited(event: SubstrateEvent): Promise<void> {
  const { data } = event.event;
  const identityId = str(data[0]);
  const agentId = str(data[1]);
  const dayIndex = num(data[2]);
  const kind = normalizeRewardKind(data[3]);
  const amount = big(data[4]);
  const previous = await readIndexedRewardLedger(identityId, agentId);
  await saveRewardLedgerSnapshot(event, identityId, agentId, creditSnapshot(previous, kind, amount));
  await appendRewardEvent(event, {
    identityId,
    agentId,
    eventType: "AgentRewardCredited",
    rewardKind: kind,
    amount,
    baseAmount: kind === "Base" ? amount : undefined,
    observerAmount: kind === "Observer" ? amount : undefined,
    reviewerAmount: kind === "Reviewer" ? amount : undefined,
    taskAmount: kind === "Task" ? amount : undefined,
    dayIndex,
  });
}

export async function handleBaseStakingDaySettled(event: SubstrateEvent): Promise<void> {
  const { data } = event.event;
  const dayIndex = num(data[0]);
  await upsertRewardDayState(event, dayIndex);
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
}

export async function handleAgentRewardClaimed(event: SubstrateEvent): Promise<void> {
  const { data } = event.event;
  const identityId = str(data[0]);
  const agentId = str(data[1]);
  const ownerAccount = str(data[2]);
  const amount = big(data[3]);
  const snapshot = await fetchRewardLedger(identityId, agentId);
  await saveRewardLedgerSnapshot(event, identityId, agentId, snapshot);

  await appendRewardEvent(event, {
    identityId,
    agentId,
    eventType: "AgentRewardClaimed",
    rewardKind: "Claim",
    amount,
    baseAmount: snapshot.claimedBase,
    observerAmount: snapshot.claimedObserver,
    reviewerAmount: snapshot.claimedReviewer,
    taskAmount: snapshot.claimedTask,
    ownerAccount,
  });
}
