(() => {
    "use strict";
    var e = {
        751(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handleBlock = void 0;
            const a = n(302), r = n(739);
            t.handleBlock = async function(e) {
                var t, n;
                const i = BigInt(e.block.header.number.toString()), o = e.block.header.hash.toHex();
                let c = await a.ChainCheckpoint.get(r.CHAIN_ID);
                c ? (c.blockNumber = i, c.blockHash = o, c.updatedAt = null !== (n = e.timestamp) && void 0 !== n ? n : new Date) : c = a.ChainCheckpoint.create({
                    id: r.CHAIN_ID,
                    chainId: r.CHAIN_ID,
                    blockNumber: i,
                    blockHash: o,
                    updatedAt: null !== (t = e.timestamp) && void 0 !== t ? t : new Date
                }), await c.save();
            };
        },
        823(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handleEmergencyCancelled = t.handleEmergencyResumed = t.handleEmergencyPaused = void 0;
            const a = n(314), r = n(739);
            function i(e) {
                if (null != e) return e.toString();
            }
            async function o(e, t) {
                const {event: {data: n}, block: o} = e, c = function(e) {
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
                }(n[0]), d = function(e) {
                    return BigInt(e.block.header.number.toString());
                }(o);
                let s, l;
                "Paused" === t ? (s = n[1].toString(), l = i(n[2].toJSON())) : l = i(n[1].toJSON());
                const u = (0, r.emergencyStatusEntityId)(c);
                let y = await a.EmergencyStatus.get(u);
                y ? (y.status = t, y.reasonHash = l, y.updatedBy = s, y.updatedAtBlock = d) : y = a.EmergencyStatus.create({
                    id: u,
                    chainId: r.CHAIN_ID,
                    scope: c,
                    status: t,
                    reasonHash: l,
                    updatedBy: s,
                    updatedAtBlock: d
                }), await y.save();
            }
            t.handleEmergencyPaused = async function(e) {
                await o(e, "Paused");
            }, t.handleEmergencyResumed = async function(e) {
                await o(e, "Active");
            }, t.handleEmergencyCancelled = async function(e) {
                await o(e, "Cancelled");
            };
        },
        957(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handleIdentityDisabled = t.handleIdentityUnfrozen = t.handleIdentityFrozen = t.handleTransportRevoked = t.handleTransportVerified = t.handleTransportBound = t.handleActiveRelationPolicySet = t.handleActiveAuthRegistrySet = t.handleActiveAgentRegistrySet = t.handleActiveProfileSet = t.handleIdentityKeyRevoked = t.handleIdentityKeyAdded = t.handleRecoveryKeySet = t.handleOwnerKeyRotated = t.handleIdentityRegistered = void 0;
            const a = n(322), r = n(708), i = n(739);
            function o(e) {
                return e.toString();
            }
            function c(e) {
                return BigInt(e.block.header.number.toString());
            }
            async function d(e) {
                return a.ChainIdentity.get((0, i.identityEntityId)(e));
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
                const {event: {data: t}, block: n} = e, a = o(t[0]), r = await d(a);
                r && (r.updatedAtBlock = c(n), await r.save());
            }
            t.handleIdentityRegistered = async function(e) {
                const {event: {data: t}, block: n} = e, r = o(t[0]), d = o(t[1]), s = c(n), l = (0, 
                i.identityEntityId)(r), u = a.ChainIdentity.create({
                    id: l,
                    chainId: i.CHAIN_ID,
                    identityId: r,
                    owner: d,
                    status: "Active",
                    createdAtBlock: s,
                    updatedAtBlock: s
                });
                await u.save();
            }, t.handleOwnerKeyRotated = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), r = o(t[2]), i = c(n), s = await d(a);
                s && (s.owner = r, s.updatedAtBlock = i, await s.save());
            }, t.handleRecoveryKeySet = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), r = c(n), i = await d(a);
                i && (i.updatedAtBlock = r, await i.save());
            }, t.handleIdentityKeyAdded = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), s = o(t[1]), l = t[2], u = c(n), y = l.toJSON(), f = "string" == typeof y ? y : JSON.stringify(y), h = r.IdentityKey.create({
                    id: (0, i.identityKeyEntityId)(s),
                    chainId: i.CHAIN_ID,
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
                const p = await d(a);
                p && (p.updatedAtBlock = u, await p.save());
            }, t.handleIdentityKeyRevoked = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[1]), s = o(t[0]), l = c(n), u = await r.IdentityKey.get((0, 
                i.identityKeyEntityId)(a));
                u && (u.status = "Revoked", u.updatedAtBlock = l, await u.save());
                const y = await d(s);
                y && (y.updatedAtBlock = l, await y.save());
            }, t.handleActiveProfileSet = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), r = c(n), i = await d(a);
                if (!i) return;
                const s = await l(a);
                i.activeProfile = s.activeProfile, i.updatedAtBlock = r, await i.save();
            }, t.handleActiveAgentRegistrySet = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), r = c(n), i = await d(a);
                if (!i) return;
                const s = await l(a);
                i.activeAgentRegistry = s.activeAgentRegistry, i.updatedAtBlock = r, await i.save();
            }, t.handleActiveAuthRegistrySet = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), r = c(n), i = await d(a);
                if (!i) return;
                const s = await l(a);
                i.activeAuthRegistry = s.activeAuthRegistry, i.updatedAtBlock = r, await i.save();
            }, t.handleActiveRelationPolicySet = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), r = c(n), i = await d(a);
                if (!i) return;
                const s = await l(a);
                i.activeRelationPolicy = s.activeRelationPolicy, i.updatedAtBlock = r, await i.save();
            }, t.handleTransportBound = async function(e) {
                await u(e);
            }, t.handleTransportVerified = async function(e) {
                await u(e);
            }, t.handleTransportRevoked = async function(e) {
                await u(e);
            }, t.handleIdentityFrozen = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), r = await d(a);
                r && (r.status = "Frozen", r.updatedAtBlock = c(n), await r.save());
            }, t.handleIdentityUnfrozen = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), r = await d(a);
                r && (r.status = "Active", r.updatedAtBlock = c(n), await r.save());
            }, t.handleIdentityDisabled = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), r = await d(a);
                r && (r.status = "Disabled", r.updatedAtBlock = c(n), await r.save());
            };
        },
        634(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handlePaymentIntentExpired = t.handlePaymentIntentCancelled = t.handlePaymentIntentRefunded = t.handlePaymentIntentClaimed = t.handlePaymentIntentFunded = t.handlePaymentIntentCreated = void 0;
            const a = n(745), r = n(908), i = n(739);
            function o(e) {
                return e.toString();
            }
            function c(e) {
                return BigInt(e.block.header.number.toString());
            }
            async function d(e) {
                return a.PaymentIntent.get((0, i.paymentIntentEntityId)(e));
            }
            async function s(e, t, n) {
                var a, o;
                const {block: d, extrinsic: s, idx: l} = e, u = c(d), y = null != l ? l : 0, f = (0, 
                i.settlementEventEntityId)(t, u, y), h = r.SettlementEvent.create({
                    id: f,
                    chainId: i.CHAIN_ID,
                    intentId: t,
                    eventType: n,
                    blockNumber: u,
                    extrinsicIndex: s && null !== (a = s.idx) && void 0 !== a ? a : void 0,
                    eventIndex: y,
                    blockHash: d.block.header.hash.toHex(),
                    timestamp: null !== (o = d.timestamp) && void 0 !== o ? o : void 0
                });
                await h.save();
            }
            t.handlePaymentIntentCreated = async function(e) {
                const {event: {data: t}, block: n} = e, r = o(t[0]), d = o(t[1]), s = o(t[2]), l = BigInt(o(t[4])), u = t[5].toJSON(), y = c(n);
                let f, h;
                if (u) {
                    const e = u.namespace;
                    Array.isArray(e) ? f = Buffer.from(e).toString("utf8") : "string" == typeof e && (f = e.startsWith("0x") ? Buffer.from(e.slice(2), "hex").toString("utf8") : e), 
                    void 0 !== u.actionCode && (h = String(u.actionCode));
                }
                const p = a.PaymentIntent.create({
                    id: (0, i.paymentIntentEntityId)(r),
                    chainId: i.CHAIN_ID,
                    intentId: r,
                    payerIdentityId: d,
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
                const {event: {data: t}, block: n} = e, a = o(t[0]), r = t[1].toJSON(), i = "string" == typeof r ? r : JSON.stringify(r), s = await d(a);
                s && (s.settlementMode = i, s.status = "Funded", s.updatedAtBlock = c(n), await s.save());
            }, t.handlePaymentIntentClaimed = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), r = await d(a);
                r && (r.status = "Claimed", r.updatedAtBlock = c(n), await r.save()), await s(e, a, "Claimed");
            }, t.handlePaymentIntentRefunded = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), r = await d(a);
                r && (r.status = "Refunded", r.updatedAtBlock = c(n), await r.save()), await s(e, a, "Refunded");
            }, t.handlePaymentIntentCancelled = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), r = await d(a);
                r && (r.status = "Cancelled", r.updatedAtBlock = c(n), await r.save()), await s(e, a, "Cancelled");
            }, t.handlePaymentIntentExpired = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), r = await d(a);
                r && (r.status = "Expired", r.updatedAtBlock = c(n), await r.save()), await s(e, a, "Expired");
            };
        },
        739(e, t) {
            var n;
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.emergencyStatusEntityId = t.settlementEventEntityId = t.paymentIntentEntityId = t.identityKeyEntityId = t.identityEntityId = t.CHAIN_ID = void 0, 
            t.CHAIN_ID = null !== (n = process.env.CHAIN_ID) && void 0 !== n ? n : "substrate:vibly-solo", 
            t.identityEntityId = function(e) {
                return `${t.CHAIN_ID}:${e}`;
            }, t.identityKeyEntityId = function(e) {
                return `${t.CHAIN_ID}:${e}`;
            }, t.paymentIntentEntityId = function(e) {
                return `${t.CHAIN_ID}:${e}`;
            }, t.settlementEventEntityId = function(e, n, a) {
                return `${t.CHAIN_ID}:${e}:${n}:${a}`;
            }, t.emergencyStatusEntityId = function(e) {
                return `${t.CHAIN_ID}:${e}`;
            };
        },
        302(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.ChainCheckpoint = void 0;
            const a = n(635).__importDefault(n(613));
            t.ChainCheckpoint = class {
                constructor(e, t, n, a, r) {
                    this.id = e, this.chainId = t, this.blockNumber = n, this.blockHash = a, this.updatedAt = r;
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
                constructor(e, t, n, a, r, i, o) {
                    this.id = e, this.chainId = t, this.identityId = n, this.owner = a, this.status = r, 
                    this.createdAtBlock = i, this.updatedAtBlock = o;
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
                constructor(e, t, n, a, r) {
                    this.id = e, this.chainId = t, this.scope = n, this.status = a, this.updatedAtBlock = r;
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
                constructor(e, t, n, a, r, i, o, c) {
                    this.id = e, this.chainId = t, this.identityId = n, this.keyId = a, this.account = r, 
                    this.purpose = i, this.status = o, this.updatedAtBlock = c;
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
                constructor(e, t, n, a, r, i, o, c, d, s) {
                    this.id = e, this.chainId = t, this.intentId = n, this.payerIdentityId = a, this.payeeIdentityId = r, 
                    this.amount = i, this.settlementMode = o, this.status = c, this.createdAtBlock = d, 
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
                constructor(e, t, n, a, r, i, o) {
                    this.id = e, this.chainId = t, this.intentId = n, this.eventType = a, this.blockNumber = r, 
                    this.eventIndex = i, this.blockHash = o;
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
            }, r = {
                name: "@polkadot/types",
                path: new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/types/packageInfo.js").pathname.substring(0, new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/types/packageInfo.js").pathname.lastIndexOf("/") + 1),
                type: "esm",
                version: "16.5.6"
            }, i = {
                name: "@polkadot/types-codec",
                path: new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/types-codec/packageInfo.js").pathname.substring(0, new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/types-codec/packageInfo.js").pathname.lastIndexOf("/") + 1),
                type: "esm",
                version: "16.5.6"
            };
            const o = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : Function("return this");
            function c(e, {name: t}) {
                return [ e, t ];
            }
            function d(e, {path: t, type: n}) {
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
            !function({name: e, path: t, type: n, version: a}, r, i = []) {
                if (!e.startsWith("@polkadot")) throw new Error(`Invalid package descriptor ${e}`);
                const u = function(e) {
                    const t = o;
                    return t.__polkadotjs || (t.__polkadotjs = {}), t.__polkadotjs[e] || (t.__polkadotjs[e] = []), 
                    t.__polkadotjs[e];
                }(e);
                u.push({
                    path: s(t, r),
                    type: n,
                    version: a
                });
                const y = u.every(e => e.version === a), f = "1" === o.process?.env?.POLKADOTJS_DISABLE_ESM_CJS_WARNING;
                if (1 !== u.length && !(f && y)) l(`${e} has multiple versions, ensure that there is only one installed.`, u, d); else {
                    const t = i.filter(e => e && e.version !== a);
                    t.length && l(`${e} requires direct dependencies exactly matching version ${a}.`, t, c);
                }
            }(u, null, [ a, i, r ]);
        },
        635(e, t, n) {
            n.r(t), n.d(t, {
                __addDisposableResource: () => T,
                __assign: () => i,
                __asyncDelegator: () => S,
                __asyncGenerator: () => P,
                __asyncValues: () => O,
                __await: () => k,
                __awaiter: () => h,
                __classPrivateFieldGet: () => B,
                __classPrivateFieldIn: () => D,
                __classPrivateFieldSet: () => x,
                __createBinding: () => v,
                __decorate: () => c,
                __disposeResources: () => K,
                __esDecorate: () => s,
                __exportStar: () => m,
                __extends: () => r,
                __generator: () => p,
                __importDefault: () => R,
                __importStar: () => E,
                __makeTemplateObject: () => j,
                __metadata: () => f,
                __param: () => d,
                __propKey: () => u,
                __read: () => b,
                __rest: () => o,
                __rewriteRelativeImportExtension: () => F,
                __runInitializers: () => l,
                __setFunctionName: () => y,
                __spread: () => I,
                __spreadArray: () => w,
                __spreadArrays: () => _,
                __values: () => g,
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
            function r(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
                function n() {
                    this.constructor = e;
                }
                a(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, 
                new n);
            }
            var i = function() {
                return i = Object.assign || function(e) {
                    for (var t, n = 1, a = arguments.length; n < a; n++) for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                    return e;
                }, i.apply(this, arguments);
            };
            function o(e, t) {
                var n = {};
                for (var a in e) Object.prototype.hasOwnProperty.call(e, a) && t.indexOf(a) < 0 && (n[a] = e[a]);
                if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
                    var r = 0;
                    for (a = Object.getOwnPropertySymbols(e); r < a.length; r++) t.indexOf(a[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, a[r]) && (n[a[r]] = e[a[r]]);
                }
                return n;
            }
            function c(e, t, n, a) {
                var r, i = arguments.length, o = i < 3 ? t : null === a ? a = Object.getOwnPropertyDescriptor(t, n) : a;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(e, t, n, a); else for (var c = e.length - 1; c >= 0; c--) (r = e[c]) && (o = (i < 3 ? r(o) : i > 3 ? r(t, n, o) : r(t, n)) || o);
                return i > 3 && o && Object.defineProperty(t, n, o), o;
            }
            function d(e, t) {
                return function(n, a) {
                    t(n, a, e);
                };
            }
            function s(e, t, n, a, r, i) {
                function o(e) {
                    if (void 0 !== e && "function" != typeof e) throw new TypeError("Function expected");
                    return e;
                }
                for (var c, d = a.kind, s = "getter" === d ? "get" : "setter" === d ? "set" : "value", l = !t && e ? a.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, a.name) : {}), y = !1, f = n.length - 1; f >= 0; f--) {
                    var h = {};
                    for (var p in a) h[p] = "access" === p ? {} : a[p];
                    for (var p in a.access) h.access[p] = a.access[p];
                    h.addInitializer = function(e) {
                        if (y) throw new TypeError("Cannot add initializers after decoration has completed");
                        i.push(o(e || null));
                    };
                    var v = (0, n[f])("accessor" === d ? {
                        get: u.get,
                        set: u.set
                    } : u[s], h);
                    if ("accessor" === d) {
                        if (void 0 === v) continue;
                        if (null === v || "object" != typeof v) throw new TypeError("Object expected");
                        (c = o(v.get)) && (u.get = c), (c = o(v.set)) && (u.set = c), (c = o(v.init)) && r.unshift(c);
                    } else (c = o(v)) && ("field" === d ? r.unshift(c) : u[s] = c);
                }
                l && Object.defineProperty(l, a.name, u), y = !0;
            }
            function l(e, t, n) {
                for (var a = arguments.length > 2, r = 0; r < t.length; r++) n = a ? t[r].call(e, n) : t[r].call(e);
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
                return new (n || (n = Promise))(function(r, i) {
                    function o(e) {
                        try {
                            d(a.next(e));
                        } catch (e) {
                            i(e);
                        }
                    }
                    function c(e) {
                        try {
                            d(a.throw(e));
                        } catch (e) {
                            i(e);
                        }
                    }
                    function d(e) {
                        var t;
                        e.done ? r(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
                            e(t);
                        })).then(o, c);
                    }
                    d((a = a.apply(e, t || [])).next());
                });
            }
            function p(e, t) {
                var n, a, r, i = {
                    label: 0,
                    sent: function() {
                        if (1 & r[0]) throw r[1];
                        return r[1];
                    },
                    trys: [],
                    ops: []
                }, o = Object.create(("function" == typeof Iterator ? Iterator : Object).prototype);
                return o.next = c(0), o.throw = c(1), o.return = c(2), "function" == typeof Symbol && (o[Symbol.iterator] = function() {
                    return this;
                }), o;
                function c(c) {
                    return function(d) {
                        return function(c) {
                            if (n) throw new TypeError("Generator is already executing.");
                            for (;o && (o = 0, c[0] && (i = 0)), i; ) try {
                                if (n = 1, a && (r = 2 & c[0] ? a.return : c[0] ? a.throw || ((r = a.return) && r.call(a), 
                                0) : a.next) && !(r = r.call(a, c[1])).done) return r;
                                switch (a = 0, r && (c = [ 2 & c[0], r.value ]), c[0]) {
                                  case 0:
                                  case 1:
                                    r = c;
                                    break;

                                  case 4:
                                    return i.label++, {
                                        value: c[1],
                                        done: !1
                                    };

                                  case 5:
                                    i.label++, a = c[1], c = [ 0 ];
                                    continue;

                                  case 7:
                                    c = i.ops.pop(), i.trys.pop();
                                    continue;

                                  default:
                                    if (!(r = i.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== c[0] && 2 !== c[0])) {
                                        i = 0;
                                        continue;
                                    }
                                    if (3 === c[0] && (!r || c[1] > r[0] && c[1] < r[3])) {
                                        i.label = c[1];
                                        break;
                                    }
                                    if (6 === c[0] && i.label < r[1]) {
                                        i.label = r[1], r = c;
                                        break;
                                    }
                                    if (r && i.label < r[2]) {
                                        i.label = r[2], i.ops.push(c);
                                        break;
                                    }
                                    r[2] && i.ops.pop(), i.trys.pop();
                                    continue;
                                }
                                c = t.call(e, i);
                            } catch (e) {
                                c = [ 6, e ], a = 0;
                            } finally {
                                n = r = 0;
                            }
                            if (5 & c[0]) throw c[1];
                            return {
                                value: c[0] ? c[1] : void 0,
                                done: !0
                            };
                        }([ c, d ]);
                    };
                }
            }
            var v = Object.create ? function(e, t, n, a) {
                void 0 === a && (a = n);
                var r = Object.getOwnPropertyDescriptor(t, n);
                r && !("get" in r ? !t.__esModule : r.writable || r.configurable) || (r = {
                    enumerable: !0,
                    get: function() {
                        return t[n];
                    }
                }), Object.defineProperty(e, a, r);
            } : function(e, t, n, a) {
                void 0 === a && (a = n), e[a] = t[n];
            };
            function m(e, t) {
                for (var n in e) "default" === n || Object.prototype.hasOwnProperty.call(t, n) || v(t, e, n);
            }
            function g(e) {
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
            function b(e, t) {
                var n = "function" == typeof Symbol && e[Symbol.iterator];
                if (!n) return e;
                var a, r, i = n.call(e), o = [];
                try {
                    for (;(void 0 === t || t-- > 0) && !(a = i.next()).done; ) o.push(a.value);
                } catch (e) {
                    r = {
                        error: e
                    };
                } finally {
                    try {
                        a && !a.done && (n = i.return) && n.call(i);
                    } finally {
                        if (r) throw r.error;
                    }
                }
                return o;
            }
            function I() {
                for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(b(arguments[t]));
                return e;
            }
            function _() {
                for (var e = 0, t = 0, n = arguments.length; t < n; t++) e += arguments[t].length;
                var a = Array(e), r = 0;
                for (t = 0; t < n; t++) for (var i = arguments[t], o = 0, c = i.length; o < c; o++, 
                r++) a[r] = i[o];
                return a;
            }
            function w(e, t, n) {
                if (n || 2 === arguments.length) for (var a, r = 0, i = t.length; r < i; r++) !a && r in t || (a || (a = Array.prototype.slice.call(t, 0, r)), 
                a[r] = t[r]);
                return e.concat(a || Array.prototype.slice.call(t));
            }
            function k(e) {
                return this instanceof k ? (this.v = e, this) : new k(e);
            }
            function P(e, t, n) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var a, r = n.apply(e, t || []), i = [];
                return a = Object.create(("function" == typeof AsyncIterator ? AsyncIterator : Object).prototype), 
                o("next"), o("throw"), o("return", function(e) {
                    return function(t) {
                        return Promise.resolve(t).then(e, s);
                    };
                }), a[Symbol.asyncIterator] = function() {
                    return this;
                }, a;
                function o(e, t) {
                    r[e] && (a[e] = function(t) {
                        return new Promise(function(n, a) {
                            i.push([ e, t, n, a ]) > 1 || c(e, t);
                        });
                    }, t && (a[e] = t(a[e])));
                }
                function c(e, t) {
                    try {
                        (n = r[e](t)).value instanceof k ? Promise.resolve(n.value.v).then(d, s) : l(i[0][2], n);
                    } catch (e) {
                        l(i[0][3], e);
                    }
                    var n;
                }
                function d(e) {
                    c("next", e);
                }
                function s(e) {
                    c("throw", e);
                }
                function l(e, t) {
                    e(t), i.shift(), i.length && c(i[0][0], i[0][1]);
                }
            }
            function S(e) {
                var t, n;
                return t = {}, a("next"), a("throw", function(e) {
                    throw e;
                }), a("return"), t[Symbol.iterator] = function() {
                    return this;
                }, t;
                function a(a, r) {
                    t[a] = e[a] ? function(t) {
                        return (n = !n) ? {
                            value: k(e[a](t)),
                            done: !1
                        } : r ? r(t) : t;
                    } : r;
                }
            }
            function O(e) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var t, n = e[Symbol.asyncIterator];
                return n ? n.call(e) : (e = g(e), t = {}, a("next"), a("throw"), a("return"), t[Symbol.asyncIterator] = function() {
                    return this;
                }, t);
                function a(n) {
                    t[n] = e[n] && function(t) {
                        return new Promise(function(a, r) {
                            (function(e, t, n, a) {
                                Promise.resolve(a).then(function(t) {
                                    e({
                                        value: t,
                                        done: n
                                    });
                                }, t);
                            })(a, r, (t = e[n](t)).done, t.value);
                        });
                    };
                }
            }
            function j(e, t) {
                return Object.defineProperty ? Object.defineProperty(e, "raw", {
                    value: t
                }) : e.raw = t, e;
            }
            var A = Object.create ? function(e, t) {
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
                if (null != e) for (var n = C(e), a = 0; a < n.length; a++) "default" !== n[a] && v(t, e, n[a]);
                return A(t, e), t;
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
            function x(e, t, n, a, r) {
                if ("m" === a) throw new TypeError("Private method is not writable");
                if ("a" === a && !r) throw new TypeError("Private accessor was defined without a setter");
                if ("function" == typeof t ? e !== t || !r : !t.has(e)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
                return "a" === a ? r.call(e, n) : r ? r.value = n : t.set(e, n), n;
            }
            function D(e, t) {
                if (null === t || "object" != typeof t && "function" != typeof t) throw new TypeError("Cannot use 'in' operator on non-object");
                return "function" == typeof e ? t === e : e.has(t);
            }
            function T(e, t, n) {
                if (null != t) {
                    if ("object" != typeof t && "function" != typeof t) throw new TypeError("Object expected.");
                    var a, r;
                    if (n) {
                        if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
                        a = t[Symbol.asyncDispose];
                    }
                    if (void 0 === a) {
                        if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
                        a = t[Symbol.dispose], n && (r = a);
                    }
                    if ("function" != typeof a) throw new TypeError("Object not disposable.");
                    r && (a = function() {
                        try {
                            r.call(this);
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
                return function r() {
                    for (;n = e.stack.pop(); ) try {
                        if (!n.async && 1 === a) return a = 0, e.stack.push(n), Promise.resolve().then(r);
                        if (n.dispose) {
                            var i = n.dispose.call(n.value);
                            if (n.async) return a |= 2, Promise.resolve(i).then(r, function(e) {
                                return t(e), r();
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
                return "string" == typeof e && /^\.\.?\//.test(e) ? e.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(e, n, a, r, i) {
                    return n ? t ? ".jsx" : ".js" : !a || r && i ? a + r + "." + i.toLowerCase() + "js" : e;
                }) : e;
            }
            const H = {
                __extends: r,
                __assign: i,
                __rest: o,
                __decorate: c,
                __param: d,
                __esDecorate: s,
                __runInitializers: l,
                __propKey: u,
                __setFunctionName: y,
                __metadata: f,
                __awaiter: h,
                __generator: p,
                __createBinding: v,
                __exportStar: m,
                __values: g,
                __read: b,
                __spread: I,
                __spreadArrays: _,
                __spreadArray: w,
                __await: k,
                __asyncGenerator: P,
                __asyncDelegator: S,
                __asyncValues: O,
                __makeTemplateObject: j,
                __importStar: E,
                __importDefault: R,
                __classPrivateFieldGet: B,
                __classPrivateFieldSet: x,
                __classPrivateFieldIn: D,
                __addDisposableResource: T,
                __disposeResources: K,
                __rewriteRelativeImportExtension: F
            };
        }
    }, t = {};
    function n(a) {
        var r = t[a];
        if (void 0 !== r) return r.exports;
        var i = t[a] = {
            exports: {}
        };
        return e[a](i, i.exports, n), i.exports;
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
        }), e.handleEmergencyCancelled = e.handleEmergencyResumed = e.handleEmergencyPaused = e.handlePaymentIntentExpired = e.handlePaymentIntentCancelled = e.handlePaymentIntentRefunded = e.handlePaymentIntentClaimed = e.handlePaymentIntentFunded = e.handlePaymentIntentCreated = e.handleIdentityDisabled = e.handleIdentityUnfrozen = e.handleIdentityFrozen = e.handleTransportRevoked = e.handleTransportVerified = e.handleTransportBound = e.handleActiveRelationPolicySet = e.handleActiveAuthRegistrySet = e.handleActiveAgentRegistrySet = e.handleActiveProfileSet = e.handleIdentityKeyRevoked = e.handleIdentityKeyAdded = e.handleRecoveryKeySet = e.handleOwnerKeyRotated = e.handleIdentityRegistered = e.handleBlock = void 0;
        var t = n(751);
        Object.defineProperty(e, "handleBlock", {
            enumerable: !0,
            get: function() {
                return t.handleBlock;
            }
        });
        var r = n(957);
        Object.defineProperty(e, "handleIdentityRegistered", {
            enumerable: !0,
            get: function() {
                return r.handleIdentityRegistered;
            }
        }), Object.defineProperty(e, "handleOwnerKeyRotated", {
            enumerable: !0,
            get: function() {
                return r.handleOwnerKeyRotated;
            }
        }), Object.defineProperty(e, "handleRecoveryKeySet", {
            enumerable: !0,
            get: function() {
                return r.handleRecoveryKeySet;
            }
        }), Object.defineProperty(e, "handleIdentityKeyAdded", {
            enumerable: !0,
            get: function() {
                return r.handleIdentityKeyAdded;
            }
        }), Object.defineProperty(e, "handleIdentityKeyRevoked", {
            enumerable: !0,
            get: function() {
                return r.handleIdentityKeyRevoked;
            }
        }), Object.defineProperty(e, "handleActiveProfileSet", {
            enumerable: !0,
            get: function() {
                return r.handleActiveProfileSet;
            }
        }), Object.defineProperty(e, "handleActiveAgentRegistrySet", {
            enumerable: !0,
            get: function() {
                return r.handleActiveAgentRegistrySet;
            }
        }), Object.defineProperty(e, "handleActiveAuthRegistrySet", {
            enumerable: !0,
            get: function() {
                return r.handleActiveAuthRegistrySet;
            }
        }), Object.defineProperty(e, "handleActiveRelationPolicySet", {
            enumerable: !0,
            get: function() {
                return r.handleActiveRelationPolicySet;
            }
        }), Object.defineProperty(e, "handleTransportBound", {
            enumerable: !0,
            get: function() {
                return r.handleTransportBound;
            }
        }), Object.defineProperty(e, "handleTransportVerified", {
            enumerable: !0,
            get: function() {
                return r.handleTransportVerified;
            }
        }), Object.defineProperty(e, "handleTransportRevoked", {
            enumerable: !0,
            get: function() {
                return r.handleTransportRevoked;
            }
        }), Object.defineProperty(e, "handleIdentityFrozen", {
            enumerable: !0,
            get: function() {
                return r.handleIdentityFrozen;
            }
        }), Object.defineProperty(e, "handleIdentityUnfrozen", {
            enumerable: !0,
            get: function() {
                return r.handleIdentityUnfrozen;
            }
        }), Object.defineProperty(e, "handleIdentityDisabled", {
            enumerable: !0,
            get: function() {
                return r.handleIdentityDisabled;
            }
        });
        var i = n(634);
        Object.defineProperty(e, "handlePaymentIntentCreated", {
            enumerable: !0,
            get: function() {
                return i.handlePaymentIntentCreated;
            }
        }), Object.defineProperty(e, "handlePaymentIntentFunded", {
            enumerable: !0,
            get: function() {
                return i.handlePaymentIntentFunded;
            }
        }), Object.defineProperty(e, "handlePaymentIntentClaimed", {
            enumerable: !0,
            get: function() {
                return i.handlePaymentIntentClaimed;
            }
        }), Object.defineProperty(e, "handlePaymentIntentRefunded", {
            enumerable: !0,
            get: function() {
                return i.handlePaymentIntentRefunded;
            }
        }), Object.defineProperty(e, "handlePaymentIntentCancelled", {
            enumerable: !0,
            get: function() {
                return i.handlePaymentIntentCancelled;
            }
        }), Object.defineProperty(e, "handlePaymentIntentExpired", {
            enumerable: !0,
            get: function() {
                return i.handlePaymentIntentExpired;
            }
        });
        var o = n(823);
        Object.defineProperty(e, "handleEmergencyPaused", {
            enumerable: !0,
            get: function() {
                return o.handleEmergencyPaused;
            }
        }), Object.defineProperty(e, "handleEmergencyResumed", {
            enumerable: !0,
            get: function() {
                return o.handleEmergencyResumed;
            }
        }), Object.defineProperty(e, "handleEmergencyCancelled", {
            enumerable: !0,
            get: function() {
                return o.handleEmergencyCancelled;
            }
        }), n(197);
    })();
    var r = exports;
    for (var i in a) r[i] = a[i];
    a.__esModule && Object.defineProperty(r, "__esModule", {
        value: !0
    });
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QkFBYyxPQUFPMlcsRUFBZ0I3UTtBQUEyQjtZQUNySm5ILE9BQU9DLGVBQWVDLEdBQVMsOEJBQThCO1lBQUV3VCxhQUFZO1lBQU1yUyxLQUFLO2dCQUFjLE9BQU8yVyxFQUFnQjlRO0FBQTRCO1lBQ3ZKbEgsT0FBT0MsZUFBZUMsR0FBUywrQkFBK0I7WUFBRXdULGFBQVk7WUFBTXJTLEtBQUs7Z0JBQWMsT0FBTzJXLEVBQWdCL1E7QUFBNkI7WUFDekpqSCxPQUFPQyxlQUFlQyxHQUFTLGdDQUFnQztZQUFFd1QsYUFBWTtZQUFNclMsS0FBSztnQkFBYyxPQUFPMlcsRUFBZ0JoUjtBQUE4QjtZQUMzSmhILE9BQU9DLGVBQWVDLEdBQVMsOEJBQThCO1lBQUV3VCxhQUFZO1lBQU1yUyxLQUFLO2dCQUFjLE9BQU8yVyxFQUFnQmpSO0FBQTRCOztRQUN2SixJQUFJa1IsSUFBYyxFQUFRO1FBQzFCalksT0FBT0MsZUFBZUMsR0FBUyx5QkFBeUI7WUFBRXdULGFBQVk7WUFBTXJTLEtBQUs7Z0JBQWMsT0FBTzRXLEVBQVlqVztBQUF1QjtZQUN6SWhDLE9BQU9DLGVBQWVDLEdBQVMsMEJBQTBCO1lBQUV3VCxhQUFZO1lBQU1yUyxLQUFLO2dCQUFjLE9BQU80VyxFQUFZbFc7QUFBd0I7WUFDM0kvQixPQUFPQyxlQUFlQyxHQUFTLDRCQUE0QjtZQUFFd1QsYUFBWTtZQUFNclMsS0FBSztnQkFBYyxPQUFPNFcsRUFBWW5XO0FBQTBCO1lBQy9JLEVBQVEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL21hcHBpbmdzL2Jsb2NrLnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvbWFwcGluZ3MvZW1lcmdlbmN5LnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvbWFwcGluZ3MvaWRlbnRpdHlDb3JlLnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvbWFwcGluZ3MvcGF5bWVudEludGVudC50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL21hcHBpbmdzL3V0aWxzLnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvdHlwZXMvbW9kZWxzL0NoYWluQ2hlY2twb2ludC50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL3R5cGVzL21vZGVscy9DaGFpbklkZW50aXR5LnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvdHlwZXMvbW9kZWxzL0VtZXJnZW5jeVN0YXR1cy50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL3R5cGVzL21vZGVscy9JZGVudGl0eUtleS50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL3R5cGVzL21vZGVscy9QYXltZW50SW50ZW50LnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvdHlwZXMvbW9kZWxzL1NldHRsZW1lbnRFdmVudC50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJhc3NlcnRcIiIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC9hcGktYmFzZS9wYWNrYWdlSW5mby5qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC90eXBlcy9wYWNrYWdlSW5mby5qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC90eXBlcy1jb2RlYy9wYWNrYWdlSW5mby5qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC94LWdsb2JhbC9pbmRleC5qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC91dGlsL2RldGVjdFBhY2thZ2UuanMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL25vZGVfbW9kdWxlcy9AcG9sa2Fkb3QvdXRpbC9pcy9mdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC9hcGktYXVnbWVudC9wYWNrYWdlSW5mby5qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC9hcGktYXVnbWVudC9wYWNrYWdlRGV0ZWN0LmpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2Lm1qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaGFuZGxlQmxvY2sgPSB2b2lkIDA7XG5jb25zdCBDaGFpbkNoZWNrcG9pbnRfMSA9IHJlcXVpcmUoXCIuLi90eXBlcy9tb2RlbHMvQ2hhaW5DaGVja3BvaW50XCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQmxvY2soYmxvY2spIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGNvbnN0IGJsb2NrTnVtYmVyID0gQmlnSW50KGJsb2NrLmJsb2NrLmhlYWRlci5udW1iZXIudG9TdHJpbmcoKSk7XG4gICAgY29uc3QgYmxvY2tIYXNoID0gYmxvY2suYmxvY2suaGVhZGVyLmhhc2gudG9IZXgoKTtcbiAgICBsZXQgY2hlY2twb2ludCA9IGF3YWl0IENoYWluQ2hlY2twb2ludF8xLkNoYWluQ2hlY2twb2ludC5nZXQodXRpbHNfMS5DSEFJTl9JRCk7XG4gICAgaWYgKCFjaGVja3BvaW50KSB7XG4gICAgICAgIGNoZWNrcG9pbnQgPSBDaGFpbkNoZWNrcG9pbnRfMS5DaGFpbkNoZWNrcG9pbnQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiB1dGlsc18xLkNIQUlOX0lELFxuICAgICAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgICAgIGJsb2NrTnVtYmVyLFxuICAgICAgICAgICAgYmxvY2tIYXNoLFxuICAgICAgICAgICAgdXBkYXRlZEF0OiAoX2EgPSBibG9jay50aW1lc3RhbXApICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG5ldyBEYXRlKCksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY2hlY2twb2ludC5ibG9ja051bWJlciA9IGJsb2NrTnVtYmVyO1xuICAgICAgICBjaGVja3BvaW50LmJsb2NrSGFzaCA9IGJsb2NrSGFzaDtcbiAgICAgICAgY2hlY2twb2ludC51cGRhdGVkQXQgPSAoX2IgPSBibG9jay50aW1lc3RhbXApICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IG5ldyBEYXRlKCk7XG4gICAgfVxuICAgIGF3YWl0IGNoZWNrcG9pbnQuc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVCbG9jayA9IGhhbmRsZUJsb2NrO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIE1hcHBpbmcgaGFuZGxlcnMgZm9yIHBhbGxldF92aWJseV9lbWVyZ2VuY3kgZXZlbnRzLlxuICpcbiAqIEV2ZW50cyBoYW5kbGVkOiBQYXVzZWQsIFJlc3VtZWQsIENhbmNlbGxlZFxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhbmRsZUVtZXJnZW5jeUNhbmNlbGxlZCA9IGV4cG9ydHMuaGFuZGxlRW1lcmdlbmN5UmVzdW1lZCA9IGV4cG9ydHMuaGFuZGxlRW1lcmdlbmN5UGF1c2VkID0gdm9pZCAwO1xuY29uc3QgRW1lcmdlbmN5U3RhdHVzXzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvbW9kZWxzL0VtZXJnZW5jeVN0YXR1c1wiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbi8vIOKUgOKUgOKUgCBoZWxwZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuZnVuY3Rpb24gYmxvY2tOdW0oYmxvY2spIHtcbiAgICByZXR1cm4gQmlnSW50KGJsb2NrLmJsb2NrLmhlYWRlci5udW1iZXIudG9TdHJpbmcoKSk7XG59XG4vKiogU2VyaWFsaXplIEVtZXJnZW5jeVNjb3BlIGVudW0gdG8gYSBzdGFibGUgc3RyaW5nIGtleS4gKi9cbmZ1bmN0aW9uIHNlcmlhbGl6ZVNjb3BlKHNjb3BlUmF3KSB7XG4gICAgY29uc3QganNvbiA9IHNjb3BlUmF3LnRvSlNPTigpO1xuICAgIGlmICh0eXBlb2YganNvbiA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgcmV0dXJuIGpzb247XG4gICAgLy8gRW51bSB2YXJpYW50cyB3aXRoIGEgcGF5bG9hZCBjb21lIGFzIHsgdmFyaWFudE5hbWU6IHZhbHVlIH1cbiAgICBpZiAoanNvbiAhPT0gbnVsbCAmJiB0eXBlb2YganNvbiA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMoanNvbik7XG4gICAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgY29uc3QgW25hbWUsIHZhbF0gPSBlbnRyaWVzWzBdO1xuICAgICAgICAgICAgcmV0dXJuIGAke25hbWV9OiR7dmFsfWA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGpzb24pO1xufVxuZnVuY3Rpb24gb3B0SGV4KHJhdykge1xuICAgIGlmIChyYXcgPT09IG51bGwgfHwgcmF3ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJhdy50b1N0cmluZygpO1xufVxuYXN5bmMgZnVuY3Rpb24gdXBzZXJ0RW1lcmdlbmN5U3RhdHVzKGV2ZW50LCBzdGF0dXMpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IHNjb3BlID0gc2VyaWFsaXplU2NvcGUoZGF0YVswXSk7XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgLy8gUGF1c2VkOiAgW3Njb3BlLCBieSwgcmVhc29uX2hhc2hdXG4gICAgLy8gUmVzdW1lZDogW3Njb3BlLCByZWFzb25faGFzaF1cbiAgICAvLyBDYW5jZWxsZWQ6IFtzY29wZSwgcmVhc29uX2hhc2hdXG4gICAgbGV0IHVwZGF0ZWRCeTtcbiAgICBsZXQgcmVhc29uSGFzaDtcbiAgICBpZiAoc3RhdHVzID09PSBcIlBhdXNlZFwiKSB7XG4gICAgICAgIHVwZGF0ZWRCeSA9IGRhdGFbMV0udG9TdHJpbmcoKTtcbiAgICAgICAgcmVhc29uSGFzaCA9IG9wdEhleChkYXRhWzJdLnRvSlNPTigpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJlYXNvbkhhc2ggPSBvcHRIZXgoZGF0YVsxXS50b0pTT04oKSk7XG4gICAgfVxuICAgIGNvbnN0IGlkID0gKDAsIHV0aWxzXzEuZW1lcmdlbmN5U3RhdHVzRW50aXR5SWQpKHNjb3BlKTtcbiAgICBsZXQgZXMgPSBhd2FpdCBFbWVyZ2VuY3lTdGF0dXNfMS5FbWVyZ2VuY3lTdGF0dXMuZ2V0KGlkKTtcbiAgICBpZiAoIWVzKSB7XG4gICAgICAgIGVzID0gRW1lcmdlbmN5U3RhdHVzXzEuRW1lcmdlbmN5U3RhdHVzLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIGNoYWluSWQ6IHV0aWxzXzEuQ0hBSU5fSUQsXG4gICAgICAgICAgICBzY29wZSxcbiAgICAgICAgICAgIHN0YXR1cyxcbiAgICAgICAgICAgIHJlYXNvbkhhc2gsXG4gICAgICAgICAgICB1cGRhdGVkQnksXG4gICAgICAgICAgICB1cGRhdGVkQXRCbG9jazogYm4sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZXMuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICBlcy5yZWFzb25IYXNoID0gcmVhc29uSGFzaDtcbiAgICAgICAgZXMudXBkYXRlZEJ5ID0gdXBkYXRlZEJ5O1xuICAgICAgICBlcy51cGRhdGVkQXRCbG9jayA9IGJuO1xuICAgIH1cbiAgICBhd2FpdCBlcy5zYXZlKCk7XG59XG4vLyDilIDilIDilIAgSGFuZGxlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVFbWVyZ2VuY3lQYXVzZWQoZXZlbnQpIHtcbiAgICBhd2FpdCB1cHNlcnRFbWVyZ2VuY3lTdGF0dXMoZXZlbnQsIFwiUGF1c2VkXCIpO1xufVxuZXhwb3J0cy5oYW5kbGVFbWVyZ2VuY3lQYXVzZWQgPSBoYW5kbGVFbWVyZ2VuY3lQYXVzZWQ7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVFbWVyZ2VuY3lSZXN1bWVkKGV2ZW50KSB7XG4gICAgYXdhaXQgdXBzZXJ0RW1lcmdlbmN5U3RhdHVzKGV2ZW50LCBcIkFjdGl2ZVwiKTtcbn1cbmV4cG9ydHMuaGFuZGxlRW1lcmdlbmN5UmVzdW1lZCA9IGhhbmRsZUVtZXJnZW5jeVJlc3VtZWQ7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVFbWVyZ2VuY3lDYW5jZWxsZWQoZXZlbnQpIHtcbiAgICBhd2FpdCB1cHNlcnRFbWVyZ2VuY3lTdGF0dXMoZXZlbnQsIFwiQ2FuY2VsbGVkXCIpO1xufVxuZXhwb3J0cy5oYW5kbGVFbWVyZ2VuY3lDYW5jZWxsZWQgPSBoYW5kbGVFbWVyZ2VuY3lDYW5jZWxsZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogTWFwcGluZyBoYW5kbGVycyBmb3IgcGFsbGV0X2lkZW50aXR5X2NvcmUgZXZlbnRzLlxuICpcbiAqIEV2ZW50cyBoYW5kbGVkOlxuICogICBJZGVudGl0eVJlZ2lzdGVyZWQsIE93bmVyS2V5Um90YXRlZCwgUmVjb3ZlcnlLZXlTZXQsXG4gKiAgIElkZW50aXR5S2V5QWRkZWQsIElkZW50aXR5S2V5UmV2b2tlZCxcbiAqICAgQWN0aXZlUHJvZmlsZVNldCwgQWN0aXZlQWdlbnRSZWdpc3RyeVNldCwgQWN0aXZlQXV0aFJlZ2lzdHJ5U2V0LCBBY3RpdmVSZWxhdGlvblBvbGljeVNldCxcbiAqICAgVHJhbnNwb3J0Qm91bmQsIFRyYW5zcG9ydFZlcmlmaWVkLCBUcmFuc3BvcnRSZXZva2VkLFxuICogICBJZGVudGl0eUZyb3plbiwgSWRlbnRpdHlVbmZyb3plbiwgSWRlbnRpdHlEaXNhYmxlZFxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhbmRsZUlkZW50aXR5RGlzYWJsZWQgPSBleHBvcnRzLmhhbmRsZUlkZW50aXR5VW5mcm96ZW4gPSBleHBvcnRzLmhhbmRsZUlkZW50aXR5RnJvemVuID0gZXhwb3J0cy5oYW5kbGVUcmFuc3BvcnRSZXZva2VkID0gZXhwb3J0cy5oYW5kbGVUcmFuc3BvcnRWZXJpZmllZCA9IGV4cG9ydHMuaGFuZGxlVHJhbnNwb3J0Qm91bmQgPSBleHBvcnRzLmhhbmRsZUFjdGl2ZVJlbGF0aW9uUG9saWN5U2V0ID0gZXhwb3J0cy5oYW5kbGVBY3RpdmVBdXRoUmVnaXN0cnlTZXQgPSBleHBvcnRzLmhhbmRsZUFjdGl2ZUFnZW50UmVnaXN0cnlTZXQgPSBleHBvcnRzLmhhbmRsZUFjdGl2ZVByb2ZpbGVTZXQgPSBleHBvcnRzLmhhbmRsZUlkZW50aXR5S2V5UmV2b2tlZCA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlLZXlBZGRlZCA9IGV4cG9ydHMuaGFuZGxlUmVjb3ZlcnlLZXlTZXQgPSBleHBvcnRzLmhhbmRsZU93bmVyS2V5Um90YXRlZCA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlSZWdpc3RlcmVkID0gdm9pZCAwO1xuY29uc3QgQ2hhaW5JZGVudGl0eV8xID0gcmVxdWlyZShcIi4uL3R5cGVzL21vZGVscy9DaGFpbklkZW50aXR5XCIpO1xuY29uc3QgSWRlbnRpdHlLZXlfMSA9IHJlcXVpcmUoXCIuLi90eXBlcy9tb2RlbHMvSWRlbnRpdHlLZXlcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG4vLyDilIDilIDilIAgaGVscGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmZ1bmN0aW9uIHN0cih2KSB7XG4gICAgcmV0dXJuIHYudG9TdHJpbmcoKTtcbn1cbmZ1bmN0aW9uIGJsb2NrTnVtKGJsb2NrKSB7XG4gICAgcmV0dXJuIEJpZ0ludChibG9jay5ibG9jay5oZWFkZXIubnVtYmVyLnRvU3RyaW5nKCkpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0SWRlbnRpdHkoaWRlbnRpdHlJZCkge1xuICAgIHJldHVybiBDaGFpbklkZW50aXR5XzEuQ2hhaW5JZGVudGl0eS5nZXQoKDAsIHV0aWxzXzEuaWRlbnRpdHlFbnRpdHlJZCkoaWRlbnRpdHlJZCkpO1xufVxuLyoqIFNlcmlhbGl6ZSBhbiBPcHRpb248Q29udGVudFJlZj4gdmFsdWUgZnJvbSBzdG9yYWdlIHF1ZXJ5IEpTT04gdG8gYSBzdHJpbmcgb3IgdW5kZWZpbmVkLiAqL1xuZnVuY3Rpb24gc2VyaWFsaXplQ29udGVudFJlZihyYXcpIHtcbiAgICBpZiAocmF3ID09PSBudWxsIHx8IHJhdyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGlmICh0eXBlb2YgcmF3ID09PSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4gcmF3O1xuICAgIC8vIENvbnRlbnRSZWYgZW5jb2RlcyBhcyB7IGNpZDogc3RyaW5nIH0gb3IgeyB1cmk6IHN0cmluZyB9IGRlcGVuZGluZyBvbiB2YXJpYW50XG4gICAgY29uc3Qgb2JqID0gcmF3O1xuICAgIGlmIChvYmpbXCJjaWRcIl0pXG4gICAgICAgIHJldHVybiBTdHJpbmcob2JqW1wiY2lkXCJdKTtcbiAgICBpZiAob2JqW1widXJpXCJdKVxuICAgICAgICByZXR1cm4gU3RyaW5nKG9ialtcInVyaVwiXSk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHJhdyk7XG59XG4vLyDilIDilIDilIAgSWRlbnRpdHlSZWdpc3RlcmVkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSWRlbnRpdHlSZWdpc3RlcmVkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IG93bmVyID0gc3RyKGRhdGFbMV0pO1xuICAgIGNvbnN0IGJuID0gYmxvY2tOdW0oYmxvY2spO1xuICAgIGNvbnN0IGlkID0gKDAsIHV0aWxzXzEuaWRlbnRpdHlFbnRpdHlJZCkoaWRlbnRpdHlJZCk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBDaGFpbklkZW50aXR5XzEuQ2hhaW5JZGVudGl0eS5jcmVhdGUoe1xuICAgICAgICBpZCxcbiAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgaWRlbnRpdHlJZCxcbiAgICAgICAgb3duZXIsXG4gICAgICAgIHN0YXR1czogXCJBY3RpdmVcIixcbiAgICAgICAgY3JlYXRlZEF0QmxvY2s6IGJuLFxuICAgICAgICB1cGRhdGVkQXRCbG9jazogYm4sXG4gICAgfSk7XG4gICAgYXdhaXQgaWRlbnRpdHkuc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVJZGVudGl0eVJlZ2lzdGVyZWQgPSBoYW5kbGVJZGVudGl0eVJlZ2lzdGVyZWQ7XG4vLyDilIDilIDilIAgT3duZXJLZXlSb3RhdGVkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlT3duZXJLZXlSb3RhdGVkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIC8vIGRhdGFbMV0gPSBvbGRfb3duZXIgKGlnbm9yZWQpLCBkYXRhWzJdID0gbmV3X293bmVyXG4gICAgY29uc3QgbmV3T3duZXIgPSBzdHIoZGF0YVsyXSk7XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoIWlkZW50aXR5KVxuICAgICAgICByZXR1cm47XG4gICAgaWRlbnRpdHkub3duZXIgPSBuZXdPd25lcjtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJuO1xuICAgIGF3YWl0IGlkZW50aXR5LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlT3duZXJLZXlSb3RhdGVkID0gaGFuZGxlT3duZXJLZXlSb3RhdGVkO1xuLy8g4pSA4pSA4pSAIFJlY292ZXJ5S2V5U2V0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUmVjb3ZlcnlLZXlTZXQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoIWlkZW50aXR5KVxuICAgICAgICByZXR1cm47XG4gICAgaWRlbnRpdHkudXBkYXRlZEF0QmxvY2sgPSBibjtcbiAgICBhd2FpdCBpZGVudGl0eS5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZVJlY292ZXJ5S2V5U2V0ID0gaGFuZGxlUmVjb3ZlcnlLZXlTZXQ7XG4vLyDilIDilIDilIAgSWRlbnRpdHlLZXlBZGRlZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUlkZW50aXR5S2V5QWRkZWQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3Qga2V5SWQgPSBzdHIoZGF0YVsxXSk7XG4gICAgY29uc3QgcHVycG9zZVJhdyA9IGRhdGFbMl07XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgLy8gcHVycG9zZSBpcyBLZXlQdXJwb3NlIGVudW07IHNlcmlhbGl6ZSB0byBzdHJpbmdcbiAgICBjb25zdCBwdXJwb3NlSnNvbiA9IHB1cnBvc2VSYXcudG9KU09OKCk7XG4gICAgY29uc3QgcHVycG9zZSA9IHR5cGVvZiBwdXJwb3NlSnNvbiA9PT0gXCJzdHJpbmdcIlxuICAgICAgICA/IHB1cnBvc2VKc29uXG4gICAgICAgIDogSlNPTi5zdHJpbmdpZnkocHVycG9zZUpzb24pO1xuICAgIC8vIFRoZSBhdXRob3JpemVkIGtleSBhY2NvdW50IGlzIG5vdCBpbiB0aGUgZXZlbnQ7IHN0b3JlIGtleUlkIGFuZCBpZGVudGl0eUlkIGZvciBsb29rdXBcbiAgICBjb25zdCBrZXkgPSBJZGVudGl0eUtleV8xLklkZW50aXR5S2V5LmNyZWF0ZSh7XG4gICAgICAgIGlkOiAoMCwgdXRpbHNfMS5pZGVudGl0eUtleUVudGl0eUlkKShrZXlJZCksXG4gICAgICAgIGNoYWluSWQ6IHV0aWxzXzEuQ0hBSU5fSUQsXG4gICAgICAgIGlkZW50aXR5SWQsXG4gICAgICAgIGtleUlkLFxuICAgICAgICBhY2NvdW50OiBcIlwiLCAvLyBmaWxsZWQgYmVsb3cgdmlhIHN0b3JhZ2UgcXVlcnlcbiAgICAgICAgcHVycG9zZSxcbiAgICAgICAgc3RhdHVzOiBcIkFjdGl2ZVwiLFxuICAgICAgICB1cGRhdGVkQXRCbG9jazogYm4sXG4gICAgfSk7XG4gICAgLy8gUXVlcnkgc3RvcmFnZSB0byBnZXQgdGhlIGFjY291bnRcbiAgICB0cnkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCBhcGkucXVlcnkuaWRlbnRpdHlDb3JlLmF1dGhvcml6ZWRLZXlzKGtleUlkKTtcbiAgICAgICAgY29uc3QgcmVjb3JkSnNvbiA9IHJlY29yZC50b0pTT04oKTtcbiAgICAgICAgaWYgKHJlY29yZEpzb24gJiYgcmVjb3JkSnNvbltcImFjY291bnRcIl0pIHtcbiAgICAgICAgICAgIGtleS5hY2NvdW50ID0gU3RyaW5nKHJlY29yZEpzb25bXCJhY2NvdW50XCJdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoXykge1xuICAgICAgICAvLyBzdG9yYWdlIHF1ZXJ5IGZhaWxlZDsgYWNjb3VudCByZW1haW5zIGVtcHR5XG4gICAgfVxuICAgIGF3YWl0IGtleS5zYXZlKCk7XG4gICAgLy8gdXBkYXRlIGlkZW50aXR5IG5vbmNlIC8gdXBkYXRlZEF0QmxvY2tcbiAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IGdldElkZW50aXR5KGlkZW50aXR5SWQpO1xuICAgIGlmIChpZGVudGl0eSkge1xuICAgICAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJuO1xuICAgICAgICBhd2FpdCBpZGVudGl0eS5zYXZlKCk7XG4gICAgfVxufVxuZXhwb3J0cy5oYW5kbGVJZGVudGl0eUtleUFkZGVkID0gaGFuZGxlSWRlbnRpdHlLZXlBZGRlZDtcbi8vIOKUgOKUgOKUgCBJZGVudGl0eUtleVJldm9rZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVJZGVudGl0eUtleVJldm9rZWQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGtleUlkID0gc3RyKGRhdGFbMV0pO1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgY29uc3Qga2V5ID0gYXdhaXQgSWRlbnRpdHlLZXlfMS5JZGVudGl0eUtleS5nZXQoKDAsIHV0aWxzXzEuaWRlbnRpdHlLZXlFbnRpdHlJZCkoa2V5SWQpKTtcbiAgICBpZiAoa2V5KSB7XG4gICAgICAgIGtleS5zdGF0dXMgPSBcIlJldm9rZWRcIjtcbiAgICAgICAga2V5LnVwZGF0ZWRBdEJsb2NrID0gYm47XG4gICAgICAgIGF3YWl0IGtleS5zYXZlKCk7XG4gICAgfVxuICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgZ2V0SWRlbnRpdHkoaWRlbnRpdHlJZCk7XG4gICAgaWYgKGlkZW50aXR5KSB7XG4gICAgICAgIGlkZW50aXR5LnVwZGF0ZWRBdEJsb2NrID0gYm47XG4gICAgICAgIGF3YWl0IGlkZW50aXR5LnNhdmUoKTtcbiAgICB9XG59XG5leHBvcnRzLmhhbmRsZUlkZW50aXR5S2V5UmV2b2tlZCA9IGhhbmRsZUlkZW50aXR5S2V5UmV2b2tlZDtcbi8vIOKUgOKUgOKUgCBwb2ludGVyLXNldCBoZWxwZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hJZGVudGl0eVBvaW50ZXJzKGlkZW50aXR5SWQpIHtcbiAgICB0cnkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCBhcGkucXVlcnkuaWRlbnRpdHlDb3JlLmlkZW50aXRpZXMoaWRlbnRpdHlJZCk7XG4gICAgICAgIGNvbnN0IGpzb24gPSByZWNvcmQudG9KU09OKCk7XG4gICAgICAgIGlmICghanNvbilcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFjdGl2ZVByb2ZpbGU6IHNlcmlhbGl6ZUNvbnRlbnRSZWYoanNvbltcImFjdGl2ZVByb2ZpbGVcIl0pLFxuICAgICAgICAgICAgYWN0aXZlQWdlbnRSZWdpc3RyeTogc2VyaWFsaXplQ29udGVudFJlZihqc29uW1wiYWN0aXZlQWdlbnRSZWdpc3RyeVwiXSksXG4gICAgICAgICAgICBhY3RpdmVBdXRoUmVnaXN0cnk6IHNlcmlhbGl6ZUNvbnRlbnRSZWYoanNvbltcImFjdGl2ZUF1dGhSZWdpc3RyeVwiXSksXG4gICAgICAgICAgICBhY3RpdmVSZWxhdGlvblBvbGljeTogc2VyaWFsaXplQ29udGVudFJlZihqc29uW1wiYWN0aXZlUmVsYXRpb25Qb2xpY3lcIl0pLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBjYXRjaCAoXykge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxufVxuLy8g4pSA4pSA4pSAIEFjdGl2ZVByb2ZpbGVTZXQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVBY3RpdmVQcm9maWxlU2V0KGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGJuID0gYmxvY2tOdW0oYmxvY2spO1xuICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgZ2V0SWRlbnRpdHkoaWRlbnRpdHlJZCk7XG4gICAgaWYgKCFpZGVudGl0eSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IHB0cnMgPSBhd2FpdCBmZXRjaElkZW50aXR5UG9pbnRlcnMoaWRlbnRpdHlJZCk7XG4gICAgaWRlbnRpdHkuYWN0aXZlUHJvZmlsZSA9IHB0cnNbXCJhY3RpdmVQcm9maWxlXCJdO1xuICAgIGlkZW50aXR5LnVwZGF0ZWRBdEJsb2NrID0gYm47XG4gICAgYXdhaXQgaWRlbnRpdHkuc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVBY3RpdmVQcm9maWxlU2V0ID0gaGFuZGxlQWN0aXZlUHJvZmlsZVNldDtcbi8vIOKUgOKUgOKUgCBBY3RpdmVBZ2VudFJlZ2lzdHJ5U2V0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQWN0aXZlQWdlbnRSZWdpc3RyeVNldChldmVudCkge1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3QgaWRlbnRpdHlJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBibiA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IGdldElkZW50aXR5KGlkZW50aXR5SWQpO1xuICAgIGlmICghaWRlbnRpdHkpXG4gICAgICAgIHJldHVybjtcbiAgICBjb25zdCBwdHJzID0gYXdhaXQgZmV0Y2hJZGVudGl0eVBvaW50ZXJzKGlkZW50aXR5SWQpO1xuICAgIGlkZW50aXR5LmFjdGl2ZUFnZW50UmVnaXN0cnkgPSBwdHJzW1wiYWN0aXZlQWdlbnRSZWdpc3RyeVwiXTtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJuO1xuICAgIGF3YWl0IGlkZW50aXR5LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlQWN0aXZlQWdlbnRSZWdpc3RyeVNldCA9IGhhbmRsZUFjdGl2ZUFnZW50UmVnaXN0cnlTZXQ7XG4vLyDilIDilIDilIAgQWN0aXZlQXV0aFJlZ2lzdHJ5U2V0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQWN0aXZlQXV0aFJlZ2lzdHJ5U2V0KGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGJuID0gYmxvY2tOdW0oYmxvY2spO1xuICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgZ2V0SWRlbnRpdHkoaWRlbnRpdHlJZCk7XG4gICAgaWYgKCFpZGVudGl0eSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IHB0cnMgPSBhd2FpdCBmZXRjaElkZW50aXR5UG9pbnRlcnMoaWRlbnRpdHlJZCk7XG4gICAgaWRlbnRpdHkuYWN0aXZlQXV0aFJlZ2lzdHJ5ID0gcHRyc1tcImFjdGl2ZUF1dGhSZWdpc3RyeVwiXTtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJuO1xuICAgIGF3YWl0IGlkZW50aXR5LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlQWN0aXZlQXV0aFJlZ2lzdHJ5U2V0ID0gaGFuZGxlQWN0aXZlQXV0aFJlZ2lzdHJ5U2V0O1xuLy8g4pSA4pSA4pSAIEFjdGl2ZVJlbGF0aW9uUG9saWN5U2V0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQWN0aXZlUmVsYXRpb25Qb2xpY3lTZXQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoIWlkZW50aXR5KVxuICAgICAgICByZXR1cm47XG4gICAgY29uc3QgcHRycyA9IGF3YWl0IGZldGNoSWRlbnRpdHlQb2ludGVycyhpZGVudGl0eUlkKTtcbiAgICBpZGVudGl0eS5hY3RpdmVSZWxhdGlvblBvbGljeSA9IHB0cnNbXCJhY3RpdmVSZWxhdGlvblBvbGljeVwiXTtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJuO1xuICAgIGF3YWl0IGlkZW50aXR5LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlQWN0aXZlUmVsYXRpb25Qb2xpY3lTZXQgPSBoYW5kbGVBY3RpdmVSZWxhdGlvblBvbGljeVNldDtcbi8vIOKUgOKUgOKUgCBUcmFuc3BvcnQgZXZlbnRzIChubyBzY2hlbWEgZW50aXR5OyB1cGRhdGUgaWRlbnRpdHkgdGltZXN0YW1wKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIHRvdWNoSWRlbnRpdHkoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoIWlkZW50aXR5KVxuICAgICAgICByZXR1cm47XG4gICAgaWRlbnRpdHkudXBkYXRlZEF0QmxvY2sgPSBibG9ja051bShibG9jayk7XG4gICAgYXdhaXQgaWRlbnRpdHkuc2F2ZSgpO1xufVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlVHJhbnNwb3J0Qm91bmQoZXZlbnQpIHtcbiAgICBhd2FpdCB0b3VjaElkZW50aXR5KGV2ZW50KTtcbn1cbmV4cG9ydHMuaGFuZGxlVHJhbnNwb3J0Qm91bmQgPSBoYW5kbGVUcmFuc3BvcnRCb3VuZDtcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVRyYW5zcG9ydFZlcmlmaWVkKGV2ZW50KSB7XG4gICAgYXdhaXQgdG91Y2hJZGVudGl0eShldmVudCk7XG59XG5leHBvcnRzLmhhbmRsZVRyYW5zcG9ydFZlcmlmaWVkID0gaGFuZGxlVHJhbnNwb3J0VmVyaWZpZWQ7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVUcmFuc3BvcnRSZXZva2VkKGV2ZW50KSB7XG4gICAgYXdhaXQgdG91Y2hJZGVudGl0eShldmVudCk7XG59XG5leHBvcnRzLmhhbmRsZVRyYW5zcG9ydFJldm9rZWQgPSBoYW5kbGVUcmFuc3BvcnRSZXZva2VkO1xuLy8g4pSA4pSA4pSAIElkZW50aXR5RnJvemVuIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSWRlbnRpdHlGcm96ZW4oZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoIWlkZW50aXR5KVxuICAgICAgICByZXR1cm47XG4gICAgaWRlbnRpdHkuc3RhdHVzID0gXCJGcm96ZW5cIjtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBhd2FpdCBpZGVudGl0eS5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZUlkZW50aXR5RnJvemVuID0gaGFuZGxlSWRlbnRpdHlGcm96ZW47XG4vLyDilIDilIDilIAgSWRlbnRpdHlVbmZyb3plbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUlkZW50aXR5VW5mcm96ZW4oZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoIWlkZW50aXR5KVxuICAgICAgICByZXR1cm47XG4gICAgaWRlbnRpdHkuc3RhdHVzID0gXCJBY3RpdmVcIjtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBhd2FpdCBpZGVudGl0eS5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZUlkZW50aXR5VW5mcm96ZW4gPSBoYW5kbGVJZGVudGl0eVVuZnJvemVuO1xuLy8g4pSA4pSA4pSAIElkZW50aXR5RGlzYWJsZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVJZGVudGl0eURpc2FibGVkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgZ2V0SWRlbnRpdHkoaWRlbnRpdHlJZCk7XG4gICAgaWYgKCFpZGVudGl0eSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGlkZW50aXR5LnN0YXR1cyA9IFwiRGlzYWJsZWRcIjtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBhd2FpdCBpZGVudGl0eS5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZUlkZW50aXR5RGlzYWJsZWQgPSBoYW5kbGVJZGVudGl0eURpc2FibGVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIE1hcHBpbmcgaGFuZGxlcnMgZm9yIHBhbGxldF9wYXltZW50X2ludGVudCBldmVudHMuXG4gKlxuICogRXZlbnRzIGhhbmRsZWQ6XG4gKiAgIFBheW1lbnRJbnRlbnRDcmVhdGVkLCBQYXltZW50SW50ZW50RnVuZGVkLFxuICogICBQYXltZW50SW50ZW50Q2xhaW1lZCwgUGF5bWVudEludGVudFJlZnVuZGVkLFxuICogICBQYXltZW50SW50ZW50Q2FuY2VsbGVkLCBQYXltZW50SW50ZW50RXhwaXJlZFxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRFeHBpcmVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50Q2FuY2VsbGVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50UmVmdW5kZWQgPSBleHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRDbGFpbWVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50RnVuZGVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50Q3JlYXRlZCA9IHZvaWQgMDtcbmNvbnN0IFBheW1lbnRJbnRlbnRfMSA9IHJlcXVpcmUoXCIuLi90eXBlcy9tb2RlbHMvUGF5bWVudEludGVudFwiKTtcbmNvbnN0IFNldHRsZW1lbnRFdmVudF8xID0gcmVxdWlyZShcIi4uL3R5cGVzL21vZGVscy9TZXR0bGVtZW50RXZlbnRcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG4vLyDilIDilIDilIAgaGVscGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmZ1bmN0aW9uIHN0cih2KSB7XG4gICAgcmV0dXJuIHYudG9TdHJpbmcoKTtcbn1cbmZ1bmN0aW9uIGJsb2NrTnVtKGJsb2NrKSB7XG4gICAgcmV0dXJuIEJpZ0ludChibG9jay5ibG9jay5oZWFkZXIubnVtYmVyLnRvU3RyaW5nKCkpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0SW50ZW50KGludGVudElkKSB7XG4gICAgcmV0dXJuIFBheW1lbnRJbnRlbnRfMS5QYXltZW50SW50ZW50LmdldCgoMCwgdXRpbHNfMS5wYXltZW50SW50ZW50RW50aXR5SWQpKGludGVudElkKSk7XG59XG5hc3luYyBmdW5jdGlvbiBhcHBlbmRTZXR0bGVtZW50RXZlbnQoZXZlbnQsIGludGVudElkLCBldmVudFR5cGUpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGNvbnN0IHsgYmxvY2ssIGV4dHJpbnNpYywgaWR4IH0gPSBldmVudDtcbiAgICBjb25zdCBibiA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBjb25zdCBldmVudEluZGV4ID0gaWR4ICE9PSBudWxsICYmIGlkeCAhPT0gdm9pZCAwID8gaWR4IDogMDtcbiAgICBjb25zdCBpZCA9ICgwLCB1dGlsc18xLnNldHRsZW1lbnRFdmVudEVudGl0eUlkKShpbnRlbnRJZCwgYm4sIGV2ZW50SW5kZXgpO1xuICAgIGNvbnN0IHNlID0gU2V0dGxlbWVudEV2ZW50XzEuU2V0dGxlbWVudEV2ZW50LmNyZWF0ZSh7XG4gICAgICAgIGlkLFxuICAgICAgICBjaGFpbklkOiB1dGlsc18xLkNIQUlOX0lELFxuICAgICAgICBpbnRlbnRJZCxcbiAgICAgICAgZXZlbnRUeXBlLFxuICAgICAgICBibG9ja051bWJlcjogYm4sXG4gICAgICAgIGV4dHJpbnNpY0luZGV4OiBleHRyaW5zaWMgPyAoX2EgPSBleHRyaW5zaWMuaWR4KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB1bmRlZmluZWQgOiB1bmRlZmluZWQsXG4gICAgICAgIGV2ZW50SW5kZXgsXG4gICAgICAgIGJsb2NrSGFzaDogYmxvY2suYmxvY2suaGVhZGVyLmhhc2gudG9IZXgoKSxcbiAgICAgICAgdGltZXN0YW1wOiAoX2IgPSBibG9jay50aW1lc3RhbXApICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgICBhd2FpdCBzZS5zYXZlKCk7XG59XG4vLyDilIDilIDilIAgUGF5bWVudEludGVudENyZWF0ZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVQYXltZW50SW50ZW50Q3JlYXRlZChldmVudCkge1xuICAgIC8vIGRhdGE6IGludGVudF9pZCgwKSwgcGF5ZXIoMSksIHBheWVlKDIpLCBhc3NldF9pZCgzKSwgYW1vdW50KDQpLCBhY3Rpb24oNSlcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGludGVudElkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IHBheWVySWRlbnRpdHlJZCA9IHN0cihkYXRhWzFdKTtcbiAgICBjb25zdCBwYXllZUlkZW50aXR5SWQgPSBzdHIoZGF0YVsyXSk7XG4gICAgLy8gZGF0YVszXSA9IGFzc2V0X2lkIChpZ25vcmVkIGluIHNjaGVtYSlcbiAgICBjb25zdCBhbW91bnQgPSBCaWdJbnQoc3RyKGRhdGFbNF0pKTtcbiAgICBjb25zdCBhY3Rpb25SYXcgPSBkYXRhWzVdLnRvSlNPTigpO1xuICAgIGNvbnN0IGJuID0gYmxvY2tOdW0oYmxvY2spO1xuICAgIC8vIEV4dHJhY3QgbmFtZXNwYWNlIChCb3VuZGVkVmVjPHU4PiBzZXJpYWxpemVkIGFzIGhleCBvciBhcnJheSkgYW5kIGFjdGlvbkNvZGVcbiAgICBsZXQgYWN0aW9uTmFtZXNwYWNlO1xuICAgIGxldCBhY3Rpb25JZDtcbiAgICBpZiAoYWN0aW9uUmF3KSB7XG4gICAgICAgIGNvbnN0IG5zID0gYWN0aW9uUmF3W1wibmFtZXNwYWNlXCJdO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShucykpIHtcbiAgICAgICAgICAgIGFjdGlvbk5hbWVzcGFjZSA9IEJ1ZmZlci5mcm9tKG5zKS50b1N0cmluZyhcInV0ZjhcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIG5zID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBhY3Rpb25OYW1lc3BhY2UgPSBucy5zdGFydHNXaXRoKFwiMHhcIilcbiAgICAgICAgICAgICAgICA/IEJ1ZmZlci5mcm9tKG5zLnNsaWNlKDIpLCBcImhleFwiKS50b1N0cmluZyhcInV0ZjhcIilcbiAgICAgICAgICAgICAgICA6IG5zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb25SYXdbXCJhY3Rpb25Db2RlXCJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGFjdGlvbklkID0gU3RyaW5nKGFjdGlvblJhd1tcImFjdGlvbkNvZGVcIl0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGludGVudCA9IFBheW1lbnRJbnRlbnRfMS5QYXltZW50SW50ZW50LmNyZWF0ZSh7XG4gICAgICAgIGlkOiAoMCwgdXRpbHNfMS5wYXltZW50SW50ZW50RW50aXR5SWQpKGludGVudElkKSxcbiAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgaW50ZW50SWQsXG4gICAgICAgIHBheWVySWRlbnRpdHlJZCxcbiAgICAgICAgcGF5ZWVJZGVudGl0eUlkLFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIHNldHRsZW1lbnRNb2RlOiBcIlVua25vd25cIixcbiAgICAgICAgYWN0aW9uTmFtZXNwYWNlLFxuICAgICAgICBhY3Rpb25JZCxcbiAgICAgICAgc3RhdHVzOiBcIkNyZWF0ZWRcIixcbiAgICAgICAgY3JlYXRlZEF0QmxvY2s6IGJuLFxuICAgICAgICB1cGRhdGVkQXRCbG9jazogYm4sXG4gICAgfSk7XG4gICAgYXdhaXQgaW50ZW50LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlUGF5bWVudEludGVudENyZWF0ZWQgPSBoYW5kbGVQYXltZW50SW50ZW50Q3JlYXRlZDtcbi8vIOKUgOKUgOKUgCBQYXltZW50SW50ZW50RnVuZGVkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUGF5bWVudEludGVudEZ1bmRlZChldmVudCkge1xuICAgIC8vIGRhdGE6IGludGVudF9pZCgwKSwgc2V0dGxlbWVudF9tb2RlKDEpXG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpbnRlbnRJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBzZXR0bGVtZW50TW9kZUpzb24gPSBkYXRhWzFdLnRvSlNPTigpO1xuICAgIGNvbnN0IHNldHRsZW1lbnRNb2RlID0gdHlwZW9mIHNldHRsZW1lbnRNb2RlSnNvbiA9PT0gXCJzdHJpbmdcIlxuICAgICAgICA/IHNldHRsZW1lbnRNb2RlSnNvblxuICAgICAgICA6IEpTT04uc3RyaW5naWZ5KHNldHRsZW1lbnRNb2RlSnNvbik7XG4gICAgY29uc3QgaW50ZW50ID0gYXdhaXQgZ2V0SW50ZW50KGludGVudElkKTtcbiAgICBpZiAoIWludGVudClcbiAgICAgICAgcmV0dXJuO1xuICAgIGludGVudC5zZXR0bGVtZW50TW9kZSA9IHNldHRsZW1lbnRNb2RlO1xuICAgIGludGVudC5zdGF0dXMgPSBcIkZ1bmRlZFwiO1xuICAgIGludGVudC51cGRhdGVkQXRCbG9jayA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBhd2FpdCBpbnRlbnQuc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50RnVuZGVkID0gaGFuZGxlUGF5bWVudEludGVudEZ1bmRlZDtcbi8vIOKUgOKUgOKUgCBQYXltZW50SW50ZW50Q2xhaW1lZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVBheW1lbnRJbnRlbnRDbGFpbWVkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpbnRlbnRJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBpbnRlbnQgPSBhd2FpdCBnZXRJbnRlbnQoaW50ZW50SWQpO1xuICAgIGlmIChpbnRlbnQpIHtcbiAgICAgICAgaW50ZW50LnN0YXR1cyA9IFwiQ2xhaW1lZFwiO1xuICAgICAgICBpbnRlbnQudXBkYXRlZEF0QmxvY2sgPSBibG9ja051bShibG9jayk7XG4gICAgICAgIGF3YWl0IGludGVudC5zYXZlKCk7XG4gICAgfVxuICAgIGF3YWl0IGFwcGVuZFNldHRsZW1lbnRFdmVudChldmVudCwgaW50ZW50SWQsIFwiQ2xhaW1lZFwiKTtcbn1cbmV4cG9ydHMuaGFuZGxlUGF5bWVudEludGVudENsYWltZWQgPSBoYW5kbGVQYXltZW50SW50ZW50Q2xhaW1lZDtcbi8vIOKUgOKUgOKUgCBQYXltZW50SW50ZW50UmVmdW5kZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVQYXltZW50SW50ZW50UmVmdW5kZWQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGludGVudElkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGludGVudCA9IGF3YWl0IGdldEludGVudChpbnRlbnRJZCk7XG4gICAgaWYgKGludGVudCkge1xuICAgICAgICBpbnRlbnQuc3RhdHVzID0gXCJSZWZ1bmRlZFwiO1xuICAgICAgICBpbnRlbnQudXBkYXRlZEF0QmxvY2sgPSBibG9ja051bShibG9jayk7XG4gICAgICAgIGF3YWl0IGludGVudC5zYXZlKCk7XG4gICAgfVxuICAgIGF3YWl0IGFwcGVuZFNldHRsZW1lbnRFdmVudChldmVudCwgaW50ZW50SWQsIFwiUmVmdW5kZWRcIik7XG59XG5leHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRSZWZ1bmRlZCA9IGhhbmRsZVBheW1lbnRJbnRlbnRSZWZ1bmRlZDtcbi8vIOKUgOKUgOKUgCBQYXltZW50SW50ZW50Q2FuY2VsbGVkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUGF5bWVudEludGVudENhbmNlbGxlZChldmVudCkge1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3QgaW50ZW50SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgaW50ZW50ID0gYXdhaXQgZ2V0SW50ZW50KGludGVudElkKTtcbiAgICBpZiAoaW50ZW50KSB7XG4gICAgICAgIGludGVudC5zdGF0dXMgPSBcIkNhbmNlbGxlZFwiO1xuICAgICAgICBpbnRlbnQudXBkYXRlZEF0QmxvY2sgPSBibG9ja051bShibG9jayk7XG4gICAgICAgIGF3YWl0IGludGVudC5zYXZlKCk7XG4gICAgfVxuICAgIGF3YWl0IGFwcGVuZFNldHRsZW1lbnRFdmVudChldmVudCwgaW50ZW50SWQsIFwiQ2FuY2VsbGVkXCIpO1xufVxuZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50Q2FuY2VsbGVkID0gaGFuZGxlUGF5bWVudEludGVudENhbmNlbGxlZDtcbi8vIOKUgOKUgOKUgCBQYXltZW50SW50ZW50RXhwaXJlZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVBheW1lbnRJbnRlbnRFeHBpcmVkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpbnRlbnRJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBpbnRlbnQgPSBhd2FpdCBnZXRJbnRlbnQoaW50ZW50SWQpO1xuICAgIGlmIChpbnRlbnQpIHtcbiAgICAgICAgaW50ZW50LnN0YXR1cyA9IFwiRXhwaXJlZFwiO1xuICAgICAgICBpbnRlbnQudXBkYXRlZEF0QmxvY2sgPSBibG9ja051bShibG9jayk7XG4gICAgICAgIGF3YWl0IGludGVudC5zYXZlKCk7XG4gICAgfVxuICAgIGF3YWl0IGFwcGVuZFNldHRsZW1lbnRFdmVudChldmVudCwgaW50ZW50SWQsIFwiRXhwaXJlZFwiKTtcbn1cbmV4cG9ydHMuaGFuZGxlUGF5bWVudEludGVudEV4cGlyZWQgPSBoYW5kbGVQYXltZW50SW50ZW50RXhwaXJlZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBTaGFyZWQgaGVscGVycyBmb3IgbWFwcGluZyBoYW5kbGVycy5cbiAqL1xudmFyIF9hO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5lbWVyZ2VuY3lTdGF0dXNFbnRpdHlJZCA9IGV4cG9ydHMuc2V0dGxlbWVudEV2ZW50RW50aXR5SWQgPSBleHBvcnRzLnBheW1lbnRJbnRlbnRFbnRpdHlJZCA9IGV4cG9ydHMuaWRlbnRpdHlLZXlFbnRpdHlJZCA9IGV4cG9ydHMuaWRlbnRpdHlFbnRpdHlJZCA9IGV4cG9ydHMuQ0hBSU5fSUQgPSB2b2lkIDA7XG5leHBvcnRzLkNIQUlOX0lEID0gKF9hID0gcHJvY2Vzcy5lbnZbXCJDSEFJTl9JRFwiXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogXCJzdWJzdHJhdGU6dmlibHktc29sb1wiO1xuZnVuY3Rpb24gaWRlbnRpdHlFbnRpdHlJZChpZGVudGl0eUlkKSB7XG4gICAgcmV0dXJuIGAke2V4cG9ydHMuQ0hBSU5fSUR9OiR7aWRlbnRpdHlJZH1gO1xufVxuZXhwb3J0cy5pZGVudGl0eUVudGl0eUlkID0gaWRlbnRpdHlFbnRpdHlJZDtcbmZ1bmN0aW9uIGlkZW50aXR5S2V5RW50aXR5SWQoa2V5SWQpIHtcbiAgICByZXR1cm4gYCR7ZXhwb3J0cy5DSEFJTl9JRH06JHtrZXlJZH1gO1xufVxuZXhwb3J0cy5pZGVudGl0eUtleUVudGl0eUlkID0gaWRlbnRpdHlLZXlFbnRpdHlJZDtcbmZ1bmN0aW9uIHBheW1lbnRJbnRlbnRFbnRpdHlJZChpbnRlbnRJZCkge1xuICAgIHJldHVybiBgJHtleHBvcnRzLkNIQUlOX0lEfToke2ludGVudElkfWA7XG59XG5leHBvcnRzLnBheW1lbnRJbnRlbnRFbnRpdHlJZCA9IHBheW1lbnRJbnRlbnRFbnRpdHlJZDtcbmZ1bmN0aW9uIHNldHRsZW1lbnRFdmVudEVudGl0eUlkKGludGVudElkLCBibG9ja051bWJlciwgZXZlbnRJbmRleCkge1xuICAgIHJldHVybiBgJHtleHBvcnRzLkNIQUlOX0lEfToke2ludGVudElkfToke2Jsb2NrTnVtYmVyfToke2V2ZW50SW5kZXh9YDtcbn1cbmV4cG9ydHMuc2V0dGxlbWVudEV2ZW50RW50aXR5SWQgPSBzZXR0bGVtZW50RXZlbnRFbnRpdHlJZDtcbmZ1bmN0aW9uIGVtZXJnZW5jeVN0YXR1c0VudGl0eUlkKHNjb3BlKSB7XG4gICAgcmV0dXJuIGAke2V4cG9ydHMuQ0hBSU5fSUR9OiR7c2NvcGV9YDtcbn1cbmV4cG9ydHMuZW1lcmdlbmN5U3RhdHVzRW50aXR5SWQgPSBlbWVyZ2VuY3lTdGF0dXNFbnRpdHlJZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5DaGFpbkNoZWNrcG9pbnQgPSB2b2lkIDA7XG5jb25zdCB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xuY29uc3QgYXNzZXJ0XzEgPSB0c2xpYl8xLl9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNsYXNzIENoYWluQ2hlY2twb2ludCB7XG4gICAgY29uc3RydWN0b3IoaWQsIGNoYWluSWQsIGJsb2NrTnVtYmVyLCBibG9ja0hhc2gsIHVwZGF0ZWRBdCkge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuY2hhaW5JZCA9IGNoYWluSWQ7XG4gICAgICAgIHRoaXMuYmxvY2tOdW1iZXIgPSBibG9ja051bWJlcjtcbiAgICAgICAgdGhpcy5ibG9ja0hhc2ggPSBibG9ja0hhc2g7XG4gICAgICAgIHRoaXMudXBkYXRlZEF0ID0gdXBkYXRlZEF0O1xuICAgIH1cbiAgICBnZXQgX25hbWUoKSB7XG4gICAgICAgIHJldHVybiAnQ2hhaW5DaGVja3BvaW50JztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgQ2hhaW5DaGVja3BvaW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXQoJ0NoYWluQ2hlY2twb2ludCcsIGlkLnRvU3RyaW5nKCksIHRoaXMpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgcmVtb3ZlKGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShpZCAhPT0gbnVsbCwgXCJDYW5ub3QgcmVtb3ZlIENoYWluQ2hlY2twb2ludCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdDaGFpbkNoZWNrcG9pbnQnLCBpZC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIGdldChpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoKGlkICE9PSBudWxsICYmIGlkICE9PSB1bmRlZmluZWQpLCBcIkNhbm5vdCBnZXQgQ2hhaW5DaGVja3BvaW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCBzdG9yZS5nZXQoJ0NoYWluQ2hlY2twb2ludCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnQ2hhaW5DaGVja3BvaW50JywgZmlsdGVyLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB0aGlzLmNyZWF0ZShyZWNvcmQpKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShyZWNvcmQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHJlY29yZC5pZCAhPT0gdW5kZWZpbmVkICYmIHJlY29yZC5pZCAhPT0gbnVsbCwgXCJpZCBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgdGhpcyhyZWNvcmQuaWQsIHJlY29yZC5jaGFpbklkLCByZWNvcmQuYmxvY2tOdW1iZXIsIHJlY29yZC5ibG9ja0hhc2gsIHJlY29yZC51cGRhdGVkQXQpO1xuICAgICAgICBPYmplY3QuYXNzaWduKGVudGl0eSwgcmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG59XG5leHBvcnRzLkNoYWluQ2hlY2twb2ludCA9IENoYWluQ2hlY2twb2ludDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5DaGFpbklkZW50aXR5ID0gdm9pZCAwO1xuY29uc3QgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbmNvbnN0IGFzc2VydF8xID0gdHNsaWJfMS5fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImFzc2VydFwiKSk7XG5jbGFzcyBDaGFpbklkZW50aXR5IHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgaWRlbnRpdHlJZCwgb3duZXIsIHN0YXR1cywgY3JlYXRlZEF0QmxvY2ssIHVwZGF0ZWRBdEJsb2NrKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jaGFpbklkID0gY2hhaW5JZDtcbiAgICAgICAgdGhpcy5pZGVudGl0eUlkID0gaWRlbnRpdHlJZDtcbiAgICAgICAgdGhpcy5vd25lciA9IG93bmVyO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgICAgdGhpcy5jcmVhdGVkQXRCbG9jayA9IGNyZWF0ZWRBdEJsb2NrO1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdEJsb2NrID0gdXBkYXRlZEF0QmxvY2s7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdDaGFpbklkZW50aXR5JztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgQ2hhaW5JZGVudGl0eSBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUuc2V0KCdDaGFpbklkZW50aXR5JywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgQ2hhaW5JZGVudGl0eSBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdDaGFpbklkZW50aXR5JywgaWQudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyBnZXQoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKChpZCAhPT0gbnVsbCAmJiBpZCAhPT0gdW5kZWZpbmVkKSwgXCJDYW5ub3QgZ2V0IENoYWluSWRlbnRpdHkgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnQ2hhaW5JZGVudGl0eScsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnQ2hhaW5JZGVudGl0eScsIGZpbHRlciwgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiByZWNvcmRzLm1hcChyZWNvcmQgPT4gdGhpcy5jcmVhdGUocmVjb3JkKSk7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUocmVjb3JkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShyZWNvcmQuaWQgIT09IHVuZGVmaW5lZCAmJiByZWNvcmQuaWQgIT09IG51bGwsIFwiaWQgbXVzdCBiZSBwcm92aWRlZFwiKTtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gbmV3IHRoaXMocmVjb3JkLmlkLCByZWNvcmQuY2hhaW5JZCwgcmVjb3JkLmlkZW50aXR5SWQsIHJlY29yZC5vd25lciwgcmVjb3JkLnN0YXR1cywgcmVjb3JkLmNyZWF0ZWRBdEJsb2NrLCByZWNvcmQudXBkYXRlZEF0QmxvY2spO1xuICAgICAgICBPYmplY3QuYXNzaWduKGVudGl0eSwgcmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG59XG5leHBvcnRzLkNoYWluSWRlbnRpdHkgPSBDaGFpbklkZW50aXR5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkVtZXJnZW5jeVN0YXR1cyA9IHZvaWQgMDtcbmNvbnN0IHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG5jb25zdCBhc3NlcnRfMSA9IHRzbGliXzEuX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJhc3NlcnRcIikpO1xuY2xhc3MgRW1lcmdlbmN5U3RhdHVzIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgc2NvcGUsIHN0YXR1cywgdXBkYXRlZEF0QmxvY2spIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNoYWluSWQgPSBjaGFpbklkO1xuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdEJsb2NrID0gdXBkYXRlZEF0QmxvY2s7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdFbWVyZ2VuY3lTdGF0dXMnO1xuICAgIH1cbiAgICBhc3luYyBzYXZlKCkge1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuaWQ7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShpZCAhPT0gbnVsbCwgXCJDYW5ub3Qgc2F2ZSBFbWVyZ2VuY3lTdGF0dXMgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNldCgnRW1lcmdlbmN5U3RhdHVzJywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgRW1lcmdlbmN5U3RhdHVzIGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5yZW1vdmUoJ0VtZXJnZW5jeVN0YXR1cycsIGlkLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgZ2V0KGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSgoaWQgIT09IG51bGwgJiYgaWQgIT09IHVuZGVmaW5lZCksIFwiQ2Fubm90IGdldCBFbWVyZ2VuY3lTdGF0dXMgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnRW1lcmdlbmN5U3RhdHVzJywgaWQudG9TdHJpbmcoKSk7XG4gICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZShyZWNvcmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgZW50aXRpZXMgbWF0Y2hpbmcgdGhlIHNwZWNpZmllZCBmaWx0ZXJzIGFuZCBvcHRpb25zLlxuICAgICAqXG4gICAgICog4pqg77iPIFRoaXMgZnVuY3Rpb24gd2lsbCBmaXJzdCBzZWFyY2ggY2FjaGUgZGF0YSBmb2xsb3dlZCBieSBEQiBkYXRhLiBQbGVhc2UgY29uc2lkZXIgdGhpcyB3aGVuIHVzaW5nIG9yZGVyIGFuZCBvZmZzZXQgb3B0aW9ucy7imqDvuI9cbiAgICAgKiAqL1xuICAgIHN0YXRpYyBhc3luYyBnZXRCeUZpZWxkcyhmaWx0ZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkcyA9IGF3YWl0IHN0b3JlLmdldEJ5RmllbGRzKCdFbWVyZ2VuY3lTdGF0dXMnLCBmaWx0ZXIsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHRoaXMuY3JlYXRlKHJlY29yZCkpO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKHJlY29yZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkocmVjb3JkLmlkICE9PSB1bmRlZmluZWQgJiYgcmVjb3JkLmlkICE9PSBudWxsLCBcImlkIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IG5ldyB0aGlzKHJlY29yZC5pZCwgcmVjb3JkLmNoYWluSWQsIHJlY29yZC5zY29wZSwgcmVjb3JkLnN0YXR1cywgcmVjb3JkLnVwZGF0ZWRBdEJsb2NrKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHksIHJlY29yZCk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxufVxuZXhwb3J0cy5FbWVyZ2VuY3lTdGF0dXMgPSBFbWVyZ2VuY3lTdGF0dXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuSWRlbnRpdHlLZXkgPSB2b2lkIDA7XG5jb25zdCB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xuY29uc3QgYXNzZXJ0XzEgPSB0c2xpYl8xLl9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNsYXNzIElkZW50aXR5S2V5IHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgaWRlbnRpdHlJZCwga2V5SWQsIGFjY291bnQsIHB1cnBvc2UsIHN0YXR1cywgdXBkYXRlZEF0QmxvY2spIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNoYWluSWQgPSBjaGFpbklkO1xuICAgICAgICB0aGlzLmlkZW50aXR5SWQgPSBpZGVudGl0eUlkO1xuICAgICAgICB0aGlzLmtleUlkID0ga2V5SWQ7XG4gICAgICAgIHRoaXMuYWNjb3VudCA9IGFjY291bnQ7XG4gICAgICAgIHRoaXMucHVycG9zZSA9IHB1cnBvc2U7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdEJsb2NrID0gdXBkYXRlZEF0QmxvY2s7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdJZGVudGl0eUtleSc7XG4gICAgfVxuICAgIGFzeW5jIHNhdmUoKSB7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5pZDtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCBzYXZlIElkZW50aXR5S2V5IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXQoJ0lkZW50aXR5S2V5JywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgSWRlbnRpdHlLZXkgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnJlbW92ZSgnSWRlbnRpdHlLZXknLCBpZC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIGdldChpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoKGlkICE9PSBudWxsICYmIGlkICE9PSB1bmRlZmluZWQpLCBcIkNhbm5vdCBnZXQgSWRlbnRpdHlLZXkgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnSWRlbnRpdHlLZXknLCBpZC50b1N0cmluZygpKTtcbiAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKHJlY29yZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyBlbnRpdGllcyBtYXRjaGluZyB0aGUgc3BlY2lmaWVkIGZpbHRlcnMgYW5kIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiDimqDvuI8gVGhpcyBmdW5jdGlvbiB3aWxsIGZpcnN0IHNlYXJjaCBjYWNoZSBkYXRhIGZvbGxvd2VkIGJ5IERCIGRhdGEuIFBsZWFzZSBjb25zaWRlciB0aGlzIHdoZW4gdXNpbmcgb3JkZXIgYW5kIG9mZnNldCBvcHRpb25zLuKaoO+4j1xuICAgICAqICovXG4gICAgc3RhdGljIGFzeW5jIGdldEJ5RmllbGRzKGZpbHRlciwgb3B0aW9ucykge1xuICAgICAgICBjb25zdCByZWNvcmRzID0gYXdhaXQgc3RvcmUuZ2V0QnlGaWVsZHMoJ0lkZW50aXR5S2V5JywgZmlsdGVyLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB0aGlzLmNyZWF0ZShyZWNvcmQpKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShyZWNvcmQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHJlY29yZC5pZCAhPT0gdW5kZWZpbmVkICYmIHJlY29yZC5pZCAhPT0gbnVsbCwgXCJpZCBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgdGhpcyhyZWNvcmQuaWQsIHJlY29yZC5jaGFpbklkLCByZWNvcmQuaWRlbnRpdHlJZCwgcmVjb3JkLmtleUlkLCByZWNvcmQuYWNjb3VudCwgcmVjb3JkLnB1cnBvc2UsIHJlY29yZC5zdGF0dXMsIHJlY29yZC51cGRhdGVkQXRCbG9jayk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZW50aXR5LCByZWNvcmQpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cbn1cbmV4cG9ydHMuSWRlbnRpdHlLZXkgPSBJZGVudGl0eUtleTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5QYXltZW50SW50ZW50ID0gdm9pZCAwO1xuY29uc3QgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbmNvbnN0IGFzc2VydF8xID0gdHNsaWJfMS5fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImFzc2VydFwiKSk7XG5jbGFzcyBQYXltZW50SW50ZW50IHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgaW50ZW50SWQsIHBheWVySWRlbnRpdHlJZCwgcGF5ZWVJZGVudGl0eUlkLCBhbW91bnQsIHNldHRsZW1lbnRNb2RlLCBzdGF0dXMsIGNyZWF0ZWRBdEJsb2NrLCB1cGRhdGVkQXRCbG9jaykge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuY2hhaW5JZCA9IGNoYWluSWQ7XG4gICAgICAgIHRoaXMuaW50ZW50SWQgPSBpbnRlbnRJZDtcbiAgICAgICAgdGhpcy5wYXllcklkZW50aXR5SWQgPSBwYXllcklkZW50aXR5SWQ7XG4gICAgICAgIHRoaXMucGF5ZWVJZGVudGl0eUlkID0gcGF5ZWVJZGVudGl0eUlkO1xuICAgICAgICB0aGlzLmFtb3VudCA9IGFtb3VudDtcbiAgICAgICAgdGhpcy5zZXR0bGVtZW50TW9kZSA9IHNldHRsZW1lbnRNb2RlO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgICAgdGhpcy5jcmVhdGVkQXRCbG9jayA9IGNyZWF0ZWRBdEJsb2NrO1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdEJsb2NrID0gdXBkYXRlZEF0QmxvY2s7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdQYXltZW50SW50ZW50JztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgUGF5bWVudEludGVudCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUuc2V0KCdQYXltZW50SW50ZW50JywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgUGF5bWVudEludGVudCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdQYXltZW50SW50ZW50JywgaWQudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyBnZXQoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKChpZCAhPT0gbnVsbCAmJiBpZCAhPT0gdW5kZWZpbmVkKSwgXCJDYW5ub3QgZ2V0IFBheW1lbnRJbnRlbnQgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnUGF5bWVudEludGVudCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnUGF5bWVudEludGVudCcsIGZpbHRlciwgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiByZWNvcmRzLm1hcChyZWNvcmQgPT4gdGhpcy5jcmVhdGUocmVjb3JkKSk7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUocmVjb3JkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShyZWNvcmQuaWQgIT09IHVuZGVmaW5lZCAmJiByZWNvcmQuaWQgIT09IG51bGwsIFwiaWQgbXVzdCBiZSBwcm92aWRlZFwiKTtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gbmV3IHRoaXMocmVjb3JkLmlkLCByZWNvcmQuY2hhaW5JZCwgcmVjb3JkLmludGVudElkLCByZWNvcmQucGF5ZXJJZGVudGl0eUlkLCByZWNvcmQucGF5ZWVJZGVudGl0eUlkLCByZWNvcmQuYW1vdW50LCByZWNvcmQuc2V0dGxlbWVudE1vZGUsIHJlY29yZC5zdGF0dXMsIHJlY29yZC5jcmVhdGVkQXRCbG9jaywgcmVjb3JkLnVwZGF0ZWRBdEJsb2NrKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHksIHJlY29yZCk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxufVxuZXhwb3J0cy5QYXltZW50SW50ZW50ID0gUGF5bWVudEludGVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TZXR0bGVtZW50RXZlbnQgPSB2b2lkIDA7XG5jb25zdCB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xuY29uc3QgYXNzZXJ0XzEgPSB0c2xpYl8xLl9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNsYXNzIFNldHRsZW1lbnRFdmVudCB7XG4gICAgY29uc3RydWN0b3IoaWQsIGNoYWluSWQsIGludGVudElkLCBldmVudFR5cGUsIGJsb2NrTnVtYmVyLCBldmVudEluZGV4LCBibG9ja0hhc2gpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNoYWluSWQgPSBjaGFpbklkO1xuICAgICAgICB0aGlzLmludGVudElkID0gaW50ZW50SWQ7XG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gZXZlbnRUeXBlO1xuICAgICAgICB0aGlzLmJsb2NrTnVtYmVyID0gYmxvY2tOdW1iZXI7XG4gICAgICAgIHRoaXMuZXZlbnRJbmRleCA9IGV2ZW50SW5kZXg7XG4gICAgICAgIHRoaXMuYmxvY2tIYXNoID0gYmxvY2tIYXNoO1xuICAgIH1cbiAgICBnZXQgX25hbWUoKSB7XG4gICAgICAgIHJldHVybiAnU2V0dGxlbWVudEV2ZW50JztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgU2V0dGxlbWVudEV2ZW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXQoJ1NldHRsZW1lbnRFdmVudCcsIGlkLnRvU3RyaW5nKCksIHRoaXMpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgcmVtb3ZlKGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShpZCAhPT0gbnVsbCwgXCJDYW5ub3QgcmVtb3ZlIFNldHRsZW1lbnRFdmVudCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdTZXR0bGVtZW50RXZlbnQnLCBpZC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIGdldChpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoKGlkICE9PSBudWxsICYmIGlkICE9PSB1bmRlZmluZWQpLCBcIkNhbm5vdCBnZXQgU2V0dGxlbWVudEV2ZW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCBzdG9yZS5nZXQoJ1NldHRsZW1lbnRFdmVudCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnU2V0dGxlbWVudEV2ZW50JywgZmlsdGVyLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB0aGlzLmNyZWF0ZShyZWNvcmQpKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShyZWNvcmQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHJlY29yZC5pZCAhPT0gdW5kZWZpbmVkICYmIHJlY29yZC5pZCAhPT0gbnVsbCwgXCJpZCBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgdGhpcyhyZWNvcmQuaWQsIHJlY29yZC5jaGFpbklkLCByZWNvcmQuaW50ZW50SWQsIHJlY29yZC5ldmVudFR5cGUsIHJlY29yZC5ibG9ja051bWJlciwgcmVjb3JkLmV2ZW50SW5kZXgsIHJlY29yZC5ibG9ja0hhc2gpO1xuICAgICAgICBPYmplY3QuYXNzaWduKGVudGl0eSwgcmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG59XG5leHBvcnRzLlNldHRsZW1lbnRFdmVudCA9IFNldHRsZW1lbnRFdmVudDtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFzc2VydFwiKTsiLCJleHBvcnQgY29uc3QgcGFja2FnZUluZm8gPSB7IG5hbWU6ICdAcG9sa2Fkb3QvYXBpLWJhc2UnLCBwYXRoOiAoaW1wb3J0Lm1ldGEgJiYgaW1wb3J0Lm1ldGEudXJsKSA/IG5ldyBVUkwoaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZS5zdWJzdHJpbmcoMCwgbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLmxhc3RJbmRleE9mKCcvJykgKyAxKSA6ICdhdXRvJywgdHlwZTogJ2VzbScsIHZlcnNpb246ICcxNi41LjYnIH07XG4iLCJleHBvcnQgY29uc3QgcGFja2FnZUluZm8gPSB7IG5hbWU6ICdAcG9sa2Fkb3QvdHlwZXMnLCBwYXRoOiAoaW1wb3J0Lm1ldGEgJiYgaW1wb3J0Lm1ldGEudXJsKSA/IG5ldyBVUkwoaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZS5zdWJzdHJpbmcoMCwgbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLmxhc3RJbmRleE9mKCcvJykgKyAxKSA6ICdhdXRvJywgdHlwZTogJ2VzbScsIHZlcnNpb246ICcxNi41LjYnIH07XG4iLCJleHBvcnQgY29uc3QgcGFja2FnZUluZm8gPSB7IG5hbWU6ICdAcG9sa2Fkb3QvdHlwZXMtY29kZWMnLCBwYXRoOiAoaW1wb3J0Lm1ldGEgJiYgaW1wb3J0Lm1ldGEudXJsKSA/IG5ldyBVUkwoaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZS5zdWJzdHJpbmcoMCwgbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLmxhc3RJbmRleE9mKCcvJykgKyAxKSA6ICdhdXRvJywgdHlwZTogJ2VzbScsIHZlcnNpb246ICcxNi41LjYnIH07XG4iLCJleHBvcnQgeyBwYWNrYWdlSW5mbyB9IGZyb20gJy4vcGFja2FnZUluZm8uanMnO1xuLyoqIEBpbnRlcm5hbCBMYXN0LXJlc29ydCBcInRoaXNcIiwgaWYgaXQgZ2V0cyBoZXJlIGl0IHByb2JhYmx5IHdvdWxkIGZhaWwgYW55d2F5ICovXG5mdW5jdGlvbiBldmFsdWF0ZVRoaXMoZm4pIHtcbiAgICByZXR1cm4gZm4oJ3JldHVybiB0aGlzJyk7XG59XG4vKipcbiAqIEEgY3Jvc3MtZW52aXJvbm1lbnQgaW1wbGVtZW50YXRpb24gZm9yIGdsb2JhbFRoaXNcbiAqL1xuZXhwb3J0IGNvbnN0IHhnbG9iYWwgPSAvKiNfX1BVUkVfXyovICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCdcbiAgICA/IGdsb2JhbFRoaXNcbiAgICA6IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnXG4gICAgICAgID8gZ2xvYmFsXG4gICAgICAgIDogdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICA/IHNlbGZcbiAgICAgICAgICAgIDogdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICA/IHdpbmRvd1xuICAgICAgICAgICAgICAgIDogZXZhbHVhdGVUaGlzKEZ1bmN0aW9uKSk7XG4vKipcbiAqIEV4dHJhY3RzIGEga25vd24gZ2xvYmFsIGZyb20gdGhlIGVudmlyb25tZW50LCBhcHBseWluZyBhIGZhbGxiYWNrIGlmIG5vdCBmb3VuZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdEdsb2JhbChuYW1lLCBmYWxsYmFjaykge1xuICAgIC8vIE5vdCBxdWl0ZSBzdXJlIHdoeSB0aGlzIGlzIGhlcmUgLSBzbnVjayBpbiB3aXRoIFRTIDQuNy4yIHdpdGggbm8gcmVhbCBpZGVhXG4gICAgLy8gKGFzIG9mIG5vdykgYXMgdG8gd2h5IHRoaXMgbG9va3MgbGlrZSBhbiBcImFueVwiIHdoZW4gd2UgZG8gY2FzdCBpdCB0byBhIFRcbiAgICAvL1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLXJldHVyblxuICAgIHJldHVybiB0eXBlb2YgeGdsb2JhbFtuYW1lXSA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyBmYWxsYmFja1xuICAgICAgICA6IHhnbG9iYWxbbmFtZV07XG59XG4vKipcbiAqIEV4cG9zZSBhIHZhbHVlIGFzIGEga25vd24gZ2xvYmFsLCBpZiBub3QgYWxyZWFkeSBkZWZpbmVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHBvc2VHbG9iYWwobmFtZSwgZmFsbGJhY2spIHtcbiAgICBpZiAodHlwZW9mIHhnbG9iYWxbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHhnbG9iYWxbbmFtZV0gPSBmYWxsYmFjaztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyB4Z2xvYmFsIH0gZnJvbSAnQHBvbGthZG90L3gtZ2xvYmFsJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL2lzL2Z1bmN0aW9uLmpzJztcbmNvbnN0IERFRFVQRSA9ICdFaXRoZXIgcmVtb3ZlIGFuZCBleHBsaWNpdGx5IGluc3RhbGwgbWF0Y2hpbmcgdmVyc2lvbnMgb3IgZGVkdXBlIHVzaW5nIHlvdXIgcGFja2FnZSBtYW5hZ2VyLlxcblRoZSBmb2xsb3dpbmcgY29uZmxpY3RpbmcgcGFja2FnZXMgd2VyZSBmb3VuZDonO1xuZXhwb3J0IGNvbnN0IFBPTEtBRE9USlNfRElTQUJMRV9FU01fQ0pTX1dBUk5JTkdfRkxBRyA9ICdQT0xLQURPVEpTX0RJU0FCTEVfRVNNX0NKU19XQVJOSU5HJztcbi8qKiBAaW50ZXJuYWwgKi9cbmZ1bmN0aW9uIGdldEVudHJ5KG5hbWUpIHtcbiAgICBjb25zdCBfZ2xvYmFsID0geGdsb2JhbDtcbiAgICBpZiAoIV9nbG9iYWwuX19wb2xrYWRvdGpzKSB7XG4gICAgICAgIF9nbG9iYWwuX19wb2xrYWRvdGpzID0ge307XG4gICAgfVxuICAgIGlmICghX2dsb2JhbC5fX3BvbGthZG90anNbbmFtZV0pIHtcbiAgICAgICAgX2dsb2JhbC5fX3BvbGthZG90anNbbmFtZV0gPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIF9nbG9iYWwuX19wb2xrYWRvdGpzW25hbWVdO1xufVxuLyoqIEBpbnRlcm5hbCAqL1xuZnVuY3Rpb24gZm9ybWF0RGlzcGxheShhbGwsIGZtdCkge1xuICAgIGxldCBtYXggPSAwO1xuICAgIGZvciAobGV0IGkgPSAwLCBjb3VudCA9IGFsbC5sZW5ndGg7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgIG1heCA9IE1hdGgubWF4KG1heCwgYWxsW2ldLnZlcnNpb24ubGVuZ3RoKTtcbiAgICB9XG4gICAgcmV0dXJuIGFsbFxuICAgICAgICAubWFwKChkKSA9PiBgXFx0JHtmbXQoZC52ZXJzaW9uLnBhZEVuZChtYXgpLCBkKS5qb2luKCdcXHQnKX1gKVxuICAgICAgICAuam9pbignXFxuJyk7XG59XG4vKiogQGludGVybmFsICovXG5mdW5jdGlvbiBmb3JtYXRJbmZvKHZlcnNpb24sIHsgbmFtZSB9KSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgdmVyc2lvbixcbiAgICAgICAgbmFtZVxuICAgIF07XG59XG4vKiogQGludGVybmFsICovXG5mdW5jdGlvbiBmb3JtYXRWZXJzaW9uKHZlcnNpb24sIHsgcGF0aCwgdHlwZSB9KSB7XG4gICAgbGV0IGV4dHJhY3RlZDtcbiAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCA+PSA1KSB7XG4gICAgICAgIGNvbnN0IG5tSW5kZXggPSBwYXRoLmluZGV4T2YoJ25vZGVfbW9kdWxlcycpO1xuICAgICAgICBleHRyYWN0ZWQgPSBubUluZGV4ID09PSAtMVxuICAgICAgICAgICAgPyBwYXRoXG4gICAgICAgICAgICA6IHBhdGguc3Vic3RyaW5nKG5tSW5kZXgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZXh0cmFjdGVkID0gJzx1bmtub3duPic7XG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICAgIGAke2Ake3R5cGUgfHwgJyd9YC5wYWRTdGFydCgzKX0gJHt2ZXJzaW9ufWAsXG4gICAgICAgIGV4dHJhY3RlZFxuICAgIF07XG59XG4vKiogQGludGVybmFsICovXG5mdW5jdGlvbiBnZXRQYXRoKGluZm9QYXRoLCBwYXRoT3JGbikge1xuICAgIGlmIChpbmZvUGF0aCkge1xuICAgICAgICByZXR1cm4gaW5mb1BhdGg7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzRnVuY3Rpb24ocGF0aE9yRm4pKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aE9yRm4oKSB8fCAnJztcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdGhPckZuIHx8ICcnO1xufVxuLyoqIEBpbnRlcm5hbCAqL1xuZnVuY3Rpb24gd2FybihwcmUsIGFsbCwgZm10KSB7XG4gICAgY29uc29sZS53YXJuKGAke3ByZX1cXG4ke0RFRFVQRX1cXG4ke2Zvcm1hdERpc3BsYXkoYWxsLCBmbXQpfWApO1xufVxuLyoqXG4gKiBAbmFtZSBkZXRlY3RQYWNrYWdlXG4gKiBAc3VtbWFyeSBDaGVja3MgdGhhdCBhIHNwZWNpZmljIHBhY2thZ2UgaXMgb25seSBpbXBvcnRlZCBvbmNlXG4gKiBAZGVzY3JpcHRpb24gQSBgQHBvbGthZG90LypgIHZlcnNpb24gZGV0ZWN0aW9uIHV0aWxpdHksIGNoZWNraW5nIGZvciBvbmUgb2NjdXJyZW5jZSBvZiBhIHBhY2thZ2UgaW4gYWRkaXRpb24gdG8gY2hlY2tpbmcgZm9yIGRlcGVuZGVuY3kgdmVyc2lvbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXRlY3RQYWNrYWdlKHsgbmFtZSwgcGF0aCwgdHlwZSwgdmVyc2lvbiB9LCBwYXRoT3JGbiwgZGVwcyA9IFtdKSB7XG4gICAgaWYgKCFuYW1lLnN0YXJ0c1dpdGgoJ0Bwb2xrYWRvdCcpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBwYWNrYWdlIGRlc2NyaXB0b3IgJHtuYW1lfWApO1xuICAgIH1cbiAgICBjb25zdCBlbnRyeSA9IGdldEVudHJ5KG5hbWUpO1xuICAgIGVudHJ5LnB1c2goeyBwYXRoOiBnZXRQYXRoKHBhdGgsIHBhdGhPckZuKSwgdHlwZSwgdmVyc2lvbiB9KTtcbiAgICAvLyBpZiB3ZSBoYXZlIG1vcmUgdGhhbiBvbmUgZW50cnkgYXQgRElGRkVSRU5UIHZlcnNpb24gdHlwZXMgdGhlbiB3YXJuLiBJZiB0aGVyZSBpc1xuICAgIC8vIG1vcmUgdGhhbiBvbmUgZW50cnkgYXQgdGhlIHNhbWUgdmVyc2lvbiBhbmQgRVNNL0NKUyBkdWFsIHdhcm5pbmdzIGFyZSBkaXNhYmxlZCxcbiAgICAvLyB0aGVuIGRvIG5vdCBkaXNwbGF5IHdhcm5pbmdzXG4gICAgY29uc3QgZW50cmllc1NhbWVWZXJzaW9uID0gZW50cnkuZXZlcnkoKGUpID0+IGUudmVyc2lvbiA9PT0gdmVyc2lvbik7XG4gICAgY29uc3QgZXNtQ2pzV2FybmluZ0Rpc2FibGVkID0geGdsb2JhbC5wcm9jZXNzPy5lbnY/LltQT0xLQURPVEpTX0RJU0FCTEVfRVNNX0NKU19XQVJOSU5HX0ZMQUddID09PSAnMSc7XG4gICAgY29uc3QgbXVsdGlwbGVFbnRyaWVzID0gZW50cnkubGVuZ3RoICE9PSAxO1xuICAgIGNvbnN0IGRpc2FibGVXYXJuaW5ncyA9IGVzbUNqc1dhcm5pbmdEaXNhYmxlZCAmJiBlbnRyaWVzU2FtZVZlcnNpb247XG4gICAgaWYgKG11bHRpcGxlRW50cmllcyAmJiAhZGlzYWJsZVdhcm5pbmdzKSB7XG4gICAgICAgIHdhcm4oYCR7bmFtZX0gaGFzIG11bHRpcGxlIHZlcnNpb25zLCBlbnN1cmUgdGhhdCB0aGVyZSBpcyBvbmx5IG9uZSBpbnN0YWxsZWQuYCwgZW50cnksIGZvcm1hdFZlcnNpb24pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgbWlzbWF0Y2hlcyA9IGRlcHMuZmlsdGVyKChkKSA9PiBkICYmIGQudmVyc2lvbiAhPT0gdmVyc2lvbik7XG4gICAgICAgIGlmIChtaXNtYXRjaGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgd2FybihgJHtuYW1lfSByZXF1aXJlcyBkaXJlY3QgZGVwZW5kZW5jaWVzIGV4YWN0bHkgbWF0Y2hpbmcgdmVyc2lvbiAke3ZlcnNpb259LmAsIG1pc21hdGNoZXMsIGZvcm1hdEluZm8pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLyoqXG4gKiBAbmFtZSBpc0Z1bmN0aW9uXG4gKiBAc3VtbWFyeSBUZXN0cyBmb3IgYSBgZnVuY3Rpb25gLlxuICogQGRlc2NyaXB0aW9uXG4gKiBDaGVja3MgdG8gc2VlIGlmIHRoZSBpbnB1dCB2YWx1ZSBpcyBhIEphdmFTY3JpcHQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICogPEJSPlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICdAcG9sa2Fkb3QvdXRpbCc7XG4gKlxuICogaXNGdW5jdGlvbigoKSA9PiBmYWxzZSk7IC8vID0+IHRydWVcbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59XG4iLCJleHBvcnQgY29uc3QgcGFja2FnZUluZm8gPSB7IG5hbWU6ICdAcG9sa2Fkb3QvYXBpLWF1Z21lbnQnLCBwYXRoOiAoaW1wb3J0Lm1ldGEgJiYgaW1wb3J0Lm1ldGEudXJsKSA/IG5ldyBVUkwoaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZS5zdWJzdHJpbmcoMCwgbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLmxhc3RJbmRleE9mKCcvJykgKyAxKSA6ICdhdXRvJywgdHlwZTogJ2VzbScsIHZlcnNpb246ICcxNi41LjYnIH07XG4iLCJpbXBvcnQgeyBwYWNrYWdlSW5mbyBhcyBiYXNlSW5mbyB9IGZyb20gJ0Bwb2xrYWRvdC9hcGktYmFzZS9wYWNrYWdlSW5mbyc7XG5pbXBvcnQgeyBwYWNrYWdlSW5mbyBhcyB0eXBlc0luZm8gfSBmcm9tICdAcG9sa2Fkb3QvdHlwZXMvcGFja2FnZUluZm8nO1xuaW1wb3J0IHsgcGFja2FnZUluZm8gYXMgY29kZWNJbmZvIH0gZnJvbSAnQHBvbGthZG90L3R5cGVzLWNvZGVjL3BhY2thZ2VJbmZvJztcbmltcG9ydCB7IGRldGVjdFBhY2thZ2UgfSBmcm9tICdAcG9sa2Fkb3QvdXRpbCc7XG5pbXBvcnQgeyBwYWNrYWdlSW5mbyB9IGZyb20gJy4vcGFja2FnZUluZm8uanMnO1xuZGV0ZWN0UGFja2FnZShwYWNrYWdlSW5mbywgbnVsbCwgW2Jhc2VJbmZvLCBjb2RlY0luZm8sIHR5cGVzSW5mb10pO1xuIiwiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXG5cblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1Jcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UsIFN1cHByZXNzZWRFcnJvciwgU3ltYm9sLCBJdGVyYXRvciAqL1xuXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcbiAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcbiAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn1cblxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xuICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xuICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHQ7XG4gIH1cbiAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xuICB2YXIgdCA9IHt9O1xuICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcbiAgICAgIHRbcF0gPSBzW3BdO1xuICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxuICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcbiAgICAgIH1cbiAgcmV0dXJuIHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XG4gIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xuICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fZXNEZWNvcmF0ZShjdG9yLCBkZXNjcmlwdG9ySW4sIGRlY29yYXRvcnMsIGNvbnRleHRJbiwgaW5pdGlhbGl6ZXJzLCBleHRyYUluaXRpYWxpemVycykge1xuICBmdW5jdGlvbiBhY2NlcHQoZikgeyBpZiAoZiAhPT0gdm9pZCAwICYmIHR5cGVvZiBmICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGdW5jdGlvbiBleHBlY3RlZFwiKTsgcmV0dXJuIGY7IH1cbiAgdmFyIGtpbmQgPSBjb250ZXh0SW4ua2luZCwga2V5ID0ga2luZCA9PT0gXCJnZXR0ZXJcIiA/IFwiZ2V0XCIgOiBraW5kID09PSBcInNldHRlclwiID8gXCJzZXRcIiA6IFwidmFsdWVcIjtcbiAgdmFyIHRhcmdldCA9ICFkZXNjcmlwdG9ySW4gJiYgY3RvciA/IGNvbnRleHRJbltcInN0YXRpY1wiXSA/IGN0b3IgOiBjdG9yLnByb3RvdHlwZSA6IG51bGw7XG4gIHZhciBkZXNjcmlwdG9yID0gZGVzY3JpcHRvckluIHx8ICh0YXJnZXQgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgY29udGV4dEluLm5hbWUpIDoge30pO1xuICB2YXIgXywgZG9uZSA9IGZhbHNlO1xuICBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGNvbnRleHQgPSB7fTtcbiAgICAgIGZvciAodmFyIHAgaW4gY29udGV4dEluKSBjb250ZXh0W3BdID0gcCA9PT0gXCJhY2Nlc3NcIiA/IHt9IDogY29udGV4dEluW3BdO1xuICAgICAgZm9yICh2YXIgcCBpbiBjb250ZXh0SW4uYWNjZXNzKSBjb250ZXh0LmFjY2Vzc1twXSA9IGNvbnRleHRJbi5hY2Nlc3NbcF07XG4gICAgICBjb250ZXh0LmFkZEluaXRpYWxpemVyID0gZnVuY3Rpb24gKGYpIHsgaWYgKGRvbmUpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgYWRkIGluaXRpYWxpemVycyBhZnRlciBkZWNvcmF0aW9uIGhhcyBjb21wbGV0ZWRcIik7IGV4dHJhSW5pdGlhbGl6ZXJzLnB1c2goYWNjZXB0KGYgfHwgbnVsbCkpOyB9O1xuICAgICAgdmFyIHJlc3VsdCA9ICgwLCBkZWNvcmF0b3JzW2ldKShraW5kID09PSBcImFjY2Vzc29yXCIgPyB7IGdldDogZGVzY3JpcHRvci5nZXQsIHNldDogZGVzY3JpcHRvci5zZXQgfSA6IGRlc2NyaXB0b3Jba2V5XSwgY29udGV4dCk7XG4gICAgICBpZiAoa2luZCA9PT0gXCJhY2Nlc3NvclwiKSB7XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdm9pZCAwKSBjb250aW51ZTtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsIHx8IHR5cGVvZiByZXN1bHQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgZXhwZWN0ZWRcIik7XG4gICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LmdldCkpIGRlc2NyaXB0b3IuZ2V0ID0gXztcbiAgICAgICAgICBpZiAoXyA9IGFjY2VwdChyZXN1bHQuc2V0KSkgZGVzY3JpcHRvci5zZXQgPSBfO1xuICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5pbml0KSkgaW5pdGlhbGl6ZXJzLnVuc2hpZnQoXyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChfID0gYWNjZXB0KHJlc3VsdCkpIHtcbiAgICAgICAgICBpZiAoa2luZCA9PT0gXCJmaWVsZFwiKSBpbml0aWFsaXplcnMudW5zaGlmdChfKTtcbiAgICAgICAgICBlbHNlIGRlc2NyaXB0b3Jba2V5XSA9IF87XG4gICAgICB9XG4gIH1cbiAgaWYgKHRhcmdldCkgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgY29udGV4dEluLm5hbWUsIGRlc2NyaXB0b3IpO1xuICBkb25lID0gdHJ1ZTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3J1bkluaXRpYWxpemVycyh0aGlzQXJnLCBpbml0aWFsaXplcnMsIHZhbHVlKSB7XG4gIHZhciB1c2VWYWx1ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGluaXRpYWxpemVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFsdWUgPSB1c2VWYWx1ZSA/IGluaXRpYWxpemVyc1tpXS5jYWxsKHRoaXNBcmcsIHZhbHVlKSA6IGluaXRpYWxpemVyc1tpXS5jYWxsKHRoaXNBcmcpO1xuICB9XG4gIHJldHVybiB1c2VWYWx1ZSA/IHZhbHVlIDogdm9pZCAwO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fcHJvcEtleSh4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gXCJzeW1ib2xcIiA/IHggOiBcIlwiLmNvbmNhdCh4KTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3NldEZ1bmN0aW9uTmFtZShmLCBuYW1lLCBwcmVmaXgpIHtcbiAgaWYgKHR5cGVvZiBuYW1lID09PSBcInN5bWJvbFwiKSBuYW1lID0gbmFtZS5kZXNjcmlwdGlvbiA/IFwiW1wiLmNvbmNhdChuYW1lLmRlc2NyaXB0aW9uLCBcIl1cIikgOiBcIlwiO1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGYsIFwibmFtZVwiLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHByZWZpeCA/IFwiXCIuY29uY2F0KHByZWZpeCwgXCIgXCIsIG5hbWUpIDogbmFtZSB9KTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XG4gIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XG4gIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGcgPSBPYmplY3QuY3JlYXRlKCh0eXBlb2YgSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEl0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpO1xuICByZXR1cm4gZy5uZXh0ID0gdmVyYigwKSwgZ1tcInRocm93XCJdID0gdmVyYigxKSwgZ1tcInJldHVyblwiXSA9IHZlcmIoMiksIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgfVxufVxuXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgfVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgb1trMl0gPSBtW2tdO1xufSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xuICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XG4gIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XG4gIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xuICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XG4gICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcbiAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XG4gICAgICB9XG4gIH07XG4gIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XG4gIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcbiAgaWYgKCFtKSByZXR1cm4gbztcbiAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XG4gIHRyeSB7XG4gICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcbiAgfVxuICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cbiAgZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xuICAgICAgfVxuICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XG4gIH1cbiAgcmV0dXJuIGFyO1xufVxuXG4vKiogQGRlcHJlY2F0ZWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcbiAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXG4gICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XG4gIHJldHVybiBhcjtcbn1cblxuLyoqIEBkZXByZWNhdGVkICovXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XG4gIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xuICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXG4gICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcbiAgICAgICAgICByW2tdID0gYVtqXTtcbiAgcmV0dXJuIHI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XG4gIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICB9XG4gIH1cbiAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcbiAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xuICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xuICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xuICByZXR1cm4gaSA9IE9iamVjdC5jcmVhdGUoKHR5cGVvZiBBc3luY0l0ZXJhdG9yID09PSBcImZ1bmN0aW9uXCIgPyBBc3luY0l0ZXJhdG9yIDogT2JqZWN0KS5wcm90b3R5cGUpLCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIsIGF3YWl0UmV0dXJuKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xuICBmdW5jdGlvbiBhd2FpdFJldHVybihmKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZiwgcmVqZWN0KTsgfTsgfVxuICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaWYgKGdbbl0pIHsgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgaWYgKGYpIGlbbl0gPSBmKGlbbl0pOyB9IH1cbiAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxuICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cbiAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxuICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XG4gIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xuICB2YXIgaSwgcDtcbiAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcbiAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogZmFsc2UgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xuICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xuICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xuICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XG4gIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cbiAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcbiAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cbiAgcmV0dXJuIGNvb2tlZDtcbn07XG5cbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gIG9bXCJkZWZhdWx0XCJdID0gdjtcbn07XG5cbnZhciBvd25LZXlzID0gZnVuY3Rpb24obykge1xuICBvd25LZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgfHwgZnVuY3Rpb24gKG8pIHtcbiAgICB2YXIgYXIgPSBbXTtcbiAgICBmb3IgKHZhciBrIGluIG8pIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgaykpIGFyW2FyLmxlbmd0aF0gPSBrO1xuICAgIHJldHVybiBhcjtcbiAgfTtcbiAgcmV0dXJuIG93bktleXMobyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xuICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayA9IG93bktleXMobW9kKSwgaSA9IDA7IGkgPCBrLmxlbmd0aDsgaSsrKSBpZiAoa1tpXSAhPT0gXCJkZWZhdWx0XCIpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwga1tpXSk7XG4gIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XG4gIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xuICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBnZXR0ZXJcIik7XG4gIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xuICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XG4gIGlmIChraW5kID09PSBcIm1cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgbWV0aG9kIGlzIG5vdCB3cml0YWJsZVwiKTtcbiAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xuICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xuICByZXR1cm4gKGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyLCB2YWx1ZSkgOiBmID8gZi52YWx1ZSA9IHZhbHVlIDogc3RhdGUuc2V0KHJlY2VpdmVyLCB2YWx1ZSkpLCB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRJbihzdGF0ZSwgcmVjZWl2ZXIpIHtcbiAgaWYgKHJlY2VpdmVyID09PSBudWxsIHx8ICh0eXBlb2YgcmVjZWl2ZXIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHJlY2VpdmVyICE9PSBcImZ1bmN0aW9uXCIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHVzZSAnaW4nIG9wZXJhdG9yIG9uIG5vbi1vYmplY3RcIik7XG4gIHJldHVybiB0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyID09PSBzdGF0ZSA6IHN0YXRlLmhhcyhyZWNlaXZlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2FkZERpc3Bvc2FibGVSZXNvdXJjZShlbnYsIHZhbHVlLCBhc3luYykge1xuICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHZvaWQgMCkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3QgZXhwZWN0ZWQuXCIpO1xuICAgIHZhciBkaXNwb3NlLCBpbm5lcjtcbiAgICBpZiAoYXN5bmMpIHtcbiAgICAgIGlmICghU3ltYm9sLmFzeW5jRGlzcG9zZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0Rpc3Bvc2UgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgZGlzcG9zZSA9IHZhbHVlW1N5bWJvbC5hc3luY0Rpc3Bvc2VdO1xuICAgIH1cbiAgICBpZiAoZGlzcG9zZSA9PT0gdm9pZCAwKSB7XG4gICAgICBpZiAoIVN5bWJvbC5kaXNwb3NlKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmRpc3Bvc2UgaXMgbm90IGRlZmluZWQuXCIpO1xuICAgICAgZGlzcG9zZSA9IHZhbHVlW1N5bWJvbC5kaXNwb3NlXTtcbiAgICAgIGlmIChhc3luYykgaW5uZXIgPSBkaXNwb3NlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGRpc3Bvc2UgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBub3QgZGlzcG9zYWJsZS5cIik7XG4gICAgaWYgKGlubmVyKSBkaXNwb3NlID0gZnVuY3Rpb24oKSB7IHRyeSB7IGlubmVyLmNhbGwodGhpcyk7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIFByb21pc2UucmVqZWN0KGUpOyB9IH07XG4gICAgZW52LnN0YWNrLnB1c2goeyB2YWx1ZTogdmFsdWUsIGRpc3Bvc2U6IGRpc3Bvc2UsIGFzeW5jOiBhc3luYyB9KTtcbiAgfVxuICBlbHNlIGlmIChhc3luYykge1xuICAgIGVudi5zdGFjay5wdXNoKHsgYXN5bmM6IHRydWUgfSk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG52YXIgX1N1cHByZXNzZWRFcnJvciA9IHR5cGVvZiBTdXBwcmVzc2VkRXJyb3IgPT09IFwiZnVuY3Rpb25cIiA/IFN1cHByZXNzZWRFcnJvciA6IGZ1bmN0aW9uIChlcnJvciwgc3VwcHJlc3NlZCwgbWVzc2FnZSkge1xuICB2YXIgZSA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgcmV0dXJuIGUubmFtZSA9IFwiU3VwcHJlc3NlZEVycm9yXCIsIGUuZXJyb3IgPSBlcnJvciwgZS5zdXBwcmVzc2VkID0gc3VwcHJlc3NlZCwgZTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2Rpc3Bvc2VSZXNvdXJjZXMoZW52KSB7XG4gIGZ1bmN0aW9uIGZhaWwoZSkge1xuICAgIGVudi5lcnJvciA9IGVudi5oYXNFcnJvciA/IG5ldyBfU3VwcHJlc3NlZEVycm9yKGUsIGVudi5lcnJvciwgXCJBbiBlcnJvciB3YXMgc3VwcHJlc3NlZCBkdXJpbmcgZGlzcG9zYWwuXCIpIDogZTtcbiAgICBlbnYuaGFzRXJyb3IgPSB0cnVlO1xuICB9XG4gIHZhciByLCBzID0gMDtcbiAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICB3aGlsZSAociA9IGVudi5zdGFjay5wb3AoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFyLmFzeW5jICYmIHMgPT09IDEpIHJldHVybiBzID0gMCwgZW52LnN0YWNrLnB1c2gociksIFByb21pc2UucmVzb2x2ZSgpLnRoZW4obmV4dCk7XG4gICAgICAgIGlmIChyLmRpc3Bvc2UpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gci5kaXNwb3NlLmNhbGwoci52YWx1ZSk7XG4gICAgICAgICAgaWYgKHIuYXN5bmMpIHJldHVybiBzIHw9IDIsIFByb21pc2UucmVzb2x2ZShyZXN1bHQpLnRoZW4obmV4dCwgZnVuY3Rpb24oZSkgeyBmYWlsKGUpOyByZXR1cm4gbmV4dCgpOyB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHMgfD0gMTtcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGZhaWwoZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzID09PSAxKSByZXR1cm4gZW52Lmhhc0Vycm9yID8gUHJvbWlzZS5yZWplY3QoZW52LmVycm9yKSA6IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIGlmIChlbnYuaGFzRXJyb3IpIHRocm93IGVudi5lcnJvcjtcbiAgfVxuICByZXR1cm4gbmV4dCgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19yZXdyaXRlUmVsYXRpdmVJbXBvcnRFeHRlbnNpb24ocGF0aCwgcHJlc2VydmVKc3gpIHtcbiAgaWYgKHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiICYmIC9eXFwuXFwuP1xcLy8udGVzdChwYXRoKSkge1xuICAgICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFwuKHRzeCkkfCgoPzpcXC5kKT8pKCg/OlxcLlteLi9dKz8pPylcXC4oW2NtXT8pdHMkL2ksIGZ1bmN0aW9uIChtLCB0c3gsIGQsIGV4dCwgY20pIHtcbiAgICAgICAgICByZXR1cm4gdHN4ID8gcHJlc2VydmVKc3ggPyBcIi5qc3hcIiA6IFwiLmpzXCIgOiBkICYmICghZXh0IHx8ICFjbSkgPyBtIDogKGQgKyBleHQgKyBcIi5cIiArIGNtLnRvTG93ZXJDYXNlKCkgKyBcImpzXCIpO1xuICAgICAgfSk7XG4gIH1cbiAgcmV0dXJuIHBhdGg7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgX19leHRlbmRzLFxuICBfX2Fzc2lnbixcbiAgX19yZXN0LFxuICBfX2RlY29yYXRlLFxuICBfX3BhcmFtLFxuICBfX2VzRGVjb3JhdGUsXG4gIF9fcnVuSW5pdGlhbGl6ZXJzLFxuICBfX3Byb3BLZXksXG4gIF9fc2V0RnVuY3Rpb25OYW1lLFxuICBfX21ldGFkYXRhLFxuICBfX2F3YWl0ZXIsXG4gIF9fZ2VuZXJhdG9yLFxuICBfX2NyZWF0ZUJpbmRpbmcsXG4gIF9fZXhwb3J0U3RhcixcbiAgX192YWx1ZXMsXG4gIF9fcmVhZCxcbiAgX19zcHJlYWQsXG4gIF9fc3ByZWFkQXJyYXlzLFxuICBfX3NwcmVhZEFycmF5LFxuICBfX2F3YWl0LFxuICBfX2FzeW5jR2VuZXJhdG9yLFxuICBfX2FzeW5jRGVsZWdhdG9yLFxuICBfX2FzeW5jVmFsdWVzLFxuICBfX21ha2VUZW1wbGF0ZU9iamVjdCxcbiAgX19pbXBvcnRTdGFyLFxuICBfX2ltcG9ydERlZmF1bHQsXG4gIF9fY2xhc3NQcml2YXRlRmllbGRHZXQsXG4gIF9fY2xhc3NQcml2YXRlRmllbGRTZXQsXG4gIF9fY2xhc3NQcml2YXRlRmllbGRJbixcbiAgX19hZGREaXNwb3NhYmxlUmVzb3VyY2UsXG4gIF9fZGlzcG9zZVJlc291cmNlcyxcbiAgX19yZXdyaXRlUmVsYXRpdmVJbXBvcnRFeHRlbnNpb24sXG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogRW50cnktcG9pbnQgZm9yIFN1YlF1ZXJ5IG1hcHBpbmcgaGFuZGxlcnMuXG4gKlxuICogUmUtZXhwb3J0cyBldmVyeSBoYW5kbGVyIHNvIHRoZSBTdWJRdWVyeSBub2RlIGNhbiByZXNvbHZlIHRoZW0gZnJvbVxuICogYSBzaW5nbGUgYC4vZGlzdC9pbmRleC5qc2AgYnVuZGxlIHBhdGguXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaGFuZGxlRW1lcmdlbmN5Q2FuY2VsbGVkID0gZXhwb3J0cy5oYW5kbGVFbWVyZ2VuY3lSZXN1bWVkID0gZXhwb3J0cy5oYW5kbGVFbWVyZ2VuY3lQYXVzZWQgPSBleHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRFeHBpcmVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50Q2FuY2VsbGVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50UmVmdW5kZWQgPSBleHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRDbGFpbWVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50RnVuZGVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50Q3JlYXRlZCA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlEaXNhYmxlZCA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlVbmZyb3plbiA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlGcm96ZW4gPSBleHBvcnRzLmhhbmRsZVRyYW5zcG9ydFJldm9rZWQgPSBleHBvcnRzLmhhbmRsZVRyYW5zcG9ydFZlcmlmaWVkID0gZXhwb3J0cy5oYW5kbGVUcmFuc3BvcnRCb3VuZCA9IGV4cG9ydHMuaGFuZGxlQWN0aXZlUmVsYXRpb25Qb2xpY3lTZXQgPSBleHBvcnRzLmhhbmRsZUFjdGl2ZUF1dGhSZWdpc3RyeVNldCA9IGV4cG9ydHMuaGFuZGxlQWN0aXZlQWdlbnRSZWdpc3RyeVNldCA9IGV4cG9ydHMuaGFuZGxlQWN0aXZlUHJvZmlsZVNldCA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlLZXlSZXZva2VkID0gZXhwb3J0cy5oYW5kbGVJZGVudGl0eUtleUFkZGVkID0gZXhwb3J0cy5oYW5kbGVSZWNvdmVyeUtleVNldCA9IGV4cG9ydHMuaGFuZGxlT3duZXJLZXlSb3RhdGVkID0gZXhwb3J0cy5oYW5kbGVJZGVudGl0eVJlZ2lzdGVyZWQgPSBleHBvcnRzLmhhbmRsZUJsb2NrID0gdm9pZCAwO1xudmFyIGJsb2NrXzEgPSByZXF1aXJlKFwiLi9tYXBwaW5ncy9ibG9ja1wiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUJsb2NrXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBibG9ja18xLmhhbmRsZUJsb2NrOyB9IH0pO1xudmFyIGlkZW50aXR5Q29yZV8xID0gcmVxdWlyZShcIi4vbWFwcGluZ3MvaWRlbnRpdHlDb3JlXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlSWRlbnRpdHlSZWdpc3RlcmVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBpZGVudGl0eUNvcmVfMS5oYW5kbGVJZGVudGl0eVJlZ2lzdGVyZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVPd25lcktleVJvdGF0ZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZU93bmVyS2V5Um90YXRlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVJlY292ZXJ5S2V5U2V0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBpZGVudGl0eUNvcmVfMS5oYW5kbGVSZWNvdmVyeUtleVNldDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUlkZW50aXR5S2V5QWRkZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZUlkZW50aXR5S2V5QWRkZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVJZGVudGl0eUtleVJldm9rZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZUlkZW50aXR5S2V5UmV2b2tlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUFjdGl2ZVByb2ZpbGVTZXRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZUFjdGl2ZVByb2ZpbGVTZXQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVBY3RpdmVBZ2VudFJlZ2lzdHJ5U2V0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBpZGVudGl0eUNvcmVfMS5oYW5kbGVBY3RpdmVBZ2VudFJlZ2lzdHJ5U2V0OyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlQWN0aXZlQXV0aFJlZ2lzdHJ5U2V0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBpZGVudGl0eUNvcmVfMS5oYW5kbGVBY3RpdmVBdXRoUmVnaXN0cnlTZXQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVBY3RpdmVSZWxhdGlvblBvbGljeVNldFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gaWRlbnRpdHlDb3JlXzEuaGFuZGxlQWN0aXZlUmVsYXRpb25Qb2xpY3lTZXQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVUcmFuc3BvcnRCb3VuZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gaWRlbnRpdHlDb3JlXzEuaGFuZGxlVHJhbnNwb3J0Qm91bmQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVUcmFuc3BvcnRWZXJpZmllZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gaWRlbnRpdHlDb3JlXzEuaGFuZGxlVHJhbnNwb3J0VmVyaWZpZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVUcmFuc3BvcnRSZXZva2VkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBpZGVudGl0eUNvcmVfMS5oYW5kbGVUcmFuc3BvcnRSZXZva2VkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlSWRlbnRpdHlGcm96ZW5cIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZUlkZW50aXR5RnJvemVuOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlSWRlbnRpdHlVbmZyb3plblwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gaWRlbnRpdHlDb3JlXzEuaGFuZGxlSWRlbnRpdHlVbmZyb3plbjsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUlkZW50aXR5RGlzYWJsZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZUlkZW50aXR5RGlzYWJsZWQ7IH0gfSk7XG52YXIgcGF5bWVudEludGVudF8xID0gcmVxdWlyZShcIi4vbWFwcGluZ3MvcGF5bWVudEludGVudFwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVBheW1lbnRJbnRlbnRDcmVhdGVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXltZW50SW50ZW50XzEuaGFuZGxlUGF5bWVudEludGVudENyZWF0ZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVQYXltZW50SW50ZW50RnVuZGVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXltZW50SW50ZW50XzEuaGFuZGxlUGF5bWVudEludGVudEZ1bmRlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVBheW1lbnRJbnRlbnRDbGFpbWVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXltZW50SW50ZW50XzEuaGFuZGxlUGF5bWVudEludGVudENsYWltZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVQYXltZW50SW50ZW50UmVmdW5kZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHBheW1lbnRJbnRlbnRfMS5oYW5kbGVQYXltZW50SW50ZW50UmVmdW5kZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVQYXltZW50SW50ZW50Q2FuY2VsbGVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXltZW50SW50ZW50XzEuaGFuZGxlUGF5bWVudEludGVudENhbmNlbGxlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVBheW1lbnRJbnRlbnRFeHBpcmVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXltZW50SW50ZW50XzEuaGFuZGxlUGF5bWVudEludGVudEV4cGlyZWQ7IH0gfSk7XG52YXIgZW1lcmdlbmN5XzEgPSByZXF1aXJlKFwiLi9tYXBwaW5ncy9lbWVyZ2VuY3lcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVFbWVyZ2VuY3lQYXVzZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGVtZXJnZW5jeV8xLmhhbmRsZUVtZXJnZW5jeVBhdXNlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUVtZXJnZW5jeVJlc3VtZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGVtZXJnZW5jeV8xLmhhbmRsZUVtZXJnZW5jeVJlc3VtZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVFbWVyZ2VuY3lDYW5jZWxsZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGVtZXJnZW5jeV8xLmhhbmRsZUVtZXJnZW5jeUNhbmNlbGxlZDsgfSB9KTtcbnJlcXVpcmUoXCJAcG9sa2Fkb3QvYXBpLWF1Z21lbnRcIik7XG4iXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJoYW5kbGVCbG9jayIsIkNoYWluQ2hlY2twb2ludF8xIiwidXRpbHNfMSIsImFzeW5jIiwiYmxvY2siLCJfYSIsIl9iIiwiYmxvY2tOdW1iZXIiLCJCaWdJbnQiLCJoZWFkZXIiLCJudW1iZXIiLCJ0b1N0cmluZyIsImJsb2NrSGFzaCIsImhhc2giLCJ0b0hleCIsImNoZWNrcG9pbnQiLCJDaGFpbkNoZWNrcG9pbnQiLCJnZXQiLCJDSEFJTl9JRCIsInVwZGF0ZWRBdCIsInRpbWVzdGFtcCIsIkRhdGUiLCJjcmVhdGUiLCJpZCIsImNoYWluSWQiLCJzYXZlIiwiaGFuZGxlRW1lcmdlbmN5Q2FuY2VsbGVkIiwiaGFuZGxlRW1lcmdlbmN5UmVzdW1lZCIsImhhbmRsZUVtZXJnZW5jeVBhdXNlZCIsIkVtZXJnZW5jeVN0YXR1c18xIiwib3B0SGV4IiwicmF3IiwidXBzZXJ0RW1lcmdlbmN5U3RhdHVzIiwiZXZlbnQiLCJzdGF0dXMiLCJkYXRhIiwic2NvcGUiLCJzY29wZVJhdyIsImpzb24iLCJ0b0pTT04iLCJlbnRyaWVzIiwibGVuZ3RoIiwibmFtZSIsInZhbCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzZXJpYWxpemVTY29wZSIsImJuIiwiYmxvY2tOdW0iLCJ1cGRhdGVkQnkiLCJyZWFzb25IYXNoIiwiZW1lcmdlbmN5U3RhdHVzRW50aXR5SWQiLCJlcyIsIkVtZXJnZW5jeVN0YXR1cyIsInVwZGF0ZWRBdEJsb2NrIiwiaGFuZGxlSWRlbnRpdHlEaXNhYmxlZCIsImhhbmRsZUlkZW50aXR5VW5mcm96ZW4iLCJoYW5kbGVJZGVudGl0eUZyb3plbiIsImhhbmRsZVRyYW5zcG9ydFJldm9rZWQiLCJoYW5kbGVUcmFuc3BvcnRWZXJpZmllZCIsImhhbmRsZVRyYW5zcG9ydEJvdW5kIiwiaGFuZGxlQWN0aXZlUmVsYXRpb25Qb2xpY3lTZXQiLCJoYW5kbGVBY3RpdmVBdXRoUmVnaXN0cnlTZXQiLCJoYW5kbGVBY3RpdmVBZ2VudFJlZ2lzdHJ5U2V0IiwiaGFuZGxlQWN0aXZlUHJvZmlsZVNldCIsImhhbmRsZUlkZW50aXR5S2V5UmV2b2tlZCIsImhhbmRsZUlkZW50aXR5S2V5QWRkZWQiLCJoYW5kbGVSZWNvdmVyeUtleVNldCIsImhhbmRsZU93bmVyS2V5Um90YXRlZCIsImhhbmRsZUlkZW50aXR5UmVnaXN0ZXJlZCIsIkNoYWluSWRlbnRpdHlfMSIsIklkZW50aXR5S2V5XzEiLCJzdHIiLCJ2IiwiZ2V0SWRlbnRpdHkiLCJpZGVudGl0eUlkIiwiQ2hhaW5JZGVudGl0eSIsImlkZW50aXR5RW50aXR5SWQiLCJzZXJpYWxpemVDb250ZW50UmVmIiwib2JqIiwiU3RyaW5nIiwiZmV0Y2hJZGVudGl0eVBvaW50ZXJzIiwiYXBpIiwicXVlcnkiLCJpZGVudGl0eUNvcmUiLCJpZGVudGl0aWVzIiwiYWN0aXZlUHJvZmlsZSIsImFjdGl2ZUFnZW50UmVnaXN0cnkiLCJhY3RpdmVBdXRoUmVnaXN0cnkiLCJhY3RpdmVSZWxhdGlvblBvbGljeSIsIl8iLCJ0b3VjaElkZW50aXR5IiwiaWRlbnRpdHkiLCJvd25lciIsImNyZWF0ZWRBdEJsb2NrIiwibmV3T3duZXIiLCJrZXlJZCIsInB1cnBvc2VSYXciLCJwdXJwb3NlSnNvbiIsInB1cnBvc2UiLCJrZXkiLCJJZGVudGl0eUtleSIsImlkZW50aXR5S2V5RW50aXR5SWQiLCJhY2NvdW50IiwicmVjb3JkSnNvbiIsImF1dGhvcml6ZWRLZXlzIiwicHRycyIsImhhbmRsZVBheW1lbnRJbnRlbnRFeHBpcmVkIiwiaGFuZGxlUGF5bWVudEludGVudENhbmNlbGxlZCIsImhhbmRsZVBheW1lbnRJbnRlbnRSZWZ1bmRlZCIsImhhbmRsZVBheW1lbnRJbnRlbnRDbGFpbWVkIiwiaGFuZGxlUGF5bWVudEludGVudEZ1bmRlZCIsImhhbmRsZVBheW1lbnRJbnRlbnRDcmVhdGVkIiwiUGF5bWVudEludGVudF8xIiwiU2V0dGxlbWVudEV2ZW50XzEiLCJnZXRJbnRlbnQiLCJpbnRlbnRJZCIsIlBheW1lbnRJbnRlbnQiLCJwYXltZW50SW50ZW50RW50aXR5SWQiLCJhcHBlbmRTZXR0bGVtZW50RXZlbnQiLCJldmVudFR5cGUiLCJleHRyaW5zaWMiLCJpZHgiLCJldmVudEluZGV4Iiwic2V0dGxlbWVudEV2ZW50RW50aXR5SWQiLCJzZSIsIlNldHRsZW1lbnRFdmVudCIsImV4dHJpbnNpY0luZGV4IiwidW5kZWZpbmVkIiwicGF5ZXJJZGVudGl0eUlkIiwicGF5ZWVJZGVudGl0eUlkIiwiYW1vdW50IiwiYWN0aW9uUmF3IiwiYWN0aW9uTmFtZXNwYWNlIiwiYWN0aW9uSWQiLCJucyIsIkFycmF5IiwiaXNBcnJheSIsIkJ1ZmZlciIsImZyb20iLCJzdGFydHNXaXRoIiwic2xpY2UiLCJpbnRlbnQiLCJzZXR0bGVtZW50TW9kZSIsInNldHRsZW1lbnRNb2RlSnNvbiIsInByb2Nlc3MiLCJlbnYiLCJhc3NlcnRfMSIsIl9faW1wb3J0RGVmYXVsdCIsImNvbnN0cnVjdG9yIiwidGhpcyIsIl9uYW1lIiwiZGVmYXVsdCIsInN0b3JlIiwic2V0IiwicmVtb3ZlIiwicmVjb3JkIiwiZ2V0QnlGaWVsZHMiLCJmaWx0ZXIiLCJvcHRpb25zIiwibWFwIiwiZW50aXR5IiwiYXNzaWduIiwibW9kdWxlIiwicmVxdWlyZSIsInBhY2thZ2VJbmZvIiwicGF0aCIsIlVSTCIsInBhdGhuYW1lIiwic3Vic3RyaW5nIiwibGFzdEluZGV4T2YiLCJ0eXBlIiwidmVyc2lvbiIsInhnbG9iYWwiLCJnbG9iYWxUaGlzIiwiZ2xvYmFsIiwic2VsZiIsIndpbmRvdyIsIkZ1bmN0aW9uIiwiZm9ybWF0SW5mbyIsImZvcm1hdFZlcnNpb24iLCJleHRyYWN0ZWQiLCJubUluZGV4IiwiaW5kZXhPZiIsInBhZFN0YXJ0IiwiZ2V0UGF0aCIsImluZm9QYXRoIiwicGF0aE9yRm4iLCJ3YXJuIiwicHJlIiwiYWxsIiwiZm10IiwiY29uc29sZSIsIm1heCIsImkiLCJjb3VudCIsIk1hdGgiLCJkIiwicGFkRW5kIiwiam9pbiIsImZvcm1hdERpc3BsYXkiLCJkZXBzIiwiRXJyb3IiLCJlbnRyeSIsIl9nbG9iYWwiLCJfX3BvbGthZG90anMiLCJnZXRFbnRyeSIsInB1c2giLCJlbnRyaWVzU2FtZVZlcnNpb24iLCJldmVyeSIsImUiLCJlc21DanNXYXJuaW5nRGlzYWJsZWQiLCJtaXNtYXRjaGVzIiwiZGV0ZWN0UGFja2FnZSIsImV4dGVuZFN0YXRpY3MiLCJiIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJwIiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiX19leHRlbmRzIiwiVHlwZUVycm9yIiwiX18iLCJfX2Fzc2lnbiIsInQiLCJzIiwibiIsImFyZ3VtZW50cyIsImFwcGx5IiwiX19yZXN0IiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImRlc2MiLCJjIiwiciIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsIlJlZmxlY3QiLCJkZWNvcmF0ZSIsIl9fcGFyYW0iLCJwYXJhbUluZGV4IiwiZGVjb3JhdG9yIiwiX19lc0RlY29yYXRlIiwiY3RvciIsImRlc2NyaXB0b3JJbiIsImNvbnRleHRJbiIsImluaXRpYWxpemVycyIsImV4dHJhSW5pdGlhbGl6ZXJzIiwiYWNjZXB0IiwiZiIsImtpbmQiLCJkZXNjcmlwdG9yIiwiZG9uZSIsImNvbnRleHQiLCJhY2Nlc3MiLCJhZGRJbml0aWFsaXplciIsInJlc3VsdCIsImluaXQiLCJ1bnNoaWZ0IiwiX19ydW5Jbml0aWFsaXplcnMiLCJ0aGlzQXJnIiwidXNlVmFsdWUiLCJfX3Byb3BLZXkiLCJ4IiwiY29uY2F0IiwiX19zZXRGdW5jdGlvbk5hbWUiLCJwcmVmaXgiLCJkZXNjcmlwdGlvbiIsImNvbmZpZ3VyYWJsZSIsIl9fbWV0YWRhdGEiLCJtZXRhZGF0YUtleSIsIm1ldGFkYXRhVmFsdWUiLCJtZXRhZGF0YSIsIl9fYXdhaXRlciIsIl9hcmd1bWVudHMiLCJQIiwiZ2VuZXJhdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmdWxmaWxsZWQiLCJzdGVwIiwibmV4dCIsInJlamVjdGVkIiwidGhlbiIsIl9fZ2VuZXJhdG9yIiwiYm9keSIsInkiLCJsYWJlbCIsInNlbnQiLCJ0cnlzIiwib3BzIiwiZyIsIkl0ZXJhdG9yIiwidmVyYiIsIlN5bWJvbCIsIml0ZXJhdG9yIiwib3AiLCJwb3AiLCJfX2NyZWF0ZUJpbmRpbmciLCJvIiwibSIsImsiLCJrMiIsIl9fZXNNb2R1bGUiLCJ3cml0YWJsZSIsImVudW1lcmFibGUiLCJfX2V4cG9ydFN0YXIiLCJfX3ZhbHVlcyIsIl9fcmVhZCIsImFyIiwiZXJyb3IiLCJfX3NwcmVhZCIsIl9fc3ByZWFkQXJyYXlzIiwiaWwiLCJhIiwiaiIsImpsIiwiX19zcHJlYWRBcnJheSIsInRvIiwicGFjayIsImwiLCJfX2F3YWl0IiwiX19hc3luY0dlbmVyYXRvciIsImFzeW5jSXRlcmF0b3IiLCJxIiwiQXN5bmNJdGVyYXRvciIsInJlc3VtZSIsImZ1bGZpbGwiLCJzZXR0bGUiLCJzaGlmdCIsIl9fYXN5bmNEZWxlZ2F0b3IiLCJfX2FzeW5jVmFsdWVzIiwiX19tYWtlVGVtcGxhdGVPYmplY3QiLCJjb29rZWQiLCJfX3NldE1vZHVsZURlZmF1bHQiLCJvd25LZXlzIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsIl9faW1wb3J0U3RhciIsIm1vZCIsIl9fY2xhc3NQcml2YXRlRmllbGRHZXQiLCJyZWNlaXZlciIsInN0YXRlIiwiaGFzIiwiX19jbGFzc1ByaXZhdGVGaWVsZFNldCIsIl9fY2xhc3NQcml2YXRlRmllbGRJbiIsIl9fYWRkRGlzcG9zYWJsZVJlc291cmNlIiwiZGlzcG9zZSIsImlubmVyIiwiYXN5bmNEaXNwb3NlIiwic3RhY2siLCJfU3VwcHJlc3NlZEVycm9yIiwiU3VwcHJlc3NlZEVycm9yIiwic3VwcHJlc3NlZCIsIm1lc3NhZ2UiLCJfX2Rpc3Bvc2VSZXNvdXJjZXMiLCJmYWlsIiwiaGFzRXJyb3IiLCJfX3Jld3JpdGVSZWxhdGl2ZUltcG9ydEV4dGVuc2lvbiIsInByZXNlcnZlSnN4IiwidGVzdCIsInJlcGxhY2UiLCJ0c3giLCJleHQiLCJjbSIsInRvTG93ZXJDYXNlIiwiX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIm1vZHVsZUlkIiwiY2FjaGVkTW9kdWxlIiwiX193ZWJwYWNrX21vZHVsZXNfXyIsImRlZmluaXRpb24iLCJwcm9wIiwidG9TdHJpbmdUYWciLCJibG9ja18xIiwiaWRlbnRpdHlDb3JlXzEiLCJwYXltZW50SW50ZW50XzEiLCJlbWVyZ2VuY3lfMSJdLCJzb3VyY2VSb290IjoiIn0=