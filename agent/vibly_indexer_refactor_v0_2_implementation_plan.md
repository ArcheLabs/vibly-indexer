# Vibly Indexer v0.2 Refactor Implementation Plan

版本：v0.2  
适用仓库：`/home/libingjiang/vibly-indexer`  
输入基准：`/home/libingjiang/concord/agent/Vibly_DDD_Architecture_v0.2.md`  
状态：下一阶段实施文档

---

## 1. 仓库定位

`vibly-indexer` 是链上事实投影器。它连接 `vibly-chain`，索引最小经济真相和关键承诺，并通过 GraphQL 或后续 event bridge 提供给 Coordinator / Console read model。

```txt
vibly-indexer
  = Chain Projection
  + Identity / Stake / Payment / Settlement / Penalty / Emergency event indexer
```

它不是治理系统，不做协作决策，不维护 Vibly REST/SSE contract。

---

## 2. 当前状态与迁移方向

当前仓库是 SubQuery indexer，主路径索引 solo-node OpenGov：

- `pallet_referenda`
- `pallet_conviction_voting`
- `pallet_preimage`
- `pallet_treasury`
- `GovernanceSubject`
- `GovernanceVote`
- `GovernanceDelegation`
- `TreasuryProposal`

v0.2 要求 `vibly-chain` 去除治理模块。因此 indexer 主路径必须从 OpenGov 投影迁移到 Vibly 最小链上事实：

```txt
identity-core
payment-intent
vibly-emergency
future stake / penalty / commitment anchors
```

OpenGov mappings 可以短期保留在 legacy 分支或 disabled mapping 中，但不再作为默认 schema 和 README 主路径。

---

## 3. 非目标

- 不索引讨论全文、任务正文、提案全文、评分详情、知识库全文。
- 不计算 reputation 分数。只索引链上 penalty/slash/settlement 事实；声誉计算由 Coordinator projection 处理。
- 不提供 Coordinator HTTP API。
- 不把 OpenGov referendum 继续当作 Vibly 协作对象。

---

## 4. 成熟库原则

继续使用 SubQuery：

- `@subql/cli`
- `@subql/types`
- `@polkadot/api`
- GraphQL schema generated models

不要自研 block scanner。不要直接在 mapping 中调用 Coordinator HTTP 写入状态；如果需要推送，单独做 adapter/consumer。

---

## 5. 目标 Schema

替换或新增 GraphQL entities：

```graphql
type ChainCheckpoint @entity {
  id: ID!
  chainId: String!
  blockNumber: BigInt!
  blockHash: String!
  updatedAt: Date!
}

type ChainIdentity @entity {
  id: ID!
  chainId: String!
  identityId: String!
  owner: String!
  status: String!
  activeProfile: String
  activeAgentRegistry: String
  activeAuthRegistry: String
  activeRelationPolicy: String
  nonce: BigInt
  createdAtBlock: BigInt!
  updatedAtBlock: BigInt!
}

type IdentityKey @entity {
  id: ID!
  chainId: String!
  identityId: String!
  keyId: String!
  account: String!
  purpose: String!
  status: String!
  updatedAtBlock: BigInt!
}

type PaymentIntent @entity {
  id: ID!
  chainId: String!
  intentId: String!
  payerIdentityId: String!
  payeeIdentityId: String!
  amount: BigInt!
  settlementMode: String!
  actionNamespace: String
  actionId: String
  status: String!
  createdAtBlock: BigInt!
  updatedAtBlock: BigInt!
}

type SettlementEvent @entity {
  id: ID!
  chainId: String!
  intentId: String!
  eventType: String!
  actor: String
  amount: BigInt
  blockNumber: BigInt!
  extrinsicIndex: Int
  eventIndex: Int!
  blockHash: String!
  timestamp: Date
}

type EmergencyStatus @entity {
  id: ID!
  chainId: String!
  scope: String!
  target: String!
  status: String!
  reasonHash: String
  updatedBy: String
  updatedAtBlock: BigInt!
}

type PenaltyRecord @entity {
  id: ID!
  chainId: String!
  identityId: String!
  reasonHash: String!
  amount: BigInt
  sourceRef: String
  blockNumber: BigInt!
}
```

`StakePosition` 如果链上尚未有独立 pallet，暂不伪造实体；可由 payment hold 或 future stake pallet 再补。

---

## 6. Mapping 目标

建议文件：

```txt
src/mappings/
  block.ts
  identityCore.ts
  paymentIntent.ts
  emergency.ts
  penalty.ts            # future optional
  commitment.ts         # future optional
  utils.ts
```

待移除或 legacy：

```txt
convictionVoting.ts
referenda.ts
preimage.ts
treasury.ts
```

---

## 7. Event 映射

### identity-core

索引：

```txt
IdentityRegistered
OwnerRotated
RecoveryKeySet
AuthorizedKeyAdded
AuthorizedKeyRemoved
ActiveProfileSet
ActiveAgentRegistrySet
ActiveAuthRegistrySet
ActiveRelationPolicySet
TransportBindingCreated
TransportBindingVerified
TransportBindingRevoked
IdentityFrozen
IdentityUnfrozen
IdentityDisabled
```

### payment-intent

索引：

```txt
PaymentIntentCreated
PaymentIntentFunded
PaymentIntentClaimed
PaymentIntentRefunded
PaymentIntentCancelled
PaymentIntentExpired
```

这些事件映射到 Coordinator 的：

```txt
SettlementSubmitted
SettlementConfirmed
SettlementFailed
RewardIntentSettled
```

具体转换由 Coordinator consumer 完成，indexer 只提供事实。

### vibly-emergency

索引：

```txt
EmergencyPaused
EmergencyCancelled
EmergencyResumed
GuardianSetChanged 如果 pallet 支持
```

---

## 8. Coordinator 消费接口

GraphQL query 应支持：

```txt
chainCheckpoint(id)
chainIdentities(...)
chainIdentity(id)
paymentIntents(...)
paymentIntent(id)
settlementEvents(...)
emergencyStatuses(...)
penaltyRecords(...)
```

Coordinator 消费后写入自己的 chain projection：

```txt
chain_identity
chain_payment_intent
chain_settlement_event
chain_emergency_status
chain_penalty_record
chain_checkpoint
```

---

## 9. 实施阶段

### Phase 0：冻结旧 OpenGov

- 文档标记 OpenGov indexer 为 legacy。
- 保留旧测试作为迁移参考。
- 默认 README 改为 identity/payment/emergency indexer。

### Phase 1：Schema 迁移

- 更新 `schema.graphql`。
- 运行 `npm run codegen`。
- 新增 generated models。

### Phase 2：Mappings

- 实现 identity-core mappings。
- 实现 payment-intent mappings。
- 实现 emergency mappings。
- block checkpoint 统一为 `ChainCheckpoint`。

### Phase 3：Project manifest

- 更新 `project.ts` / `project.yaml` 默认 dataSources。
- 移除默认 referenda / treasury handlers。

### Phase 4：Readback tests

- 用 fixture 或本地 chain event 验证：
  - identity registered 后可查询 ChainIdentity
  - payment intent claimed 后可查询 SettlementEvent
  - emergency paused 后可查询 EmergencyStatus

---

## 10. 验收标准

- `npm run build` 通过。
- Docker compose 可启动 SubQuery node + GraphQL。
- GraphQL 不再以 GovernanceSubject/GovernanceVote 作为主模型。
- 可查询 `ChainCheckpoint`、`ChainIdentity`、`PaymentIntent`、`SettlementEvent`。
- README 与 schema 不再宣传 OpenGov 是默认主路径。
