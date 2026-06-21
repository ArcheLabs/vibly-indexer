/**
 * Mapping handlers for pallet_identity_core events.
 *
 * Events handled:
 *   IdentityRegistered, OwnerKeyRotated, RecoveryKeySet,
 *   IdentityKeyAdded, IdentityKeyRevoked,
 *   ActiveProfileSet, ActiveAgentRegistrySet, ActiveAuthRegistrySet, ActiveRelationPolicySet,
 *   TransportBound, TransportVerified, TransportRevoked,
 *   EvmRootBound, EvmAddressLinked, EvmAddressUnlinked,
 *   IdentityFrozen, IdentityUnfrozen, IdentityDisabled
 */

import type { SubstrateEvent } from "@subql/types";
import { ChainIdentity } from "../types/models/ChainIdentity";
import { IdentityKey } from "../types/models/IdentityKey";
import { CHAIN_ID, identityEntityId, identityKeyEntityId } from "./utils";

// ─── helpers ─────────────────────────────────────────────────────────────────

function str(v: unknown): string {
  return (v as { toString(): string }).toString();
}

function blockNum(block: SubstrateEvent["block"]): bigint {
  return BigInt(block.block.header.number.toString());
}

async function getIdentity(identityId: string): Promise<ChainIdentity | undefined> {
  return ChainIdentity.get(identityEntityId(identityId));
}

/** Serialize an Option<ContentRef> value from storage query JSON to a string or undefined. */
function serializeContentRef(raw: unknown): string | undefined {
  if (raw === null || raw === undefined) return undefined;
  if (typeof raw === "string") return raw;
  // ContentRef encodes as { cid: string } or { uri: string } depending on variant
  const obj = raw as Record<string, unknown>;
  if (obj["cid"]) return String(obj["cid"]);
  if (obj["uri"]) return String(obj["uri"]);
  return JSON.stringify(raw);
}

// ─── IdentityRegistered ──────────────────────────────────────────────────────

export async function handleIdentityRegistered(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const identityId = str(data[0]);
  const owner = str(data[1]);
  const bn = blockNum(block);

  const id = identityEntityId(identityId);
  const identity = ChainIdentity.create({
    id,
    chainId: CHAIN_ID,
    identityId,
    owner,
    status: "Active",
    createdAtBlock: bn,
    updatedAtBlock: bn,
  });
  await identity.save();
}

// ─── OwnerKeyRotated ─────────────────────────────────────────────────────────

export async function handleOwnerKeyRotated(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const identityId = str(data[0]);
  // data[1] = old_owner (ignored), data[2] = new_owner
  const newOwner = str(data[2]);
  const bn = blockNum(block);

  const identity = await getIdentity(identityId);
  if (!identity) return;
  identity.owner = newOwner;
  identity.updatedAtBlock = bn;
  await identity.save();
}

// ─── RecoveryKeySet ──────────────────────────────────────────────────────────

export async function handleRecoveryKeySet(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const identityId = str(data[0]);
  const bn = blockNum(block);

  const identity = await getIdentity(identityId);
  if (!identity) return;
  identity.updatedAtBlock = bn;
  await identity.save();
}

// ─── IdentityKeyAdded ────────────────────────────────────────────────────────

export async function handleIdentityKeyAdded(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const identityId = str(data[0]);
  const keyId = str(data[1]);
  const purposeRaw = data[2] as { toJSON(): unknown };
  const bn = blockNum(block);

  // purpose is KeyPurpose enum; serialize to string
  const purposeJson = purposeRaw.toJSON();
  const purpose = typeof purposeJson === "string"
    ? purposeJson
    : JSON.stringify(purposeJson);

  // The authorized key account is not in the event; store keyId and identityId for lookup
  const key = IdentityKey.create({
    id: identityKeyEntityId(keyId),
    chainId: CHAIN_ID,
    identityId,
    keyId,
    account: "", // filled below via storage query
    purpose,
    status: "Active",
    updatedAtBlock: bn,
  });

  // Query storage to get the account
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const record = await (api as any).query.identityCore.authorizedKeys(keyId);
    const recordJson = record.toJSON() as Record<string, unknown> | null;
    if (recordJson && recordJson["account"]) {
      key.account = String(recordJson["account"]);
    }
  } catch (_) {
    // storage query failed; account remains empty
  }

  await key.save();

  // update identity nonce / updatedAtBlock
  const identity = await getIdentity(identityId);
  if (identity) {
    identity.updatedAtBlock = bn;
    await identity.save();
  }
}

// ─── IdentityKeyRevoked ──────────────────────────────────────────────────────

export async function handleIdentityKeyRevoked(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const keyId = str(data[1]);
  const identityId = str(data[0]);
  const bn = blockNum(block);

  const key = await IdentityKey.get(identityKeyEntityId(keyId));
  if (key) {
    key.status = "Revoked";
    key.updatedAtBlock = bn;
    await key.save();
  }

  const identity = await getIdentity(identityId);
  if (identity) {
    identity.updatedAtBlock = bn;
    await identity.save();
  }
}

