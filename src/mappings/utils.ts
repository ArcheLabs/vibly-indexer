/**
 * Shared helpers for mapping handlers.
 */

export const CHAIN_ID = process.env["CHAIN_ID"] ?? "substrate:vibly-solo";

export function identityEntityId(identityId: string): string {
  return `${CHAIN_ID}:${identityId}`;
}

export function identityKeyEntityId(keyId: string): string {
  return `${CHAIN_ID}:${keyId}`;
}

export function paymentIntentEntityId(intentId: string): string {
  return `${CHAIN_ID}:${intentId}`;
}

export function settlementEventEntityId(
  intentId: string,
  blockNumber: bigint,
  eventIndex: number,
): string {
  return `${CHAIN_ID}:${intentId}:${blockNumber}:${eventIndex}`;
}

export function agentStakeLedgerEntityId(identityId: string, agentId: string): string {
  return `${CHAIN_ID}:${identityId}:${agentId}`;
}

export function agentStakeEventEntityId(
  identityId: string,
  agentId: string,
  blockNumber: bigint,
  eventIndex: number,
): string {
  return `${CHAIN_ID}:${identityId}:${agentId}:${blockNumber}:${eventIndex}`;
}

export function emergencyStatusEntityId(scope: string): string {
  return `${CHAIN_ID}:${scope}`;
}

export function agentRewardLedgerEntityId(identityId: string, agentId: string): string {
  return `${CHAIN_ID}:${identityId}:${agentId}`;
}

export function rewardDayStateEntityId(dayIndex: number): string {
  return `${CHAIN_ID}:${dayIndex}`;
}

export function roundRewardSettlementEntityId(role: string, roundId: string): string {
  return `${CHAIN_ID}:${role}:${roundId}`;
}

export function taskRewardSettlementEntityId(taskId: string): string {
  return `${CHAIN_ID}:${taskId}`;
}

export function agentRewardEventEntityId(
  identityId: string,
  agentId: string,
  blockNumber: bigint,
  eventIndex: number,
  eventType: string,
): string {
  return `${CHAIN_ID}:${identityId}:${agentId}:${blockNumber}:${eventIndex}:${eventType}`;
}
