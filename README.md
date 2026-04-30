# vibly-indexer

vibly-indexer 是基于 [SubQuery](https://subquery.network/) 的链上事件索引器，专门索引 **vibly-chain solo-node** 上的 OpenGov pallet 事件，并通过 GraphQL API 对外提供查询。

`vibly-coordinator` 通过 `@concord/adapter-substrate-indexer` 消费该 GraphQL API，构建链上 governance 读模型。

## 架构位置

```
vibly-chain solo-node (ws://127.0.0.1:9944)
       │ WebSocket 订阅
       ▼
vibly-indexer (SubQuery Node)
  - 索引 pallet_referenda 事件
  - 索引 pallet_conviction_voting 事件
  - 索引 pallet_preimage 事件
  - 索引 pallet_treasury 事件
  - 每 10 块更新 GovernanceCheckpoint
       │ GraphQL
       ▼
http://localhost:3010/graphql
       │
       ▼
@concord/adapter-substrate-indexer
  SubQueryGovernanceIndexAdapter
       │
       ▼
vibly-coordinator GovernanceIndexConsumer
  → governance_view projections
```

## 快速启动

```bash
# 启动 Postgres + SubQuery Node + GraphQL Engine
docker compose up -d

# 查看日志
docker compose logs -f subql-node
```

GraphQL Playground：`http://localhost:3010/graphql`

## 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `ENDPOINT` | `ws://host.docker.internal:9944` | vibly-chain WebSocket 端点 |
| `START_BLOCK` | `1` | 开始索引的块号 |

> 本地开发时若 `vibly-chain` 和 `docker compose` 在同一机器上，默认端点已正确指向宿主机。

## GraphQL Schema

### GovernanceCheckpoint

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `ID!` | 链标识符（如 `substrate:vibly-solo`）|
| `blockNumber` | `BigInt!` | 最新已索引块号 |
| `blockHash` | `String!` | 最新已索引块 hash |
| `updatedAt` | `Date!` | 更新时间 |

### GovernanceSubject（公投）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `ID!` | `<chainId>:<referendumIndex>` |
| `status` | `String!` | `Submitted \| Deciding \| Confirming \| Approved \| Rejected \| Cancelled \| TimedOut \| Killed` |
| `track` | `Int!` | 投票轨道 |
| `ayeVotes / nayVotes / abstainVotes` | `BigInt!` | 票数快照 |
| `proposalHash` | `String` | 提案 hash |
| `votes` | `[GovernanceVote]` | 关联投票（派生） |

### GovernanceVote

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `ID!` | `<chainId>:<referendumIndex>:<voter>` |
| `stance` | `String!` | `Aye \| Nay \| Abstain` |
| `conviction` | `Int!` | 信念值 0–6 |
| `balance` | `BigInt!` | 锁定余额 |
| `isRemoved` | `Boolean!` | 是否已撤销 |

### GovernanceDelegation

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `ID!` | `<chainId>:<track>:<delegator>` |
| `delegatee` | `String!` | 受委托地址 |
| `conviction` | `Int!` | 信念值 |
| `isActive` | `Boolean!` | 是否有效 |

### Preimage / TreasuryProposal

参见 `schema.graphql`。

## 示例查询

```graphql
# 最新 checkpoint
query {
  governanceCheckpoint(id: "substrate:vibly-solo") {
    blockNumber
    blockHash
    updatedAt
  }
}

# 列出所有公投
query {
  governanceSubjects(orderBy: SUBMITTED_AT_DESC, first: 20) {
    nodes {
      id
      referendumIndex
      status
      track
      ayeVotes
      nayVotes
    }
  }
}

# 某公投的投票列表
query {
  governanceVotes(filter: { referendumIndex: { equalTo: 0 } }) {
    nodes {
      voter
      stance
      conviction
      balance
    }
  }
}
```

## Docker Compose 服务

| 服务 | 镜像 | 端口 |
|---|---|---|
| `postgres` | `postgres:16-alpine` | 5432 |
| `subql-node` | `onfinality/subql-node-substrate:latest` | — |
| `graphql-engine` | `onfinality/subql-query:latest` | **3010** |

## 开发

```bash
# 本地（不用 Docker）
pnpm install
pnpm codegen    # 生成 SubQuery 类型
pnpm build      # 编译 TypeScript
```

SubQuery CLI 文档：https://academy.subquery.network