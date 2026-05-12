/**
 * Mapping handlers for pallet_vibly_emergency events.
 *
 * Events handled: Paused, Resumed, Cancelled
 */

import type { SubstrateEvent } from "@subql/types";
import { EmergencyStatus } from "../types/models/EmergencyStatus";
import { CHAIN_ID, emergencyStatusEntityId } from "./utils";

// ─── helpers ─────────────────────────────────────────────────────────────────

function blockNum(block: SubstrateEvent["block"]): bigint {
  return BigInt(block.block.header.number.toString());
}

/** Serialize EmergencyScope enum to a stable string key. */
function serializeScope(scopeRaw: unknown): string {
  const json = (scopeRaw as { toJSON(): unknown }).toJSON();
  if (typeof json === "string") return json;
  // Enum variants with a payload come as { variantName: value }
  if (json !== null && typeof json === "object") {
    const entries = Object.entries(json as Record<string, unknown>);
    if (entries.length === 1) {
      const [name, val] = entries[0];
      return `${name}:${val}`;
    }
  }
  return JSON.stringify(json);
}

function optHex(raw: unknown): string | undefined {
  if (raw === null || raw === undefined) return undefined;
  return (raw as { toString(): string }).toString();
}

async function upsertEmergencyStatus(
  event: SubstrateEvent,
  status: string,
): Promise<void> {
  const { event: { data }, block } = event;
  const scope = serializeScope(data[0]);
  const bn = blockNum(block);

  // Paused:  [scope, by, reason_hash]
  // Resumed: [scope, reason_hash]
  // Cancelled: [scope, reason_hash]
  let updatedBy: string | undefined;
  let reasonHash: string | undefined;

  if (status === "Paused") {
    updatedBy = (data[1] as { toString(): string }).toString();
    reasonHash = optHex((data[2] as { toJSON(): unknown }).toJSON());
  } else {
    reasonHash = optHex((data[1] as { toJSON(): unknown }).toJSON());
  }

  const id = emergencyStatusEntityId(scope);
  let es = await EmergencyStatus.get(id);
  if (!es) {
    es = EmergencyStatus.create({
      id,
      chainId: CHAIN_ID,
      scope,
      status,
      reasonHash,
      updatedBy,
      updatedAtBlock: bn,
    });
  } else {
    es.status = status;
    es.reasonHash = reasonHash;
    es.updatedBy = updatedBy;
    es.updatedAtBlock = bn;
  }
  await es.save();
}

// ─── Handlers ────────────────────────────────────────────────────────────────

export async function handleEmergencyPaused(event: SubstrateEvent): Promise<void> {
  await upsertEmergencyStatus(event, "Paused");
}

export async function handleEmergencyResumed(event: SubstrateEvent): Promise<void> {
  await upsertEmergencyStatus(event, "Active");
}

export async function handleEmergencyCancelled(event: SubstrateEvent): Promise<void> {
  await upsertEmergencyStatus(event, "Cancelled");
}
