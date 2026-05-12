(() => {
    "use strict";
    var e = {
        242(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handleAgentStakeReleased = t.handleAgentStakeReleaseCleared = t.handleAgentStakeReleaseBlocked = t.handleAgentStakeUnbondCancelled = t.handleAgentStakeUnbondRequested = t.handleAgentStakeBonded = void 0;
            const a = n(378), i = n(713), o = n(739);
            function r(e) {
                return e.toString();
            }
            function d(e) {
                return BigInt(e.block.header.number.toString());
            }
            function c(e) {
                var t;
                return e.extrinsic && null !== (t = e.extrinsic.idx) && void 0 !== t ? t : void 0;
            }
            async function s(e, t) {
                var n, i;
                const r = d(e.block), s = null !== (n = e.idx) && void 0 !== n ? n : 0, l = a.AgentStakeEvent.create({
                    id: (0, o.agentStakeEventEntityId)(t.identityId, t.agentId, r, s),
                    chainId: o.CHAIN_ID,
                    identityId: t.identityId,
                    agentId: t.agentId,
                    fundingAccount: t.fundingAccount,
                    eventType: t.eventType,
                    amount: t.amount,
                    activeAmount: t.activeAmount,
                    unlockAtBlock: t.unlockAtBlock,
                    reasonRef: t.reasonRef,
                    blockNumber: r,
                    extrinsicIndex: c(e),
                    eventIndex: s,
                    blockHash: e.block.block.header.hash.toHex(),
                    timestamp: null !== (i = e.block.timestamp) && void 0 !== i ? i : void 0
                });
                await l.save();
            }
            async function l(e, t) {
                var n, a, r, c, s, l, u, y, f, h;
                const p = (0, o.agentStakeLedgerEntityId)(t.identityId, t.agentId), g = await i.AgentStakeLedger.get(p), v = BigInt(0), m = null !== (n = t.activeAmount) && void 0 !== n ? n : (null !== (a = null == g ? void 0 : g.activeAmount) && void 0 !== a ? a : v) + (null !== (r = t.activeDelta) && void 0 !== r ? r : v), I = (null !== (c = null == g ? void 0 : g.unbondingAmount) && void 0 !== c ? c : v) + (null !== (s = t.unbondingDelta) && void 0 !== s ? s : v), b = null !== (u = null !== (l = t.releaseBlocked) && void 0 !== l ? l : null == g ? void 0 : g.releaseBlocked) && void 0 !== u && u, k = m > v ? "Active" : I > v ? "Unbonding" : "Released", w = i.AgentStakeLedger.create({
                    id: p,
                    chainId: o.CHAIN_ID,
                    identityId: t.identityId,
                    agentId: t.agentId,
                    fundingAccount: null !== (y = t.fundingAccount) && void 0 !== y ? y : null == g ? void 0 : g.fundingAccount,
                    activeAmount: m,
                    unbondingAmount: I,
                    status: k,
                    unlockAtBlock: null !== (f = t.unlockAtBlock) && void 0 !== f ? f : null == g ? void 0 : g.unlockAtBlock,
                    releaseBlocked: b,
                    releaseBlockReason: null === t.releaseBlockReason ? void 0 : null !== (h = t.releaseBlockReason) && void 0 !== h ? h : null == g ? void 0 : g.releaseBlockReason,
                    updatedAtBlock: d(e.block)
                });
                return await w.save(), w;
            }
            t.handleAgentStakeBonded = async function(e) {
                const {data: t} = e.event, n = r(t[0]), a = r(t[1]), i = r(t[2]), o = BigInt(r(t[3])), d = BigInt(r(t[4]));
                await l(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    activeAmount: d
                }), await s(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    eventType: "Bonded",
                    amount: o,
                    activeAmount: d
                });
            }, t.handleAgentStakeUnbondRequested = async function(e) {
                const {data: t} = e.event, n = r(t[0]), a = r(t[1]), i = r(t[2]), o = BigInt(r(t[3])), d = BigInt(r(t[4]));
                await l(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    activeDelta: -o,
                    unbondingDelta: o,
                    unlockAtBlock: d
                }), await s(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    eventType: "UnbondRequested",
                    amount: o,
                    unlockAtBlock: d
                });
            }, t.handleAgentStakeUnbondCancelled = async function(e) {
                const {data: t} = e.event, n = r(t[0]), a = r(t[1]), i = r(t[2]), o = BigInt(r(t[3]));
                await l(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    activeDelta: o,
                    unbondingDelta: -o
                }), await s(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    eventType: "UnbondCancelled",
                    amount: o
                });
            }, t.handleAgentStakeReleaseBlocked = async function(e) {
                const {data: t} = e.event, n = r(t[0]), a = r(t[1]), i = function(e) {
                    var t, n, a;
                    if (null == e) return;
                    const i = null !== (a = null === (n = (t = e).toJSON) || void 0 === n ? void 0 : n.call(t)) && void 0 !== a ? a : e;
                    return null != i ? "string" == typeof i ? i : JSON.stringify(i) : void 0;
                }(t[2]);
                await l(e, {
                    identityId: n,
                    agentId: a,
                    releaseBlocked: !0,
                    releaseBlockReason: i
                }), await s(e, {
                    identityId: n,
                    agentId: a,
                    eventType: "ReleaseBlocked",
                    reasonRef: i
                });
            }, t.handleAgentStakeReleaseCleared = async function(e) {
                const {data: t} = e.event, n = r(t[0]), a = r(t[1]);
                await l(e, {
                    identityId: n,
                    agentId: a,
                    releaseBlocked: !1,
                    releaseBlockReason: null
                }), await s(e, {
                    identityId: n,
                    agentId: a,
                    eventType: "ReleaseCleared"
                });
            }, t.handleAgentStakeReleased = async function(e) {
                const {data: t} = e.event, n = r(t[0]), a = r(t[1]), i = r(t[2]), o = BigInt(r(t[3]));
                await l(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    unbondingDelta: -o
                }), await s(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    eventType: "Released",
                    amount: o
                });
            };
        },
        751(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handleBlock = void 0;
            const a = n(302), i = n(739);
            t.handleBlock = async function(e) {
                var t, n;
                const o = BigInt(e.block.header.number.toString()), r = e.block.header.hash.toHex();
                let d = await a.ChainCheckpoint.get(i.CHAIN_ID);
                d ? (d.blockNumber = o, d.blockHash = r, d.updatedAt = null !== (n = e.timestamp) && void 0 !== n ? n : new Date) : d = a.ChainCheckpoint.create({
                    id: i.CHAIN_ID,
                    chainId: i.CHAIN_ID,
                    blockNumber: o,
                    blockHash: r,
                    updatedAt: null !== (t = e.timestamp) && void 0 !== t ? t : new Date
                }), await d.save();
            };
        },
        823(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handleEmergencyCancelled = t.handleEmergencyResumed = t.handleEmergencyPaused = void 0;
            const a = n(314), i = n(739);
            function o(e) {
                if (null != e) return e.toString();
            }
            async function r(e, t) {
                const {event: {data: n}, block: r} = e, d = function(e) {
                    const t = e.toJSON();
                    if ("string" == typeof t) return t;
                    if (null !== t && "object" == typeof t) {
                        const e = Object.entries(t);
                        if (1 === e.length) {
                            const [t, n] = e[0];
                            return `${t}:${n}`;
                        }
                    }
                    return JSON.stringify(t);
                }(n[0]), c = function(e) {
                    return BigInt(e.block.header.number.toString());
                }(r);
                let s, l;
                "Paused" === t ? (s = n[1].toString(), l = o(n[2].toJSON())) : l = o(n[1].toJSON());
                const u = (0, i.emergencyStatusEntityId)(d);
                let y = await a.EmergencyStatus.get(u);
                y ? (y.status = t, y.reasonHash = l, y.updatedBy = s, y.updatedAtBlock = c) : y = a.EmergencyStatus.create({
                    id: u,
                    chainId: i.CHAIN_ID,
                    scope: d,
                    status: t,
                    reasonHash: l,
                    updatedBy: s,
                    updatedAtBlock: c
                }), await y.save();
            }
            t.handleEmergencyPaused = async function(e) {
                await r(e, "Paused");
            }, t.handleEmergencyResumed = async function(e) {
                await r(e, "Active");
            }, t.handleEmergencyCancelled = async function(e) {
                await r(e, "Cancelled");
            };
        },
        957(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handleIdentityDisabled = t.handleIdentityUnfrozen = t.handleIdentityFrozen = t.handleTransportRevoked = t.handleTransportVerified = t.handleTransportBound = t.handleActiveRelationPolicySet = t.handleActiveAuthRegistrySet = t.handleActiveAgentRegistrySet = t.handleActiveProfileSet = t.handleIdentityKeyRevoked = t.handleIdentityKeyAdded = t.handleRecoveryKeySet = t.handleOwnerKeyRotated = t.handleIdentityRegistered = void 0;
            const a = n(322), i = n(708), o = n(739);
            function r(e) {
                return e.toString();
            }
            function d(e) {
                return BigInt(e.block.header.number.toString());
            }
            async function c(e) {
                return a.ChainIdentity.get((0, o.identityEntityId)(e));
            }
            function s(e) {
                if (null == e) return;
                if ("string" == typeof e) return e;
                const t = e;
                return t.cid ? String(t.cid) : t.uri ? String(t.uri) : JSON.stringify(e);
            }
            async function l(e) {
                try {
                    const t = (await api.query.identityCore.identities(e)).toJSON();
                    return t ? {
                        activeProfile: s(t.activeProfile),
                        activeAgentRegistry: s(t.activeAgentRegistry),
                        activeAuthRegistry: s(t.activeAuthRegistry),
                        activeRelationPolicy: s(t.activeRelationPolicy)
                    } : {};
                } catch (e) {
                    return {};
                }
            }
            async function u(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), i = await c(a);
                i && (i.updatedAtBlock = d(n), await i.save());
            }
            t.handleIdentityRegistered = async function(e) {
                const {event: {data: t}, block: n} = e, i = r(t[0]), c = r(t[1]), s = d(n), l = (0, 
                o.identityEntityId)(i), u = a.ChainIdentity.create({
                    id: l,
                    chainId: o.CHAIN_ID,
                    identityId: i,
                    owner: c,
                    status: "Active",
                    createdAtBlock: s,
                    updatedAtBlock: s
                });
                await u.save();
            }, t.handleOwnerKeyRotated = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), i = r(t[2]), o = d(n), s = await c(a);
                s && (s.owner = i, s.updatedAtBlock = o, await s.save());
            }, t.handleRecoveryKeySet = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), i = d(n), o = await c(a);
                o && (o.updatedAtBlock = i, await o.save());
            }, t.handleIdentityKeyAdded = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), s = r(t[1]), l = t[2], u = d(n), y = l.toJSON(), f = "string" == typeof y ? y : JSON.stringify(y), h = i.IdentityKey.create({
                    id: (0, o.identityKeyEntityId)(s),
                    chainId: o.CHAIN_ID,
                    identityId: a,
                    keyId: s,
                    account: "",
                    purpose: f,
                    status: "Active",
                    updatedAtBlock: u
                });
                try {
                    const e = (await api.query.identityCore.authorizedKeys(s)).toJSON();
                    e && e.account && (h.account = String(e.account));
                } catch (e) {}
                await h.save();
                const p = await c(a);
                p && (p.updatedAtBlock = u, await p.save());
            }, t.handleIdentityKeyRevoked = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[1]), s = r(t[0]), l = d(n), u = await i.IdentityKey.get((0, 
                o.identityKeyEntityId)(a));
                u && (u.status = "Revoked", u.updatedAtBlock = l, await u.save());
                const y = await c(s);
                y && (y.updatedAtBlock = l, await y.save());
            }, t.handleActiveProfileSet = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), i = d(n), o = await c(a);
                if (!o) return;
                const s = await l(a);
                o.activeProfile = s.activeProfile, o.updatedAtBlock = i, await o.save();
            }, t.handleActiveAgentRegistrySet = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), i = d(n), o = await c(a);
                if (!o) return;
                const s = await l(a);
                o.activeAgentRegistry = s.activeAgentRegistry, o.updatedAtBlock = i, await o.save();
            }, t.handleActiveAuthRegistrySet = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), i = d(n), o = await c(a);
                if (!o) return;
                const s = await l(a);
                o.activeAuthRegistry = s.activeAuthRegistry, o.updatedAtBlock = i, await o.save();
            }, t.handleActiveRelationPolicySet = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), i = d(n), o = await c(a);
                if (!o) return;
                const s = await l(a);
                o.activeRelationPolicy = s.activeRelationPolicy, o.updatedAtBlock = i, await o.save();
            }, t.handleTransportBound = async function(e) {
                await u(e);
            }, t.handleTransportVerified = async function(e) {
                await u(e);
            }, t.handleTransportRevoked = async function(e) {
                await u(e);
            }, t.handleIdentityFrozen = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), i = await c(a);
                i && (i.status = "Frozen", i.updatedAtBlock = d(n), await i.save());
            }, t.handleIdentityUnfrozen = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), i = await c(a);
                i && (i.status = "Active", i.updatedAtBlock = d(n), await i.save());
            }, t.handleIdentityDisabled = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), i = await c(a);
                i && (i.status = "Disabled", i.updatedAtBlock = d(n), await i.save());
            };
        },
        634(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handlePaymentIntentExpired = t.handlePaymentIntentCancelled = t.handlePaymentIntentRefunded = t.handlePaymentIntentClaimed = t.handlePaymentIntentFunded = t.handlePaymentIntentCreated = void 0;
            const a = n(745), i = n(908), o = n(739);
            function r(e) {
                return e.toString();
            }
            function d(e) {
                return BigInt(e.block.header.number.toString());
            }
            async function c(e) {
                return a.PaymentIntent.get((0, o.paymentIntentEntityId)(e));
            }
            async function s(e, t, n) {
                var a, r;
                const {block: c, extrinsic: s, idx: l} = e, u = d(c), y = null != l ? l : 0, f = (0, 
                o.settlementEventEntityId)(t, u, y), h = i.SettlementEvent.create({
                    id: f,
                    chainId: o.CHAIN_ID,
                    intentId: t,
                    eventType: n,
                    blockNumber: u,
                    extrinsicIndex: s && null !== (a = s.idx) && void 0 !== a ? a : void 0,
                    eventIndex: y,
                    blockHash: c.block.header.hash.toHex(),
                    timestamp: null !== (r = c.timestamp) && void 0 !== r ? r : void 0
                });
                await h.save();
            }
            t.handlePaymentIntentCreated = async function(e) {
                const {event: {data: t}, block: n} = e, i = r(t[0]), c = r(t[1]), s = r(t[2]), l = BigInt(r(t[4])), u = t[5].toJSON(), y = d(n);
                let f, h;
                if (u) {
                    const e = u.namespace;
                    Array.isArray(e) ? f = Buffer.from(e).toString("utf8") : "string" == typeof e && (f = e.startsWith("0x") ? Buffer.from(e.slice(2), "hex").toString("utf8") : e), 
                    void 0 !== u.actionCode && (h = String(u.actionCode));
                }
                const p = a.PaymentIntent.create({
                    id: (0, o.paymentIntentEntityId)(i),
                    chainId: o.CHAIN_ID,
                    intentId: i,
                    payerIdentityId: c,
                    payeeIdentityId: s,
                    amount: l,
                    settlementMode: "Unknown",
                    actionNamespace: f,
                    actionId: h,
                    status: "Created",
                    createdAtBlock: y,
                    updatedAtBlock: y
                });
                await p.save();
            }, t.handlePaymentIntentFunded = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), i = t[1].toJSON(), o = "string" == typeof i ? i : JSON.stringify(i), s = await c(a);
                s && (s.settlementMode = o, s.status = "Funded", s.updatedAtBlock = d(n), await s.save());
            }, t.handlePaymentIntentClaimed = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), i = await c(a);
                i && (i.status = "Claimed", i.updatedAtBlock = d(n), await i.save()), await s(e, a, "Claimed");
            }, t.handlePaymentIntentRefunded = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), i = await c(a);
                i && (i.status = "Refunded", i.updatedAtBlock = d(n), await i.save()), await s(e, a, "Refunded");
            }, t.handlePaymentIntentCancelled = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), i = await c(a);
                i && (i.status = "Cancelled", i.updatedAtBlock = d(n), await i.save()), await s(e, a, "Cancelled");
            }, t.handlePaymentIntentExpired = async function(e) {
                const {event: {data: t}, block: n} = e, a = r(t[0]), i = await c(a);
                i && (i.status = "Expired", i.updatedAtBlock = d(n), await i.save()), await s(e, a, "Expired");
            };
        },
        739(e, t) {
            var n;
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.emergencyStatusEntityId = t.agentStakeEventEntityId = t.agentStakeLedgerEntityId = t.settlementEventEntityId = t.paymentIntentEntityId = t.identityKeyEntityId = t.identityEntityId = t.CHAIN_ID = void 0, 
            t.CHAIN_ID = null !== (n = process.env.CHAIN_ID) && void 0 !== n ? n : "substrate:vibly-solo", 
            t.identityEntityId = function(e) {
                return `${t.CHAIN_ID}:${e}`;
            }, t.identityKeyEntityId = function(e) {
                return `${t.CHAIN_ID}:${e}`;
            }, t.paymentIntentEntityId = function(e) {
                return `${t.CHAIN_ID}:${e}`;
            }, t.settlementEventEntityId = function(e, n, a) {
                return `${t.CHAIN_ID}:${e}:${n}:${a}`;
            }, t.agentStakeLedgerEntityId = function(e, n) {
                return `${t.CHAIN_ID}:${e}:${n}`;
            }, t.agentStakeEventEntityId = function(e, n, a, i) {
                return `${t.CHAIN_ID}:${e}:${n}:${a}:${i}`;
            }, t.emergencyStatusEntityId = function(e) {
                return `${t.CHAIN_ID}:${e}`;
            };
        },
        378(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.AgentStakeEvent = void 0;
            const a = n(635).__importDefault(n(613));
            t.AgentStakeEvent = class {
                constructor(e, t, n, a, i, o, r, d) {
                    this.id = e, this.chainId = t, this.identityId = n, this.agentId = a, this.eventType = i, 
                    this.blockNumber = o, this.eventIndex = r, this.blockHash = d;
                }
                get _name() {
                    return "AgentStakeEvent";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save AgentStakeEvent entity without an ID"), 
                    await store.set("AgentStakeEvent", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove AgentStakeEvent entity without an ID"), 
                    await store.remove("AgentStakeEvent", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get AgentStakeEvent entity without an ID");
                    const t = await store.get("AgentStakeEvent", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("AgentStakeEvent", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.identityId, e.agentId, e.eventType, e.blockNumber, e.eventIndex, e.blockHash);
                    return Object.assign(t, e), t;
                }
            };
        },
        713(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.AgentStakeLedger = void 0;
            const a = n(635).__importDefault(n(613));
            t.AgentStakeLedger = class {
                constructor(e, t, n, a, i, o, r, d, c) {
                    this.id = e, this.chainId = t, this.identityId = n, this.agentId = a, this.activeAmount = i, 
                    this.unbondingAmount = o, this.status = r, this.releaseBlocked = d, this.updatedAtBlock = c;
                }
                get _name() {
                    return "AgentStakeLedger";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save AgentStakeLedger entity without an ID"), 
                    await store.set("AgentStakeLedger", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove AgentStakeLedger entity without an ID"), 
                    await store.remove("AgentStakeLedger", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get AgentStakeLedger entity without an ID");
                    const t = await store.get("AgentStakeLedger", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("AgentStakeLedger", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.identityId, e.agentId, e.activeAmount, e.unbondingAmount, e.status, e.releaseBlocked, e.updatedAtBlock);
                    return Object.assign(t, e), t;
                }
            };
        },
        302(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.ChainCheckpoint = void 0;
            const a = n(635).__importDefault(n(613));
            t.ChainCheckpoint = class {
                constructor(e, t, n, a, i) {
                    this.id = e, this.chainId = t, this.blockNumber = n, this.blockHash = a, this.updatedAt = i;
                }
                get _name() {
                    return "ChainCheckpoint";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save ChainCheckpoint entity without an ID"), 
                    await store.set("ChainCheckpoint", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove ChainCheckpoint entity without an ID"), 
                    await store.remove("ChainCheckpoint", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get ChainCheckpoint entity without an ID");
                    const t = await store.get("ChainCheckpoint", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("ChainCheckpoint", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.blockNumber, e.blockHash, e.updatedAt);
                    return Object.assign(t, e), t;
                }
            };
        },
        322(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.ChainIdentity = void 0;
            const a = n(635).__importDefault(n(613));
            t.ChainIdentity = class {
                constructor(e, t, n, a, i, o, r) {
                    this.id = e, this.chainId = t, this.identityId = n, this.owner = a, this.status = i, 
                    this.createdAtBlock = o, this.updatedAtBlock = r;
                }
                get _name() {
                    return "ChainIdentity";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save ChainIdentity entity without an ID"), await store.set("ChainIdentity", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove ChainIdentity entity without an ID"), 
                    await store.remove("ChainIdentity", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get ChainIdentity entity without an ID");
                    const t = await store.get("ChainIdentity", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("ChainIdentity", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.identityId, e.owner, e.status, e.createdAtBlock, e.updatedAtBlock);
                    return Object.assign(t, e), t;
                }
            };
        },
        314(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.EmergencyStatus = void 0;
            const a = n(635).__importDefault(n(613));
            t.EmergencyStatus = class {
                constructor(e, t, n, a, i) {
                    this.id = e, this.chainId = t, this.scope = n, this.status = a, this.updatedAtBlock = i;
                }
                get _name() {
                    return "EmergencyStatus";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save EmergencyStatus entity without an ID"), 
                    await store.set("EmergencyStatus", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove EmergencyStatus entity without an ID"), 
                    await store.remove("EmergencyStatus", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get EmergencyStatus entity without an ID");
                    const t = await store.get("EmergencyStatus", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("EmergencyStatus", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.scope, e.status, e.updatedAtBlock);
                    return Object.assign(t, e), t;
                }
            };
        },
        708(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.IdentityKey = void 0;
            const a = n(635).__importDefault(n(613));
            t.IdentityKey = class {
                constructor(e, t, n, a, i, o, r, d) {
                    this.id = e, this.chainId = t, this.identityId = n, this.keyId = a, this.account = i, 
                    this.purpose = o, this.status = r, this.updatedAtBlock = d;
                }
                get _name() {
                    return "IdentityKey";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save IdentityKey entity without an ID"), await store.set("IdentityKey", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove IdentityKey entity without an ID"), await store.remove("IdentityKey", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get IdentityKey entity without an ID");
                    const t = await store.get("IdentityKey", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("IdentityKey", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.identityId, e.keyId, e.account, e.purpose, e.status, e.updatedAtBlock);
                    return Object.assign(t, e), t;
                }
            };
        },
        745(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.PaymentIntent = void 0;
            const a = n(635).__importDefault(n(613));
            t.PaymentIntent = class {
                constructor(e, t, n, a, i, o, r, d, c, s) {
                    this.id = e, this.chainId = t, this.intentId = n, this.payerIdentityId = a, this.payeeIdentityId = i, 
                    this.amount = o, this.settlementMode = r, this.status = d, this.createdAtBlock = c, 
                    this.updatedAtBlock = s;
                }
                get _name() {
                    return "PaymentIntent";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save PaymentIntent entity without an ID"), await store.set("PaymentIntent", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove PaymentIntent entity without an ID"), 
                    await store.remove("PaymentIntent", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get PaymentIntent entity without an ID");
                    const t = await store.get("PaymentIntent", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("PaymentIntent", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.intentId, e.payerIdentityId, e.payeeIdentityId, e.amount, e.settlementMode, e.status, e.createdAtBlock, e.updatedAtBlock);
                    return Object.assign(t, e), t;
                }
            };
        },
        908(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.SettlementEvent = void 0;
            const a = n(635).__importDefault(n(613));
            t.SettlementEvent = class {
                constructor(e, t, n, a, i, o, r) {
                    this.id = e, this.chainId = t, this.intentId = n, this.eventType = a, this.blockNumber = i, 
                    this.eventIndex = o, this.blockHash = r;
                }
                get _name() {
                    return "SettlementEvent";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save SettlementEvent entity without an ID"), 
                    await store.set("SettlementEvent", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove SettlementEvent entity without an ID"), 
                    await store.remove("SettlementEvent", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get SettlementEvent entity without an ID");
                    const t = await store.get("SettlementEvent", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("SettlementEvent", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.intentId, e.eventType, e.blockNumber, e.eventIndex, e.blockHash);
                    return Object.assign(t, e), t;
                }
            };
        },
        613(e) {
            e.exports = require("assert");
        },
        197(e, t, n) {
            n.r(t), n.d(t, {
                packageInfo: () => u
            });
            const a = {
                name: "@polkadot/api-base",
                path: new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/api-base/packageInfo.js").pathname.substring(0, new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/api-base/packageInfo.js").pathname.lastIndexOf("/") + 1),
                type: "esm",
                version: "16.5.6"
            }, i = {
                name: "@polkadot/types",
                path: new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/types/packageInfo.js").pathname.substring(0, new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/types/packageInfo.js").pathname.lastIndexOf("/") + 1),
                type: "esm",
                version: "16.5.6"
            }, o = {
                name: "@polkadot/types-codec",
                path: new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/types-codec/packageInfo.js").pathname.substring(0, new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/types-codec/packageInfo.js").pathname.lastIndexOf("/") + 1),
                type: "esm",
                version: "16.5.6"
            };
            const r = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : Function("return this");
            function d(e, {name: t}) {
                return [ e, t ];
            }
            function c(e, {path: t, type: n}) {
                let a;
                if (t && t.length >= 5) {
                    const e = t.indexOf("node_modules");
                    a = -1 === e ? t : t.substring(e);
                } else a = "<unknown>";
                return [ `${`${n || ""}`.padStart(3)} ${e}`, a ];
            }
            function s(e, t) {
                if (e) return e;
                if ("function" == typeof t) try {
                    return t() || "";
                } catch {
                    return "";
                }
                return t || "";
            }
            function l(e, t, n) {
                console.warn(`${e}\nEither remove and explicitly install matching versions or dedupe using your package manager.\nThe following conflicting packages were found:\n${function(e, t) {
                    let n = 0;
                    for (let t = 0, a = e.length; t < a; t++) n = Math.max(n, e[t].version.length);
                    return e.map(e => `\t${t(e.version.padEnd(n), e).join("\t")}`).join("\n");
                }(t, n)}`);
            }
            const u = {
                name: "@polkadot/api-augment",
                path: new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/api-augment/packageInfo.js").pathname.substring(0, new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/api-augment/packageInfo.js").pathname.lastIndexOf("/") + 1),
                type: "esm",
                version: "16.5.6"
            };
            !function({name: e, path: t, type: n, version: a}, i, o = []) {
                if (!e.startsWith("@polkadot")) throw new Error(`Invalid package descriptor ${e}`);
                const u = function(e) {
                    const t = r;
                    return t.__polkadotjs || (t.__polkadotjs = {}), t.__polkadotjs[e] || (t.__polkadotjs[e] = []), 
                    t.__polkadotjs[e];
                }(e);
                u.push({
                    path: s(t, i),
                    type: n,
                    version: a
                });
                const y = u.every(e => e.version === a), f = "1" === r.process?.env?.POLKADOTJS_DISABLE_ESM_CJS_WARNING;
                if (1 !== u.length && !(f && y)) l(`${e} has multiple versions, ensure that there is only one installed.`, u, c); else {
                    const t = o.filter(e => e && e.version !== a);
                    t.length && l(`${e} requires direct dependencies exactly matching version ${a}.`, t, d);
                }
            }(u, null, [ a, o, i ]);
        },
        635(e, t, n) {
            n.r(t), n.d(t, {
                __addDisposableResource: () => T,
                __assign: () => o,
                __asyncDelegator: () => S,
                __asyncGenerator: () => A,
                __asyncValues: () => P,
                __await: () => _,
                __awaiter: () => h,
                __classPrivateFieldGet: () => B,
                __classPrivateFieldIn: () => x,
                __classPrivateFieldSet: () => D,
                __createBinding: () => g,
                __decorate: () => d,
                __disposeResources: () => K,
                __esDecorate: () => s,
                __exportStar: () => v,
                __extends: () => i,
                __generator: () => p,
                __importDefault: () => R,
                __importStar: () => E,
                __makeTemplateObject: () => O,
                __metadata: () => f,
                __param: () => c,
                __propKey: () => u,
                __read: () => I,
                __rest: () => r,
                __rewriteRelativeImportExtension: () => F,
                __runInitializers: () => l,
                __setFunctionName: () => y,
                __spread: () => b,
                __spreadArray: () => w,
                __spreadArrays: () => k,
                __values: () => m,
                default: () => H
            });
            var a = function(e, t) {
                return a = Object.setPrototypeOf || {
                    __proto__: []
                } instanceof Array && function(e, t) {
                    e.__proto__ = t;
                } || function(e, t) {
                    for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
                }, a(e, t);
            };
            function i(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
                function n() {
                    this.constructor = e;
                }
                a(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, 
                new n);
            }
            var o = function() {
                return o = Object.assign || function(e) {
                    for (var t, n = 1, a = arguments.length; n < a; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                    return e;
                }, o.apply(this, arguments);
            };
            function r(e, t) {
                var n = {};
                for (var a in e) Object.prototype.hasOwnProperty.call(e, a) && t.indexOf(a) < 0 && (n[a] = e[a]);
                if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
                    var i = 0;
                    for (a = Object.getOwnPropertySymbols(e); i < a.length; i++) t.indexOf(a[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, a[i]) && (n[a[i]] = e[a[i]]);
                }
                return n;
            }
            function d(e, t, n, a) {
                var i, o = arguments.length, r = o < 3 ? t : null === a ? a = Object.getOwnPropertyDescriptor(t, n) : a;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, n, a); else for (var d = e.length - 1; d >= 0; d--) (i = e[d]) && (r = (o < 3 ? i(r) : o > 3 ? i(t, n, r) : i(t, n)) || r);
                return o > 3 && r && Object.defineProperty(t, n, r), r;
            }
            function c(e, t) {
                return function(n, a) {
                    t(n, a, e);
                };
            }
            function s(e, t, n, a, i, o) {
                function r(e) {
                    if (void 0 !== e && "function" != typeof e) throw new TypeError("Function expected");
                    return e;
                }
                for (var d, c = a.kind, s = "getter" === c ? "get" : "setter" === c ? "set" : "value", l = !t && e ? a.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, a.name) : {}), y = !1, f = n.length - 1; f >= 0; f--) {
                    var h = {};
                    for (var p in a) h[p] = "access" === p ? {} : a[p];
                    for (var p in a.access) h.access[p] = a.access[p];
                    h.addInitializer = function(e) {
                        if (y) throw new TypeError("Cannot add initializers after decoration has completed");
                        o.push(r(e || null));
                    };
                    var g = (0, n[f])("accessor" === c ? {
                        get: u.get,
                        set: u.set
                    } : u[s], h);
                    if ("accessor" === c) {
                        if (void 0 === g) continue;
                        if (null === g || "object" != typeof g) throw new TypeError("Object expected");
                        (d = r(g.get)) && (u.get = d), (d = r(g.set)) && (u.set = d), (d = r(g.init)) && i.unshift(d);
                    } else (d = r(g)) && ("field" === c ? i.unshift(d) : u[s] = d);
                }
                l && Object.defineProperty(l, a.name, u), y = !0;
            }
            function l(e, t, n) {
                for (var a = arguments.length > 2, i = 0; i < t.length; i++) n = a ? t[i].call(e, n) : t[i].call(e);
                return a ? n : void 0;
            }
            function u(e) {
                return "symbol" == typeof e ? e : "".concat(e);
            }
            function y(e, t, n) {
                return "symbol" == typeof t && (t = t.description ? "[".concat(t.description, "]") : ""), 
                Object.defineProperty(e, "name", {
                    configurable: !0,
                    value: n ? "".concat(n, " ", t) : t
                });
            }
            function f(e, t) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t);
            }
            function h(e, t, n, a) {
                return new (n || (n = Promise))(function(i, o) {
                    function r(e) {
                        try {
                            c(a.next(e));
                        } catch (e) {
                            o(e);
                        }
                    }
                    function d(e) {
                        try {
                            c(a.throw(e));
                        } catch (e) {
                            o(e);
                        }
                    }
                    function c(e) {
                        var t;
                        e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
                            e(t);
                        })).then(r, d);
                    }
                    c((a = a.apply(e, t || [])).next());
                });
            }
            function p(e, t) {
                var n, a, i, o = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0]) throw i[1];
                        return i[1];
                    },
                    trys: [],
                    ops: []
                }, r = Object.create(("function" == typeof Iterator ? Iterator : Object).prototype);
                return r.next = d(0), r.throw = d(1), r.return = d(2), "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this;
                }), r;
                function d(d) {
                    return function(c) {
                        return function(d) {
                            if (n) throw new TypeError("Generator is already executing.");
                            for (;r && (r = 0, d[0] && (o = 0)), o; ) try {
                                if (n = 1, a && (i = 2 & d[0] ? a.return : d[0] ? a.throw || ((i = a.return) && i.call(a), 
                                0) : a.next) && !(i = i.call(a, d[1])).done) return i;
                                switch (a = 0, i && (d = [ 2 & d[0], i.value ]), d[0]) {
                                  case 0:
                                  case 1:
                                    i = d;
                                    break;

                                  case 4:
                                    return o.label++, {
                                        value: d[1],
                                        done: !1
                                    };

                                  case 5:
                                    o.label++, a = d[1], d = [ 0 ];
                                    continue;

                                  case 7:
                                    d = o.ops.pop(), o.trys.pop();
                                    continue;

                                  default:
                                    if (!(i = o.trys, (i = i.length > 0 && i[i.length - 1]) || 6 !== d[0] && 2 !== d[0])) {
                                        o = 0;
                                        continue;
                                    }
                                    if (3 === d[0] && (!i || d[1] > i[0] && d[1] < i[3])) {
                                        o.label = d[1];
                                        break;
                                    }
                                    if (6 === d[0] && o.label < i[1]) {
                                        o.label = i[1], i = d;
                                        break;
                                    }
                                    if (i && o.label < i[2]) {
                                        o.label = i[2], o.ops.push(d);
                                        break;
                                    }
                                    i[2] && o.ops.pop(), o.trys.pop();
                                    continue;
                                }
                                d = t.call(e, o);
                            } catch (e) {
                                d = [ 6, e ], a = 0;
                            } finally {
                                n = i = 0;
                            }
                            if (5 & d[0]) throw d[1];
                            return {
                                value: d[0] ? d[1] : void 0,
                                done: !0
                            };
                        }([ d, c ]);
                    };
                }
            }
            var g = Object.create ? function(e, t, n, a) {
                void 0 === a && (a = n);
                var i = Object.getOwnPropertyDescriptor(t, n);
                i && !("get" in i ? !t.__esModule : i.writable || i.configurable) || (i = {
                    enumerable: !0,
                    get: function() {
                        return t[n];
                    }
                }), Object.defineProperty(e, a, i);
            } : function(e, t, n, a) {
                void 0 === a && (a = n), e[a] = t[n];
            };
            function v(e, t) {
                for (var n in e) "default" === n || Object.prototype.hasOwnProperty.call(t, n) || g(t, e, n);
            }
            function m(e) {
                var t = "function" == typeof Symbol && Symbol.iterator, n = t && e[t], a = 0;
                if (n) return n.call(e);
                if (e && "number" == typeof e.length) return {
                    next: function() {
                        return e && a >= e.length && (e = void 0), {
                            value: e && e[a++],
                            done: !e
                        };
                    }
                };
                throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
            }
            function I(e, t) {
                var n = "function" == typeof Symbol && e[Symbol.iterator];
                if (!n) return e;
                var a, i, o = n.call(e), r = [];
                try {
                    for (;(void 0 === t || t-- > 0) && !(a = o.next()).done; ) r.push(a.value);
                } catch (e) {
                    i = {
                        error: e
                    };
                } finally {
                    try {
                        a && !a.done && (n = o.return) && n.call(o);
                    } finally {
                        if (i) throw i.error;
                    }
                }
                return r;
            }
            function b() {
                for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(I(arguments[t]));
                return e;
            }
            function k() {
                for (var e = 0, t = 0, n = arguments.length; t < n; t++) e += arguments[t].length;
                var a = Array(e), i = 0;
                for (t = 0; t < n; t++) for (var o = arguments[t], r = 0, d = o.length; r < d; r++, 
                i++) a[i] = o[r];
                return a;
            }
            function w(e, t, n) {
                if (n || 2 === arguments.length) for (var a, i = 0, o = t.length; i < o; i++) !a && i in t || (a || (a = Array.prototype.slice.call(t, 0, i)), 
                a[i] = t[i]);
                return e.concat(a || Array.prototype.slice.call(t));
            }
            function _(e) {
                return this instanceof _ ? (this.v = e, this) : new _(e);
            }
            function A(e, t, n) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var a, i = n.apply(e, t || []), o = [];
                return a = Object.create(("function" == typeof AsyncIterator ? AsyncIterator : Object).prototype), 
                r("next"), r("throw"), r("return", function(e) {
                    return function(t) {
                        return Promise.resolve(t).then(e, s);
                    };
                }), a[Symbol.asyncIterator] = function() {
                    return this;
                }, a;
                function r(e, t) {
                    i[e] && (a[e] = function(t) {
                        return new Promise(function(n, a) {
                            o.push([ e, t, n, a ]) > 1 || d(e, t);
                        });
                    }, t && (a[e] = t(a[e])));
                }
                function d(e, t) {
                    try {
                        (n = i[e](t)).value instanceof _ ? Promise.resolve(n.value.v).then(c, s) : l(o[0][2], n);
                    } catch (e) {
                        l(o[0][3], e);
                    }
                    var n;
                }
                function c(e) {
                    d("next", e);
                }
                function s(e) {
                    d("throw", e);
                }
                function l(e, t) {
                    e(t), o.shift(), o.length && d(o[0][0], o[0][1]);
                }
            }
            function S(e) {
                var t, n;
                return t = {}, a("next"), a("throw", function(e) {
                    throw e;
                }), a("return"), t[Symbol.iterator] = function() {
                    return this;
                }, t;
                function a(a, i) {
                    t[a] = e[a] ? function(t) {
                        return (n = !n) ? {
                            value: _(e[a](t)),
                            done: !1
                        } : i ? i(t) : t;
                    } : i;
                }
            }
            function P(e) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var t, n = e[Symbol.asyncIterator];
                return n ? n.call(e) : (e = m(e), t = {}, a("next"), a("throw"), a("return"), t[Symbol.asyncIterator] = function() {
                    return this;
                }, t);
                function a(n) {
                    t[n] = e[n] && function(t) {
                        return new Promise(function(a, i) {
                            (function(e, t, n, a) {
                                Promise.resolve(a).then(function(t) {
                                    e({
                                        value: t,
                                        done: n
                                    });
                                }, t);
                            })(a, i, (t = e[n](t)).done, t.value);
                        });
                    };
                }
            }
            function O(e, t) {
                return Object.defineProperty ? Object.defineProperty(e, "raw", {
                    value: t
                }) : e.raw = t, e;
            }
            var j = Object.create ? function(e, t) {
                Object.defineProperty(e, "default", {
                    enumerable: !0,
                    value: t
                });
            } : function(e, t) {
                e.default = t;
            }, C = function(e) {
                return C = Object.getOwnPropertyNames || function(e) {
                    var t = [];
                    for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[t.length] = n);
                    return t;
                }, C(e);
            };
            function E(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n = C(e), a = 0; a < n.length; a++) "default" !== n[a] && g(t, e, n[a]);
                return j(t, e), t;
            }
            function R(e) {
                return e && e.__esModule ? e : {
                    default: e
                };
            }
            function B(e, t, n, a) {
                if ("a" === n && !a) throw new TypeError("Private accessor was defined without a getter");
                if ("function" == typeof t ? e !== t || !a : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
                return "m" === n ? a : "a" === n ? a.call(e) : a ? a.value : t.get(e);
            }
            function D(e, t, n, a, i) {
                if ("m" === a) throw new TypeError("Private method is not writable");
                if ("a" === a && !i) throw new TypeError("Private accessor was defined without a setter");
                if ("function" == typeof t ? e !== t || !i : !t.has(e)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
                return "a" === a ? i.call(e, n) : i ? i.value = n : t.set(e, n), n;
            }
            function x(e, t) {
                if (null === t || "object" != typeof t && "function" != typeof t) throw new TypeError("Cannot use 'in' operator on non-object");
                return "function" == typeof e ? t === e : e.has(t);
            }
            function T(e, t, n) {
                if (null != t) {
                    if ("object" != typeof t && "function" != typeof t) throw new TypeError("Object expected.");
                    var a, i;
                    if (n) {
                        if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
                        a = t[Symbol.asyncDispose];
                    }
                    if (void 0 === a) {
                        if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
                        a = t[Symbol.dispose], n && (i = a);
                    }
                    if ("function" != typeof a) throw new TypeError("Object not disposable.");
                    i && (a = function() {
                        try {
                            i.call(this);
                        } catch (e) {
                            return Promise.reject(e);
                        }
                    }), e.stack.push({
                        value: t,
                        dispose: a,
                        async: n
                    });
                } else n && e.stack.push({
                    async: !0
                });
                return t;
            }
            var N = "function" == typeof SuppressedError ? SuppressedError : function(e, t, n) {
                var a = new Error(n);
                return a.name = "SuppressedError", a.error = e, a.suppressed = t, a;
            };
            function K(e) {
                function t(t) {
                    e.error = e.hasError ? new N(t, e.error, "An error was suppressed during disposal.") : t, 
                    e.hasError = !0;
                }
                var n, a = 0;
                return function i() {
                    for (;n = e.stack.pop(); ) try {
                        if (!n.async && 1 === a) return a = 0, e.stack.push(n), Promise.resolve().then(i);
                        if (n.dispose) {
                            var o = n.dispose.call(n.value);
                            if (n.async) return a |= 2, Promise.resolve(o).then(i, function(e) {
                                return t(e), i();
                            });
                        } else a |= 1;
                    } catch (e) {
                        t(e);
                    }
                    if (1 === a) return e.hasError ? Promise.reject(e.error) : Promise.resolve();
                    if (e.hasError) throw e.error;
                }();
            }
            function F(e, t) {
                return "string" == typeof e && /^\.\.?\//.test(e) ? e.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(e, n, a, i, o) {
                    return n ? t ? ".jsx" : ".js" : !a || i && o ? a + i + "." + o.toLowerCase() + "js" : e;
                }) : e;
            }
            const H = {
                __extends: i,
                __assign: o,
                __rest: r,
                __decorate: d,
                __param: c,
                __esDecorate: s,
                __runInitializers: l,
                __propKey: u,
                __setFunctionName: y,
                __metadata: f,
                __awaiter: h,
                __generator: p,
                __createBinding: g,
                __exportStar: v,
                __values: m,
                __read: I,
                __spread: b,
                __spreadArrays: k,
                __spreadArray: w,
                __await: _,
                __asyncGenerator: A,
                __asyncDelegator: S,
                __asyncValues: P,
                __makeTemplateObject: O,
                __importStar: E,
                __importDefault: R,
                __classPrivateFieldGet: B,
                __classPrivateFieldSet: D,
                __classPrivateFieldIn: x,
                __addDisposableResource: T,
                __disposeResources: K,
                __rewriteRelativeImportExtension: F
            };
        }
    }, t = {};
    function n(a) {
        var i = t[a];
        if (void 0 !== i) return i.exports;
        var o = t[a] = {
            exports: {}
        };
        return e[a](o, o.exports, n), o.exports;
    }
    n.d = (e, t) => {
        for (var a in t) n.o(t, a) && !n.o(e, a) && Object.defineProperty(e, a, {
            enumerable: !0,
            get: t[a]
        });
    }, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), n.r = e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        });
    };
    var a = {};
    (() => {
        var e = a;
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.handleAgentStakeReleased = e.handleAgentStakeReleaseCleared = e.handleAgentStakeReleaseBlocked = e.handleAgentStakeUnbondCancelled = e.handleAgentStakeUnbondRequested = e.handleAgentStakeBonded = e.handleEmergencyCancelled = e.handleEmergencyResumed = e.handleEmergencyPaused = e.handlePaymentIntentExpired = e.handlePaymentIntentCancelled = e.handlePaymentIntentRefunded = e.handlePaymentIntentClaimed = e.handlePaymentIntentFunded = e.handlePaymentIntentCreated = e.handleIdentityDisabled = e.handleIdentityUnfrozen = e.handleIdentityFrozen = e.handleTransportRevoked = e.handleTransportVerified = e.handleTransportBound = e.handleActiveRelationPolicySet = e.handleActiveAuthRegistrySet = e.handleActiveAgentRegistrySet = e.handleActiveProfileSet = e.handleIdentityKeyRevoked = e.handleIdentityKeyAdded = e.handleRecoveryKeySet = e.handleOwnerKeyRotated = e.handleIdentityRegistered = e.handleBlock = void 0;
        var t = n(751);
        Object.defineProperty(e, "handleBlock", {
            enumerable: !0,
            get: function() {
                return t.handleBlock;
            }
        });
        var i = n(957);
        Object.defineProperty(e, "handleIdentityRegistered", {
            enumerable: !0,
            get: function() {
                return i.handleIdentityRegistered;
            }
        }), Object.defineProperty(e, "handleOwnerKeyRotated", {
            enumerable: !0,
            get: function() {
                return i.handleOwnerKeyRotated;
            }
        }), Object.defineProperty(e, "handleRecoveryKeySet", {
            enumerable: !0,
            get: function() {
                return i.handleRecoveryKeySet;
            }
        }), Object.defineProperty(e, "handleIdentityKeyAdded", {
            enumerable: !0,
            get: function() {
                return i.handleIdentityKeyAdded;
            }
        }), Object.defineProperty(e, "handleIdentityKeyRevoked", {
            enumerable: !0,
            get: function() {
                return i.handleIdentityKeyRevoked;
            }
        }), Object.defineProperty(e, "handleActiveProfileSet", {
            enumerable: !0,
            get: function() {
                return i.handleActiveProfileSet;
            }
        }), Object.defineProperty(e, "handleActiveAgentRegistrySet", {
            enumerable: !0,
            get: function() {
                return i.handleActiveAgentRegistrySet;
            }
        }), Object.defineProperty(e, "handleActiveAuthRegistrySet", {
            enumerable: !0,
            get: function() {
                return i.handleActiveAuthRegistrySet;
            }
        }), Object.defineProperty(e, "handleActiveRelationPolicySet", {
            enumerable: !0,
            get: function() {
                return i.handleActiveRelationPolicySet;
            }
        }), Object.defineProperty(e, "handleTransportBound", {
            enumerable: !0,
            get: function() {
                return i.handleTransportBound;
            }
        }), Object.defineProperty(e, "handleTransportVerified", {
            enumerable: !0,
            get: function() {
                return i.handleTransportVerified;
            }
        }), Object.defineProperty(e, "handleTransportRevoked", {
            enumerable: !0,
            get: function() {
                return i.handleTransportRevoked;
            }
        }), Object.defineProperty(e, "handleIdentityFrozen", {
            enumerable: !0,
            get: function() {
                return i.handleIdentityFrozen;
            }
        }), Object.defineProperty(e, "handleIdentityUnfrozen", {
            enumerable: !0,
            get: function() {
                return i.handleIdentityUnfrozen;
            }
        }), Object.defineProperty(e, "handleIdentityDisabled", {
            enumerable: !0,
            get: function() {
                return i.handleIdentityDisabled;
            }
        });
        var o = n(634);
        Object.defineProperty(e, "handlePaymentIntentCreated", {
            enumerable: !0,
            get: function() {
                return o.handlePaymentIntentCreated;
            }
        }), Object.defineProperty(e, "handlePaymentIntentFunded", {
            enumerable: !0,
            get: function() {
                return o.handlePaymentIntentFunded;
            }
        }), Object.defineProperty(e, "handlePaymentIntentClaimed", {
            enumerable: !0,
            get: function() {
                return o.handlePaymentIntentClaimed;
            }
        }), Object.defineProperty(e, "handlePaymentIntentRefunded", {
            enumerable: !0,
            get: function() {
                return o.handlePaymentIntentRefunded;
            }
        }), Object.defineProperty(e, "handlePaymentIntentCancelled", {
            enumerable: !0,
            get: function() {
                return o.handlePaymentIntentCancelled;
            }
        }), Object.defineProperty(e, "handlePaymentIntentExpired", {
            enumerable: !0,
            get: function() {
                return o.handlePaymentIntentExpired;
            }
        });
        var r = n(823);
        Object.defineProperty(e, "handleEmergencyPaused", {
            enumerable: !0,
            get: function() {
                return r.handleEmergencyPaused;
            }
        }), Object.defineProperty(e, "handleEmergencyResumed", {
            enumerable: !0,
            get: function() {
                return r.handleEmergencyResumed;
            }
        }), Object.defineProperty(e, "handleEmergencyCancelled", {
            enumerable: !0,
            get: function() {
                return r.handleEmergencyCancelled;
            }
        });
        var d = n(242);
        Object.defineProperty(e, "handleAgentStakeBonded", {
            enumerable: !0,
            get: function() {
                return d.handleAgentStakeBonded;
            }
        }), Object.defineProperty(e, "handleAgentStakeUnbondRequested", {
            enumerable: !0,
            get: function() {
                return d.handleAgentStakeUnbondRequested;
            }
        }), Object.defineProperty(e, "handleAgentStakeUnbondCancelled", {
            enumerable: !0,
            get: function() {
                return d.handleAgentStakeUnbondCancelled;
            }
        }), Object.defineProperty(e, "handleAgentStakeReleaseBlocked", {
            enumerable: !0,
            get: function() {
                return d.handleAgentStakeReleaseBlocked;
            }
        }), Object.defineProperty(e, "handleAgentStakeReleaseCleared", {
            enumerable: !0,
            get: function() {
                return d.handleAgentStakeReleaseCleared;
            }
        }), Object.defineProperty(e, "handleAgentStakeReleased", {
            enumerable: !0,
            get: function() {
                return d.handleAgentStakeReleased;
            }
        }), n(197);
    })();
    var i = exports;
    for (var o in a) i[o] = a[o];
    a.__esModule && Object.defineProperty(i, "__esModule", {
        value: !0
    });
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VixhQUFZO1lBQU05UixLQUFLO2dCQUFjLE9BQU9zVyxFQUFlcGE7QUFBMEI7WUFDbEosRUFBUSIsInNvdXJjZXMiOlsid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvbWFwcGluZ3MvYWdlbnRTdGFraW5nLnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvbWFwcGluZ3MvYmxvY2sudHMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy9tYXBwaW5ncy9lbWVyZ2VuY3kudHMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy9tYXBwaW5ncy9pZGVudGl0eUNvcmUudHMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy9tYXBwaW5ncy9wYXltZW50SW50ZW50LnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvbWFwcGluZ3MvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy90eXBlcy9tb2RlbHMvQWdlbnRTdGFrZUV2ZW50LnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvdHlwZXMvbW9kZWxzL0FnZW50U3Rha2VMZWRnZXIudHMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy90eXBlcy9tb2RlbHMvQ2hhaW5DaGVja3BvaW50LnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvdHlwZXMvbW9kZWxzL0NoYWluSWRlbnRpdHkudHMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy90eXBlcy9tb2RlbHMvRW1lcmdlbmN5U3RhdHVzLnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvdHlwZXMvbW9kZWxzL0lkZW50aXR5S2V5LnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvdHlwZXMvbW9kZWxzL1BheW1lbnRJbnRlbnQudHMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy90eXBlcy9tb2RlbHMvU2V0dGxlbWVudEV2ZW50LnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImFzc2VydFwiIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvQHBvbGthZG90L2FwaS1iYXNlL3BhY2thZ2VJbmZvLmpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvQHBvbGthZG90L3R5cGVzL3BhY2thZ2VJbmZvLmpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvQHBvbGthZG90L3R5cGVzLWNvZGVjL3BhY2thZ2VJbmZvLmpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvQHBvbGthZG90L3gtZ2xvYmFsL2luZGV4LmpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvQHBvbGthZG90L3V0aWwvZGV0ZWN0UGFja2FnZS5qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC91dGlsL2lzL2Z1bmN0aW9uLmpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvQHBvbGthZG90L2FwaS1hdWdtZW50L3BhY2thZ2VJbmZvLmpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvQHBvbGthZG90L2FwaS1hdWdtZW50L3BhY2thZ2VEZXRlY3QuanMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYubWpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBNYXBwaW5nIGhhbmRsZXJzIGZvciBwYWxsZXRfYWdlbnRfc3Rha2luZyBldmVudHMuXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaGFuZGxlQWdlbnRTdGFrZVJlbGVhc2VkID0gZXhwb3J0cy5oYW5kbGVBZ2VudFN0YWtlUmVsZWFzZUNsZWFyZWQgPSBleHBvcnRzLmhhbmRsZUFnZW50U3Rha2VSZWxlYXNlQmxvY2tlZCA9IGV4cG9ydHMuaGFuZGxlQWdlbnRTdGFrZVVuYm9uZENhbmNlbGxlZCA9IGV4cG9ydHMuaGFuZGxlQWdlbnRTdGFrZVVuYm9uZFJlcXVlc3RlZCA9IGV4cG9ydHMuaGFuZGxlQWdlbnRTdGFrZUJvbmRlZCA9IHZvaWQgMDtcbmNvbnN0IEFnZW50U3Rha2VFdmVudF8xID0gcmVxdWlyZShcIi4uL3R5cGVzL21vZGVscy9BZ2VudFN0YWtlRXZlbnRcIik7XG5jb25zdCBBZ2VudFN0YWtlTGVkZ2VyXzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvbW9kZWxzL0FnZW50U3Rha2VMZWRnZXJcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG5mdW5jdGlvbiBzdHIodikge1xuICAgIHJldHVybiB2LnRvU3RyaW5nKCk7XG59XG5mdW5jdGlvbiBibG9ja051bShibG9jaykge1xuICAgIHJldHVybiBCaWdJbnQoYmxvY2suYmxvY2suaGVhZGVyLm51bWJlci50b1N0cmluZygpKTtcbn1cbmZ1bmN0aW9uIGV4dHJpbnNpY0luZGV4KGV2ZW50KSB7XG4gICAgdmFyIF9hO1xuICAgIHJldHVybiBldmVudC5leHRyaW5zaWMgPyAoX2EgPSBldmVudC5leHRyaW5zaWMuaWR4KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB1bmRlZmluZWQgOiB1bmRlZmluZWQ7XG59XG5mdW5jdGlvbiByZWZUb1N0cmluZyh2KSB7XG4gICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgaWYgKHYgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBqc29uID0gKF9jID0gKF9iID0gKF9hID0gdikudG9KU09OKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChfYSkpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IHY7XG4gICAgaWYgKGpzb24gPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBpZiAodHlwZW9mIGpzb24gPT09IFwic3RyaW5nXCIpXG4gICAgICAgIHJldHVybiBqc29uO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShqc29uKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGFwcGVuZFN0YWtlRXZlbnQoZXZlbnQsIGlucHV0KSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBjb25zdCBibiA9IGJsb2NrTnVtKGV2ZW50LmJsb2NrKTtcbiAgICBjb25zdCBldmVudEluZGV4ID0gKF9hID0gZXZlbnQuaWR4KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAwO1xuICAgIGNvbnN0IHJvdyA9IEFnZW50U3Rha2VFdmVudF8xLkFnZW50U3Rha2VFdmVudC5jcmVhdGUoe1xuICAgICAgICBpZDogKDAsIHV0aWxzXzEuYWdlbnRTdGFrZUV2ZW50RW50aXR5SWQpKGlucHV0LmlkZW50aXR5SWQsIGlucHV0LmFnZW50SWQsIGJuLCBldmVudEluZGV4KSxcbiAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgaWRlbnRpdHlJZDogaW5wdXQuaWRlbnRpdHlJZCxcbiAgICAgICAgYWdlbnRJZDogaW5wdXQuYWdlbnRJZCxcbiAgICAgICAgZnVuZGluZ0FjY291bnQ6IGlucHV0LmZ1bmRpbmdBY2NvdW50LFxuICAgICAgICBldmVudFR5cGU6IGlucHV0LmV2ZW50VHlwZSxcbiAgICAgICAgYW1vdW50OiBpbnB1dC5hbW91bnQsXG4gICAgICAgIGFjdGl2ZUFtb3VudDogaW5wdXQuYWN0aXZlQW1vdW50LFxuICAgICAgICB1bmxvY2tBdEJsb2NrOiBpbnB1dC51bmxvY2tBdEJsb2NrLFxuICAgICAgICByZWFzb25SZWY6IGlucHV0LnJlYXNvblJlZixcbiAgICAgICAgYmxvY2tOdW1iZXI6IGJuLFxuICAgICAgICBleHRyaW5zaWNJbmRleDogZXh0cmluc2ljSW5kZXgoZXZlbnQpLFxuICAgICAgICBldmVudEluZGV4LFxuICAgICAgICBibG9ja0hhc2g6IGV2ZW50LmJsb2NrLmJsb2NrLmhlYWRlci5oYXNoLnRvSGV4KCksXG4gICAgICAgIHRpbWVzdGFtcDogKF9iID0gZXZlbnQuYmxvY2sudGltZXN0YW1wKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gICAgYXdhaXQgcm93LnNhdmUoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHVwc2VydExlZGdlcihldmVudCwgaW5wdXQpIHtcbiAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZiwgX2csIF9oLCBfaiwgX2s7XG4gICAgY29uc3QgaWQgPSAoMCwgdXRpbHNfMS5hZ2VudFN0YWtlTGVkZ2VyRW50aXR5SWQpKGlucHV0LmlkZW50aXR5SWQsIGlucHV0LmFnZW50SWQpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgQWdlbnRTdGFrZUxlZGdlcl8xLkFnZW50U3Rha2VMZWRnZXIuZ2V0KGlkKTtcbiAgICBjb25zdCB6ZXJvID0gQmlnSW50KDApO1xuICAgIGNvbnN0IGFjdGl2ZUFtb3VudCA9IChfYSA9IGlucHV0LmFjdGl2ZUFtb3VudCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKCgoX2IgPSBleGlzdGluZyA9PT0gbnVsbCB8fCBleGlzdGluZyA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXhpc3RpbmcuYWN0aXZlQW1vdW50KSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiB6ZXJvKSArICgoX2MgPSBpbnB1dC5hY3RpdmVEZWx0YSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogemVybykpO1xuICAgIGNvbnN0IHVuYm9uZGluZ0Ftb3VudCA9ICgoX2QgPSBleGlzdGluZyA9PT0gbnVsbCB8fCBleGlzdGluZyA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXhpc3RpbmcudW5ib25kaW5nQW1vdW50KSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiB6ZXJvKSArICgoX2UgPSBpbnB1dC51bmJvbmRpbmdEZWx0YSkgIT09IG51bGwgJiYgX2UgIT09IHZvaWQgMCA/IF9lIDogemVybyk7XG4gICAgY29uc3QgcmVsZWFzZUJsb2NrZWQgPSAoX2cgPSAoX2YgPSBpbnB1dC5yZWxlYXNlQmxvY2tlZCkgIT09IG51bGwgJiYgX2YgIT09IHZvaWQgMCA/IF9mIDogZXhpc3RpbmcgPT09IG51bGwgfHwgZXhpc3RpbmcgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGV4aXN0aW5nLnJlbGVhc2VCbG9ja2VkKSAhPT0gbnVsbCAmJiBfZyAhPT0gdm9pZCAwID8gX2cgOiBmYWxzZTtcbiAgICBjb25zdCBzdGF0dXMgPSBhY3RpdmVBbW91bnQgPiB6ZXJvID8gXCJBY3RpdmVcIiA6IHVuYm9uZGluZ0Ftb3VudCA+IHplcm8gPyBcIlVuYm9uZGluZ1wiIDogXCJSZWxlYXNlZFwiO1xuICAgIGNvbnN0IGxlZGdlciA9IEFnZW50U3Rha2VMZWRnZXJfMS5BZ2VudFN0YWtlTGVkZ2VyLmNyZWF0ZSh7XG4gICAgICAgIGlkLFxuICAgICAgICBjaGFpbklkOiB1dGlsc18xLkNIQUlOX0lELFxuICAgICAgICBpZGVudGl0eUlkOiBpbnB1dC5pZGVudGl0eUlkLFxuICAgICAgICBhZ2VudElkOiBpbnB1dC5hZ2VudElkLFxuICAgICAgICBmdW5kaW5nQWNjb3VudDogKF9oID0gaW5wdXQuZnVuZGluZ0FjY291bnQpICE9PSBudWxsICYmIF9oICE9PSB2b2lkIDAgPyBfaCA6IGV4aXN0aW5nID09PSBudWxsIHx8IGV4aXN0aW5nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBleGlzdGluZy5mdW5kaW5nQWNjb3VudCxcbiAgICAgICAgYWN0aXZlQW1vdW50LFxuICAgICAgICB1bmJvbmRpbmdBbW91bnQsXG4gICAgICAgIHN0YXR1cyxcbiAgICAgICAgdW5sb2NrQXRCbG9jazogKF9qID0gaW5wdXQudW5sb2NrQXRCbG9jaykgIT09IG51bGwgJiYgX2ogIT09IHZvaWQgMCA/IF9qIDogZXhpc3RpbmcgPT09IG51bGwgfHwgZXhpc3RpbmcgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGV4aXN0aW5nLnVubG9ja0F0QmxvY2ssXG4gICAgICAgIHJlbGVhc2VCbG9ja2VkLFxuICAgICAgICByZWxlYXNlQmxvY2tSZWFzb246IGlucHV0LnJlbGVhc2VCbG9ja1JlYXNvbiA9PT0gbnVsbCA/IHVuZGVmaW5lZCA6IChfayA9IGlucHV0LnJlbGVhc2VCbG9ja1JlYXNvbikgIT09IG51bGwgJiYgX2sgIT09IHZvaWQgMCA/IF9rIDogZXhpc3RpbmcgPT09IG51bGwgfHwgZXhpc3RpbmcgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGV4aXN0aW5nLnJlbGVhc2VCbG9ja1JlYXNvbixcbiAgICAgICAgdXBkYXRlZEF0QmxvY2s6IGJsb2NrTnVtKGV2ZW50LmJsb2NrKSxcbiAgICB9KTtcbiAgICBhd2FpdCBsZWRnZXIuc2F2ZSgpO1xuICAgIHJldHVybiBsZWRnZXI7XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVBZ2VudFN0YWtlQm9uZGVkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBldmVudC5ldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGFnZW50SWQgPSBzdHIoZGF0YVsxXSk7XG4gICAgY29uc3QgZnVuZGluZ0FjY291bnQgPSBzdHIoZGF0YVsyXSk7XG4gICAgY29uc3QgYW1vdW50ID0gQmlnSW50KHN0cihkYXRhWzNdKSk7XG4gICAgY29uc3QgYWN0aXZlQW1vdW50ID0gQmlnSW50KHN0cihkYXRhWzRdKSk7XG4gICAgYXdhaXQgdXBzZXJ0TGVkZ2VyKGV2ZW50LCB7IGlkZW50aXR5SWQsIGFnZW50SWQsIGZ1bmRpbmdBY2NvdW50LCBhY3RpdmVBbW91bnQgfSk7XG4gICAgYXdhaXQgYXBwZW5kU3Rha2VFdmVudChldmVudCwgeyBpZGVudGl0eUlkLCBhZ2VudElkLCBmdW5kaW5nQWNjb3VudCwgZXZlbnRUeXBlOiBcIkJvbmRlZFwiLCBhbW91bnQsIGFjdGl2ZUFtb3VudCB9KTtcbn1cbmV4cG9ydHMuaGFuZGxlQWdlbnRTdGFrZUJvbmRlZCA9IGhhbmRsZUFnZW50U3Rha2VCb25kZWQ7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVBZ2VudFN0YWtlVW5ib25kUmVxdWVzdGVkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBldmVudC5ldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGFnZW50SWQgPSBzdHIoZGF0YVsxXSk7XG4gICAgY29uc3QgZnVuZGluZ0FjY291bnQgPSBzdHIoZGF0YVsyXSk7XG4gICAgY29uc3QgYW1vdW50ID0gQmlnSW50KHN0cihkYXRhWzNdKSk7XG4gICAgY29uc3QgdW5sb2NrQXRCbG9jayA9IEJpZ0ludChzdHIoZGF0YVs0XSkpO1xuICAgIGF3YWl0IHVwc2VydExlZGdlcihldmVudCwgeyBpZGVudGl0eUlkLCBhZ2VudElkLCBmdW5kaW5nQWNjb3VudCwgYWN0aXZlRGVsdGE6IC1hbW91bnQsIHVuYm9uZGluZ0RlbHRhOiBhbW91bnQsIHVubG9ja0F0QmxvY2sgfSk7XG4gICAgYXdhaXQgYXBwZW5kU3Rha2VFdmVudChldmVudCwgeyBpZGVudGl0eUlkLCBhZ2VudElkLCBmdW5kaW5nQWNjb3VudCwgZXZlbnRUeXBlOiBcIlVuYm9uZFJlcXVlc3RlZFwiLCBhbW91bnQsIHVubG9ja0F0QmxvY2sgfSk7XG59XG5leHBvcnRzLmhhbmRsZUFnZW50U3Rha2VVbmJvbmRSZXF1ZXN0ZWQgPSBoYW5kbGVBZ2VudFN0YWtlVW5ib25kUmVxdWVzdGVkO1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQWdlbnRTdGFrZVVuYm9uZENhbmNlbGxlZChldmVudCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gZXZlbnQuZXZlbnQ7XG4gICAgY29uc3QgaWRlbnRpdHlJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBhZ2VudElkID0gc3RyKGRhdGFbMV0pO1xuICAgIGNvbnN0IGZ1bmRpbmdBY2NvdW50ID0gc3RyKGRhdGFbMl0pO1xuICAgIGNvbnN0IGFtb3VudCA9IEJpZ0ludChzdHIoZGF0YVszXSkpO1xuICAgIGF3YWl0IHVwc2VydExlZGdlcihldmVudCwgeyBpZGVudGl0eUlkLCBhZ2VudElkLCBmdW5kaW5nQWNjb3VudCwgYWN0aXZlRGVsdGE6IGFtb3VudCwgdW5ib25kaW5nRGVsdGE6IC1hbW91bnQgfSk7XG4gICAgYXdhaXQgYXBwZW5kU3Rha2VFdmVudChldmVudCwgeyBpZGVudGl0eUlkLCBhZ2VudElkLCBmdW5kaW5nQWNjb3VudCwgZXZlbnRUeXBlOiBcIlVuYm9uZENhbmNlbGxlZFwiLCBhbW91bnQgfSk7XG59XG5leHBvcnRzLmhhbmRsZUFnZW50U3Rha2VVbmJvbmRDYW5jZWxsZWQgPSBoYW5kbGVBZ2VudFN0YWtlVW5ib25kQ2FuY2VsbGVkO1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQWdlbnRTdGFrZVJlbGVhc2VCbG9ja2VkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBldmVudC5ldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGFnZW50SWQgPSBzdHIoZGF0YVsxXSk7XG4gICAgY29uc3QgcmVhc29uUmVmID0gcmVmVG9TdHJpbmcoZGF0YVsyXSk7XG4gICAgYXdhaXQgdXBzZXJ0TGVkZ2VyKGV2ZW50LCB7IGlkZW50aXR5SWQsIGFnZW50SWQsIHJlbGVhc2VCbG9ja2VkOiB0cnVlLCByZWxlYXNlQmxvY2tSZWFzb246IHJlYXNvblJlZiB9KTtcbiAgICBhd2FpdCBhcHBlbmRTdGFrZUV2ZW50KGV2ZW50LCB7IGlkZW50aXR5SWQsIGFnZW50SWQsIGV2ZW50VHlwZTogXCJSZWxlYXNlQmxvY2tlZFwiLCByZWFzb25SZWYgfSk7XG59XG5leHBvcnRzLmhhbmRsZUFnZW50U3Rha2VSZWxlYXNlQmxvY2tlZCA9IGhhbmRsZUFnZW50U3Rha2VSZWxlYXNlQmxvY2tlZDtcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUFnZW50U3Rha2VSZWxlYXNlQ2xlYXJlZChldmVudCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gZXZlbnQuZXZlbnQ7XG4gICAgY29uc3QgaWRlbnRpdHlJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBhZ2VudElkID0gc3RyKGRhdGFbMV0pO1xuICAgIGF3YWl0IHVwc2VydExlZGdlcihldmVudCwgeyBpZGVudGl0eUlkLCBhZ2VudElkLCByZWxlYXNlQmxvY2tlZDogZmFsc2UsIHJlbGVhc2VCbG9ja1JlYXNvbjogbnVsbCB9KTtcbiAgICBhd2FpdCBhcHBlbmRTdGFrZUV2ZW50KGV2ZW50LCB7IGlkZW50aXR5SWQsIGFnZW50SWQsIGV2ZW50VHlwZTogXCJSZWxlYXNlQ2xlYXJlZFwiIH0pO1xufVxuZXhwb3J0cy5oYW5kbGVBZ2VudFN0YWtlUmVsZWFzZUNsZWFyZWQgPSBoYW5kbGVBZ2VudFN0YWtlUmVsZWFzZUNsZWFyZWQ7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVBZ2VudFN0YWtlUmVsZWFzZWQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGV2ZW50LmV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgYWdlbnRJZCA9IHN0cihkYXRhWzFdKTtcbiAgICBjb25zdCBmdW5kaW5nQWNjb3VudCA9IHN0cihkYXRhWzJdKTtcbiAgICBjb25zdCBhbW91bnQgPSBCaWdJbnQoc3RyKGRhdGFbM10pKTtcbiAgICBhd2FpdCB1cHNlcnRMZWRnZXIoZXZlbnQsIHsgaWRlbnRpdHlJZCwgYWdlbnRJZCwgZnVuZGluZ0FjY291bnQsIHVuYm9uZGluZ0RlbHRhOiAtYW1vdW50IH0pO1xuICAgIGF3YWl0IGFwcGVuZFN0YWtlRXZlbnQoZXZlbnQsIHsgaWRlbnRpdHlJZCwgYWdlbnRJZCwgZnVuZGluZ0FjY291bnQsIGV2ZW50VHlwZTogXCJSZWxlYXNlZFwiLCBhbW91bnQgfSk7XG59XG5leHBvcnRzLmhhbmRsZUFnZW50U3Rha2VSZWxlYXNlZCA9IGhhbmRsZUFnZW50U3Rha2VSZWxlYXNlZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5oYW5kbGVCbG9jayA9IHZvaWQgMDtcbmNvbnN0IENoYWluQ2hlY2twb2ludF8xID0gcmVxdWlyZShcIi4uL3R5cGVzL21vZGVscy9DaGFpbkNoZWNrcG9pbnRcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVCbG9jayhibG9jaykge1xuICAgIHZhciBfYSwgX2I7XG4gICAgY29uc3QgYmxvY2tOdW1iZXIgPSBCaWdJbnQoYmxvY2suYmxvY2suaGVhZGVyLm51bWJlci50b1N0cmluZygpKTtcbiAgICBjb25zdCBibG9ja0hhc2ggPSBibG9jay5ibG9jay5oZWFkZXIuaGFzaC50b0hleCgpO1xuICAgIGxldCBjaGVja3BvaW50ID0gYXdhaXQgQ2hhaW5DaGVja3BvaW50XzEuQ2hhaW5DaGVja3BvaW50LmdldCh1dGlsc18xLkNIQUlOX0lEKTtcbiAgICBpZiAoIWNoZWNrcG9pbnQpIHtcbiAgICAgICAgY2hlY2twb2ludCA9IENoYWluQ2hlY2twb2ludF8xLkNoYWluQ2hlY2twb2ludC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6IHV0aWxzXzEuQ0hBSU5fSUQsXG4gICAgICAgICAgICBjaGFpbklkOiB1dGlsc18xLkNIQUlOX0lELFxuICAgICAgICAgICAgYmxvY2tOdW1iZXIsXG4gICAgICAgICAgICBibG9ja0hhc2gsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IChfYSA9IGJsb2NrLnRpbWVzdGFtcCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogbmV3IERhdGUoKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjaGVja3BvaW50LmJsb2NrTnVtYmVyID0gYmxvY2tOdW1iZXI7XG4gICAgICAgIGNoZWNrcG9pbnQuYmxvY2tIYXNoID0gYmxvY2tIYXNoO1xuICAgICAgICBjaGVja3BvaW50LnVwZGF0ZWRBdCA9IChfYiA9IGJsb2NrLnRpbWVzdGFtcCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogbmV3IERhdGUoKTtcbiAgICB9XG4gICAgYXdhaXQgY2hlY2twb2ludC5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZUJsb2NrID0gaGFuZGxlQmxvY2s7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogTWFwcGluZyBoYW5kbGVycyBmb3IgcGFsbGV0X3ZpYmx5X2VtZXJnZW5jeSBldmVudHMuXG4gKlxuICogRXZlbnRzIGhhbmRsZWQ6IFBhdXNlZCwgUmVzdW1lZCwgQ2FuY2VsbGVkXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaGFuZGxlRW1lcmdlbmN5Q2FuY2VsbGVkID0gZXhwb3J0cy5oYW5kbGVFbWVyZ2VuY3lSZXN1bWVkID0gZXhwb3J0cy5oYW5kbGVFbWVyZ2VuY3lQYXVzZWQgPSB2b2lkIDA7XG5jb25zdCBFbWVyZ2VuY3lTdGF0dXNfMSA9IHJlcXVpcmUoXCIuLi90eXBlcy9tb2RlbHMvRW1lcmdlbmN5U3RhdHVzXCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xuLy8g4pSA4pSA4pSAIGhlbHBlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5mdW5jdGlvbiBibG9ja051bShibG9jaykge1xuICAgIHJldHVybiBCaWdJbnQoYmxvY2suYmxvY2suaGVhZGVyLm51bWJlci50b1N0cmluZygpKTtcbn1cbi8qKiBTZXJpYWxpemUgRW1lcmdlbmN5U2NvcGUgZW51bSB0byBhIHN0YWJsZSBzdHJpbmcga2V5LiAqL1xuZnVuY3Rpb24gc2VyaWFsaXplU2NvcGUoc2NvcGVSYXcpIHtcbiAgICBjb25zdCBqc29uID0gc2NvcGVSYXcudG9KU09OKCk7XG4gICAgaWYgKHR5cGVvZiBqc29uID09PSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4ganNvbjtcbiAgICAvLyBFbnVtIHZhcmlhbnRzIHdpdGggYSBwYXlsb2FkIGNvbWUgYXMgeyB2YXJpYW50TmFtZTogdmFsdWUgfVxuICAgIGlmIChqc29uICE9PSBudWxsICYmIHR5cGVvZiBqc29uID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhqc29uKTtcbiAgICAgICAgaWYgKGVudHJpZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBjb25zdCBbbmFtZSwgdmFsXSA9IGVudHJpZXNbMF07XG4gICAgICAgICAgICByZXR1cm4gYCR7bmFtZX06JHt2YWx9YDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoanNvbik7XG59XG5mdW5jdGlvbiBvcHRIZXgocmF3KSB7XG4gICAgaWYgKHJhdyA9PT0gbnVsbCB8fCByYXcgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmF3LnRvU3RyaW5nKCk7XG59XG5hc3luYyBmdW5jdGlvbiB1cHNlcnRFbWVyZ2VuY3lTdGF0dXMoZXZlbnQsIHN0YXR1cykge1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3Qgc2NvcGUgPSBzZXJpYWxpemVTY29wZShkYXRhWzBdKTtcbiAgICBjb25zdCBibiA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICAvLyBQYXVzZWQ6ICBbc2NvcGUsIGJ5LCByZWFzb25faGFzaF1cbiAgICAvLyBSZXN1bWVkOiBbc2NvcGUsIHJlYXNvbl9oYXNoXVxuICAgIC8vIENhbmNlbGxlZDogW3Njb3BlLCByZWFzb25faGFzaF1cbiAgICBsZXQgdXBkYXRlZEJ5O1xuICAgIGxldCByZWFzb25IYXNoO1xuICAgIGlmIChzdGF0dXMgPT09IFwiUGF1c2VkXCIpIHtcbiAgICAgICAgdXBkYXRlZEJ5ID0gZGF0YVsxXS50b1N0cmluZygpO1xuICAgICAgICByZWFzb25IYXNoID0gb3B0SGV4KGRhdGFbMl0udG9KU09OKCkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmVhc29uSGFzaCA9IG9wdEhleChkYXRhWzFdLnRvSlNPTigpKTtcbiAgICB9XG4gICAgY29uc3QgaWQgPSAoMCwgdXRpbHNfMS5lbWVyZ2VuY3lTdGF0dXNFbnRpdHlJZCkoc2NvcGUpO1xuICAgIGxldCBlcyA9IGF3YWl0IEVtZXJnZW5jeVN0YXR1c18xLkVtZXJnZW5jeVN0YXR1cy5nZXQoaWQpO1xuICAgIGlmICghZXMpIHtcbiAgICAgICAgZXMgPSBFbWVyZ2VuY3lTdGF0dXNfMS5FbWVyZ2VuY3lTdGF0dXMuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgICAgIHNjb3BlLFxuICAgICAgICAgICAgc3RhdHVzLFxuICAgICAgICAgICAgcmVhc29uSGFzaCxcbiAgICAgICAgICAgIHVwZGF0ZWRCeSxcbiAgICAgICAgICAgIHVwZGF0ZWRBdEJsb2NrOiBibixcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBlcy5zdGF0dXMgPSBzdGF0dXM7XG4gICAgICAgIGVzLnJlYXNvbkhhc2ggPSByZWFzb25IYXNoO1xuICAgICAgICBlcy51cGRhdGVkQnkgPSB1cGRhdGVkQnk7XG4gICAgICAgIGVzLnVwZGF0ZWRBdEJsb2NrID0gYm47XG4gICAgfVxuICAgIGF3YWl0IGVzLnNhdmUoKTtcbn1cbi8vIOKUgOKUgOKUgCBIYW5kbGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUVtZXJnZW5jeVBhdXNlZChldmVudCkge1xuICAgIGF3YWl0IHVwc2VydEVtZXJnZW5jeVN0YXR1cyhldmVudCwgXCJQYXVzZWRcIik7XG59XG5leHBvcnRzLmhhbmRsZUVtZXJnZW5jeVBhdXNlZCA9IGhhbmRsZUVtZXJnZW5jeVBhdXNlZDtcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUVtZXJnZW5jeVJlc3VtZWQoZXZlbnQpIHtcbiAgICBhd2FpdCB1cHNlcnRFbWVyZ2VuY3lTdGF0dXMoZXZlbnQsIFwiQWN0aXZlXCIpO1xufVxuZXhwb3J0cy5oYW5kbGVFbWVyZ2VuY3lSZXN1bWVkID0gaGFuZGxlRW1lcmdlbmN5UmVzdW1lZDtcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUVtZXJnZW5jeUNhbmNlbGxlZChldmVudCkge1xuICAgIGF3YWl0IHVwc2VydEVtZXJnZW5jeVN0YXR1cyhldmVudCwgXCJDYW5jZWxsZWRcIik7XG59XG5leHBvcnRzLmhhbmRsZUVtZXJnZW5jeUNhbmNlbGxlZCA9IGhhbmRsZUVtZXJnZW5jeUNhbmNlbGxlZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBNYXBwaW5nIGhhbmRsZXJzIGZvciBwYWxsZXRfaWRlbnRpdHlfY29yZSBldmVudHMuXG4gKlxuICogRXZlbnRzIGhhbmRsZWQ6XG4gKiAgIElkZW50aXR5UmVnaXN0ZXJlZCwgT3duZXJLZXlSb3RhdGVkLCBSZWNvdmVyeUtleVNldCxcbiAqICAgSWRlbnRpdHlLZXlBZGRlZCwgSWRlbnRpdHlLZXlSZXZva2VkLFxuICogICBBY3RpdmVQcm9maWxlU2V0LCBBY3RpdmVBZ2VudFJlZ2lzdHJ5U2V0LCBBY3RpdmVBdXRoUmVnaXN0cnlTZXQsIEFjdGl2ZVJlbGF0aW9uUG9saWN5U2V0LFxuICogICBUcmFuc3BvcnRCb3VuZCwgVHJhbnNwb3J0VmVyaWZpZWQsIFRyYW5zcG9ydFJldm9rZWQsXG4gKiAgIElkZW50aXR5RnJvemVuLCBJZGVudGl0eVVuZnJvemVuLCBJZGVudGl0eURpc2FibGVkXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaGFuZGxlSWRlbnRpdHlEaXNhYmxlZCA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlVbmZyb3plbiA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlGcm96ZW4gPSBleHBvcnRzLmhhbmRsZVRyYW5zcG9ydFJldm9rZWQgPSBleHBvcnRzLmhhbmRsZVRyYW5zcG9ydFZlcmlmaWVkID0gZXhwb3J0cy5oYW5kbGVUcmFuc3BvcnRCb3VuZCA9IGV4cG9ydHMuaGFuZGxlQWN0aXZlUmVsYXRpb25Qb2xpY3lTZXQgPSBleHBvcnRzLmhhbmRsZUFjdGl2ZUF1dGhSZWdpc3RyeVNldCA9IGV4cG9ydHMuaGFuZGxlQWN0aXZlQWdlbnRSZWdpc3RyeVNldCA9IGV4cG9ydHMuaGFuZGxlQWN0aXZlUHJvZmlsZVNldCA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlLZXlSZXZva2VkID0gZXhwb3J0cy5oYW5kbGVJZGVudGl0eUtleUFkZGVkID0gZXhwb3J0cy5oYW5kbGVSZWNvdmVyeUtleVNldCA9IGV4cG9ydHMuaGFuZGxlT3duZXJLZXlSb3RhdGVkID0gZXhwb3J0cy5oYW5kbGVJZGVudGl0eVJlZ2lzdGVyZWQgPSB2b2lkIDA7XG5jb25zdCBDaGFpbklkZW50aXR5XzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvbW9kZWxzL0NoYWluSWRlbnRpdHlcIik7XG5jb25zdCBJZGVudGl0eUtleV8xID0gcmVxdWlyZShcIi4uL3R5cGVzL21vZGVscy9JZGVudGl0eUtleVwiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbi8vIOKUgOKUgOKUgCBoZWxwZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuZnVuY3Rpb24gc3RyKHYpIHtcbiAgICByZXR1cm4gdi50b1N0cmluZygpO1xufVxuZnVuY3Rpb24gYmxvY2tOdW0oYmxvY2spIHtcbiAgICByZXR1cm4gQmlnSW50KGJsb2NrLmJsb2NrLmhlYWRlci5udW1iZXIudG9TdHJpbmcoKSk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRJZGVudGl0eShpZGVudGl0eUlkKSB7XG4gICAgcmV0dXJuIENoYWluSWRlbnRpdHlfMS5DaGFpbklkZW50aXR5LmdldCgoMCwgdXRpbHNfMS5pZGVudGl0eUVudGl0eUlkKShpZGVudGl0eUlkKSk7XG59XG4vKiogU2VyaWFsaXplIGFuIE9wdGlvbjxDb250ZW50UmVmPiB2YWx1ZSBmcm9tIHN0b3JhZ2UgcXVlcnkgSlNPTiB0byBhIHN0cmluZyBvciB1bmRlZmluZWQuICovXG5mdW5jdGlvbiBzZXJpYWxpemVDb250ZW50UmVmKHJhdykge1xuICAgIGlmIChyYXcgPT09IG51bGwgfHwgcmF3ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgaWYgKHR5cGVvZiByYXcgPT09IFwic3RyaW5nXCIpXG4gICAgICAgIHJldHVybiByYXc7XG4gICAgLy8gQ29udGVudFJlZiBlbmNvZGVzIGFzIHsgY2lkOiBzdHJpbmcgfSBvciB7IHVyaTogc3RyaW5nIH0gZGVwZW5kaW5nIG9uIHZhcmlhbnRcbiAgICBjb25zdCBvYmogPSByYXc7XG4gICAgaWYgKG9ialtcImNpZFwiXSlcbiAgICAgICAgcmV0dXJuIFN0cmluZyhvYmpbXCJjaWRcIl0pO1xuICAgIGlmIChvYmpbXCJ1cmlcIl0pXG4gICAgICAgIHJldHVybiBTdHJpbmcob2JqW1widXJpXCJdKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocmF3KTtcbn1cbi8vIOKUgOKUgOKUgCBJZGVudGl0eVJlZ2lzdGVyZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVJZGVudGl0eVJlZ2lzdGVyZWQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3Qgb3duZXIgPSBzdHIoZGF0YVsxXSk7XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgY29uc3QgaWQgPSAoMCwgdXRpbHNfMS5pZGVudGl0eUVudGl0eUlkKShpZGVudGl0eUlkKTtcbiAgICBjb25zdCBpZGVudGl0eSA9IENoYWluSWRlbnRpdHlfMS5DaGFpbklkZW50aXR5LmNyZWF0ZSh7XG4gICAgICAgIGlkLFxuICAgICAgICBjaGFpbklkOiB1dGlsc18xLkNIQUlOX0lELFxuICAgICAgICBpZGVudGl0eUlkLFxuICAgICAgICBvd25lcixcbiAgICAgICAgc3RhdHVzOiBcIkFjdGl2ZVwiLFxuICAgICAgICBjcmVhdGVkQXRCbG9jazogYm4sXG4gICAgICAgIHVwZGF0ZWRBdEJsb2NrOiBibixcbiAgICB9KTtcbiAgICBhd2FpdCBpZGVudGl0eS5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZUlkZW50aXR5UmVnaXN0ZXJlZCA9IGhhbmRsZUlkZW50aXR5UmVnaXN0ZXJlZDtcbi8vIOKUgOKUgOKUgCBPd25lcktleVJvdGF0ZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVPd25lcktleVJvdGF0ZWQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgLy8gZGF0YVsxXSA9IG9sZF9vd25lciAoaWdub3JlZCksIGRhdGFbMl0gPSBuZXdfb3duZXJcbiAgICBjb25zdCBuZXdPd25lciA9IHN0cihkYXRhWzJdKTtcbiAgICBjb25zdCBibiA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IGdldElkZW50aXR5KGlkZW50aXR5SWQpO1xuICAgIGlmICghaWRlbnRpdHkpXG4gICAgICAgIHJldHVybjtcbiAgICBpZGVudGl0eS5vd25lciA9IG5ld093bmVyO1xuICAgIGlkZW50aXR5LnVwZGF0ZWRBdEJsb2NrID0gYm47XG4gICAgYXdhaXQgaWRlbnRpdHkuc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVPd25lcktleVJvdGF0ZWQgPSBoYW5kbGVPd25lcktleVJvdGF0ZWQ7XG4vLyDilIDilIDilIAgUmVjb3ZlcnlLZXlTZXQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVSZWNvdmVyeUtleVNldChldmVudCkge1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3QgaWRlbnRpdHlJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBibiA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IGdldElkZW50aXR5KGlkZW50aXR5SWQpO1xuICAgIGlmICghaWRlbnRpdHkpXG4gICAgICAgIHJldHVybjtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJuO1xuICAgIGF3YWl0IGlkZW50aXR5LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlUmVjb3ZlcnlLZXlTZXQgPSBoYW5kbGVSZWNvdmVyeUtleVNldDtcbi8vIOKUgOKUgOKUgCBJZGVudGl0eUtleUFkZGVkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSWRlbnRpdHlLZXlBZGRlZChldmVudCkge1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3QgaWRlbnRpdHlJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBrZXlJZCA9IHN0cihkYXRhWzFdKTtcbiAgICBjb25zdCBwdXJwb3NlUmF3ID0gZGF0YVsyXTtcbiAgICBjb25zdCBibiA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICAvLyBwdXJwb3NlIGlzIEtleVB1cnBvc2UgZW51bTsgc2VyaWFsaXplIHRvIHN0cmluZ1xuICAgIGNvbnN0IHB1cnBvc2VKc29uID0gcHVycG9zZVJhdy50b0pTT04oKTtcbiAgICBjb25zdCBwdXJwb3NlID0gdHlwZW9mIHB1cnBvc2VKc29uID09PSBcInN0cmluZ1wiXG4gICAgICAgID8gcHVycG9zZUpzb25cbiAgICAgICAgOiBKU09OLnN0cmluZ2lmeShwdXJwb3NlSnNvbik7XG4gICAgLy8gVGhlIGF1dGhvcml6ZWQga2V5IGFjY291bnQgaXMgbm90IGluIHRoZSBldmVudDsgc3RvcmUga2V5SWQgYW5kIGlkZW50aXR5SWQgZm9yIGxvb2t1cFxuICAgIGNvbnN0IGtleSA9IElkZW50aXR5S2V5XzEuSWRlbnRpdHlLZXkuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICgwLCB1dGlsc18xLmlkZW50aXR5S2V5RW50aXR5SWQpKGtleUlkKSxcbiAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgaWRlbnRpdHlJZCxcbiAgICAgICAga2V5SWQsXG4gICAgICAgIGFjY291bnQ6IFwiXCIsIC8vIGZpbGxlZCBiZWxvdyB2aWEgc3RvcmFnZSBxdWVyeVxuICAgICAgICBwdXJwb3NlLFxuICAgICAgICBzdGF0dXM6IFwiQWN0aXZlXCIsXG4gICAgICAgIHVwZGF0ZWRBdEJsb2NrOiBibixcbiAgICB9KTtcbiAgICAvLyBRdWVyeSBzdG9yYWdlIHRvIGdldCB0aGUgYWNjb3VudFxuICAgIHRyeSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IGFwaS5xdWVyeS5pZGVudGl0eUNvcmUuYXV0aG9yaXplZEtleXMoa2V5SWQpO1xuICAgICAgICBjb25zdCByZWNvcmRKc29uID0gcmVjb3JkLnRvSlNPTigpO1xuICAgICAgICBpZiAocmVjb3JkSnNvbiAmJiByZWNvcmRKc29uW1wiYWNjb3VudFwiXSkge1xuICAgICAgICAgICAga2V5LmFjY291bnQgPSBTdHJpbmcocmVjb3JkSnNvbltcImFjY291bnRcIl0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChfKSB7XG4gICAgICAgIC8vIHN0b3JhZ2UgcXVlcnkgZmFpbGVkOyBhY2NvdW50IHJlbWFpbnMgZW1wdHlcbiAgICB9XG4gICAgYXdhaXQga2V5LnNhdmUoKTtcbiAgICAvLyB1cGRhdGUgaWRlbnRpdHkgbm9uY2UgLyB1cGRhdGVkQXRCbG9ja1xuICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgZ2V0SWRlbnRpdHkoaWRlbnRpdHlJZCk7XG4gICAgaWYgKGlkZW50aXR5KSB7XG4gICAgICAgIGlkZW50aXR5LnVwZGF0ZWRBdEJsb2NrID0gYm47XG4gICAgICAgIGF3YWl0IGlkZW50aXR5LnNhdmUoKTtcbiAgICB9XG59XG5leHBvcnRzLmhhbmRsZUlkZW50aXR5S2V5QWRkZWQgPSBoYW5kbGVJZGVudGl0eUtleUFkZGVkO1xuLy8g4pSA4pSA4pSAIElkZW50aXR5S2V5UmV2b2tlZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUlkZW50aXR5S2V5UmV2b2tlZChldmVudCkge1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3Qga2V5SWQgPSBzdHIoZGF0YVsxXSk7XG4gICAgY29uc3QgaWRlbnRpdHlJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBibiA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBjb25zdCBrZXkgPSBhd2FpdCBJZGVudGl0eUtleV8xLklkZW50aXR5S2V5LmdldCgoMCwgdXRpbHNfMS5pZGVudGl0eUtleUVudGl0eUlkKShrZXlJZCkpO1xuICAgIGlmIChrZXkpIHtcbiAgICAgICAga2V5LnN0YXR1cyA9IFwiUmV2b2tlZFwiO1xuICAgICAgICBrZXkudXBkYXRlZEF0QmxvY2sgPSBibjtcbiAgICAgICAgYXdhaXQga2V5LnNhdmUoKTtcbiAgICB9XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoaWRlbnRpdHkpIHtcbiAgICAgICAgaWRlbnRpdHkudXBkYXRlZEF0QmxvY2sgPSBibjtcbiAgICAgICAgYXdhaXQgaWRlbnRpdHkuc2F2ZSgpO1xuICAgIH1cbn1cbmV4cG9ydHMuaGFuZGxlSWRlbnRpdHlLZXlSZXZva2VkID0gaGFuZGxlSWRlbnRpdHlLZXlSZXZva2VkO1xuLy8g4pSA4pSA4pSAIHBvaW50ZXItc2V0IGhlbHBlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBmZXRjaElkZW50aXR5UG9pbnRlcnMoaWRlbnRpdHlJZCkge1xuICAgIHRyeSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IGFwaS5xdWVyeS5pZGVudGl0eUNvcmUuaWRlbnRpdGllcyhpZGVudGl0eUlkKTtcbiAgICAgICAgY29uc3QganNvbiA9IHJlY29yZC50b0pTT04oKTtcbiAgICAgICAgaWYgKCFqc29uKVxuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWN0aXZlUHJvZmlsZTogc2VyaWFsaXplQ29udGVudFJlZihqc29uW1wiYWN0aXZlUHJvZmlsZVwiXSksXG4gICAgICAgICAgICBhY3RpdmVBZ2VudFJlZ2lzdHJ5OiBzZXJpYWxpemVDb250ZW50UmVmKGpzb25bXCJhY3RpdmVBZ2VudFJlZ2lzdHJ5XCJdKSxcbiAgICAgICAgICAgIGFjdGl2ZUF1dGhSZWdpc3RyeTogc2VyaWFsaXplQ29udGVudFJlZihqc29uW1wiYWN0aXZlQXV0aFJlZ2lzdHJ5XCJdKSxcbiAgICAgICAgICAgIGFjdGl2ZVJlbGF0aW9uUG9saWN5OiBzZXJpYWxpemVDb250ZW50UmVmKGpzb25bXCJhY3RpdmVSZWxhdGlvblBvbGljeVwiXSksXG4gICAgICAgIH07XG4gICAgfVxuICAgIGNhdGNoIChfKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG59XG4vLyDilIDilIDilIAgQWN0aXZlUHJvZmlsZVNldCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUFjdGl2ZVByb2ZpbGVTZXQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoIWlkZW50aXR5KVxuICAgICAgICByZXR1cm47XG4gICAgY29uc3QgcHRycyA9IGF3YWl0IGZldGNoSWRlbnRpdHlQb2ludGVycyhpZGVudGl0eUlkKTtcbiAgICBpZGVudGl0eS5hY3RpdmVQcm9maWxlID0gcHRyc1tcImFjdGl2ZVByb2ZpbGVcIl07XG4gICAgaWRlbnRpdHkudXBkYXRlZEF0QmxvY2sgPSBibjtcbiAgICBhd2FpdCBpZGVudGl0eS5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZUFjdGl2ZVByb2ZpbGVTZXQgPSBoYW5kbGVBY3RpdmVQcm9maWxlU2V0O1xuLy8g4pSA4pSA4pSAIEFjdGl2ZUFnZW50UmVnaXN0cnlTZXQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVBY3RpdmVBZ2VudFJlZ2lzdHJ5U2V0KGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGJuID0gYmxvY2tOdW0oYmxvY2spO1xuICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgZ2V0SWRlbnRpdHkoaWRlbnRpdHlJZCk7XG4gICAgaWYgKCFpZGVudGl0eSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IHB0cnMgPSBhd2FpdCBmZXRjaElkZW50aXR5UG9pbnRlcnMoaWRlbnRpdHlJZCk7XG4gICAgaWRlbnRpdHkuYWN0aXZlQWdlbnRSZWdpc3RyeSA9IHB0cnNbXCJhY3RpdmVBZ2VudFJlZ2lzdHJ5XCJdO1xuICAgIGlkZW50aXR5LnVwZGF0ZWRBdEJsb2NrID0gYm47XG4gICAgYXdhaXQgaWRlbnRpdHkuc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVBY3RpdmVBZ2VudFJlZ2lzdHJ5U2V0ID0gaGFuZGxlQWN0aXZlQWdlbnRSZWdpc3RyeVNldDtcbi8vIOKUgOKUgOKUgCBBY3RpdmVBdXRoUmVnaXN0cnlTZXQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVBY3RpdmVBdXRoUmVnaXN0cnlTZXQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoIWlkZW50aXR5KVxuICAgICAgICByZXR1cm47XG4gICAgY29uc3QgcHRycyA9IGF3YWl0IGZldGNoSWRlbnRpdHlQb2ludGVycyhpZGVudGl0eUlkKTtcbiAgICBpZGVudGl0eS5hY3RpdmVBdXRoUmVnaXN0cnkgPSBwdHJzW1wiYWN0aXZlQXV0aFJlZ2lzdHJ5XCJdO1xuICAgIGlkZW50aXR5LnVwZGF0ZWRBdEJsb2NrID0gYm47XG4gICAgYXdhaXQgaWRlbnRpdHkuc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVBY3RpdmVBdXRoUmVnaXN0cnlTZXQgPSBoYW5kbGVBY3RpdmVBdXRoUmVnaXN0cnlTZXQ7XG4vLyDilIDilIDilIAgQWN0aXZlUmVsYXRpb25Qb2xpY3lTZXQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVBY3RpdmVSZWxhdGlvblBvbGljeVNldChldmVudCkge1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3QgaWRlbnRpdHlJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBibiA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IGdldElkZW50aXR5KGlkZW50aXR5SWQpO1xuICAgIGlmICghaWRlbnRpdHkpXG4gICAgICAgIHJldHVybjtcbiAgICBjb25zdCBwdHJzID0gYXdhaXQgZmV0Y2hJZGVudGl0eVBvaW50ZXJzKGlkZW50aXR5SWQpO1xuICAgIGlkZW50aXR5LmFjdGl2ZVJlbGF0aW9uUG9saWN5ID0gcHRyc1tcImFjdGl2ZVJlbGF0aW9uUG9saWN5XCJdO1xuICAgIGlkZW50aXR5LnVwZGF0ZWRBdEJsb2NrID0gYm47XG4gICAgYXdhaXQgaWRlbnRpdHkuc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVBY3RpdmVSZWxhdGlvblBvbGljeVNldCA9IGhhbmRsZUFjdGl2ZVJlbGF0aW9uUG9saWN5U2V0O1xuLy8g4pSA4pSA4pSAIFRyYW5zcG9ydCBldmVudHMgKG5vIHNjaGVtYSBlbnRpdHk7IHVwZGF0ZSBpZGVudGl0eSB0aW1lc3RhbXApIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gdG91Y2hJZGVudGl0eShldmVudCkge1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3QgaWRlbnRpdHlJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IGdldElkZW50aXR5KGlkZW50aXR5SWQpO1xuICAgIGlmICghaWRlbnRpdHkpXG4gICAgICAgIHJldHVybjtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBhd2FpdCBpZGVudGl0eS5zYXZlKCk7XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVUcmFuc3BvcnRCb3VuZChldmVudCkge1xuICAgIGF3YWl0IHRvdWNoSWRlbnRpdHkoZXZlbnQpO1xufVxuZXhwb3J0cy5oYW5kbGVUcmFuc3BvcnRCb3VuZCA9IGhhbmRsZVRyYW5zcG9ydEJvdW5kO1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlVHJhbnNwb3J0VmVyaWZpZWQoZXZlbnQpIHtcbiAgICBhd2FpdCB0b3VjaElkZW50aXR5KGV2ZW50KTtcbn1cbmV4cG9ydHMuaGFuZGxlVHJhbnNwb3J0VmVyaWZpZWQgPSBoYW5kbGVUcmFuc3BvcnRWZXJpZmllZDtcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVRyYW5zcG9ydFJldm9rZWQoZXZlbnQpIHtcbiAgICBhd2FpdCB0b3VjaElkZW50aXR5KGV2ZW50KTtcbn1cbmV4cG9ydHMuaGFuZGxlVHJhbnNwb3J0UmV2b2tlZCA9IGhhbmRsZVRyYW5zcG9ydFJldm9rZWQ7XG4vLyDilIDilIDilIAgSWRlbnRpdHlGcm96ZW4g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVJZGVudGl0eUZyb3plbihldmVudCkge1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3QgaWRlbnRpdHlJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IGdldElkZW50aXR5KGlkZW50aXR5SWQpO1xuICAgIGlmICghaWRlbnRpdHkpXG4gICAgICAgIHJldHVybjtcbiAgICBpZGVudGl0eS5zdGF0dXMgPSBcIkZyb3plblwiO1xuICAgIGlkZW50aXR5LnVwZGF0ZWRBdEJsb2NrID0gYmxvY2tOdW0oYmxvY2spO1xuICAgIGF3YWl0IGlkZW50aXR5LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlSWRlbnRpdHlGcm96ZW4gPSBoYW5kbGVJZGVudGl0eUZyb3plbjtcbi8vIOKUgOKUgOKUgCBJZGVudGl0eVVuZnJvemVuIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSWRlbnRpdHlVbmZyb3plbihldmVudCkge1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3QgaWRlbnRpdHlJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IGdldElkZW50aXR5KGlkZW50aXR5SWQpO1xuICAgIGlmICghaWRlbnRpdHkpXG4gICAgICAgIHJldHVybjtcbiAgICBpZGVudGl0eS5zdGF0dXMgPSBcIkFjdGl2ZVwiO1xuICAgIGlkZW50aXR5LnVwZGF0ZWRBdEJsb2NrID0gYmxvY2tOdW0oYmxvY2spO1xuICAgIGF3YWl0IGlkZW50aXR5LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlSWRlbnRpdHlVbmZyb3plbiA9IGhhbmRsZUlkZW50aXR5VW5mcm96ZW47XG4vLyDilIDilIDilIAgSWRlbnRpdHlEaXNhYmxlZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUlkZW50aXR5RGlzYWJsZWQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoIWlkZW50aXR5KVxuICAgICAgICByZXR1cm47XG4gICAgaWRlbnRpdHkuc3RhdHVzID0gXCJEaXNhYmxlZFwiO1xuICAgIGlkZW50aXR5LnVwZGF0ZWRBdEJsb2NrID0gYmxvY2tOdW0oYmxvY2spO1xuICAgIGF3YWl0IGlkZW50aXR5LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlSWRlbnRpdHlEaXNhYmxlZCA9IGhhbmRsZUlkZW50aXR5RGlzYWJsZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogTWFwcGluZyBoYW5kbGVycyBmb3IgcGFsbGV0X3BheW1lbnRfaW50ZW50IGV2ZW50cy5cbiAqXG4gKiBFdmVudHMgaGFuZGxlZDpcbiAqICAgUGF5bWVudEludGVudENyZWF0ZWQsIFBheW1lbnRJbnRlbnRGdW5kZWQsXG4gKiAgIFBheW1lbnRJbnRlbnRDbGFpbWVkLCBQYXltZW50SW50ZW50UmVmdW5kZWQsXG4gKiAgIFBheW1lbnRJbnRlbnRDYW5jZWxsZWQsIFBheW1lbnRJbnRlbnRFeHBpcmVkXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaGFuZGxlUGF5bWVudEludGVudEV4cGlyZWQgPSBleHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRDYW5jZWxsZWQgPSBleHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRSZWZ1bmRlZCA9IGV4cG9ydHMuaGFuZGxlUGF5bWVudEludGVudENsYWltZWQgPSBleHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRGdW5kZWQgPSBleHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRDcmVhdGVkID0gdm9pZCAwO1xuY29uc3QgUGF5bWVudEludGVudF8xID0gcmVxdWlyZShcIi4uL3R5cGVzL21vZGVscy9QYXltZW50SW50ZW50XCIpO1xuY29uc3QgU2V0dGxlbWVudEV2ZW50XzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvbW9kZWxzL1NldHRsZW1lbnRFdmVudFwiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbi8vIOKUgOKUgOKUgCBoZWxwZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuZnVuY3Rpb24gc3RyKHYpIHtcbiAgICByZXR1cm4gdi50b1N0cmluZygpO1xufVxuZnVuY3Rpb24gYmxvY2tOdW0oYmxvY2spIHtcbiAgICByZXR1cm4gQmlnSW50KGJsb2NrLmJsb2NrLmhlYWRlci5udW1iZXIudG9TdHJpbmcoKSk7XG59XG5hc3luYyBmdW5jdGlvbiBnZXRJbnRlbnQoaW50ZW50SWQpIHtcbiAgICByZXR1cm4gUGF5bWVudEludGVudF8xLlBheW1lbnRJbnRlbnQuZ2V0KCgwLCB1dGlsc18xLnBheW1lbnRJbnRlbnRFbnRpdHlJZCkoaW50ZW50SWQpKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGFwcGVuZFNldHRsZW1lbnRFdmVudChldmVudCwgaW50ZW50SWQsIGV2ZW50VHlwZSkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgY29uc3QgeyBibG9jaywgZXh0cmluc2ljLCBpZHggfSA9IGV2ZW50O1xuICAgIGNvbnN0IGJuID0gYmxvY2tOdW0oYmxvY2spO1xuICAgIGNvbnN0IGV2ZW50SW5kZXggPSBpZHggIT09IG51bGwgJiYgaWR4ICE9PSB2b2lkIDAgPyBpZHggOiAwO1xuICAgIGNvbnN0IGlkID0gKDAsIHV0aWxzXzEuc2V0dGxlbWVudEV2ZW50RW50aXR5SWQpKGludGVudElkLCBibiwgZXZlbnRJbmRleCk7XG4gICAgY29uc3Qgc2UgPSBTZXR0bGVtZW50RXZlbnRfMS5TZXR0bGVtZW50RXZlbnQuY3JlYXRlKHtcbiAgICAgICAgaWQsXG4gICAgICAgIGNoYWluSWQ6IHV0aWxzXzEuQ0hBSU5fSUQsXG4gICAgICAgIGludGVudElkLFxuICAgICAgICBldmVudFR5cGUsXG4gICAgICAgIGJsb2NrTnVtYmVyOiBibixcbiAgICAgICAgZXh0cmluc2ljSW5kZXg6IGV4dHJpbnNpYyA/IChfYSA9IGV4dHJpbnNpYy5pZHgpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHVuZGVmaW5lZCA6IHVuZGVmaW5lZCxcbiAgICAgICAgZXZlbnRJbmRleCxcbiAgICAgICAgYmxvY2tIYXNoOiBibG9jay5ibG9jay5oZWFkZXIuaGFzaC50b0hleCgpLFxuICAgICAgICB0aW1lc3RhbXA6IChfYiA9IGJsb2NrLnRpbWVzdGFtcCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICAgIGF3YWl0IHNlLnNhdmUoKTtcbn1cbi8vIOKUgOKUgOKUgCBQYXltZW50SW50ZW50Q3JlYXRlZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVBheW1lbnRJbnRlbnRDcmVhdGVkKGV2ZW50KSB7XG4gICAgLy8gZGF0YTogaW50ZW50X2lkKDApLCBwYXllcigxKSwgcGF5ZWUoMiksIGFzc2V0X2lkKDMpLCBhbW91bnQoNCksIGFjdGlvbig1KVxuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3QgaW50ZW50SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgcGF5ZXJJZGVudGl0eUlkID0gc3RyKGRhdGFbMV0pO1xuICAgIGNvbnN0IHBheWVlSWRlbnRpdHlJZCA9IHN0cihkYXRhWzJdKTtcbiAgICAvLyBkYXRhWzNdID0gYXNzZXRfaWQgKGlnbm9yZWQgaW4gc2NoZW1hKVxuICAgIGNvbnN0IGFtb3VudCA9IEJpZ0ludChzdHIoZGF0YVs0XSkpO1xuICAgIGNvbnN0IGFjdGlvblJhdyA9IGRhdGFbNV0udG9KU09OKCk7XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgLy8gRXh0cmFjdCBuYW1lc3BhY2UgKEJvdW5kZWRWZWM8dTg+IHNlcmlhbGl6ZWQgYXMgaGV4IG9yIGFycmF5KSBhbmQgYWN0aW9uQ29kZVxuICAgIGxldCBhY3Rpb25OYW1lc3BhY2U7XG4gICAgbGV0IGFjdGlvbklkO1xuICAgIGlmIChhY3Rpb25SYXcpIHtcbiAgICAgICAgY29uc3QgbnMgPSBhY3Rpb25SYXdbXCJuYW1lc3BhY2VcIl07XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KG5zKSkge1xuICAgICAgICAgICAgYWN0aW9uTmFtZXNwYWNlID0gQnVmZmVyLmZyb20obnMpLnRvU3RyaW5nKFwidXRmOFwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgbnMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGFjdGlvbk5hbWVzcGFjZSA9IG5zLnN0YXJ0c1dpdGgoXCIweFwiKVxuICAgICAgICAgICAgICAgID8gQnVmZmVyLmZyb20obnMuc2xpY2UoMiksIFwiaGV4XCIpLnRvU3RyaW5nKFwidXRmOFwiKVxuICAgICAgICAgICAgICAgIDogbnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFjdGlvblJhd1tcImFjdGlvbkNvZGVcIl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYWN0aW9uSWQgPSBTdHJpbmcoYWN0aW9uUmF3W1wiYWN0aW9uQ29kZVwiXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgaW50ZW50ID0gUGF5bWVudEludGVudF8xLlBheW1lbnRJbnRlbnQuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICgwLCB1dGlsc18xLnBheW1lbnRJbnRlbnRFbnRpdHlJZCkoaW50ZW50SWQpLFxuICAgICAgICBjaGFpbklkOiB1dGlsc18xLkNIQUlOX0lELFxuICAgICAgICBpbnRlbnRJZCxcbiAgICAgICAgcGF5ZXJJZGVudGl0eUlkLFxuICAgICAgICBwYXllZUlkZW50aXR5SWQsXG4gICAgICAgIGFtb3VudCxcbiAgICAgICAgc2V0dGxlbWVudE1vZGU6IFwiVW5rbm93blwiLFxuICAgICAgICBhY3Rpb25OYW1lc3BhY2UsXG4gICAgICAgIGFjdGlvbklkLFxuICAgICAgICBzdGF0dXM6IFwiQ3JlYXRlZFwiLFxuICAgICAgICBjcmVhdGVkQXRCbG9jazogYm4sXG4gICAgICAgIHVwZGF0ZWRBdEJsb2NrOiBibixcbiAgICB9KTtcbiAgICBhd2FpdCBpbnRlbnQuc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50Q3JlYXRlZCA9IGhhbmRsZVBheW1lbnRJbnRlbnRDcmVhdGVkO1xuLy8g4pSA4pSA4pSAIFBheW1lbnRJbnRlbnRGdW5kZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVQYXltZW50SW50ZW50RnVuZGVkKGV2ZW50KSB7XG4gICAgLy8gZGF0YTogaW50ZW50X2lkKDApLCBzZXR0bGVtZW50X21vZGUoMSlcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGludGVudElkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IHNldHRsZW1lbnRNb2RlSnNvbiA9IGRhdGFbMV0udG9KU09OKCk7XG4gICAgY29uc3Qgc2V0dGxlbWVudE1vZGUgPSB0eXBlb2Ygc2V0dGxlbWVudE1vZGVKc29uID09PSBcInN0cmluZ1wiXG4gICAgICAgID8gc2V0dGxlbWVudE1vZGVKc29uXG4gICAgICAgIDogSlNPTi5zdHJpbmdpZnkoc2V0dGxlbWVudE1vZGVKc29uKTtcbiAgICBjb25zdCBpbnRlbnQgPSBhd2FpdCBnZXRJbnRlbnQoaW50ZW50SWQpO1xuICAgIGlmICghaW50ZW50KVxuICAgICAgICByZXR1cm47XG4gICAgaW50ZW50LnNldHRsZW1lbnRNb2RlID0gc2V0dGxlbWVudE1vZGU7XG4gICAgaW50ZW50LnN0YXR1cyA9IFwiRnVuZGVkXCI7XG4gICAgaW50ZW50LnVwZGF0ZWRBdEJsb2NrID0gYmxvY2tOdW0oYmxvY2spO1xuICAgIGF3YWl0IGludGVudC5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRGdW5kZWQgPSBoYW5kbGVQYXltZW50SW50ZW50RnVuZGVkO1xuLy8g4pSA4pSA4pSAIFBheW1lbnRJbnRlbnRDbGFpbWVkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUGF5bWVudEludGVudENsYWltZWQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGludGVudElkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGludGVudCA9IGF3YWl0IGdldEludGVudChpbnRlbnRJZCk7XG4gICAgaWYgKGludGVudCkge1xuICAgICAgICBpbnRlbnQuc3RhdHVzID0gXCJDbGFpbWVkXCI7XG4gICAgICAgIGludGVudC51cGRhdGVkQXRCbG9jayA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICAgICAgYXdhaXQgaW50ZW50LnNhdmUoKTtcbiAgICB9XG4gICAgYXdhaXQgYXBwZW5kU2V0dGxlbWVudEV2ZW50KGV2ZW50LCBpbnRlbnRJZCwgXCJDbGFpbWVkXCIpO1xufVxuZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50Q2xhaW1lZCA9IGhhbmRsZVBheW1lbnRJbnRlbnRDbGFpbWVkO1xuLy8g4pSA4pSA4pSAIFBheW1lbnRJbnRlbnRSZWZ1bmRlZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVBheW1lbnRJbnRlbnRSZWZ1bmRlZChldmVudCkge1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3QgaW50ZW50SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgaW50ZW50ID0gYXdhaXQgZ2V0SW50ZW50KGludGVudElkKTtcbiAgICBpZiAoaW50ZW50KSB7XG4gICAgICAgIGludGVudC5zdGF0dXMgPSBcIlJlZnVuZGVkXCI7XG4gICAgICAgIGludGVudC51cGRhdGVkQXRCbG9jayA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICAgICAgYXdhaXQgaW50ZW50LnNhdmUoKTtcbiAgICB9XG4gICAgYXdhaXQgYXBwZW5kU2V0dGxlbWVudEV2ZW50KGV2ZW50LCBpbnRlbnRJZCwgXCJSZWZ1bmRlZFwiKTtcbn1cbmV4cG9ydHMuaGFuZGxlUGF5bWVudEludGVudFJlZnVuZGVkID0gaGFuZGxlUGF5bWVudEludGVudFJlZnVuZGVkO1xuLy8g4pSA4pSA4pSAIFBheW1lbnRJbnRlbnRDYW5jZWxsZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVQYXltZW50SW50ZW50Q2FuY2VsbGVkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpbnRlbnRJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBpbnRlbnQgPSBhd2FpdCBnZXRJbnRlbnQoaW50ZW50SWQpO1xuICAgIGlmIChpbnRlbnQpIHtcbiAgICAgICAgaW50ZW50LnN0YXR1cyA9IFwiQ2FuY2VsbGVkXCI7XG4gICAgICAgIGludGVudC51cGRhdGVkQXRCbG9jayA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICAgICAgYXdhaXQgaW50ZW50LnNhdmUoKTtcbiAgICB9XG4gICAgYXdhaXQgYXBwZW5kU2V0dGxlbWVudEV2ZW50KGV2ZW50LCBpbnRlbnRJZCwgXCJDYW5jZWxsZWRcIik7XG59XG5leHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRDYW5jZWxsZWQgPSBoYW5kbGVQYXltZW50SW50ZW50Q2FuY2VsbGVkO1xuLy8g4pSA4pSA4pSAIFBheW1lbnRJbnRlbnRFeHBpcmVkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUGF5bWVudEludGVudEV4cGlyZWQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGludGVudElkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGludGVudCA9IGF3YWl0IGdldEludGVudChpbnRlbnRJZCk7XG4gICAgaWYgKGludGVudCkge1xuICAgICAgICBpbnRlbnQuc3RhdHVzID0gXCJFeHBpcmVkXCI7XG4gICAgICAgIGludGVudC51cGRhdGVkQXRCbG9jayA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICAgICAgYXdhaXQgaW50ZW50LnNhdmUoKTtcbiAgICB9XG4gICAgYXdhaXQgYXBwZW5kU2V0dGxlbWVudEV2ZW50KGV2ZW50LCBpbnRlbnRJZCwgXCJFeHBpcmVkXCIpO1xufVxuZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50RXhwaXJlZCA9IGhhbmRsZVBheW1lbnRJbnRlbnRFeHBpcmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIFNoYXJlZCBoZWxwZXJzIGZvciBtYXBwaW5nIGhhbmRsZXJzLlxuICovXG52YXIgX2E7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmVtZXJnZW5jeVN0YXR1c0VudGl0eUlkID0gZXhwb3J0cy5hZ2VudFN0YWtlRXZlbnRFbnRpdHlJZCA9IGV4cG9ydHMuYWdlbnRTdGFrZUxlZGdlckVudGl0eUlkID0gZXhwb3J0cy5zZXR0bGVtZW50RXZlbnRFbnRpdHlJZCA9IGV4cG9ydHMucGF5bWVudEludGVudEVudGl0eUlkID0gZXhwb3J0cy5pZGVudGl0eUtleUVudGl0eUlkID0gZXhwb3J0cy5pZGVudGl0eUVudGl0eUlkID0gZXhwb3J0cy5DSEFJTl9JRCA9IHZvaWQgMDtcbmV4cG9ydHMuQ0hBSU5fSUQgPSAoX2EgPSBwcm9jZXNzLmVudltcIkNIQUlOX0lEXCJdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBcInN1YnN0cmF0ZTp2aWJseS1zb2xvXCI7XG5mdW5jdGlvbiBpZGVudGl0eUVudGl0eUlkKGlkZW50aXR5SWQpIHtcbiAgICByZXR1cm4gYCR7ZXhwb3J0cy5DSEFJTl9JRH06JHtpZGVudGl0eUlkfWA7XG59XG5leHBvcnRzLmlkZW50aXR5RW50aXR5SWQgPSBpZGVudGl0eUVudGl0eUlkO1xuZnVuY3Rpb24gaWRlbnRpdHlLZXlFbnRpdHlJZChrZXlJZCkge1xuICAgIHJldHVybiBgJHtleHBvcnRzLkNIQUlOX0lEfToke2tleUlkfWA7XG59XG5leHBvcnRzLmlkZW50aXR5S2V5RW50aXR5SWQgPSBpZGVudGl0eUtleUVudGl0eUlkO1xuZnVuY3Rpb24gcGF5bWVudEludGVudEVudGl0eUlkKGludGVudElkKSB7XG4gICAgcmV0dXJuIGAke2V4cG9ydHMuQ0hBSU5fSUR9OiR7aW50ZW50SWR9YDtcbn1cbmV4cG9ydHMucGF5bWVudEludGVudEVudGl0eUlkID0gcGF5bWVudEludGVudEVudGl0eUlkO1xuZnVuY3Rpb24gc2V0dGxlbWVudEV2ZW50RW50aXR5SWQoaW50ZW50SWQsIGJsb2NrTnVtYmVyLCBldmVudEluZGV4KSB7XG4gICAgcmV0dXJuIGAke2V4cG9ydHMuQ0hBSU5fSUR9OiR7aW50ZW50SWR9OiR7YmxvY2tOdW1iZXJ9OiR7ZXZlbnRJbmRleH1gO1xufVxuZXhwb3J0cy5zZXR0bGVtZW50RXZlbnRFbnRpdHlJZCA9IHNldHRsZW1lbnRFdmVudEVudGl0eUlkO1xuZnVuY3Rpb24gYWdlbnRTdGFrZUxlZGdlckVudGl0eUlkKGlkZW50aXR5SWQsIGFnZW50SWQpIHtcbiAgICByZXR1cm4gYCR7ZXhwb3J0cy5DSEFJTl9JRH06JHtpZGVudGl0eUlkfToke2FnZW50SWR9YDtcbn1cbmV4cG9ydHMuYWdlbnRTdGFrZUxlZGdlckVudGl0eUlkID0gYWdlbnRTdGFrZUxlZGdlckVudGl0eUlkO1xuZnVuY3Rpb24gYWdlbnRTdGFrZUV2ZW50RW50aXR5SWQoaWRlbnRpdHlJZCwgYWdlbnRJZCwgYmxvY2tOdW1iZXIsIGV2ZW50SW5kZXgpIHtcbiAgICByZXR1cm4gYCR7ZXhwb3J0cy5DSEFJTl9JRH06JHtpZGVudGl0eUlkfToke2FnZW50SWR9OiR7YmxvY2tOdW1iZXJ9OiR7ZXZlbnRJbmRleH1gO1xufVxuZXhwb3J0cy5hZ2VudFN0YWtlRXZlbnRFbnRpdHlJZCA9IGFnZW50U3Rha2VFdmVudEVudGl0eUlkO1xuZnVuY3Rpb24gZW1lcmdlbmN5U3RhdHVzRW50aXR5SWQoc2NvcGUpIHtcbiAgICByZXR1cm4gYCR7ZXhwb3J0cy5DSEFJTl9JRH06JHtzY29wZX1gO1xufVxuZXhwb3J0cy5lbWVyZ2VuY3lTdGF0dXNFbnRpdHlJZCA9IGVtZXJnZW5jeVN0YXR1c0VudGl0eUlkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFnZW50U3Rha2VFdmVudCA9IHZvaWQgMDtcbmNvbnN0IHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG5jb25zdCBhc3NlcnRfMSA9IHRzbGliXzEuX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJhc3NlcnRcIikpO1xuY2xhc3MgQWdlbnRTdGFrZUV2ZW50IHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgaWRlbnRpdHlJZCwgYWdlbnRJZCwgZXZlbnRUeXBlLCBibG9ja051bWJlciwgZXZlbnRJbmRleCwgYmxvY2tIYXNoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jaGFpbklkID0gY2hhaW5JZDtcbiAgICAgICAgdGhpcy5pZGVudGl0eUlkID0gaWRlbnRpdHlJZDtcbiAgICAgICAgdGhpcy5hZ2VudElkID0gYWdlbnRJZDtcbiAgICAgICAgdGhpcy5ldmVudFR5cGUgPSBldmVudFR5cGU7XG4gICAgICAgIHRoaXMuYmxvY2tOdW1iZXIgPSBibG9ja051bWJlcjtcbiAgICAgICAgdGhpcy5ldmVudEluZGV4ID0gZXZlbnRJbmRleDtcbiAgICAgICAgdGhpcy5ibG9ja0hhc2ggPSBibG9ja0hhc2g7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdBZ2VudFN0YWtlRXZlbnQnO1xuICAgIH1cbiAgICBhc3luYyBzYXZlKCkge1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuaWQ7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShpZCAhPT0gbnVsbCwgXCJDYW5ub3Qgc2F2ZSBBZ2VudFN0YWtlRXZlbnQgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNldCgnQWdlbnRTdGFrZUV2ZW50JywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgQWdlbnRTdGFrZUV2ZW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5yZW1vdmUoJ0FnZW50U3Rha2VFdmVudCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgZ2V0KGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSgoaWQgIT09IG51bGwgJiYgaWQgIT09IHVuZGVmaW5lZCksIFwiQ2Fubm90IGdldCBBZ2VudFN0YWtlRXZlbnQgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnQWdlbnRTdGFrZUV2ZW50JywgaWQudG9TdHJpbmcoKSk7XG4gICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZShyZWNvcmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgZW50aXRpZXMgbWF0Y2hpbmcgdGhlIHNwZWNpZmllZCBmaWx0ZXJzIGFuZCBvcHRpb25zLlxuICAgICAqXG4gICAgICog4pqg77iPIFRoaXMgZnVuY3Rpb24gd2lsbCBmaXJzdCBzZWFyY2ggY2FjaGUgZGF0YSBmb2xsb3dlZCBieSBEQiBkYXRhLiBQbGVhc2UgY29uc2lkZXIgdGhpcyB3aGVuIHVzaW5nIG9yZGVyIGFuZCBvZmZzZXQgb3B0aW9ucy7imqDvuI9cbiAgICAgKiAqL1xuICAgIHN0YXRpYyBhc3luYyBnZXRCeUZpZWxkcyhmaWx0ZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkcyA9IGF3YWl0IHN0b3JlLmdldEJ5RmllbGRzKCdBZ2VudFN0YWtlRXZlbnQnLCBmaWx0ZXIsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHRoaXMuY3JlYXRlKHJlY29yZCkpO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKHJlY29yZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkocmVjb3JkLmlkICE9PSB1bmRlZmluZWQgJiYgcmVjb3JkLmlkICE9PSBudWxsLCBcImlkIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IG5ldyB0aGlzKHJlY29yZC5pZCwgcmVjb3JkLmNoYWluSWQsIHJlY29yZC5pZGVudGl0eUlkLCByZWNvcmQuYWdlbnRJZCwgcmVjb3JkLmV2ZW50VHlwZSwgcmVjb3JkLmJsb2NrTnVtYmVyLCByZWNvcmQuZXZlbnRJbmRleCwgcmVjb3JkLmJsb2NrSGFzaCk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZW50aXR5LCByZWNvcmQpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cbn1cbmV4cG9ydHMuQWdlbnRTdGFrZUV2ZW50ID0gQWdlbnRTdGFrZUV2ZW50O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFnZW50U3Rha2VMZWRnZXIgPSB2b2lkIDA7XG5jb25zdCB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xuY29uc3QgYXNzZXJ0XzEgPSB0c2xpYl8xLl9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNsYXNzIEFnZW50U3Rha2VMZWRnZXIge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBjaGFpbklkLCBpZGVudGl0eUlkLCBhZ2VudElkLCBhY3RpdmVBbW91bnQsIHVuYm9uZGluZ0Ftb3VudCwgc3RhdHVzLCByZWxlYXNlQmxvY2tlZCwgdXBkYXRlZEF0QmxvY2spIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNoYWluSWQgPSBjaGFpbklkO1xuICAgICAgICB0aGlzLmlkZW50aXR5SWQgPSBpZGVudGl0eUlkO1xuICAgICAgICB0aGlzLmFnZW50SWQgPSBhZ2VudElkO1xuICAgICAgICB0aGlzLmFjdGl2ZUFtb3VudCA9IGFjdGl2ZUFtb3VudDtcbiAgICAgICAgdGhpcy51bmJvbmRpbmdBbW91bnQgPSB1bmJvbmRpbmdBbW91bnQ7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICB0aGlzLnJlbGVhc2VCbG9ja2VkID0gcmVsZWFzZUJsb2NrZWQ7XG4gICAgICAgIHRoaXMudXBkYXRlZEF0QmxvY2sgPSB1cGRhdGVkQXRCbG9jaztcbiAgICB9XG4gICAgZ2V0IF9uYW1lKCkge1xuICAgICAgICByZXR1cm4gJ0FnZW50U3Rha2VMZWRnZXInO1xuICAgIH1cbiAgICBhc3luYyBzYXZlKCkge1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuaWQ7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShpZCAhPT0gbnVsbCwgXCJDYW5ub3Qgc2F2ZSBBZ2VudFN0YWtlTGVkZ2VyIGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXQoJ0FnZW50U3Rha2VMZWRnZXInLCBpZC50b1N0cmluZygpLCB0aGlzKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIHJlbW92ZShpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHJlbW92ZSBBZ2VudFN0YWtlTGVkZ2VyIGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5yZW1vdmUoJ0FnZW50U3Rha2VMZWRnZXInLCBpZC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIGdldChpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoKGlkICE9PSBudWxsICYmIGlkICE9PSB1bmRlZmluZWQpLCBcIkNhbm5vdCBnZXQgQWdlbnRTdGFrZUxlZGdlciBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgc3RvcmUuZ2V0KCdBZ2VudFN0YWtlTGVkZ2VyJywgaWQudG9TdHJpbmcoKSk7XG4gICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZShyZWNvcmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgZW50aXRpZXMgbWF0Y2hpbmcgdGhlIHNwZWNpZmllZCBmaWx0ZXJzIGFuZCBvcHRpb25zLlxuICAgICAqXG4gICAgICog4pqg77iPIFRoaXMgZnVuY3Rpb24gd2lsbCBmaXJzdCBzZWFyY2ggY2FjaGUgZGF0YSBmb2xsb3dlZCBieSBEQiBkYXRhLiBQbGVhc2UgY29uc2lkZXIgdGhpcyB3aGVuIHVzaW5nIG9yZGVyIGFuZCBvZmZzZXQgb3B0aW9ucy7imqDvuI9cbiAgICAgKiAqL1xuICAgIHN0YXRpYyBhc3luYyBnZXRCeUZpZWxkcyhmaWx0ZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkcyA9IGF3YWl0IHN0b3JlLmdldEJ5RmllbGRzKCdBZ2VudFN0YWtlTGVkZ2VyJywgZmlsdGVyLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB0aGlzLmNyZWF0ZShyZWNvcmQpKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShyZWNvcmQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHJlY29yZC5pZCAhPT0gdW5kZWZpbmVkICYmIHJlY29yZC5pZCAhPT0gbnVsbCwgXCJpZCBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgdGhpcyhyZWNvcmQuaWQsIHJlY29yZC5jaGFpbklkLCByZWNvcmQuaWRlbnRpdHlJZCwgcmVjb3JkLmFnZW50SWQsIHJlY29yZC5hY3RpdmVBbW91bnQsIHJlY29yZC51bmJvbmRpbmdBbW91bnQsIHJlY29yZC5zdGF0dXMsIHJlY29yZC5yZWxlYXNlQmxvY2tlZCwgcmVjb3JkLnVwZGF0ZWRBdEJsb2NrKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHksIHJlY29yZCk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxufVxuZXhwb3J0cy5BZ2VudFN0YWtlTGVkZ2VyID0gQWdlbnRTdGFrZUxlZGdlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5DaGFpbkNoZWNrcG9pbnQgPSB2b2lkIDA7XG5jb25zdCB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xuY29uc3QgYXNzZXJ0XzEgPSB0c2xpYl8xLl9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNsYXNzIENoYWluQ2hlY2twb2ludCB7XG4gICAgY29uc3RydWN0b3IoaWQsIGNoYWluSWQsIGJsb2NrTnVtYmVyLCBibG9ja0hhc2gsIHVwZGF0ZWRBdCkge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuY2hhaW5JZCA9IGNoYWluSWQ7XG4gICAgICAgIHRoaXMuYmxvY2tOdW1iZXIgPSBibG9ja051bWJlcjtcbiAgICAgICAgdGhpcy5ibG9ja0hhc2ggPSBibG9ja0hhc2g7XG4gICAgICAgIHRoaXMudXBkYXRlZEF0ID0gdXBkYXRlZEF0O1xuICAgIH1cbiAgICBnZXQgX25hbWUoKSB7XG4gICAgICAgIHJldHVybiAnQ2hhaW5DaGVja3BvaW50JztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgQ2hhaW5DaGVja3BvaW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXQoJ0NoYWluQ2hlY2twb2ludCcsIGlkLnRvU3RyaW5nKCksIHRoaXMpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgcmVtb3ZlKGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShpZCAhPT0gbnVsbCwgXCJDYW5ub3QgcmVtb3ZlIENoYWluQ2hlY2twb2ludCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdDaGFpbkNoZWNrcG9pbnQnLCBpZC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIGdldChpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoKGlkICE9PSBudWxsICYmIGlkICE9PSB1bmRlZmluZWQpLCBcIkNhbm5vdCBnZXQgQ2hhaW5DaGVja3BvaW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCBzdG9yZS5nZXQoJ0NoYWluQ2hlY2twb2ludCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnQ2hhaW5DaGVja3BvaW50JywgZmlsdGVyLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB0aGlzLmNyZWF0ZShyZWNvcmQpKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShyZWNvcmQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHJlY29yZC5pZCAhPT0gdW5kZWZpbmVkICYmIHJlY29yZC5pZCAhPT0gbnVsbCwgXCJpZCBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgdGhpcyhyZWNvcmQuaWQsIHJlY29yZC5jaGFpbklkLCByZWNvcmQuYmxvY2tOdW1iZXIsIHJlY29yZC5ibG9ja0hhc2gsIHJlY29yZC51cGRhdGVkQXQpO1xuICAgICAgICBPYmplY3QuYXNzaWduKGVudGl0eSwgcmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG59XG5leHBvcnRzLkNoYWluQ2hlY2twb2ludCA9IENoYWluQ2hlY2twb2ludDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5DaGFpbklkZW50aXR5ID0gdm9pZCAwO1xuY29uc3QgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbmNvbnN0IGFzc2VydF8xID0gdHNsaWJfMS5fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImFzc2VydFwiKSk7XG5jbGFzcyBDaGFpbklkZW50aXR5IHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgaWRlbnRpdHlJZCwgb3duZXIsIHN0YXR1cywgY3JlYXRlZEF0QmxvY2ssIHVwZGF0ZWRBdEJsb2NrKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jaGFpbklkID0gY2hhaW5JZDtcbiAgICAgICAgdGhpcy5pZGVudGl0eUlkID0gaWRlbnRpdHlJZDtcbiAgICAgICAgdGhpcy5vd25lciA9IG93bmVyO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgICAgdGhpcy5jcmVhdGVkQXRCbG9jayA9IGNyZWF0ZWRBdEJsb2NrO1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdEJsb2NrID0gdXBkYXRlZEF0QmxvY2s7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdDaGFpbklkZW50aXR5JztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgQ2hhaW5JZGVudGl0eSBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUuc2V0KCdDaGFpbklkZW50aXR5JywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgQ2hhaW5JZGVudGl0eSBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdDaGFpbklkZW50aXR5JywgaWQudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyBnZXQoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKChpZCAhPT0gbnVsbCAmJiBpZCAhPT0gdW5kZWZpbmVkKSwgXCJDYW5ub3QgZ2V0IENoYWluSWRlbnRpdHkgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnQ2hhaW5JZGVudGl0eScsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnQ2hhaW5JZGVudGl0eScsIGZpbHRlciwgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiByZWNvcmRzLm1hcChyZWNvcmQgPT4gdGhpcy5jcmVhdGUocmVjb3JkKSk7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUocmVjb3JkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShyZWNvcmQuaWQgIT09IHVuZGVmaW5lZCAmJiByZWNvcmQuaWQgIT09IG51bGwsIFwiaWQgbXVzdCBiZSBwcm92aWRlZFwiKTtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gbmV3IHRoaXMocmVjb3JkLmlkLCByZWNvcmQuY2hhaW5JZCwgcmVjb3JkLmlkZW50aXR5SWQsIHJlY29yZC5vd25lciwgcmVjb3JkLnN0YXR1cywgcmVjb3JkLmNyZWF0ZWRBdEJsb2NrLCByZWNvcmQudXBkYXRlZEF0QmxvY2spO1xuICAgICAgICBPYmplY3QuYXNzaWduKGVudGl0eSwgcmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG59XG5leHBvcnRzLkNoYWluSWRlbnRpdHkgPSBDaGFpbklkZW50aXR5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkVtZXJnZW5jeVN0YXR1cyA9IHZvaWQgMDtcbmNvbnN0IHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG5jb25zdCBhc3NlcnRfMSA9IHRzbGliXzEuX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJhc3NlcnRcIikpO1xuY2xhc3MgRW1lcmdlbmN5U3RhdHVzIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgc2NvcGUsIHN0YXR1cywgdXBkYXRlZEF0QmxvY2spIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNoYWluSWQgPSBjaGFpbklkO1xuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdEJsb2NrID0gdXBkYXRlZEF0QmxvY2s7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdFbWVyZ2VuY3lTdGF0dXMnO1xuICAgIH1cbiAgICBhc3luYyBzYXZlKCkge1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuaWQ7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShpZCAhPT0gbnVsbCwgXCJDYW5ub3Qgc2F2ZSBFbWVyZ2VuY3lTdGF0dXMgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNldCgnRW1lcmdlbmN5U3RhdHVzJywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgRW1lcmdlbmN5U3RhdHVzIGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5yZW1vdmUoJ0VtZXJnZW5jeVN0YXR1cycsIGlkLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgZ2V0KGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSgoaWQgIT09IG51bGwgJiYgaWQgIT09IHVuZGVmaW5lZCksIFwiQ2Fubm90IGdldCBFbWVyZ2VuY3lTdGF0dXMgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnRW1lcmdlbmN5U3RhdHVzJywgaWQudG9TdHJpbmcoKSk7XG4gICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZShyZWNvcmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgZW50aXRpZXMgbWF0Y2hpbmcgdGhlIHNwZWNpZmllZCBmaWx0ZXJzIGFuZCBvcHRpb25zLlxuICAgICAqXG4gICAgICog4pqg77iPIFRoaXMgZnVuY3Rpb24gd2lsbCBmaXJzdCBzZWFyY2ggY2FjaGUgZGF0YSBmb2xsb3dlZCBieSBEQiBkYXRhLiBQbGVhc2UgY29uc2lkZXIgdGhpcyB3aGVuIHVzaW5nIG9yZGVyIGFuZCBvZmZzZXQgb3B0aW9ucy7imqDvuI9cbiAgICAgKiAqL1xuICAgIHN0YXRpYyBhc3luYyBnZXRCeUZpZWxkcyhmaWx0ZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkcyA9IGF3YWl0IHN0b3JlLmdldEJ5RmllbGRzKCdFbWVyZ2VuY3lTdGF0dXMnLCBmaWx0ZXIsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHRoaXMuY3JlYXRlKHJlY29yZCkpO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKHJlY29yZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkocmVjb3JkLmlkICE9PSB1bmRlZmluZWQgJiYgcmVjb3JkLmlkICE9PSBudWxsLCBcImlkIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IG5ldyB0aGlzKHJlY29yZC5pZCwgcmVjb3JkLmNoYWluSWQsIHJlY29yZC5zY29wZSwgcmVjb3JkLnN0YXR1cywgcmVjb3JkLnVwZGF0ZWRBdEJsb2NrKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHksIHJlY29yZCk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxufVxuZXhwb3J0cy5FbWVyZ2VuY3lTdGF0dXMgPSBFbWVyZ2VuY3lTdGF0dXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuSWRlbnRpdHlLZXkgPSB2b2lkIDA7XG5jb25zdCB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xuY29uc3QgYXNzZXJ0XzEgPSB0c2xpYl8xLl9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNsYXNzIElkZW50aXR5S2V5IHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgaWRlbnRpdHlJZCwga2V5SWQsIGFjY291bnQsIHB1cnBvc2UsIHN0YXR1cywgdXBkYXRlZEF0QmxvY2spIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNoYWluSWQgPSBjaGFpbklkO1xuICAgICAgICB0aGlzLmlkZW50aXR5SWQgPSBpZGVudGl0eUlkO1xuICAgICAgICB0aGlzLmtleUlkID0ga2V5SWQ7XG4gICAgICAgIHRoaXMuYWNjb3VudCA9IGFjY291bnQ7XG4gICAgICAgIHRoaXMucHVycG9zZSA9IHB1cnBvc2U7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdEJsb2NrID0gdXBkYXRlZEF0QmxvY2s7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdJZGVudGl0eUtleSc7XG4gICAgfVxuICAgIGFzeW5jIHNhdmUoKSB7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5pZDtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCBzYXZlIElkZW50aXR5S2V5IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXQoJ0lkZW50aXR5S2V5JywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgSWRlbnRpdHlLZXkgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnJlbW92ZSgnSWRlbnRpdHlLZXknLCBpZC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIGdldChpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoKGlkICE9PSBudWxsICYmIGlkICE9PSB1bmRlZmluZWQpLCBcIkNhbm5vdCBnZXQgSWRlbnRpdHlLZXkgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnSWRlbnRpdHlLZXknLCBpZC50b1N0cmluZygpKTtcbiAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKHJlY29yZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyBlbnRpdGllcyBtYXRjaGluZyB0aGUgc3BlY2lmaWVkIGZpbHRlcnMgYW5kIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiDimqDvuI8gVGhpcyBmdW5jdGlvbiB3aWxsIGZpcnN0IHNlYXJjaCBjYWNoZSBkYXRhIGZvbGxvd2VkIGJ5IERCIGRhdGEuIFBsZWFzZSBjb25zaWRlciB0aGlzIHdoZW4gdXNpbmcgb3JkZXIgYW5kIG9mZnNldCBvcHRpb25zLuKaoO+4j1xuICAgICAqICovXG4gICAgc3RhdGljIGFzeW5jIGdldEJ5RmllbGRzKGZpbHRlciwgb3B0aW9ucykge1xuICAgICAgICBjb25zdCByZWNvcmRzID0gYXdhaXQgc3RvcmUuZ2V0QnlGaWVsZHMoJ0lkZW50aXR5S2V5JywgZmlsdGVyLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB0aGlzLmNyZWF0ZShyZWNvcmQpKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShyZWNvcmQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHJlY29yZC5pZCAhPT0gdW5kZWZpbmVkICYmIHJlY29yZC5pZCAhPT0gbnVsbCwgXCJpZCBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgdGhpcyhyZWNvcmQuaWQsIHJlY29yZC5jaGFpbklkLCByZWNvcmQuaWRlbnRpdHlJZCwgcmVjb3JkLmtleUlkLCByZWNvcmQuYWNjb3VudCwgcmVjb3JkLnB1cnBvc2UsIHJlY29yZC5zdGF0dXMsIHJlY29yZC51cGRhdGVkQXRCbG9jayk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZW50aXR5LCByZWNvcmQpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cbn1cbmV4cG9ydHMuSWRlbnRpdHlLZXkgPSBJZGVudGl0eUtleTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5QYXltZW50SW50ZW50ID0gdm9pZCAwO1xuY29uc3QgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbmNvbnN0IGFzc2VydF8xID0gdHNsaWJfMS5fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImFzc2VydFwiKSk7XG5jbGFzcyBQYXltZW50SW50ZW50IHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgaW50ZW50SWQsIHBheWVySWRlbnRpdHlJZCwgcGF5ZWVJZGVudGl0eUlkLCBhbW91bnQsIHNldHRsZW1lbnRNb2RlLCBzdGF0dXMsIGNyZWF0ZWRBdEJsb2NrLCB1cGRhdGVkQXRCbG9jaykge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuY2hhaW5JZCA9IGNoYWluSWQ7XG4gICAgICAgIHRoaXMuaW50ZW50SWQgPSBpbnRlbnRJZDtcbiAgICAgICAgdGhpcy5wYXllcklkZW50aXR5SWQgPSBwYXllcklkZW50aXR5SWQ7XG4gICAgICAgIHRoaXMucGF5ZWVJZGVudGl0eUlkID0gcGF5ZWVJZGVudGl0eUlkO1xuICAgICAgICB0aGlzLmFtb3VudCA9IGFtb3VudDtcbiAgICAgICAgdGhpcy5zZXR0bGVtZW50TW9kZSA9IHNldHRsZW1lbnRNb2RlO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgICAgdGhpcy5jcmVhdGVkQXRCbG9jayA9IGNyZWF0ZWRBdEJsb2NrO1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdEJsb2NrID0gdXBkYXRlZEF0QmxvY2s7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdQYXltZW50SW50ZW50JztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgUGF5bWVudEludGVudCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUuc2V0KCdQYXltZW50SW50ZW50JywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgUGF5bWVudEludGVudCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdQYXltZW50SW50ZW50JywgaWQudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyBnZXQoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKChpZCAhPT0gbnVsbCAmJiBpZCAhPT0gdW5kZWZpbmVkKSwgXCJDYW5ub3QgZ2V0IFBheW1lbnRJbnRlbnQgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnUGF5bWVudEludGVudCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnUGF5bWVudEludGVudCcsIGZpbHRlciwgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiByZWNvcmRzLm1hcChyZWNvcmQgPT4gdGhpcy5jcmVhdGUocmVjb3JkKSk7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUocmVjb3JkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShyZWNvcmQuaWQgIT09IHVuZGVmaW5lZCAmJiByZWNvcmQuaWQgIT09IG51bGwsIFwiaWQgbXVzdCBiZSBwcm92aWRlZFwiKTtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gbmV3IHRoaXMocmVjb3JkLmlkLCByZWNvcmQuY2hhaW5JZCwgcmVjb3JkLmludGVudElkLCByZWNvcmQucGF5ZXJJZGVudGl0eUlkLCByZWNvcmQucGF5ZWVJZGVudGl0eUlkLCByZWNvcmQuYW1vdW50LCByZWNvcmQuc2V0dGxlbWVudE1vZGUsIHJlY29yZC5zdGF0dXMsIHJlY29yZC5jcmVhdGVkQXRCbG9jaywgcmVjb3JkLnVwZGF0ZWRBdEJsb2NrKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHksIHJlY29yZCk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxufVxuZXhwb3J0cy5QYXltZW50SW50ZW50ID0gUGF5bWVudEludGVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TZXR0bGVtZW50RXZlbnQgPSB2b2lkIDA7XG5jb25zdCB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xuY29uc3QgYXNzZXJ0XzEgPSB0c2xpYl8xLl9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNsYXNzIFNldHRsZW1lbnRFdmVudCB7XG4gICAgY29uc3RydWN0b3IoaWQsIGNoYWluSWQsIGludGVudElkLCBldmVudFR5cGUsIGJsb2NrTnVtYmVyLCBldmVudEluZGV4LCBibG9ja0hhc2gpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNoYWluSWQgPSBjaGFpbklkO1xuICAgICAgICB0aGlzLmludGVudElkID0gaW50ZW50SWQ7XG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gZXZlbnRUeXBlO1xuICAgICAgICB0aGlzLmJsb2NrTnVtYmVyID0gYmxvY2tOdW1iZXI7XG4gICAgICAgIHRoaXMuZXZlbnRJbmRleCA9IGV2ZW50SW5kZXg7XG4gICAgICAgIHRoaXMuYmxvY2tIYXNoID0gYmxvY2tIYXNoO1xuICAgIH1cbiAgICBnZXQgX25hbWUoKSB7XG4gICAgICAgIHJldHVybiAnU2V0dGxlbWVudEV2ZW50JztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgU2V0dGxlbWVudEV2ZW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXQoJ1NldHRsZW1lbnRFdmVudCcsIGlkLnRvU3RyaW5nKCksIHRoaXMpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgcmVtb3ZlKGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShpZCAhPT0gbnVsbCwgXCJDYW5ub3QgcmVtb3ZlIFNldHRsZW1lbnRFdmVudCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdTZXR0bGVtZW50RXZlbnQnLCBpZC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIGdldChpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoKGlkICE9PSBudWxsICYmIGlkICE9PSB1bmRlZmluZWQpLCBcIkNhbm5vdCBnZXQgU2V0dGxlbWVudEV2ZW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCBzdG9yZS5nZXQoJ1NldHRsZW1lbnRFdmVudCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnU2V0dGxlbWVudEV2ZW50JywgZmlsdGVyLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB0aGlzLmNyZWF0ZShyZWNvcmQpKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShyZWNvcmQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHJlY29yZC5pZCAhPT0gdW5kZWZpbmVkICYmIHJlY29yZC5pZCAhPT0gbnVsbCwgXCJpZCBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgdGhpcyhyZWNvcmQuaWQsIHJlY29yZC5jaGFpbklkLCByZWNvcmQuaW50ZW50SWQsIHJlY29yZC5ldmVudFR5cGUsIHJlY29yZC5ibG9ja051bWJlciwgcmVjb3JkLmV2ZW50SW5kZXgsIHJlY29yZC5ibG9ja0hhc2gpO1xuICAgICAgICBPYmplY3QuYXNzaWduKGVudGl0eSwgcmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG59XG5leHBvcnRzLlNldHRsZW1lbnRFdmVudCA9IFNldHRsZW1lbnRFdmVudDtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFzc2VydFwiKTsiLCJleHBvcnQgY29uc3QgcGFja2FnZUluZm8gPSB7IG5hbWU6ICdAcG9sa2Fkb3QvYXBpLWJhc2UnLCBwYXRoOiAoaW1wb3J0Lm1ldGEgJiYgaW1wb3J0Lm1ldGEudXJsKSA/IG5ldyBVUkwoaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZS5zdWJzdHJpbmcoMCwgbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLmxhc3RJbmRleE9mKCcvJykgKyAxKSA6ICdhdXRvJywgdHlwZTogJ2VzbScsIHZlcnNpb246ICcxNi41LjYnIH07XG4iLCJleHBvcnQgY29uc3QgcGFja2FnZUluZm8gPSB7IG5hbWU6ICdAcG9sa2Fkb3QvdHlwZXMnLCBwYXRoOiAoaW1wb3J0Lm1ldGEgJiYgaW1wb3J0Lm1ldGEudXJsKSA/IG5ldyBVUkwoaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZS5zdWJzdHJpbmcoMCwgbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLmxhc3RJbmRleE9mKCcvJykgKyAxKSA6ICdhdXRvJywgdHlwZTogJ2VzbScsIHZlcnNpb246ICcxNi41LjYnIH07XG4iLCJleHBvcnQgY29uc3QgcGFja2FnZUluZm8gPSB7IG5hbWU6ICdAcG9sa2Fkb3QvdHlwZXMtY29kZWMnLCBwYXRoOiAoaW1wb3J0Lm1ldGEgJiYgaW1wb3J0Lm1ldGEudXJsKSA/IG5ldyBVUkwoaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZS5zdWJzdHJpbmcoMCwgbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLmxhc3RJbmRleE9mKCcvJykgKyAxKSA6ICdhdXRvJywgdHlwZTogJ2VzbScsIHZlcnNpb246ICcxNi41LjYnIH07XG4iLCJleHBvcnQgeyBwYWNrYWdlSW5mbyB9IGZyb20gJy4vcGFja2FnZUluZm8uanMnO1xuLyoqIEBpbnRlcm5hbCBMYXN0LXJlc29ydCBcInRoaXNcIiwgaWYgaXQgZ2V0cyBoZXJlIGl0IHByb2JhYmx5IHdvdWxkIGZhaWwgYW55d2F5ICovXG5mdW5jdGlvbiBldmFsdWF0ZVRoaXMoZm4pIHtcbiAgICByZXR1cm4gZm4oJ3JldHVybiB0aGlzJyk7XG59XG4vKipcbiAqIEEgY3Jvc3MtZW52aXJvbm1lbnQgaW1wbGVtZW50YXRpb24gZm9yIGdsb2JhbFRoaXNcbiAqL1xuZXhwb3J0IGNvbnN0IHhnbG9iYWwgPSAvKiNfX1BVUkVfXyovICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCdcbiAgICA/IGdsb2JhbFRoaXNcbiAgICA6IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnXG4gICAgICAgID8gZ2xvYmFsXG4gICAgICAgIDogdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICA/IHNlbGZcbiAgICAgICAgICAgIDogdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICA/IHdpbmRvd1xuICAgICAgICAgICAgICAgIDogZXZhbHVhdGVUaGlzKEZ1bmN0aW9uKSk7XG4vKipcbiAqIEV4dHJhY3RzIGEga25vd24gZ2xvYmFsIGZyb20gdGhlIGVudmlyb25tZW50LCBhcHBseWluZyBhIGZhbGxiYWNrIGlmIG5vdCBmb3VuZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdEdsb2JhbChuYW1lLCBmYWxsYmFjaykge1xuICAgIC8vIE5vdCBxdWl0ZSBzdXJlIHdoeSB0aGlzIGlzIGhlcmUgLSBzbnVjayBpbiB3aXRoIFRTIDQuNy4yIHdpdGggbm8gcmVhbCBpZGVhXG4gICAgLy8gKGFzIG9mIG5vdykgYXMgdG8gd2h5IHRoaXMgbG9va3MgbGlrZSBhbiBcImFueVwiIHdoZW4gd2UgZG8gY2FzdCBpdCB0byBhIFRcbiAgICAvL1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLXJldHVyblxuICAgIHJldHVybiB0eXBlb2YgeGdsb2JhbFtuYW1lXSA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyBmYWxsYmFja1xuICAgICAgICA6IHhnbG9iYWxbbmFtZV07XG59XG4vKipcbiAqIEV4cG9zZSBhIHZhbHVlIGFzIGEga25vd24gZ2xvYmFsLCBpZiBub3QgYWxyZWFkeSBkZWZpbmVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHBvc2VHbG9iYWwobmFtZSwgZmFsbGJhY2spIHtcbiAgICBpZiAodHlwZW9mIHhnbG9iYWxbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHhnbG9iYWxbbmFtZV0gPSBmYWxsYmFjaztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyB4Z2xvYmFsIH0gZnJvbSAnQHBvbGthZG90L3gtZ2xvYmFsJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL2lzL2Z1bmN0aW9uLmpzJztcbmNvbnN0IERFRFVQRSA9ICdFaXRoZXIgcmVtb3ZlIGFuZCBleHBsaWNpdGx5IGluc3RhbGwgbWF0Y2hpbmcgdmVyc2lvbnMgb3IgZGVkdXBlIHVzaW5nIHlvdXIgcGFja2FnZSBtYW5hZ2VyLlxcblRoZSBmb2xsb3dpbmcgY29uZmxpY3RpbmcgcGFja2FnZXMgd2VyZSBmb3VuZDonO1xuZXhwb3J0IGNvbnN0IFBPTEtBRE9USlNfRElTQUJMRV9FU01fQ0pTX1dBUk5JTkdfRkxBRyA9ICdQT0xLQURPVEpTX0RJU0FCTEVfRVNNX0NKU19XQVJOSU5HJztcbi8qKiBAaW50ZXJuYWwgKi9cbmZ1bmN0aW9uIGdldEVudHJ5KG5hbWUpIHtcbiAgICBjb25zdCBfZ2xvYmFsID0geGdsb2JhbDtcbiAgICBpZiAoIV9nbG9iYWwuX19wb2xrYWRvdGpzKSB7XG4gICAgICAgIF9nbG9iYWwuX19wb2xrYWRvdGpzID0ge307XG4gICAgfVxuICAgIGlmICghX2dsb2JhbC5fX3BvbGthZG90anNbbmFtZV0pIHtcbiAgICAgICAgX2dsb2JhbC5fX3BvbGthZG90anNbbmFtZV0gPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF9nbG9iYWwuX19wb2xrYWRvdGpzW25hbWVdO1xufVxuLyoqIEBpbnRlcm5hbCAqL1xuZnVuY3Rpb24gZm9ybWF0RGlzcGxheShhbGwsIGZtdCkge1xuICAgIGxldCBtYXggPSAwO1xuICAgIGZvciAobGV0IGkgPSAwLCBjb3VudCA9IGFsbC5sZW5ndGg7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgIG1heCA9IE1hdGgubWF4KG1heCwgYWxsW2ldLnZlcnNpb24ubGVuZ3RoKTtcbiAgICB9XG4gICAgcmV0dXJuIGFsbFxuICAgICAgICAubWFwKChkKSA9PiBgXFx0JHtmbXQoZC52ZXJzaW9uLnBhZEVuZChtYXgpLCBkKS5qb2luKCdcXHQnKX1gKVxuICAgICAgICAuam9pbignXFxuJyk7XG59XG4vKiogQGludGVybmFsICovXG5mdW5jdGlvbiBmb3JtYXRJbmZvKHZlcnNpb24sIHsgbmFtZSB9KSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgdmVyc2lvbixcbiAgICAgICAgbmFtZVxuICAgIF07XG59XG4vKiogQGludGVybmFsICovXG5mdW5jdGlvbiBmb3JtYXRWZXJzaW9uKHZlcnNpb24sIHsgcGF0aCwgdHlwZSB9KSB7XG4gICAgbGV0IGV4dHJhY3RlZDtcbiAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCA+PSA1KSB7XG4gICAgICAgIGNvbnN0IG5tSW5kZXggPSBwYXRoLmluZGV4T2YoJ25vZGVfbW9kdWxlcycpO1xuICAgICAgICBleHRyYWN0ZWQgPSBubUluZGV4ID09PSAtMVxuICAgICAgICAgICAgPyBwYXRoXG4gICAgICAgICAgICA6IHBhdGguc3Vic3RyaW5nKG5tSW5kZXgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZXh0cmFjdGVkID0gJzx1bmtub3duPic7XG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICAgIGAke2Ake3R5cGUgfHwgJyd9YC5wYWRTdGFydCgzKX0gJHt2ZXJzaW9ufWAsXG4gICAgICAgIGV4dHJhY3RlZFxuICAgIF07XG59XG4vKiogQGludGVybmFsICovXG5mdW5jdGlvbiBnZXRQYXRoKGluZm9QYXRoLCBwYXRoT3JGbikge1xuICAgIGlmIChpbmZvUGF0aCkge1xuICAgICAgICByZXR1cm4gaW5mb1BhdGg7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzRnVuY3Rpb24ocGF0aE9yRm4pKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE9yRm4oKSB8fCAnJztcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdGhPckZuIHx8ICcnO1xufVxuLyoqIEBpbnRlcm5hbCAqL1xuZnVuY3Rpb24gd2FybihwcmUsIGFsbCwgZm10KSB7XG4gICAgY29uc29sZS53YXJuKGAke3ByZX1cXG4ke0RFRFVQRX1cXG4ke2Zvcm1hdERpc3BsYXkoYWxsLCBmbXQpfWApO1xufVxuLyoqXG4gKiBAbmFtZSBkZXRlY3RQYWNrYWdlXG4gKiBAc3VtbWFyeSBDaGVja3MgdGhhdCBhIHNwZWNpZmljIHBhY2thZ2UgaXMgb25seSBpbXBvcnRlZCBvbmNlXG4gKiBAZGVzY3JpcHRpb24gQSBgQHBvbGthZG90LypgIHZlcnNpb24gZGV0ZWN0aW9uIHV0aWxpdHksIGNoZWNraW5nIGZvciBvbmUgb2NjdXJyZW5jZSBvZiBhIHBhY2thZ2UgaW4gYWRkaXRpb24gdG8gY2hlY2tpbmcgZm9yIGRlcGVuZGVuY3kgdmVyc2lvbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXRlY3RQYWNrYWdlKHsgbmFtZSwgcGF0aCwgdHlwZSwgdmVyc2lvbiB9LCBwYXRoT3JGbiwgZGVwcyA9IFtdKSB7XG4gICAgaWYgKCFuYW1lLnN0YXJ0c1dpdGgoJ0Bwb2xrYWRvdCcpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBwYWNrYWdlIGRlc2NyaXB0b3IgJHtuYW1lfWApO1xuICAgIH1cbiAgICBjb25zdCBlbnRyeSA9IGdldEVudHJ5KG5hbWUpO1xuICAgIGVudHJ5LnB1c2goeyBwYXRoOiBnZXRQYXRoKHBhdGgsIHBhdGhPckZuKSwgdHlwZSwgdmVyc2lvbiB9KTtcbiAgICAvLyBpZiB3ZSBoYXZlIG1vcmUgdGhhbiBvbmUgZW50cnkgYXQgRElGRkVSRU5UIHZlcnNpb24gdHlwZXMgdGhlbiB3YXJuLiBJZiB0aGVyZSBpc1xuICAgIC8vIG1vcmUgdGhhbiBvbmUgZW50cnkgYXQgdGhlIHNhbWUgdmVyc2lvbiBhbmQgRVNNL0NKUyBkdWFsIHdhcm5pbmdzIGFyZSBkaXNhYmxlZCxcbiAgICAvLyB0aGVuIGRvIG5vdCBkaXNwbGF5IHdhcm5pbmdzXG4gICAgY29uc3QgZW50cmllc1NhbWVWZXJzaW9uID0gZW50cnkuZXZlcnkoKGUpID0+IGUudmVyc2lvbiA9PT0gdmVyc2lvbik7XG4gICAgY29uc3QgZXNtQ2pzV2FybmluZ0Rpc2FibGVkID0geGdsb2JhbC5wcm9jZXNzPy5lbnY/LltQT0xLQURPVEpTX0RJU0FCTEVfRVNNX0NKU19XQVJOSU5HX0ZMQUddID09PSAnMSc7XG4gICAgY29uc3QgbXVsdGlwbGVFbnRyaWVzID0gZW50cnkubGVuZ3RoICE9PSAxO1xuICAgIGNvbnN0IGRpc2FibGVXYXJuaW5ncyA9IGVzbUNqc1dhcm5pbmdEaXNhYmxlZCAmJiBlbnRyaWVzU2FtZVZlcnNpb247XG4gICAgaWYgKG11bHRpcGxlRW50cmllcyAmJiAhZGlzYWJsZVdhcm5pbmdzKSB7XG4gICAgICAgIHdhcm4oYCR7bmFtZX0gaGFzIG11bHRpcGxlIHZlcnNpb25zLCBlbnN1cmUgdGhhdCB0aGVyZSBpcyBvbmx5IG9uZSBpbnN0YWxsZWQuYCwgZW50cnksIGZvcm1hdFZlcnNpb24pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgbWlzbWF0Y2hlcyA9IGRlcHMuZmlsdGVyKChkKSA9PiBkICYmIGQudmVyc2lvbiAhPT0gdmVyc2lvbik7XG4gICAgICAgIGlmIChtaXNtYXRjaGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgd2FybihgJHtuYW1lfSByZXF1aXJlcyBkaXJlY3QgZGVwZW5kZW5jaWVzIGV4YWN0bHkgbWF0Y2hpbmcgdmVyc2lvbiAke3ZlcnNpb259LmAsIG1pc21hdGNoZXMsIGZvcm1hdEluZm8pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLyoqXG4gKiBAbmFtZSBpc0Z1bmN0aW9uXG4gKiBAc3VtbWFyeSBUZXN0cyBmb3IgYSBgZnVuY3Rpb25gLlxuICogQGRlc2NyaXB0aW9uXG4gKiBDaGVja3MgdG8gc2VlIGlmIHRoZSBpbnB1dCB2YWx1ZSBpcyBhIEphdmFTY3JpcHQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICogPEJSPlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICdAcG9sa2Fkb3QvdXRpbCc7XG4gKlxuICogaXNGdW5jdGlvbigoKSA9PiBmYWxzZSk7IC8vID0+IHRydWVcbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59XG4iLCJleHBvcnQgY29uc3QgcGFja2FnZUluZm8gPSB7IG5hbWU6ICdAcG9sa2Fkb3QvYXBpLWF1Z21lbnQnLCBwYXRoOiAoaW1wb3J0Lm1ldGEgJiYgaW1wb3J0Lm1ldGEudXJsKSA/IG5ldyBVUkwoaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZS5zdWJzdHJpbmcoMCwgbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLmxhc3RJbmRleE9mKCcvJykgKyAxKSA6ICdhdXRvJywgdHlwZTogJ2VzbScsIHZlcnNpb246ICcxNi41LjYnIH07XG4iLCJpbXBvcnQgeyBwYWNrYWdlSW5mbyBhcyBiYXNlSW5mbyB9IGZyb20gJ0Bwb2xrYWRvdC9hcGktYmFzZS9wYWNrYWdlSW5mbyc7XG5pbXBvcnQgeyBwYWNrYWdlSW5mbyBhcyB0eXBlc0luZm8gfSBmcm9tICdAcG9sa2Fkb3QvdHlwZXMvcGFja2FnZUluZm8nO1xuaW1wb3J0IHsgcGFja2FnZUluZm8gYXMgY29kZWNJbmZvIH0gZnJvbSAnQHBvbGthZG90L3R5cGVzLWNvZGVjL3BhY2thZ2VJbmZvJztcbmltcG9ydCB7IGRldGVjdFBhY2thZ2UgfSBmcm9tICdAcG9sa2Fkb3QvdXRpbCc7XG5pbXBvcnQgeyBwYWNrYWdlSW5mbyB9IGZyb20gJy4vcGFja2FnZUluZm8uanMnO1xuZGV0ZWN0UGFja2FnZShwYWNrYWdlSW5mbywgbnVsbCwgW2Jhc2VJbmZvLCBjb2RlY0luZm8sIHR5cGVzSW5mb10pO1xuIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG5cblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1Jcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UsIFN1cHByZXNzZWRFcnJvciwgU3ltYm9sLCBJdGVyYXRvciAqL1xuXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcbiAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcbiAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn1cblxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xuICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xuICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHQ7XG4gIH1cbiAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xuICB2YXIgdCA9IHt9O1xuICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcbiAgICAgIHRbcF0gPSBzW3BdO1xuICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxuICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcbiAgICAgIH1cbiAgcmV0dXJuIHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XG4gIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xuICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fZXNEZWNvcmF0ZShjdG9yLCBkZXNjcmlwdG9ySW4sIGRlY29yYXRvcnMsIGNvbnRleHRJbiwgaW5pdGlhbGl6ZXJzLCBleHRyYUluaXRpYWxpemVycykge1xuICBmdW5jdGlvbiBhY2NlcHQoZikgeyBpZiAoZiAhPT0gdm9pZCAwICYmIHR5cGVvZiBmICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGdW5jdGlvbiBleHBlY3RlZFwiKTsgcmV0dXJuIGY7IH1cbiAgdmFyIGtpbmQgPSBjb250ZXh0SW4ua2luZCwga2V5ID0ga2luZCA9PT0gXCJnZXR0ZXJcIiA/IFwiZ2V0XCIgOiBraW5kID09PSBcInNldHRlclwiID8gXCJzZXRcIiA6IFwidmFsdWVcIjtcbiAgdmFyIHRhcmdldCA9ICFkZXNjcmlwdG9ySW4gJiYgY3RvciA/IGNvbnRleHRJbltcInN0YXRpY1wiXSA/IGN0b3IgOiBjdG9yLnByb3RvdHlwZSA6IG51bGw7XG4gIHZhciBkZXNjcmlwdG9yID0gZGVzY3JpcHRvckluIHx8ICh0YXJnZXQgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgY29udGV4dEluLm5hbWUpIDoge30pO1xuICB2YXIgXywgZG9uZSA9IGZhbHNlO1xuICBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGNvbnRleHQgPSB7fTtcbiAgICAgIGZvciAodmFyIHAgaW4gY29udGV4dEluKSBjb250ZXh0W3BdID0gcCA9PT0gXCJhY2Nlc3NcIiA/IHt9IDogY29udGV4dEluW3BdO1xuICAgICAgZm9yICh2YXIgcCBpbiBjb250ZXh0SW4uYWNjZXNzKSBjb250ZXh0LmFjY2Vzc1twXSA9IGNvbnRleHRJbi5hY2Nlc3NbcF07XG4gICAgICBjb250ZXh0LmFkZEluaXRpYWxpemVyID0gZnVuY3Rpb24gKGYpIHsgaWYgKGRvbmUpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgYWRkIGluaXRpYWxpemVycyBhZnRlciBkZWNvcmF0aW9uIGhhcyBjb21wbGV0ZWRcIik7IGV4dHJhSW5pdGlhbGl6ZXJzLnB1c2goYWNjZXB0KGYgfHwgbnVsbCkpOyB9O1xuICAgICAgdmFyIHJlc3VsdCA9ICgwLCBkZWNvcmF0b3JzW2ldKShraW5kID09PSBcImFjY2Vzc29yXCIgPyB7IGdldDogZGVzY3JpcHRvci5nZXQsIHNldDogZGVzY3JpcHRvci5zZXQgfSA6IGRlc2NyaXB0b3Jba2V5XSwgY29udGV4dCk7XG4gICAgICBpZiAoa2luZCA9PT0gXCJhY2Nlc3NvclwiKSB7XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdm9pZCAwKSBjb250aW51ZTtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsIHx8IHR5cGVvZiByZXN1bHQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgZXhwZWN0ZWRcIik7XG4gICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LmdldCkpIGRlc2NyaXB0b3IuZ2V0ID0gXztcbiAgICAgICAgICBpZiAoXyA9IGFjY2VwdChyZXN1bHQuc2V0KSkgZGVzY3JpcHRvci5zZXQgPSBfO1xuICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5pbml0KSkgaW5pdGlhbGl6ZXJzLnVuc2hpZnQoXyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChfID0gYWNjZXB0KHJlc3VsdCkpIHtcbiAgICAgICAgICBpZiAoa2luZCA9PT0gXCJmaWVsZFwiKSBpbml0aWFsaXplcnMudW5zaGlmdChfKTtcbiAgICAgICAgICBlbHNlIGRlc2NyaXB0b3Jba2V5XSA9IF87XG4gICAgICB9XG4gIH1cbiAgaWYgKHRhcmdldCkgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgY29udGV4dEluLm5hbWUsIGRlc2NyaXB0b3IpO1xuICBkb25lID0gdHJ1ZTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3J1bkluaXRpYWxpemVycyh0aGlzQXJnLCBpbml0aWFsaXplcnMsIHZhbHVlKSB7XG4gIHZhciB1c2VWYWx1ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGluaXRpYWxpemVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFsdWUgPSB1c2VWYWx1ZSA/IGluaXRpYWxpemVyc1tpXS5jYWxsKHRoaXNBcmcsIHZhbHVlKSA6IGluaXRpYWxpemVyc1tpXS5jYWxsKHRoaXNBcmcpO1xuICB9XG4gIHJldHVybiB1c2VWYWx1ZSA/IHZhbHVlIDogdm9pZCAwO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fcHJvcEtleSh4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gXCJzeW1ib2xcIiA/IHggOiBcIlwiLmNvbmNhdCh4KTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3NldEZ1bmN0aW9uTmFtZShmLCBuYW1lLCBwcmVmaXgpIHtcbiAgaWYgKHR5cGVvZiBuYW1lID09PSBcInN5bWJvbFwiKSBuYW1lID0gbmFtZS5kZXNjcmlwdGlvbiA/IFwiW1wiLmNvbmNhdChuYW1lLmRlc2NyaXB0aW9uLCBcIl1cIikgOiBcIlwiO1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGYsIFwibmFtZVwiLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHByZWZpeCA/IFwiXCIuY29uY2F0KHByZWZpeCwgXCIgXCIsIG5hbWUpIDogbmFtZSB9KTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XG4gIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XG4gIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGcgPSBPYmplY3QuY3JlYXRlKCh0eXBlb2YgSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEl0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpO1xuICByZXR1cm4gZy5uZXh0ID0gdmVyYigwKSwgZ1tcInRocm93XCJdID0gdmVyYigxKSwgZ1tcInJldHVyblwiXSA9IHZlcmIoMiksIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgfVxufVxuXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgfVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgb1trMl0gPSBtW2tdO1xufSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xuICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XG4gIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XG4gIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xuICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XG4gICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcbiAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XG4gICAgICB9XG4gIH07XG4gIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XG4gIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcbiAgaWYgKCFtKSByZXR1cm4gbztcbiAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XG4gIHRyeSB7XG4gICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcbiAgfVxuICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cbiAgZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xuICAgICAgfVxuICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XG4gIH1cbiAgcmV0dXJuIGFyO1xufVxuXG4vKiogQGRlcHJlY2F0ZWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcbiAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXG4gICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XG4gIHJldHVybiBhcjtcbn1cblxuLyoqIEBkZXByZWNhdGVkICovXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XG4gIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xuICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXG4gICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcbiAgICAgICAgICByW2tdID0gYVtqXTtcbiAgcmV0dXJuIHI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XG4gIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICB9XG4gIH1cbiAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcbiAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xuICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xuICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xuICByZXR1cm4gaSA9IE9iamVjdC5jcmVhdGUoKHR5cGVvZiBBc3luY0l0ZXJhdG9yID09PSBcImZ1bmN0aW9uXCIgPyBBc3luY0l0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpLCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIsIGF3YWl0UmV0dXJuKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xuICBmdW5jdGlvbiBhd2FpdFJldHVybihmKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZiwgcmVqZWN0KTsgfTsgfVxuICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaWYgKGdbbl0pIHsgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgaWYgKGYpIGlbbl0gPSBmKGlbbl0pOyB9IH1cbiAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxuICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cbiAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxuICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XG4gIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xuICB2YXIgaSwgcDtcbiAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcbiAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogZmFsc2UgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xuICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xuICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xuICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XG4gIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cbiAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcbiAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cbiAgcmV0dXJuIGNvb2tlZDtcbn07XG5cbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gIG9bXCJkZWZhdWx0XCJdID0gdjtcbn07XG5cbnZhciBvd25LZXlzID0gZnVuY3Rpb24obykge1xuICBvd25LZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgfHwgZnVuY3Rpb24gKG8pIHtcbiAgICB2YXIgYXIgPSBbXTtcbiAgICBmb3IgKHZhciBrIGluIG8pIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgaykpIGFyW2FyLmxlbmd0aF0gPSBrO1xuICAgIHJldHVybiBhcjtcbiAgfTtcbiAgcmV0dXJuIG93bktleXMobyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xuICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayA9IG93bktleXMobW9kKSwgaSA9IDA7IGkgPCBrLmxlbmd0aDsgaSsrKSBpZiAoa1tpXSAhPT0gXCJkZWZhdWx0XCIpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwga1tpXSk7XG4gIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XG4gIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xuICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBnZXR0ZXJcIik7XG4gIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xuICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XG4gIGlmIChraW5kID09PSBcIm1cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgbWV0aG9kIGlzIG5vdCB3cml0YWJsZVwiKTtcbiAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xuICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xuICByZXR1cm4gKGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyLCB2YWx1ZSkgOiBmID8gZi52YWx1ZSA9IHZhbHVlIDogc3RhdGUuc2V0KHJlY2VpdmVyLCB2YWx1ZSkpLCB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRJbihzdGF0ZSwgcmVjZWl2ZXIpIHtcbiAgaWYgKHJlY2VpdmVyID09PSBudWxsIHx8ICh0eXBlb2YgcmVjZWl2ZXIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHJlY2VpdmVyICE9PSBcImZ1bmN0aW9uXCIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHVzZSAnaW4nIG9wZXJhdG9yIG9uIG5vbi1vYmplY3RcIik7XG4gIHJldHVybiB0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyID09PSBzdGF0ZSA6IHN0YXRlLmhhcyhyZWNlaXZlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2FkZERpc3Bvc2FibGVSZXNvdXJjZShlbnYsIHZhbHVlLCBhc3luYykge1xuICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHZvaWQgMCkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgZXhwZWN0ZWQuXCIpO1xuICAgIHZhciBkaXNwb3NlLCBpbm5lcjtcbiAgICBpZiAoYXN5bmMpIHtcbiAgICAgIGlmICghU3ltYm9sLmFzeW5jRGlzcG9zZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0Rpc3Bvc2UgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgZGlzcG9zZSA9IHZhbHVlW1N5bWJvbC5hc3luY0Rpc3Bvc2VdO1xuICAgIH1cbiAgICBpZiAoZGlzcG9zZSA9PT0gdm9pZCAwKSB7XG4gICAgICBpZiAoIVN5bWJvbC5kaXNwb3NlKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmRpc3Bvc2UgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgZGlzcG9zZSA9IHZhbHVlW1N5bWJvbC5kaXNwb3NlXTtcbiAgICAgIGlmIChhc3luYykgaW5uZXIgPSBkaXNwb3NlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGRpc3Bvc2UgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBub3QgZGlzcG9zYWJsZS5cIik7XG4gICAgaWYgKGlubmVyKSBkaXNwb3NlID0gZnVuY3Rpb24oKSB7IHRyeSB7IGlubmVyLmNhbGwodGhpcyk7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIFByb21pc2UucmVqZWN0KGUpOyB9IH07XG4gICAgZW52LnN0YWNrLnB1c2goeyB2YWx1ZTogdmFsdWUsIGRpc3Bvc2U6IGRpc3Bvc2UsIGFzeW5jOiBhc3luYyB9KTtcbiAgfVxuICBlbHNlIGlmIChhc3luYykge1xuICAgIGVudi5zdGFjay5wdXNoKHsgYXN5bmM6IHRydWUgfSk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG52YXIgX1N1cHByZXNzZWRFcnJvciA9IHR5cGVvZiBTdXBwcmVzc2VkRXJyb3IgPT09IFwiZnVuY3Rpb25cIiA/IFN1cHByZXNzZWRFcnJvciA6IGZ1bmN0aW9uIChlcnJvciwgc3VwcHJlc3NlZCwgbWVzc2FnZSkge1xuICB2YXIgZSA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGUubmFtZSA9IFwiU3VwcHJlc3NlZEVycm9yXCIsIGUuZXJyb3IgPSBlcnJvciwgZS5zdXBwcmVzc2VkID0gc3VwcHJlc3NlZCwgZTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2Rpc3Bvc2VSZXNvdXJjZXMoZW52KSB7XG4gIGZ1bmN0aW9uIGZhaWwoZSkge1xuICAgIGVudi5lcnJvciA9IGVudi5oYXNFcnJvciA/IG5ldyBfU3VwcHJlc3NlZEVycm9yKGUsIGVudi5lcnJvciwgXCJBbiBlcnJvciB3YXMgc3VwcHJlc3NlZCBkdXJpbmcgZGlzcG9zYWwuXCIpIDogZTtcbiAgICBlbnYuaGFzRXJyb3IgPSB0cnVlO1xuICB9XG4gIHZhciByLCBzID0gMDtcbiAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICB3aGlsZSAociA9IGVudi5zdGFjay5wb3AoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFyLmFzeW5jICYmIHMgPT09IDEpIHJldHVybiBzID0gMCwgZW52LnN0YWNrLnB1c2gociksIFByb21pc2UucmVzb2x2ZSgpLnRoZW4obmV4dCk7XG4gICAgICAgIGlmIChyLmRpc3Bvc2UpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gci5kaXNwb3NlLmNhbGwoci52YWx1ZSk7XG4gICAgICAgICAgaWYgKHIuYXN5bmMpIHJldHVybiBzIHw9IDIsIFByb21pc2UucmVzb2x2ZShyZXN1bHQpLnRoZW4obmV4dCwgZnVuY3Rpb24oZSkgeyBmYWlsKGUpOyByZXR1cm4gbmV4dCgpOyB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHMgfD0gMTtcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGZhaWwoZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzID09PSAxKSByZXR1cm4gZW52Lmhhc0Vycm9yID8gUHJvbWlzZS5yZWplY3QoZW52LmVycm9yKSA6IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIGlmIChlbnYuaGFzRXJyb3IpIHRocm93IGVudi5lcnJvcjtcbiAgfVxuICByZXR1cm4gbmV4dCgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19yZXdyaXRlUmVsYXRpdmVJbXBvcnRFeHRlbnNpb24ocGF0aCwgcHJlc2VydmVKc3gpIHtcbiAgaWYgKHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiICYmIC9eXFwuXFwuP1xcLy8udGVzdChwYXRoKSkge1xuICAgICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFwuKHRzeCkkfCgoPzpcXC5kKT8pKCg/OlxcLlteLi9dKz8pPylcXC4oW2NtXT8pdHMkL2ksIGZ1bmN0aW9uIChtLCB0c3gsIGQsIGV4dCwgY20pIHtcbiAgICAgICAgICByZXR1cm4gdHN4ID8gcHJlc2VydmVKc3ggPyBcIi5qc3hcIiA6IFwiLmpzXCIgOiBkICYmICghZXh0IHx8ICFjbSkgPyBtIDogKGQgKyBleHQgKyBcIi5cIiArIGNtLnRvTG93ZXJDYXNlKCkgKyBcImpzXCIpO1xuICAgICAgfSk7XG4gIH1cbiAgcmV0dXJuIHBhdGg7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgX19leHRlbmRzLFxuICBfX2Fzc2lnbixcbiAgX19yZXN0LFxuICBfX2RlY29yYXRlLFxuICBfX3BhcmFtLFxuICBfX2VzRGVjb3JhdGUsXG4gIF9fcnVuSW5pdGlhbGl6ZXJzLFxuICBfX3Byb3BLZXksXG4gIF9fc2V0RnVuY3Rpb25OYW1lLFxuICBfX21ldGFkYXRhLFxuICBfX2F3YWl0ZXIsXG4gIF9fZ2VuZXJhdG9yLFxuICBfX2NyZWF0ZUJpbmRpbmcsXG4gIF9fZXhwb3J0U3RhcixcbiAgX192YWx1ZXMsXG4gIF9fcmVhZCxcbiAgX19zcHJlYWQsXG4gIF9fc3ByZWFkQXJyYXlzLFxuICBfX3NwcmVhZEFycmF5LFxuICBfX2F3YWl0LFxuICBfX2FzeW5jR2VuZXJhdG9yLFxuICBfX2FzeW5jRGVsZWdhdG9yLFxuICBfX2FzeW5jVmFsdWVzLFxuICBfX21ha2VUZW1wbGF0ZU9iamVjdCxcbiAgX19pbXBvcnRTdGFyLFxuICBfX2ltcG9ydERlZmF1bHQsXG4gIF9fY2xhc3NQcml2YXRlRmllbGRHZXQsXG4gIF9fY2xhc3NQcml2YXRlRmllbGRTZXQsXG4gIF9fY2xhc3NQcml2YXRlRmllbGRJbixcbiAgX19hZGREaXNwb3NhYmxlUmVzb3VyY2UsXG4gIF9fZGlzcG9zZVJlc291cmNlcyxcbiAgX19yZXdyaXRlUmVsYXRpdmVJbXBvcnRFeHRlbnNpb24sXG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogRW50cnktcG9pbnQgZm9yIFN1YlF1ZXJ5IG1hcHBpbmcgaGFuZGxlcnMuXG4gKlxuICogUmUtZXhwb3J0cyBldmVyeSBoYW5kbGVyIHNvIHRoZSBTdWJRdWVyeSBub2RlIGNhbiByZXNvbHZlIHRoZW0gZnJvbVxuICogYSBzaW5nbGUgYC4vZGlzdC9pbmRleC5qc2AgYnVuZGxlIHBhdGguXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaGFuZGxlQWdlbnRTdGFrZVJlbGVhc2VkID0gZXhwb3J0cy5oYW5kbGVBZ2VudFN0YWtlUmVsZWFzZUNsZWFyZWQgPSBleHBvcnRzLmhhbmRsZUFnZW50U3Rha2VSZWxlYXNlQmxvY2tlZCA9IGV4cG9ydHMuaGFuZGxlQWdlbnRTdGFrZVVuYm9uZENhbmNlbGxlZCA9IGV4cG9ydHMuaGFuZGxlQWdlbnRTdGFrZVVuYm9uZFJlcXVlc3RlZCA9IGV4cG9ydHMuaGFuZGxlQWdlbnRTdGFrZUJvbmRlZCA9IGV4cG9ydHMuaGFuZGxlRW1lcmdlbmN5Q2FuY2VsbGVkID0gZXhwb3J0cy5oYW5kbGVFbWVyZ2VuY3lSZXN1bWVkID0gZXhwb3J0cy5oYW5kbGVFbWVyZ2VuY3lQYXVzZWQgPSBleHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRFeHBpcmVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50Q2FuY2VsbGVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50UmVmdW5kZWQgPSBleHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRDbGFpbWVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50RnVuZGVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50Q3JlYXRlZCA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlEaXNhYmxlZCA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlVbmZyb3plbiA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlGcm96ZW4gPSBleHBvcnRzLmhhbmRsZVRyYW5zcG9ydFJldm9rZWQgPSBleHBvcnRzLmhhbmRsZVRyYW5zcG9ydFZlcmlmaWVkID0gZXhwb3J0cy5oYW5kbGVUcmFuc3BvcnRCb3VuZCA9IGV4cG9ydHMuaGFuZGxlQWN0aXZlUmVsYXRpb25Qb2xpY3lTZXQgPSBleHBvcnRzLmhhbmRsZUFjdGl2ZUF1dGhSZWdpc3RyeVNldCA9IGV4cG9ydHMuaGFuZGxlQWN0aXZlQWdlbnRSZWdpc3RyeVNldCA9IGV4cG9ydHMuaGFuZGxlQWN0aXZlUHJvZmlsZVNldCA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlLZXlSZXZva2VkID0gZXhwb3J0cy5oYW5kbGVJZGVudGl0eUtleUFkZGVkID0gZXhwb3J0cy5oYW5kbGVSZWNvdmVyeUtleVNldCA9IGV4cG9ydHMuaGFuZGxlT3duZXJLZXlSb3RhdGVkID0gZXhwb3J0cy5oYW5kbGVJZGVudGl0eVJlZ2lzdGVyZWQgPSBleHBvcnRzLmhhbmRsZUJsb2NrID0gdm9pZCAwO1xudmFyIGJsb2NrXzEgPSByZXF1aXJlKFwiLi9tYXBwaW5ncy9ibG9ja1wiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUJsb2NrXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBibG9ja18xLmhhbmRsZUJsb2NrOyB9IH0pO1xudmFyIGlkZW50aXR5Q29yZV8xID0gcmVxdWlyZShcIi4vbWFwcGluZ3MvaWRlbnRpdHlDb3JlXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlSWRlbnRpdHlSZWdpc3RlcmVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBpZGVudGl0eUNvcmVfMS5oYW5kbGVJZGVudGl0eVJlZ2lzdGVyZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVPd25lcktleVJvdGF0ZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZU93bmVyS2V5Um90YXRlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVJlY292ZXJ5S2V5U2V0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBpZGVudGl0eUNvcmVfMS5oYW5kbGVSZWNvdmVyeUtleVNldDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUlkZW50aXR5S2V5QWRkZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZUlkZW50aXR5S2V5QWRkZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVJZGVudGl0eUtleVJldm9rZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZUlkZW50aXR5S2V5UmV2b2tlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUFjdGl2ZVByb2ZpbGVTZXRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZUFjdGl2ZVByb2ZpbGVTZXQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVBY3RpdmVBZ2VudFJlZ2lzdHJ5U2V0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBpZGVudGl0eUNvcmVfMS5oYW5kbGVBY3RpdmVBZ2VudFJlZ2lzdHJ5U2V0OyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlQWN0aXZlQXV0aFJlZ2lzdHJ5U2V0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBpZGVudGl0eUNvcmVfMS5oYW5kbGVBY3RpdmVBdXRoUmVnaXN0cnlTZXQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVBY3RpdmVSZWxhdGlvblBvbGljeVNldFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gaWRlbnRpdHlDb3JlXzEuaGFuZGxlQWN0aXZlUmVsYXRpb25Qb2xpY3lTZXQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVUcmFuc3BvcnRCb3VuZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gaWRlbnRpdHlDb3JlXzEuaGFuZGxlVHJhbnNwb3J0Qm91bmQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVUcmFuc3BvcnRWZXJpZmllZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gaWRlbnRpdHlDb3JlXzEuaGFuZGxlVHJhbnNwb3J0VmVyaWZpZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVUcmFuc3BvcnRSZXZva2VkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBpZGVudGl0eUNvcmVfMS5oYW5kbGVUcmFuc3BvcnRSZXZva2VkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlSWRlbnRpdHlGcm96ZW5cIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZUlkZW50aXR5RnJvemVuOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlSWRlbnRpdHlVbmZyb3plblwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gaWRlbnRpdHlDb3JlXzEuaGFuZGxlSWRlbnRpdHlVbmZyb3plbjsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUlkZW50aXR5RGlzYWJsZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZUlkZW50aXR5RGlzYWJsZWQ7IH0gfSk7XG52YXIgcGF5bWVudEludGVudF8xID0gcmVxdWlyZShcIi4vbWFwcGluZ3MvcGF5bWVudEludGVudFwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVBheW1lbnRJbnRlbnRDcmVhdGVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXltZW50SW50ZW50XzEuaGFuZGxlUGF5bWVudEludGVudENyZWF0ZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVQYXltZW50SW50ZW50RnVuZGVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXltZW50SW50ZW50XzEuaGFuZGxlUGF5bWVudEludGVudEZ1bmRlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVBheW1lbnRJbnRlbnRDbGFpbWVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXltZW50SW50ZW50XzEuaGFuZGxlUGF5bWVudEludGVudENsYWltZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVQYXltZW50SW50ZW50UmVmdW5kZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHBheW1lbnRJbnRlbnRfMS5oYW5kbGVQYXltZW50SW50ZW50UmVmdW5kZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVQYXltZW50SW50ZW50Q2FuY2VsbGVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXltZW50SW50ZW50XzEuaGFuZGxlUGF5bWVudEludGVudENhbmNlbGxlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVBheW1lbnRJbnRlbnRFeHBpcmVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXltZW50SW50ZW50XzEuaGFuZGxlUGF5bWVudEludGVudEV4cGlyZWQ7IH0gfSk7XG52YXIgZW1lcmdlbmN5XzEgPSByZXF1aXJlKFwiLi9tYXBwaW5ncy9lbWVyZ2VuY3lcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVFbWVyZ2VuY3lQYXVzZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGVtZXJnZW5jeV8xLmhhbmRsZUVtZXJnZW5jeVBhdXNlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUVtZXJnZW5jeVJlc3VtZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGVtZXJnZW5jeV8xLmhhbmRsZUVtZXJnZW5jeVJlc3VtZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVFbWVyZ2VuY3lDYW5jZWxsZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGVtZXJnZW5jeV8xLmhhbmRsZUVtZXJnZW5jeUNhbmNlbGxlZDsgfSB9KTtcbnZhciBhZ2VudFN0YWtpbmdfMSA9IHJlcXVpcmUoXCIuL21hcHBpbmdzL2FnZW50U3Rha2luZ1wiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUFnZW50U3Rha2VCb25kZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFnZW50U3Rha2luZ18xLmhhbmRsZUFnZW50U3Rha2VCb25kZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVBZ2VudFN0YWtlVW5ib25kUmVxdWVzdGVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBhZ2VudFN0YWtpbmdfMS5oYW5kbGVBZ2VudFN0YWtlVW5ib25kUmVxdWVzdGVkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlQWdlbnRTdGFrZVVuYm9uZENhbmNlbGxlZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gYWdlbnRTdGFraW5nXzEuaGFuZGxlQWdlbnRTdGFrZVVuYm9uZENhbmNlbGxlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUFnZW50U3Rha2VSZWxlYXNlQmxvY2tlZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gYWdlbnRTdGFraW5nXzEuaGFuZGxlQWdlbnRTdGFrZVJlbGVhc2VCbG9ja2VkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlQWdlbnRTdGFrZVJlbGVhc2VDbGVhcmVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBhZ2VudFN0YWtpbmdfMS5oYW5kbGVBZ2VudFN0YWtlUmVsZWFzZUNsZWFyZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVBZ2VudFN0YWtlUmVsZWFzZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFnZW50U3Rha2luZ18xLmhhbmRsZUFnZW50U3Rha2VSZWxlYXNlZDsgfSB9KTtcbnJlcXVpcmUoXCJAcG9sa2Fkb3QvYXBpLWF1Z21lbnRcIik7XG4iXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJoYW5kbGVBZ2VudFN0YWtlUmVsZWFzZWQiLCJoYW5kbGVBZ2VudFN0YWtlUmVsZWFzZUNsZWFyZWQiLCJoYW5kbGVBZ2VudFN0YWtlUmVsZWFzZUJsb2NrZWQiLCJoYW5kbGVBZ2VudFN0YWtlVW5ib25kQ2FuY2VsbGVkIiwiaGFuZGxlQWdlbnRTdGFrZVVuYm9uZFJlcXVlc3RlZCIsImhhbmRsZUFnZW50U3Rha2VCb25kZWQiLCJBZ2VudFN0YWtlRXZlbnRfMSIsIkFnZW50U3Rha2VMZWRnZXJfMSIsInV0aWxzXzEiLCJzdHIiLCJ2IiwidG9TdHJpbmciLCJibG9ja051bSIsImJsb2NrIiwiQmlnSW50IiwiaGVhZGVyIiwibnVtYmVyIiwiZXh0cmluc2ljSW5kZXgiLCJldmVudCIsIl9hIiwiZXh0cmluc2ljIiwiaWR4IiwidW5kZWZpbmVkIiwiYXN5bmMiLCJhcHBlbmRTdGFrZUV2ZW50IiwiaW5wdXQiLCJfYiIsImJuIiwiZXZlbnRJbmRleCIsInJvdyIsIkFnZW50U3Rha2VFdmVudCIsImNyZWF0ZSIsImlkIiwiYWdlbnRTdGFrZUV2ZW50RW50aXR5SWQiLCJpZGVudGl0eUlkIiwiYWdlbnRJZCIsImNoYWluSWQiLCJDSEFJTl9JRCIsImZ1bmRpbmdBY2NvdW50IiwiZXZlbnRUeXBlIiwiYW1vdW50IiwiYWN0aXZlQW1vdW50IiwidW5sb2NrQXRCbG9jayIsInJlYXNvblJlZiIsImJsb2NrTnVtYmVyIiwiYmxvY2tIYXNoIiwiaGFzaCIsInRvSGV4IiwidGltZXN0YW1wIiwic2F2ZSIsInVwc2VydExlZGdlciIsIl9jIiwiX2QiLCJfZSIsIl9mIiwiX2ciLCJfaCIsIl9qIiwiX2siLCJhZ2VudFN0YWtlTGVkZ2VyRW50aXR5SWQiLCJleGlzdGluZyIsIkFnZW50U3Rha2VMZWRnZXIiLCJnZXQiLCJ6ZXJvIiwiYWN0aXZlRGVsdGEiLCJ1bmJvbmRpbmdBbW91bnQiLCJ1bmJvbmRpbmdEZWx0YSIsInJlbGVhc2VCbG9ja2VkIiwic3RhdHVzIiwibGVkZ2VyIiwicmVsZWFzZUJsb2NrUmVhc29uIiwidXBkYXRlZEF0QmxvY2siLCJkYXRhIiwianNvbiIsInRvSlNPTiIsImNhbGwiLCJKU09OIiwic3RyaW5naWZ5IiwicmVmVG9TdHJpbmciLCJoYW5kbGVCbG9jayIsIkNoYWluQ2hlY2twb2ludF8xIiwiY2hlY2twb2ludCIsIkNoYWluQ2hlY2twb2ludCIsInVwZGF0ZWRBdCIsIkRhdGUiLCJoYW5kbGVFbWVyZ2VuY3lDYW5jZWxsZWQiLCJoYW5kbGVFbWVyZ2VuY3lSZXN1bWVkIiwiaGFuZGxlRW1lcmdlbmN5UGF1c2VkIiwiRW1lcmdlbmN5U3RhdHVzXzEiLCJvcHRIZXgiLCJyYXciLCJ1cHNlcnRFbWVyZ2VuY3lTdGF0dXMiLCJzY29wZSIsInNjb3BlUmF3IiwiZW50cmllcyIsImxlbmd0aCIsIm5hbWUiLCJ2YWwiLCJzZXJpYWxpemVTY29wZSIsInVwZGF0ZWRCeSIsInJlYXNvbkhhc2giLCJlbWVyZ2VuY3lTdGF0dXNFbnRpdHlJZCIsImVzIiwiRW1lcmdlbmN5U3RhdHVzIiwiaGFuZGxlSWRlbnRpdHlEaXNhYmxlZCIsImhhbmRsZUlkZW50aXR5VW5mcm96ZW4iLCJoYW5kbGVJZGVudGl0eUZyb3plbiIsImhhbmRsZVRyYW5zcG9ydFJldm9rZWQiLCJoYW5kbGVUcmFuc3BvcnRWZXJpZmllZCIsImhhbmRsZVRyYW5zcG9ydEJvdW5kIiwiaGFuZGxlQWN0aXZlUmVsYXRpb25Qb2xpY3lTZXQiLCJoYW5kbGVBY3RpdmVBdXRoUmVnaXN0cnlTZXQiLCJoYW5kbGVBY3RpdmVBZ2VudFJlZ2lzdHJ5U2V0IiwiaGFuZGxlQWN0aXZlUHJvZmlsZVNldCIsImhhbmRsZUlkZW50aXR5S2V5UmV2b2tlZCIsImhhbmRsZUlkZW50aXR5S2V5QWRkZWQiLCJoYW5kbGVSZWNvdmVyeUtleVNldCIsImhhbmRsZU93bmVyS2V5Um90YXRlZCIsImhhbmRsZUlkZW50aXR5UmVnaXN0ZXJlZCIsIkNoYWluSWRlbnRpdHlfMSIsIklkZW50aXR5S2V5XzEiLCJnZXRJZGVudGl0eSIsIkNoYWluSWRlbnRpdHkiLCJpZGVudGl0eUVudGl0eUlkIiwic2VyaWFsaXplQ29udGVudFJlZiIsIm9iaiIsIlN0cmluZyIsImZldGNoSWRlbnRpdHlQb2ludGVycyIsImFwaSIsInF1ZXJ5IiwiaWRlbnRpdHlDb3JlIiwiaWRlbnRpdGllcyIsImFjdGl2ZVByb2ZpbGUiLCJhY3RpdmVBZ2VudFJlZ2lzdHJ5IiwiYWN0aXZlQXV0aFJlZ2lzdHJ5IiwiYWN0aXZlUmVsYXRpb25Qb2xpY3kiLCJfIiwidG91Y2hJZGVudGl0eSIsImlkZW50aXR5Iiwib3duZXIiLCJjcmVhdGVkQXRCbG9jayIsIm5ld093bmVyIiwia2V5SWQiLCJwdXJwb3NlUmF3IiwicHVycG9zZUpzb24iLCJwdXJwb3NlIiwia2V5IiwiSWRlbnRpdHlLZXkiLCJpZGVudGl0eUtleUVudGl0eUlkIiwiYWNjb3VudCIsInJlY29yZEpzb24iLCJhdXRob3JpemVkS2V5cyIsInB0cnMiLCJoYW5kbGVQYXltZW50SW50ZW50RXhwaXJlZCIsImhhbmRsZVBheW1lbnRJbnRlbnRDYW5jZWxsZWQiLCJoYW5kbGVQYXltZW50SW50ZW50UmVmdW5kZWQiLCJoYW5kbGVQYXltZW50SW50ZW50Q2xhaW1lZCIsImhhbmRsZVBheW1lbnRJbnRlbnRGdW5kZWQiLCJoYW5kbGVQYXltZW50SW50ZW50Q3JlYXRlZCIsIlBheW1lbnRJbnRlbnRfMSIsIlNldHRsZW1lbnRFdmVudF8xIiwiZ2V0SW50ZW50IiwiaW50ZW50SWQiLCJQYXltZW50SW50ZW50IiwicGF5bWVudEludGVudEVudGl0eUlkIiwiYXBwZW5kU2V0dGxlbWVudEV2ZW50Iiwic2V0dGxlbWVudEV2ZW50RW50aXR5SWQiLCJzZSIsIlNldHRsZW1lbnRFdmVudCIsInBheWVySWRlbnRpdHlJZCIsInBheWVlSWRlbnRpdHlJZCIsImFjdGlvblJhdyIsImFjdGlvbk5hbWVzcGFjZSIsImFjdGlvbklkIiwibnMiLCJBcnJheSIsImlzQXJyYXkiLCJCdWZmZXIiLCJmcm9tIiwic3RhcnRzV2l0aCIsInNsaWNlIiwiaW50ZW50Iiwic2V0dGxlbWVudE1vZGUiLCJzZXR0bGVtZW50TW9kZUpzb24iLCJwcm9jZXNzIiwiZW52IiwiYXNzZXJ0XzEiLCJfX2ltcG9ydERlZmF1bHQiLCJjb25zdHJ1Y3RvciIsInRoaXMiLCJfbmFtZSIsImRlZmF1bHQiLCJzdG9yZSIsInNldCIsInJlbW92ZSIsInJlY29yZCIsImdldEJ5RmllbGRzIiwiZmlsdGVyIiwib3B0aW9ucyIsIm1hcCIsImVudGl0eSIsImFzc2lnbiIsIm1vZHVsZSIsInJlcXVpcmUiLCJwYWNrYWdlSW5mbyIsInBhdGgiLCJVUkwiLCJwYXRobmFtZSIsInN1YnN0cmluZyIsImxhc3RJbmRleE9mIiwidHlwZSIsInZlcnNpb24iLCJ4Z2xvYmFsIiwiZ2xvYmFsVGhpcyIsImdsb2JhbCIsInNlbGYiLCJ3aW5kb3ciLCJGdW5jdGlvbiIsImZvcm1hdEluZm8iLCJmb3JtYXRWZXJzaW9uIiwiZXh0cmFjdGVkIiwibm1JbmRleCIsImluZGV4T2YiLCJwYWRTdGFydCIsImdldFBhdGgiLCJpbmZvUGF0aCIsInBhdGhPckZuIiwid2FybiIsInByZSIsImFsbCIsImZtdCIsImNvbnNvbGUiLCJtYXgiLCJpIiwiY291bnQiLCJNYXRoIiwiZCIsInBhZEVuZCIsImpvaW4iLCJmb3JtYXREaXNwbGF5IiwiZGVwcyIsIkVycm9yIiwiZW50cnkiLCJfZ2xvYmFsIiwiX19wb2xrYWRvdGpzIiwiZ2V0RW50cnkiLCJwdXNoIiwiZW50cmllc1NhbWVWZXJzaW9uIiwiZXZlcnkiLCJlIiwiZXNtQ2pzV2FybmluZ0Rpc2FibGVkIiwibWlzbWF0Y2hlcyIsImRldGVjdFBhY2thZ2UiLCJleHRlbmRTdGF0aWNzIiwiYiIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwicCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiX19leHRlbmRzIiwiVHlwZUVycm9yIiwiX18iLCJfX2Fzc2lnbiIsInQiLCJzIiwibiIsImFyZ3VtZW50cyIsImFwcGx5IiwiX19yZXN0IiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImRlc2MiLCJjIiwiciIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsIlJlZmxlY3QiLCJkZWNvcmF0ZSIsIl9fcGFyYW0iLCJwYXJhbUluZGV4IiwiZGVjb3JhdG9yIiwiX19lc0RlY29yYXRlIiwiY3RvciIsImRlc2NyaXB0b3JJbiIsImNvbnRleHRJbiIsImluaXRpYWxpemVycyIsImV4dHJhSW5pdGlhbGl6ZXJzIiwiYWNjZXB0IiwiZiIsImtpbmQiLCJkZXNjcmlwdG9yIiwiZG9uZSIsImNvbnRleHQiLCJhY2Nlc3MiLCJhZGRJbml0aWFsaXplciIsInJlc3VsdCIsImluaXQiLCJ1bnNoaWZ0IiwiX19ydW5Jbml0aWFsaXplcnMiLCJ0aGlzQXJnIiwidXNlVmFsdWUiLCJfX3Byb3BLZXkiLCJ4IiwiY29uY2F0IiwiX19zZXRGdW5jdGlvbk5hbWUiLCJwcmVmaXgiLCJkZXNjcmlwdGlvbiIsImNvbmZpZ3VyYWJsZSIsIl9fbWV0YWRhdGEiLCJtZXRhZGF0YUtleSIsIm1ldGFkYXRhVmFsdWUiLCJtZXRhZGF0YSIsIl9fYXdhaXRlciIsIl9hcmd1bWVudHMiLCJQIiwiZ2VuZXJhdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmdWxmaWxsZWQiLCJzdGVwIiwibmV4dCIsInJlamVjdGVkIiwidGhlbiIsIl9fZ2VuZXJhdG9yIiwiYm9keSIsInkiLCJsYWJlbCIsInNlbnQiLCJ0cnlzIiwib3BzIiwiZyIsIkl0ZXJhdG9yIiwidmVyYiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwib3AiLCJwb3AiLCJfX2NyZWF0ZUJpbmRpbmciLCJvIiwibSIsImsiLCJrMiIsIl9fZXNNb2R1bGUiLCJ3cml0YWJsZSIsImVudW1lcmFibGUiLCJfX2V4cG9ydFN0YXIiLCJfX3ZhbHVlcyIsIl9fcmVhZCIsImFyIiwiZXJyb3IiLCJfX3NwcmVhZCIsIl9fc3ByZWFkQXJyYXlzIiwiaWwiLCJhIiwiaiIsImpsIiwiX19zcHJlYWRBcnJheSIsInRvIiwicGFjayIsImwiLCJfX2F3YWl0IiwiX19hc3luY0dlbmVyYXRvciIsImFzeW5jSXRlcmF0b3IiLCJxIiwiQXN5bmNJdGVyYXRvciIsInJlc3VtZSIsImZ1bGZpbGwiLCJzZXR0bGUiLCJzaGlmdCIsIl9fYXN5bmNEZWxlZ2F0b3IiLCJfX2FzeW5jVmFsdWVzIiwiX19tYWtlVGVtcGxhdGVPYmplY3QiLCJjb29rZWQiLCJfX3NldE1vZHVsZURlZmF1bHQiLCJvd25LZXlzIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsIl9faW1wb3J0U3RhciIsIm1vZCIsIl9fY2xhc3NQcml2YXRlRmllbGRHZXQiLCJyZWNlaXZlciIsInN0YXRlIiwiaGFzIiwiX19jbGFzc1ByaXZhdGVGaWVsZFNldCIsIl9fY2xhc3NQcml2YXRlRmllbGRJbiIsIl9fYWRkRGlzcG9zYWJsZVJlc291cmNlIiwiZGlzcG9zZSIsImlubmVyIiwiYXN5bmNEaXNwb3NlIiwic3RhY2siLCJfU3VwcHJlc3NlZEVycm9yIiwiU3VwcHJlc3NlZEVycm9yIiwic3VwcHJlc3NlZCIsIm1lc3NhZ2UiLCJfX2Rpc3Bvc2VSZXNvdXJjZXMiLCJmYWlsIiwiaGFzRXJyb3IiLCJfX3Jld3JpdGVSZWxhdGl2ZUltcG9ydEV4dGVuc2lvbiIsInByZXNlcnZlSnN4IiwidGVzdCIsInJlcGxhY2UiLCJ0c3giLCJleHQiLCJjbSIsInRvTG93ZXJDYXNlIiwiX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIm1vZHVsZUlkIiwiY2FjaGVkTW9kdWxlIiwiX193ZWJwYWNrX21vZHVsZXNfXyIsImRlZmluaXRpb24iLCJwcm9wIiwidG9TdHJpbmdUYWciLCJibG9ja18xIiwiaWRlbnRpdHlDb3JlXzEiLCJwYXltZW50SW50ZW50XzEiLCJlbWVyZ2VuY3lfMSIsImFnZW50U3Rha2luZ18xIl0sInNvdXJjZVJvb3QiOiIifQ==