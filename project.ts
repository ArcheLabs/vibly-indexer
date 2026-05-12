import {
  SubstrateDatasourceKind,
  SubstrateHandlerKind,
  type SubstrateProject,
} from "@subql/types";

// ─── Project manifest ────────────────────────────────────────────────────────

const project: SubstrateProject = {
  specVersion: "1.0.0",
  name: "vibly-indexer",
  version: "0.2.0",
  runner: {
    node: {
      name: "@subql/node",
      version: ">=3.0.1",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  description:
    "Indexes vibly-chain solo-node Vibly pallets: identity-core, payment-intent, vibly-emergency",
  repository: "",
  schema: {
    file: "./schema.graphql",
  },
  network: {
    // vibly-chain solo-node WebSocket endpoint (override via env ENDPOINT at codegen/build time)
    endpoint: process.env["ENDPOINT"] ?? "ws://127.0.0.1:9944",
    chainId:
      process.env["SUBQL_GENESIS_CHAIN_ID"] ??
      "0xbe833095c04ed041b47ea7aee77ea5ede620b91a9c44bc070e395443b906eb6b",
    bypassBlocks: [],
  },
  dataSources: [
    {
      kind: SubstrateDatasourceKind.Runtime,
      startBlock: Number(process.env["START_BLOCK"] ?? "1"),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          // ── pallet_identity_core ──────────────────────────────────────────
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleIdentityRegistered",
            filter: { module: "identityCore", method: "IdentityRegistered" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleOwnerKeyRotated",
            filter: { module: "identityCore", method: "OwnerKeyRotated" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleRecoveryKeySet",
            filter: { module: "identityCore", method: "RecoveryKeySet" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleIdentityKeyAdded",
            filter: { module: "identityCore", method: "IdentityKeyAdded" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleIdentityKeyRevoked",
            filter: { module: "identityCore", method: "IdentityKeyRevoked" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleActiveProfileSet",
            filter: { module: "identityCore", method: "ActiveProfileSet" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleActiveAgentRegistrySet",
            filter: { module: "identityCore", method: "ActiveAgentRegistrySet" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleActiveAuthRegistrySet",
            filter: { module: "identityCore", method: "ActiveAuthRegistrySet" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleActiveRelationPolicySet",
            filter: { module: "identityCore", method: "ActiveRelationPolicySet" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleTransportBound",
            filter: { module: "identityCore", method: "TransportBound" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleTransportVerified",
            filter: { module: "identityCore", method: "TransportVerified" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleTransportRevoked",
            filter: { module: "identityCore", method: "TransportRevoked" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleIdentityFrozen",
            filter: { module: "identityCore", method: "IdentityFrozen" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleIdentityUnfrozen",
            filter: { module: "identityCore", method: "IdentityUnfrozen" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleIdentityDisabled",
            filter: { module: "identityCore", method: "IdentityDisabled" },
          },
          // ── pallet_payment_intent ─────────────────────────────────────────
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handlePaymentIntentCreated",
            filter: { module: "paymentIntent", method: "PaymentIntentCreated" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handlePaymentIntentFunded",
            filter: { module: "paymentIntent", method: "PaymentIntentFunded" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handlePaymentIntentClaimed",
            filter: { module: "paymentIntent", method: "PaymentIntentClaimed" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handlePaymentIntentRefunded",
            filter: { module: "paymentIntent", method: "PaymentIntentRefunded" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handlePaymentIntentCancelled",
            filter: { module: "paymentIntent", method: "PaymentIntentCancelled" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handlePaymentIntentExpired",
            filter: { module: "paymentIntent", method: "PaymentIntentExpired" },
          },
          // ── pallet_vibly_emergency ────────────────────────────────────────
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleEmergencyPaused",
            filter: { module: "viblyEmergency", method: "Paused" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleEmergencyResumed",
            filter: { module: "viblyEmergency", method: "Resumed" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleEmergencyCancelled",
            filter: { module: "viblyEmergency", method: "Cancelled" },
          },
          // ── checkpoint (per-block) ────────────────────────────────────────
          {
            kind: SubstrateHandlerKind.Block,
            handler: "handleBlock",
            filter: { modulo: 10 },
          },
        ],
      },
    },
  ],
};

export default project;
