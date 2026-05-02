(() => {
    "use strict";
    var e = {
        751(e, t, n) {
            var a;
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handleBlock = void 0;
            const r = n(471), o = null !== (a = process.env.CHAIN_ID) && void 0 !== a ? a : "substrate:vibly-solo";
            t.handleBlock = async function(e) {
                var t, n;
                const a = BigInt(e.block.header.number.toString()), i = e.block.header.hash.toHex();
                let s = await r.GovernanceCheckpoint.get(o);
                s ? (s.blockNumber = a, s.blockHash = i, s.updatedAt = null !== (n = e.timestamp) && void 0 !== n ? n : new Date) : s = r.GovernanceCheckpoint.create({
                    id: o,
                    blockNumber: a,
                    blockHash: i,
                    updatedAt: null !== (t = e.timestamp) && void 0 !== t ? t : new Date
                }), await s.save();
            };
        },
        19(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handleUndelegated = t.handleDelegated = t.handleVoteRemoved = t.handleVoteCast = void 0;
            const a = n(605), r = n(207), o = n(739);
            function i(e, t) {
                var n, a;
                return null !== (n = e[t]) && void 0 !== n ? n : e[a = t, a.charAt(0).toUpperCase() + a.slice(1)];
            }
            t.handleVoteCast = async function(e) {
                var t, n, r, s, d, c;
                const {event: {data: u}, block: l, extrinsic: f} = e, p = u[0].toString(), v = u[1].toJSON(), h = u[2].toNumber(), m = BigInt(l.block.header.number.toString()), b = null !== (t = l.timestamp) && void 0 !== t ? t : new Date;
                let y = "Aye", g = 0, _ = BigInt(0);
                const w = i(v, "standard"), j = i(v, "splitAbstain"), I = i(v, "split");
                if (w) {
                    const e = w;
                    y = e.vote.aye ? "Aye" : "Nay", g = "string" == typeof e.vote.conviction ? Number(e.vote.conviction.replace(/\D/g, "")) : e.vote.conviction, 
                    _ = BigInt(null !== (n = e.balance) && void 0 !== n ? n : "0");
                } else if (j) {
                    y = "Abstain";
                    _ = BigInt(null !== (r = j.abstain) && void 0 !== r ? r : "0");
                } else if (I) {
                    const e = I, t = BigInt(null !== (s = e.aye) && void 0 !== s ? s : "0"), n = BigInt(null !== (d = e.nay) && void 0 !== d ? d : "0");
                    y = t >= n ? "Aye" : "Nay", _ = t + n;
                }
                const P = (0, o.voteId)(h, p);
                let k = await a.GovernanceVote.get(P);
                k ? (k.stance = y, k.conviction = g, k.balance = _, k.isRemoved = !1, k.blockNumber = m, 
                k.updatedAt = b) : k = a.GovernanceVote.create({
                    id: P,
                    chainId: o.CHAIN_ID,
                    referendumIndex: h,
                    voter: p,
                    stance: y,
                    conviction: g,
                    balance: _,
                    isRemoved: !1,
                    subjectId: (0, o.subjectId)(h),
                    blockNumber: m,
                    extrinsicIndex: null !== (c = null == f ? void 0 : f.idx) && void 0 !== c ? c : void 0,
                    updatedAt: b
                }), await k.save();
            }, t.handleVoteRemoved = async function(e) {
                var t;
                const {event: {data: n}, block: r} = e, i = n[0].toString(), s = n[1].toNumber(), d = (0, 
                o.voteId)(s, i), c = await a.GovernanceVote.get(d);
                c && (c.isRemoved = !0, c.updatedAt = null !== (t = r.timestamp) && void 0 !== t ? t : new Date, 
                await c.save());
            }, t.handleDelegated = async function(e) {
                var t;
                const {event: {data: n}, block: a} = e, i = n[0].toString(), s = n[1].toString(), d = (0, 
                o.delegationId)(0, i), c = BigInt(a.block.header.number.toString()), u = null !== (t = a.timestamp) && void 0 !== t ? t : new Date;
                let l = await r.GovernanceDelegation.get(d);
                l ? (l.delegatee = s, l.isActive = !0, l.blockNumber = c, l.updatedAt = u) : l = r.GovernanceDelegation.create({
                    id: d,
                    chainId: o.CHAIN_ID,
                    track: 0,
                    delegator: i,
                    delegatee: s,
                    conviction: 0,
                    balance: BigInt(0),
                    isActive: !0,
                    blockNumber: c,
                    updatedAt: u
                }), await l.save();
            }, t.handleUndelegated = async function(e) {
                var t;
                const {event: {data: n}, block: a} = e, i = n[0].toString(), s = (0, o.delegationId)(0, i), d = await r.GovernanceDelegation.get(s);
                d && (d.isActive = !1, d.updatedAt = null !== (t = a.timestamp) && void 0 !== t ? t : new Date, 
                await d.save());
            };
        },
        22(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handlePreimageCleared = t.handlePreimageRequested = t.handlePreimageNoted = void 0;
            const a = n(491), r = n(739);
            t.handlePreimageNoted = async function(e) {
                var t;
                const {event: {data: n}, block: o} = e, i = n[0].toHex(), s = BigInt(o.block.header.number.toString()), d = null !== (t = o.timestamp) && void 0 !== t ? t : new Date;
                let c = await a.Preimage.get(i);
                c ? (c.status = "Noted", c.blockNumber = s, c.updatedAt = d) : c = a.Preimage.create({
                    id: i,
                    chainId: r.CHAIN_ID,
                    hash: i,
                    data: "",
                    len: 0,
                    status: "Noted",
                    blockNumber: s,
                    updatedAt: d
                }), await c.save();
            }, t.handlePreimageRequested = async function(e) {
                var t;
                const {event: {data: n}, block: o} = e, i = n[0].toHex(), s = BigInt(o.block.header.number.toString()), d = null !== (t = o.timestamp) && void 0 !== t ? t : new Date;
                let c = await a.Preimage.get(i);
                c ? (c.status = "Requested", c.updatedAt = d) : c = a.Preimage.create({
                    id: i,
                    chainId: r.CHAIN_ID,
                    hash: i,
                    data: "",
                    len: 0,
                    status: "Requested",
                    blockNumber: s,
                    updatedAt: d
                }), await c.save();
            }, t.handlePreimageCleared = async function(e) {
                var t;
                const {event: {data: n}, block: r} = e, o = n[0].toHex(), i = await a.Preimage.get(o);
                i && (i.status = "Cleared", i.updatedAt = null !== (t = r.timestamp) && void 0 !== t ? t : new Date, 
                await i.save());
            };
        },
        892(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handleReferendumKilled = t.handleReferendumTimedOut = t.handleReferendumCancelled = t.handleReferendumRejected = t.handleReferendumApproved = t.handleReferendumConfirmAborted = t.handleReferendumConfirmStarted = t.handleReferendumDecisionStarted = t.handleReferendumSubmitted = void 0;
            const a = n(241), r = n(739);
            async function o(e, t, n, o) {
                const i = (0, r.subjectId)(e);
                let s = await a.GovernanceSubject.get(i);
                return s || (s = a.GovernanceSubject.create({
                    id: i,
                    chainId: r.CHAIN_ID,
                    referendumIndex: e,
                    status: "Submitted",
                    track: t,
                    submittedAt: n,
                    ayeVotes: BigInt(0),
                    nayVotes: BigInt(0),
                    abstainVotes: BigInt(0),
                    updatedAt: o
                })), s;
            }
            t.handleReferendumSubmitted = async function(e) {
                var t;
                const {event: {data: n}, block: a, extrinsic: r} = e, i = n[0].toNumber(), s = n[1].toNumber(), d = n[2], c = BigInt(a.block.header.number.toString()), u = null !== (t = a.timestamp) && void 0 !== t ? t : new Date, l = await o(i, s, c, u);
                l.status = "Submitted", l.submittedAt = c, l.proposalHash = d.toHex(), l.updatedAt = u, 
                await l.save();
            }, t.handleReferendumDecisionStarted = async function(e) {
                var t, n, a, r;
                const {event: {data: i}, block: s} = e, d = i[0].toNumber(), c = i[1].toNumber(), u = i[3].toJSON(), l = BigInt(s.block.header.number.toString()), f = null !== (t = s.timestamp) && void 0 !== t ? t : new Date, p = await o(d, c, l, f);
                p.status = "Deciding", p.decidingSince = l, p.ayeVotes = BigInt(null !== (n = u.ayes) && void 0 !== n ? n : "0"), 
                p.nayVotes = BigInt(null !== (a = u.nays) && void 0 !== a ? a : "0"), p.abstainVotes = BigInt(null !== (r = u.abstain) && void 0 !== r ? r : "0"), 
                p.updatedAt = f, await p.save();
            }, t.handleReferendumConfirmStarted = async function(e) {
                var t;
                const {event: {data: n}, block: o} = e, i = n[0].toNumber(), s = BigInt(o.block.header.number.toString()), d = null !== (t = o.timestamp) && void 0 !== t ? t : new Date, c = await a.GovernanceSubject.get((0, 
                r.subjectId)(i));
                c && (c.status = "Confirming", c.confirmingSince = s, c.updatedAt = d, await c.save());
            }, t.handleReferendumConfirmAborted = async function(e) {
                var t;
                const {event: {data: n}, block: o} = e, i = n[0].toNumber(), s = await a.GovernanceSubject.get((0, 
                r.subjectId)(i));
                s && (s.status = "Deciding", s.confirmingSince = void 0, s.updatedAt = null !== (t = o.timestamp) && void 0 !== t ? t : new Date, 
                await s.save());
            }, t.handleReferendumApproved = async function(e) {
                var t;
                const {event: {data: n}, block: o} = e, i = n[0].toNumber(), s = BigInt(o.block.header.number.toString()), d = await a.GovernanceSubject.get((0, 
                r.subjectId)(i));
                d && (d.status = "Approved", d.decidedAt = s, d.updatedAt = null !== (t = o.timestamp) && void 0 !== t ? t : new Date, 
                await d.save());
            }, t.handleReferendumRejected = async function(e) {
                var t;
                const {event: {data: n}, block: o} = e, i = n[0].toNumber(), s = BigInt(o.block.header.number.toString()), d = await a.GovernanceSubject.get((0, 
                r.subjectId)(i));
                d && (d.status = "Rejected", d.decidedAt = s, d.updatedAt = null !== (t = o.timestamp) && void 0 !== t ? t : new Date, 
                await d.save());
            }, t.handleReferendumCancelled = async function(e) {
                var t;
                const {event: {data: n}, block: o} = e, i = n[0].toNumber(), s = BigInt(o.block.header.number.toString()), d = await a.GovernanceSubject.get((0, 
                r.subjectId)(i));
                d && (d.status = "Cancelled", d.decidedAt = s, d.updatedAt = null !== (t = o.timestamp) && void 0 !== t ? t : new Date, 
                await d.save());
            }, t.handleReferendumTimedOut = async function(e) {
                var t;
                const {event: {data: n}, block: o} = e, i = n[0].toNumber(), s = BigInt(o.block.header.number.toString()), d = await a.GovernanceSubject.get((0, 
                r.subjectId)(i));
                d && (d.status = "TimedOut", d.decidedAt = s, d.updatedAt = null !== (t = o.timestamp) && void 0 !== t ? t : new Date, 
                await d.save());
            }, t.handleReferendumKilled = async function(e) {
                var t;
                const {event: {data: n}, block: o} = e, i = n[0].toNumber(), s = BigInt(o.block.header.number.toString()), d = await a.GovernanceSubject.get((0, 
                r.subjectId)(i));
                d && (d.status = "Killed", d.decidedAt = s, d.updatedAt = null !== (t = o.timestamp) && void 0 !== t ? t : new Date, 
                await d.save());
            };
        },
        789(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handleTreasuryAwarded = t.handleTreasuryRejected = t.handleTreasuryApproved = t.handleTreasuryProposed = void 0;
            const a = n(770), r = n(739);
            function o(e) {
                return `${r.CHAIN_ID}:${e}`;
            }
            t.handleTreasuryProposed = async function(e) {
                var t;
                const {event: {data: n}, block: i} = e, s = n[0].toNumber(), d = BigInt(i.block.header.number.toString()), c = null !== (t = i.timestamp) && void 0 !== t ? t : new Date, u = o(s), l = a.TreasuryProposal.create({
                    id: u,
                    chainId: r.CHAIN_ID,
                    proposalIndex: s,
                    proposer: "",
                    beneficiary: "",
                    value: BigInt(0),
                    bond: BigInt(0),
                    status: "Proposed",
                    blockNumber: d,
                    updatedAt: c
                });
                await l.save();
            }, t.handleTreasuryApproved = async function(e) {
                var t;
                const {event: {data: n}, block: r} = e, i = n[0].toNumber(), s = await a.TreasuryProposal.get(o(i));
                s && (s.status = "Approved", s.updatedAt = null !== (t = r.timestamp) && void 0 !== t ? t : new Date, 
                await s.save());
            }, t.handleTreasuryRejected = async function(e) {
                var t;
                const {event: {data: n}, block: r} = e, i = n[0].toNumber(), s = await a.TreasuryProposal.get(o(i));
                s && (s.status = "Rejected", s.updatedAt = null !== (t = r.timestamp) && void 0 !== t ? t : new Date, 
                await s.save());
            }, t.handleTreasuryAwarded = async function(e) {
                var t;
                const {event: {data: n}, block: r} = e, i = n[0].toNumber(), s = await a.TreasuryProposal.get(o(i));
                s && (s.status = "Awarded", s.updatedAt = null !== (t = r.timestamp) && void 0 !== t ? t : new Date, 
                await s.save());
            };
        },
        739(e, t) {
            var n;
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.delegationId = t.voteId = t.subjectId = t.CHAIN_ID = void 0, t.CHAIN_ID = null !== (n = process.env.CHAIN_ID) && void 0 !== n ? n : "substrate:vibly-solo", 
            t.subjectId = function(e) {
                return `${t.CHAIN_ID}:${e}`;
            }, t.voteId = function(e, n) {
                return `${t.CHAIN_ID}:${e}:${n}`;
            }, t.delegationId = function(e, n) {
                return `${t.CHAIN_ID}:${e}:${n}`;
            };
        },
        471(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.GovernanceCheckpoint = void 0;
            const a = n(635).__importDefault(n(613));
            t.GovernanceCheckpoint = class {
                constructor(e, t, n, a) {
                    this.id = e, this.blockNumber = t, this.blockHash = n, this.updatedAt = a;
                }
                get _name() {
                    return "GovernanceCheckpoint";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save GovernanceCheckpoint entity without an ID"), 
                    await store.set("GovernanceCheckpoint", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove GovernanceCheckpoint entity without an ID"), 
                    await store.remove("GovernanceCheckpoint", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get GovernanceCheckpoint entity without an ID");
                    const t = await store.get("GovernanceCheckpoint", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("GovernanceCheckpoint", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.blockNumber, e.blockHash, e.updatedAt);
                    return Object.assign(t, e), t;
                }
            };
        },
        207(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.GovernanceDelegation = void 0;
            const a = n(635).__importDefault(n(613));
            t.GovernanceDelegation = class {
                constructor(e, t, n, a, r, o, i, s, d, c) {
                    this.id = e, this.chainId = t, this.track = n, this.delegator = a, this.delegatee = r, 
                    this.conviction = o, this.balance = i, this.isActive = s, this.blockNumber = d, 
                    this.updatedAt = c;
                }
                get _name() {
                    return "GovernanceDelegation";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save GovernanceDelegation entity without an ID"), 
                    await store.set("GovernanceDelegation", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove GovernanceDelegation entity without an ID"), 
                    await store.remove("GovernanceDelegation", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get GovernanceDelegation entity without an ID");
                    const t = await store.get("GovernanceDelegation", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getBySubjectId(e, t) {
                    return (await store.getByField("GovernanceDelegation", "subjectId", e, t)).map(e => this.create(e));
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("GovernanceDelegation", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.track, e.delegator, e.delegatee, e.conviction, e.balance, e.isActive, e.blockNumber, e.updatedAt);
                    return Object.assign(t, e), t;
                }
            };
        },
        241(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.GovernanceSubject = void 0;
            const a = n(635).__importDefault(n(613));
            t.GovernanceSubject = class {
                constructor(e, t, n, a, r, o, i, s, d, c) {
                    this.id = e, this.chainId = t, this.referendumIndex = n, this.status = a, this.track = r, 
                    this.submittedAt = o, this.ayeVotes = i, this.nayVotes = s, this.abstainVotes = d, 
                    this.updatedAt = c;
                }
                get _name() {
                    return "GovernanceSubject";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save GovernanceSubject entity without an ID"), 
                    await store.set("GovernanceSubject", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove GovernanceSubject entity without an ID"), 
                    await store.remove("GovernanceSubject", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get GovernanceSubject entity without an ID");
                    const t = await store.get("GovernanceSubject", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("GovernanceSubject", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.referendumIndex, e.status, e.track, e.submittedAt, e.ayeVotes, e.nayVotes, e.abstainVotes, e.updatedAt);
                    return Object.assign(t, e), t;
                }
            };
        },
        605(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.GovernanceVote = void 0;
            const a = n(635).__importDefault(n(613));
            t.GovernanceVote = class {
                constructor(e, t, n, a, r, o, i, s, d, c, u) {
                    this.id = e, this.chainId = t, this.referendumIndex = n, this.voter = a, this.stance = r, 
                    this.conviction = o, this.balance = i, this.isRemoved = s, this.subjectId = d, this.blockNumber = c, 
                    this.updatedAt = u;
                }
                get _name() {
                    return "GovernanceVote";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save GovernanceVote entity without an ID"), await store.set("GovernanceVote", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove GovernanceVote entity without an ID"), 
                    await store.remove("GovernanceVote", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get GovernanceVote entity without an ID");
                    const t = await store.get("GovernanceVote", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getBySubjectId(e, t) {
                    return (await store.getByField("GovernanceVote", "subjectId", e, t)).map(e => this.create(e));
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("GovernanceVote", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.referendumIndex, e.voter, e.stance, e.conviction, e.balance, e.isRemoved, e.subjectId, e.blockNumber, e.updatedAt);
                    return Object.assign(t, e), t;
                }
            };
        },
        491(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.Preimage = void 0;
            const a = n(635).__importDefault(n(613));
            t.Preimage = class {
                constructor(e, t, n, a, r, o, i, s) {
                    this.id = e, this.chainId = t, this.hash = n, this.data = a, this.len = r, this.status = o, 
                    this.blockNumber = i, this.updatedAt = s;
                }
                get _name() {
                    return "Preimage";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save Preimage entity without an ID"), await store.set("Preimage", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove Preimage entity without an ID"), await store.remove("Preimage", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get Preimage entity without an ID");
                    const t = await store.get("Preimage", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("Preimage", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.hash, e.data, e.len, e.status, e.blockNumber, e.updatedAt);
                    return Object.assign(t, e), t;
                }
            };
        },
        770(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.TreasuryProposal = void 0;
            const a = n(635).__importDefault(n(613));
            t.TreasuryProposal = class {
                constructor(e, t, n, a, r, o, i, s, d, c) {
                    this.id = e, this.chainId = t, this.proposalIndex = n, this.proposer = a, this.beneficiary = r, 
                    this.value = o, this.bond = i, this.status = s, this.blockNumber = d, this.updatedAt = c;
                }
                get _name() {
                    return "TreasuryProposal";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save TreasuryProposal entity without an ID"), 
                    await store.set("TreasuryProposal", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove TreasuryProposal entity without an ID"), 
                    await store.remove("TreasuryProposal", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get TreasuryProposal entity without an ID");
                    const t = await store.get("TreasuryProposal", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("TreasuryProposal", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.proposalIndex, e.proposer, e.beneficiary, e.value, e.bond, e.status, e.blockNumber, e.updatedAt);
                    return Object.assign(t, e), t;
                }
            };
        },
        613(e) {
            e.exports = require("assert");
        },
        197(e, t, n) {
            n.r(t), n.d(t, {
                packageInfo: () => l
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
            }, o = {
                name: "@polkadot/types-codec",
                path: new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/types-codec/packageInfo.js").pathname.substring(0, new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/types-codec/packageInfo.js").pathname.lastIndexOf("/") + 1),
                type: "esm",
                version: "16.5.6"
            };
            const i = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : Function("return this");
            function s(e, {name: t}) {
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
            function c(e, t) {
                if (e) return e;
                if ("function" == typeof t) try {
                    return t() || "";
                } catch {
                    return "";
                }
                return t || "";
            }
            function u(e, t, n) {
                console.warn(`${e}\nEither remove and explicitly install matching versions or dedupe using your package manager.\nThe following conflicting packages were found:\n${function(e, t) {
                    let n = 0;
                    for (let t = 0, a = e.length; t < a; t++) n = Math.max(n, e[t].version.length);
                    return e.map(e => `\t${t(e.version.padEnd(n), e).join("\t")}`).join("\n");
                }(t, n)}`);
            }
            const l = {
                name: "@polkadot/api-augment",
                path: new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/api-augment/packageInfo.js").pathname.substring(0, new URL("file:///home/libingjiang/vibly-indexer/node_modules/@polkadot/api-augment/packageInfo.js").pathname.lastIndexOf("/") + 1),
                type: "esm",
                version: "16.5.6"
            };
            !function({name: e, path: t, type: n, version: a}, r, o = []) {
                if (!e.startsWith("@polkadot")) throw new Error(`Invalid package descriptor ${e}`);
                const l = function(e) {
                    const t = i;
                    return t.__polkadotjs || (t.__polkadotjs = {}), t.__polkadotjs[e] || (t.__polkadotjs[e] = []), 
                    t.__polkadotjs[e];
                }(e);
                l.push({
                    path: c(t, r),
                    type: n,
                    version: a
                });
                const f = l.every(e => e.version === a), p = "1" === i.process?.env?.POLKADOTJS_DISABLE_ESM_CJS_WARNING;
                if (1 !== l.length && !(p && f)) u(`${e} has multiple versions, ensure that there is only one installed.`, l, d); else {
                    const t = o.filter(e => e && e.version !== a);
                    t.length && u(`${e} requires direct dependencies exactly matching version ${a}.`, t, s);
                }
            }(l, null, [ a, o, r ]);
        },
        635(e, t, n) {
            n.r(t), n.d(t, {
                __addDisposableResource: () => G,
                __assign: () => o,
                __asyncDelegator: () => k,
                __asyncGenerator: () => P,
                __asyncValues: () => S,
                __await: () => I,
                __awaiter: () => v,
                __classPrivateFieldGet: () => N,
                __classPrivateFieldIn: () => T,
                __classPrivateFieldSet: () => x,
                __createBinding: () => m,
                __decorate: () => s,
                __disposeResources: () => V,
                __esDecorate: () => c,
                __exportStar: () => b,
                __extends: () => r,
                __generator: () => h,
                __importDefault: () => C,
                __importStar: () => R,
                __makeTemplateObject: () => A,
                __metadata: () => p,
                __param: () => d,
                __propKey: () => l,
                __read: () => g,
                __rest: () => i,
                __rewriteRelativeImportExtension: () => E,
                __runInitializers: () => u,
                __setFunctionName: () => f,
                __spread: () => _,
                __spreadArray: () => j,
                __spreadArrays: () => w,
                __values: () => y,
                default: () => F
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
            var o = function() {
                return o = Object.assign || function(e) {
                    for (var t, n = 1, a = arguments.length; n < a; n++) for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
                    return e;
                }, o.apply(this, arguments);
            };
            function i(e, t) {
                var n = {};
                for (var a in e) Object.prototype.hasOwnProperty.call(e, a) && t.indexOf(a) < 0 && (n[a] = e[a]);
                if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
                    var r = 0;
                    for (a = Object.getOwnPropertySymbols(e); r < a.length; r++) t.indexOf(a[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, a[r]) && (n[a[r]] = e[a[r]]);
                }
                return n;
            }
            function s(e, t, n, a) {
                var r, o = arguments.length, i = o < 3 ? t : null === a ? a = Object.getOwnPropertyDescriptor(t, n) : a;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, n, a); else for (var s = e.length - 1; s >= 0; s--) (r = e[s]) && (i = (o < 3 ? r(i) : o > 3 ? r(t, n, i) : r(t, n)) || i);
                return o > 3 && i && Object.defineProperty(t, n, i), i;
            }
            function d(e, t) {
                return function(n, a) {
                    t(n, a, e);
                };
            }
            function c(e, t, n, a, r, o) {
                function i(e) {
                    if (void 0 !== e && "function" != typeof e) throw new TypeError("Function expected");
                    return e;
                }
                for (var s, d = a.kind, c = "getter" === d ? "get" : "setter" === d ? "set" : "value", u = !t && e ? a.static ? e : e.prototype : null, l = t || (u ? Object.getOwnPropertyDescriptor(u, a.name) : {}), f = !1, p = n.length - 1; p >= 0; p--) {
                    var v = {};
                    for (var h in a) v[h] = "access" === h ? {} : a[h];
                    for (var h in a.access) v.access[h] = a.access[h];
                    v.addInitializer = function(e) {
                        if (f) throw new TypeError("Cannot add initializers after decoration has completed");
                        o.push(i(e || null));
                    };
                    var m = (0, n[p])("accessor" === d ? {
                        get: l.get,
                        set: l.set
                    } : l[c], v);
                    if ("accessor" === d) {
                        if (void 0 === m) continue;
                        if (null === m || "object" != typeof m) throw new TypeError("Object expected");
                        (s = i(m.get)) && (l.get = s), (s = i(m.set)) && (l.set = s), (s = i(m.init)) && r.unshift(s);
                    } else (s = i(m)) && ("field" === d ? r.unshift(s) : l[c] = s);
                }
                u && Object.defineProperty(u, a.name, l), f = !0;
            }
            function u(e, t, n) {
                for (var a = arguments.length > 2, r = 0; r < t.length; r++) n = a ? t[r].call(e, n) : t[r].call(e);
                return a ? n : void 0;
            }
            function l(e) {
                return "symbol" == typeof e ? e : "".concat(e);
            }
            function f(e, t, n) {
                return "symbol" == typeof t && (t = t.description ? "[".concat(t.description, "]") : ""), 
                Object.defineProperty(e, "name", {
                    configurable: !0,
                    value: n ? "".concat(n, " ", t) : t
                });
            }
            function p(e, t) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t);
            }
            function v(e, t, n, a) {
                return new (n || (n = Promise))(function(r, o) {
                    function i(e) {
                        try {
                            d(a.next(e));
                        } catch (e) {
                            o(e);
                        }
                    }
                    function s(e) {
                        try {
                            d(a.throw(e));
                        } catch (e) {
                            o(e);
                        }
                    }
                    function d(e) {
                        var t;
                        e.done ? r(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
                            e(t);
                        })).then(i, s);
                    }
                    d((a = a.apply(e, t || [])).next());
                });
            }
            function h(e, t) {
                var n, a, r, o = {
                    label: 0,
                    sent: function() {
                        if (1 & r[0]) throw r[1];
                        return r[1];
                    },
                    trys: [],
                    ops: []
                }, i = Object.create(("function" == typeof Iterator ? Iterator : Object).prototype);
                return i.next = s(0), i.throw = s(1), i.return = s(2), "function" == typeof Symbol && (i[Symbol.iterator] = function() {
                    return this;
                }), i;
                function s(s) {
                    return function(d) {
                        return function(s) {
                            if (n) throw new TypeError("Generator is already executing.");
                            for (;i && (i = 0, s[0] && (o = 0)), o; ) try {
                                if (n = 1, a && (r = 2 & s[0] ? a.return : s[0] ? a.throw || ((r = a.return) && r.call(a), 
                                0) : a.next) && !(r = r.call(a, s[1])).done) return r;
                                switch (a = 0, r && (s = [ 2 & s[0], r.value ]), s[0]) {
                                  case 0:
                                  case 1:
                                    r = s;
                                    break;

                                  case 4:
                                    return o.label++, {
                                        value: s[1],
                                        done: !1
                                    };

                                  case 5:
                                    o.label++, a = s[1], s = [ 0 ];
                                    continue;

                                  case 7:
                                    s = o.ops.pop(), o.trys.pop();
                                    continue;

                                  default:
                                    if (!(r = o.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                                        o = 0;
                                        continue;
                                    }
                                    if (3 === s[0] && (!r || s[1] > r[0] && s[1] < r[3])) {
                                        o.label = s[1];
                                        break;
                                    }
                                    if (6 === s[0] && o.label < r[1]) {
                                        o.label = r[1], r = s;
                                        break;
                                    }
                                    if (r && o.label < r[2]) {
                                        o.label = r[2], o.ops.push(s);
                                        break;
                                    }
                                    r[2] && o.ops.pop(), o.trys.pop();
                                    continue;
                                }
                                s = t.call(e, o);
                            } catch (e) {
                                s = [ 6, e ], a = 0;
                            } finally {
                                n = r = 0;
                            }
                            if (5 & s[0]) throw s[1];
                            return {
                                value: s[0] ? s[1] : void 0,
                                done: !0
                            };
                        }([ s, d ]);
                    };
                }
            }
            var m = Object.create ? function(e, t, n, a) {
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
            function b(e, t) {
                for (var n in e) "default" === n || Object.prototype.hasOwnProperty.call(t, n) || m(t, e, n);
            }
            function y(e) {
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
            function g(e, t) {
                var n = "function" == typeof Symbol && e[Symbol.iterator];
                if (!n) return e;
                var a, r, o = n.call(e), i = [];
                try {
                    for (;(void 0 === t || t-- > 0) && !(a = o.next()).done; ) i.push(a.value);
                } catch (e) {
                    r = {
                        error: e
                    };
                } finally {
                    try {
                        a && !a.done && (n = o.return) && n.call(o);
                    } finally {
                        if (r) throw r.error;
                    }
                }
                return i;
            }
            function _() {
                for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(g(arguments[t]));
                return e;
            }
            function w() {
                for (var e = 0, t = 0, n = arguments.length; t < n; t++) e += arguments[t].length;
                var a = Array(e), r = 0;
                for (t = 0; t < n; t++) for (var o = arguments[t], i = 0, s = o.length; i < s; i++, 
                r++) a[r] = o[i];
                return a;
            }
            function j(e, t, n) {
                if (n || 2 === arguments.length) for (var a, r = 0, o = t.length; r < o; r++) !a && r in t || (a || (a = Array.prototype.slice.call(t, 0, r)), 
                a[r] = t[r]);
                return e.concat(a || Array.prototype.slice.call(t));
            }
            function I(e) {
                return this instanceof I ? (this.v = e, this) : new I(e);
            }
            function P(e, t, n) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var a, r = n.apply(e, t || []), o = [];
                return a = Object.create(("function" == typeof AsyncIterator ? AsyncIterator : Object).prototype), 
                i("next"), i("throw"), i("return", function(e) {
                    return function(t) {
                        return Promise.resolve(t).then(e, c);
                    };
                }), a[Symbol.asyncIterator] = function() {
                    return this;
                }, a;
                function i(e, t) {
                    r[e] && (a[e] = function(t) {
                        return new Promise(function(n, a) {
                            o.push([ e, t, n, a ]) > 1 || s(e, t);
                        });
                    }, t && (a[e] = t(a[e])));
                }
                function s(e, t) {
                    try {
                        (n = r[e](t)).value instanceof I ? Promise.resolve(n.value.v).then(d, c) : u(o[0][2], n);
                    } catch (e) {
                        u(o[0][3], e);
                    }
                    var n;
                }
                function d(e) {
                    s("next", e);
                }
                function c(e) {
                    s("throw", e);
                }
                function u(e, t) {
                    e(t), o.shift(), o.length && s(o[0][0], o[0][1]);
                }
            }
            function k(e) {
                var t, n;
                return t = {}, a("next"), a("throw", function(e) {
                    throw e;
                }), a("return"), t[Symbol.iterator] = function() {
                    return this;
                }, t;
                function a(a, r) {
                    t[a] = e[a] ? function(t) {
                        return (n = !n) ? {
                            value: I(e[a](t)),
                            done: !1
                        } : r ? r(t) : t;
                    } : r;
                }
            }
            function S(e) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var t, n = e[Symbol.asyncIterator];
                return n ? n.call(e) : (e = y(e), t = {}, a("next"), a("throw"), a("return"), t[Symbol.asyncIterator] = function() {
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
            function A(e, t) {
                return Object.defineProperty ? Object.defineProperty(e, "raw", {
                    value: t
                }) : e.raw = t, e;
            }
            var O = Object.create ? function(e, t) {
                Object.defineProperty(e, "default", {
                    enumerable: !0,
                    value: t
                });
            } : function(e, t) {
                e.default = t;
            }, D = function(e) {
                return D = Object.getOwnPropertyNames || function(e) {
                    var t = [];
                    for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[t.length] = n);
                    return t;
                }, D(e);
            };
            function R(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n = D(e), a = 0; a < n.length; a++) "default" !== n[a] && m(t, e, n[a]);
                return O(t, e), t;
            }
            function C(e) {
                return e && e.__esModule ? e : {
                    default: e
                };
            }
            function N(e, t, n, a) {
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
            function T(e, t) {
                if (null === t || "object" != typeof t && "function" != typeof t) throw new TypeError("Cannot use 'in' operator on non-object");
                return "function" == typeof e ? t === e : e.has(t);
            }
            function G(e, t, n) {
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
            var B = "function" == typeof SuppressedError ? SuppressedError : function(e, t, n) {
                var a = new Error(n);
                return a.name = "SuppressedError", a.error = e, a.suppressed = t, a;
            };
            function V(e) {
                function t(t) {
                    e.error = e.hasError ? new B(t, e.error, "An error was suppressed during disposal.") : t, 
                    e.hasError = !0;
                }
                var n, a = 0;
                return function r() {
                    for (;n = e.stack.pop(); ) try {
                        if (!n.async && 1 === a) return a = 0, e.stack.push(n), Promise.resolve().then(r);
                        if (n.dispose) {
                            var o = n.dispose.call(n.value);
                            if (n.async) return a |= 2, Promise.resolve(o).then(r, function(e) {
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
            function E(e, t) {
                return "string" == typeof e && /^\.\.?\//.test(e) ? e.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(e, n, a, r, o) {
                    return n ? t ? ".jsx" : ".js" : !a || r && o ? a + r + "." + o.toLowerCase() + "js" : e;
                }) : e;
            }
            const F = {
                __extends: r,
                __assign: o,
                __rest: i,
                __decorate: s,
                __param: d,
                __esDecorate: c,
                __runInitializers: u,
                __propKey: l,
                __setFunctionName: f,
                __metadata: p,
                __awaiter: v,
                __generator: h,
                __createBinding: m,
                __exportStar: b,
                __values: y,
                __read: g,
                __spread: _,
                __spreadArrays: w,
                __spreadArray: j,
                __await: I,
                __asyncGenerator: P,
                __asyncDelegator: k,
                __asyncValues: S,
                __makeTemplateObject: A,
                __importStar: R,
                __importDefault: C,
                __classPrivateFieldGet: N,
                __classPrivateFieldSet: x,
                __classPrivateFieldIn: T,
                __addDisposableResource: G,
                __disposeResources: V,
                __rewriteRelativeImportExtension: E
            };
        }
    }, t = {};
    function n(a) {
        var r = t[a];
        if (void 0 !== r) return r.exports;
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
        }), e.handleTreasuryAwarded = e.handleTreasuryRejected = e.handleTreasuryApproved = e.handleTreasuryProposed = e.handlePreimageCleared = e.handlePreimageRequested = e.handlePreimageNoted = e.handleUndelegated = e.handleDelegated = e.handleVoteRemoved = e.handleVoteCast = e.handleReferendumKilled = e.handleReferendumTimedOut = e.handleReferendumCancelled = e.handleReferendumRejected = e.handleReferendumApproved = e.handleReferendumConfirmAborted = e.handleReferendumConfirmStarted = e.handleReferendumDecisionStarted = e.handleReferendumSubmitted = e.handleBlock = void 0;
        var t = n(751);
        Object.defineProperty(e, "handleBlock", {
            enumerable: !0,
            get: function() {
                return t.handleBlock;
            }
        });
        var r = n(892);
        Object.defineProperty(e, "handleReferendumSubmitted", {
            enumerable: !0,
            get: function() {
                return r.handleReferendumSubmitted;
            }
        }), Object.defineProperty(e, "handleReferendumDecisionStarted", {
            enumerable: !0,
            get: function() {
                return r.handleReferendumDecisionStarted;
            }
        }), Object.defineProperty(e, "handleReferendumConfirmStarted", {
            enumerable: !0,
            get: function() {
                return r.handleReferendumConfirmStarted;
            }
        }), Object.defineProperty(e, "handleReferendumConfirmAborted", {
            enumerable: !0,
            get: function() {
                return r.handleReferendumConfirmAborted;
            }
        }), Object.defineProperty(e, "handleReferendumApproved", {
            enumerable: !0,
            get: function() {
                return r.handleReferendumApproved;
            }
        }), Object.defineProperty(e, "handleReferendumRejected", {
            enumerable: !0,
            get: function() {
                return r.handleReferendumRejected;
            }
        }), Object.defineProperty(e, "handleReferendumCancelled", {
            enumerable: !0,
            get: function() {
                return r.handleReferendumCancelled;
            }
        }), Object.defineProperty(e, "handleReferendumTimedOut", {
            enumerable: !0,
            get: function() {
                return r.handleReferendumTimedOut;
            }
        }), Object.defineProperty(e, "handleReferendumKilled", {
            enumerable: !0,
            get: function() {
                return r.handleReferendumKilled;
            }
        });
        var o = n(19);
        Object.defineProperty(e, "handleVoteCast", {
            enumerable: !0,
            get: function() {
                return o.handleVoteCast;
            }
        }), Object.defineProperty(e, "handleVoteRemoved", {
            enumerable: !0,
            get: function() {
                return o.handleVoteRemoved;
            }
        }), Object.defineProperty(e, "handleDelegated", {
            enumerable: !0,
            get: function() {
                return o.handleDelegated;
            }
        }), Object.defineProperty(e, "handleUndelegated", {
            enumerable: !0,
            get: function() {
                return o.handleUndelegated;
            }
        });
        var i = n(22);
        Object.defineProperty(e, "handlePreimageNoted", {
            enumerable: !0,
            get: function() {
                return i.handlePreimageNoted;
            }
        }), Object.defineProperty(e, "handlePreimageRequested", {
            enumerable: !0,
            get: function() {
                return i.handlePreimageRequested;
            }
        }), Object.defineProperty(e, "handlePreimageCleared", {
            enumerable: !0,
            get: function() {
                return i.handlePreimageCleared;
            }
        });
        var s = n(789);
        Object.defineProperty(e, "handleTreasuryProposed", {
            enumerable: !0,
            get: function() {
                return s.handleTreasuryProposed;
            }
        }), Object.defineProperty(e, "handleTreasuryApproved", {
            enumerable: !0,
            get: function() {
                return s.handleTreasuryApproved;
            }
        }), Object.defineProperty(e, "handleTreasuryRejected", {
            enumerable: !0,
            get: function() {
                return s.handleTreasuryRejected;
            }
        }), Object.defineProperty(e, "handleTreasuryAwarded", {
            enumerable: !0,
            get: function() {
                return s.handleTreasuryAwarded;
            }
        }), n(197);
    })();
    var r = exports;
    for (var o in a) r[o] = a[o];
    a.__esModule && Object.defineProperty(r, "__esModule", {
        value: !0
    });
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TXRSLEtBQUs7Z0JBQWMsT0FBT2dXLEVBQVcvUDtBQUF3QjtZQUMxSXZILE9BQU9DLGVBQWVDLEdBQVMsMEJBQTBCO1lBQUUwUyxhQUFZO1lBQU10UixLQUFLO2dCQUFjLE9BQU9nVyxFQUFXaFE7QUFBd0I7WUFDMUl0SCxPQUFPQyxlQUFlQyxHQUFTLHlCQUF5QjtZQUFFMFMsYUFBWTtZQUFNdFIsS0FBSztnQkFBYyxPQUFPZ1csRUFBV2pRO0FBQXVCO1lBQ3hJLEVBQVEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL21hcHBpbmdzL2Jsb2NrLnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvbWFwcGluZ3MvY29udmljdGlvblZvdGluZy50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL21hcHBpbmdzL3ByZWltYWdlLnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvbWFwcGluZ3MvcmVmZXJlbmRhLnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvbWFwcGluZ3MvdHJlYXN1cnkudHMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy9tYXBwaW5ncy91dGlscy50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL3R5cGVzL21vZGVscy9Hb3Zlcm5hbmNlQ2hlY2twb2ludC50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL3R5cGVzL21vZGVscy9Hb3Zlcm5hbmNlRGVsZWdhdGlvbi50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL3R5cGVzL21vZGVscy9Hb3Zlcm5hbmNlU3ViamVjdC50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL3R5cGVzL21vZGVscy9Hb3Zlcm5hbmNlVm90ZS50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL3R5cGVzL21vZGVscy9QcmVpbWFnZS50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL3R5cGVzL21vZGVscy9UcmVhc3VyeVByb3Bvc2FsLnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImFzc2VydFwiIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvQHBvbGthZG90L2FwaS1iYXNlL3BhY2thZ2VJbmZvLmpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvQHBvbGthZG90L3R5cGVzL3BhY2thZ2VJbmZvLmpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvQHBvbGthZG90L3R5cGVzLWNvZGVjL3BhY2thZ2VJbmZvLmpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvQHBvbGthZG90L3gtZ2xvYmFsL2luZGV4LmpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvQHBvbGthZG90L3V0aWwvZGV0ZWN0UGFja2FnZS5qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC91dGlsL2lzL2Z1bmN0aW9uLmpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvQHBvbGthZG90L2FwaS1hdWdtZW50L3BhY2thZ2VJbmZvLmpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvQHBvbGthZG90L2FwaS1hdWdtZW50L3BhY2thZ2VEZXRlY3QuanMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYubWpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xudmFyIF9hO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5oYW5kbGVCbG9jayA9IHZvaWQgMDtcbmNvbnN0IEdvdmVybmFuY2VDaGVja3BvaW50XzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvbW9kZWxzL0dvdmVybmFuY2VDaGVja3BvaW50XCIpO1xuY29uc3QgQ0hBSU5fSUQgPSAoX2EgPSBwcm9jZXNzLmVudltcIkNIQUlOX0lEXCJdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBcInN1YnN0cmF0ZTp2aWJseS1zb2xvXCI7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVCbG9jayhibG9jaykge1xuICAgIHZhciBfYSwgX2I7XG4gICAgY29uc3QgYmxvY2tOdW1iZXIgPSBCaWdJbnQoYmxvY2suYmxvY2suaGVhZGVyLm51bWJlci50b1N0cmluZygpKTtcbiAgICBjb25zdCBibG9ja0hhc2ggPSBibG9jay5ibG9jay5oZWFkZXIuaGFzaC50b0hleCgpO1xuICAgIGxldCBjaGVja3BvaW50ID0gYXdhaXQgR292ZXJuYW5jZUNoZWNrcG9pbnRfMS5Hb3Zlcm5hbmNlQ2hlY2twb2ludC5nZXQoQ0hBSU5fSUQpO1xuICAgIGlmICghY2hlY2twb2ludCkge1xuICAgICAgICBjaGVja3BvaW50ID0gR292ZXJuYW5jZUNoZWNrcG9pbnRfMS5Hb3Zlcm5hbmNlQ2hlY2twb2ludC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6IENIQUlOX0lELFxuICAgICAgICAgICAgYmxvY2tOdW1iZXIsXG4gICAgICAgICAgICBibG9ja0hhc2gsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IChfYSA9IGJsb2NrLnRpbWVzdGFtcCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogbmV3IERhdGUoKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjaGVja3BvaW50LmJsb2NrTnVtYmVyID0gYmxvY2tOdW1iZXI7XG4gICAgICAgIGNoZWNrcG9pbnQuYmxvY2tIYXNoID0gYmxvY2tIYXNoO1xuICAgICAgICBjaGVja3BvaW50LnVwZGF0ZWRBdCA9IChfYiA9IGJsb2NrLnRpbWVzdGFtcCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogbmV3IERhdGUoKTtcbiAgICB9XG4gICAgYXdhaXQgY2hlY2twb2ludC5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZUJsb2NrID0gaGFuZGxlQmxvY2s7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogTWFwcGluZyBoYW5kbGVycyBmb3IgcGFsbGV0X2NvbnZpY3Rpb25fdm90aW5nIGV2ZW50cy5cbiAqXG4gKiBFdmVudHMgaGFuZGxlZDogVm90ZWQsIFZvdGVSZW1vdmVkLCBEZWxlZ2F0ZWQsIFVuZGVsZWdhdGVkXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaGFuZGxlVW5kZWxlZ2F0ZWQgPSBleHBvcnRzLmhhbmRsZURlbGVnYXRlZCA9IGV4cG9ydHMuaGFuZGxlVm90ZVJlbW92ZWQgPSBleHBvcnRzLmhhbmRsZVZvdGVDYXN0ID0gdm9pZCAwO1xuY29uc3QgR292ZXJuYW5jZVZvdGVfMSA9IHJlcXVpcmUoXCIuLi90eXBlcy9tb2RlbHMvR292ZXJuYW5jZVZvdGVcIik7XG5jb25zdCBHb3Zlcm5hbmNlRGVsZWdhdGlvbl8xID0gcmVxdWlyZShcIi4uL3R5cGVzL21vZGVscy9Hb3Zlcm5hbmNlRGVsZWdhdGlvblwiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbi8vIOKUgOKUgOKUgCBWb3RlZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVZvdGVDYXN0KGV2ZW50KSB7XG4gICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2Y7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrLCBleHRyaW5zaWMgfSA9IGV2ZW50O1xuICAgIC8vIGRhdGE6IFt3aG86IEFjY291bnRJZCwgdm90ZTogQWNjb3VudFZvdGUsIGluZGV4OiB1MzJdXG4gICAgLy8gQWNjb3VudFZvdGU6IHsgU3RhbmRhcmQ6IHsgdm90ZTogVm90ZSwgYmFsYW5jZTogQmFsYW5jZSB9IH0gfCB7IFNwbGl0OiAuLi4gfSB8IHsgU3BsaXRBYnN0YWluOiAuLi4gfVxuICAgIGNvbnN0IHZvdGVyID0gZGF0YVswXS50b1N0cmluZygpO1xuICAgIGNvbnN0IHZvdGVSYXcgPSBkYXRhWzFdLnRvSlNPTigpO1xuICAgIGNvbnN0IGluZGV4ID0gZGF0YVsyXS50b051bWJlcigpO1xuICAgIGNvbnN0IGJsb2NrTnVtYmVyID0gQmlnSW50KGJsb2NrLmJsb2NrLmhlYWRlci5udW1iZXIudG9TdHJpbmcoKSk7XG4gICAgY29uc3QgdGltZXN0YW1wID0gKF9hID0gYmxvY2sudGltZXN0YW1wKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBuZXcgRGF0ZSgpO1xuICAgIC8vIERlY29kZSBzdGFuY2UgKyBjb252aWN0aW9uIGZyb20gQWNjb3VudFZvdGUgdmFyaWFudHNcbiAgICBsZXQgc3RhbmNlID0gXCJBeWVcIjtcbiAgICBsZXQgY29udmljdGlvbiA9IDA7XG4gICAgbGV0IGJhbGFuY2UgPSBCaWdJbnQoMCk7XG4gICAgY29uc3Qgc3RhbmRhcmQgPSBnZXRWYXJpYW50KHZvdGVSYXcsIFwic3RhbmRhcmRcIik7XG4gICAgY29uc3Qgc3BsaXRBYnN0YWluID0gZ2V0VmFyaWFudCh2b3RlUmF3LCBcInNwbGl0QWJzdGFpblwiKTtcbiAgICBjb25zdCBzcGxpdCA9IGdldFZhcmlhbnQodm90ZVJhdywgXCJzcGxpdFwiKTtcbiAgICBpZiAoc3RhbmRhcmQpIHtcbiAgICAgICAgY29uc3Qgc3RkID0gc3RhbmRhcmQ7XG4gICAgICAgIHN0YW5jZSA9IHN0ZC52b3RlLmF5ZSA/IFwiQXllXCIgOiBcIk5heVwiO1xuICAgICAgICBjb252aWN0aW9uID0gdHlwZW9mIHN0ZC52b3RlLmNvbnZpY3Rpb24gPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgID8gTnVtYmVyKHN0ZC52b3RlLmNvbnZpY3Rpb24ucmVwbGFjZSgvXFxEL2csIFwiXCIpKVxuICAgICAgICAgICAgOiBzdGQudm90ZS5jb252aWN0aW9uO1xuICAgICAgICBiYWxhbmNlID0gQmlnSW50KChfYiA9IHN0ZC5iYWxhbmNlKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBcIjBcIik7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNwbGl0QWJzdGFpbikge1xuICAgICAgICBzdGFuY2UgPSBcIkFic3RhaW5cIjtcbiAgICAgICAgY29uc3Qgc2EgPSBzcGxpdEFic3RhaW47XG4gICAgICAgIGJhbGFuY2UgPSBCaWdJbnQoKF9jID0gc2EuYWJzdGFpbikgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogXCIwXCIpO1xuICAgIH1cbiAgICBlbHNlIGlmIChzcGxpdCkge1xuICAgICAgICBjb25zdCBzcCA9IHNwbGl0O1xuICAgICAgICAvLyBUcmVhdCBzcGxpdCBhcyBBeWUgaWYgYXllID4gbmF5LCBlbHNlIE5heVxuICAgICAgICBjb25zdCBheWUgPSBCaWdJbnQoKF9kID0gc3AuYXllKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiBcIjBcIik7XG4gICAgICAgIGNvbnN0IG5heSA9IEJpZ0ludCgoX2UgPSBzcC5uYXkpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IFwiMFwiKTtcbiAgICAgICAgc3RhbmNlID0gYXllID49IG5heSA/IFwiQXllXCIgOiBcIk5heVwiO1xuICAgICAgICBiYWxhbmNlID0gYXllICsgbmF5O1xuICAgIH1cbiAgICBjb25zdCBpZCA9ICgwLCB1dGlsc18xLnZvdGVJZCkoaW5kZXgsIHZvdGVyKTtcbiAgICBsZXQgdm90ZSA9IGF3YWl0IEdvdmVybmFuY2VWb3RlXzEuR292ZXJuYW5jZVZvdGUuZ2V0KGlkKTtcbiAgICBpZiAoIXZvdGUpIHtcbiAgICAgICAgdm90ZSA9IEdvdmVybmFuY2VWb3RlXzEuR292ZXJuYW5jZVZvdGUuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgICAgIHJlZmVyZW5kdW1JbmRleDogaW5kZXgsXG4gICAgICAgICAgICB2b3RlcixcbiAgICAgICAgICAgIHN0YW5jZSxcbiAgICAgICAgICAgIGNvbnZpY3Rpb24sXG4gICAgICAgICAgICBiYWxhbmNlLFxuICAgICAgICAgICAgaXNSZW1vdmVkOiBmYWxzZSxcbiAgICAgICAgICAgIHN1YmplY3RJZDogKDAsIHV0aWxzXzEuc3ViamVjdElkKShpbmRleCksXG4gICAgICAgICAgICBibG9ja051bWJlcixcbiAgICAgICAgICAgIGV4dHJpbnNpY0luZGV4OiAoX2YgPSBleHRyaW5zaWMgPT09IG51bGwgfHwgZXh0cmluc2ljID09PSB2b2lkIDAgPyB2b2lkIDAgOiBleHRyaW5zaWMuaWR4KSAhPT0gbnVsbCAmJiBfZiAhPT0gdm9pZCAwID8gX2YgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2b3RlLnN0YW5jZSA9IHN0YW5jZTtcbiAgICAgICAgdm90ZS5jb252aWN0aW9uID0gY29udmljdGlvbjtcbiAgICAgICAgdm90ZS5iYWxhbmNlID0gYmFsYW5jZTtcbiAgICAgICAgdm90ZS5pc1JlbW92ZWQgPSBmYWxzZTtcbiAgICAgICAgdm90ZS5ibG9ja051bWJlciA9IGJsb2NrTnVtYmVyO1xuICAgICAgICB2b3RlLnVwZGF0ZWRBdCA9IHRpbWVzdGFtcDtcbiAgICB9XG4gICAgYXdhaXQgdm90ZS5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZVZvdGVDYXN0ID0gaGFuZGxlVm90ZUNhc3Q7XG4vLyDilIDilIDilIAgVm90ZVJlbW92ZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVWb3RlUmVtb3ZlZChldmVudCkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIC8vIGRhdGE6IFt3aG86IEFjY291bnRJZCwgaW5kZXg6IHUzMiwgdm90ZTogQWNjb3VudFZvdGVdXG4gICAgY29uc3Qgdm90ZXIgPSBkYXRhWzBdLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgaW5kZXggPSBkYXRhWzFdLnRvTnVtYmVyKCk7XG4gICAgY29uc3QgaWQgPSAoMCwgdXRpbHNfMS52b3RlSWQpKGluZGV4LCB2b3Rlcik7XG4gICAgY29uc3Qgdm90ZSA9IGF3YWl0IEdvdmVybmFuY2VWb3RlXzEuR292ZXJuYW5jZVZvdGUuZ2V0KGlkKTtcbiAgICBpZiAodm90ZSkge1xuICAgICAgICB2b3RlLmlzUmVtb3ZlZCA9IHRydWU7XG4gICAgICAgIHZvdGUudXBkYXRlZEF0ID0gKF9hID0gYmxvY2sudGltZXN0YW1wKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBuZXcgRGF0ZSgpO1xuICAgICAgICBhd2FpdCB2b3RlLnNhdmUoKTtcbiAgICB9XG59XG5leHBvcnRzLmhhbmRsZVZvdGVSZW1vdmVkID0gaGFuZGxlVm90ZVJlbW92ZWQ7XG4vLyDilIDilIDilIAgRGVsZWdhdGVkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlRGVsZWdhdGVkKGV2ZW50KSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgLy8gZGF0YTogW3dobzogQWNjb3VudElkLCB0YXJnZXQ6IEFjY291bnRJZF1cbiAgICAvLyBOT1RFOiBwYWxsZXRfY29udmljdGlvbl92b3RpbmcgRGVsZWdhdGVkIGV2ZW50IG9ubHkgY2FycmllcyB3aG8rdGFyZ2V0O1xuICAgIC8vIHRyYWNrL2NvbnZpY3Rpb24vYmFsYW5jZSBjb21lIGZyb20gdGhlIGV4dHJpbnNpYyBjYWxsIGFyZ3MsIGJ1dCBTdWJRdWVyeVxuICAgIC8vIGV2ZW50IGhhbmRsZXJzIG9ubHkgcmVjZWl2ZSBldmVudCBkYXRhLiBXZSBzdG9yZSB3aGF0IHdlIGNhbiBhbmQgZGVmYXVsdFxuICAgIC8vIHRyYWNrPTAgc2luY2UgRGVsZWdhdGVkIGV2ZW50cyBkb24ndCBpbmNsdWRlIGl0IHJlbGlhYmx5IHByZS1kZWNvZGUuXG4gICAgY29uc3QgZGVsZWdhdG9yID0gZGF0YVswXS50b1N0cmluZygpO1xuICAgIGNvbnN0IGRlbGVnYXRlZSA9IGRhdGFbMV0udG9TdHJpbmcoKTtcbiAgICAvLyBVc2UgdHJhY2sgMCBhcyB0aGUgZGVsZWdhdGlvbiBrZXkgd2hlbiB0cmFjayBpcyBub3QgYXZhaWxhYmxlIGZyb20gZXZlbnQuXG4gICAgLy8gVGhlIFN1YlF1ZXJ5IHByb2plY3QgY2FuIGJlIGVuaGFuY2VkIHdpdGggY2FsbCBoYW5kbGVycyBmb3IgZnVsbCBmaWRlbGl0eS5cbiAgICBjb25zdCB0cmFjayA9IDA7XG4gICAgY29uc3QgaWQgPSAoMCwgdXRpbHNfMS5kZWxlZ2F0aW9uSWQpKHRyYWNrLCBkZWxlZ2F0b3IpO1xuICAgIGNvbnN0IGJsb2NrTnVtYmVyID0gQmlnSW50KGJsb2NrLmJsb2NrLmhlYWRlci5udW1iZXIudG9TdHJpbmcoKSk7XG4gICAgY29uc3QgdGltZXN0YW1wID0gKF9hID0gYmxvY2sudGltZXN0YW1wKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBuZXcgRGF0ZSgpO1xuICAgIGxldCBkZWxlZ2F0aW9uID0gYXdhaXQgR292ZXJuYW5jZURlbGVnYXRpb25fMS5Hb3Zlcm5hbmNlRGVsZWdhdGlvbi5nZXQoaWQpO1xuICAgIGlmICghZGVsZWdhdGlvbikge1xuICAgICAgICBkZWxlZ2F0aW9uID0gR292ZXJuYW5jZURlbGVnYXRpb25fMS5Hb3Zlcm5hbmNlRGVsZWdhdGlvbi5jcmVhdGUoe1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBjaGFpbklkOiB1dGlsc18xLkNIQUlOX0lELFxuICAgICAgICAgICAgdHJhY2ssXG4gICAgICAgICAgICBkZWxlZ2F0b3IsXG4gICAgICAgICAgICBkZWxlZ2F0ZWUsXG4gICAgICAgICAgICBjb252aWN0aW9uOiAwLFxuICAgICAgICAgICAgYmFsYW5jZTogQmlnSW50KDApLFxuICAgICAgICAgICAgaXNBY3RpdmU6IHRydWUsXG4gICAgICAgICAgICBibG9ja051bWJlcixcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRlbGVnYXRpb24uZGVsZWdhdGVlID0gZGVsZWdhdGVlO1xuICAgICAgICBkZWxlZ2F0aW9uLmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgZGVsZWdhdGlvbi5ibG9ja051bWJlciA9IGJsb2NrTnVtYmVyO1xuICAgICAgICBkZWxlZ2F0aW9uLnVwZGF0ZWRBdCA9IHRpbWVzdGFtcDtcbiAgICB9XG4gICAgYXdhaXQgZGVsZWdhdGlvbi5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZURlbGVnYXRlZCA9IGhhbmRsZURlbGVnYXRlZDtcbmZ1bmN0aW9uIGdldFZhcmlhbnQocmVjb3JkLCBrZXkpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIChfYSA9IHJlY29yZFtrZXldKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiByZWNvcmRbdXBwZXJGaXJzdChrZXkpXTtcbn1cbmZ1bmN0aW9uIHVwcGVyRmlyc3QodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB2YWx1ZS5zbGljZSgxKTtcbn1cbi8vIOKUgOKUgOKUgCBVbmRlbGVnYXRlZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVVuZGVsZWdhdGVkKGV2ZW50KSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgLy8gZGF0YTogW2FjY291bnQ6IEFjY291bnRJZF1cbiAgICBjb25zdCBkZWxlZ2F0b3IgPSBkYXRhWzBdLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgdHJhY2sgPSAwO1xuICAgIGNvbnN0IGlkID0gKDAsIHV0aWxzXzEuZGVsZWdhdGlvbklkKSh0cmFjaywgZGVsZWdhdG9yKTtcbiAgICBjb25zdCBkZWxlZ2F0aW9uID0gYXdhaXQgR292ZXJuYW5jZURlbGVnYXRpb25fMS5Hb3Zlcm5hbmNlRGVsZWdhdGlvbi5nZXQoaWQpO1xuICAgIGlmIChkZWxlZ2F0aW9uKSB7XG4gICAgICAgIGRlbGVnYXRpb24uaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgZGVsZWdhdGlvbi51cGRhdGVkQXQgPSAoX2EgPSBibG9jay50aW1lc3RhbXApICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG5ldyBEYXRlKCk7XG4gICAgICAgIGF3YWl0IGRlbGVnYXRpb24uc2F2ZSgpO1xuICAgIH1cbn1cbmV4cG9ydHMuaGFuZGxlVW5kZWxlZ2F0ZWQgPSBoYW5kbGVVbmRlbGVnYXRlZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBNYXBwaW5nIGhhbmRsZXJzIGZvciBwYWxsZXRfcHJlaW1hZ2UgZXZlbnRzLlxuICpcbiAqIEV2ZW50cyBoYW5kbGVkOiBOb3RlZCwgUmVxdWVzdGVkLCBDbGVhcmVkXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaGFuZGxlUHJlaW1hZ2VDbGVhcmVkID0gZXhwb3J0cy5oYW5kbGVQcmVpbWFnZVJlcXVlc3RlZCA9IGV4cG9ydHMuaGFuZGxlUHJlaW1hZ2VOb3RlZCA9IHZvaWQgMDtcbmNvbnN0IFByZWltYWdlXzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvbW9kZWxzL1ByZWltYWdlXCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUHJlaW1hZ2VOb3RlZChldmVudCkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIC8vIGRhdGE6IFtoYXNoOiBIMjU2XVxuICAgIGNvbnN0IGhhc2ggPSBkYXRhWzBdLnRvSGV4KCk7XG4gICAgY29uc3QgYmxvY2tOdW1iZXIgPSBCaWdJbnQoYmxvY2suYmxvY2suaGVhZGVyLm51bWJlci50b1N0cmluZygpKTtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSAoX2EgPSBibG9jay50aW1lc3RhbXApICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG5ldyBEYXRlKCk7XG4gICAgbGV0IHByZWltYWdlID0gYXdhaXQgUHJlaW1hZ2VfMS5QcmVpbWFnZS5nZXQoaGFzaCk7XG4gICAgaWYgKCFwcmVpbWFnZSkge1xuICAgICAgICBwcmVpbWFnZSA9IFByZWltYWdlXzEuUHJlaW1hZ2UuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiBoYXNoLFxuICAgICAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgICAgIGhhc2gsXG4gICAgICAgICAgICBkYXRhOiBcIlwiLCAvLyBmaWxsZWQgd2hlbiBwcmVpbWFnZSBieXRlcyBhcmUgYXZhaWxhYmxlIHZpYSBzdG9yYWdlIHF1ZXJ5XG4gICAgICAgICAgICBsZW46IDAsXG4gICAgICAgICAgICBzdGF0dXM6IFwiTm90ZWRcIixcbiAgICAgICAgICAgIGJsb2NrTnVtYmVyLFxuICAgICAgICAgICAgdXBkYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcHJlaW1hZ2Uuc3RhdHVzID0gXCJOb3RlZFwiO1xuICAgICAgICBwcmVpbWFnZS5ibG9ja051bWJlciA9IGJsb2NrTnVtYmVyO1xuICAgICAgICBwcmVpbWFnZS51cGRhdGVkQXQgPSB0aW1lc3RhbXA7XG4gICAgfVxuICAgIGF3YWl0IHByZWltYWdlLnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlUHJlaW1hZ2VOb3RlZCA9IGhhbmRsZVByZWltYWdlTm90ZWQ7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVQcmVpbWFnZVJlcXVlc3RlZChldmVudCkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGhhc2ggPSBkYXRhWzBdLnRvSGV4KCk7XG4gICAgY29uc3QgYmxvY2tOdW1iZXIgPSBCaWdJbnQoYmxvY2suYmxvY2suaGVhZGVyLm51bWJlci50b1N0cmluZygpKTtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSAoX2EgPSBibG9jay50aW1lc3RhbXApICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG5ldyBEYXRlKCk7XG4gICAgbGV0IHByZWltYWdlID0gYXdhaXQgUHJlaW1hZ2VfMS5QcmVpbWFnZS5nZXQoaGFzaCk7XG4gICAgaWYgKCFwcmVpbWFnZSkge1xuICAgICAgICBwcmVpbWFnZSA9IFByZWltYWdlXzEuUHJlaW1hZ2UuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiBoYXNoLFxuICAgICAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgICAgIGhhc2gsXG4gICAgICAgICAgICBkYXRhOiBcIlwiLFxuICAgICAgICAgICAgbGVuOiAwLFxuICAgICAgICAgICAgc3RhdHVzOiBcIlJlcXVlc3RlZFwiLFxuICAgICAgICAgICAgYmxvY2tOdW1iZXIsXG4gICAgICAgICAgICB1cGRhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwcmVpbWFnZS5zdGF0dXMgPSBcIlJlcXVlc3RlZFwiO1xuICAgICAgICBwcmVpbWFnZS51cGRhdGVkQXQgPSB0aW1lc3RhbXA7XG4gICAgfVxuICAgIGF3YWl0IHByZWltYWdlLnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlUHJlaW1hZ2VSZXF1ZXN0ZWQgPSBoYW5kbGVQcmVpbWFnZVJlcXVlc3RlZDtcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVByZWltYWdlQ2xlYXJlZChldmVudCkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGhhc2ggPSBkYXRhWzBdLnRvSGV4KCk7XG4gICAgY29uc3QgcHJlaW1hZ2UgPSBhd2FpdCBQcmVpbWFnZV8xLlByZWltYWdlLmdldChoYXNoKTtcbiAgICBpZiAocHJlaW1hZ2UpIHtcbiAgICAgICAgcHJlaW1hZ2Uuc3RhdHVzID0gXCJDbGVhcmVkXCI7XG4gICAgICAgIHByZWltYWdlLnVwZGF0ZWRBdCA9IChfYSA9IGJsb2NrLnRpbWVzdGFtcCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogbmV3IERhdGUoKTtcbiAgICAgICAgYXdhaXQgcHJlaW1hZ2Uuc2F2ZSgpO1xuICAgIH1cbn1cbmV4cG9ydHMuaGFuZGxlUHJlaW1hZ2VDbGVhcmVkID0gaGFuZGxlUHJlaW1hZ2VDbGVhcmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIE1hcHBpbmcgaGFuZGxlcnMgZm9yIHBhbGxldF9yZWZlcmVuZGEgZXZlbnRzLlxuICpcbiAqIEV2ZW50cyBoYW5kbGVkOlxuICogICBTdWJtaXR0ZWQsIERlY2lzaW9uU3RhcnRlZCwgQ29uZmlybVN0YXJ0ZWQsIENvbmZpcm1BYm9ydGVkLFxuICogICBBcHByb3ZlZCwgUmVqZWN0ZWQsIENhbmNlbGxlZCwgVGltZWRPdXQsIEtpbGxlZFxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhbmRsZVJlZmVyZW5kdW1LaWxsZWQgPSBleHBvcnRzLmhhbmRsZVJlZmVyZW5kdW1UaW1lZE91dCA9IGV4cG9ydHMuaGFuZGxlUmVmZXJlbmR1bUNhbmNlbGxlZCA9IGV4cG9ydHMuaGFuZGxlUmVmZXJlbmR1bVJlamVjdGVkID0gZXhwb3J0cy5oYW5kbGVSZWZlcmVuZHVtQXBwcm92ZWQgPSBleHBvcnRzLmhhbmRsZVJlZmVyZW5kdW1Db25maXJtQWJvcnRlZCA9IGV4cG9ydHMuaGFuZGxlUmVmZXJlbmR1bUNvbmZpcm1TdGFydGVkID0gZXhwb3J0cy5oYW5kbGVSZWZlcmVuZHVtRGVjaXNpb25TdGFydGVkID0gZXhwb3J0cy5oYW5kbGVSZWZlcmVuZHVtU3VibWl0dGVkID0gdm9pZCAwO1xuY29uc3QgR292ZXJuYW5jZVN1YmplY3RfMSA9IHJlcXVpcmUoXCIuLi90eXBlcy9tb2RlbHMvR292ZXJuYW5jZVN1YmplY3RcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG4vLyDilIDilIDilIAgaGVscGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGdldE9yQ3JlYXRlKGluZGV4LCB0cmFjaywgYmxvY2tOdW1iZXIsIHRpbWVzdGFtcCkge1xuICAgIGNvbnN0IGlkID0gKDAsIHV0aWxzXzEuc3ViamVjdElkKShpbmRleCk7XG4gICAgbGV0IHN1YmplY3QgPSBhd2FpdCBHb3Zlcm5hbmNlU3ViamVjdF8xLkdvdmVybmFuY2VTdWJqZWN0LmdldChpZCk7XG4gICAgaWYgKCFzdWJqZWN0KSB7XG4gICAgICAgIHN1YmplY3QgPSBHb3Zlcm5hbmNlU3ViamVjdF8xLkdvdmVybmFuY2VTdWJqZWN0LmNyZWF0ZSh7XG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIGNoYWluSWQ6IHV0aWxzXzEuQ0hBSU5fSUQsXG4gICAgICAgICAgICByZWZlcmVuZHVtSW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgc3RhdHVzOiBcIlN1Ym1pdHRlZFwiLFxuICAgICAgICAgICAgdHJhY2ssXG4gICAgICAgICAgICBzdWJtaXR0ZWRBdDogYmxvY2tOdW1iZXIsXG4gICAgICAgICAgICBheWVWb3RlczogQmlnSW50KDApLFxuICAgICAgICAgICAgbmF5Vm90ZXM6IEJpZ0ludCgwKSxcbiAgICAgICAgICAgIGFic3RhaW5Wb3RlczogQmlnSW50KDApLFxuICAgICAgICAgICAgdXBkYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gc3ViamVjdDtcbn1cbi8vIOKUgOKUgOKUgCBTdWJtaXR0ZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVSZWZlcmVuZHVtU3VibWl0dGVkKGV2ZW50KSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jaywgZXh0cmluc2ljLCB9ID0gZXZlbnQ7XG4gICAgLy8gZGF0YTogW2luZGV4OiB1MzIsIHRyYWNrOiB1MTYsIHByb3Bvc2FsOiBCb3VuZGVkPFJ1bnRpbWVDYWxsLCBIYXNoaW5nPl1cbiAgICBjb25zdCBpbmRleCA9IGRhdGFbMF0udG9OdW1iZXIoKTtcbiAgICBjb25zdCB0cmFjayA9IGRhdGFbMV0udG9OdW1iZXIoKTtcbiAgICBjb25zdCBwcm9wb3NhbERhdGEgPSBkYXRhWzJdO1xuICAgIGNvbnN0IGJsb2NrTnVtYmVyID0gQmlnSW50KGJsb2NrLmJsb2NrLmhlYWRlci5udW1iZXIudG9TdHJpbmcoKSk7XG4gICAgY29uc3QgdGltZXN0YW1wID0gKF9hID0gYmxvY2sudGltZXN0YW1wKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHN1YmplY3QgPSBhd2FpdCBnZXRPckNyZWF0ZShpbmRleCwgdHJhY2ssIGJsb2NrTnVtYmVyLCB0aW1lc3RhbXApO1xuICAgIHN1YmplY3Quc3RhdHVzID0gXCJTdWJtaXR0ZWRcIjtcbiAgICBzdWJqZWN0LnN1Ym1pdHRlZEF0ID0gYmxvY2tOdW1iZXI7XG4gICAgc3ViamVjdC5wcm9wb3NhbEhhc2ggPSBwcm9wb3NhbERhdGEudG9IZXgoKTtcbiAgICBzdWJqZWN0LnVwZGF0ZWRBdCA9IHRpbWVzdGFtcDtcbiAgICBhd2FpdCBzdWJqZWN0LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlUmVmZXJlbmR1bVN1Ym1pdHRlZCA9IGhhbmRsZVJlZmVyZW5kdW1TdWJtaXR0ZWQ7XG4vLyDilIDilIDilIAgRGVjaXNpb25TdGFydGVkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUmVmZXJlbmR1bURlY2lzaW9uU3RhcnRlZChldmVudCkge1xuICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIC8vIGRhdGE6IFtpbmRleDogdTMyLCB0cmFjazogdTE2LCBwcm9wb3NhbCwgdGFsbHk6IFRhbGx5XVxuICAgIGNvbnN0IGluZGV4ID0gZGF0YVswXS50b051bWJlcigpO1xuICAgIGNvbnN0IHRyYWNrID0gZGF0YVsxXS50b051bWJlcigpO1xuICAgIGNvbnN0IHRhbGx5UmF3ID0gZGF0YVszXS50b0pTT04oKTtcbiAgICBjb25zdCBibG9ja051bWJlciA9IEJpZ0ludChibG9jay5ibG9jay5oZWFkZXIubnVtYmVyLnRvU3RyaW5nKCkpO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IChfYSA9IGJsb2NrLnRpbWVzdGFtcCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogbmV3IERhdGUoKTtcbiAgICBjb25zdCBzdWJqZWN0ID0gYXdhaXQgZ2V0T3JDcmVhdGUoaW5kZXgsIHRyYWNrLCBibG9ja051bWJlciwgdGltZXN0YW1wKTtcbiAgICBzdWJqZWN0LnN0YXR1cyA9IFwiRGVjaWRpbmdcIjtcbiAgICBzdWJqZWN0LmRlY2lkaW5nU2luY2UgPSBibG9ja051bWJlcjtcbiAgICBzdWJqZWN0LmF5ZVZvdGVzID0gQmlnSW50KChfYiA9IHRhbGx5UmF3LmF5ZXMpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IFwiMFwiKTtcbiAgICBzdWJqZWN0Lm5heVZvdGVzID0gQmlnSW50KChfYyA9IHRhbGx5UmF3Lm5heXMpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IFwiMFwiKTtcbiAgICBzdWJqZWN0LmFic3RhaW5Wb3RlcyA9IEJpZ0ludCgoX2QgPSB0YWxseVJhdy5hYnN0YWluKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiBcIjBcIik7XG4gICAgc3ViamVjdC51cGRhdGVkQXQgPSB0aW1lc3RhbXA7XG4gICAgYXdhaXQgc3ViamVjdC5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZVJlZmVyZW5kdW1EZWNpc2lvblN0YXJ0ZWQgPSBoYW5kbGVSZWZlcmVuZHVtRGVjaXNpb25TdGFydGVkO1xuLy8g4pSA4pSA4pSAIENvbmZpcm1TdGFydGVkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUmVmZXJlbmR1bUNvbmZpcm1TdGFydGVkKGV2ZW50KSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3QgaW5kZXggPSBkYXRhWzBdLnRvTnVtYmVyKCk7XG4gICAgY29uc3QgYmxvY2tOdW1iZXIgPSBCaWdJbnQoYmxvY2suYmxvY2suaGVhZGVyLm51bWJlci50b1N0cmluZygpKTtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSAoX2EgPSBibG9jay50aW1lc3RhbXApICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG5ldyBEYXRlKCk7XG4gICAgY29uc3Qgc3ViamVjdCA9IGF3YWl0IEdvdmVybmFuY2VTdWJqZWN0XzEuR292ZXJuYW5jZVN1YmplY3QuZ2V0KCgwLCB1dGlsc18xLnN1YmplY3RJZCkoaW5kZXgpKTtcbiAgICBpZiAoIXN1YmplY3QpXG4gICAgICAgIHJldHVybjtcbiAgICBzdWJqZWN0LnN0YXR1cyA9IFwiQ29uZmlybWluZ1wiO1xuICAgIHN1YmplY3QuY29uZmlybWluZ1NpbmNlID0gYmxvY2tOdW1iZXI7XG4gICAgc3ViamVjdC51cGRhdGVkQXQgPSB0aW1lc3RhbXA7XG4gICAgYXdhaXQgc3ViamVjdC5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZVJlZmVyZW5kdW1Db25maXJtU3RhcnRlZCA9IGhhbmRsZVJlZmVyZW5kdW1Db25maXJtU3RhcnRlZDtcbi8vIOKUgOKUgOKUgCBDb25maXJtQWJvcnRlZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVJlZmVyZW5kdW1Db25maXJtQWJvcnRlZChldmVudCkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGluZGV4ID0gZGF0YVswXS50b051bWJlcigpO1xuICAgIGNvbnN0IHN1YmplY3QgPSBhd2FpdCBHb3Zlcm5hbmNlU3ViamVjdF8xLkdvdmVybmFuY2VTdWJqZWN0LmdldCgoMCwgdXRpbHNfMS5zdWJqZWN0SWQpKGluZGV4KSk7XG4gICAgaWYgKCFzdWJqZWN0KVxuICAgICAgICByZXR1cm47XG4gICAgc3ViamVjdC5zdGF0dXMgPSBcIkRlY2lkaW5nXCI7XG4gICAgc3ViamVjdC5jb25maXJtaW5nU2luY2UgPSB1bmRlZmluZWQ7XG4gICAgc3ViamVjdC51cGRhdGVkQXQgPSAoX2EgPSBibG9jay50aW1lc3RhbXApICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG5ldyBEYXRlKCk7XG4gICAgYXdhaXQgc3ViamVjdC5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZVJlZmVyZW5kdW1Db25maXJtQWJvcnRlZCA9IGhhbmRsZVJlZmVyZW5kdW1Db25maXJtQWJvcnRlZDtcbi8vIOKUgOKUgOKUgCBBcHByb3ZlZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVJlZmVyZW5kdW1BcHByb3ZlZChldmVudCkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGluZGV4ID0gZGF0YVswXS50b051bWJlcigpO1xuICAgIGNvbnN0IGJsb2NrTnVtYmVyID0gQmlnSW50KGJsb2NrLmJsb2NrLmhlYWRlci5udW1iZXIudG9TdHJpbmcoKSk7XG4gICAgY29uc3Qgc3ViamVjdCA9IGF3YWl0IEdvdmVybmFuY2VTdWJqZWN0XzEuR292ZXJuYW5jZVN1YmplY3QuZ2V0KCgwLCB1dGlsc18xLnN1YmplY3RJZCkoaW5kZXgpKTtcbiAgICBpZiAoIXN1YmplY3QpXG4gICAgICAgIHJldHVybjtcbiAgICBzdWJqZWN0LnN0YXR1cyA9IFwiQXBwcm92ZWRcIjtcbiAgICBzdWJqZWN0LmRlY2lkZWRBdCA9IGJsb2NrTnVtYmVyO1xuICAgIHN1YmplY3QudXBkYXRlZEF0ID0gKF9hID0gYmxvY2sudGltZXN0YW1wKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBuZXcgRGF0ZSgpO1xuICAgIGF3YWl0IHN1YmplY3Quc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVSZWZlcmVuZHVtQXBwcm92ZWQgPSBoYW5kbGVSZWZlcmVuZHVtQXBwcm92ZWQ7XG4vLyDilIDilIDilIAgUmVqZWN0ZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVSZWZlcmVuZHVtUmVqZWN0ZWQoZXZlbnQpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpbmRleCA9IGRhdGFbMF0udG9OdW1iZXIoKTtcbiAgICBjb25zdCBibG9ja051bWJlciA9IEJpZ0ludChibG9jay5ibG9jay5oZWFkZXIubnVtYmVyLnRvU3RyaW5nKCkpO1xuICAgIGNvbnN0IHN1YmplY3QgPSBhd2FpdCBHb3Zlcm5hbmNlU3ViamVjdF8xLkdvdmVybmFuY2VTdWJqZWN0LmdldCgoMCwgdXRpbHNfMS5zdWJqZWN0SWQpKGluZGV4KSk7XG4gICAgaWYgKCFzdWJqZWN0KVxuICAgICAgICByZXR1cm47XG4gICAgc3ViamVjdC5zdGF0dXMgPSBcIlJlamVjdGVkXCI7XG4gICAgc3ViamVjdC5kZWNpZGVkQXQgPSBibG9ja051bWJlcjtcbiAgICBzdWJqZWN0LnVwZGF0ZWRBdCA9IChfYSA9IGJsb2NrLnRpbWVzdGFtcCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogbmV3IERhdGUoKTtcbiAgICBhd2FpdCBzdWJqZWN0LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlUmVmZXJlbmR1bVJlamVjdGVkID0gaGFuZGxlUmVmZXJlbmR1bVJlamVjdGVkO1xuLy8g4pSA4pSA4pSAIENhbmNlbGxlZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVJlZmVyZW5kdW1DYW5jZWxsZWQoZXZlbnQpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpbmRleCA9IGRhdGFbMF0udG9OdW1iZXIoKTtcbiAgICBjb25zdCBibG9ja051bWJlciA9IEJpZ0ludChibG9jay5ibG9jay5oZWFkZXIubnVtYmVyLnRvU3RyaW5nKCkpO1xuICAgIGNvbnN0IHN1YmplY3QgPSBhd2FpdCBHb3Zlcm5hbmNlU3ViamVjdF8xLkdvdmVybmFuY2VTdWJqZWN0LmdldCgoMCwgdXRpbHNfMS5zdWJqZWN0SWQpKGluZGV4KSk7XG4gICAgaWYgKCFzdWJqZWN0KVxuICAgICAgICByZXR1cm47XG4gICAgc3ViamVjdC5zdGF0dXMgPSBcIkNhbmNlbGxlZFwiO1xuICAgIHN1YmplY3QuZGVjaWRlZEF0ID0gYmxvY2tOdW1iZXI7XG4gICAgc3ViamVjdC51cGRhdGVkQXQgPSAoX2EgPSBibG9jay50aW1lc3RhbXApICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG5ldyBEYXRlKCk7XG4gICAgYXdhaXQgc3ViamVjdC5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZVJlZmVyZW5kdW1DYW5jZWxsZWQgPSBoYW5kbGVSZWZlcmVuZHVtQ2FuY2VsbGVkO1xuLy8g4pSA4pSA4pSAIFRpbWVkT3V0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUmVmZXJlbmR1bVRpbWVkT3V0KGV2ZW50KSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3QgaW5kZXggPSBkYXRhWzBdLnRvTnVtYmVyKCk7XG4gICAgY29uc3QgYmxvY2tOdW1iZXIgPSBCaWdJbnQoYmxvY2suYmxvY2suaGVhZGVyLm51bWJlci50b1N0cmluZygpKTtcbiAgICBjb25zdCBzdWJqZWN0ID0gYXdhaXQgR292ZXJuYW5jZVN1YmplY3RfMS5Hb3Zlcm5hbmNlU3ViamVjdC5nZXQoKDAsIHV0aWxzXzEuc3ViamVjdElkKShpbmRleCkpO1xuICAgIGlmICghc3ViamVjdClcbiAgICAgICAgcmV0dXJuO1xuICAgIHN1YmplY3Quc3RhdHVzID0gXCJUaW1lZE91dFwiO1xuICAgIHN1YmplY3QuZGVjaWRlZEF0ID0gYmxvY2tOdW1iZXI7XG4gICAgc3ViamVjdC51cGRhdGVkQXQgPSAoX2EgPSBibG9jay50aW1lc3RhbXApICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG5ldyBEYXRlKCk7XG4gICAgYXdhaXQgc3ViamVjdC5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZVJlZmVyZW5kdW1UaW1lZE91dCA9IGhhbmRsZVJlZmVyZW5kdW1UaW1lZE91dDtcbi8vIOKUgOKUgOKUgCBLaWxsZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVSZWZlcmVuZHVtS2lsbGVkKGV2ZW50KSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3QgaW5kZXggPSBkYXRhWzBdLnRvTnVtYmVyKCk7XG4gICAgY29uc3QgYmxvY2tOdW1iZXIgPSBCaWdJbnQoYmxvY2suYmxvY2suaGVhZGVyLm51bWJlci50b1N0cmluZygpKTtcbiAgICBjb25zdCBzdWJqZWN0ID0gYXdhaXQgR292ZXJuYW5jZVN1YmplY3RfMS5Hb3Zlcm5hbmNlU3ViamVjdC5nZXQoKDAsIHV0aWxzXzEuc3ViamVjdElkKShpbmRleCkpO1xuICAgIGlmICghc3ViamVjdClcbiAgICAgICAgcmV0dXJuO1xuICAgIHN1YmplY3Quc3RhdHVzID0gXCJLaWxsZWRcIjtcbiAgICBzdWJqZWN0LmRlY2lkZWRBdCA9IGJsb2NrTnVtYmVyO1xuICAgIHN1YmplY3QudXBkYXRlZEF0ID0gKF9hID0gYmxvY2sudGltZXN0YW1wKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBuZXcgRGF0ZSgpO1xuICAgIGF3YWl0IHN1YmplY3Quc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVSZWZlcmVuZHVtS2lsbGVkID0gaGFuZGxlUmVmZXJlbmR1bUtpbGxlZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBNYXBwaW5nIGhhbmRsZXJzIGZvciBwYWxsZXRfdHJlYXN1cnkgZXZlbnRzLlxuICpcbiAqIEV2ZW50cyBoYW5kbGVkOiBQcm9wb3NlZCwgQXBwcm92ZWQsIFJlamVjdGVkLCBBd2FyZGVkXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaGFuZGxlVHJlYXN1cnlBd2FyZGVkID0gZXhwb3J0cy5oYW5kbGVUcmVhc3VyeVJlamVjdGVkID0gZXhwb3J0cy5oYW5kbGVUcmVhc3VyeUFwcHJvdmVkID0gZXhwb3J0cy5oYW5kbGVUcmVhc3VyeVByb3Bvc2VkID0gdm9pZCAwO1xuY29uc3QgVHJlYXN1cnlQcm9wb3NhbF8xID0gcmVxdWlyZShcIi4uL3R5cGVzL21vZGVscy9UcmVhc3VyeVByb3Bvc2FsXCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xuZnVuY3Rpb24gdHJlYXN1cnlJZChwcm9wb3NhbEluZGV4KSB7XG4gICAgcmV0dXJuIGAke3V0aWxzXzEuQ0hBSU5fSUR9OiR7cHJvcG9zYWxJbmRleH1gO1xufVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlVHJlYXN1cnlQcm9wb3NlZChldmVudCkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIC8vIGRhdGE6IFtwcm9wb3NhbEluZGV4OiBQcm9wb3NhbEluZGV4XVxuICAgIC8vIFByb3Bvc2VyL2JlbmVmaWNpYXJ5L3ZhbHVlL2JvbmQgY29tZSBmcm9tIHRoZSBleHRyaW5zaWMgY2FsbC5cbiAgICAvLyBGb3Igbm93IHdlIGluZGV4IHRoZSBpbmRleCArIGRlZmF1bHRzOyBjYWxsIGhhbmRsZXIgY2FuIGVucmljaCBsYXRlci5cbiAgICBjb25zdCBwcm9wb3NhbEluZGV4ID0gZGF0YVswXS50b051bWJlcigpO1xuICAgIGNvbnN0IGJsb2NrTnVtYmVyID0gQmlnSW50KGJsb2NrLmJsb2NrLmhlYWRlci5udW1iZXIudG9TdHJpbmcoKSk7XG4gICAgY29uc3QgdGltZXN0YW1wID0gKF9hID0gYmxvY2sudGltZXN0YW1wKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGlkID0gdHJlYXN1cnlJZChwcm9wb3NhbEluZGV4KTtcbiAgICBjb25zdCBwcm9wb3NhbCA9IFRyZWFzdXJ5UHJvcG9zYWxfMS5UcmVhc3VyeVByb3Bvc2FsLmNyZWF0ZSh7XG4gICAgICAgIGlkLFxuICAgICAgICBjaGFpbklkOiB1dGlsc18xLkNIQUlOX0lELFxuICAgICAgICBwcm9wb3NhbEluZGV4LFxuICAgICAgICBwcm9wb3NlcjogXCJcIixcbiAgICAgICAgYmVuZWZpY2lhcnk6IFwiXCIsXG4gICAgICAgIHZhbHVlOiBCaWdJbnQoMCksXG4gICAgICAgIGJvbmQ6IEJpZ0ludCgwKSxcbiAgICAgICAgc3RhdHVzOiBcIlByb3Bvc2VkXCIsXG4gICAgICAgIGJsb2NrTnVtYmVyLFxuICAgICAgICB1cGRhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICB9KTtcbiAgICBhd2FpdCBwcm9wb3NhbC5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZVRyZWFzdXJ5UHJvcG9zZWQgPSBoYW5kbGVUcmVhc3VyeVByb3Bvc2VkO1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlVHJlYXN1cnlBcHByb3ZlZChldmVudCkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IHByb3Bvc2FsSW5kZXggPSBkYXRhWzBdLnRvTnVtYmVyKCk7XG4gICAgY29uc3QgcHJvcG9zYWwgPSBhd2FpdCBUcmVhc3VyeVByb3Bvc2FsXzEuVHJlYXN1cnlQcm9wb3NhbC5nZXQodHJlYXN1cnlJZChwcm9wb3NhbEluZGV4KSk7XG4gICAgaWYgKHByb3Bvc2FsKSB7XG4gICAgICAgIHByb3Bvc2FsLnN0YXR1cyA9IFwiQXBwcm92ZWRcIjtcbiAgICAgICAgcHJvcG9zYWwudXBkYXRlZEF0ID0gKF9hID0gYmxvY2sudGltZXN0YW1wKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBuZXcgRGF0ZSgpO1xuICAgICAgICBhd2FpdCBwcm9wb3NhbC5zYXZlKCk7XG4gICAgfVxufVxuZXhwb3J0cy5oYW5kbGVUcmVhc3VyeUFwcHJvdmVkID0gaGFuZGxlVHJlYXN1cnlBcHByb3ZlZDtcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVRyZWFzdXJ5UmVqZWN0ZWQoZXZlbnQpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBwcm9wb3NhbEluZGV4ID0gZGF0YVswXS50b051bWJlcigpO1xuICAgIGNvbnN0IHByb3Bvc2FsID0gYXdhaXQgVHJlYXN1cnlQcm9wb3NhbF8xLlRyZWFzdXJ5UHJvcG9zYWwuZ2V0KHRyZWFzdXJ5SWQocHJvcG9zYWxJbmRleCkpO1xuICAgIGlmIChwcm9wb3NhbCkge1xuICAgICAgICBwcm9wb3NhbC5zdGF0dXMgPSBcIlJlamVjdGVkXCI7XG4gICAgICAgIHByb3Bvc2FsLnVwZGF0ZWRBdCA9IChfYSA9IGJsb2NrLnRpbWVzdGFtcCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogbmV3IERhdGUoKTtcbiAgICAgICAgYXdhaXQgcHJvcG9zYWwuc2F2ZSgpO1xuICAgIH1cbn1cbmV4cG9ydHMuaGFuZGxlVHJlYXN1cnlSZWplY3RlZCA9IGhhbmRsZVRyZWFzdXJ5UmVqZWN0ZWQ7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVUcmVhc3VyeUF3YXJkZWQoZXZlbnQpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBwcm9wb3NhbEluZGV4ID0gZGF0YVswXS50b051bWJlcigpO1xuICAgIGNvbnN0IHByb3Bvc2FsID0gYXdhaXQgVHJlYXN1cnlQcm9wb3NhbF8xLlRyZWFzdXJ5UHJvcG9zYWwuZ2V0KHRyZWFzdXJ5SWQocHJvcG9zYWxJbmRleCkpO1xuICAgIGlmIChwcm9wb3NhbCkge1xuICAgICAgICBwcm9wb3NhbC5zdGF0dXMgPSBcIkF3YXJkZWRcIjtcbiAgICAgICAgcHJvcG9zYWwudXBkYXRlZEF0ID0gKF9hID0gYmxvY2sudGltZXN0YW1wKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBuZXcgRGF0ZSgpO1xuICAgICAgICBhd2FpdCBwcm9wb3NhbC5zYXZlKCk7XG4gICAgfVxufVxuZXhwb3J0cy5oYW5kbGVUcmVhc3VyeUF3YXJkZWQgPSBoYW5kbGVUcmVhc3VyeUF3YXJkZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogU2hhcmVkIGhlbHBlcnMgZm9yIG1hcHBpbmcgaGFuZGxlcnMuXG4gKi9cbnZhciBfYTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVsZWdhdGlvbklkID0gZXhwb3J0cy52b3RlSWQgPSBleHBvcnRzLnN1YmplY3RJZCA9IGV4cG9ydHMuQ0hBSU5fSUQgPSB2b2lkIDA7XG5leHBvcnRzLkNIQUlOX0lEID0gKF9hID0gcHJvY2Vzcy5lbnZbXCJDSEFJTl9JRFwiXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogXCJzdWJzdHJhdGU6dmlibHktc29sb1wiO1xuZnVuY3Rpb24gc3ViamVjdElkKHJlZmVyZW5kdW1JbmRleCkge1xuICAgIHJldHVybiBgJHtleHBvcnRzLkNIQUlOX0lEfToke3JlZmVyZW5kdW1JbmRleH1gO1xufVxuZXhwb3J0cy5zdWJqZWN0SWQgPSBzdWJqZWN0SWQ7XG5mdW5jdGlvbiB2b3RlSWQocmVmZXJlbmR1bUluZGV4LCB2b3Rlcikge1xuICAgIHJldHVybiBgJHtleHBvcnRzLkNIQUlOX0lEfToke3JlZmVyZW5kdW1JbmRleH06JHt2b3Rlcn1gO1xufVxuZXhwb3J0cy52b3RlSWQgPSB2b3RlSWQ7XG5mdW5jdGlvbiBkZWxlZ2F0aW9uSWQodHJhY2ssIGRlbGVnYXRvcikge1xuICAgIHJldHVybiBgJHtleHBvcnRzLkNIQUlOX0lEfToke3RyYWNrfToke2RlbGVnYXRvcn1gO1xufVxuZXhwb3J0cy5kZWxlZ2F0aW9uSWQgPSBkZWxlZ2F0aW9uSWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR292ZXJuYW5jZUNoZWNrcG9pbnQgPSB2b2lkIDA7XG5jb25zdCB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xuY29uc3QgYXNzZXJ0XzEgPSB0c2xpYl8xLl9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNsYXNzIEdvdmVybmFuY2VDaGVja3BvaW50IHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgYmxvY2tOdW1iZXIsIGJsb2NrSGFzaCwgdXBkYXRlZEF0KSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5ibG9ja051bWJlciA9IGJsb2NrTnVtYmVyO1xuICAgICAgICB0aGlzLmJsb2NrSGFzaCA9IGJsb2NrSGFzaDtcbiAgICAgICAgdGhpcy51cGRhdGVkQXQgPSB1cGRhdGVkQXQ7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdHb3Zlcm5hbmNlQ2hlY2twb2ludCc7XG4gICAgfVxuICAgIGFzeW5jIHNhdmUoKSB7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5pZDtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCBzYXZlIEdvdmVybmFuY2VDaGVja3BvaW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXQoJ0dvdmVybmFuY2VDaGVja3BvaW50JywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgR292ZXJuYW5jZUNoZWNrcG9pbnQgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnJlbW92ZSgnR292ZXJuYW5jZUNoZWNrcG9pbnQnLCBpZC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIGdldChpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoKGlkICE9PSBudWxsICYmIGlkICE9PSB1bmRlZmluZWQpLCBcIkNhbm5vdCBnZXQgR292ZXJuYW5jZUNoZWNrcG9pbnQgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnR292ZXJuYW5jZUNoZWNrcG9pbnQnLCBpZC50b1N0cmluZygpKTtcbiAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKHJlY29yZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyBlbnRpdGllcyBtYXRjaGluZyB0aGUgc3BlY2lmaWVkIGZpbHRlcnMgYW5kIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiDimqDvuI8gVGhpcyBmdW5jdGlvbiB3aWxsIGZpcnN0IHNlYXJjaCBjYWNoZSBkYXRhIGZvbGxvd2VkIGJ5IERCIGRhdGEuIFBsZWFzZSBjb25zaWRlciB0aGlzIHdoZW4gdXNpbmcgb3JkZXIgYW5kIG9mZnNldCBvcHRpb25zLuKaoO+4j1xuICAgICAqICovXG4gICAgc3RhdGljIGFzeW5jIGdldEJ5RmllbGRzKGZpbHRlciwgb3B0aW9ucykge1xuICAgICAgICBjb25zdCByZWNvcmRzID0gYXdhaXQgc3RvcmUuZ2V0QnlGaWVsZHMoJ0dvdmVybmFuY2VDaGVja3BvaW50JywgZmlsdGVyLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB0aGlzLmNyZWF0ZShyZWNvcmQpKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShyZWNvcmQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHJlY29yZC5pZCAhPT0gdW5kZWZpbmVkICYmIHJlY29yZC5pZCAhPT0gbnVsbCwgXCJpZCBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgdGhpcyhyZWNvcmQuaWQsIHJlY29yZC5ibG9ja051bWJlciwgcmVjb3JkLmJsb2NrSGFzaCwgcmVjb3JkLnVwZGF0ZWRBdCk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZW50aXR5LCByZWNvcmQpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cbn1cbmV4cG9ydHMuR292ZXJuYW5jZUNoZWNrcG9pbnQgPSBHb3Zlcm5hbmNlQ2hlY2twb2ludDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Hb3Zlcm5hbmNlRGVsZWdhdGlvbiA9IHZvaWQgMDtcbmNvbnN0IHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG5jb25zdCBhc3NlcnRfMSA9IHRzbGliXzEuX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJhc3NlcnRcIikpO1xuY2xhc3MgR292ZXJuYW5jZURlbGVnYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBjaGFpbklkLCB0cmFjaywgZGVsZWdhdG9yLCBkZWxlZ2F0ZWUsIGNvbnZpY3Rpb24sIGJhbGFuY2UsIGlzQWN0aXZlLCBibG9ja051bWJlciwgdXBkYXRlZEF0KSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jaGFpbklkID0gY2hhaW5JZDtcbiAgICAgICAgdGhpcy50cmFjayA9IHRyYWNrO1xuICAgICAgICB0aGlzLmRlbGVnYXRvciA9IGRlbGVnYXRvcjtcbiAgICAgICAgdGhpcy5kZWxlZ2F0ZWUgPSBkZWxlZ2F0ZWU7XG4gICAgICAgIHRoaXMuY29udmljdGlvbiA9IGNvbnZpY3Rpb247XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IGJhbGFuY2U7XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSBpc0FjdGl2ZTtcbiAgICAgICAgdGhpcy5ibG9ja051bWJlciA9IGJsb2NrTnVtYmVyO1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdCA9IHVwZGF0ZWRBdDtcbiAgICB9XG4gICAgZ2V0IF9uYW1lKCkge1xuICAgICAgICByZXR1cm4gJ0dvdmVybmFuY2VEZWxlZ2F0aW9uJztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgR292ZXJuYW5jZURlbGVnYXRpb24gZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNldCgnR292ZXJuYW5jZURlbGVnYXRpb24nLCBpZC50b1N0cmluZygpLCB0aGlzKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIHJlbW92ZShpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHJlbW92ZSBHb3Zlcm5hbmNlRGVsZWdhdGlvbiBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdHb3Zlcm5hbmNlRGVsZWdhdGlvbicsIGlkLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgZ2V0KGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSgoaWQgIT09IG51bGwgJiYgaWQgIT09IHVuZGVmaW5lZCksIFwiQ2Fubm90IGdldCBHb3Zlcm5hbmNlRGVsZWdhdGlvbiBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgc3RvcmUuZ2V0KCdHb3Zlcm5hbmNlRGVsZWdhdGlvbicsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlTdWJqZWN0SWQoc3ViamVjdElkLCBvcHRpb25zKSB7XG4gICAgICAgIC8vIElucHV0cyBtdXN0IGJlIGNhc3QgYXMgdGhlIHN0b3JlIGludGVyZmFjZSBoYXMgbm90IGJlZW4gdXBkYXRlZCB0byBzdXBwb3J0IGFsdGVybmF0aXZlIElEIHR5cGVzXG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkKCdHb3Zlcm5hbmNlRGVsZWdhdGlvbicsICdzdWJqZWN0SWQnLCBzdWJqZWN0SWQsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHRoaXMuY3JlYXRlKHJlY29yZCkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnR292ZXJuYW5jZURlbGVnYXRpb24nLCBmaWx0ZXIsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHRoaXMuY3JlYXRlKHJlY29yZCkpO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKHJlY29yZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkocmVjb3JkLmlkICE9PSB1bmRlZmluZWQgJiYgcmVjb3JkLmlkICE9PSBudWxsLCBcImlkIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IG5ldyB0aGlzKHJlY29yZC5pZCwgcmVjb3JkLmNoYWluSWQsIHJlY29yZC50cmFjaywgcmVjb3JkLmRlbGVnYXRvciwgcmVjb3JkLmRlbGVnYXRlZSwgcmVjb3JkLmNvbnZpY3Rpb24sIHJlY29yZC5iYWxhbmNlLCByZWNvcmQuaXNBY3RpdmUsIHJlY29yZC5ibG9ja051bWJlciwgcmVjb3JkLnVwZGF0ZWRBdCk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZW50aXR5LCByZWNvcmQpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cbn1cbmV4cG9ydHMuR292ZXJuYW5jZURlbGVnYXRpb24gPSBHb3Zlcm5hbmNlRGVsZWdhdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Hb3Zlcm5hbmNlU3ViamVjdCA9IHZvaWQgMDtcbmNvbnN0IHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG5jb25zdCBhc3NlcnRfMSA9IHRzbGliXzEuX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJhc3NlcnRcIikpO1xuY2xhc3MgR292ZXJuYW5jZVN1YmplY3Qge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBjaGFpbklkLCByZWZlcmVuZHVtSW5kZXgsIHN0YXR1cywgdHJhY2ssIHN1Ym1pdHRlZEF0LCBheWVWb3RlcywgbmF5Vm90ZXMsIGFic3RhaW5Wb3RlcywgdXBkYXRlZEF0KSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jaGFpbklkID0gY2hhaW5JZDtcbiAgICAgICAgdGhpcy5yZWZlcmVuZHVtSW5kZXggPSByZWZlcmVuZHVtSW5kZXg7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICB0aGlzLnRyYWNrID0gdHJhY2s7XG4gICAgICAgIHRoaXMuc3VibWl0dGVkQXQgPSBzdWJtaXR0ZWRBdDtcbiAgICAgICAgdGhpcy5heWVWb3RlcyA9IGF5ZVZvdGVzO1xuICAgICAgICB0aGlzLm5heVZvdGVzID0gbmF5Vm90ZXM7XG4gICAgICAgIHRoaXMuYWJzdGFpblZvdGVzID0gYWJzdGFpblZvdGVzO1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdCA9IHVwZGF0ZWRBdDtcbiAgICB9XG4gICAgZ2V0IF9uYW1lKCkge1xuICAgICAgICByZXR1cm4gJ0dvdmVybmFuY2VTdWJqZWN0JztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgR292ZXJuYW5jZVN1YmplY3QgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNldCgnR292ZXJuYW5jZVN1YmplY3QnLCBpZC50b1N0cmluZygpLCB0aGlzKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIHJlbW92ZShpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHJlbW92ZSBHb3Zlcm5hbmNlU3ViamVjdCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdHb3Zlcm5hbmNlU3ViamVjdCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgZ2V0KGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSgoaWQgIT09IG51bGwgJiYgaWQgIT09IHVuZGVmaW5lZCksIFwiQ2Fubm90IGdldCBHb3Zlcm5hbmNlU3ViamVjdCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgc3RvcmUuZ2V0KCdHb3Zlcm5hbmNlU3ViamVjdCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnR292ZXJuYW5jZVN1YmplY3QnLCBmaWx0ZXIsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHRoaXMuY3JlYXRlKHJlY29yZCkpO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKHJlY29yZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkocmVjb3JkLmlkICE9PSB1bmRlZmluZWQgJiYgcmVjb3JkLmlkICE9PSBudWxsLCBcImlkIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IG5ldyB0aGlzKHJlY29yZC5pZCwgcmVjb3JkLmNoYWluSWQsIHJlY29yZC5yZWZlcmVuZHVtSW5kZXgsIHJlY29yZC5zdGF0dXMsIHJlY29yZC50cmFjaywgcmVjb3JkLnN1Ym1pdHRlZEF0LCByZWNvcmQuYXllVm90ZXMsIHJlY29yZC5uYXlWb3RlcywgcmVjb3JkLmFic3RhaW5Wb3RlcywgcmVjb3JkLnVwZGF0ZWRBdCk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZW50aXR5LCByZWNvcmQpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cbn1cbmV4cG9ydHMuR292ZXJuYW5jZVN1YmplY3QgPSBHb3Zlcm5hbmNlU3ViamVjdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Hb3Zlcm5hbmNlVm90ZSA9IHZvaWQgMDtcbmNvbnN0IHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG5jb25zdCBhc3NlcnRfMSA9IHRzbGliXzEuX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJhc3NlcnRcIikpO1xuY2xhc3MgR292ZXJuYW5jZVZvdGUge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBjaGFpbklkLCByZWZlcmVuZHVtSW5kZXgsIHZvdGVyLCBzdGFuY2UsIGNvbnZpY3Rpb24sIGJhbGFuY2UsIGlzUmVtb3ZlZCwgc3ViamVjdElkLCBibG9ja051bWJlciwgdXBkYXRlZEF0KSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jaGFpbklkID0gY2hhaW5JZDtcbiAgICAgICAgdGhpcy5yZWZlcmVuZHVtSW5kZXggPSByZWZlcmVuZHVtSW5kZXg7XG4gICAgICAgIHRoaXMudm90ZXIgPSB2b3RlcjtcbiAgICAgICAgdGhpcy5zdGFuY2UgPSBzdGFuY2U7XG4gICAgICAgIHRoaXMuY29udmljdGlvbiA9IGNvbnZpY3Rpb247XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IGJhbGFuY2U7XG4gICAgICAgIHRoaXMuaXNSZW1vdmVkID0gaXNSZW1vdmVkO1xuICAgICAgICB0aGlzLnN1YmplY3RJZCA9IHN1YmplY3RJZDtcbiAgICAgICAgdGhpcy5ibG9ja051bWJlciA9IGJsb2NrTnVtYmVyO1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdCA9IHVwZGF0ZWRBdDtcbiAgICB9XG4gICAgZ2V0IF9uYW1lKCkge1xuICAgICAgICByZXR1cm4gJ0dvdmVybmFuY2VWb3RlJztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgR292ZXJuYW5jZVZvdGUgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNldCgnR292ZXJuYW5jZVZvdGUnLCBpZC50b1N0cmluZygpLCB0aGlzKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIHJlbW92ZShpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHJlbW92ZSBHb3Zlcm5hbmNlVm90ZSBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdHb3Zlcm5hbmNlVm90ZScsIGlkLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgZ2V0KGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSgoaWQgIT09IG51bGwgJiYgaWQgIT09IHVuZGVmaW5lZCksIFwiQ2Fubm90IGdldCBHb3Zlcm5hbmNlVm90ZSBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgc3RvcmUuZ2V0KCdHb3Zlcm5hbmNlVm90ZScsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlTdWJqZWN0SWQoc3ViamVjdElkLCBvcHRpb25zKSB7XG4gICAgICAgIC8vIElucHV0cyBtdXN0IGJlIGNhc3QgYXMgdGhlIHN0b3JlIGludGVyZmFjZSBoYXMgbm90IGJlZW4gdXBkYXRlZCB0byBzdXBwb3J0IGFsdGVybmF0aXZlIElEIHR5cGVzXG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkKCdHb3Zlcm5hbmNlVm90ZScsICdzdWJqZWN0SWQnLCBzdWJqZWN0SWQsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHRoaXMuY3JlYXRlKHJlY29yZCkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnR292ZXJuYW5jZVZvdGUnLCBmaWx0ZXIsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHRoaXMuY3JlYXRlKHJlY29yZCkpO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKHJlY29yZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkocmVjb3JkLmlkICE9PSB1bmRlZmluZWQgJiYgcmVjb3JkLmlkICE9PSBudWxsLCBcImlkIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IG5ldyB0aGlzKHJlY29yZC5pZCwgcmVjb3JkLmNoYWluSWQsIHJlY29yZC5yZWZlcmVuZHVtSW5kZXgsIHJlY29yZC52b3RlciwgcmVjb3JkLnN0YW5jZSwgcmVjb3JkLmNvbnZpY3Rpb24sIHJlY29yZC5iYWxhbmNlLCByZWNvcmQuaXNSZW1vdmVkLCByZWNvcmQuc3ViamVjdElkLCByZWNvcmQuYmxvY2tOdW1iZXIsIHJlY29yZC51cGRhdGVkQXQpO1xuICAgICAgICBPYmplY3QuYXNzaWduKGVudGl0eSwgcmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG59XG5leHBvcnRzLkdvdmVybmFuY2VWb3RlID0gR292ZXJuYW5jZVZvdGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUHJlaW1hZ2UgPSB2b2lkIDA7XG5jb25zdCB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xuY29uc3QgYXNzZXJ0XzEgPSB0c2xpYl8xLl9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNsYXNzIFByZWltYWdlIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgaGFzaCwgZGF0YSwgbGVuLCBzdGF0dXMsIGJsb2NrTnVtYmVyLCB1cGRhdGVkQXQpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNoYWluSWQgPSBjaGFpbklkO1xuICAgICAgICB0aGlzLmhhc2ggPSBoYXNoO1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICB0aGlzLmxlbiA9IGxlbjtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gICAgICAgIHRoaXMuYmxvY2tOdW1iZXIgPSBibG9ja051bWJlcjtcbiAgICAgICAgdGhpcy51cGRhdGVkQXQgPSB1cGRhdGVkQXQ7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdQcmVpbWFnZSc7XG4gICAgfVxuICAgIGFzeW5jIHNhdmUoKSB7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5pZDtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCBzYXZlIFByZWltYWdlIGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXQoJ1ByZWltYWdlJywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgUHJlaW1hZ2UgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnJlbW92ZSgnUHJlaW1hZ2UnLCBpZC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIGdldChpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoKGlkICE9PSBudWxsICYmIGlkICE9PSB1bmRlZmluZWQpLCBcIkNhbm5vdCBnZXQgUHJlaW1hZ2UgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnUHJlaW1hZ2UnLCBpZC50b1N0cmluZygpKTtcbiAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKHJlY29yZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyBlbnRpdGllcyBtYXRjaGluZyB0aGUgc3BlY2lmaWVkIGZpbHRlcnMgYW5kIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiDimqDvuI8gVGhpcyBmdW5jdGlvbiB3aWxsIGZpcnN0IHNlYXJjaCBjYWNoZSBkYXRhIGZvbGxvd2VkIGJ5IERCIGRhdGEuIFBsZWFzZSBjb25zaWRlciB0aGlzIHdoZW4gdXNpbmcgb3JkZXIgYW5kIG9mZnNldCBvcHRpb25zLuKaoO+4j1xuICAgICAqICovXG4gICAgc3RhdGljIGFzeW5jIGdldEJ5RmllbGRzKGZpbHRlciwgb3B0aW9ucykge1xuICAgICAgICBjb25zdCByZWNvcmRzID0gYXdhaXQgc3RvcmUuZ2V0QnlGaWVsZHMoJ1ByZWltYWdlJywgZmlsdGVyLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB0aGlzLmNyZWF0ZShyZWNvcmQpKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShyZWNvcmQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHJlY29yZC5pZCAhPT0gdW5kZWZpbmVkICYmIHJlY29yZC5pZCAhPT0gbnVsbCwgXCJpZCBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgdGhpcyhyZWNvcmQuaWQsIHJlY29yZC5jaGFpbklkLCByZWNvcmQuaGFzaCwgcmVjb3JkLmRhdGEsIHJlY29yZC5sZW4sIHJlY29yZC5zdGF0dXMsIHJlY29yZC5ibG9ja051bWJlciwgcmVjb3JkLnVwZGF0ZWRBdCk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZW50aXR5LCByZWNvcmQpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cbn1cbmV4cG9ydHMuUHJlaW1hZ2UgPSBQcmVpbWFnZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5UcmVhc3VyeVByb3Bvc2FsID0gdm9pZCAwO1xuY29uc3QgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbmNvbnN0IGFzc2VydF8xID0gdHNsaWJfMS5fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImFzc2VydFwiKSk7XG5jbGFzcyBUcmVhc3VyeVByb3Bvc2FsIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgcHJvcG9zYWxJbmRleCwgcHJvcG9zZXIsIGJlbmVmaWNpYXJ5LCB2YWx1ZSwgYm9uZCwgc3RhdHVzLCBibG9ja051bWJlciwgdXBkYXRlZEF0KSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jaGFpbklkID0gY2hhaW5JZDtcbiAgICAgICAgdGhpcy5wcm9wb3NhbEluZGV4ID0gcHJvcG9zYWxJbmRleDtcbiAgICAgICAgdGhpcy5wcm9wb3NlciA9IHByb3Bvc2VyO1xuICAgICAgICB0aGlzLmJlbmVmaWNpYXJ5ID0gYmVuZWZpY2lhcnk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5ib25kID0gYm9uZDtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gICAgICAgIHRoaXMuYmxvY2tOdW1iZXIgPSBibG9ja051bWJlcjtcbiAgICAgICAgdGhpcy51cGRhdGVkQXQgPSB1cGRhdGVkQXQ7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdUcmVhc3VyeVByb3Bvc2FsJztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgVHJlYXN1cnlQcm9wb3NhbCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUuc2V0KCdUcmVhc3VyeVByb3Bvc2FsJywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgVHJlYXN1cnlQcm9wb3NhbCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdUcmVhc3VyeVByb3Bvc2FsJywgaWQudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyBnZXQoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKChpZCAhPT0gbnVsbCAmJiBpZCAhPT0gdW5kZWZpbmVkKSwgXCJDYW5ub3QgZ2V0IFRyZWFzdXJ5UHJvcG9zYWwgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnVHJlYXN1cnlQcm9wb3NhbCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnVHJlYXN1cnlQcm9wb3NhbCcsIGZpbHRlciwgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiByZWNvcmRzLm1hcChyZWNvcmQgPT4gdGhpcy5jcmVhdGUocmVjb3JkKSk7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUocmVjb3JkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShyZWNvcmQuaWQgIT09IHVuZGVmaW5lZCAmJiByZWNvcmQuaWQgIT09IG51bGwsIFwiaWQgbXVzdCBiZSBwcm92aWRlZFwiKTtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gbmV3IHRoaXMocmVjb3JkLmlkLCByZWNvcmQuY2hhaW5JZCwgcmVjb3JkLnByb3Bvc2FsSW5kZXgsIHJlY29yZC5wcm9wb3NlciwgcmVjb3JkLmJlbmVmaWNpYXJ5LCByZWNvcmQudmFsdWUsIHJlY29yZC5ib25kLCByZWNvcmQuc3RhdHVzLCByZWNvcmQuYmxvY2tOdW1iZXIsIHJlY29yZC51cGRhdGVkQXQpO1xuICAgICAgICBPYmplY3QuYXNzaWduKGVudGl0eSwgcmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG59XG5leHBvcnRzLlRyZWFzdXJ5UHJvcG9zYWwgPSBUcmVhc3VyeVByb3Bvc2FsO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXNzZXJ0XCIpOyIsImV4cG9ydCBjb25zdCBwYWNrYWdlSW5mbyA9IHsgbmFtZTogJ0Bwb2xrYWRvdC9hcGktYmFzZScsIHBhdGg6IChpbXBvcnQubWV0YSAmJiBpbXBvcnQubWV0YS51cmwpID8gbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLnN1YnN0cmluZygwLCBuZXcgVVJMKGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUubGFzdEluZGV4T2YoJy8nKSArIDEpIDogJ2F1dG8nLCB0eXBlOiAnZXNtJywgdmVyc2lvbjogJzE2LjUuNicgfTtcbiIsImV4cG9ydCBjb25zdCBwYWNrYWdlSW5mbyA9IHsgbmFtZTogJ0Bwb2xrYWRvdC90eXBlcycsIHBhdGg6IChpbXBvcnQubWV0YSAmJiBpbXBvcnQubWV0YS51cmwpID8gbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLnN1YnN0cmluZygwLCBuZXcgVVJMKGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUubGFzdEluZGV4T2YoJy8nKSArIDEpIDogJ2F1dG8nLCB0eXBlOiAnZXNtJywgdmVyc2lvbjogJzE2LjUuNicgfTtcbiIsImV4cG9ydCBjb25zdCBwYWNrYWdlSW5mbyA9IHsgbmFtZTogJ0Bwb2xrYWRvdC90eXBlcy1jb2RlYycsIHBhdGg6IChpbXBvcnQubWV0YSAmJiBpbXBvcnQubWV0YS51cmwpID8gbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLnN1YnN0cmluZygwLCBuZXcgVVJMKGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUubGFzdEluZGV4T2YoJy8nKSArIDEpIDogJ2F1dG8nLCB0eXBlOiAnZXNtJywgdmVyc2lvbjogJzE2LjUuNicgfTtcbiIsImV4cG9ydCB7IHBhY2thZ2VJbmZvIH0gZnJvbSAnLi9wYWNrYWdlSW5mby5qcyc7XG4vKiogQGludGVybmFsIExhc3QtcmVzb3J0IFwidGhpc1wiLCBpZiBpdCBnZXRzIGhlcmUgaXQgcHJvYmFibHkgd291bGQgZmFpbCBhbnl3YXkgKi9cbmZ1bmN0aW9uIGV2YWx1YXRlVGhpcyhmbikge1xuICAgIHJldHVybiBmbigncmV0dXJuIHRoaXMnKTtcbn1cbi8qKlxuICogQSBjcm9zcy1lbnZpcm9ubWVudCBpbXBsZW1lbnRhdGlvbiBmb3IgZ2xvYmFsVGhpc1xuICovXG5leHBvcnQgY29uc3QgeGdsb2JhbCA9IC8qI19fUFVSRV9fKi8gKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJ1xuICAgID8gZ2xvYmFsVGhpc1xuICAgIDogdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyBnbG9iYWxcbiAgICAgICAgOiB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgID8gc2VsZlxuICAgICAgICAgICAgOiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgID8gd2luZG93XG4gICAgICAgICAgICAgICAgOiBldmFsdWF0ZVRoaXMoRnVuY3Rpb24pKTtcbi8qKlxuICogRXh0cmFjdHMgYSBrbm93biBnbG9iYWwgZnJvbSB0aGUgZW52aXJvbm1lbnQsIGFwcGx5aW5nIGEgZmFsbGJhY2sgaWYgbm90IGZvdW5kXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0R2xvYmFsKG5hbWUsIGZhbGxiYWNrKSB7XG4gICAgLy8gTm90IHF1aXRlIHN1cmUgd2h5IHRoaXMgaXMgaGVyZSAtIHNudWNrIGluIHdpdGggVFMgNC43LjIgd2l0aCBubyByZWFsIGlkZWFcbiAgICAvLyAoYXMgb2Ygbm93KSBhcyB0byB3aHkgdGhpcyBsb29rcyBsaWtlIGFuIFwiYW55XCIgd2hlbiB3ZSBkbyBjYXN0IGl0IHRvIGEgVFxuICAgIC8vXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtcmV0dXJuXG4gICAgcmV0dXJuIHR5cGVvZiB4Z2xvYmFsW25hbWVdID09PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IGZhbGxiYWNrXG4gICAgICAgIDogeGdsb2JhbFtuYW1lXTtcbn1cbi8qKlxuICogRXhwb3NlIGEgdmFsdWUgYXMgYSBrbm93biBnbG9iYWwsIGlmIG5vdCBhbHJlYWR5IGRlZmluZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4cG9zZUdsb2JhbChuYW1lLCBmYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2YgeGdsb2JhbFtuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgeGdsb2JhbFtuYW1lXSA9IGZhbGxiYWNrO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IHhnbG9iYWwgfSBmcm9tICdAcG9sa2Fkb3QveC1nbG9iYWwnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXMvZnVuY3Rpb24uanMnO1xuY29uc3QgREVEVVBFID0gJ0VpdGhlciByZW1vdmUgYW5kIGV4cGxpY2l0bHkgaW5zdGFsbCBtYXRjaGluZyB2ZXJzaW9ucyBvciBkZWR1cGUgdXNpbmcgeW91ciBwYWNrYWdlIG1hbmFnZXIuXFxuVGhlIGZvbGxvd2luZyBjb25mbGljdGluZyBwYWNrYWdlcyB3ZXJlIGZvdW5kOic7XG5leHBvcnQgY29uc3QgUE9MS0FET1RKU19ESVNBQkxFX0VTTV9DSlNfV0FSTklOR19GTEFHID0gJ1BPTEtBRE9USlNfRElTQUJMRV9FU01fQ0pTX1dBUk5JTkcnO1xuLyoqIEBpbnRlcm5hbCAqL1xuZnVuY3Rpb24gZ2V0RW50cnkobmFtZSkge1xuICAgIGNvbnN0IF9nbG9iYWwgPSB4Z2xvYmFsO1xuICAgIGlmICghX2dsb2JhbC5fX3BvbGthZG90anMpIHtcbiAgICAgICAgX2dsb2JhbC5fX3BvbGthZG90anMgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFfZ2xvYmFsLl9fcG9sa2Fkb3Rqc1tuYW1lXSkge1xuICAgICAgICBfZ2xvYmFsLl9fcG9sa2Fkb3Rqc1tuYW1lXSA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gX2dsb2JhbC5fX3BvbGthZG90anNbbmFtZV07XG59XG4vKiogQGludGVybmFsICovXG5mdW5jdGlvbiBmb3JtYXREaXNwbGF5KGFsbCwgZm10KSB7XG4gICAgbGV0IG1heCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDAsIGNvdW50ID0gYWxsLmxlbmd0aDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgbWF4ID0gTWF0aC5tYXgobWF4LCBhbGxbaV0udmVyc2lvbi5sZW5ndGgpO1xuICAgIH1cbiAgICByZXR1cm4gYWxsXG4gICAgICAgIC5tYXAoKGQpID0+IGBcXHQke2ZtdChkLnZlcnNpb24ucGFkRW5kKG1heCksIGQpLmpvaW4oJ1xcdCcpfWApXG4gICAgICAgIC5qb2luKCdcXG4nKTtcbn1cbi8qKiBAaW50ZXJuYWwgKi9cbmZ1bmN0aW9uIGZvcm1hdEluZm8odmVyc2lvbiwgeyBuYW1lIH0pIHtcbiAgICByZXR1cm4gW1xuICAgICAgICB2ZXJzaW9uLFxuICAgICAgICBuYW1lXG4gICAgXTtcbn1cbi8qKiBAaW50ZXJuYWwgKi9cbmZ1bmN0aW9uIGZvcm1hdFZlcnNpb24odmVyc2lvbiwgeyBwYXRoLCB0eXBlIH0pIHtcbiAgICBsZXQgZXh0cmFjdGVkO1xuICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoID49IDUpIHtcbiAgICAgICAgY29uc3Qgbm1JbmRleCA9IHBhdGguaW5kZXhPZignbm9kZV9tb2R1bGVzJyk7XG4gICAgICAgIGV4dHJhY3RlZCA9IG5tSW5kZXggPT09IC0xXG4gICAgICAgICAgICA/IHBhdGhcbiAgICAgICAgICAgIDogcGF0aC5zdWJzdHJpbmcobm1JbmRleCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBleHRyYWN0ZWQgPSAnPHVua25vd24+JztcbiAgICB9XG4gICAgcmV0dXJuIFtcbiAgICAgICAgYCR7YCR7dHlwZSB8fCAnJ31gLnBhZFN0YXJ0KDMpfSAke3ZlcnNpb259YCxcbiAgICAgICAgZXh0cmFjdGVkXG4gICAgXTtcbn1cbi8qKiBAaW50ZXJuYWwgKi9cbmZ1bmN0aW9uIGdldFBhdGgoaW5mb1BhdGgsIHBhdGhPckZuKSB7XG4gICAgaWYgKGluZm9QYXRoKSB7XG4gICAgICAgIHJldHVybiBpbmZvUGF0aDtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNGdW5jdGlvbihwYXRoT3JGbikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoT3JGbigpIHx8ICcnO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGF0aE9yRm4gfHwgJyc7XG59XG4vKiogQGludGVybmFsICovXG5mdW5jdGlvbiB3YXJuKHByZSwgYWxsLCBmbXQpIHtcbiAgICBjb25zb2xlLndhcm4oYCR7cHJlfVxcbiR7REVEVVBFfVxcbiR7Zm9ybWF0RGlzcGxheShhbGwsIGZtdCl9YCk7XG59XG4vKipcbiAqIEBuYW1lIGRldGVjdFBhY2thZ2VcbiAqIEBzdW1tYXJ5IENoZWNrcyB0aGF0IGEgc3BlY2lmaWMgcGFja2FnZSBpcyBvbmx5IGltcG9ydGVkIG9uY2VcbiAqIEBkZXNjcmlwdGlvbiBBIGBAcG9sa2Fkb3QvKmAgdmVyc2lvbiBkZXRlY3Rpb24gdXRpbGl0eSwgY2hlY2tpbmcgZm9yIG9uZSBvY2N1cnJlbmNlIG9mIGEgcGFja2FnZSBpbiBhZGRpdGlvbiB0byBjaGVja2luZyBmb3IgZGVwZW5kZW5jeSB2ZXJzaW9ucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRldGVjdFBhY2thZ2UoeyBuYW1lLCBwYXRoLCB0eXBlLCB2ZXJzaW9uIH0sIHBhdGhPckZuLCBkZXBzID0gW10pIHtcbiAgICBpZiAoIW5hbWUuc3RhcnRzV2l0aCgnQHBvbGthZG90JykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHBhY2thZ2UgZGVzY3JpcHRvciAke25hbWV9YCk7XG4gICAgfVxuICAgIGNvbnN0IGVudHJ5ID0gZ2V0RW50cnkobmFtZSk7XG4gICAgZW50cnkucHVzaCh7IHBhdGg6IGdldFBhdGgocGF0aCwgcGF0aE9yRm4pLCB0eXBlLCB2ZXJzaW9uIH0pO1xuICAgIC8vIGlmIHdlIGhhdmUgbW9yZSB0aGFuIG9uZSBlbnRyeSBhdCBESUZGRVJFTlQgdmVyc2lvbiB0eXBlcyB0aGVuIHdhcm4uIElmIHRoZXJlIGlzXG4gICAgLy8gbW9yZSB0aGFuIG9uZSBlbnRyeSBhdCB0aGUgc2FtZSB2ZXJzaW9uIGFuZCBFU00vQ0pTIGR1YWwgd2FybmluZ3MgYXJlIGRpc2FibGVkLFxuICAgIC8vIHRoZW4gZG8gbm90IGRpc3BsYXkgd2FybmluZ3NcbiAgICBjb25zdCBlbnRyaWVzU2FtZVZlcnNpb24gPSBlbnRyeS5ldmVyeSgoZSkgPT4gZS52ZXJzaW9uID09PSB2ZXJzaW9uKTtcbiAgICBjb25zdCBlc21DanNXYXJuaW5nRGlzYWJsZWQgPSB4Z2xvYmFsLnByb2Nlc3M/LmVudj8uW1BPTEtBRE9USlNfRElTQUJMRV9FU01fQ0pTX1dBUk5JTkdfRkxBR10gPT09ICcxJztcbiAgICBjb25zdCBtdWx0aXBsZUVudHJpZXMgPSBlbnRyeS5sZW5ndGggIT09IDE7XG4gICAgY29uc3QgZGlzYWJsZVdhcm5pbmdzID0gZXNtQ2pzV2FybmluZ0Rpc2FibGVkICYmIGVudHJpZXNTYW1lVmVyc2lvbjtcbiAgICBpZiAobXVsdGlwbGVFbnRyaWVzICYmICFkaXNhYmxlV2FybmluZ3MpIHtcbiAgICAgICAgd2FybihgJHtuYW1lfSBoYXMgbXVsdGlwbGUgdmVyc2lvbnMsIGVuc3VyZSB0aGF0IHRoZXJlIGlzIG9ubHkgb25lIGluc3RhbGxlZC5gLCBlbnRyeSwgZm9ybWF0VmVyc2lvbik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBtaXNtYXRjaGVzID0gZGVwcy5maWx0ZXIoKGQpID0+IGQgJiYgZC52ZXJzaW9uICE9PSB2ZXJzaW9uKTtcbiAgICAgICAgaWYgKG1pc21hdGNoZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB3YXJuKGAke25hbWV9IHJlcXVpcmVzIGRpcmVjdCBkZXBlbmRlbmNpZXMgZXhhY3RseSBtYXRjaGluZyB2ZXJzaW9uICR7dmVyc2lvbn0uYCwgbWlzbWF0Y2hlcywgZm9ybWF0SW5mbyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvKipcbiAqIEBuYW1lIGlzRnVuY3Rpb25cbiAqIEBzdW1tYXJ5IFRlc3RzIGZvciBhIGBmdW5jdGlvbmAuXG4gKiBAZGVzY3JpcHRpb25cbiAqIENoZWNrcyB0byBzZWUgaWYgdGhlIGlucHV0IHZhbHVlIGlzIGEgSmF2YVNjcmlwdCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKiA8QlI+XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJ0Bwb2xrYWRvdC91dGlsJztcbiAqXG4gKiBpc0Z1bmN0aW9uKCgpID0+IGZhbHNlKTsgLy8gPT4gdHJ1ZVxuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cbiIsImV4cG9ydCBjb25zdCBwYWNrYWdlSW5mbyA9IHsgbmFtZTogJ0Bwb2xrYWRvdC9hcGktYXVnbWVudCcsIHBhdGg6IChpbXBvcnQubWV0YSAmJiBpbXBvcnQubWV0YS51cmwpID8gbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLnN1YnN0cmluZygwLCBuZXcgVVJMKGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUubGFzdEluZGV4T2YoJy8nKSArIDEpIDogJ2F1dG8nLCB0eXBlOiAnZXNtJywgdmVyc2lvbjogJzE2LjUuNicgfTtcbiIsImltcG9ydCB7IHBhY2thZ2VJbmZvIGFzIGJhc2VJbmZvIH0gZnJvbSAnQHBvbGthZG90L2FwaS1iYXNlL3BhY2thZ2VJbmZvJztcbmltcG9ydCB7IHBhY2thZ2VJbmZvIGFzIHR5cGVzSW5mbyB9IGZyb20gJ0Bwb2xrYWRvdC90eXBlcy9wYWNrYWdlSW5mbyc7XG5pbXBvcnQgeyBwYWNrYWdlSW5mbyBhcyBjb2RlY0luZm8gfSBmcm9tICdAcG9sa2Fkb3QvdHlwZXMtY29kZWMvcGFja2FnZUluZm8nO1xuaW1wb3J0IHsgZGV0ZWN0UGFja2FnZSB9IGZyb20gJ0Bwb2xrYWRvdC91dGlsJztcbmltcG9ydCB7IHBhY2thZ2VJbmZvIH0gZnJvbSAnLi9wYWNrYWdlSW5mby5qcyc7XG5kZXRlY3RQYWNrYWdlKHBhY2thZ2VJbmZvLCBudWxsLCBbYmFzZUluZm8sIGNvZGVjSW5mbywgdHlwZXNJbmZvXSk7XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cblxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSwgU3VwcHJlc3NlZEVycm9yLCBTeW1ib2wsIEl0ZXJhdG9yICovXG5cbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xuICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xuICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufVxuXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XG4gIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XG4gICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XG4gICAgICB9XG4gICAgICByZXR1cm4gdDtcbiAgfVxuICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XG4gIHZhciB0ID0ge307XG4gIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxuICAgICAgdFtwXSA9IHNbcF07XG4gIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXG4gICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xuICAgICAgfVxuICByZXR1cm4gdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcbiAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX19lc0RlY29yYXRlKGN0b3IsIGRlc2NyaXB0b3JJbiwgZGVjb3JhdG9ycywgY29udGV4dEluLCBpbml0aWFsaXplcnMsIGV4dHJhSW5pdGlhbGl6ZXJzKSB7XG4gIGZ1bmN0aW9uIGFjY2VwdChmKSB7IGlmIChmICE9PSB2b2lkIDAgJiYgdHlwZW9mIGYgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZ1bmN0aW9uIGV4cGVjdGVkXCIpOyByZXR1cm4gZjsgfVxuICB2YXIga2luZCA9IGNvbnRleHRJbi5raW5kLCBrZXkgPSBraW5kID09PSBcImdldHRlclwiID8gXCJnZXRcIiA6IGtpbmQgPT09IFwic2V0dGVyXCIgPyBcInNldFwiIDogXCJ2YWx1ZVwiO1xuICB2YXIgdGFyZ2V0ID0gIWRlc2NyaXB0b3JJbiAmJiBjdG9yID8gY29udGV4dEluW1wic3RhdGljXCJdID8gY3RvciA6IGN0b3IucHJvdG90eXBlIDogbnVsbDtcbiAgdmFyIGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9ySW4gfHwgKHRhcmdldCA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBjb250ZXh0SW4ubmFtZSkgOiB7fSk7XG4gIHZhciBfLCBkb25lID0gZmFsc2U7XG4gIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgY29udGV4dCA9IHt9O1xuICAgICAgZm9yICh2YXIgcCBpbiBjb250ZXh0SW4pIGNvbnRleHRbcF0gPSBwID09PSBcImFjY2Vzc1wiID8ge30gOiBjb250ZXh0SW5bcF07XG4gICAgICBmb3IgKHZhciBwIGluIGNvbnRleHRJbi5hY2Nlc3MpIGNvbnRleHQuYWNjZXNzW3BdID0gY29udGV4dEluLmFjY2Vzc1twXTtcbiAgICAgIGNvbnRleHQuYWRkSW5pdGlhbGl6ZXIgPSBmdW5jdGlvbiAoZikgeyBpZiAoZG9uZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBhZGQgaW5pdGlhbGl6ZXJzIGFmdGVyIGRlY29yYXRpb24gaGFzIGNvbXBsZXRlZFwiKTsgZXh0cmFJbml0aWFsaXplcnMucHVzaChhY2NlcHQoZiB8fCBudWxsKSk7IH07XG4gICAgICB2YXIgcmVzdWx0ID0gKDAsIGRlY29yYXRvcnNbaV0pKGtpbmQgPT09IFwiYWNjZXNzb3JcIiA/IHsgZ2V0OiBkZXNjcmlwdG9yLmdldCwgc2V0OiBkZXNjcmlwdG9yLnNldCB9IDogZGVzY3JpcHRvcltrZXldLCBjb250ZXh0KTtcbiAgICAgIGlmIChraW5kID09PSBcImFjY2Vzc29yXCIpIHtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSB2b2lkIDApIGNvbnRpbnVlO1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwgfHwgdHlwZW9mIHJlc3VsdCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBleHBlY3RlZFwiKTtcbiAgICAgICAgICBpZiAoXyA9IGFjY2VwdChyZXN1bHQuZ2V0KSkgZGVzY3JpcHRvci5nZXQgPSBfO1xuICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5zZXQpKSBkZXNjcmlwdG9yLnNldCA9IF87XG4gICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LmluaXQpKSBpbml0aWFsaXplcnMudW5zaGlmdChfKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKF8gPSBhY2NlcHQocmVzdWx0KSkge1xuICAgICAgICAgIGlmIChraW5kID09PSBcImZpZWxkXCIpIGluaXRpYWxpemVycy51bnNoaWZ0KF8pO1xuICAgICAgICAgIGVsc2UgZGVzY3JpcHRvcltrZXldID0gXztcbiAgICAgIH1cbiAgfVxuICBpZiAodGFyZ2V0KSBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBjb250ZXh0SW4ubmFtZSwgZGVzY3JpcHRvcik7XG4gIGRvbmUgPSB0cnVlO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fcnVuSW5pdGlhbGl6ZXJzKHRoaXNBcmcsIGluaXRpYWxpemVycywgdmFsdWUpIHtcbiAgdmFyIHVzZVZhbHVlID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaW5pdGlhbGl6ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWx1ZSA9IHVzZVZhbHVlID8gaW5pdGlhbGl6ZXJzW2ldLmNhbGwodGhpc0FyZywgdmFsdWUpIDogaW5pdGlhbGl6ZXJzW2ldLmNhbGwodGhpc0FyZyk7XG4gIH1cbiAgcmV0dXJuIHVzZVZhbHVlID8gdmFsdWUgOiB2b2lkIDA7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX19wcm9wS2V5KHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSBcInN5bWJvbFwiID8geCA6IFwiXCIuY29uY2F0KHgpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fc2V0RnVuY3Rpb25OYW1lKGYsIG5hbWUsIHByZWZpeCkge1xuICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3ltYm9sXCIpIG5hbWUgPSBuYW1lLmRlc2NyaXB0aW9uID8gXCJbXCIuY29uY2F0KG5hbWUuZGVzY3JpcHRpb24sIFwiXVwiKSA6IFwiXCI7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZiwgXCJuYW1lXCIsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogcHJlZml4ID8gXCJcIi5jb25jYXQocHJlZml4LCBcIiBcIiwgbmFtZSkgOiBuYW1lIH0pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcbiAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZyA9IE9iamVjdC5jcmVhdGUoKHR5cGVvZiBJdGVyYXRvciA9PT0gXCJmdW5jdGlvblwiID8gSXRlcmF0b3IgOiBPYmplY3QpLnByb3RvdHlwZSk7XG4gIHJldHVybiBnLm5leHQgPSB2ZXJiKDApLCBnW1widGhyb3dcIl0gPSB2ZXJiKDEpLCBnW1wicmV0dXJuXCJdID0gdmVyYigyKSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICB9XG59XG5cbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICBvW2syXSA9IG1ba107XG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XG4gIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcbiAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcbiAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XG4gIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcbiAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xuICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcbiAgICAgIH1cbiAgfTtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcbiAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xuICBpZiAoIW0pIHJldHVybiBvO1xuICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcbiAgdHJ5IHtcbiAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xuICB9XG4gIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxuICBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XG4gICAgICB9XG4gICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cbiAgfVxuICByZXR1cm4gYXI7XG59XG5cbi8qKiBAZGVwcmVjYXRlZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xuICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcbiAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcbiAgcmV0dXJuIGFyO1xufVxuXG4vKiogQGRlcHJlY2F0ZWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcbiAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XG4gIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcbiAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxuICAgICAgICAgIHJba10gPSBhW2pdO1xuICByZXR1cm4gcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcbiAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgIH1cbiAgfVxuICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xuICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XG4gIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XG4gIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XG4gIHJldHVybiBpID0gT2JqZWN0LmNyZWF0ZSgodHlwZW9mIEFzeW5jSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEFzeW5jSXRlcmF0b3IgOiBPYmplY3QpLnByb3RvdHlwZSksIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiwgYXdhaXRSZXR1cm4pLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XG4gIGZ1bmN0aW9uIGF3YWl0UmV0dXJuKGYpIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUodikudGhlbihmLCByZWplY3QpOyB9OyB9XG4gIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpZiAoZ1tuXSkgeyBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyBpZiAoZikgaVtuXSA9IGYoaVtuXSk7IH0gfVxuICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XG4gIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxuICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XG4gIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cbiAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XG4gIHZhciBpLCBwO1xuICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xuICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBmYWxzZSB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XG4gIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XG4gIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XG4gIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcbiAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxuICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xuICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxuICByZXR1cm4gY29va2VkO1xufTtcblxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcbiAgb1tcImRlZmF1bHRcIl0gPSB2O1xufTtcblxudmFyIG93bktleXMgPSBmdW5jdGlvbihvKSB7XG4gIG93bktleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiAobykge1xuICAgIHZhciBhciA9IFtdO1xuICAgIGZvciAodmFyIGsgaW4gbykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBrKSkgYXJbYXIubGVuZ3RoXSA9IGs7XG4gICAgcmV0dXJuIGFyO1xuICB9O1xuICByZXR1cm4gb3duS2V5cyhvKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XG4gIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrID0gb3duS2V5cyhtb2QpLCBpID0gMDsgaSA8IGsubGVuZ3RoOyBpKyspIGlmIChrW2ldICE9PSBcImRlZmF1bHRcIikgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrW2ldKTtcbiAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcbiAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XG4gIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcbiAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XG4gIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcbiAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xuICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XG4gIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XG4gIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEluKHN0YXRlLCByZWNlaXZlcikge1xuICBpZiAocmVjZWl2ZXIgPT09IG51bGwgfHwgKHR5cGVvZiByZWNlaXZlciAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgcmVjZWl2ZXIgIT09IFwiZnVuY3Rpb25cIikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgdXNlICdpbicgb3BlcmF0b3Igb24gbm9uLW9iamVjdFwiKTtcbiAgcmV0dXJuIHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgPT09IHN0YXRlIDogc3RhdGUuaGFzKHJlY2VpdmVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYWRkRGlzcG9zYWJsZVJlc291cmNlKGVudiwgdmFsdWUsIGFzeW5jKSB7XG4gIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdm9pZCAwKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBleHBlY3RlZC5cIik7XG4gICAgdmFyIGRpc3Bvc2UsIGlubmVyO1xuICAgIGlmIChhc3luYykge1xuICAgICAgaWYgKCFTeW1ib2wuYXN5bmNEaXNwb3NlKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jRGlzcG9zZSBpcyBub3QgZGVmaW5lZC5cIik7XG4gICAgICBkaXNwb3NlID0gdmFsdWVbU3ltYm9sLmFzeW5jRGlzcG9zZV07XG4gICAgfVxuICAgIGlmIChkaXNwb3NlID09PSB2b2lkIDApIHtcbiAgICAgIGlmICghU3ltYm9sLmRpc3Bvc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuZGlzcG9zZSBpcyBub3QgZGVmaW5lZC5cIik7XG4gICAgICBkaXNwb3NlID0gdmFsdWVbU3ltYm9sLmRpc3Bvc2VdO1xuICAgICAgaWYgKGFzeW5jKSBpbm5lciA9IGRpc3Bvc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZGlzcG9zZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IG5vdCBkaXNwb3NhYmxlLlwiKTtcbiAgICBpZiAoaW5uZXIpIGRpc3Bvc2UgPSBmdW5jdGlvbigpIHsgdHJ5IHsgaW5uZXIuY2FsbCh0aGlzKTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7IH0gfTtcbiAgICBlbnYuc3RhY2sucHVzaCh7IHZhbHVlOiB2YWx1ZSwgZGlzcG9zZTogZGlzcG9zZSwgYXN5bmM6IGFzeW5jIH0pO1xuICB9XG4gIGVsc2UgaWYgKGFzeW5jKSB7XG4gICAgZW52LnN0YWNrLnB1c2goeyBhc3luYzogdHJ1ZSB9KTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbnZhciBfU3VwcHJlc3NlZEVycm9yID0gdHlwZW9mIFN1cHByZXNzZWRFcnJvciA9PT0gXCJmdW5jdGlvblwiID8gU3VwcHJlc3NlZEVycm9yIDogZnVuY3Rpb24gKGVycm9yLCBzdXBwcmVzc2VkLCBtZXNzYWdlKSB7XG4gIHZhciBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICByZXR1cm4gZS5uYW1lID0gXCJTdXBwcmVzc2VkRXJyb3JcIiwgZS5lcnJvciA9IGVycm9yLCBlLnN1cHByZXNzZWQgPSBzdXBwcmVzc2VkLCBlO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fZGlzcG9zZVJlc291cmNlcyhlbnYpIHtcbiAgZnVuY3Rpb24gZmFpbChlKSB7XG4gICAgZW52LmVycm9yID0gZW52Lmhhc0Vycm9yID8gbmV3IF9TdXBwcmVzc2VkRXJyb3IoZSwgZW52LmVycm9yLCBcIkFuIGVycm9yIHdhcyBzdXBwcmVzc2VkIGR1cmluZyBkaXNwb3NhbC5cIikgOiBlO1xuICAgIGVudi5oYXNFcnJvciA9IHRydWU7XG4gIH1cbiAgdmFyIHIsIHMgPSAwO1xuICBmdW5jdGlvbiBuZXh0KCkge1xuICAgIHdoaWxlIChyID0gZW52LnN0YWNrLnBvcCgpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIXIuYXN5bmMgJiYgcyA9PT0gMSkgcmV0dXJuIHMgPSAwLCBlbnYuc3RhY2sucHVzaChyKSwgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihuZXh0KTtcbiAgICAgICAgaWYgKHIuZGlzcG9zZSkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSByLmRpc3Bvc2UuY2FsbChyLnZhbHVlKTtcbiAgICAgICAgICBpZiAoci5hc3luYykgcmV0dXJuIHMgfD0gMiwgUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCkudGhlbihuZXh0LCBmdW5jdGlvbihlKSB7IGZhaWwoZSk7IHJldHVybiBuZXh0KCk7IH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgcyB8PSAxO1xuICAgICAgfVxuICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgZmFpbChlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHMgPT09IDEpIHJldHVybiBlbnYuaGFzRXJyb3IgPyBQcm9taXNlLnJlamVjdChlbnYuZXJyb3IpIDogUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgaWYgKGVudi5oYXNFcnJvcikgdGhyb3cgZW52LmVycm9yO1xuICB9XG4gIHJldHVybiBuZXh0KCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3Jld3JpdGVSZWxhdGl2ZUltcG9ydEV4dGVuc2lvbihwYXRoLCBwcmVzZXJ2ZUpzeCkge1xuICBpZiAodHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIgJiYgL15cXC5cXC4/XFwvLy50ZXN0KHBhdGgpKSB7XG4gICAgICByZXR1cm4gcGF0aC5yZXBsYWNlKC9cXC4odHN4KSR8KCg/OlxcLmQpPykoKD86XFwuW14uL10rPyk/KVxcLihbY21dPyl0cyQvaSwgZnVuY3Rpb24gKG0sIHRzeCwgZCwgZXh0LCBjbSkge1xuICAgICAgICAgIHJldHVybiB0c3ggPyBwcmVzZXJ2ZUpzeCA/IFwiLmpzeFwiIDogXCIuanNcIiA6IGQgJiYgKCFleHQgfHwgIWNtKSA/IG0gOiAoZCArIGV4dCArIFwiLlwiICsgY20udG9Mb3dlckNhc2UoKSArIFwianNcIik7XG4gICAgICB9KTtcbiAgfVxuICByZXR1cm4gcGF0aDtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBfX2V4dGVuZHMsXG4gIF9fYXNzaWduLFxuICBfX3Jlc3QsXG4gIF9fZGVjb3JhdGUsXG4gIF9fcGFyYW0sXG4gIF9fZXNEZWNvcmF0ZSxcbiAgX19ydW5Jbml0aWFsaXplcnMsXG4gIF9fcHJvcEtleSxcbiAgX19zZXRGdW5jdGlvbk5hbWUsXG4gIF9fbWV0YWRhdGEsXG4gIF9fYXdhaXRlcixcbiAgX19nZW5lcmF0b3IsXG4gIF9fY3JlYXRlQmluZGluZyxcbiAgX19leHBvcnRTdGFyLFxuICBfX3ZhbHVlcyxcbiAgX19yZWFkLFxuICBfX3NwcmVhZCxcbiAgX19zcHJlYWRBcnJheXMsXG4gIF9fc3ByZWFkQXJyYXksXG4gIF9fYXdhaXQsXG4gIF9fYXN5bmNHZW5lcmF0b3IsXG4gIF9fYXN5bmNEZWxlZ2F0b3IsXG4gIF9fYXN5bmNWYWx1ZXMsXG4gIF9fbWFrZVRlbXBsYXRlT2JqZWN0LFxuICBfX2ltcG9ydFN0YXIsXG4gIF9faW1wb3J0RGVmYXVsdCxcbiAgX19jbGFzc1ByaXZhdGVGaWVsZEdldCxcbiAgX19jbGFzc1ByaXZhdGVGaWVsZFNldCxcbiAgX19jbGFzc1ByaXZhdGVGaWVsZEluLFxuICBfX2FkZERpc3Bvc2FibGVSZXNvdXJjZSxcbiAgX19kaXNwb3NlUmVzb3VyY2VzLFxuICBfX3Jld3JpdGVSZWxhdGl2ZUltcG9ydEV4dGVuc2lvbixcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBFbnRyeS1wb2ludCBmb3IgU3ViUXVlcnkgbWFwcGluZyBoYW5kbGVycy5cbiAqXG4gKiBSZS1leHBvcnRzIGV2ZXJ5IGhhbmRsZXIgc28gdGhlIFN1YlF1ZXJ5IG5vZGUgY2FuIHJlc29sdmUgdGhlbSBmcm9tXG4gKiBhIHNpbmdsZSBgLi9kaXN0L2luZGV4LmpzYCBidW5kbGUgcGF0aC5cbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5oYW5kbGVUcmVhc3VyeUF3YXJkZWQgPSBleHBvcnRzLmhhbmRsZVRyZWFzdXJ5UmVqZWN0ZWQgPSBleHBvcnRzLmhhbmRsZVRyZWFzdXJ5QXBwcm92ZWQgPSBleHBvcnRzLmhhbmRsZVRyZWFzdXJ5UHJvcG9zZWQgPSBleHBvcnRzLmhhbmRsZVByZWltYWdlQ2xlYXJlZCA9IGV4cG9ydHMuaGFuZGxlUHJlaW1hZ2VSZXF1ZXN0ZWQgPSBleHBvcnRzLmhhbmRsZVByZWltYWdlTm90ZWQgPSBleHBvcnRzLmhhbmRsZVVuZGVsZWdhdGVkID0gZXhwb3J0cy5oYW5kbGVEZWxlZ2F0ZWQgPSBleHBvcnRzLmhhbmRsZVZvdGVSZW1vdmVkID0gZXhwb3J0cy5oYW5kbGVWb3RlQ2FzdCA9IGV4cG9ydHMuaGFuZGxlUmVmZXJlbmR1bUtpbGxlZCA9IGV4cG9ydHMuaGFuZGxlUmVmZXJlbmR1bVRpbWVkT3V0ID0gZXhwb3J0cy5oYW5kbGVSZWZlcmVuZHVtQ2FuY2VsbGVkID0gZXhwb3J0cy5oYW5kbGVSZWZlcmVuZHVtUmVqZWN0ZWQgPSBleHBvcnRzLmhhbmRsZVJlZmVyZW5kdW1BcHByb3ZlZCA9IGV4cG9ydHMuaGFuZGxlUmVmZXJlbmR1bUNvbmZpcm1BYm9ydGVkID0gZXhwb3J0cy5oYW5kbGVSZWZlcmVuZHVtQ29uZmlybVN0YXJ0ZWQgPSBleHBvcnRzLmhhbmRsZVJlZmVyZW5kdW1EZWNpc2lvblN0YXJ0ZWQgPSBleHBvcnRzLmhhbmRsZVJlZmVyZW5kdW1TdWJtaXR0ZWQgPSBleHBvcnRzLmhhbmRsZUJsb2NrID0gdm9pZCAwO1xudmFyIGJsb2NrXzEgPSByZXF1aXJlKFwiLi9tYXBwaW5ncy9ibG9ja1wiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUJsb2NrXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBibG9ja18xLmhhbmRsZUJsb2NrOyB9IH0pO1xudmFyIHJlZmVyZW5kYV8xID0gcmVxdWlyZShcIi4vbWFwcGluZ3MvcmVmZXJlbmRhXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlUmVmZXJlbmR1bVN1Ym1pdHRlZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVmZXJlbmRhXzEuaGFuZGxlUmVmZXJlbmR1bVN1Ym1pdHRlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVJlZmVyZW5kdW1EZWNpc2lvblN0YXJ0ZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlZmVyZW5kYV8xLmhhbmRsZVJlZmVyZW5kdW1EZWNpc2lvblN0YXJ0ZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVSZWZlcmVuZHVtQ29uZmlybVN0YXJ0ZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlZmVyZW5kYV8xLmhhbmRsZVJlZmVyZW5kdW1Db25maXJtU3RhcnRlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVJlZmVyZW5kdW1Db25maXJtQWJvcnRlZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVmZXJlbmRhXzEuaGFuZGxlUmVmZXJlbmR1bUNvbmZpcm1BYm9ydGVkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlUmVmZXJlbmR1bUFwcHJvdmVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiByZWZlcmVuZGFfMS5oYW5kbGVSZWZlcmVuZHVtQXBwcm92ZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVSZWZlcmVuZHVtUmVqZWN0ZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlZmVyZW5kYV8xLmhhbmRsZVJlZmVyZW5kdW1SZWplY3RlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVJlZmVyZW5kdW1DYW5jZWxsZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlZmVyZW5kYV8xLmhhbmRsZVJlZmVyZW5kdW1DYW5jZWxsZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVSZWZlcmVuZHVtVGltZWRPdXRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlZmVyZW5kYV8xLmhhbmRsZVJlZmVyZW5kdW1UaW1lZE91dDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVJlZmVyZW5kdW1LaWxsZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlZmVyZW5kYV8xLmhhbmRsZVJlZmVyZW5kdW1LaWxsZWQ7IH0gfSk7XG52YXIgY29udmljdGlvblZvdGluZ18xID0gcmVxdWlyZShcIi4vbWFwcGluZ3MvY29udmljdGlvblZvdGluZ1wiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVZvdGVDYXN0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBjb252aWN0aW9uVm90aW5nXzEuaGFuZGxlVm90ZUNhc3Q7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVWb3RlUmVtb3ZlZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gY29udmljdGlvblZvdGluZ18xLmhhbmRsZVZvdGVSZW1vdmVkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlRGVsZWdhdGVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBjb252aWN0aW9uVm90aW5nXzEuaGFuZGxlRGVsZWdhdGVkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlVW5kZWxlZ2F0ZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvbnZpY3Rpb25Wb3RpbmdfMS5oYW5kbGVVbmRlbGVnYXRlZDsgfSB9KTtcbnZhciBwcmVpbWFnZV8xID0gcmVxdWlyZShcIi4vbWFwcGluZ3MvcHJlaW1hZ2VcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVQcmVpbWFnZU5vdGVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwcmVpbWFnZV8xLmhhbmRsZVByZWltYWdlTm90ZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVQcmVpbWFnZVJlcXVlc3RlZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcHJlaW1hZ2VfMS5oYW5kbGVQcmVpbWFnZVJlcXVlc3RlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVByZWltYWdlQ2xlYXJlZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcHJlaW1hZ2VfMS5oYW5kbGVQcmVpbWFnZUNsZWFyZWQ7IH0gfSk7XG52YXIgdHJlYXN1cnlfMSA9IHJlcXVpcmUoXCIuL21hcHBpbmdzL3RyZWFzdXJ5XCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlVHJlYXN1cnlQcm9wb3NlZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJlYXN1cnlfMS5oYW5kbGVUcmVhc3VyeVByb3Bvc2VkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlVHJlYXN1cnlBcHByb3ZlZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJlYXN1cnlfMS5oYW5kbGVUcmVhc3VyeUFwcHJvdmVkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlVHJlYXN1cnlSZWplY3RlZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJlYXN1cnlfMS5oYW5kbGVUcmVhc3VyeVJlamVjdGVkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlVHJlYXN1cnlBd2FyZGVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0cmVhc3VyeV8xLmhhbmRsZVRyZWFzdXJ5QXdhcmRlZDsgfSB9KTtcbnJlcXVpcmUoXCJAcG9sa2Fkb3QvYXBpLWF1Z21lbnRcIik7XG4iXSwibmFtZXMiOlsiX2EiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsImhhbmRsZUJsb2NrIiwiR292ZXJuYW5jZUNoZWNrcG9pbnRfMSIsIkNIQUlOX0lEIiwicHJvY2VzcyIsImVudiIsImFzeW5jIiwiYmxvY2siLCJfYiIsImJsb2NrTnVtYmVyIiwiQmlnSW50IiwiaGVhZGVyIiwibnVtYmVyIiwidG9TdHJpbmciLCJibG9ja0hhc2giLCJoYXNoIiwidG9IZXgiLCJjaGVja3BvaW50IiwiR292ZXJuYW5jZUNoZWNrcG9pbnQiLCJnZXQiLCJ1cGRhdGVkQXQiLCJ0aW1lc3RhbXAiLCJEYXRlIiwiY3JlYXRlIiwiaWQiLCJzYXZlIiwiaGFuZGxlVW5kZWxlZ2F0ZWQiLCJoYW5kbGVEZWxlZ2F0ZWQiLCJoYW5kbGVWb3RlUmVtb3ZlZCIsImhhbmRsZVZvdGVDYXN0IiwiR292ZXJuYW5jZVZvdGVfMSIsIkdvdmVybmFuY2VEZWxlZ2F0aW9uXzEiLCJ1dGlsc18xIiwiZ2V0VmFyaWFudCIsInJlY29yZCIsImtleSIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJldmVudCIsIl9jIiwiX2QiLCJfZSIsIl9mIiwiZGF0YSIsImV4dHJpbnNpYyIsInZvdGVyIiwidm90ZVJhdyIsInRvSlNPTiIsImluZGV4IiwidG9OdW1iZXIiLCJzdGFuY2UiLCJjb252aWN0aW9uIiwiYmFsYW5jZSIsInN0YW5kYXJkIiwic3BsaXRBYnN0YWluIiwic3BsaXQiLCJzdGQiLCJ2b3RlIiwiYXllIiwiTnVtYmVyIiwicmVwbGFjZSIsImFic3RhaW4iLCJzcCIsIm5heSIsInZvdGVJZCIsIkdvdmVybmFuY2VWb3RlIiwiaXNSZW1vdmVkIiwiY2hhaW5JZCIsInJlZmVyZW5kdW1JbmRleCIsInN1YmplY3RJZCIsImV4dHJpbnNpY0luZGV4IiwiaWR4IiwidW5kZWZpbmVkIiwiZGVsZWdhdG9yIiwiZGVsZWdhdGVlIiwiZGVsZWdhdGlvbklkIiwiZGVsZWdhdGlvbiIsIkdvdmVybmFuY2VEZWxlZ2F0aW9uIiwiaXNBY3RpdmUiLCJ0cmFjayIsImhhbmRsZVByZWltYWdlQ2xlYXJlZCIsImhhbmRsZVByZWltYWdlUmVxdWVzdGVkIiwiaGFuZGxlUHJlaW1hZ2VOb3RlZCIsIlByZWltYWdlXzEiLCJwcmVpbWFnZSIsIlByZWltYWdlIiwic3RhdHVzIiwibGVuIiwiaGFuZGxlUmVmZXJlbmR1bUtpbGxlZCIsImhhbmRsZVJlZmVyZW5kdW1UaW1lZE91dCIsImhhbmRsZVJlZmVyZW5kdW1DYW5jZWxsZWQiLCJoYW5kbGVSZWZlcmVuZHVtUmVqZWN0ZWQiLCJoYW5kbGVSZWZlcmVuZHVtQXBwcm92ZWQiLCJoYW5kbGVSZWZlcmVuZHVtQ29uZmlybUFib3J0ZWQiLCJoYW5kbGVSZWZlcmVuZHVtQ29uZmlybVN0YXJ0ZWQiLCJoYW5kbGVSZWZlcmVuZHVtRGVjaXNpb25TdGFydGVkIiwiaGFuZGxlUmVmZXJlbmR1bVN1Ym1pdHRlZCIsIkdvdmVybmFuY2VTdWJqZWN0XzEiLCJnZXRPckNyZWF0ZSIsInN1YmplY3QiLCJHb3Zlcm5hbmNlU3ViamVjdCIsInN1Ym1pdHRlZEF0IiwiYXllVm90ZXMiLCJuYXlWb3RlcyIsImFic3RhaW5Wb3RlcyIsInByb3Bvc2FsRGF0YSIsInByb3Bvc2FsSGFzaCIsInRhbGx5UmF3IiwiZGVjaWRpbmdTaW5jZSIsImF5ZXMiLCJuYXlzIiwiY29uZmlybWluZ1NpbmNlIiwiZGVjaWRlZEF0IiwiaGFuZGxlVHJlYXN1cnlBd2FyZGVkIiwiaGFuZGxlVHJlYXN1cnlSZWplY3RlZCIsImhhbmRsZVRyZWFzdXJ5QXBwcm92ZWQiLCJoYW5kbGVUcmVhc3VyeVByb3Bvc2VkIiwiVHJlYXN1cnlQcm9wb3NhbF8xIiwidHJlYXN1cnlJZCIsInByb3Bvc2FsSW5kZXgiLCJwcm9wb3NhbCIsIlRyZWFzdXJ5UHJvcG9zYWwiLCJwcm9wb3NlciIsImJlbmVmaWNpYXJ5IiwiYm9uZCIsImFzc2VydF8xIiwiX19pbXBvcnREZWZhdWx0IiwiY29uc3RydWN0b3IiLCJ0aGlzIiwiX25hbWUiLCJkZWZhdWx0Iiwic3RvcmUiLCJzZXQiLCJyZW1vdmUiLCJnZXRCeUZpZWxkcyIsImZpbHRlciIsIm9wdGlvbnMiLCJtYXAiLCJlbnRpdHkiLCJhc3NpZ24iLCJnZXRCeVN1YmplY3RJZCIsImdldEJ5RmllbGQiLCJtb2R1bGUiLCJyZXF1aXJlIiwicGFja2FnZUluZm8iLCJuYW1lIiwicGF0aCIsIlVSTCIsInBhdGhuYW1lIiwic3Vic3RyaW5nIiwibGFzdEluZGV4T2YiLCJ0eXBlIiwidmVyc2lvbiIsInhnbG9iYWwiLCJnbG9iYWxUaGlzIiwiZ2xvYmFsIiwic2VsZiIsIndpbmRvdyIsIkZ1bmN0aW9uIiwiZm9ybWF0SW5mbyIsImZvcm1hdFZlcnNpb24iLCJleHRyYWN0ZWQiLCJsZW5ndGgiLCJubUluZGV4IiwiaW5kZXhPZiIsInBhZFN0YXJ0IiwiZ2V0UGF0aCIsImluZm9QYXRoIiwicGF0aE9yRm4iLCJ3YXJuIiwicHJlIiwiYWxsIiwiZm10IiwiY29uc29sZSIsIm1heCIsImkiLCJjb3VudCIsIk1hdGgiLCJkIiwicGFkRW5kIiwiam9pbiIsImZvcm1hdERpc3BsYXkiLCJkZXBzIiwic3RhcnRzV2l0aCIsIkVycm9yIiwiZW50cnkiLCJfZ2xvYmFsIiwiX19wb2xrYWRvdGpzIiwiZ2V0RW50cnkiLCJwdXNoIiwiZW50cmllc1NhbWVWZXJzaW9uIiwiZXZlcnkiLCJlIiwiZXNtQ2pzV2FybmluZ0Rpc2FibGVkIiwibWlzbWF0Y2hlcyIsImRldGVjdFBhY2thZ2UiLCJleHRlbmRTdGF0aWNzIiwiYiIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwiQXJyYXkiLCJwIiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiX19leHRlbmRzIiwiVHlwZUVycm9yIiwiU3RyaW5nIiwiX18iLCJfX2Fzc2lnbiIsInQiLCJzIiwibiIsImFyZ3VtZW50cyIsImFwcGx5IiwiX19yZXN0IiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImRlc2MiLCJjIiwiciIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsIlJlZmxlY3QiLCJkZWNvcmF0ZSIsIl9fcGFyYW0iLCJwYXJhbUluZGV4IiwiZGVjb3JhdG9yIiwiX19lc0RlY29yYXRlIiwiY3RvciIsImRlc2NyaXB0b3JJbiIsImNvbnRleHRJbiIsImluaXRpYWxpemVycyIsImV4dHJhSW5pdGlhbGl6ZXJzIiwiYWNjZXB0IiwiZiIsIl8iLCJraW5kIiwiZGVzY3JpcHRvciIsImRvbmUiLCJjb250ZXh0IiwiYWNjZXNzIiwiYWRkSW5pdGlhbGl6ZXIiLCJyZXN1bHQiLCJpbml0IiwidW5zaGlmdCIsIl9fcnVuSW5pdGlhbGl6ZXJzIiwidGhpc0FyZyIsInVzZVZhbHVlIiwiX19wcm9wS2V5IiwieCIsImNvbmNhdCIsIl9fc2V0RnVuY3Rpb25OYW1lIiwicHJlZml4IiwiZGVzY3JpcHRpb24iLCJjb25maWd1cmFibGUiLCJfX21ldGFkYXRhIiwibWV0YWRhdGFLZXkiLCJtZXRhZGF0YVZhbHVlIiwibWV0YWRhdGEiLCJfX2F3YWl0ZXIiLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZnVsZmlsbGVkIiwic3RlcCIsIm5leHQiLCJyZWplY3RlZCIsInRoZW4iLCJfX2dlbmVyYXRvciIsImJvZHkiLCJ5IiwibGFiZWwiLCJzZW50IiwidHJ5cyIsIm9wcyIsImciLCJJdGVyYXRvciIsInZlcmIiLCJTeW1ib2wiLCJpdGVyYXRvciIsInYiLCJvcCIsInBvcCIsIl9fY3JlYXRlQmluZGluZyIsIm8iLCJtIiwiayIsImsyIiwiX19lc01vZHVsZSIsIndyaXRhYmxlIiwiZW51bWVyYWJsZSIsIl9fZXhwb3J0U3RhciIsIl9fdmFsdWVzIiwiX19yZWFkIiwiYXIiLCJlcnJvciIsIl9fc3ByZWFkIiwiX19zcHJlYWRBcnJheXMiLCJpbCIsImEiLCJqIiwiamwiLCJfX3NwcmVhZEFycmF5IiwidG8iLCJmcm9tIiwicGFjayIsImwiLCJfX2F3YWl0IiwiX19hc3luY0dlbmVyYXRvciIsImFzeW5jSXRlcmF0b3IiLCJxIiwiQXN5bmNJdGVyYXRvciIsInJlc3VtZSIsImZ1bGZpbGwiLCJzZXR0bGUiLCJzaGlmdCIsIl9fYXN5bmNEZWxlZ2F0b3IiLCJfX2FzeW5jVmFsdWVzIiwiX19tYWtlVGVtcGxhdGVPYmplY3QiLCJjb29rZWQiLCJyYXciLCJfX3NldE1vZHVsZURlZmF1bHQiLCJvd25LZXlzIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsIl9faW1wb3J0U3RhciIsIm1vZCIsIl9fY2xhc3NQcml2YXRlRmllbGRHZXQiLCJyZWNlaXZlciIsInN0YXRlIiwiaGFzIiwiX19jbGFzc1ByaXZhdGVGaWVsZFNldCIsIl9fY2xhc3NQcml2YXRlRmllbGRJbiIsIl9fYWRkRGlzcG9zYWJsZVJlc291cmNlIiwiZGlzcG9zZSIsImlubmVyIiwiYXN5bmNEaXNwb3NlIiwic3RhY2siLCJfU3VwcHJlc3NlZEVycm9yIiwiU3VwcHJlc3NlZEVycm9yIiwic3VwcHJlc3NlZCIsIm1lc3NhZ2UiLCJfX2Rpc3Bvc2VSZXNvdXJjZXMiLCJmYWlsIiwiaGFzRXJyb3IiLCJfX3Jld3JpdGVSZWxhdGl2ZUltcG9ydEV4dGVuc2lvbiIsInByZXNlcnZlSnN4IiwidGVzdCIsInRzeCIsImV4dCIsImNtIiwidG9Mb3dlckNhc2UiLCJfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18iLCJfX3dlYnBhY2tfcmVxdWlyZV9fIiwibW9kdWxlSWQiLCJjYWNoZWRNb2R1bGUiLCJfX3dlYnBhY2tfbW9kdWxlc19fIiwiZGVmaW5pdGlvbiIsIm9iaiIsInByb3AiLCJ0b1N0cmluZ1RhZyIsImJsb2NrXzEiLCJyZWZlcmVuZGFfMSIsImNvbnZpY3Rpb25Wb3RpbmdfMSIsInByZWltYWdlXzEiLCJ0cmVhc3VyeV8xIl0sInNvdXJjZVJvb3QiOiIifQ==