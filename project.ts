import {
  SubstrateDatasourceKind,
  SubstrateHandlerKind,
  type SubstrateProject,
} from "@subql/types";

// ─── Project manifest ────────────────────────────────────────────────────────

const project: SubstrateProject = {
  specVersion: "1.0.0",
  name: "vibly-indexer",
  version: "0.1.0",
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
    "Indexes vibly-chain solo-node OpenGov: referenda, conviction voting, preimage, treasury",
  repository: "",
  schema: {
    file: "./schema.graphql",
  },
  network: {
    // vibly-chain solo-node WebSocket endpoint (override via env ENDPOINT at codegen/build time)
    endpoint: process.env["ENDPOINT"] ?? "ws://127.0.0.1:9944",
    /**
     * SubQL validates this against the RPC; it must be the **genesis hash** (hex), not the logical
     * coordinator id (`substrate:vibly-solo` — that stays in mapping `CHAIN_ID` / env at runtime).
     * Override when pointing at another chain: SUBQL_GENESIS_CHAIN_ID=0x... npm run build
     */
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
          // ── pallet_referenda ──────────────────────────────────────────────
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleReferendumSubmitted",
            filter: { module: "referenda", method: "Submitted" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleReferendumDecisionStarted",
            filter: { module: "referenda", method: "DecisionStarted" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleReferendumConfirmStarted",
            filter: { module: "referenda", method: "ConfirmStarted" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleReferendumApproved",
            filter: { module: "referenda", method: "Approved" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleReferendumRejected",
            filter: { module: "referenda", method: "Rejected" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleReferendumCancelled",
            filter: { module: "referenda", method: "Cancelled" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleReferendumTimedOut",
            filter: { module: "referenda", method: "TimedOut" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleReferendumKilled",
            filter: { module: "referenda", method: "Killed" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleReferendumConfirmAborted",
            filter: { module: "referenda", method: "ConfirmAborted" },
          },
          // ── pallet_conviction_voting ─────────────────────────────────────
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleVoteCast",
            filter: { module: "convictionVoting", method: "Voted" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleVoteRemoved",
            filter: { module: "convictionVoting", method: "VoteRemoved" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleDelegated",
            filter: { module: "convictionVoting", method: "Delegated" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleUndelegated",
            filter: { module: "convictionVoting", method: "Undelegated" },
          },
          // ── pallet_preimage ──────────────────────────────────────────────
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handlePreimageNoted",
            filter: { module: "preimage", method: "Noted" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handlePreimageRequested",
            filter: { module: "preimage", method: "Requested" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handlePreimageCleared",
            filter: { module: "preimage", method: "Cleared" },
          },
          // ── pallet_treasury ──────────────────────────────────────────────
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleTreasuryProposed",
            filter: { module: "treasury", method: "Proposed" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleTreasuryApproved",
            filter: { module: "treasury", method: "Approved" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleTreasuryRejected",
            filter: { module: "treasury", method: "Rejected" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleTreasuryAwarded",
            filter: { module: "treasury", method: "Awarded" },
          },
          // ── checkpoint (per-block) ───────────────────────────────────────
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
