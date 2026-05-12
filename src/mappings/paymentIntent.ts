/**
 * Mapping handlers for pallet_payment_intent events.
 *
 * Events handled:
 *   PaymentIntentCreated, PaymentIntentFunded,
 *   PaymentIntentClaimed, PaymentIntentRefunded,
 *   PaymentIntentCancelled, PaymentIntentExpired
 */

import type { SubstrateEvent } from "@subql/types";
import { PaymentIntent } from "../types/models/PaymentIntent";
import { SettlementEvent } from "../types/models/SettlementEvent";
import {
  CHAIN_ID,
  paymentIntentEntityId,
  settlementEventEntityId,
} from "./utils";

// ─── helpers ─────────────────────────────────────────────────────────────────

function str(v: unknown): string {
  return (v as { toString(): string }).toString();
}

function blockNum(block: SubstrateEvent["block"]): bigint {
  return BigInt(block.block.header.number.toString());
}

async function getIntent(intentId: string): Promise<PaymentIntent | undefined> {
  return PaymentIntent.get(paymentIntentEntityId(intentId));
}

async function appendSettlementEvent(
  event: SubstrateEvent,
  intentId: string,
  eventType: string,
): Promise<void> {
  const { block, extrinsic, idx } = event;
  const bn = blockNum(block);
  const eventIndex = idx ?? 0;
  const id = settlementEventEntityId(intentId, bn, eventIndex);

  const se = SettlementEvent.create({
    id,
    chainId: CHAIN_ID,
    intentId,
    eventType,
    blockNumber: bn,
    extrinsicIndex: extrinsic ? (extrinsic as { idx?: number }).idx ?? undefined : undefined,
    eventIndex,
    blockHash: block.block.header.hash.toHex(),
    timestamp: block.timestamp ?? undefined,
  });
  await se.save();
}

// ─── PaymentIntentCreated ────────────────────────────────────────────────────

export async function handlePaymentIntentCreated(event: SubstrateEvent): Promise<void> {
  // data: intent_id(0), payer(1), payee(2), asset_id(3), amount(4), action(5)
  const { event: { data }, block } = event;
  const intentId = str(data[0]);
  const payerIdentityId = str(data[1]);
  const payeeIdentityId = str(data[2]);
  // data[3] = asset_id (ignored in schema)
  const amount = BigInt(str(data[4]));
  const actionRaw = (data[5] as { toJSON(): unknown }).toJSON() as Record<string, unknown>;
  const bn = blockNum(block);

  // Extract namespace (BoundedVec<u8> serialized as hex or array) and actionCode
  let actionNamespace: string | undefined;
  let actionId: string | undefined;
  if (actionRaw) {
    const ns = actionRaw["namespace"];
    if (Array.isArray(ns)) {
      actionNamespace = Buffer.from(ns as number[]).toString("utf8");
    } else if (typeof ns === "string") {
      actionNamespace = ns.startsWith("0x")
        ? Buffer.from(ns.slice(2), "hex").toString("utf8")
        : ns;
    }
    if (actionRaw["actionCode"] !== undefined) {
      actionId = String(actionRaw["actionCode"]);
    }
  }

  const intent = PaymentIntent.create({
    id: paymentIntentEntityId(intentId),
    chainId: CHAIN_ID,
    intentId,
    payerIdentityId,
    payeeIdentityId,
    amount,
    settlementMode: "Unknown",
    actionNamespace,
    actionId,
    status: "Created",
    createdAtBlock: bn,
    updatedAtBlock: bn,
  });
  await intent.save();
}

// ─── PaymentIntentFunded ─────────────────────────────────────────────────────

export async function handlePaymentIntentFunded(event: SubstrateEvent): Promise<void> {
  // data: intent_id(0), settlement_mode(1)
  const { event: { data }, block } = event;
  const intentId = str(data[0]);
  const settlementModeJson = (data[1] as { toJSON(): unknown }).toJSON();
  const settlementMode = typeof settlementModeJson === "string"
    ? settlementModeJson
    : JSON.stringify(settlementModeJson);

  const intent = await getIntent(intentId);
  if (!intent) return;
  intent.settlementMode = settlementMode;
  intent.status = "Funded";
  intent.updatedAtBlock = blockNum(block);
  await intent.save();
}

// ─── PaymentIntentClaimed ────────────────────────────────────────────────────

export async function handlePaymentIntentClaimed(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const intentId = str(data[0]);

  const intent = await getIntent(intentId);
  if (intent) {
    intent.status = "Claimed";
    intent.updatedAtBlock = blockNum(block);
    await intent.save();
  }
  await appendSettlementEvent(event, intentId, "Claimed");
}

// ─── PaymentIntentRefunded ───────────────────────────────────────────────────

export async function handlePaymentIntentRefunded(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const intentId = str(data[0]);

  const intent = await getIntent(intentId);
  if (intent) {
    intent.status = "Refunded";
    intent.updatedAtBlock = blockNum(block);
    await intent.save();
  }
  await appendSettlementEvent(event, intentId, "Refunded");
}

// ─── PaymentIntentCancelled ──────────────────────────────────────────────────

export async function handlePaymentIntentCancelled(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const intentId = str(data[0]);

  const intent = await getIntent(intentId);
  if (intent) {
    intent.status = "Cancelled";
    intent.updatedAtBlock = blockNum(block);
    await intent.save();
  }
  await appendSettlementEvent(event, intentId, "Cancelled");
}

// ─── PaymentIntentExpired ────────────────────────────────────────────────────

export async function handlePaymentIntentExpired(event: SubstrateEvent): Promise<void> {
  const { event: { data }, block } = event;
  const intentId = str(data[0]);

  const intent = await getIntent(intentId);
  if (intent) {
    intent.status = "Expired";
    intent.updatedAtBlock = blockNum(block);
    await intent.save();
  }
  await appendSettlementEvent(event, intentId, "Expired");
}
