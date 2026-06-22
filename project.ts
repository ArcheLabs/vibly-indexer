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
    // ⚠  SUBQL_GENESIS_CHAIN_ID 必须在部署时设置！
    // 构建前请确认 genesis hash 匹配链节点。获取方式：
    //   curl -s <rpc> -H 'content-type: application/json' \
    //     -d '{"id":1,"jsonrpc":"2.0","method":"chain_getBlockHash","params":[0]}'
    // 然后设置: SUBQL_GENESIS_CHAIN_ID=0x... npm run build
    chainId:
      process.env["SUBQL_GENESIS_CHAIN_ID"] ??
      "0xbc48c1341363fb8dbd33c19c2cfb7a3e9a42a9a2d582b7fc7b5eec149f6b7ee6",
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
            handler: "handleEvmRootBound",
            filter: { module: "identityCore", method: "EvmRootBound" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleEvmAddressLinked",
            filter: { module: "identityCore", method: "EvmAddressLinked" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleEvmAddressUnlinked",
            filter: { module: "identityCore", method: "EvmAddressUnlinked" },
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
          // ── pallet_agent_staking ─────────────────────────────────────────
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleAgentStakeBonded",
            filter: { module: "agentStaking", method: "AgentStakeBonded" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleAgentStakeUnbondRequested",
            filter: { module: "agentStaking", method: "AgentStakeUnbondRequested" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleAgentStakeUnbondCancelled",
            filter: { module: "agentStaking", method: "AgentStakeUnbondCancelled" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleAgentStakeReleaseBlocked",
            filter: { module: "agentStaking", method: "AgentStakeReleaseBlocked" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleAgentStakeReleaseCleared",
            filter: { module: "agentStaking", method: "AgentStakeReleaseCleared" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleAgentStakeReleased",
            filter: { module: "agentStaking", method: "AgentStakeReleased" },
          },
          // ── pallet_agent_incentives ──────────────────────────────────────
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleBaseStakingDaySettled",
            filter: { module: "agentIncentives", method: "BaseStakingDaySettled" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleObserverRoundSettled",
            filter: { module: "agentIncentives", method: "ObserverRoundSettled" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleReviewerRoundSettled",
            filter: { module: "agentIncentives", method: "ReviewerRoundSettled" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleTaskRewardSettled",
            filter: { module: "agentIncentives", method: "TaskRewardSettled" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleAgentRewardCredited",
            filter: { module: "agentIncentives", method: "AgentRewardCredited" },
          },
          {
            kind: SubstrateHandlerKind.Event,
            handler: "handleAgentRewardClaimed",
            filter: { module: "agentIncentives", method: "AgentRewardClaimed" },
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
