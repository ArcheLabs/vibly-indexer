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

export function emergencyStatusEntityId(scope: string): string {
  return `${CHAIN_ID}:${scope}`;
}
