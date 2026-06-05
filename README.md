# vibly-indexer

`vibly-indexer` is a [SubQuery](https://subquery.network/)-based on-chain event indexer for the Vibly network. It indexes **vibly-chain solo-node** pallets and exposes a GraphQL API consumed by `vibly-coordinator` for read-model projections and stake synchronisation.

## Indexed pallets

| Pallet | Indexed entities |
|---|---|
| `pallet-identity-core` | `ChainIdentity`, `IdentityKey` |
| `pallet-payment-intent` | `PaymentIntent`, `SettlementEvent` |
| `pallet-agent-staking` | `AgentStakeLedger`, `AgentStakeEvent` |
| `pallet-vibly-emergency` | `EmergencyStatus` |
| Block metadata | `ChainCheckpoint` |

## Quick start

SubQuery requires a compiled manifest and output artefacts (`project.yaml`, `dist/`, `src/types/`) to be present before the Docker services start.

```bash
cd vibly-indexer

# Install dependencies (use lockfile to avoid drift)
npm ci

# Generate entity models and compile mappings
npm run build

# Start Postgres + SubQuery Node + GraphQL Engine
docker compose up -d

# Follow logs
docker compose logs -f subql-node
```

GraphQL Playground: `http://localhost:3010/graphql`

## Docker Compose services

| Service | Image | Port |
|---|---|---|
| `postgres` | `postgres:16-alpine` | 5432 |
| `subql-node` | `subquerynetwork/subql-node-substrate:latest` | — |
| `graphql-engine` | `subquerynetwork/subql-query:latest` | **3010** |

The SubQuery node reaches the chain via `--network-endpoint` (`${ENDPOINT:-ws://host.docker.internal:9944}`). On Linux, `host.docker.internal` is mapped to the host gateway via `extra_hosts` in `docker-compose.yml`.

## Hosted deployment

`vibly-indexer` is not a single binary service. A correct hosted deployment always includes:

- Postgres
- one SubQuery node
- one SubQuery query service

For small environments, the simplest production shape is a VM running this repository's Docker Compose stack, usually beside the Vibly chain RPC or on a private peer VM with low-latency access to it.

When deployed for public networks:

- `Lumen` still indexes the Vibly chain itself; Get VIB relay-side deposits come from Paseo, not from a separately hosted payment chain
- `Monolith` still indexes the Vibly chain itself; Get VIB relay-side deposits come from Polkadot mainnet, not from a separately hosted payment chain

The deployment script in `vibly-e2e-lab` now treats indexer rollout as a VM + Docker Compose concern rather than a serverless app concern.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `ENDPOINT` | `ws://host.docker.internal:9944` | vibly-chain WebSocket endpoint passed to the SubQuery node |
| `CHAIN_ID` | `substrate:vibly-solo` | Logical chain ID written as the entity key prefix (must match coordinator config) |
| `SUBQL_GENESIS_CHAIN_ID` | *(built-in dev genesis hash)* | Used only during `npm run build` to set `network.chainId` in `project.yaml`; must equal the actual genesis hash returned by the RPC |
| `START_BLOCK` | `1` | First block to index |

## GraphQL schema

### ChainCheckpoint

| Field | Type | Description |
|---|---|---|
| `id` | `ID!` | Chain identifier (e.g. `substrate:vibly-solo`) |
| `blockNumber` | `BigInt!` | Latest indexed block number |
| `blockHash` | `String!` | Latest indexed block hash |
| `updatedAt` | `Date!` | Timestamp of last update |

### ChainIdentity

| Field | Type | Description |
|---|---|---|
| `id` | `ID!` | `<chainId>:<identityId>` |
| `identityId` | `String!` | On-chain H256 identity ID |
| `owner` | `String!` | Owner account (SS58) |
| `status` | `String!` | `Active \| Frozen \| Disabled` |
| `createdAtBlock` | `BigInt!` | Block of registration |

### AgentStakeLedger

| Field | Type | Description |
|---|---|---|
| `id` | `ID!` | `<chainId>:<identityId>:<agentId>` |
| `agentId` | `String!` | On-chain H256 agent ID |
| `activeAmount` | `BigInt!` | Currently bonded amount |
| `unbondingAmount` | `BigInt!` | Amount in unbonding period |
| `status` | `String!` | `Active \| Unbonding \| Released` |
| `unlockAtBlock` | `BigInt` | Block after which stake can be withdrawn |
| `releaseBlocked` | `Boolean!` | Whether release is blocked by an active obligation |
| `updatedAtBlock` | `BigInt!` | Last update block |

### PaymentIntent

| Field | Type | Description |
|---|---|---|
| `id` | `ID!` | `<chainId>:<intentId>` |
| `payerIdentityId` | `String!` | Payer identity |
| `payeeIdentityId` | `String!` | Payee identity |
| `amount` | `BigInt!` | Intent amount |
| `status` | `String!` | `Created \| Funded \| Claimed \| Refunded \| Cancelled \| Expired` |

### EmergencyStatus

| Field | Type | Description |
|---|---|---|
| `id` | `ID!` | `<chainId>:<scope>` |
| `status` | `String!` | `Active \| Paused \| Cancelled` |
| `updatedAtBlock` | `BigInt!` | Last update block |

For the full schema see [`schema.graphql`](schema.graphql).

## Example queries

```graphql
# Latest checkpoint
query {
  chainCheckpoint(id: "substrate:vibly-solo") {
    blockNumber
    blockHash
    updatedAt
  }
}

# Agent stake ledger for a specific agent
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

# Payment intents by payer
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

## Troubleshooting

**`dependency failed to start: subql-node unhealthy`** — Almost always caused by missing `npm run build`. Run `npm ci && npm run build`, then `docker compose up -d`.

**`network.chainId … isNotEmpty`** — The `project.yaml` `network.chainId` is empty. Re-run `npm run build`.

**`Value of ChainId does not match across all endpoints`** — The `network.chainId` in `project.yaml` must be the **genesis hash** (hex), not the logical chain ID like `substrate:vibly-solo`. Override with `SUBQL_GENESIS_CHAIN_ID=0x… npm run build`.

**`Btree_gist extension is required`** — Install the extension in the running database:
```bash
docker compose exec postgres psql -U subquery -d vibly_indexer \
  -c 'CREATE EXTENSION IF NOT EXISTS btree_gist;'
```

**`EACCES` on npm install** — Previous Docker root-owned build artefacts. Fix with:
```bash
sudo chown -R "$(id -u):$(id -g)" .
```

## Development (without Docker)

```bash
npm ci
npm run codegen    # generate SubQuery entity types
npm run build      # compile TypeScript
```
