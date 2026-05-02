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

SubQuery 会把当前目录挂载到 `/app`，**必须先在本机生成清单与编译产物**（`project.yaml`、`dist/`、`src/types/`）。若跳过这一步，`subquery-node` 会报 `Unable to resolve manifest` / `Could not find manifest` 并不断重启，`graphql-engine` 会因依赖 **healthy** 条件而无法启动。

```bash
cd vibly-indexer

# 推荐使用 lockfile，避免依赖漂移
npm ci

# 生成实体模型并打包映射（subql codegen && subql build）
npm run build

# 启动 Postgres + SubQuery Node + GraphQL Engine
docker compose up -d

# 查看日志
docker compose logs -f subql-node
```

`docker-compose.yml` 会通过 **`--network-endpoint`**（Compose 解析 `${ENDPOINT:-ws://host.docker.internal:9944}`）把 WS 传给节点；也可在运行 `docker compose` 前于宿主机导出 `ENDPOINT`。Linux 若未配置 `host.docker.internal`，请改成宿主机真实可达地址。

GraphQL Playground：`http://localhost:3010/graphql`

### 常见问题

- **`dependency failed to start: ... subquery-node ... unhealthy`**：几乎都是尚未执行 `npm run build`，挂载目录里没有 `project.yaml` / `dist/`。按上文顺序先 `npm ci`（或 `npm install`）再 `npm run build`，然后重新 `docker compose up -d`。
- **`network.chainId ... isNotEmpty`**：`project.yaml` 里 **`network.chainId` 不能为空**。请重新执行 `npm run build`（确保使用当前仓库里的 `project.ts` 默认值）。
- **`Value of ChainId does not match across all endpoints` / `Expected ... Actual 0x...`**：`project.yaml` 里的 `network.chainId` 必须是 **创世哈希（hex）**，不能与映射里用的逻辑链名（如 `substrate:vibly-solo`）混用。仓库默认写入了当前 **vibly-chain solo `--dev`** 的 genesis；若换了 runtime/spec，请在连上节点后重新生成清单：  
  `SUBQL_GENESIS_CHAIN_ID=0x… npm run build`  
  （映射实体里的 `CHAIN_ID` 仍通过 Compose 的 `CHAIN_ID` 设为逻辑 id，与 coordinator 约定一致。）
- **`Btree_gist extension is required`**：新建数据库时会通过 `docker/init-subquery.sql` 安装扩展；**已有数据卷**若从未装过扩展，可在运行中的库里执行：  
  `docker compose exec postgres psql -U subquery -d vibly_indexer -c 'CREATE EXTENSION IF NOT EXISTS btree_gist;'`  
  当前 compose 同时为节点加了 **`--disable-historical`**，可在未装扩展的开发库里先跑通索引（不需要 historical 实体时可保留）。
- **`npm install` / `npm ci` 报 `EACCES`**：若曾用 Docker（root）挂载目录执行过 `npm install` / `subql build`，在仓库根目录执行 `sudo chown -R "$(id -u):$(id -g)" .` 后再重试。

## 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `ENDPOINT` | `ws://host.docker.internal:9944` | vibly-chain WebSocket 端点（Compose 传给 SubQuery Node） |
| `CHAIN_ID` | `substrate:vibly-solo` | **运行时**写入实体/主键前缀的逻辑链 id（与 coordinator 一致），**不要**用作 `project.yaml` 的 `network.chainId` |
| `SUBQL_GENESIS_CHAIN_ID` | （见 `project.ts` 内建 dev 哈希） | 仅在执行 **`npm run build` 生成 `project.yaml` 时**覆盖 `network.chainId`；需与 RPC 返回的 genesis 一致 |
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

## Phase E readback checklist

For the Vibly Chain / OpenGov real loop, the indexer is expected to provide the coordinator with:

- `GovernanceSubject` after `referenda.Submitted`, with a stable `referendumIndex` and `id`.
- Updated subject status after `DecisionStarted`, `ConfirmStarted`, `Approved`, `Rejected`, `Cancelled`, `TimedOut`, or `Killed`.
- `GovernanceVote` after `convictionVoting.Voted`, including `voter`, `stance`, `conviction`, `balance`, `blockNumber`, and `extrinsicIndex`.
- `GovernanceCheckpoint` updates so coordinator backend freshness is per chain.

The Substrate event JSON shape can use either lower-case or PascalCase enum variant keys. Vote mapping handles both forms for `Standard`, `Split`, and `SplitAbstain`.

## Docker Compose 服务

| 服务 | 镜像 | 端口 |
|---|---|---|
| `postgres` | `postgres:16-alpine` | 5432 |
| `subql-node` | `subquerynetwork/subql-node-substrate:latest` | — |
| `graphql-engine` | `subquerynetwork/subql-query:latest` | **3010** |

## 开发

```bash
# 本地（不用 Docker）
pnpm install
pnpm codegen    # 生成 SubQuery 类型
pnpm build      # 编译 TypeScript
```

SubQuery CLI 文档：https://academy.subquery.network