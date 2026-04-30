/**
 * Shared helpers for mapping handlers.
 */

export const CHAIN_ID = process.env["CHAIN_ID"] ?? "substrate:vibly-solo";

export function subjectId(referendumIndex: number): string {
  return `${CHAIN_ID}:${referendumIndex}`;
}

export function voteId(referendumIndex: number, voter: string): string {
  return `${CHAIN_ID}:${referendumIndex}:${voter}`;
}

export function delegationId(track: number, delegator: string): string {
  return `${CHAIN_ID}:${track}:${delegator}`;
}
