# vibly-indexer

`vibly-indexer` 是基于 [SubQuery](https://subquery.network/) 的 Vibly 网络**链上事件索引器**。它对 vibly-chain 单节点的各 Pallet 进行索引，并通过 GraphQL API 向 `vibly-coordinator` 提供读模型投影和质押同步服务。

## 已索引的 Pallet

| Pallet | 索引实体 |
|---|---|
| `pallet-identity-core` | `ChainIdentity`、`IdentityKey` |
| `pallet-payment-intent` | `PaymentIntent`、`SettlementEvent` |
| `pallet-agent-staking` | `AgentStakeLedger`、`AgentStakeEvent` |
| `pallet-vibly-emergency` | `EmergencyStatus` |
| 区块元数据 | `ChainCheckpoint` |

## 快速开始

SubQuery 要求在 Docker 服务启动前已有编译好的清单和输出产物（`project.yaml`、`dist/`、`src/types/`）。

```bash
cd vibly-indexer

# 安装依赖（使用 lockfile 避免漂移）
npm ci

# 生成实体模型并编译映射
npm run build

# 启动 Postgres + SubQuery Node + GraphQL Engine
docker compose up -d

# 跟踪日志
docker compose logs -f subql-node
```

GraphQL Playground：`http://localhost:3010/graphql`

## Docker Compose 服务

| 服务 | 镜像 | 端口 |
|---|---|---|
| `postgres` | `postgres:16-alpine` | 5432 |
| `subql-node` | `subquerynetwork/subql-node-substrate:latest` | — |
| `graphql-engine` | `subquerynetwork/subql-query:latest` | **3010** |

SubQuery 节点通过 `--network-endpoint`（`${ENDPOINT:-ws://host.docker.internal:9944}`）连接链节点。在 Linux 上，`host.docker.internal` 通过 `docker-compose.yml` 中的 `extra_hosts` 映射到宿主机网关。

## 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `ENDPOINT` | `ws://host.docker.internal:9944` | 传递给 SubQuery 节点的 vibly-chain WebSocket 端点 |
| `CHAIN_ID` | `substrate:vibly-solo` | 写入实体键前缀的逻辑链 ID（须与协调器配置一致） |
| `SUBQL_GENESIS_CHAIN_ID` | *（内置开发创世哈希）* | 仅在 `npm run build` 时用于设置 `project.yaml` 中的 `network.chainId`；须与 RPC 返回的实际创世哈希一致 |
| `START_BLOCK` | `1` | 开始索引的第一个区块号 |

## GraphQL Schema

### ChainCheckpoint

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `ID!` | 链标识符（如 `substrate:vibly-solo`） |
| `blockNumber` | `BigInt!` | 最新已索引区块号 |
| `blockHash` | `String!` | 最新已索引区块哈希 |
| `updatedAt` | `Date!` | 最后更新时间戳 |

### ChainIdentity

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `ID!` | `<chainId>:<identityId>` |
| `identityId` | `String!` | 链上 H256 身份 ID |
| `owner` | `String!` | 所有者账户（SS58） |
| `status` | `String!` | `Active \| Frozen \| Disabled` |
| `createdAtBlock` | `BigInt!` | 注册区块 |

### AgentStakeLedger

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `ID!` | `<chainId>:<identityId>:<agentId>` |
| `agentId` | `String!` | 链上 H256 代理 ID |
| `activeAmount` | `BigInt!` | 当前已绑定金额 |
| `unbondingAmount` | `BigInt!` | 解绑期中的金额 |
| `status` | `String!` | `Active \| Unbonding \| Released` |
| `unlockAtBlock` | `BigInt` | 可提取质押的区块号 |
| `releaseBlocked` | `Boolean!` | 是否因活跃义务而阻止释放 |
| `updatedAtBlock` | `BigInt!` | 最后更新区块 |

### PaymentIntent

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `ID!` | `<chainId>:<intentId>` |
| `payerIdentityId` | `String!` | 付款方身份 |
| `payeeIdentityId` | `String!` | 收款方身份 |
| `amount` | `BigInt!` | 意图金额 |
| `status` | `String!` | `Created \| Funded \| Claimed \| Refunded \| Cancelled \| Expired` |

### EmergencyStatus

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `ID!` | `<chainId>:<scope>` |
| `status` | `String!` | `Active \| Paused \| Cancelled` |
| `updatedAtBlock` | `BigInt!` | 最后更新区块 |

完整 Schema 见 [`schema.graphql`](schema.graphql)。

## 查询示例

```graphql
# 最新检查点
query {
  chainCheckpoint(id: "substrate:vibly-solo") {
    blockNumber
    blockHash
    updatedAt
  }
}

# 指定代理的质押账本
query {
  agentStakeLedgers(
    filter: { agentId: { equalTo: "0x…" } }
  ) {
    nodes {
      agentId
      activeAmount
      status
      releaseBlocked
      updatedAtBlock
    }
  }
}

# 按付款方查询支付意图
query {
  paymentIntents(
    filter: { payerIdentityId: { equalTo: "0x…" } }
    orderBy: CREATED_AT_BLOCK_DESC
    first: 20
  ) {
    nodes {
      intentId
      amount
      status
    }
  }
}
```

## 故障排除

**`dependency failed to start: subql-node unhealthy`** — 几乎总是由于缺少 `npm run build`。先运行 `npm ci && npm run build`，再执行 `docker compose up -d`。

**`network.chainId … isNotEmpty`** — `project.yaml` 中 `network.chainId` 为空。重新运行 `npm run build`。

**`Value of ChainId does not match across all endpoints`** — `project.yaml` 中的 `network.chainId` 必须是**创世哈希**（十六进制），而非逻辑链 ID（如 `substrate:vibly-solo`）。可通过 `SUBQL_GENESIS_CHAIN_ID=0x… npm run build` 覆盖。

**`Btree_gist extension is required`** — 在运行的数据库中安装扩展：
```bash
docker compose exec postgres psql -U subquery -d vibly_indexer \
  -c 'CREATE EXTENSION IF NOT EXISTS btree_gist;'
```

**`EACCES` on npm install** — 之前 Docker 以 root 身份生成了构建产物。修复方法：
```bash
sudo chown -R "$(id -u):$(id -g)" .
```

## 不使用 Docker 的开发模式

```bash
npm ci
npm run codegen    # 生成 SubQuery 实体类型
npm run build      # 编译 TypeScript
```