// ─── pointer-set helpers ─────────────────────────────────────────────────────

async function fetchIdentityPointers(identityId: string): Promise<Record<string, string | undefined>> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const record = await (api as any).query.identityCore.identities(identityId);
    const json = record.toJSON() as Record<string, unknown> | null;
    if (!json) return {};
    return {
      activeProfile: serializeContentRef(json["activeProfile"]),
      activeAgentRegistry: serializeContentRef(json["activeAgentRegistry"]),
      activeAuthRegistry: serializeContentRef(json["activeAuthRegistry"]),
      activeRelationPolicy: serializeContentRef(json["activeRelationPolicy"]),
    };
  } catch (_) {
    return {};
  }
}

// ─── ActiveProfileSet ────────────────────────────────────────────────────────

export async function handleActiveProfileSet(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const identityId = str(data[0]);
  const bn = blockNum(block);

  const identity = await getIdentity(identityId);
  if (!identity) return;
  const ptrs = await fetchIdentityPointers(identityId);
  identity.activeProfile = ptrs["activeProfile"];
  identity.updatedAtBlock = bn;
  await identity.save();
}

// ─── ActiveAgentRegistrySet ──────────────────────────────────────────────────

export async function handleActiveAgentRegistrySet(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const identityId = str(data[0]);
  const bn = blockNum(block);

  const identity = await getIdentity(identityId);
  if (!identity) return;
  const ptrs = await fetchIdentityPointers(identityId);
  identity.activeAgentRegistry = ptrs["activeAgentRegistry"];
  identity.updatedAtBlock = bn;
  await identity.save();
}

// ─── ActiveAuthRegistrySet ───────────────────────────────────────────────────

export async function handleActiveAuthRegistrySet(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const identityId = str(data[0]);
  const bn = blockNum(block);

  const identity = await getIdentity(identityId);
  if (!identity) return;
  const ptrs = await fetchIdentityPointers(identityId);
  identity.activeAuthRegistry = ptrs["activeAuthRegistry"];
  identity.updatedAtBlock = bn;
  await identity.save();
}

// ─── ActiveRelationPolicySet ─────────────────────────────────────────────────

export async function handleActiveRelationPolicySet(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const identityId = str(data[0]);
  const bn = blockNum(block);

  const identity = await getIdentity(identityId);
  if (!identity) return;
  const ptrs = await fetchIdentityPointers(identityId);
  identity.activeRelationPolicy = ptrs["activeRelationPolicy"];
  identity.updatedAtBlock = bn;
  await identity.save();
}

// ─── Transport events (no schema entity; update identity timestamp) ───────────

async function touchIdentity(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const identityId = str(data[0]);
  const identity = await getIdentity(identityId);
  if (!identity) return;
  identity.updatedAtBlock = blockNum(block);
  await identity.save();
}

export async function handleTransportBound(event: SubstrateEvent): Promise<void> {
  await touchIdentity(event);
}

export async function handleTransportVerified(event: SubstrateEvent): Promise<void> {
  await touchIdentity(event);
}

export async function handleTransportRevoked(event: SubstrateEvent): Promise<void> {
  await touchIdentity(event);
}


// ─── EVM address bindings ───────────────────────────────────────────────────

async function setIdentityEvmAddress(event: SubstrateEvent, nextAddress: string | undefined): Promise<void> {
  const { event: { data }, block } = event;
  const identityId = str(data[0]);
  const identity = await getIdentity(identityId);
  if (!identity) return;
  identity.evmAddress = nextAddress;
  identity.updatedAtBlock = blockNum(block);
  await identity.save();
}

export async function handleEvmRootBound(event: SubstrateEvent): Promise<void> {
  const { event: { data } } = event;
  await setIdentityEvmAddress(event, str(data[1]).toLowerCase());
}

export async function handleEvmAddressLinked(event: SubstrateEvent): Promise<void> {
  const { event: { data } } = event;
  await setIdentityEvmAddress(event, str(data[1]).toLowerCase());
}

export async function handleEvmAddressUnlinked(event: SubstrateEvent): Promise<void> {
  await setIdentityEvmAddress(event, undefined);
}

// ─── IdentityFrozen ──────────────────────────────────────────────────────────

export async function handleIdentityFrozen(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const identityId = str(data[0]);
  const identity = await getIdentity(identityId);
  if (!identity) return;
  identity.status = "Frozen";
  identity.updatedAtBlock = blockNum(block);
  await identity.save();
}

// ─── IdentityUnfrozen ────────────────────────────────────────────────────────

export async function handleIdentityUnfrozen(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const identityId = str(data[0]);
  const identity = await getIdentity(identityId);
  if (!identity) return;
  identity.status = "Active";
  identity.updatedAtBlock = blockNum(block);
  await identity.save();
}

// ─── IdentityDisabled ────────────────────────────────────────────────────────

export async function handleIdentityDisabled(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const identityId = str(data[0]);
  const identity = await getIdentity(identityId);
  if (!identity) return;
  identity.status = "Disabled";
  identity.updatedAtBlock = blockNum(block);
  await identity.save();
}
