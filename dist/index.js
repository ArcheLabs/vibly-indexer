(() => {
    "use strict";
    var e = {
        473(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handleAgentRewardClaimed = t.handleTaskRewardSettled = t.handleReviewerRoundSettled = t.handleObserverRoundSettled = t.handleBaseStakingDaySettled = t.handleAgentRewardCredited = void 0;
            const a = n(127), i = n(442), r = n(785), o = n(753), d = n(808), s = n(739);
            function l(e) {
                return e.toString();
            }
            function c(e) {
                return Number(l(e));
            }
            function u(e) {
                return BigInt(l(e));
            }
            function y(e) {
                return BigInt(e.block.header.number.toString());
            }
            function v(e) {
                var t;
                return e.extrinsic && null !== (t = e.extrinsic.idx) && void 0 !== t ? t : void 0;
            }
            function h() {
                return {
                    claimableTotal: BigInt(0),
                    claimedTotal: BigInt(0),
                    claimableBase: BigInt(0),
                    claimableObserver: BigInt(0),
                    claimableReviewer: BigInt(0),
                    claimableTask: BigInt(0),
                    claimedBase: BigInt(0),
                    claimedObserver: BigInt(0),
                    claimedReviewer: BigInt(0),
                    claimedTask: BigInt(0)
                };
            }
            async function f(e, t) {
                try {
                    const f = (await api.query.agentIncentives.agentRewardLedgers([ e, t ])).toJSON();
                    return (n = f) ? {
                        claimableTotal: u(null !== (a = n.claimableTotal) && void 0 !== a ? a : 0),
                        claimedTotal: u(null !== (i = n.claimedTotal) && void 0 !== i ? i : 0),
                        claimableBase: u(null !== (r = n.claimableBase) && void 0 !== r ? r : 0),
                        claimableObserver: u(null !== (o = n.claimableObserver) && void 0 !== o ? o : 0),
                        claimableReviewer: u(null !== (d = n.claimableReviewer) && void 0 !== d ? d : 0),
                        claimableTask: u(null !== (s = n.claimableTask) && void 0 !== s ? s : 0),
                        claimedBase: u(null !== (l = n.claimedBase) && void 0 !== l ? l : 0),
                        claimedObserver: u(null !== (c = n.claimedObserver) && void 0 !== c ? c : 0),
                        claimedReviewer: u(null !== (y = n.claimedReviewer) && void 0 !== y ? y : 0),
                        claimedTask: u(null !== (v = n.claimedTask) && void 0 !== v ? v : 0)
                    } : h();
                } catch (n) {
                    return console.warn(`agentIncentives ledger storage read failed for ${e}/${t}: ${n instanceof Error ? n.message : String(n)}`), 
                    h();
                }
                var n, a, i, r, o, d, s, l, c, y, v;
            }
            async function g(e, t, n, a) {
                const r = (0, s.agentRewardLedgerEntityId)(t, n), o = i.AgentRewardLedger.create(Object.assign(Object.assign({
                    id: r,
                    chainId: s.CHAIN_ID,
                    identityId: t,
                    agentId: n
                }, a), {
                    updatedAtBlock: y(e.block)
                }));
                await o.save();
            }
            async function m(e, t) {
                var n, a, i, o, d, l, c, v, h, f, g, m;
                try {
                    const p = (await api.query.agentIncentives.dailyEmissionStates(t)).toJSON();
                    if (!p) return;
                    const b = r.RewardDayState.create({
                        id: (0, s.rewardDayStateEntityId)(t),
                        chainId: s.CHAIN_ID,
                        dayIndex: t,
                        baseStakingBudget: u(null !== (n = p.baseStakingBudget) && void 0 !== n ? n : 0),
                        observerReviewerBudget: u(null !== (a = p.observerReviewerBudget) && void 0 !== a ? a : 0),
                        taskMarketBudget: u(null !== (i = p.taskMarketBudget) && void 0 !== i ? i : 0),
                        baseStakingReleased: u(null !== (o = p.baseStakingReleased) && void 0 !== o ? o : 0),
                        observerReviewerReleased: u(null !== (d = p.observerReviewerReleased) && void 0 !== d ? d : 0),
                        taskMarketReleased: u(null !== (l = p.taskMarketReleased) && void 0 !== l ? l : 0),
                        rolloverBaseStaking: u(null !== (c = p.rolloverBaseStaking) && void 0 !== c ? c : 0),
                        rolloverObserverReviewer: u(null !== (v = p.rolloverObserverReviewer) && void 0 !== v ? v : 0),
                        rolloverTaskMarket: u(null !== (h = p.rolloverTaskMarket) && void 0 !== h ? h : 0),
                        baseStakingSettled: Boolean(p.baseStakingSettled),
                        observerRoundsSettled: Number(null !== (f = p.observerRoundsSettled) && void 0 !== f ? f : 0),
                        reviewerRoundsSettled: Number(null !== (g = p.reviewerRoundsSettled) && void 0 !== g ? g : 0),
                        taskRewardsSettled: Number(null !== (m = p.taskRewardsSettled) && void 0 !== m ? m : 0),
                        updatedAtBlock: y(e.block)
                    });
                    await b.save();
                } catch (e) {
                    console.warn(`agentIncentives day storage read failed for day ${t}: ${e instanceof Error ? e.message : String(e)}`);
                }
            }
            async function p(e, t) {
                var n, i, r, o, d, l;
                const c = y(e.block), u = null !== (n = e.idx) && void 0 !== n ? n : 0, h = a.AgentRewardEvent.create({
                    id: (0, s.agentRewardEventEntityId)(t.identityId, t.agentId, c, u, t.eventType),
                    chainId: s.CHAIN_ID,
                    identityId: t.identityId,
                    agentId: t.agentId,
                    eventType: t.eventType,
                    rewardKind: t.rewardKind,
                    amount: t.amount,
                    baseAmount: null !== (i = t.baseAmount) && void 0 !== i ? i : BigInt(0),
                    observerAmount: null !== (r = t.observerAmount) && void 0 !== r ? r : BigInt(0),
                    reviewerAmount: null !== (o = t.reviewerAmount) && void 0 !== o ? o : BigInt(0),
                    taskAmount: null !== (d = t.taskAmount) && void 0 !== d ? d : BigInt(0),
                    dayIndex: t.dayIndex,
                    roundId: t.roundId,
                    taskId: t.taskId,
                    ownerAccount: t.ownerAccount,
                    blockNumber: c,
                    extrinsicIndex: v(e),
                    eventIndex: u,
                    blockHash: e.block.block.header.hash.toHex(),
                    timestamp: null !== (l = e.block.timestamp) && void 0 !== l ? l : void 0
                });
                await h.save();
            }
            async function b(e, t) {
                const {data: n} = e.event, a = l(n[0]), i = c(n[1]), r = c(n[2]), d = u(n[3]), v = u(n[4]), h = u(n[5]);
                await m(e, i);
                const f = o.RoundRewardSettlement.create({
                    id: (0, s.roundRewardSettlementEntityId)(t, a),
                    chainId: s.CHAIN_ID,
                    roundId: a,
                    role: t,
                    dayIndex: i,
                    participantCount: r,
                    totalEffectiveStake: d,
                    released: v,
                    rollover: h,
                    blockNumber: y(e.block)
                });
                await f.save();
            }
            t.handleAgentRewardCredited = async function(e) {
                const {data: t} = e.event, n = l(t[0]), a = l(t[1]), r = c(t[2]), o = function(e) {
                    var t, n, a, i;
                    const r = null !== (a = null === (n = (t = e).toJSON) || void 0 === n ? void 0 : n.call(t)) && void 0 !== a ? a : e;
                    if ("string" == typeof r) {
                        const e = r.toLowerCase();
                        return "observer" === e ? "Observer" : "reviewer" === e ? "Reviewer" : "task" === e ? "Task" : "Base";
                    }
                    if (r && "object" == typeof r) {
                        const e = null === (i = Object.keys(r)[0]) || void 0 === i ? void 0 : i.toLowerCase();
                        if ("observer" === e) return "Observer";
                        if ("reviewer" === e) return "Reviewer";
                        if ("task" === e) return "Task";
                    }
                    return "Base";
                }(t[3]), d = u(t[4]), y = await async function(e, t) {
                    const n = await i.AgentRewardLedger.get((0, s.agentRewardLedgerEntityId)(e, t));
                    return n ? {
                        claimableTotal: n.claimableTotal,
                        claimedTotal: n.claimedTotal,
                        claimableBase: n.claimableBase,
                        claimableObserver: n.claimableObserver,
                        claimableReviewer: n.claimableReviewer,
                        claimableTask: n.claimableTask,
                        claimedBase: n.claimedBase,
                        claimedObserver: n.claimedObserver,
                        claimedReviewer: n.claimedReviewer,
                        claimedTask: n.claimedTask
                    } : h();
                }(n, a);
                await g(e, n, a, function(e, t, n) {
                    const a = Object.assign(Object.assign({}, e), {
                        claimableTotal: e.claimableTotal + n
                    });
                    return "Base" === t && (a.claimableBase += n), "Observer" === t && (a.claimableObserver += n), 
                    "Reviewer" === t && (a.claimableReviewer += n), "Task" === t && (a.claimableTask += n), 
                    a;
                }(y, o, d)), await p(e, {
                    identityId: n,
                    agentId: a,
                    eventType: "AgentRewardCredited",
                    rewardKind: o,
                    amount: d,
                    baseAmount: "Base" === o ? d : void 0,
                    observerAmount: "Observer" === o ? d : void 0,
                    reviewerAmount: "Reviewer" === o ? d : void 0,
                    taskAmount: "Task" === o ? d : void 0,
                    dayIndex: r
                });
            }, t.handleBaseStakingDaySettled = async function(e) {
                const {data: t} = e.event, n = c(t[0]);
                await m(e, n);
            }, t.handleObserverRoundSettled = async function(e) {
                await b(e, "Observer");
            }, t.handleReviewerRoundSettled = async function(e) {
                await b(e, "Reviewer");
            }, t.handleTaskRewardSettled = async function(e) {
                var t, n, a;
                const {data: i} = e.event, r = l(i[0]), o = c(i[1]), v = l(i[2]), h = l(i[3]), f = null !== (a = null === (n = (t = i[4]).toJSON) || void 0 === n ? void 0 : n.call(t)) && void 0 !== a ? a : i[4], g = "string" == typeof f ? f : JSON.stringify(f), p = u(i[5]);
                await m(e, o);
                const b = d.TaskRewardSettlement.create({
                    id: (0, s.taskRewardSettlementEntityId)(r),
                    chainId: s.CHAIN_ID,
                    taskId: r,
                    identityId: v,
                    agentId: h,
                    difficulty: g,
                    amount: p,
                    dayIndex: o,
                    blockNumber: y(e.block)
                });
                await b.save();
            }, t.handleAgentRewardClaimed = async function(e) {
                const {data: t} = e.event, n = l(t[0]), a = l(t[1]), i = l(t[2]), r = u(t[3]), o = await f(n, a);
                await g(e, n, a, o), await p(e, {
                    identityId: n,
                    agentId: a,
                    eventType: "AgentRewardClaimed",
                    rewardKind: "Claim",
                    amount: r,
                    baseAmount: o.claimedBase,
                    observerAmount: o.claimedObserver,
                    reviewerAmount: o.claimedReviewer,
                    taskAmount: o.claimedTask,
                    ownerAccount: i
                });
            };
        },
        242(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handleAgentStakeReleased = t.handleAgentStakeReleaseCleared = t.handleAgentStakeReleaseBlocked = t.handleAgentStakeUnbondCancelled = t.handleAgentStakeUnbondRequested = t.handleAgentStakeBonded = void 0;
            const a = n(378), i = n(713), r = n(739);
            function o(e) {
                return e.toString();
            }
            function d(e) {
                return BigInt(e.block.header.number.toString());
            }
            function s(e) {
                var t;
                return e.extrinsic && null !== (t = e.extrinsic.idx) && void 0 !== t ? t : void 0;
            }
            async function l(e, t) {
                var n, i;
                const o = d(e.block), l = null !== (n = e.idx) && void 0 !== n ? n : 0, c = a.AgentStakeEvent.create({
                    id: (0, r.agentStakeEventEntityId)(t.identityId, t.agentId, o, l),
                    chainId: r.CHAIN_ID,
                    identityId: t.identityId,
                    agentId: t.agentId,
                    fundingAccount: t.fundingAccount,
                    eventType: t.eventType,
                    amount: t.amount,
                    activeAmount: t.activeAmount,
                    unlockAtBlock: t.unlockAtBlock,
                    reasonRef: t.reasonRef,
                    blockNumber: o,
                    extrinsicIndex: s(e),
                    eventIndex: l,
                    blockHash: e.block.block.header.hash.toHex(),
                    timestamp: null !== (i = e.block.timestamp) && void 0 !== i ? i : void 0
                });
                await c.save();
            }
            async function c(e, t) {
                var n, a, o, s, l, c, u, y, v, h;
                const f = (0, r.agentStakeLedgerEntityId)(t.identityId, t.agentId), g = await i.AgentStakeLedger.get(f), m = BigInt(0), p = null !== (n = t.activeAmount) && void 0 !== n ? n : (null !== (a = null == g ? void 0 : g.activeAmount) && void 0 !== a ? a : m) + (null !== (o = t.activeDelta) && void 0 !== o ? o : m), b = (null !== (s = null == g ? void 0 : g.unbondingAmount) && void 0 !== s ? s : m) + (null !== (l = t.unbondingDelta) && void 0 !== l ? l : m), I = null !== (u = null !== (c = t.releaseBlocked) && void 0 !== c ? c : null == g ? void 0 : g.releaseBlocked) && void 0 !== u && u, w = p > m ? "Active" : b > m ? "Unbonding" : "Released", k = i.AgentStakeLedger.create({
                    id: f,
                    chainId: r.CHAIN_ID,
                    identityId: t.identityId,
                    agentId: t.agentId,
                    fundingAccount: null !== (y = t.fundingAccount) && void 0 !== y ? y : null == g ? void 0 : g.fundingAccount,
                    activeAmount: p,
                    unbondingAmount: b,
                    status: w,
                    unlockAtBlock: null !== (v = t.unlockAtBlock) && void 0 !== v ? v : null == g ? void 0 : g.unlockAtBlock,
                    releaseBlocked: I,
                    releaseBlockReason: null === t.releaseBlockReason ? void 0 : null !== (h = t.releaseBlockReason) && void 0 !== h ? h : null == g ? void 0 : g.releaseBlockReason,
                    updatedAtBlock: d(e.block)
                });
                return await k.save(), k;
            }
            t.handleAgentStakeBonded = async function(e) {
                const {data: t} = e.event, n = o(t[0]), a = o(t[1]), i = o(t[2]), r = BigInt(o(t[3])), d = BigInt(o(t[4]));
                await c(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    activeAmount: d
                }), await l(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    eventType: "Bonded",
                    amount: r,
                    activeAmount: d
                });
            }, t.handleAgentStakeUnbondRequested = async function(e) {
                const {data: t} = e.event, n = o(t[0]), a = o(t[1]), i = o(t[2]), r = BigInt(o(t[3])), d = BigInt(o(t[4]));
                await c(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    activeDelta: -r,
                    unbondingDelta: r,
                    unlockAtBlock: d
                }), await l(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    eventType: "UnbondRequested",
                    amount: r,
                    unlockAtBlock: d
                });
            }, t.handleAgentStakeUnbondCancelled = async function(e) {
                const {data: t} = e.event, n = o(t[0]), a = o(t[1]), i = o(t[2]), r = BigInt(o(t[3]));
                await c(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    activeDelta: r,
                    unbondingDelta: -r
                }), await l(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    eventType: "UnbondCancelled",
                    amount: r
                });
            }, t.handleAgentStakeReleaseBlocked = async function(e) {
                const {data: t} = e.event, n = o(t[0]), a = o(t[1]), i = function(e) {
                    var t, n, a;
                    if (null == e) return;
                    const i = null !== (a = null === (n = (t = e).toJSON) || void 0 === n ? void 0 : n.call(t)) && void 0 !== a ? a : e;
                    return null != i ? "string" == typeof i ? i : JSON.stringify(i) : void 0;
                }(t[2]);
                await c(e, {
                    identityId: n,
                    agentId: a,
                    releaseBlocked: !0,
                    releaseBlockReason: i
                }), await l(e, {
                    identityId: n,
                    agentId: a,
                    eventType: "ReleaseBlocked",
                    reasonRef: i
                });
            }, t.handleAgentStakeReleaseCleared = async function(e) {
                const {data: t} = e.event, n = o(t[0]), a = o(t[1]);
                await c(e, {
                    identityId: n,
                    agentId: a,
                    releaseBlocked: !1,
                    releaseBlockReason: null
                }), await l(e, {
                    identityId: n,
                    agentId: a,
                    eventType: "ReleaseCleared"
                });
            }, t.handleAgentStakeReleased = async function(e) {
                const {data: t} = e.event, n = o(t[0]), a = o(t[1]), i = o(t[2]), r = BigInt(o(t[3]));
                await c(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    unbondingDelta: -r
                }), await l(e, {
                    identityId: n,
                    agentId: a,
                    fundingAccount: i,
                    eventType: "Released",
                    amount: r
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
                const r = BigInt(e.block.header.number.toString()), o = e.block.header.hash.toHex();
                let d = await a.ChainCheckpoint.get(i.CHAIN_ID);
                d ? (d.blockNumber = r, d.blockHash = o, d.updatedAt = null !== (n = e.timestamp) && void 0 !== n ? n : new Date) : d = a.ChainCheckpoint.create({
                    id: i.CHAIN_ID,
                    chainId: i.CHAIN_ID,
                    blockNumber: r,
                    blockHash: o,
                    updatedAt: null !== (t = e.timestamp) && void 0 !== t ? t : new Date
                }), await d.save();
            };
        },
        823(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handleEmergencyCancelled = t.handleEmergencyResumed = t.handleEmergencyPaused = void 0;
            const a = n(314), i = n(739);
            function r(e) {
                if (null != e) return e.toString();
            }
            async function o(e, t) {
                const {event: {data: n}, block: o} = e, d = function(e) {
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
                }(n[0]), s = function(e) {
                    return BigInt(e.block.header.number.toString());
                }(o);
                let l, c;
                "Paused" === t ? (l = n[1].toString(), c = r(n[2].toJSON())) : c = r(n[1].toJSON());
                const u = (0, i.emergencyStatusEntityId)(d);
                let y = await a.EmergencyStatus.get(u);
                y ? (y.status = t, y.reasonHash = c, y.updatedBy = l, y.updatedAtBlock = s) : y = a.EmergencyStatus.create({
                    id: u,
                    chainId: i.CHAIN_ID,
                    scope: d,
                    status: t,
                    reasonHash: c,
                    updatedBy: l,
                    updatedAtBlock: s
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
            const a = n(322), i = n(708), r = n(739);
            function o(e) {
                return e.toString();
            }
            function d(e) {
                return BigInt(e.block.header.number.toString());
            }
            async function s(e) {
                return a.ChainIdentity.get((0, r.identityEntityId)(e));
            }
            function l(e) {
                if (null == e) return;
                if ("string" == typeof e) return e;
                const t = e;
                return t.cid ? String(t.cid) : t.uri ? String(t.uri) : JSON.stringify(e);
            }
            async function c(e) {
                try {
                    const t = (await api.query.identityCore.identities(e)).toJSON();
                    return t ? {
                        activeProfile: l(t.activeProfile),
                        activeAgentRegistry: l(t.activeAgentRegistry),
                        activeAuthRegistry: l(t.activeAuthRegistry),
                        activeRelationPolicy: l(t.activeRelationPolicy)
                    } : {};
                } catch (e) {
                    return {};
                }
            }
            async function u(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), i = await s(a);
                i && (i.updatedAtBlock = d(n), await i.save());
            }
            t.handleIdentityRegistered = async function(e) {
                const {event: {data: t}, block: n} = e, i = o(t[0]), s = o(t[1]), l = d(n), c = (0, 
                r.identityEntityId)(i), u = a.ChainIdentity.create({
                    id: c,
                    chainId: r.CHAIN_ID,
                    identityId: i,
                    owner: s,
                    status: "Active",
                    createdAtBlock: l,
                    updatedAtBlock: l
                });
                await u.save();
            }, t.handleOwnerKeyRotated = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), i = o(t[2]), r = d(n), l = await s(a);
                l && (l.owner = i, l.updatedAtBlock = r, await l.save());
            }, t.handleRecoveryKeySet = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), i = d(n), r = await s(a);
                r && (r.updatedAtBlock = i, await r.save());
            }, t.handleIdentityKeyAdded = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), l = o(t[1]), c = t[2], u = d(n), y = c.toJSON(), v = "string" == typeof y ? y : JSON.stringify(y), h = i.IdentityKey.create({
                    id: (0, r.identityKeyEntityId)(l),
                    chainId: r.CHAIN_ID,
                    identityId: a,
                    keyId: l,
                    account: "",
                    purpose: v,
                    status: "Active",
                    updatedAtBlock: u
                });
                try {
                    const e = (await api.query.identityCore.authorizedKeys(l)).toJSON();
                    e && e.account && (h.account = String(e.account));
                } catch (e) {}
                await h.save();
                const f = await s(a);
                f && (f.updatedAtBlock = u, await f.save());
            }, t.handleIdentityKeyRevoked = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[1]), l = o(t[0]), c = d(n), u = await i.IdentityKey.get((0, 
                r.identityKeyEntityId)(a));
                u && (u.status = "Revoked", u.updatedAtBlock = c, await u.save());
                const y = await s(l);
                y && (y.updatedAtBlock = c, await y.save());
            }, t.handleActiveProfileSet = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), i = d(n), r = await s(a);
                if (!r) return;
                const l = await c(a);
                r.activeProfile = l.activeProfile, r.updatedAtBlock = i, await r.save();
            }, t.handleActiveAgentRegistrySet = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), i = d(n), r = await s(a);
                if (!r) return;
                const l = await c(a);
                r.activeAgentRegistry = l.activeAgentRegistry, r.updatedAtBlock = i, await r.save();
            }, t.handleActiveAuthRegistrySet = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), i = d(n), r = await s(a);
                if (!r) return;
                const l = await c(a);
                r.activeAuthRegistry = l.activeAuthRegistry, r.updatedAtBlock = i, await r.save();
            }, t.handleActiveRelationPolicySet = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), i = d(n), r = await s(a);
                if (!r) return;
                const l = await c(a);
                r.activeRelationPolicy = l.activeRelationPolicy, r.updatedAtBlock = i, await r.save();
            }, t.handleTransportBound = async function(e) {
                await u(e);
            }, t.handleTransportVerified = async function(e) {
                await u(e);
            }, t.handleTransportRevoked = async function(e) {
                await u(e);
            }, t.handleIdentityFrozen = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), i = await s(a);
                i && (i.status = "Frozen", i.updatedAtBlock = d(n), await i.save());
            }, t.handleIdentityUnfrozen = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), i = await s(a);
                i && (i.status = "Active", i.updatedAtBlock = d(n), await i.save());
            }, t.handleIdentityDisabled = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), i = await s(a);
                i && (i.status = "Disabled", i.updatedAtBlock = d(n), await i.save());
            };
        },
        634(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.handlePaymentIntentExpired = t.handlePaymentIntentCancelled = t.handlePaymentIntentRefunded = t.handlePaymentIntentClaimed = t.handlePaymentIntentFunded = t.handlePaymentIntentCreated = void 0;
            const a = n(745), i = n(908), r = n(739);
            function o(e) {
                return e.toString();
            }
            function d(e) {
                return BigInt(e.block.header.number.toString());
            }
            async function s(e) {
                return a.PaymentIntent.get((0, r.paymentIntentEntityId)(e));
            }
            async function l(e, t, n) {
                var a, o;
                const {block: s, extrinsic: l, idx: c} = e, u = d(s), y = null != c ? c : 0, v = (0, 
                r.settlementEventEntityId)(t, u, y), h = i.SettlementEvent.create({
                    id: v,
                    chainId: r.CHAIN_ID,
                    intentId: t,
                    eventType: n,
                    blockNumber: u,
                    extrinsicIndex: l && null !== (a = l.idx) && void 0 !== a ? a : void 0,
                    eventIndex: y,
                    blockHash: s.block.header.hash.toHex(),
                    timestamp: null !== (o = s.timestamp) && void 0 !== o ? o : void 0
                });
                await h.save();
            }
            t.handlePaymentIntentCreated = async function(e) {
                const {event: {data: t}, block: n} = e, i = o(t[0]), s = o(t[1]), l = o(t[2]), c = BigInt(o(t[4])), u = t[5].toJSON(), y = d(n);
                let v, h;
                if (u) {
                    const e = u.namespace;
                    Array.isArray(e) ? v = Buffer.from(e).toString("utf8") : "string" == typeof e && (v = e.startsWith("0x") ? Buffer.from(e.slice(2), "hex").toString("utf8") : e), 
                    void 0 !== u.actionCode && (h = String(u.actionCode));
                }
                const f = a.PaymentIntent.create({
                    id: (0, r.paymentIntentEntityId)(i),
                    chainId: r.CHAIN_ID,
                    intentId: i,
                    payerIdentityId: s,
                    payeeIdentityId: l,
                    amount: c,
                    settlementMode: "Unknown",
                    actionNamespace: v,
                    actionId: h,
                    status: "Created",
                    createdAtBlock: y,
                    updatedAtBlock: y
                });
                await f.save();
            }, t.handlePaymentIntentFunded = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), i = t[1].toJSON(), r = "string" == typeof i ? i : JSON.stringify(i), l = await s(a);
                l && (l.settlementMode = r, l.status = "Funded", l.updatedAtBlock = d(n), await l.save());
            }, t.handlePaymentIntentClaimed = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), i = await s(a);
                i && (i.status = "Claimed", i.updatedAtBlock = d(n), await i.save()), await l(e, a, "Claimed");
            }, t.handlePaymentIntentRefunded = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), i = await s(a);
                i && (i.status = "Refunded", i.updatedAtBlock = d(n), await i.save()), await l(e, a, "Refunded");
            }, t.handlePaymentIntentCancelled = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), i = await s(a);
                i && (i.status = "Cancelled", i.updatedAtBlock = d(n), await i.save()), await l(e, a, "Cancelled");
            }, t.handlePaymentIntentExpired = async function(e) {
                const {event: {data: t}, block: n} = e, a = o(t[0]), i = await s(a);
                i && (i.status = "Expired", i.updatedAtBlock = d(n), await i.save()), await l(e, a, "Expired");
            };
        },
        739(e, t) {
            var n;
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.agentRewardEventEntityId = t.taskRewardSettlementEntityId = t.roundRewardSettlementEntityId = t.rewardDayStateEntityId = t.agentRewardLedgerEntityId = t.emergencyStatusEntityId = t.agentStakeEventEntityId = t.agentStakeLedgerEntityId = t.settlementEventEntityId = t.paymentIntentEntityId = t.identityKeyEntityId = t.identityEntityId = t.CHAIN_ID = void 0, 
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
            }, t.agentRewardLedgerEntityId = function(e, n) {
                return `${t.CHAIN_ID}:${e}:${n}`;
            }, t.rewardDayStateEntityId = function(e) {
                return `${t.CHAIN_ID}:${e}`;
            }, t.roundRewardSettlementEntityId = function(e, n) {
                return `${t.CHAIN_ID}:${e}:${n}`;
            }, t.taskRewardSettlementEntityId = function(e) {
                return `${t.CHAIN_ID}:${e}`;
            }, t.agentRewardEventEntityId = function(e, n, a, i, r) {
                return `${t.CHAIN_ID}:${e}:${n}:${a}:${i}:${r}`;
            };
        },
        127(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.AgentRewardEvent = void 0;
            const a = n(635).__importDefault(n(613));
            t.AgentRewardEvent = class {
                constructor(e, t, n, a, i, r, o, d, s, l, c, u, y, v) {
                    this.id = e, this.chainId = t, this.identityId = n, this.agentId = a, this.eventType = i, 
                    this.rewardKind = r, this.amount = o, this.baseAmount = d, this.observerAmount = s, 
                    this.reviewerAmount = l, this.taskAmount = c, this.blockNumber = u, this.eventIndex = y, 
                    this.blockHash = v;
                }
                get _name() {
                    return "AgentRewardEvent";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save AgentRewardEvent entity without an ID"), 
                    await store.set("AgentRewardEvent", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove AgentRewardEvent entity without an ID"), 
                    await store.remove("AgentRewardEvent", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get AgentRewardEvent entity without an ID");
                    const t = await store.get("AgentRewardEvent", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("AgentRewardEvent", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.identityId, e.agentId, e.eventType, e.rewardKind, e.amount, e.baseAmount, e.observerAmount, e.reviewerAmount, e.taskAmount, e.blockNumber, e.eventIndex, e.blockHash);
                    return Object.assign(t, e), t;
                }
            };
        },
        442(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.AgentRewardLedger = void 0;
            const a = n(635).__importDefault(n(613));
            t.AgentRewardLedger = class {
                constructor(e, t, n, a, i, r, o, d, s, l, c, u, y, v, h) {
                    this.id = e, this.chainId = t, this.identityId = n, this.agentId = a, this.claimableTotal = i, 
                    this.claimedTotal = r, this.claimableBase = o, this.claimableObserver = d, this.claimableReviewer = s, 
                    this.claimableTask = l, this.claimedBase = c, this.claimedObserver = u, this.claimedReviewer = y, 
                    this.claimedTask = v, this.updatedAtBlock = h;
                }
                get _name() {
                    return "AgentRewardLedger";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save AgentRewardLedger entity without an ID"), 
                    await store.set("AgentRewardLedger", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove AgentRewardLedger entity without an ID"), 
                    await store.remove("AgentRewardLedger", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get AgentRewardLedger entity without an ID");
                    const t = await store.get("AgentRewardLedger", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("AgentRewardLedger", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.identityId, e.agentId, e.claimableTotal, e.claimedTotal, e.claimableBase, e.claimableObserver, e.claimableReviewer, e.claimableTask, e.claimedBase, e.claimedObserver, e.claimedReviewer, e.claimedTask, e.updatedAtBlock);
                    return Object.assign(t, e), t;
                }
            };
        },
        378(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.AgentStakeEvent = void 0;
            const a = n(635).__importDefault(n(613));
            t.AgentStakeEvent = class {
                constructor(e, t, n, a, i, r, o, d) {
                    this.id = e, this.chainId = t, this.identityId = n, this.agentId = a, this.eventType = i, 
                    this.blockNumber = r, this.eventIndex = o, this.blockHash = d;
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
                constructor(e, t, n, a, i, r, o, d, s) {
                    this.id = e, this.chainId = t, this.identityId = n, this.agentId = a, this.activeAmount = i, 
                    this.unbondingAmount = r, this.status = o, this.releaseBlocked = d, this.updatedAtBlock = s;
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
                constructor(e, t, n, a, i, r, o) {
                    this.id = e, this.chainId = t, this.identityId = n, this.owner = a, this.status = i, 
                    this.createdAtBlock = r, this.updatedAtBlock = o;
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
                constructor(e, t, n, a, i, r, o, d) {
                    this.id = e, this.chainId = t, this.identityId = n, this.keyId = a, this.account = i, 
                    this.purpose = r, this.status = o, this.updatedAtBlock = d;
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
                constructor(e, t, n, a, i, r, o, d, s, l) {
                    this.id = e, this.chainId = t, this.intentId = n, this.payerIdentityId = a, this.payeeIdentityId = i, 
                    this.amount = r, this.settlementMode = o, this.status = d, this.createdAtBlock = s, 
                    this.updatedAtBlock = l;
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
        785(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.RewardDayState = void 0;
            const a = n(635).__importDefault(n(613));
            t.RewardDayState = class {
                constructor(e, t, n, a, i, r, o, d, s, l, c, u, y, v, h, f, g) {
                    this.id = e, this.chainId = t, this.dayIndex = n, this.baseStakingBudget = a, this.observerReviewerBudget = i, 
                    this.taskMarketBudget = r, this.baseStakingReleased = o, this.observerReviewerReleased = d, 
                    this.taskMarketReleased = s, this.rolloverBaseStaking = l, this.rolloverObserverReviewer = c, 
                    this.rolloverTaskMarket = u, this.baseStakingSettled = y, this.observerRoundsSettled = v, 
                    this.reviewerRoundsSettled = h, this.taskRewardsSettled = f, this.updatedAtBlock = g;
                }
                get _name() {
                    return "RewardDayState";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save RewardDayState entity without an ID"), await store.set("RewardDayState", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove RewardDayState entity without an ID"), 
                    await store.remove("RewardDayState", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get RewardDayState entity without an ID");
                    const t = await store.get("RewardDayState", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("RewardDayState", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.dayIndex, e.baseStakingBudget, e.observerReviewerBudget, e.taskMarketBudget, e.baseStakingReleased, e.observerReviewerReleased, e.taskMarketReleased, e.rolloverBaseStaking, e.rolloverObserverReviewer, e.rolloverTaskMarket, e.baseStakingSettled, e.observerRoundsSettled, e.reviewerRoundsSettled, e.taskRewardsSettled, e.updatedAtBlock);
                    return Object.assign(t, e), t;
                }
            };
        },
        753(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.RoundRewardSettlement = void 0;
            const a = n(635).__importDefault(n(613));
            t.RoundRewardSettlement = class {
                constructor(e, t, n, a, i, r, o, d, s, l) {
                    this.id = e, this.chainId = t, this.roundId = n, this.role = a, this.dayIndex = i, 
                    this.participantCount = r, this.totalEffectiveStake = o, this.released = d, this.rollover = s, 
                    this.blockNumber = l;
                }
                get _name() {
                    return "RoundRewardSettlement";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save RoundRewardSettlement entity without an ID"), 
                    await store.set("RoundRewardSettlement", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove RoundRewardSettlement entity without an ID"), 
                    await store.remove("RoundRewardSettlement", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get RoundRewardSettlement entity without an ID");
                    const t = await store.get("RoundRewardSettlement", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("RoundRewardSettlement", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.roundId, e.role, e.dayIndex, e.participantCount, e.totalEffectiveStake, e.released, e.rollover, e.blockNumber);
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
                constructor(e, t, n, a, i, r, o) {
                    this.id = e, this.chainId = t, this.intentId = n, this.eventType = a, this.blockNumber = i, 
                    this.eventIndex = r, this.blockHash = o;
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
        808(e, t, n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.TaskRewardSettlement = void 0;
            const a = n(635).__importDefault(n(613));
            t.TaskRewardSettlement = class {
                constructor(e, t, n, a, i, r, o, d, s) {
                    this.id = e, this.chainId = t, this.taskId = n, this.identityId = a, this.agentId = i, 
                    this.difficulty = r, this.amount = o, this.dayIndex = d, this.blockNumber = s;
                }
                get _name() {
                    return "TaskRewardSettlement";
                }
                async save() {
                    const e = this.id;
                    (0, a.default)(null !== e, "Cannot save TaskRewardSettlement entity without an ID"), 
                    await store.set("TaskRewardSettlement", e.toString(), this);
                }
                static async remove(e) {
                    (0, a.default)(null !== e, "Cannot remove TaskRewardSettlement entity without an ID"), 
                    await store.remove("TaskRewardSettlement", e.toString());
                }
                static async get(e) {
                    (0, a.default)(null != e, "Cannot get TaskRewardSettlement entity without an ID");
                    const t = await store.get("TaskRewardSettlement", e.toString());
                    return t ? this.create(t) : void 0;
                }
                static async getByFields(e, t) {
                    return (await store.getByFields("TaskRewardSettlement", e, t)).map(e => this.create(e));
                }
                static create(e) {
                    (0, a.default)(void 0 !== e.id && null !== e.id, "id must be provided");
                    const t = new this(e.id, e.chainId, e.taskId, e.identityId, e.agentId, e.difficulty, e.amount, e.dayIndex, e.blockNumber);
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
                path: new URL("file:///home/libingjiang47/vibly-indexer/node_modules/@polkadot/api-base/packageInfo.js").pathname.substring(0, new URL("file:///home/libingjiang47/vibly-indexer/node_modules/@polkadot/api-base/packageInfo.js").pathname.lastIndexOf("/") + 1),
                type: "esm",
                version: "16.5.6"
            }, i = {
                name: "@polkadot/types",
                path: new URL("file:///home/libingjiang47/vibly-indexer/node_modules/@polkadot/types/packageInfo.js").pathname.substring(0, new URL("file:///home/libingjiang47/vibly-indexer/node_modules/@polkadot/types/packageInfo.js").pathname.lastIndexOf("/") + 1),
                type: "esm",
                version: "16.5.6"
            }, r = {
                name: "@polkadot/types-codec",
                path: new URL("file:///home/libingjiang47/vibly-indexer/node_modules/@polkadot/types-codec/packageInfo.js").pathname.substring(0, new URL("file:///home/libingjiang47/vibly-indexer/node_modules/@polkadot/types-codec/packageInfo.js").pathname.lastIndexOf("/") + 1),
                type: "esm",
                version: "16.5.6"
            };
            const o = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : Function("return this");
            function d(e, {name: t}) {
                return [ e, t ];
            }
            function s(e, {path: t, type: n}) {
                let a;
                if (t && t.length >= 5) {
                    const e = t.indexOf("node_modules");
                    a = -1 === e ? t : t.substring(e);
                } else a = "<unknown>";
                return [ `${`${n || ""}`.padStart(3)} ${e}`, a ];
            }
            function l(e, t) {
                if (e) return e;
                if ("function" == typeof t) try {
                    return t() || "";
                } catch {
                    return "";
                }
                return t || "";
            }
            function c(e, t, n) {
                console.warn(`${e}\nEither remove and explicitly install matching versions or dedupe using your package manager.\nThe following conflicting packages were found:\n${function(e, t) {
                    let n = 0;
                    for (let t = 0, a = e.length; t < a; t++) n = Math.max(n, e[t].version.length);
                    return e.map(e => `\t${t(e.version.padEnd(n), e).join("\t")}`).join("\n");
                }(t, n)}`);
            }
            const u = {
                name: "@polkadot/api-augment",
                path: new URL("file:///home/libingjiang47/vibly-indexer/node_modules/@polkadot/api-augment/packageInfo.js").pathname.substring(0, new URL("file:///home/libingjiang47/vibly-indexer/node_modules/@polkadot/api-augment/packageInfo.js").pathname.lastIndexOf("/") + 1),
                type: "esm",
                version: "16.5.6"
            };
            !function({name: e, path: t, type: n, version: a}, i, r = []) {
                if (!e.startsWith("@polkadot")) throw new Error(`Invalid package descriptor ${e}`);
                const u = function(e) {
                    const t = o;
                    return t.__polkadotjs || (t.__polkadotjs = {}), t.__polkadotjs[e] || (t.__polkadotjs[e] = []), 
                    t.__polkadotjs[e];
                }(e);
                u.push({
                    path: l(t, i),
                    type: n,
                    version: a
                });
                const y = u.every(e => e.version === a), v = "1" === o.process?.env?.POLKADOTJS_DISABLE_ESM_CJS_WARNING;
                if (1 !== u.length && !(v && y)) c(`${e} has multiple versions, ensure that there is only one installed.`, u, s); else {
                    const t = r.filter(e => e && e.version !== a);
                    t.length && c(`${e} requires direct dependencies exactly matching version ${a}.`, t, d);
                }
            }(u, null, [ a, r, i ]);
        },
        635(e, t, n) {
            n.r(t), n.d(t, {
                __addDisposableResource: () => x,
                __assign: () => r,
                __asyncDelegator: () => R,
                __asyncGenerator: () => A,
                __asyncValues: () => _,
                __await: () => S,
                __awaiter: () => h,
                __classPrivateFieldGet: () => j,
                __classPrivateFieldIn: () => T,
                __classPrivateFieldSet: () => D,
                __createBinding: () => g,
                __decorate: () => d,
                __disposeResources: () => $,
                __esDecorate: () => l,
                __exportStar: () => m,
                __extends: () => i,
                __generator: () => f,
                __importDefault: () => E,
                __importStar: () => P,
                __makeTemplateObject: () => B,
                __metadata: () => v,
                __param: () => s,
                __propKey: () => u,
                __read: () => b,
                __rest: () => o,
                __rewriteRelativeImportExtension: () => H,
                __runInitializers: () => c,
                __setFunctionName: () => y,
                __spread: () => I,
                __spreadArray: () => k,
                __spreadArrays: () => w,
                __values: () => p,
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
            function i(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
                function n() {
                    this.constructor = e;
                }
                a(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, 
                new n);
            }
            var r = function() {
                return r = Object.assign || function(e) {
                    for (var t, n = 1, a = arguments.length; n < a; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                    return e;
                }, r.apply(this, arguments);
            };
            function o(e, t) {
                var n = {};
                for (var a in e) Object.prototype.hasOwnProperty.call(e, a) && t.indexOf(a) < 0 && (n[a] = e[a]);
                if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
                    var i = 0;
                    for (a = Object.getOwnPropertySymbols(e); i < a.length; i++) t.indexOf(a[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, a[i]) && (n[a[i]] = e[a[i]]);
                }
                return n;
            }
            function d(e, t, n, a) {
                var i, r = arguments.length, o = r < 3 ? t : null === a ? a = Object.getOwnPropertyDescriptor(t, n) : a;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(e, t, n, a); else for (var d = e.length - 1; d >= 0; d--) (i = e[d]) && (o = (r < 3 ? i(o) : r > 3 ? i(t, n, o) : i(t, n)) || o);
                return r > 3 && o && Object.defineProperty(t, n, o), o;
            }
            function s(e, t) {
                return function(n, a) {
                    t(n, a, e);
                };
            }
            function l(e, t, n, a, i, r) {
                function o(e) {
                    if (void 0 !== e && "function" != typeof e) throw new TypeError("Function expected");
                    return e;
                }
                for (var d, s = a.kind, l = "getter" === s ? "get" : "setter" === s ? "set" : "value", c = !t && e ? a.static ? e : e.prototype : null, u = t || (c ? Object.getOwnPropertyDescriptor(c, a.name) : {}), y = !1, v = n.length - 1; v >= 0; v--) {
                    var h = {};
                    for (var f in a) h[f] = "access" === f ? {} : a[f];
                    for (var f in a.access) h.access[f] = a.access[f];
                    h.addInitializer = function(e) {
                        if (y) throw new TypeError("Cannot add initializers after decoration has completed");
                        r.push(o(e || null));
                    };
                    var g = (0, n[v])("accessor" === s ? {
                        get: u.get,
                        set: u.set
                    } : u[l], h);
                    if ("accessor" === s) {
                        if (void 0 === g) continue;
                        if (null === g || "object" != typeof g) throw new TypeError("Object expected");
                        (d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
                    } else (d = o(g)) && ("field" === s ? i.unshift(d) : u[l] = d);
                }
                c && Object.defineProperty(c, a.name, u), y = !0;
            }
            function c(e, t, n) {
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
            function v(e, t) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t);
            }
            function h(e, t, n, a) {
                return new (n || (n = Promise))(function(i, r) {
                    function o(e) {
                        try {
                            s(a.next(e));
                        } catch (e) {
                            r(e);
                        }
                    }
                    function d(e) {
                        try {
                            s(a.throw(e));
                        } catch (e) {
                            r(e);
                        }
                    }
                    function s(e) {
                        var t;
                        e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
                            e(t);
                        })).then(o, d);
                    }
                    s((a = a.apply(e, t || [])).next());
                });
            }
            function f(e, t) {
                var n, a, i, r = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0]) throw i[1];
                        return i[1];
                    },
                    trys: [],
                    ops: []
                }, o = Object.create(("function" == typeof Iterator ? Iterator : Object).prototype);
                return o.next = d(0), o.throw = d(1), o.return = d(2), "function" == typeof Symbol && (o[Symbol.iterator] = function() {
                    return this;
                }), o;
                function d(d) {
                    return function(s) {
                        return function(d) {
                            if (n) throw new TypeError("Generator is already executing.");
                            for (;o && (o = 0, d[0] && (r = 0)), r; ) try {
                                if (n = 1, a && (i = 2 & d[0] ? a.return : d[0] ? a.throw || ((i = a.return) && i.call(a), 
                                0) : a.next) && !(i = i.call(a, d[1])).done) return i;
                                switch (a = 0, i && (d = [ 2 & d[0], i.value ]), d[0]) {
                                  case 0:
                                  case 1:
                                    i = d;
                                    break;

                                  case 4:
                                    return r.label++, {
                                        value: d[1],
                                        done: !1
                                    };

                                  case 5:
                                    r.label++, a = d[1], d = [ 0 ];
                                    continue;

                                  case 7:
                                    d = r.ops.pop(), r.trys.pop();
                                    continue;

                                  default:
                                    if (!(i = r.trys, (i = i.length > 0 && i[i.length - 1]) || 6 !== d[0] && 2 !== d[0])) {
                                        r = 0;
                                        continue;
                                    }
                                    if (3 === d[0] && (!i || d[1] > i[0] && d[1] < i[3])) {
                                        r.label = d[1];
                                        break;
                                    }
                                    if (6 === d[0] && r.label < i[1]) {
                                        r.label = i[1], i = d;
                                        break;
                                    }
                                    if (i && r.label < i[2]) {
                                        r.label = i[2], r.ops.push(d);
                                        break;
                                    }
                                    i[2] && r.ops.pop(), r.trys.pop();
                                    continue;
                                }
                                d = t.call(e, r);
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
                        }([ d, s ]);
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
            function m(e, t) {
                for (var n in e) "default" === n || Object.prototype.hasOwnProperty.call(t, n) || g(t, e, n);
            }
            function p(e) {
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
                var a, i, r = n.call(e), o = [];
                try {
                    for (;(void 0 === t || t-- > 0) && !(a = r.next()).done; ) o.push(a.value);
                } catch (e) {
                    i = {
                        error: e
                    };
                } finally {
                    try {
                        a && !a.done && (n = r.return) && n.call(r);
                    } finally {
                        if (i) throw i.error;
                    }
                }
                return o;
            }
            function I() {
                for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(b(arguments[t]));
                return e;
            }
            function w() {
                for (var e = 0, t = 0, n = arguments.length; t < n; t++) e += arguments[t].length;
                var a = Array(e), i = 0;
                for (t = 0; t < n; t++) for (var r = arguments[t], o = 0, d = r.length; o < d; o++, 
                i++) a[i] = r[o];
                return a;
            }
            function k(e, t, n) {
                if (n || 2 === arguments.length) for (var a, i = 0, r = t.length; i < r; i++) !a && i in t || (a || (a = Array.prototype.slice.call(t, 0, i)), 
                a[i] = t[i]);
                return e.concat(a || Array.prototype.slice.call(t));
            }
            function S(e) {
                return this instanceof S ? (this.v = e, this) : new S(e);
            }
            function A(e, t, n) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var a, i = n.apply(e, t || []), r = [];
                return a = Object.create(("function" == typeof AsyncIterator ? AsyncIterator : Object).prototype), 
                o("next"), o("throw"), o("return", function(e) {
                    return function(t) {
                        return Promise.resolve(t).then(e, l);
                    };
                }), a[Symbol.asyncIterator] = function() {
                    return this;
                }, a;
                function o(e, t) {
                    i[e] && (a[e] = function(t) {
                        return new Promise(function(n, a) {
                            r.push([ e, t, n, a ]) > 1 || d(e, t);
                        });
                    }, t && (a[e] = t(a[e])));
                }
                function d(e, t) {
                    try {
                        (n = i[e](t)).value instanceof S ? Promise.resolve(n.value.v).then(s, l) : c(r[0][2], n);
                    } catch (e) {
                        c(r[0][3], e);
                    }
                    var n;
                }
                function s(e) {
                    d("next", e);
                }
                function l(e) {
                    d("throw", e);
                }
                function c(e, t) {
                    e(t), r.shift(), r.length && d(r[0][0], r[0][1]);
                }
            }
            function R(e) {
                var t, n;
                return t = {}, a("next"), a("throw", function(e) {
                    throw e;
                }), a("return"), t[Symbol.iterator] = function() {
                    return this;
                }, t;
                function a(a, i) {
                    t[a] = e[a] ? function(t) {
                        return (n = !n) ? {
                            value: S(e[a](t)),
                            done: !1
                        } : i ? i(t) : t;
                    } : i;
                }
            }
            function _(e) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var t, n = e[Symbol.asyncIterator];
                return n ? n.call(e) : (e = p(e), t = {}, a("next"), a("throw"), a("return"), t[Symbol.asyncIterator] = function() {
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
            function B(e, t) {
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
            }, C = function(e) {
                return C = Object.getOwnPropertyNames || function(e) {
                    var t = [];
                    for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[t.length] = n);
                    return t;
                }, C(e);
            };
            function P(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e) for (var n = C(e), a = 0; a < n.length; a++) "default" !== n[a] && g(t, e, n[a]);
                return O(t, e), t;
            }
            function E(e) {
                return e && e.__esModule ? e : {
                    default: e
                };
            }
            function j(e, t, n, a) {
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
            function T(e, t) {
                if (null === t || "object" != typeof t && "function" != typeof t) throw new TypeError("Cannot use 'in' operator on non-object");
                return "function" == typeof e ? t === e : e.has(t);
            }
            function x(e, t, n) {
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
            function $(e) {
                function t(t) {
                    e.error = e.hasError ? new N(t, e.error, "An error was suppressed during disposal.") : t, 
                    e.hasError = !0;
                }
                var n, a = 0;
                return function i() {
                    for (;n = e.stack.pop(); ) try {
                        if (!n.async && 1 === a) return a = 0, e.stack.push(n), Promise.resolve().then(i);
                        if (n.dispose) {
                            var r = n.dispose.call(n.value);
                            if (n.async) return a |= 2, Promise.resolve(r).then(i, function(e) {
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
            function H(e, t) {
                return "string" == typeof e && /^\.\.?\//.test(e) ? e.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(e, n, a, i, r) {
                    return n ? t ? ".jsx" : ".js" : !a || i && r ? a + i + "." + r.toLowerCase() + "js" : e;
                }) : e;
            }
            const F = {
                __extends: i,
                __assign: r,
                __rest: o,
                __decorate: d,
                __param: s,
                __esDecorate: l,
                __runInitializers: c,
                __propKey: u,
                __setFunctionName: y,
                __metadata: v,
                __awaiter: h,
                __generator: f,
                __createBinding: g,
                __exportStar: m,
                __values: p,
                __read: b,
                __spread: I,
                __spreadArrays: w,
                __spreadArray: k,
                __await: S,
                __asyncGenerator: A,
                __asyncDelegator: R,
                __asyncValues: _,
                __makeTemplateObject: B,
                __importStar: P,
                __importDefault: E,
                __classPrivateFieldGet: j,
                __classPrivateFieldSet: D,
                __classPrivateFieldIn: T,
                __addDisposableResource: x,
                __disposeResources: $,
                __rewriteRelativeImportExtension: H
            };
        }
    }, t = {};
    function n(a) {
        var i = t[a];
        if (void 0 !== i) return i.exports;
        var r = t[a] = {
            exports: {}
        };
        return e[a](r, r.exports, n), r.exports;
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
        }), e.handleAgentRewardClaimed = e.handleAgentRewardCredited = e.handleTaskRewardSettled = e.handleReviewerRoundSettled = e.handleObserverRoundSettled = e.handleBaseStakingDaySettled = e.handleAgentStakeReleased = e.handleAgentStakeReleaseCleared = e.handleAgentStakeReleaseBlocked = e.handleAgentStakeUnbondCancelled = e.handleAgentStakeUnbondRequested = e.handleAgentStakeBonded = e.handleEmergencyCancelled = e.handleEmergencyResumed = e.handleEmergencyPaused = e.handlePaymentIntentExpired = e.handlePaymentIntentCancelled = e.handlePaymentIntentRefunded = e.handlePaymentIntentClaimed = e.handlePaymentIntentFunded = e.handlePaymentIntentCreated = e.handleIdentityDisabled = e.handleIdentityUnfrozen = e.handleIdentityFrozen = e.handleTransportRevoked = e.handleTransportVerified = e.handleTransportBound = e.handleActiveRelationPolicySet = e.handleActiveAuthRegistrySet = e.handleActiveAgentRegistrySet = e.handleActiveProfileSet = e.handleIdentityKeyRevoked = e.handleIdentityKeyAdded = e.handleRecoveryKeySet = e.handleOwnerKeyRotated = e.handleIdentityRegistered = e.handleBlock = void 0;
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
        var r = n(634);
        Object.defineProperty(e, "handlePaymentIntentCreated", {
            enumerable: !0,
            get: function() {
                return r.handlePaymentIntentCreated;
            }
        }), Object.defineProperty(e, "handlePaymentIntentFunded", {
            enumerable: !0,
            get: function() {
                return r.handlePaymentIntentFunded;
            }
        }), Object.defineProperty(e, "handlePaymentIntentClaimed", {
            enumerable: !0,
            get: function() {
                return r.handlePaymentIntentClaimed;
            }
        }), Object.defineProperty(e, "handlePaymentIntentRefunded", {
            enumerable: !0,
            get: function() {
                return r.handlePaymentIntentRefunded;
            }
        }), Object.defineProperty(e, "handlePaymentIntentCancelled", {
            enumerable: !0,
            get: function() {
                return r.handlePaymentIntentCancelled;
            }
        }), Object.defineProperty(e, "handlePaymentIntentExpired", {
            enumerable: !0,
            get: function() {
                return r.handlePaymentIntentExpired;
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
        });
        var s = n(473);
        Object.defineProperty(e, "handleBaseStakingDaySettled", {
            enumerable: !0,
            get: function() {
                return s.handleBaseStakingDaySettled;
            }
        }), Object.defineProperty(e, "handleObserverRoundSettled", {
            enumerable: !0,
            get: function() {
                return s.handleObserverRoundSettled;
            }
        }), Object.defineProperty(e, "handleReviewerRoundSettled", {
            enumerable: !0,
            get: function() {
                return s.handleReviewerRoundSettled;
            }
        }), Object.defineProperty(e, "handleTaskRewardSettled", {
            enumerable: !0,
            get: function() {
                return s.handleTaskRewardSettled;
            }
        }), Object.defineProperty(e, "handleAgentRewardCredited", {
            enumerable: !0,
            get: function() {
                return s.handleAgentRewardCredited;
            }
        }), Object.defineProperty(e, "handleAgentRewardClaimed", {
            enumerable: !0,
            get: function() {
                return s.handleAgentRewardClaimed;
            }
        }), n(197);
    })();
    var i = exports;
    for (var r in a) i[r] = a[r];
    a.__esModule && Object.defineProperty(i, "__esModule", {
        value: !0
    });
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFBZWpXO0FBQWdDO1lBQzlKM0osT0FBT0MsZUFBZUMsR0FBUyw0QkFBNEI7WUFBRW9iLGFBQVk7WUFBTXRTLEtBQUs7Z0JBQWMsT0FBTzRXLEVBQWVsVztBQUEwQjs7UUFDbEosSUFBSW1XLElBQW9CLEVBQVE7UUFDaEM3ZixPQUFPQyxlQUFlQyxHQUFTLCtCQUErQjtZQUFFb2IsYUFBWTtZQUFNdFMsS0FBSztnQkFBYyxPQUFPNlcsRUFBa0JyZjtBQUE2QjtZQUMzSlIsT0FBT0MsZUFBZUMsR0FBUyw4QkFBOEI7WUFBRW9iLGFBQVk7WUFBTXRTLEtBQUs7Z0JBQWMsT0FBTzZXLEVBQWtCdGY7QUFBNEI7WUFDekpQLE9BQU9DLGVBQWVDLEdBQVMsOEJBQThCO1lBQUVvYixhQUFZO1lBQU10UyxLQUFLO2dCQUFjLE9BQU82VyxFQUFrQnZmO0FBQTRCO1lBQ3pKTixPQUFPQyxlQUFlQyxHQUFTLDJCQUEyQjtZQUFFb2IsYUFBWTtZQUFNdFMsS0FBSztnQkFBYyxPQUFPNlcsRUFBa0J4ZjtBQUF5QjtZQUNuSkwsT0FBT0MsZUFBZUMsR0FBUyw2QkFBNkI7WUFBRW9iLGFBQVk7WUFBTXRTLEtBQUs7Z0JBQWMsT0FBTzZXLEVBQWtCcGY7QUFBMkI7WUFDdkpULE9BQU9DLGVBQWVDLEdBQVMsNEJBQTRCO1lBQUVvYixhQUFZO1lBQU10UyxLQUFLO2dCQUFjLE9BQU82VyxFQUFrQnpmO0FBQTBCO1lBQ3JKLEVBQVEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL21hcHBpbmdzL2FnZW50SW5jZW50aXZlcy50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL21hcHBpbmdzL2FnZW50U3Rha2luZy50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL21hcHBpbmdzL2Jsb2NrLnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvbWFwcGluZ3MvZW1lcmdlbmN5LnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvbWFwcGluZ3MvaWRlbnRpdHlDb3JlLnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvbWFwcGluZ3MvcGF5bWVudEludGVudC50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL21hcHBpbmdzL3V0aWxzLnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvdHlwZXMvbW9kZWxzL0FnZW50UmV3YXJkRXZlbnQudHMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy90eXBlcy9tb2RlbHMvQWdlbnRSZXdhcmRMZWRnZXIudHMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy90eXBlcy9tb2RlbHMvQWdlbnRTdGFrZUV2ZW50LnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvdHlwZXMvbW9kZWxzL0FnZW50U3Rha2VMZWRnZXIudHMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy90eXBlcy9tb2RlbHMvQ2hhaW5DaGVja3BvaW50LnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvdHlwZXMvbW9kZWxzL0NoYWluSWRlbnRpdHkudHMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy90eXBlcy9tb2RlbHMvRW1lcmdlbmN5U3RhdHVzLnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvdHlwZXMvbW9kZWxzL0lkZW50aXR5S2V5LnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvdHlwZXMvbW9kZWxzL1BheW1lbnRJbnRlbnQudHMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy90eXBlcy9tb2RlbHMvUmV3YXJkRGF5U3RhdGUudHMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy90eXBlcy9tb2RlbHMvUm91bmRSZXdhcmRTZXR0bGVtZW50LnRzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9zcmMvdHlwZXMvbW9kZWxzL1NldHRsZW1lbnRFdmVudC50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vc3JjL3R5cGVzL21vZGVscy9UYXNrUmV3YXJkU2V0dGxlbWVudC50cyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJhc3NlcnRcIiIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC9hcGktYmFzZS9wYWNrYWdlSW5mby5qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC90eXBlcy9wYWNrYWdlSW5mby5qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC90eXBlcy1jb2RlYy9wYWNrYWdlSW5mby5qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC94LWdsb2JhbC9pbmRleC5qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC91dGlsL2RldGVjdFBhY2thZ2UuanMiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL25vZGVfbW9kdWxlcy9AcG9sa2Fkb3QvdXRpbC9pcy9mdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC9hcGktYXVnbWVudC9wYWNrYWdlSW5mby5qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyLy4vbm9kZV9tb2R1bGVzL0Bwb2xrYWRvdC9hcGktYXVnbWVudC9wYWNrYWdlRGV0ZWN0LmpzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2Lm1qcyIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZpYmx5LWluZGV4ZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly92aWJseS1pbmRleGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdmlibHktaW5kZXhlci8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaGFuZGxlQWdlbnRSZXdhcmRDbGFpbWVkID0gZXhwb3J0cy5oYW5kbGVUYXNrUmV3YXJkU2V0dGxlZCA9IGV4cG9ydHMuaGFuZGxlUmV2aWV3ZXJSb3VuZFNldHRsZWQgPSBleHBvcnRzLmhhbmRsZU9ic2VydmVyUm91bmRTZXR0bGVkID0gZXhwb3J0cy5oYW5kbGVCYXNlU3Rha2luZ0RheVNldHRsZWQgPSBleHBvcnRzLmhhbmRsZUFnZW50UmV3YXJkQ3JlZGl0ZWQgPSB2b2lkIDA7XG5jb25zdCBBZ2VudFJld2FyZEV2ZW50XzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvbW9kZWxzL0FnZW50UmV3YXJkRXZlbnRcIik7XG5jb25zdCBBZ2VudFJld2FyZExlZGdlcl8xID0gcmVxdWlyZShcIi4uL3R5cGVzL21vZGVscy9BZ2VudFJld2FyZExlZGdlclwiKTtcbmNvbnN0IFJld2FyZERheVN0YXRlXzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvbW9kZWxzL1Jld2FyZERheVN0YXRlXCIpO1xuY29uc3QgUm91bmRSZXdhcmRTZXR0bGVtZW50XzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvbW9kZWxzL1JvdW5kUmV3YXJkU2V0dGxlbWVudFwiKTtcbmNvbnN0IFRhc2tSZXdhcmRTZXR0bGVtZW50XzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvbW9kZWxzL1Rhc2tSZXdhcmRTZXR0bGVtZW50XCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xuZnVuY3Rpb24gc3RyKHYpIHtcbiAgICByZXR1cm4gdi50b1N0cmluZygpO1xufVxuZnVuY3Rpb24gbnVtKHYpIHtcbiAgICByZXR1cm4gTnVtYmVyKHN0cih2KSk7XG59XG5mdW5jdGlvbiBiaWcodikge1xuICAgIHJldHVybiBCaWdJbnQoc3RyKHYpKTtcbn1cbmZ1bmN0aW9uIGJsb2NrTnVtKGJsb2NrKSB7XG4gICAgcmV0dXJuIEJpZ0ludChibG9jay5ibG9jay5oZWFkZXIubnVtYmVyLnRvU3RyaW5nKCkpO1xufVxuZnVuY3Rpb24gZXh0cmluc2ljSW5kZXgoZXZlbnQpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIGV2ZW50LmV4dHJpbnNpYyA/IChfYSA9IGV2ZW50LmV4dHJpbnNpYy5pZHgpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHVuZGVmaW5lZCA6IHVuZGVmaW5lZDtcbn1cbmZ1bmN0aW9uIHplcm9TbmFwc2hvdCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjbGFpbWFibGVUb3RhbDogQmlnSW50KDApLFxuICAgICAgICBjbGFpbWVkVG90YWw6IEJpZ0ludCgwKSxcbiAgICAgICAgY2xhaW1hYmxlQmFzZTogQmlnSW50KDApLFxuICAgICAgICBjbGFpbWFibGVPYnNlcnZlcjogQmlnSW50KDApLFxuICAgICAgICBjbGFpbWFibGVSZXZpZXdlcjogQmlnSW50KDApLFxuICAgICAgICBjbGFpbWFibGVUYXNrOiBCaWdJbnQoMCksXG4gICAgICAgIGNsYWltZWRCYXNlOiBCaWdJbnQoMCksXG4gICAgICAgIGNsYWltZWRPYnNlcnZlcjogQmlnSW50KDApLFxuICAgICAgICBjbGFpbWVkUmV2aWV3ZXI6IEJpZ0ludCgwKSxcbiAgICAgICAgY2xhaW1lZFRhc2s6IEJpZ0ludCgwKSxcbiAgICB9O1xufVxuZnVuY3Rpb24gcGFyc2VMZWRnZXJKc29uKHJhdykge1xuICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mLCBfZywgX2gsIF9qLCBfaztcbiAgICBpZiAoIXJhdylcbiAgICAgICAgcmV0dXJuIHplcm9TbmFwc2hvdCgpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGNsYWltYWJsZVRvdGFsOiBiaWcoKF9hID0gcmF3W1wiY2xhaW1hYmxlVG90YWxcIl0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDApLFxuICAgICAgICBjbGFpbWVkVG90YWw6IGJpZygoX2IgPSByYXdbXCJjbGFpbWVkVG90YWxcIl0pICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IDApLFxuICAgICAgICBjbGFpbWFibGVCYXNlOiBiaWcoKF9jID0gcmF3W1wiY2xhaW1hYmxlQmFzZVwiXSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogMCksXG4gICAgICAgIGNsYWltYWJsZU9ic2VydmVyOiBiaWcoKF9kID0gcmF3W1wiY2xhaW1hYmxlT2JzZXJ2ZXJcIl0pICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IDApLFxuICAgICAgICBjbGFpbWFibGVSZXZpZXdlcjogYmlnKChfZSA9IHJhd1tcImNsYWltYWJsZVJldmlld2VyXCJdKSAhPT0gbnVsbCAmJiBfZSAhPT0gdm9pZCAwID8gX2UgOiAwKSxcbiAgICAgICAgY2xhaW1hYmxlVGFzazogYmlnKChfZiA9IHJhd1tcImNsYWltYWJsZVRhc2tcIl0pICE9PSBudWxsICYmIF9mICE9PSB2b2lkIDAgPyBfZiA6IDApLFxuICAgICAgICBjbGFpbWVkQmFzZTogYmlnKChfZyA9IHJhd1tcImNsYWltZWRCYXNlXCJdKSAhPT0gbnVsbCAmJiBfZyAhPT0gdm9pZCAwID8gX2cgOiAwKSxcbiAgICAgICAgY2xhaW1lZE9ic2VydmVyOiBiaWcoKF9oID0gcmF3W1wiY2xhaW1lZE9ic2VydmVyXCJdKSAhPT0gbnVsbCAmJiBfaCAhPT0gdm9pZCAwID8gX2ggOiAwKSxcbiAgICAgICAgY2xhaW1lZFJldmlld2VyOiBiaWcoKF9qID0gcmF3W1wiY2xhaW1lZFJldmlld2VyXCJdKSAhPT0gbnVsbCAmJiBfaiAhPT0gdm9pZCAwID8gX2ogOiAwKSxcbiAgICAgICAgY2xhaW1lZFRhc2s6IGJpZygoX2sgPSByYXdbXCJjbGFpbWVkVGFza1wiXSkgIT09IG51bGwgJiYgX2sgIT09IHZvaWQgMCA/IF9rIDogMCksXG4gICAgfTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGZldGNoUmV3YXJkTGVkZ2VyKGlkZW50aXR5SWQsIGFnZW50SWQpIHtcbiAgICB0cnkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCBhcGkucXVlcnkuYWdlbnRJbmNlbnRpdmVzLmFnZW50UmV3YXJkTGVkZ2VycyhbaWRlbnRpdHlJZCwgYWdlbnRJZF0pO1xuICAgICAgICBjb25zdCBqc29uID0gcmVjb3JkLnRvSlNPTigpO1xuICAgICAgICByZXR1cm4gcGFyc2VMZWRnZXJKc29uKGpzb24pO1xuICAgIH1cbiAgICBjYXRjaCAoY2F1c2UpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBhZ2VudEluY2VudGl2ZXMgbGVkZ2VyIHN0b3JhZ2UgcmVhZCBmYWlsZWQgZm9yICR7aWRlbnRpdHlJZH0vJHthZ2VudElkfTogJHtjYXVzZSBpbnN0YW5jZW9mIEVycm9yID8gY2F1c2UubWVzc2FnZSA6IFN0cmluZyhjYXVzZSl9YCk7XG4gICAgICAgIHJldHVybiB6ZXJvU25hcHNob3QoKTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiByZWFkSW5kZXhlZFJld2FyZExlZGdlcihpZGVudGl0eUlkLCBhZ2VudElkKSB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBhd2FpdCBBZ2VudFJld2FyZExlZGdlcl8xLkFnZW50UmV3YXJkTGVkZ2VyLmdldCgoMCwgdXRpbHNfMS5hZ2VudFJld2FyZExlZGdlckVudGl0eUlkKShpZGVudGl0eUlkLCBhZ2VudElkKSk7XG4gICAgcmV0dXJuIGV4aXN0aW5nXG4gICAgICAgID8ge1xuICAgICAgICAgICAgY2xhaW1hYmxlVG90YWw6IGV4aXN0aW5nLmNsYWltYWJsZVRvdGFsLFxuICAgICAgICAgICAgY2xhaW1lZFRvdGFsOiBleGlzdGluZy5jbGFpbWVkVG90YWwsXG4gICAgICAgICAgICBjbGFpbWFibGVCYXNlOiBleGlzdGluZy5jbGFpbWFibGVCYXNlLFxuICAgICAgICAgICAgY2xhaW1hYmxlT2JzZXJ2ZXI6IGV4aXN0aW5nLmNsYWltYWJsZU9ic2VydmVyLFxuICAgICAgICAgICAgY2xhaW1hYmxlUmV2aWV3ZXI6IGV4aXN0aW5nLmNsYWltYWJsZVJldmlld2VyLFxuICAgICAgICAgICAgY2xhaW1hYmxlVGFzazogZXhpc3RpbmcuY2xhaW1hYmxlVGFzayxcbiAgICAgICAgICAgIGNsYWltZWRCYXNlOiBleGlzdGluZy5jbGFpbWVkQmFzZSxcbiAgICAgICAgICAgIGNsYWltZWRPYnNlcnZlcjogZXhpc3RpbmcuY2xhaW1lZE9ic2VydmVyLFxuICAgICAgICAgICAgY2xhaW1lZFJldmlld2VyOiBleGlzdGluZy5jbGFpbWVkUmV2aWV3ZXIsXG4gICAgICAgICAgICBjbGFpbWVkVGFzazogZXhpc3RpbmcuY2xhaW1lZFRhc2ssXG4gICAgICAgIH1cbiAgICAgICAgOiB6ZXJvU25hcHNob3QoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHNhdmVSZXdhcmRMZWRnZXJTbmFwc2hvdChldmVudCwgaWRlbnRpdHlJZCwgYWdlbnRJZCwgc25hcHNob3QpIHtcbiAgICBjb25zdCBpZCA9ICgwLCB1dGlsc18xLmFnZW50UmV3YXJkTGVkZ2VyRW50aXR5SWQpKGlkZW50aXR5SWQsIGFnZW50SWQpO1xuICAgIGNvbnN0IGxlZGdlciA9IEFnZW50UmV3YXJkTGVkZ2VyXzEuQWdlbnRSZXdhcmRMZWRnZXIuY3JlYXRlKE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7IGlkLCBjaGFpbklkOiB1dGlsc18xLkNIQUlOX0lELCBpZGVudGl0eUlkLFxuICAgICAgICBhZ2VudElkIH0sIHNuYXBzaG90KSwgeyB1cGRhdGVkQXRCbG9jazogYmxvY2tOdW0oZXZlbnQuYmxvY2spIH0pKTtcbiAgICBhd2FpdCBsZWRnZXIuc2F2ZSgpO1xufVxuYXN5bmMgZnVuY3Rpb24gdXBzZXJ0UmV3YXJkRGF5U3RhdGUoZXZlbnQsIGRheUluZGV4KSB7XG4gICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2osIF9rLCBfbCwgX207XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgYXBpLnF1ZXJ5LmFnZW50SW5jZW50aXZlcy5kYWlseUVtaXNzaW9uU3RhdGVzKGRheUluZGV4KTtcbiAgICAgICAgY29uc3QganNvbiA9IHJlY29yZC50b0pTT04oKTtcbiAgICAgICAgaWYgKCFqc29uKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCByb3cgPSBSZXdhcmREYXlTdGF0ZV8xLlJld2FyZERheVN0YXRlLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogKDAsIHV0aWxzXzEucmV3YXJkRGF5U3RhdGVFbnRpdHlJZCkoZGF5SW5kZXgpLFxuICAgICAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgICAgIGRheUluZGV4LFxuICAgICAgICAgICAgYmFzZVN0YWtpbmdCdWRnZXQ6IGJpZygoX2EgPSBqc29uW1wiYmFzZVN0YWtpbmdCdWRnZXRcIl0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDApLFxuICAgICAgICAgICAgb2JzZXJ2ZXJSZXZpZXdlckJ1ZGdldDogYmlnKChfYiA9IGpzb25bXCJvYnNlcnZlclJldmlld2VyQnVkZ2V0XCJdKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAwKSxcbiAgICAgICAgICAgIHRhc2tNYXJrZXRCdWRnZXQ6IGJpZygoX2MgPSBqc29uW1widGFza01hcmtldEJ1ZGdldFwiXSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogMCksXG4gICAgICAgICAgICBiYXNlU3Rha2luZ1JlbGVhc2VkOiBiaWcoKF9kID0ganNvbltcImJhc2VTdGFraW5nUmVsZWFzZWRcIl0pICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IDApLFxuICAgICAgICAgICAgb2JzZXJ2ZXJSZXZpZXdlclJlbGVhc2VkOiBiaWcoKF9lID0ganNvbltcIm9ic2VydmVyUmV2aWV3ZXJSZWxlYXNlZFwiXSkgIT09IG51bGwgJiYgX2UgIT09IHZvaWQgMCA/IF9lIDogMCksXG4gICAgICAgICAgICB0YXNrTWFya2V0UmVsZWFzZWQ6IGJpZygoX2YgPSBqc29uW1widGFza01hcmtldFJlbGVhc2VkXCJdKSAhPT0gbnVsbCAmJiBfZiAhPT0gdm9pZCAwID8gX2YgOiAwKSxcbiAgICAgICAgICAgIHJvbGxvdmVyQmFzZVN0YWtpbmc6IGJpZygoX2cgPSBqc29uW1wicm9sbG92ZXJCYXNlU3Rha2luZ1wiXSkgIT09IG51bGwgJiYgX2cgIT09IHZvaWQgMCA/IF9nIDogMCksXG4gICAgICAgICAgICByb2xsb3Zlck9ic2VydmVyUmV2aWV3ZXI6IGJpZygoX2ggPSBqc29uW1wicm9sbG92ZXJPYnNlcnZlclJldmlld2VyXCJdKSAhPT0gbnVsbCAmJiBfaCAhPT0gdm9pZCAwID8gX2ggOiAwKSxcbiAgICAgICAgICAgIHJvbGxvdmVyVGFza01hcmtldDogYmlnKChfaiA9IGpzb25bXCJyb2xsb3ZlclRhc2tNYXJrZXRcIl0pICE9PSBudWxsICYmIF9qICE9PSB2b2lkIDAgPyBfaiA6IDApLFxuICAgICAgICAgICAgYmFzZVN0YWtpbmdTZXR0bGVkOiBCb29sZWFuKGpzb25bXCJiYXNlU3Rha2luZ1NldHRsZWRcIl0pLFxuICAgICAgICAgICAgb2JzZXJ2ZXJSb3VuZHNTZXR0bGVkOiBOdW1iZXIoKF9rID0ganNvbltcIm9ic2VydmVyUm91bmRzU2V0dGxlZFwiXSkgIT09IG51bGwgJiYgX2sgIT09IHZvaWQgMCA/IF9rIDogMCksXG4gICAgICAgICAgICByZXZpZXdlclJvdW5kc1NldHRsZWQ6IE51bWJlcigoX2wgPSBqc29uW1wicmV2aWV3ZXJSb3VuZHNTZXR0bGVkXCJdKSAhPT0gbnVsbCAmJiBfbCAhPT0gdm9pZCAwID8gX2wgOiAwKSxcbiAgICAgICAgICAgIHRhc2tSZXdhcmRzU2V0dGxlZDogTnVtYmVyKChfbSA9IGpzb25bXCJ0YXNrUmV3YXJkc1NldHRsZWRcIl0pICE9PSBudWxsICYmIF9tICE9PSB2b2lkIDAgPyBfbSA6IDApLFxuICAgICAgICAgICAgdXBkYXRlZEF0QmxvY2s6IGJsb2NrTnVtKGV2ZW50LmJsb2NrKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGF3YWl0IHJvdy5zYXZlKCk7XG4gICAgfVxuICAgIGNhdGNoIChjYXVzZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oYGFnZW50SW5jZW50aXZlcyBkYXkgc3RvcmFnZSByZWFkIGZhaWxlZCBmb3IgZGF5ICR7ZGF5SW5kZXh9OiAke2NhdXNlIGluc3RhbmNlb2YgRXJyb3IgPyBjYXVzZS5tZXNzYWdlIDogU3RyaW5nKGNhdXNlKX1gKTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiBhcHBlbmRSZXdhcmRFdmVudChldmVudCwgaW5wdXQpIHtcbiAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZjtcbiAgICBjb25zdCBibiA9IGJsb2NrTnVtKGV2ZW50LmJsb2NrKTtcbiAgICBjb25zdCBldmVudEluZGV4ID0gKF9hID0gZXZlbnQuaWR4KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAwO1xuICAgIGNvbnN0IHJvdyA9IEFnZW50UmV3YXJkRXZlbnRfMS5BZ2VudFJld2FyZEV2ZW50LmNyZWF0ZSh7XG4gICAgICAgIGlkOiAoMCwgdXRpbHNfMS5hZ2VudFJld2FyZEV2ZW50RW50aXR5SWQpKGlucHV0LmlkZW50aXR5SWQsIGlucHV0LmFnZW50SWQsIGJuLCBldmVudEluZGV4LCBpbnB1dC5ldmVudFR5cGUpLFxuICAgICAgICBjaGFpbklkOiB1dGlsc18xLkNIQUlOX0lELFxuICAgICAgICBpZGVudGl0eUlkOiBpbnB1dC5pZGVudGl0eUlkLFxuICAgICAgICBhZ2VudElkOiBpbnB1dC5hZ2VudElkLFxuICAgICAgICBldmVudFR5cGU6IGlucHV0LmV2ZW50VHlwZSxcbiAgICAgICAgcmV3YXJkS2luZDogaW5wdXQucmV3YXJkS2luZCxcbiAgICAgICAgYW1vdW50OiBpbnB1dC5hbW91bnQsXG4gICAgICAgIGJhc2VBbW91bnQ6IChfYiA9IGlucHV0LmJhc2VBbW91bnQpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IEJpZ0ludCgwKSxcbiAgICAgICAgb2JzZXJ2ZXJBbW91bnQ6IChfYyA9IGlucHV0Lm9ic2VydmVyQW1vdW50KSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiBCaWdJbnQoMCksXG4gICAgICAgIHJldmlld2VyQW1vdW50OiAoX2QgPSBpbnB1dC5yZXZpZXdlckFtb3VudCkgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogQmlnSW50KDApLFxuICAgICAgICB0YXNrQW1vdW50OiAoX2UgPSBpbnB1dC50YXNrQW1vdW50KSAhPT0gbnVsbCAmJiBfZSAhPT0gdm9pZCAwID8gX2UgOiBCaWdJbnQoMCksXG4gICAgICAgIGRheUluZGV4OiBpbnB1dC5kYXlJbmRleCxcbiAgICAgICAgcm91bmRJZDogaW5wdXQucm91bmRJZCxcbiAgICAgICAgdGFza0lkOiBpbnB1dC50YXNrSWQsXG4gICAgICAgIG93bmVyQWNjb3VudDogaW5wdXQub3duZXJBY2NvdW50LFxuICAgICAgICBibG9ja051bWJlcjogYm4sXG4gICAgICAgIGV4dHJpbnNpY0luZGV4OiBleHRyaW5zaWNJbmRleChldmVudCksXG4gICAgICAgIGV2ZW50SW5kZXgsXG4gICAgICAgIGJsb2NrSGFzaDogZXZlbnQuYmxvY2suYmxvY2suaGVhZGVyLmhhc2gudG9IZXgoKSxcbiAgICAgICAgdGltZXN0YW1wOiAoX2YgPSBldmVudC5ibG9jay50aW1lc3RhbXApICE9PSBudWxsICYmIF9mICE9PSB2b2lkIDAgPyBfZiA6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgICBhd2FpdCByb3cuc2F2ZSgpO1xufVxuZnVuY3Rpb24gbm9ybWFsaXplUmV3YXJkS2luZCh2YWx1ZSkge1xuICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcbiAgICBjb25zdCBqc29uID0gKF9jID0gKF9iID0gKF9hID0gdmFsdWUpLnRvSlNPTikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoX2EpKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiB2YWx1ZTtcbiAgICBpZiAodHlwZW9mIGpzb24gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29uc3QgbG93ZXIgPSBqc29uLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChsb3dlciA9PT0gXCJvYnNlcnZlclwiKVxuICAgICAgICAgICAgcmV0dXJuIFwiT2JzZXJ2ZXJcIjtcbiAgICAgICAgaWYgKGxvd2VyID09PSBcInJldmlld2VyXCIpXG4gICAgICAgICAgICByZXR1cm4gXCJSZXZpZXdlclwiO1xuICAgICAgICBpZiAobG93ZXIgPT09IFwidGFza1wiKVxuICAgICAgICAgICAgcmV0dXJuIFwiVGFza1wiO1xuICAgICAgICByZXR1cm4gXCJCYXNlXCI7XG4gICAgfVxuICAgIGlmIChqc29uICYmIHR5cGVvZiBqc29uID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IChfZCA9IE9iamVjdC5rZXlzKGpzb24pWzBdKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJvYnNlcnZlclwiKVxuICAgICAgICAgICAgcmV0dXJuIFwiT2JzZXJ2ZXJcIjtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJyZXZpZXdlclwiKVxuICAgICAgICAgICAgcmV0dXJuIFwiUmV2aWV3ZXJcIjtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJ0YXNrXCIpXG4gICAgICAgICAgICByZXR1cm4gXCJUYXNrXCI7XG4gICAgfVxuICAgIHJldHVybiBcIkJhc2VcIjtcbn1cbmZ1bmN0aW9uIGNyZWRpdFNuYXBzaG90KHNuYXBzaG90LCBraW5kLCBhbW91bnQpIHtcbiAgICBjb25zdCBuZXh0ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBzbmFwc2hvdCksIHsgY2xhaW1hYmxlVG90YWw6IHNuYXBzaG90LmNsYWltYWJsZVRvdGFsICsgYW1vdW50IH0pO1xuICAgIGlmIChraW5kID09PSBcIkJhc2VcIilcbiAgICAgICAgbmV4dC5jbGFpbWFibGVCYXNlICs9IGFtb3VudDtcbiAgICBpZiAoa2luZCA9PT0gXCJPYnNlcnZlclwiKVxuICAgICAgICBuZXh0LmNsYWltYWJsZU9ic2VydmVyICs9IGFtb3VudDtcbiAgICBpZiAoa2luZCA9PT0gXCJSZXZpZXdlclwiKVxuICAgICAgICBuZXh0LmNsYWltYWJsZVJldmlld2VyICs9IGFtb3VudDtcbiAgICBpZiAoa2luZCA9PT0gXCJUYXNrXCIpXG4gICAgICAgIG5leHQuY2xhaW1hYmxlVGFzayArPSBhbW91bnQ7XG4gICAgcmV0dXJuIG5leHQ7XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVBZ2VudFJld2FyZENyZWRpdGVkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBldmVudC5ldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGFnZW50SWQgPSBzdHIoZGF0YVsxXSk7XG4gICAgY29uc3QgZGF5SW5kZXggPSBudW0oZGF0YVsyXSk7XG4gICAgY29uc3Qga2luZCA9IG5vcm1hbGl6ZVJld2FyZEtpbmQoZGF0YVszXSk7XG4gICAgY29uc3QgYW1vdW50ID0gYmlnKGRhdGFbNF0pO1xuICAgIGNvbnN0IHByZXZpb3VzID0gYXdhaXQgcmVhZEluZGV4ZWRSZXdhcmRMZWRnZXIoaWRlbnRpdHlJZCwgYWdlbnRJZCk7XG4gICAgYXdhaXQgc2F2ZVJld2FyZExlZGdlclNuYXBzaG90KGV2ZW50LCBpZGVudGl0eUlkLCBhZ2VudElkLCBjcmVkaXRTbmFwc2hvdChwcmV2aW91cywga2luZCwgYW1vdW50KSk7XG4gICAgYXdhaXQgYXBwZW5kUmV3YXJkRXZlbnQoZXZlbnQsIHtcbiAgICAgICAgaWRlbnRpdHlJZCxcbiAgICAgICAgYWdlbnRJZCxcbiAgICAgICAgZXZlbnRUeXBlOiBcIkFnZW50UmV3YXJkQ3JlZGl0ZWRcIixcbiAgICAgICAgcmV3YXJkS2luZDoga2luZCxcbiAgICAgICAgYW1vdW50LFxuICAgICAgICBiYXNlQW1vdW50OiBraW5kID09PSBcIkJhc2VcIiA/IGFtb3VudCA6IHVuZGVmaW5lZCxcbiAgICAgICAgb2JzZXJ2ZXJBbW91bnQ6IGtpbmQgPT09IFwiT2JzZXJ2ZXJcIiA/IGFtb3VudCA6IHVuZGVmaW5lZCxcbiAgICAgICAgcmV2aWV3ZXJBbW91bnQ6IGtpbmQgPT09IFwiUmV2aWV3ZXJcIiA/IGFtb3VudCA6IHVuZGVmaW5lZCxcbiAgICAgICAgdGFza0Ftb3VudDoga2luZCA9PT0gXCJUYXNrXCIgPyBhbW91bnQgOiB1bmRlZmluZWQsXG4gICAgICAgIGRheUluZGV4LFxuICAgIH0pO1xufVxuZXhwb3J0cy5oYW5kbGVBZ2VudFJld2FyZENyZWRpdGVkID0gaGFuZGxlQWdlbnRSZXdhcmRDcmVkaXRlZDtcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUJhc2VTdGFraW5nRGF5U2V0dGxlZChldmVudCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gZXZlbnQuZXZlbnQ7XG4gICAgY29uc3QgZGF5SW5kZXggPSBudW0oZGF0YVswXSk7XG4gICAgYXdhaXQgdXBzZXJ0UmV3YXJkRGF5U3RhdGUoZXZlbnQsIGRheUluZGV4KTtcbn1cbmV4cG9ydHMuaGFuZGxlQmFzZVN0YWtpbmdEYXlTZXR0bGVkID0gaGFuZGxlQmFzZVN0YWtpbmdEYXlTZXR0bGVkO1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUm91bmRTZXR0bGVkKGV2ZW50LCByb2xlKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBldmVudC5ldmVudDtcbiAgICBjb25zdCByb3VuZElkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGRheUluZGV4ID0gbnVtKGRhdGFbMV0pO1xuICAgIGNvbnN0IHBhcnRpY2lwYW50Q291bnQgPSBudW0oZGF0YVsyXSk7XG4gICAgY29uc3QgdG90YWxFZmZlY3RpdmVTdGFrZSA9IGJpZyhkYXRhWzNdKTtcbiAgICBjb25zdCByZWxlYXNlZCA9IGJpZyhkYXRhWzRdKTtcbiAgICBjb25zdCByb2xsb3ZlciA9IGJpZyhkYXRhWzVdKTtcbiAgICBhd2FpdCB1cHNlcnRSZXdhcmREYXlTdGF0ZShldmVudCwgZGF5SW5kZXgpO1xuICAgIGNvbnN0IHNldHRsZW1lbnQgPSBSb3VuZFJld2FyZFNldHRsZW1lbnRfMS5Sb3VuZFJld2FyZFNldHRsZW1lbnQuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICgwLCB1dGlsc18xLnJvdW5kUmV3YXJkU2V0dGxlbWVudEVudGl0eUlkKShyb2xlLCByb3VuZElkKSxcbiAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgcm91bmRJZCxcbiAgICAgICAgcm9sZSxcbiAgICAgICAgZGF5SW5kZXgsXG4gICAgICAgIHBhcnRpY2lwYW50Q291bnQsXG4gICAgICAgIHRvdGFsRWZmZWN0aXZlU3Rha2UsXG4gICAgICAgIHJlbGVhc2VkLFxuICAgICAgICByb2xsb3ZlcixcbiAgICAgICAgYmxvY2tOdW1iZXI6IGJsb2NrTnVtKGV2ZW50LmJsb2NrKSxcbiAgICB9KTtcbiAgICBhd2FpdCBzZXR0bGVtZW50LnNhdmUoKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZU9ic2VydmVyUm91bmRTZXR0bGVkKGV2ZW50KSB7XG4gICAgYXdhaXQgaGFuZGxlUm91bmRTZXR0bGVkKGV2ZW50LCBcIk9ic2VydmVyXCIpO1xufVxuZXhwb3J0cy5oYW5kbGVPYnNlcnZlclJvdW5kU2V0dGxlZCA9IGhhbmRsZU9ic2VydmVyUm91bmRTZXR0bGVkO1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUmV2aWV3ZXJSb3VuZFNldHRsZWQoZXZlbnQpIHtcbiAgICBhd2FpdCBoYW5kbGVSb3VuZFNldHRsZWQoZXZlbnQsIFwiUmV2aWV3ZXJcIik7XG59XG5leHBvcnRzLmhhbmRsZVJldmlld2VyUm91bmRTZXR0bGVkID0gaGFuZGxlUmV2aWV3ZXJSb3VuZFNldHRsZWQ7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVUYXNrUmV3YXJkU2V0dGxlZChldmVudCkge1xuICAgIHZhciBfYSwgX2IsIF9jO1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gZXZlbnQuZXZlbnQ7XG4gICAgY29uc3QgdGFza0lkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGRheUluZGV4ID0gbnVtKGRhdGFbMV0pO1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVsyXSk7XG4gICAgY29uc3QgYWdlbnRJZCA9IHN0cihkYXRhWzNdKTtcbiAgICBjb25zdCBkaWZmaWN1bHR5SnNvbiA9IChfYyA9IChfYiA9IChfYSA9IGRhdGFbNF0pLnRvSlNPTikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoX2EpKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiBkYXRhWzRdO1xuICAgIGNvbnN0IGRpZmZpY3VsdHkgPSB0eXBlb2YgZGlmZmljdWx0eUpzb24gPT09IFwic3RyaW5nXCIgPyBkaWZmaWN1bHR5SnNvbiA6IEpTT04uc3RyaW5naWZ5KGRpZmZpY3VsdHlKc29uKTtcbiAgICBjb25zdCBhbW91bnQgPSBiaWcoZGF0YVs1XSk7XG4gICAgYXdhaXQgdXBzZXJ0UmV3YXJkRGF5U3RhdGUoZXZlbnQsIGRheUluZGV4KTtcbiAgICBjb25zdCBzZXR0bGVtZW50ID0gVGFza1Jld2FyZFNldHRsZW1lbnRfMS5UYXNrUmV3YXJkU2V0dGxlbWVudC5jcmVhdGUoe1xuICAgICAgICBpZDogKDAsIHV0aWxzXzEudGFza1Jld2FyZFNldHRsZW1lbnRFbnRpdHlJZCkodGFza0lkKSxcbiAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgdGFza0lkLFxuICAgICAgICBpZGVudGl0eUlkLFxuICAgICAgICBhZ2VudElkLFxuICAgICAgICBkaWZmaWN1bHR5LFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIGRheUluZGV4LFxuICAgICAgICBibG9ja051bWJlcjogYmxvY2tOdW0oZXZlbnQuYmxvY2spLFxuICAgIH0pO1xuICAgIGF3YWl0IHNldHRsZW1lbnQuc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVUYXNrUmV3YXJkU2V0dGxlZCA9IGhhbmRsZVRhc2tSZXdhcmRTZXR0bGVkO1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQWdlbnRSZXdhcmRDbGFpbWVkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBldmVudC5ldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGFnZW50SWQgPSBzdHIoZGF0YVsxXSk7XG4gICAgY29uc3Qgb3duZXJBY2NvdW50ID0gc3RyKGRhdGFbMl0pO1xuICAgIGNvbnN0IGFtb3VudCA9IGJpZyhkYXRhWzNdKTtcbiAgICBjb25zdCBzbmFwc2hvdCA9IGF3YWl0IGZldGNoUmV3YXJkTGVkZ2VyKGlkZW50aXR5SWQsIGFnZW50SWQpO1xuICAgIGF3YWl0IHNhdmVSZXdhcmRMZWRnZXJTbmFwc2hvdChldmVudCwgaWRlbnRpdHlJZCwgYWdlbnRJZCwgc25hcHNob3QpO1xuICAgIGF3YWl0IGFwcGVuZFJld2FyZEV2ZW50KGV2ZW50LCB7XG4gICAgICAgIGlkZW50aXR5SWQsXG4gICAgICAgIGFnZW50SWQsXG4gICAgICAgIGV2ZW50VHlwZTogXCJBZ2VudFJld2FyZENsYWltZWRcIixcbiAgICAgICAgcmV3YXJkS2luZDogXCJDbGFpbVwiLFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIGJhc2VBbW91bnQ6IHNuYXBzaG90LmNsYWltZWRCYXNlLFxuICAgICAgICBvYnNlcnZlckFtb3VudDogc25hcHNob3QuY2xhaW1lZE9ic2VydmVyLFxuICAgICAgICByZXZpZXdlckFtb3VudDogc25hcHNob3QuY2xhaW1lZFJldmlld2VyLFxuICAgICAgICB0YXNrQW1vdW50OiBzbmFwc2hvdC5jbGFpbWVkVGFzayxcbiAgICAgICAgb3duZXJBY2NvdW50LFxuICAgIH0pO1xufVxuZXhwb3J0cy5oYW5kbGVBZ2VudFJld2FyZENsYWltZWQgPSBoYW5kbGVBZ2VudFJld2FyZENsYWltZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogTWFwcGluZyBoYW5kbGVycyBmb3IgcGFsbGV0X2FnZW50X3N0YWtpbmcgZXZlbnRzLlxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhbmRsZUFnZW50U3Rha2VSZWxlYXNlZCA9IGV4cG9ydHMuaGFuZGxlQWdlbnRTdGFrZVJlbGVhc2VDbGVhcmVkID0gZXhwb3J0cy5oYW5kbGVBZ2VudFN0YWtlUmVsZWFzZUJsb2NrZWQgPSBleHBvcnRzLmhhbmRsZUFnZW50U3Rha2VVbmJvbmRDYW5jZWxsZWQgPSBleHBvcnRzLmhhbmRsZUFnZW50U3Rha2VVbmJvbmRSZXF1ZXN0ZWQgPSBleHBvcnRzLmhhbmRsZUFnZW50U3Rha2VCb25kZWQgPSB2b2lkIDA7XG5jb25zdCBBZ2VudFN0YWtlRXZlbnRfMSA9IHJlcXVpcmUoXCIuLi90eXBlcy9tb2RlbHMvQWdlbnRTdGFrZUV2ZW50XCIpO1xuY29uc3QgQWdlbnRTdGFrZUxlZGdlcl8xID0gcmVxdWlyZShcIi4uL3R5cGVzL21vZGVscy9BZ2VudFN0YWtlTGVkZ2VyXCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xuZnVuY3Rpb24gc3RyKHYpIHtcbiAgICByZXR1cm4gdi50b1N0cmluZygpO1xufVxuZnVuY3Rpb24gYmxvY2tOdW0oYmxvY2spIHtcbiAgICByZXR1cm4gQmlnSW50KGJsb2NrLmJsb2NrLmhlYWRlci5udW1iZXIudG9TdHJpbmcoKSk7XG59XG5mdW5jdGlvbiBleHRyaW5zaWNJbmRleChldmVudCkge1xuICAgIHZhciBfYTtcbiAgICByZXR1cm4gZXZlbnQuZXh0cmluc2ljID8gKF9hID0gZXZlbnQuZXh0cmluc2ljLmlkeCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogdW5kZWZpbmVkIDogdW5kZWZpbmVkO1xufVxuZnVuY3Rpb24gcmVmVG9TdHJpbmcodikge1xuICAgIHZhciBfYSwgX2IsIF9jO1xuICAgIGlmICh2ID09IG51bGwpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QganNvbiA9IChfYyA9IChfYiA9IChfYSA9IHYpLnRvSlNPTikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoX2EpKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiB2O1xuICAgIGlmIChqc29uID09IG51bGwpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgaWYgKHR5cGVvZiBqc29uID09PSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4ganNvbjtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoanNvbik7XG59XG5hc3luYyBmdW5jdGlvbiBhcHBlbmRTdGFrZUV2ZW50KGV2ZW50LCBpbnB1dCkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgY29uc3QgYm4gPSBibG9ja051bShldmVudC5ibG9jayk7XG4gICAgY29uc3QgZXZlbnRJbmRleCA9IChfYSA9IGV2ZW50LmlkeCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMDtcbiAgICBjb25zdCByb3cgPSBBZ2VudFN0YWtlRXZlbnRfMS5BZ2VudFN0YWtlRXZlbnQuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICgwLCB1dGlsc18xLmFnZW50U3Rha2VFdmVudEVudGl0eUlkKShpbnB1dC5pZGVudGl0eUlkLCBpbnB1dC5hZ2VudElkLCBibiwgZXZlbnRJbmRleCksXG4gICAgICAgIGNoYWluSWQ6IHV0aWxzXzEuQ0hBSU5fSUQsXG4gICAgICAgIGlkZW50aXR5SWQ6IGlucHV0LmlkZW50aXR5SWQsXG4gICAgICAgIGFnZW50SWQ6IGlucHV0LmFnZW50SWQsXG4gICAgICAgIGZ1bmRpbmdBY2NvdW50OiBpbnB1dC5mdW5kaW5nQWNjb3VudCxcbiAgICAgICAgZXZlbnRUeXBlOiBpbnB1dC5ldmVudFR5cGUsXG4gICAgICAgIGFtb3VudDogaW5wdXQuYW1vdW50LFxuICAgICAgICBhY3RpdmVBbW91bnQ6IGlucHV0LmFjdGl2ZUFtb3VudCxcbiAgICAgICAgdW5sb2NrQXRCbG9jazogaW5wdXQudW5sb2NrQXRCbG9jayxcbiAgICAgICAgcmVhc29uUmVmOiBpbnB1dC5yZWFzb25SZWYsXG4gICAgICAgIGJsb2NrTnVtYmVyOiBibixcbiAgICAgICAgZXh0cmluc2ljSW5kZXg6IGV4dHJpbnNpY0luZGV4KGV2ZW50KSxcbiAgICAgICAgZXZlbnRJbmRleCxcbiAgICAgICAgYmxvY2tIYXNoOiBldmVudC5ibG9jay5ibG9jay5oZWFkZXIuaGFzaC50b0hleCgpLFxuICAgICAgICB0aW1lc3RhbXA6IChfYiA9IGV2ZW50LmJsb2NrLnRpbWVzdGFtcCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICAgIGF3YWl0IHJvdy5zYXZlKCk7XG59XG5hc3luYyBmdW5jdGlvbiB1cHNlcnRMZWRnZXIoZXZlbnQsIGlucHV0KSB7XG4gICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2osIF9rO1xuICAgIGNvbnN0IGlkID0gKDAsIHV0aWxzXzEuYWdlbnRTdGFrZUxlZGdlckVudGl0eUlkKShpbnB1dC5pZGVudGl0eUlkLCBpbnB1dC5hZ2VudElkKTtcbiAgICBjb25zdCBleGlzdGluZyA9IGF3YWl0IEFnZW50U3Rha2VMZWRnZXJfMS5BZ2VudFN0YWtlTGVkZ2VyLmdldChpZCk7XG4gICAgY29uc3QgemVybyA9IEJpZ0ludCgwKTtcbiAgICBjb25zdCBhY3RpdmVBbW91bnQgPSAoX2EgPSBpbnB1dC5hY3RpdmVBbW91bnQpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICgoKF9iID0gZXhpc3RpbmcgPT09IG51bGwgfHwgZXhpc3RpbmcgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGV4aXN0aW5nLmFjdGl2ZUFtb3VudCkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogemVybykgKyAoKF9jID0gaW5wdXQuYWN0aXZlRGVsdGEpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IHplcm8pKTtcbiAgICBjb25zdCB1bmJvbmRpbmdBbW91bnQgPSAoKF9kID0gZXhpc3RpbmcgPT09IG51bGwgfHwgZXhpc3RpbmcgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGV4aXN0aW5nLnVuYm9uZGluZ0Ftb3VudCkgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogemVybykgKyAoKF9lID0gaW5wdXQudW5ib25kaW5nRGVsdGEpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IHplcm8pO1xuICAgIGNvbnN0IHJlbGVhc2VCbG9ja2VkID0gKF9nID0gKF9mID0gaW5wdXQucmVsZWFzZUJsb2NrZWQpICE9PSBudWxsICYmIF9mICE9PSB2b2lkIDAgPyBfZiA6IGV4aXN0aW5nID09PSBudWxsIHx8IGV4aXN0aW5nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBleGlzdGluZy5yZWxlYXNlQmxvY2tlZCkgIT09IG51bGwgJiYgX2cgIT09IHZvaWQgMCA/IF9nIDogZmFsc2U7XG4gICAgY29uc3Qgc3RhdHVzID0gYWN0aXZlQW1vdW50ID4gemVybyA/IFwiQWN0aXZlXCIgOiB1bmJvbmRpbmdBbW91bnQgPiB6ZXJvID8gXCJVbmJvbmRpbmdcIiA6IFwiUmVsZWFzZWRcIjtcbiAgICBjb25zdCBsZWRnZXIgPSBBZ2VudFN0YWtlTGVkZ2VyXzEuQWdlbnRTdGFrZUxlZGdlci5jcmVhdGUoe1xuICAgICAgICBpZCxcbiAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgaWRlbnRpdHlJZDogaW5wdXQuaWRlbnRpdHlJZCxcbiAgICAgICAgYWdlbnRJZDogaW5wdXQuYWdlbnRJZCxcbiAgICAgICAgZnVuZGluZ0FjY291bnQ6IChfaCA9IGlucHV0LmZ1bmRpbmdBY2NvdW50KSAhPT0gbnVsbCAmJiBfaCAhPT0gdm9pZCAwID8gX2ggOiBleGlzdGluZyA9PT0gbnVsbCB8fCBleGlzdGluZyA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXhpc3RpbmcuZnVuZGluZ0FjY291bnQsXG4gICAgICAgIGFjdGl2ZUFtb3VudCxcbiAgICAgICAgdW5ib25kaW5nQW1vdW50LFxuICAgICAgICBzdGF0dXMsXG4gICAgICAgIHVubG9ja0F0QmxvY2s6IChfaiA9IGlucHV0LnVubG9ja0F0QmxvY2spICE9PSBudWxsICYmIF9qICE9PSB2b2lkIDAgPyBfaiA6IGV4aXN0aW5nID09PSBudWxsIHx8IGV4aXN0aW5nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBleGlzdGluZy51bmxvY2tBdEJsb2NrLFxuICAgICAgICByZWxlYXNlQmxvY2tlZCxcbiAgICAgICAgcmVsZWFzZUJsb2NrUmVhc29uOiBpbnB1dC5yZWxlYXNlQmxvY2tSZWFzb24gPT09IG51bGwgPyB1bmRlZmluZWQgOiAoX2sgPSBpbnB1dC5yZWxlYXNlQmxvY2tSZWFzb24pICE9PSBudWxsICYmIF9rICE9PSB2b2lkIDAgPyBfayA6IGV4aXN0aW5nID09PSBudWxsIHx8IGV4aXN0aW5nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBleGlzdGluZy5yZWxlYXNlQmxvY2tSZWFzb24sXG4gICAgICAgIHVwZGF0ZWRBdEJsb2NrOiBibG9ja051bShldmVudC5ibG9jayksXG4gICAgfSk7XG4gICAgYXdhaXQgbGVkZ2VyLnNhdmUoKTtcbiAgICByZXR1cm4gbGVkZ2VyO1xufVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQWdlbnRTdGFrZUJvbmRlZChldmVudCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gZXZlbnQuZXZlbnQ7XG4gICAgY29uc3QgaWRlbnRpdHlJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBhZ2VudElkID0gc3RyKGRhdGFbMV0pO1xuICAgIGNvbnN0IGZ1bmRpbmdBY2NvdW50ID0gc3RyKGRhdGFbMl0pO1xuICAgIGNvbnN0IGFtb3VudCA9IEJpZ0ludChzdHIoZGF0YVszXSkpO1xuICAgIGNvbnN0IGFjdGl2ZUFtb3VudCA9IEJpZ0ludChzdHIoZGF0YVs0XSkpO1xuICAgIGF3YWl0IHVwc2VydExlZGdlcihldmVudCwgeyBpZGVudGl0eUlkLCBhZ2VudElkLCBmdW5kaW5nQWNjb3VudCwgYWN0aXZlQW1vdW50IH0pO1xuICAgIGF3YWl0IGFwcGVuZFN0YWtlRXZlbnQoZXZlbnQsIHsgaWRlbnRpdHlJZCwgYWdlbnRJZCwgZnVuZGluZ0FjY291bnQsIGV2ZW50VHlwZTogXCJCb25kZWRcIiwgYW1vdW50LCBhY3RpdmVBbW91bnQgfSk7XG59XG5leHBvcnRzLmhhbmRsZUFnZW50U3Rha2VCb25kZWQgPSBoYW5kbGVBZ2VudFN0YWtlQm9uZGVkO1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQWdlbnRTdGFrZVVuYm9uZFJlcXVlc3RlZChldmVudCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gZXZlbnQuZXZlbnQ7XG4gICAgY29uc3QgaWRlbnRpdHlJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBhZ2VudElkID0gc3RyKGRhdGFbMV0pO1xuICAgIGNvbnN0IGZ1bmRpbmdBY2NvdW50ID0gc3RyKGRhdGFbMl0pO1xuICAgIGNvbnN0IGFtb3VudCA9IEJpZ0ludChzdHIoZGF0YVszXSkpO1xuICAgIGNvbnN0IHVubG9ja0F0QmxvY2sgPSBCaWdJbnQoc3RyKGRhdGFbNF0pKTtcbiAgICBhd2FpdCB1cHNlcnRMZWRnZXIoZXZlbnQsIHsgaWRlbnRpdHlJZCwgYWdlbnRJZCwgZnVuZGluZ0FjY291bnQsIGFjdGl2ZURlbHRhOiAtYW1vdW50LCB1bmJvbmRpbmdEZWx0YTogYW1vdW50LCB1bmxvY2tBdEJsb2NrIH0pO1xuICAgIGF3YWl0IGFwcGVuZFN0YWtlRXZlbnQoZXZlbnQsIHsgaWRlbnRpdHlJZCwgYWdlbnRJZCwgZnVuZGluZ0FjY291bnQsIGV2ZW50VHlwZTogXCJVbmJvbmRSZXF1ZXN0ZWRcIiwgYW1vdW50LCB1bmxvY2tBdEJsb2NrIH0pO1xufVxuZXhwb3J0cy5oYW5kbGVBZ2VudFN0YWtlVW5ib25kUmVxdWVzdGVkID0gaGFuZGxlQWdlbnRTdGFrZVVuYm9uZFJlcXVlc3RlZDtcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUFnZW50U3Rha2VVbmJvbmRDYW5jZWxsZWQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGV2ZW50LmV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgYWdlbnRJZCA9IHN0cihkYXRhWzFdKTtcbiAgICBjb25zdCBmdW5kaW5nQWNjb3VudCA9IHN0cihkYXRhWzJdKTtcbiAgICBjb25zdCBhbW91bnQgPSBCaWdJbnQoc3RyKGRhdGFbM10pKTtcbiAgICBhd2FpdCB1cHNlcnRMZWRnZXIoZXZlbnQsIHsgaWRlbnRpdHlJZCwgYWdlbnRJZCwgZnVuZGluZ0FjY291bnQsIGFjdGl2ZURlbHRhOiBhbW91bnQsIHVuYm9uZGluZ0RlbHRhOiAtYW1vdW50IH0pO1xuICAgIGF3YWl0IGFwcGVuZFN0YWtlRXZlbnQoZXZlbnQsIHsgaWRlbnRpdHlJZCwgYWdlbnRJZCwgZnVuZGluZ0FjY291bnQsIGV2ZW50VHlwZTogXCJVbmJvbmRDYW5jZWxsZWRcIiwgYW1vdW50IH0pO1xufVxuZXhwb3J0cy5oYW5kbGVBZ2VudFN0YWtlVW5ib25kQ2FuY2VsbGVkID0gaGFuZGxlQWdlbnRTdGFrZVVuYm9uZENhbmNlbGxlZDtcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUFnZW50U3Rha2VSZWxlYXNlQmxvY2tlZChldmVudCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gZXZlbnQuZXZlbnQ7XG4gICAgY29uc3QgaWRlbnRpdHlJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBhZ2VudElkID0gc3RyKGRhdGFbMV0pO1xuICAgIGNvbnN0IHJlYXNvblJlZiA9IHJlZlRvU3RyaW5nKGRhdGFbMl0pO1xuICAgIGF3YWl0IHVwc2VydExlZGdlcihldmVudCwgeyBpZGVudGl0eUlkLCBhZ2VudElkLCByZWxlYXNlQmxvY2tlZDogdHJ1ZSwgcmVsZWFzZUJsb2NrUmVhc29uOiByZWFzb25SZWYgfSk7XG4gICAgYXdhaXQgYXBwZW5kU3Rha2VFdmVudChldmVudCwgeyBpZGVudGl0eUlkLCBhZ2VudElkLCBldmVudFR5cGU6IFwiUmVsZWFzZUJsb2NrZWRcIiwgcmVhc29uUmVmIH0pO1xufVxuZXhwb3J0cy5oYW5kbGVBZ2VudFN0YWtlUmVsZWFzZUJsb2NrZWQgPSBoYW5kbGVBZ2VudFN0YWtlUmVsZWFzZUJsb2NrZWQ7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVBZ2VudFN0YWtlUmVsZWFzZUNsZWFyZWQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGV2ZW50LmV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgYWdlbnRJZCA9IHN0cihkYXRhWzFdKTtcbiAgICBhd2FpdCB1cHNlcnRMZWRnZXIoZXZlbnQsIHsgaWRlbnRpdHlJZCwgYWdlbnRJZCwgcmVsZWFzZUJsb2NrZWQ6IGZhbHNlLCByZWxlYXNlQmxvY2tSZWFzb246IG51bGwgfSk7XG4gICAgYXdhaXQgYXBwZW5kU3Rha2VFdmVudChldmVudCwgeyBpZGVudGl0eUlkLCBhZ2VudElkLCBldmVudFR5cGU6IFwiUmVsZWFzZUNsZWFyZWRcIiB9KTtcbn1cbmV4cG9ydHMuaGFuZGxlQWdlbnRTdGFrZVJlbGVhc2VDbGVhcmVkID0gaGFuZGxlQWdlbnRTdGFrZVJlbGVhc2VDbGVhcmVkO1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQWdlbnRTdGFrZVJlbGVhc2VkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBldmVudC5ldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGFnZW50SWQgPSBzdHIoZGF0YVsxXSk7XG4gICAgY29uc3QgZnVuZGluZ0FjY291bnQgPSBzdHIoZGF0YVsyXSk7XG4gICAgY29uc3QgYW1vdW50ID0gQmlnSW50KHN0cihkYXRhWzNdKSk7XG4gICAgYXdhaXQgdXBzZXJ0TGVkZ2VyKGV2ZW50LCB7IGlkZW50aXR5SWQsIGFnZW50SWQsIGZ1bmRpbmdBY2NvdW50LCB1bmJvbmRpbmdEZWx0YTogLWFtb3VudCB9KTtcbiAgICBhd2FpdCBhcHBlbmRTdGFrZUV2ZW50KGV2ZW50LCB7IGlkZW50aXR5SWQsIGFnZW50SWQsIGZ1bmRpbmdBY2NvdW50LCBldmVudFR5cGU6IFwiUmVsZWFzZWRcIiwgYW1vdW50IH0pO1xufVxuZXhwb3J0cy5oYW5kbGVBZ2VudFN0YWtlUmVsZWFzZWQgPSBoYW5kbGVBZ2VudFN0YWtlUmVsZWFzZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaGFuZGxlQmxvY2sgPSB2b2lkIDA7XG5jb25zdCBDaGFpbkNoZWNrcG9pbnRfMSA9IHJlcXVpcmUoXCIuLi90eXBlcy9tb2RlbHMvQ2hhaW5DaGVja3BvaW50XCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQmxvY2soYmxvY2spIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGNvbnN0IGJsb2NrTnVtYmVyID0gQmlnSW50KGJsb2NrLmJsb2NrLmhlYWRlci5udW1iZXIudG9TdHJpbmcoKSk7XG4gICAgY29uc3QgYmxvY2tIYXNoID0gYmxvY2suYmxvY2suaGVhZGVyLmhhc2gudG9IZXgoKTtcbiAgICBsZXQgY2hlY2twb2ludCA9IGF3YWl0IENoYWluQ2hlY2twb2ludF8xLkNoYWluQ2hlY2twb2ludC5nZXQodXRpbHNfMS5DSEFJTl9JRCk7XG4gICAgaWYgKCFjaGVja3BvaW50KSB7XG4gICAgICAgIGNoZWNrcG9pbnQgPSBDaGFpbkNoZWNrcG9pbnRfMS5DaGFpbkNoZWNrcG9pbnQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiB1dGlsc18xLkNIQUlOX0lELFxuICAgICAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgICAgIGJsb2NrTnVtYmVyLFxuICAgICAgICAgICAgYmxvY2tIYXNoLFxuICAgICAgICAgICAgdXBkYXRlZEF0OiAoX2EgPSBibG9jay50aW1lc3RhbXApICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG5ldyBEYXRlKCksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY2hlY2twb2ludC5ibG9ja051bWJlciA9IGJsb2NrTnVtYmVyO1xuICAgICAgICBjaGVja3BvaW50LmJsb2NrSGFzaCA9IGJsb2NrSGFzaDtcbiAgICAgICAgY2hlY2twb2ludC51cGRhdGVkQXQgPSAoX2IgPSBibG9jay50aW1lc3RhbXApICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IG5ldyBEYXRlKCk7XG4gICAgfVxuICAgIGF3YWl0IGNoZWNrcG9pbnQuc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVCbG9jayA9IGhhbmRsZUJsb2NrO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIE1hcHBpbmcgaGFuZGxlcnMgZm9yIHBhbGxldF92aWJseV9lbWVyZ2VuY3kgZXZlbnRzLlxuICpcbiAqIEV2ZW50cyBoYW5kbGVkOiBQYXVzZWQsIFJlc3VtZWQsIENhbmNlbGxlZFxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhbmRsZUVtZXJnZW5jeUNhbmNlbGxlZCA9IGV4cG9ydHMuaGFuZGxlRW1lcmdlbmN5UmVzdW1lZCA9IGV4cG9ydHMuaGFuZGxlRW1lcmdlbmN5UGF1c2VkID0gdm9pZCAwO1xuY29uc3QgRW1lcmdlbmN5U3RhdHVzXzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvbW9kZWxzL0VtZXJnZW5jeVN0YXR1c1wiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbi8vIOKUgOKUgOKUgCBoZWxwZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuZnVuY3Rpb24gYmxvY2tOdW0oYmxvY2spIHtcbiAgICByZXR1cm4gQmlnSW50KGJsb2NrLmJsb2NrLmhlYWRlci5udW1iZXIudG9TdHJpbmcoKSk7XG59XG4vKiogU2VyaWFsaXplIEVtZXJnZW5jeVNjb3BlIGVudW0gdG8gYSBzdGFibGUgc3RyaW5nIGtleS4gKi9cbmZ1bmN0aW9uIHNlcmlhbGl6ZVNjb3BlKHNjb3BlUmF3KSB7XG4gICAgY29uc3QganNvbiA9IHNjb3BlUmF3LnRvSlNPTigpO1xuICAgIGlmICh0eXBlb2YganNvbiA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgcmV0dXJuIGpzb247XG4gICAgLy8gRW51bSB2YXJpYW50cyB3aXRoIGEgcGF5bG9hZCBjb21lIGFzIHsgdmFyaWFudE5hbWU6IHZhbHVlIH1cbiAgICBpZiAoanNvbiAhPT0gbnVsbCAmJiB0eXBlb2YganNvbiA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMoanNvbik7XG4gICAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgY29uc3QgW25hbWUsIHZhbF0gPSBlbnRyaWVzWzBdO1xuICAgICAgICAgICAgcmV0dXJuIGAke25hbWV9OiR7dmFsfWA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGpzb24pO1xufVxuZnVuY3Rpb24gb3B0SGV4KHJhdykge1xuICAgIGlmIChyYXcgPT09IG51bGwgfHwgcmF3ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJhdy50b1N0cmluZygpO1xufVxuYXN5bmMgZnVuY3Rpb24gdXBzZXJ0RW1lcmdlbmN5U3RhdHVzKGV2ZW50LCBzdGF0dXMpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IHNjb3BlID0gc2VyaWFsaXplU2NvcGUoZGF0YVswXSk7XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgLy8gUGF1c2VkOiAgW3Njb3BlLCBieSwgcmVhc29uX2hhc2hdXG4gICAgLy8gUmVzdW1lZDogW3Njb3BlLCByZWFzb25faGFzaF1cbiAgICAvLyBDYW5jZWxsZWQ6IFtzY29wZSwgcmVhc29uX2hhc2hdXG4gICAgbGV0IHVwZGF0ZWRCeTtcbiAgICBsZXQgcmVhc29uSGFzaDtcbiAgICBpZiAoc3RhdHVzID09PSBcIlBhdXNlZFwiKSB7XG4gICAgICAgIHVwZGF0ZWRCeSA9IGRhdGFbMV0udG9TdHJpbmcoKTtcbiAgICAgICAgcmVhc29uSGFzaCA9IG9wdEhleChkYXRhWzJdLnRvSlNPTigpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJlYXNvbkhhc2ggPSBvcHRIZXgoZGF0YVsxXS50b0pTT04oKSk7XG4gICAgfVxuICAgIGNvbnN0IGlkID0gKDAsIHV0aWxzXzEuZW1lcmdlbmN5U3RhdHVzRW50aXR5SWQpKHNjb3BlKTtcbiAgICBsZXQgZXMgPSBhd2FpdCBFbWVyZ2VuY3lTdGF0dXNfMS5FbWVyZ2VuY3lTdGF0dXMuZ2V0KGlkKTtcbiAgICBpZiAoIWVzKSB7XG4gICAgICAgIGVzID0gRW1lcmdlbmN5U3RhdHVzXzEuRW1lcmdlbmN5U3RhdHVzLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIGNoYWluSWQ6IHV0aWxzXzEuQ0hBSU5fSUQsXG4gICAgICAgICAgICBzY29wZSxcbiAgICAgICAgICAgIHN0YXR1cyxcbiAgICAgICAgICAgIHJlYXNvbkhhc2gsXG4gICAgICAgICAgICB1cGRhdGVkQnksXG4gICAgICAgICAgICB1cGRhdGVkQXRCbG9jazogYm4sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZXMuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICBlcy5yZWFzb25IYXNoID0gcmVhc29uSGFzaDtcbiAgICAgICAgZXMudXBkYXRlZEJ5ID0gdXBkYXRlZEJ5O1xuICAgICAgICBlcy51cGRhdGVkQXRCbG9jayA9IGJuO1xuICAgIH1cbiAgICBhd2FpdCBlcy5zYXZlKCk7XG59XG4vLyDilIDilIDilIAgSGFuZGxlcnMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVFbWVyZ2VuY3lQYXVzZWQoZXZlbnQpIHtcbiAgICBhd2FpdCB1cHNlcnRFbWVyZ2VuY3lTdGF0dXMoZXZlbnQsIFwiUGF1c2VkXCIpO1xufVxuZXhwb3J0cy5oYW5kbGVFbWVyZ2VuY3lQYXVzZWQgPSBoYW5kbGVFbWVyZ2VuY3lQYXVzZWQ7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVFbWVyZ2VuY3lSZXN1bWVkKGV2ZW50KSB7XG4gICAgYXdhaXQgdXBzZXJ0RW1lcmdlbmN5U3RhdHVzKGV2ZW50LCBcIkFjdGl2ZVwiKTtcbn1cbmV4cG9ydHMuaGFuZGxlRW1lcmdlbmN5UmVzdW1lZCA9IGhhbmRsZUVtZXJnZW5jeVJlc3VtZWQ7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVFbWVyZ2VuY3lDYW5jZWxsZWQoZXZlbnQpIHtcbiAgICBhd2FpdCB1cHNlcnRFbWVyZ2VuY3lTdGF0dXMoZXZlbnQsIFwiQ2FuY2VsbGVkXCIpO1xufVxuZXhwb3J0cy5oYW5kbGVFbWVyZ2VuY3lDYW5jZWxsZWQgPSBoYW5kbGVFbWVyZ2VuY3lDYW5jZWxsZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogTWFwcGluZyBoYW5kbGVycyBmb3IgcGFsbGV0X2lkZW50aXR5X2NvcmUgZXZlbnRzLlxuICpcbiAqIEV2ZW50cyBoYW5kbGVkOlxuICogICBJZGVudGl0eVJlZ2lzdGVyZWQsIE93bmVyS2V5Um90YXRlZCwgUmVjb3ZlcnlLZXlTZXQsXG4gKiAgIElkZW50aXR5S2V5QWRkZWQsIElkZW50aXR5S2V5UmV2b2tlZCxcbiAqICAgQWN0aXZlUHJvZmlsZVNldCwgQWN0aXZlQWdlbnRSZWdpc3RyeVNldCwgQWN0aXZlQXV0aFJlZ2lzdHJ5U2V0LCBBY3RpdmVSZWxhdGlvblBvbGljeVNldCxcbiAqICAgVHJhbnNwb3J0Qm91bmQsIFRyYW5zcG9ydFZlcmlmaWVkLCBUcmFuc3BvcnRSZXZva2VkLFxuICogICBJZGVudGl0eUZyb3plbiwgSWRlbnRpdHlVbmZyb3plbiwgSWRlbnRpdHlEaXNhYmxlZFxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhbmRsZUlkZW50aXR5RGlzYWJsZWQgPSBleHBvcnRzLmhhbmRsZUlkZW50aXR5VW5mcm96ZW4gPSBleHBvcnRzLmhhbmRsZUlkZW50aXR5RnJvemVuID0gZXhwb3J0cy5oYW5kbGVUcmFuc3BvcnRSZXZva2VkID0gZXhwb3J0cy5oYW5kbGVUcmFuc3BvcnRWZXJpZmllZCA9IGV4cG9ydHMuaGFuZGxlVHJhbnNwb3J0Qm91bmQgPSBleHBvcnRzLmhhbmRsZUFjdGl2ZVJlbGF0aW9uUG9saWN5U2V0ID0gZXhwb3J0cy5oYW5kbGVBY3RpdmVBdXRoUmVnaXN0cnlTZXQgPSBleHBvcnRzLmhhbmRsZUFjdGl2ZUFnZW50UmVnaXN0cnlTZXQgPSBleHBvcnRzLmhhbmRsZUFjdGl2ZVByb2ZpbGVTZXQgPSBleHBvcnRzLmhhbmRsZUlkZW50aXR5S2V5UmV2b2tlZCA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlLZXlBZGRlZCA9IGV4cG9ydHMuaGFuZGxlUmVjb3ZlcnlLZXlTZXQgPSBleHBvcnRzLmhhbmRsZU93bmVyS2V5Um90YXRlZCA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlSZWdpc3RlcmVkID0gdm9pZCAwO1xuY29uc3QgQ2hhaW5JZGVudGl0eV8xID0gcmVxdWlyZShcIi4uL3R5cGVzL21vZGVscy9DaGFpbklkZW50aXR5XCIpO1xuY29uc3QgSWRlbnRpdHlLZXlfMSA9IHJlcXVpcmUoXCIuLi90eXBlcy9tb2RlbHMvSWRlbnRpdHlLZXlcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG4vLyDilIDilIDilIAgaGVscGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmZ1bmN0aW9uIHN0cih2KSB7XG4gICAgcmV0dXJuIHYudG9TdHJpbmcoKTtcbn1cbmZ1bmN0aW9uIGJsb2NrTnVtKGJsb2NrKSB7XG4gICAgcmV0dXJuIEJpZ0ludChibG9jay5ibG9jay5oZWFkZXIubnVtYmVyLnRvU3RyaW5nKCkpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0SWRlbnRpdHkoaWRlbnRpdHlJZCkge1xuICAgIHJldHVybiBDaGFpbklkZW50aXR5XzEuQ2hhaW5JZGVudGl0eS5nZXQoKDAsIHV0aWxzXzEuaWRlbnRpdHlFbnRpdHlJZCkoaWRlbnRpdHlJZCkpO1xufVxuLyoqIFNlcmlhbGl6ZSBhbiBPcHRpb248Q29udGVudFJlZj4gdmFsdWUgZnJvbSBzdG9yYWdlIHF1ZXJ5IEpTT04gdG8gYSBzdHJpbmcgb3IgdW5kZWZpbmVkLiAqL1xuZnVuY3Rpb24gc2VyaWFsaXplQ29udGVudFJlZihyYXcpIHtcbiAgICBpZiAocmF3ID09PSBudWxsIHx8IHJhdyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGlmICh0eXBlb2YgcmF3ID09PSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4gcmF3O1xuICAgIC8vIENvbnRlbnRSZWYgZW5jb2RlcyBhcyB7IGNpZDogc3RyaW5nIH0gb3IgeyB1cmk6IHN0cmluZyB9IGRlcGVuZGluZyBvbiB2YXJpYW50XG4gICAgY29uc3Qgb2JqID0gcmF3O1xuICAgIGlmIChvYmpbXCJjaWRcIl0pXG4gICAgICAgIHJldHVybiBTdHJpbmcob2JqW1wiY2lkXCJdKTtcbiAgICBpZiAob2JqW1widXJpXCJdKVxuICAgICAgICByZXR1cm4gU3RyaW5nKG9ialtcInVyaVwiXSk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHJhdyk7XG59XG4vLyDilIDilIDilIAgSWRlbnRpdHlSZWdpc3RlcmVkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSWRlbnRpdHlSZWdpc3RlcmVkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IG93bmVyID0gc3RyKGRhdGFbMV0pO1xuICAgIGNvbnN0IGJuID0gYmxvY2tOdW0oYmxvY2spO1xuICAgIGNvbnN0IGlkID0gKDAsIHV0aWxzXzEuaWRlbnRpdHlFbnRpdHlJZCkoaWRlbnRpdHlJZCk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBDaGFpbklkZW50aXR5XzEuQ2hhaW5JZGVudGl0eS5jcmVhdGUoe1xuICAgICAgICBpZCxcbiAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgaWRlbnRpdHlJZCxcbiAgICAgICAgb3duZXIsXG4gICAgICAgIHN0YXR1czogXCJBY3RpdmVcIixcbiAgICAgICAgY3JlYXRlZEF0QmxvY2s6IGJuLFxuICAgICAgICB1cGRhdGVkQXRCbG9jazogYm4sXG4gICAgfSk7XG4gICAgYXdhaXQgaWRlbnRpdHkuc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVJZGVudGl0eVJlZ2lzdGVyZWQgPSBoYW5kbGVJZGVudGl0eVJlZ2lzdGVyZWQ7XG4vLyDilIDilIDilIAgT3duZXJLZXlSb3RhdGVkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlT3duZXJLZXlSb3RhdGVkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIC8vIGRhdGFbMV0gPSBvbGRfb3duZXIgKGlnbm9yZWQpLCBkYXRhWzJdID0gbmV3X293bmVyXG4gICAgY29uc3QgbmV3T3duZXIgPSBzdHIoZGF0YVsyXSk7XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoIWlkZW50aXR5KVxuICAgICAgICByZXR1cm47XG4gICAgaWRlbnRpdHkub3duZXIgPSBuZXdPd25lcjtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJuO1xuICAgIGF3YWl0IGlkZW50aXR5LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlT3duZXJLZXlSb3RhdGVkID0gaGFuZGxlT3duZXJLZXlSb3RhdGVkO1xuLy8g4pSA4pSA4pSAIFJlY292ZXJ5S2V5U2V0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUmVjb3ZlcnlLZXlTZXQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoIWlkZW50aXR5KVxuICAgICAgICByZXR1cm47XG4gICAgaWRlbnRpdHkudXBkYXRlZEF0QmxvY2sgPSBibjtcbiAgICBhd2FpdCBpZGVudGl0eS5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZVJlY292ZXJ5S2V5U2V0ID0gaGFuZGxlUmVjb3ZlcnlLZXlTZXQ7XG4vLyDilIDilIDilIAgSWRlbnRpdHlLZXlBZGRlZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUlkZW50aXR5S2V5QWRkZWQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3Qga2V5SWQgPSBzdHIoZGF0YVsxXSk7XG4gICAgY29uc3QgcHVycG9zZVJhdyA9IGRhdGFbMl07XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgLy8gcHVycG9zZSBpcyBLZXlQdXJwb3NlIGVudW07IHNlcmlhbGl6ZSB0byBzdHJpbmdcbiAgICBjb25zdCBwdXJwb3NlSnNvbiA9IHB1cnBvc2VSYXcudG9KU09OKCk7XG4gICAgY29uc3QgcHVycG9zZSA9IHR5cGVvZiBwdXJwb3NlSnNvbiA9PT0gXCJzdHJpbmdcIlxuICAgICAgICA/IHB1cnBvc2VKc29uXG4gICAgICAgIDogSlNPTi5zdHJpbmdpZnkocHVycG9zZUpzb24pO1xuICAgIC8vIFRoZSBhdXRob3JpemVkIGtleSBhY2NvdW50IGlzIG5vdCBpbiB0aGUgZXZlbnQ7IHN0b3JlIGtleUlkIGFuZCBpZGVudGl0eUlkIGZvciBsb29rdXBcbiAgICBjb25zdCBrZXkgPSBJZGVudGl0eUtleV8xLklkZW50aXR5S2V5LmNyZWF0ZSh7XG4gICAgICAgIGlkOiAoMCwgdXRpbHNfMS5pZGVudGl0eUtleUVudGl0eUlkKShrZXlJZCksXG4gICAgICAgIGNoYWluSWQ6IHV0aWxzXzEuQ0hBSU5fSUQsXG4gICAgICAgIGlkZW50aXR5SWQsXG4gICAgICAgIGtleUlkLFxuICAgICAgICBhY2NvdW50OiBcIlwiLCAvLyBmaWxsZWQgYmVsb3cgdmlhIHN0b3JhZ2UgcXVlcnlcbiAgICAgICAgcHVycG9zZSxcbiAgICAgICAgc3RhdHVzOiBcIkFjdGl2ZVwiLFxuICAgICAgICB1cGRhdGVkQXRCbG9jazogYm4sXG4gICAgfSk7XG4gICAgLy8gUXVlcnkgc3RvcmFnZSB0byBnZXQgdGhlIGFjY291bnRcbiAgICB0cnkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCBhcGkucXVlcnkuaWRlbnRpdHlDb3JlLmF1dGhvcml6ZWRLZXlzKGtleUlkKTtcbiAgICAgICAgY29uc3QgcmVjb3JkSnNvbiA9IHJlY29yZC50b0pTT04oKTtcbiAgICAgICAgaWYgKHJlY29yZEpzb24gJiYgcmVjb3JkSnNvbltcImFjY291bnRcIl0pIHtcbiAgICAgICAgICAgIGtleS5hY2NvdW50ID0gU3RyaW5nKHJlY29yZEpzb25bXCJhY2NvdW50XCJdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoXykge1xuICAgICAgICAvLyBzdG9yYWdlIHF1ZXJ5IGZhaWxlZDsgYWNjb3VudCByZW1haW5zIGVtcHR5XG4gICAgfVxuICAgIGF3YWl0IGtleS5zYXZlKCk7XG4gICAgLy8gdXBkYXRlIGlkZW50aXR5IG5vbmNlIC8gdXBkYXRlZEF0QmxvY2tcbiAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IGdldElkZW50aXR5KGlkZW50aXR5SWQpO1xuICAgIGlmIChpZGVudGl0eSkge1xuICAgICAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJuO1xuICAgICAgICBhd2FpdCBpZGVudGl0eS5zYXZlKCk7XG4gICAgfVxufVxuZXhwb3J0cy5oYW5kbGVJZGVudGl0eUtleUFkZGVkID0gaGFuZGxlSWRlbnRpdHlLZXlBZGRlZDtcbi8vIOKUgOKUgOKUgCBJZGVudGl0eUtleVJldm9rZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVJZGVudGl0eUtleVJldm9rZWQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGtleUlkID0gc3RyKGRhdGFbMV0pO1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgY29uc3Qga2V5ID0gYXdhaXQgSWRlbnRpdHlLZXlfMS5JZGVudGl0eUtleS5nZXQoKDAsIHV0aWxzXzEuaWRlbnRpdHlLZXlFbnRpdHlJZCkoa2V5SWQpKTtcbiAgICBpZiAoa2V5KSB7XG4gICAgICAgIGtleS5zdGF0dXMgPSBcIlJldm9rZWRcIjtcbiAgICAgICAga2V5LnVwZGF0ZWRBdEJsb2NrID0gYm47XG4gICAgICAgIGF3YWl0IGtleS5zYXZlKCk7XG4gICAgfVxuICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgZ2V0SWRlbnRpdHkoaWRlbnRpdHlJZCk7XG4gICAgaWYgKGlkZW50aXR5KSB7XG4gICAgICAgIGlkZW50aXR5LnVwZGF0ZWRBdEJsb2NrID0gYm47XG4gICAgICAgIGF3YWl0IGlkZW50aXR5LnNhdmUoKTtcbiAgICB9XG59XG5leHBvcnRzLmhhbmRsZUlkZW50aXR5S2V5UmV2b2tlZCA9IGhhbmRsZUlkZW50aXR5S2V5UmV2b2tlZDtcbi8vIOKUgOKUgOKUgCBwb2ludGVyLXNldCBoZWxwZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hJZGVudGl0eVBvaW50ZXJzKGlkZW50aXR5SWQpIHtcbiAgICB0cnkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCBhcGkucXVlcnkuaWRlbnRpdHlDb3JlLmlkZW50aXRpZXMoaWRlbnRpdHlJZCk7XG4gICAgICAgIGNvbnN0IGpzb24gPSByZWNvcmQudG9KU09OKCk7XG4gICAgICAgIGlmICghanNvbilcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFjdGl2ZVByb2ZpbGU6IHNlcmlhbGl6ZUNvbnRlbnRSZWYoanNvbltcImFjdGl2ZVByb2ZpbGVcIl0pLFxuICAgICAgICAgICAgYWN0aXZlQWdlbnRSZWdpc3RyeTogc2VyaWFsaXplQ29udGVudFJlZihqc29uW1wiYWN0aXZlQWdlbnRSZWdpc3RyeVwiXSksXG4gICAgICAgICAgICBhY3RpdmVBdXRoUmVnaXN0cnk6IHNlcmlhbGl6ZUNvbnRlbnRSZWYoanNvbltcImFjdGl2ZUF1dGhSZWdpc3RyeVwiXSksXG4gICAgICAgICAgICBhY3RpdmVSZWxhdGlvblBvbGljeTogc2VyaWFsaXplQ29udGVudFJlZihqc29uW1wiYWN0aXZlUmVsYXRpb25Qb2xpY3lcIl0pLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBjYXRjaCAoXykge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxufVxuLy8g4pSA4pSA4pSAIEFjdGl2ZVByb2ZpbGVTZXQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVBY3RpdmVQcm9maWxlU2V0KGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGJuID0gYmxvY2tOdW0oYmxvY2spO1xuICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgZ2V0SWRlbnRpdHkoaWRlbnRpdHlJZCk7XG4gICAgaWYgKCFpZGVudGl0eSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IHB0cnMgPSBhd2FpdCBmZXRjaElkZW50aXR5UG9pbnRlcnMoaWRlbnRpdHlJZCk7XG4gICAgaWRlbnRpdHkuYWN0aXZlUHJvZmlsZSA9IHB0cnNbXCJhY3RpdmVQcm9maWxlXCJdO1xuICAgIGlkZW50aXR5LnVwZGF0ZWRBdEJsb2NrID0gYm47XG4gICAgYXdhaXQgaWRlbnRpdHkuc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVBY3RpdmVQcm9maWxlU2V0ID0gaGFuZGxlQWN0aXZlUHJvZmlsZVNldDtcbi8vIOKUgOKUgOKUgCBBY3RpdmVBZ2VudFJlZ2lzdHJ5U2V0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQWN0aXZlQWdlbnRSZWdpc3RyeVNldChldmVudCkge1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3QgaWRlbnRpdHlJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBibiA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBjb25zdCBpZGVudGl0eSA9IGF3YWl0IGdldElkZW50aXR5KGlkZW50aXR5SWQpO1xuICAgIGlmICghaWRlbnRpdHkpXG4gICAgICAgIHJldHVybjtcbiAgICBjb25zdCBwdHJzID0gYXdhaXQgZmV0Y2hJZGVudGl0eVBvaW50ZXJzKGlkZW50aXR5SWQpO1xuICAgIGlkZW50aXR5LmFjdGl2ZUFnZW50UmVnaXN0cnkgPSBwdHJzW1wiYWN0aXZlQWdlbnRSZWdpc3RyeVwiXTtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJuO1xuICAgIGF3YWl0IGlkZW50aXR5LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlQWN0aXZlQWdlbnRSZWdpc3RyeVNldCA9IGhhbmRsZUFjdGl2ZUFnZW50UmVnaXN0cnlTZXQ7XG4vLyDilIDilIDilIAgQWN0aXZlQXV0aFJlZ2lzdHJ5U2V0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQWN0aXZlQXV0aFJlZ2lzdHJ5U2V0KGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGJuID0gYmxvY2tOdW0oYmxvY2spO1xuICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgZ2V0SWRlbnRpdHkoaWRlbnRpdHlJZCk7XG4gICAgaWYgKCFpZGVudGl0eSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IHB0cnMgPSBhd2FpdCBmZXRjaElkZW50aXR5UG9pbnRlcnMoaWRlbnRpdHlJZCk7XG4gICAgaWRlbnRpdHkuYWN0aXZlQXV0aFJlZ2lzdHJ5ID0gcHRyc1tcImFjdGl2ZUF1dGhSZWdpc3RyeVwiXTtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJuO1xuICAgIGF3YWl0IGlkZW50aXR5LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlQWN0aXZlQXV0aFJlZ2lzdHJ5U2V0ID0gaGFuZGxlQWN0aXZlQXV0aFJlZ2lzdHJ5U2V0O1xuLy8g4pSA4pSA4pSAIEFjdGl2ZVJlbGF0aW9uUG9saWN5U2V0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlQWN0aXZlUmVsYXRpb25Qb2xpY3lTZXQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgYm4gPSBibG9ja051bShibG9jayk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoIWlkZW50aXR5KVxuICAgICAgICByZXR1cm47XG4gICAgY29uc3QgcHRycyA9IGF3YWl0IGZldGNoSWRlbnRpdHlQb2ludGVycyhpZGVudGl0eUlkKTtcbiAgICBpZGVudGl0eS5hY3RpdmVSZWxhdGlvblBvbGljeSA9IHB0cnNbXCJhY3RpdmVSZWxhdGlvblBvbGljeVwiXTtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJuO1xuICAgIGF3YWl0IGlkZW50aXR5LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlQWN0aXZlUmVsYXRpb25Qb2xpY3lTZXQgPSBoYW5kbGVBY3RpdmVSZWxhdGlvblBvbGljeVNldDtcbi8vIOKUgOKUgOKUgCBUcmFuc3BvcnQgZXZlbnRzIChubyBzY2hlbWEgZW50aXR5OyB1cGRhdGUgaWRlbnRpdHkgdGltZXN0YW1wKSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIHRvdWNoSWRlbnRpdHkoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoIWlkZW50aXR5KVxuICAgICAgICByZXR1cm47XG4gICAgaWRlbnRpdHkudXBkYXRlZEF0QmxvY2sgPSBibG9ja051bShibG9jayk7XG4gICAgYXdhaXQgaWRlbnRpdHkuc2F2ZSgpO1xufVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlVHJhbnNwb3J0Qm91bmQoZXZlbnQpIHtcbiAgICBhd2FpdCB0b3VjaElkZW50aXR5KGV2ZW50KTtcbn1cbmV4cG9ydHMuaGFuZGxlVHJhbnNwb3J0Qm91bmQgPSBoYW5kbGVUcmFuc3BvcnRCb3VuZDtcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVRyYW5zcG9ydFZlcmlmaWVkKGV2ZW50KSB7XG4gICAgYXdhaXQgdG91Y2hJZGVudGl0eShldmVudCk7XG59XG5leHBvcnRzLmhhbmRsZVRyYW5zcG9ydFZlcmlmaWVkID0gaGFuZGxlVHJhbnNwb3J0VmVyaWZpZWQ7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVUcmFuc3BvcnRSZXZva2VkKGV2ZW50KSB7XG4gICAgYXdhaXQgdG91Y2hJZGVudGl0eShldmVudCk7XG59XG5leHBvcnRzLmhhbmRsZVRyYW5zcG9ydFJldm9rZWQgPSBoYW5kbGVUcmFuc3BvcnRSZXZva2VkO1xuLy8g4pSA4pSA4pSAIElkZW50aXR5RnJvemVuIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSWRlbnRpdHlGcm96ZW4oZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoIWlkZW50aXR5KVxuICAgICAgICByZXR1cm47XG4gICAgaWRlbnRpdHkuc3RhdHVzID0gXCJGcm96ZW5cIjtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBhd2FpdCBpZGVudGl0eS5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZUlkZW50aXR5RnJvemVuID0gaGFuZGxlSWRlbnRpdHlGcm96ZW47XG4vLyDilIDilIDilIAgSWRlbnRpdHlVbmZyb3plbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUlkZW50aXR5VW5mcm96ZW4oZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGlkZW50aXR5SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgaWRlbnRpdHkgPSBhd2FpdCBnZXRJZGVudGl0eShpZGVudGl0eUlkKTtcbiAgICBpZiAoIWlkZW50aXR5KVxuICAgICAgICByZXR1cm47XG4gICAgaWRlbnRpdHkuc3RhdHVzID0gXCJBY3RpdmVcIjtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBhd2FpdCBpZGVudGl0eS5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZUlkZW50aXR5VW5mcm96ZW4gPSBoYW5kbGVJZGVudGl0eVVuZnJvemVuO1xuLy8g4pSA4pSA4pSAIElkZW50aXR5RGlzYWJsZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVJZGVudGl0eURpc2FibGVkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpZGVudGl0eUlkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGlkZW50aXR5ID0gYXdhaXQgZ2V0SWRlbnRpdHkoaWRlbnRpdHlJZCk7XG4gICAgaWYgKCFpZGVudGl0eSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGlkZW50aXR5LnN0YXR1cyA9IFwiRGlzYWJsZWRcIjtcbiAgICBpZGVudGl0eS51cGRhdGVkQXRCbG9jayA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBhd2FpdCBpZGVudGl0eS5zYXZlKCk7XG59XG5leHBvcnRzLmhhbmRsZUlkZW50aXR5RGlzYWJsZWQgPSBoYW5kbGVJZGVudGl0eURpc2FibGVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIE1hcHBpbmcgaGFuZGxlcnMgZm9yIHBhbGxldF9wYXltZW50X2ludGVudCBldmVudHMuXG4gKlxuICogRXZlbnRzIGhhbmRsZWQ6XG4gKiAgIFBheW1lbnRJbnRlbnRDcmVhdGVkLCBQYXltZW50SW50ZW50RnVuZGVkLFxuICogICBQYXltZW50SW50ZW50Q2xhaW1lZCwgUGF5bWVudEludGVudFJlZnVuZGVkLFxuICogICBQYXltZW50SW50ZW50Q2FuY2VsbGVkLCBQYXltZW50SW50ZW50RXhwaXJlZFxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRFeHBpcmVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50Q2FuY2VsbGVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50UmVmdW5kZWQgPSBleHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRDbGFpbWVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50RnVuZGVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50Q3JlYXRlZCA9IHZvaWQgMDtcbmNvbnN0IFBheW1lbnRJbnRlbnRfMSA9IHJlcXVpcmUoXCIuLi90eXBlcy9tb2RlbHMvUGF5bWVudEludGVudFwiKTtcbmNvbnN0IFNldHRsZW1lbnRFdmVudF8xID0gcmVxdWlyZShcIi4uL3R5cGVzL21vZGVscy9TZXR0bGVtZW50RXZlbnRcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG4vLyDilIDilIDilIAgaGVscGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmZ1bmN0aW9uIHN0cih2KSB7XG4gICAgcmV0dXJuIHYudG9TdHJpbmcoKTtcbn1cbmZ1bmN0aW9uIGJsb2NrTnVtKGJsb2NrKSB7XG4gICAgcmV0dXJuIEJpZ0ludChibG9jay5ibG9jay5oZWFkZXIubnVtYmVyLnRvU3RyaW5nKCkpO1xufVxuYXN5bmMgZnVuY3Rpb24gZ2V0SW50ZW50KGludGVudElkKSB7XG4gICAgcmV0dXJuIFBheW1lbnRJbnRlbnRfMS5QYXltZW50SW50ZW50LmdldCgoMCwgdXRpbHNfMS5wYXltZW50SW50ZW50RW50aXR5SWQpKGludGVudElkKSk7XG59XG5hc3luYyBmdW5jdGlvbiBhcHBlbmRTZXR0bGVtZW50RXZlbnQoZXZlbnQsIGludGVudElkLCBldmVudFR5cGUpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGNvbnN0IHsgYmxvY2ssIGV4dHJpbnNpYywgaWR4IH0gPSBldmVudDtcbiAgICBjb25zdCBibiA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBjb25zdCBldmVudEluZGV4ID0gaWR4ICE9PSBudWxsICYmIGlkeCAhPT0gdm9pZCAwID8gaWR4IDogMDtcbiAgICBjb25zdCBpZCA9ICgwLCB1dGlsc18xLnNldHRsZW1lbnRFdmVudEVudGl0eUlkKShpbnRlbnRJZCwgYm4sIGV2ZW50SW5kZXgpO1xuICAgIGNvbnN0IHNlID0gU2V0dGxlbWVudEV2ZW50XzEuU2V0dGxlbWVudEV2ZW50LmNyZWF0ZSh7XG4gICAgICAgIGlkLFxuICAgICAgICBjaGFpbklkOiB1dGlsc18xLkNIQUlOX0lELFxuICAgICAgICBpbnRlbnRJZCxcbiAgICAgICAgZXZlbnRUeXBlLFxuICAgICAgICBibG9ja051bWJlcjogYm4sXG4gICAgICAgIGV4dHJpbnNpY0luZGV4OiBleHRyaW5zaWMgPyAoX2EgPSBleHRyaW5zaWMuaWR4KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB1bmRlZmluZWQgOiB1bmRlZmluZWQsXG4gICAgICAgIGV2ZW50SW5kZXgsXG4gICAgICAgIGJsb2NrSGFzaDogYmxvY2suYmxvY2suaGVhZGVyLmhhc2gudG9IZXgoKSxcbiAgICAgICAgdGltZXN0YW1wOiAoX2IgPSBibG9jay50aW1lc3RhbXApICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgICBhd2FpdCBzZS5zYXZlKCk7XG59XG4vLyDilIDilIDilIAgUGF5bWVudEludGVudENyZWF0ZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVQYXltZW50SW50ZW50Q3JlYXRlZChldmVudCkge1xuICAgIC8vIGRhdGE6IGludGVudF9pZCgwKSwgcGF5ZXIoMSksIHBheWVlKDIpLCBhc3NldF9pZCgzKSwgYW1vdW50KDQpLCBhY3Rpb24oNSlcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGludGVudElkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IHBheWVySWRlbnRpdHlJZCA9IHN0cihkYXRhWzFdKTtcbiAgICBjb25zdCBwYXllZUlkZW50aXR5SWQgPSBzdHIoZGF0YVsyXSk7XG4gICAgLy8gZGF0YVszXSA9IGFzc2V0X2lkIChpZ25vcmVkIGluIHNjaGVtYSlcbiAgICBjb25zdCBhbW91bnQgPSBCaWdJbnQoc3RyKGRhdGFbNF0pKTtcbiAgICBjb25zdCBhY3Rpb25SYXcgPSBkYXRhWzVdLnRvSlNPTigpO1xuICAgIGNvbnN0IGJuID0gYmxvY2tOdW0oYmxvY2spO1xuICAgIC8vIEV4dHJhY3QgbmFtZXNwYWNlIChCb3VuZGVkVmVjPHU4PiBzZXJpYWxpemVkIGFzIGhleCBvciBhcnJheSkgYW5kIGFjdGlvbkNvZGVcbiAgICBsZXQgYWN0aW9uTmFtZXNwYWNlO1xuICAgIGxldCBhY3Rpb25JZDtcbiAgICBpZiAoYWN0aW9uUmF3KSB7XG4gICAgICAgIGNvbnN0IG5zID0gYWN0aW9uUmF3W1wibmFtZXNwYWNlXCJdO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShucykpIHtcbiAgICAgICAgICAgIGFjdGlvbk5hbWVzcGFjZSA9IEJ1ZmZlci5mcm9tKG5zKS50b1N0cmluZyhcInV0ZjhcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIG5zID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBhY3Rpb25OYW1lc3BhY2UgPSBucy5zdGFydHNXaXRoKFwiMHhcIilcbiAgICAgICAgICAgICAgICA/IEJ1ZmZlci5mcm9tKG5zLnNsaWNlKDIpLCBcImhleFwiKS50b1N0cmluZyhcInV0ZjhcIilcbiAgICAgICAgICAgICAgICA6IG5zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb25SYXdbXCJhY3Rpb25Db2RlXCJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGFjdGlvbklkID0gU3RyaW5nKGFjdGlvblJhd1tcImFjdGlvbkNvZGVcIl0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGludGVudCA9IFBheW1lbnRJbnRlbnRfMS5QYXltZW50SW50ZW50LmNyZWF0ZSh7XG4gICAgICAgIGlkOiAoMCwgdXRpbHNfMS5wYXltZW50SW50ZW50RW50aXR5SWQpKGludGVudElkKSxcbiAgICAgICAgY2hhaW5JZDogdXRpbHNfMS5DSEFJTl9JRCxcbiAgICAgICAgaW50ZW50SWQsXG4gICAgICAgIHBheWVySWRlbnRpdHlJZCxcbiAgICAgICAgcGF5ZWVJZGVudGl0eUlkLFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIHNldHRsZW1lbnRNb2RlOiBcIlVua25vd25cIixcbiAgICAgICAgYWN0aW9uTmFtZXNwYWNlLFxuICAgICAgICBhY3Rpb25JZCxcbiAgICAgICAgc3RhdHVzOiBcIkNyZWF0ZWRcIixcbiAgICAgICAgY3JlYXRlZEF0QmxvY2s6IGJuLFxuICAgICAgICB1cGRhdGVkQXRCbG9jazogYm4sXG4gICAgfSk7XG4gICAgYXdhaXQgaW50ZW50LnNhdmUoKTtcbn1cbmV4cG9ydHMuaGFuZGxlUGF5bWVudEludGVudENyZWF0ZWQgPSBoYW5kbGVQYXltZW50SW50ZW50Q3JlYXRlZDtcbi8vIOKUgOKUgOKUgCBQYXltZW50SW50ZW50RnVuZGVkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUGF5bWVudEludGVudEZ1bmRlZChldmVudCkge1xuICAgIC8vIGRhdGE6IGludGVudF9pZCgwKSwgc2V0dGxlbWVudF9tb2RlKDEpXG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpbnRlbnRJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBzZXR0bGVtZW50TW9kZUpzb24gPSBkYXRhWzFdLnRvSlNPTigpO1xuICAgIGNvbnN0IHNldHRsZW1lbnRNb2RlID0gdHlwZW9mIHNldHRsZW1lbnRNb2RlSnNvbiA9PT0gXCJzdHJpbmdcIlxuICAgICAgICA/IHNldHRsZW1lbnRNb2RlSnNvblxuICAgICAgICA6IEpTT04uc3RyaW5naWZ5KHNldHRsZW1lbnRNb2RlSnNvbik7XG4gICAgY29uc3QgaW50ZW50ID0gYXdhaXQgZ2V0SW50ZW50KGludGVudElkKTtcbiAgICBpZiAoIWludGVudClcbiAgICAgICAgcmV0dXJuO1xuICAgIGludGVudC5zZXR0bGVtZW50TW9kZSA9IHNldHRsZW1lbnRNb2RlO1xuICAgIGludGVudC5zdGF0dXMgPSBcIkZ1bmRlZFwiO1xuICAgIGludGVudC51cGRhdGVkQXRCbG9jayA9IGJsb2NrTnVtKGJsb2NrKTtcbiAgICBhd2FpdCBpbnRlbnQuc2F2ZSgpO1xufVxuZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50RnVuZGVkID0gaGFuZGxlUGF5bWVudEludGVudEZ1bmRlZDtcbi8vIOKUgOKUgOKUgCBQYXltZW50SW50ZW50Q2xhaW1lZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVBheW1lbnRJbnRlbnRDbGFpbWVkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpbnRlbnRJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBpbnRlbnQgPSBhd2FpdCBnZXRJbnRlbnQoaW50ZW50SWQpO1xuICAgIGlmIChpbnRlbnQpIHtcbiAgICAgICAgaW50ZW50LnN0YXR1cyA9IFwiQ2xhaW1lZFwiO1xuICAgICAgICBpbnRlbnQudXBkYXRlZEF0QmxvY2sgPSBibG9ja051bShibG9jayk7XG4gICAgICAgIGF3YWl0IGludGVudC5zYXZlKCk7XG4gICAgfVxuICAgIGF3YWl0IGFwcGVuZFNldHRsZW1lbnRFdmVudChldmVudCwgaW50ZW50SWQsIFwiQ2xhaW1lZFwiKTtcbn1cbmV4cG9ydHMuaGFuZGxlUGF5bWVudEludGVudENsYWltZWQgPSBoYW5kbGVQYXltZW50SW50ZW50Q2xhaW1lZDtcbi8vIOKUgOKUgOKUgCBQYXltZW50SW50ZW50UmVmdW5kZWQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVQYXltZW50SW50ZW50UmVmdW5kZWQoZXZlbnQpIHtcbiAgICBjb25zdCB7IGV2ZW50OiB7IGRhdGEgfSwgYmxvY2sgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGludGVudElkID0gc3RyKGRhdGFbMF0pO1xuICAgIGNvbnN0IGludGVudCA9IGF3YWl0IGdldEludGVudChpbnRlbnRJZCk7XG4gICAgaWYgKGludGVudCkge1xuICAgICAgICBpbnRlbnQuc3RhdHVzID0gXCJSZWZ1bmRlZFwiO1xuICAgICAgICBpbnRlbnQudXBkYXRlZEF0QmxvY2sgPSBibG9ja051bShibG9jayk7XG4gICAgICAgIGF3YWl0IGludGVudC5zYXZlKCk7XG4gICAgfVxuICAgIGF3YWl0IGFwcGVuZFNldHRsZW1lbnRFdmVudChldmVudCwgaW50ZW50SWQsIFwiUmVmdW5kZWRcIik7XG59XG5leHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRSZWZ1bmRlZCA9IGhhbmRsZVBheW1lbnRJbnRlbnRSZWZ1bmRlZDtcbi8vIOKUgOKUgOKUgCBQYXltZW50SW50ZW50Q2FuY2VsbGVkIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUGF5bWVudEludGVudENhbmNlbGxlZChldmVudCkge1xuICAgIGNvbnN0IHsgZXZlbnQ6IHsgZGF0YSB9LCBibG9jayB9ID0gZXZlbnQ7XG4gICAgY29uc3QgaW50ZW50SWQgPSBzdHIoZGF0YVswXSk7XG4gICAgY29uc3QgaW50ZW50ID0gYXdhaXQgZ2V0SW50ZW50KGludGVudElkKTtcbiAgICBpZiAoaW50ZW50KSB7XG4gICAgICAgIGludGVudC5zdGF0dXMgPSBcIkNhbmNlbGxlZFwiO1xuICAgICAgICBpbnRlbnQudXBkYXRlZEF0QmxvY2sgPSBibG9ja051bShibG9jayk7XG4gICAgICAgIGF3YWl0IGludGVudC5zYXZlKCk7XG4gICAgfVxuICAgIGF3YWl0IGFwcGVuZFNldHRsZW1lbnRFdmVudChldmVudCwgaW50ZW50SWQsIFwiQ2FuY2VsbGVkXCIpO1xufVxuZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50Q2FuY2VsbGVkID0gaGFuZGxlUGF5bWVudEludGVudENhbmNlbGxlZDtcbi8vIOKUgOKUgOKUgCBQYXltZW50SW50ZW50RXhwaXJlZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVBheW1lbnRJbnRlbnRFeHBpcmVkKGV2ZW50KSB7XG4gICAgY29uc3QgeyBldmVudDogeyBkYXRhIH0sIGJsb2NrIH0gPSBldmVudDtcbiAgICBjb25zdCBpbnRlbnRJZCA9IHN0cihkYXRhWzBdKTtcbiAgICBjb25zdCBpbnRlbnQgPSBhd2FpdCBnZXRJbnRlbnQoaW50ZW50SWQpO1xuICAgIGlmIChpbnRlbnQpIHtcbiAgICAgICAgaW50ZW50LnN0YXR1cyA9IFwiRXhwaXJlZFwiO1xuICAgICAgICBpbnRlbnQudXBkYXRlZEF0QmxvY2sgPSBibG9ja051bShibG9jayk7XG4gICAgICAgIGF3YWl0IGludGVudC5zYXZlKCk7XG4gICAgfVxuICAgIGF3YWl0IGFwcGVuZFNldHRsZW1lbnRFdmVudChldmVudCwgaW50ZW50SWQsIFwiRXhwaXJlZFwiKTtcbn1cbmV4cG9ydHMuaGFuZGxlUGF5bWVudEludGVudEV4cGlyZWQgPSBoYW5kbGVQYXltZW50SW50ZW50RXhwaXJlZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBTaGFyZWQgaGVscGVycyBmb3IgbWFwcGluZyBoYW5kbGVycy5cbiAqL1xudmFyIF9hO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hZ2VudFJld2FyZEV2ZW50RW50aXR5SWQgPSBleHBvcnRzLnRhc2tSZXdhcmRTZXR0bGVtZW50RW50aXR5SWQgPSBleHBvcnRzLnJvdW5kUmV3YXJkU2V0dGxlbWVudEVudGl0eUlkID0gZXhwb3J0cy5yZXdhcmREYXlTdGF0ZUVudGl0eUlkID0gZXhwb3J0cy5hZ2VudFJld2FyZExlZGdlckVudGl0eUlkID0gZXhwb3J0cy5lbWVyZ2VuY3lTdGF0dXNFbnRpdHlJZCA9IGV4cG9ydHMuYWdlbnRTdGFrZUV2ZW50RW50aXR5SWQgPSBleHBvcnRzLmFnZW50U3Rha2VMZWRnZXJFbnRpdHlJZCA9IGV4cG9ydHMuc2V0dGxlbWVudEV2ZW50RW50aXR5SWQgPSBleHBvcnRzLnBheW1lbnRJbnRlbnRFbnRpdHlJZCA9IGV4cG9ydHMuaWRlbnRpdHlLZXlFbnRpdHlJZCA9IGV4cG9ydHMuaWRlbnRpdHlFbnRpdHlJZCA9IGV4cG9ydHMuQ0hBSU5fSUQgPSB2b2lkIDA7XG5leHBvcnRzLkNIQUlOX0lEID0gKF9hID0gcHJvY2Vzcy5lbnZbXCJDSEFJTl9JRFwiXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogXCJzdWJzdHJhdGU6dmlibHktc29sb1wiO1xuZnVuY3Rpb24gaWRlbnRpdHlFbnRpdHlJZChpZGVudGl0eUlkKSB7XG4gICAgcmV0dXJuIGAke2V4cG9ydHMuQ0hBSU5fSUR9OiR7aWRlbnRpdHlJZH1gO1xufVxuZXhwb3J0cy5pZGVudGl0eUVudGl0eUlkID0gaWRlbnRpdHlFbnRpdHlJZDtcbmZ1bmN0aW9uIGlkZW50aXR5S2V5RW50aXR5SWQoa2V5SWQpIHtcbiAgICByZXR1cm4gYCR7ZXhwb3J0cy5DSEFJTl9JRH06JHtrZXlJZH1gO1xufVxuZXhwb3J0cy5pZGVudGl0eUtleUVudGl0eUlkID0gaWRlbnRpdHlLZXlFbnRpdHlJZDtcbmZ1bmN0aW9uIHBheW1lbnRJbnRlbnRFbnRpdHlJZChpbnRlbnRJZCkge1xuICAgIHJldHVybiBgJHtleHBvcnRzLkNIQUlOX0lEfToke2ludGVudElkfWA7XG59XG5leHBvcnRzLnBheW1lbnRJbnRlbnRFbnRpdHlJZCA9IHBheW1lbnRJbnRlbnRFbnRpdHlJZDtcbmZ1bmN0aW9uIHNldHRsZW1lbnRFdmVudEVudGl0eUlkKGludGVudElkLCBibG9ja051bWJlciwgZXZlbnRJbmRleCkge1xuICAgIHJldHVybiBgJHtleHBvcnRzLkNIQUlOX0lEfToke2ludGVudElkfToke2Jsb2NrTnVtYmVyfToke2V2ZW50SW5kZXh9YDtcbn1cbmV4cG9ydHMuc2V0dGxlbWVudEV2ZW50RW50aXR5SWQgPSBzZXR0bGVtZW50RXZlbnRFbnRpdHlJZDtcbmZ1bmN0aW9uIGFnZW50U3Rha2VMZWRnZXJFbnRpdHlJZChpZGVudGl0eUlkLCBhZ2VudElkKSB7XG4gICAgcmV0dXJuIGAke2V4cG9ydHMuQ0hBSU5fSUR9OiR7aWRlbnRpdHlJZH06JHthZ2VudElkfWA7XG59XG5leHBvcnRzLmFnZW50U3Rha2VMZWRnZXJFbnRpdHlJZCA9IGFnZW50U3Rha2VMZWRnZXJFbnRpdHlJZDtcbmZ1bmN0aW9uIGFnZW50U3Rha2VFdmVudEVudGl0eUlkKGlkZW50aXR5SWQsIGFnZW50SWQsIGJsb2NrTnVtYmVyLCBldmVudEluZGV4KSB7XG4gICAgcmV0dXJuIGAke2V4cG9ydHMuQ0hBSU5fSUR9OiR7aWRlbnRpdHlJZH06JHthZ2VudElkfToke2Jsb2NrTnVtYmVyfToke2V2ZW50SW5kZXh9YDtcbn1cbmV4cG9ydHMuYWdlbnRTdGFrZUV2ZW50RW50aXR5SWQgPSBhZ2VudFN0YWtlRXZlbnRFbnRpdHlJZDtcbmZ1bmN0aW9uIGVtZXJnZW5jeVN0YXR1c0VudGl0eUlkKHNjb3BlKSB7XG4gICAgcmV0dXJuIGAke2V4cG9ydHMuQ0hBSU5fSUR9OiR7c2NvcGV9YDtcbn1cbmV4cG9ydHMuZW1lcmdlbmN5U3RhdHVzRW50aXR5SWQgPSBlbWVyZ2VuY3lTdGF0dXNFbnRpdHlJZDtcbmZ1bmN0aW9uIGFnZW50UmV3YXJkTGVkZ2VyRW50aXR5SWQoaWRlbnRpdHlJZCwgYWdlbnRJZCkge1xuICAgIHJldHVybiBgJHtleHBvcnRzLkNIQUlOX0lEfToke2lkZW50aXR5SWR9OiR7YWdlbnRJZH1gO1xufVxuZXhwb3J0cy5hZ2VudFJld2FyZExlZGdlckVudGl0eUlkID0gYWdlbnRSZXdhcmRMZWRnZXJFbnRpdHlJZDtcbmZ1bmN0aW9uIHJld2FyZERheVN0YXRlRW50aXR5SWQoZGF5SW5kZXgpIHtcbiAgICByZXR1cm4gYCR7ZXhwb3J0cy5DSEFJTl9JRH06JHtkYXlJbmRleH1gO1xufVxuZXhwb3J0cy5yZXdhcmREYXlTdGF0ZUVudGl0eUlkID0gcmV3YXJkRGF5U3RhdGVFbnRpdHlJZDtcbmZ1bmN0aW9uIHJvdW5kUmV3YXJkU2V0dGxlbWVudEVudGl0eUlkKHJvbGUsIHJvdW5kSWQpIHtcbiAgICByZXR1cm4gYCR7ZXhwb3J0cy5DSEFJTl9JRH06JHtyb2xlfToke3JvdW5kSWR9YDtcbn1cbmV4cG9ydHMucm91bmRSZXdhcmRTZXR0bGVtZW50RW50aXR5SWQgPSByb3VuZFJld2FyZFNldHRsZW1lbnRFbnRpdHlJZDtcbmZ1bmN0aW9uIHRhc2tSZXdhcmRTZXR0bGVtZW50RW50aXR5SWQodGFza0lkKSB7XG4gICAgcmV0dXJuIGAke2V4cG9ydHMuQ0hBSU5fSUR9OiR7dGFza0lkfWA7XG59XG5leHBvcnRzLnRhc2tSZXdhcmRTZXR0bGVtZW50RW50aXR5SWQgPSB0YXNrUmV3YXJkU2V0dGxlbWVudEVudGl0eUlkO1xuZnVuY3Rpb24gYWdlbnRSZXdhcmRFdmVudEVudGl0eUlkKGlkZW50aXR5SWQsIGFnZW50SWQsIGJsb2NrTnVtYmVyLCBldmVudEluZGV4LCBldmVudFR5cGUpIHtcbiAgICByZXR1cm4gYCR7ZXhwb3J0cy5DSEFJTl9JRH06JHtpZGVudGl0eUlkfToke2FnZW50SWR9OiR7YmxvY2tOdW1iZXJ9OiR7ZXZlbnRJbmRleH06JHtldmVudFR5cGV9YDtcbn1cbmV4cG9ydHMuYWdlbnRSZXdhcmRFdmVudEVudGl0eUlkID0gYWdlbnRSZXdhcmRFdmVudEVudGl0eUlkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFnZW50UmV3YXJkRXZlbnQgPSB2b2lkIDA7XG5jb25zdCB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xuY29uc3QgYXNzZXJ0XzEgPSB0c2xpYl8xLl9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNsYXNzIEFnZW50UmV3YXJkRXZlbnQge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBjaGFpbklkLCBpZGVudGl0eUlkLCBhZ2VudElkLCBldmVudFR5cGUsIHJld2FyZEtpbmQsIGFtb3VudCwgYmFzZUFtb3VudCwgb2JzZXJ2ZXJBbW91bnQsIHJldmlld2VyQW1vdW50LCB0YXNrQW1vdW50LCBibG9ja051bWJlciwgZXZlbnRJbmRleCwgYmxvY2tIYXNoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jaGFpbklkID0gY2hhaW5JZDtcbiAgICAgICAgdGhpcy5pZGVudGl0eUlkID0gaWRlbnRpdHlJZDtcbiAgICAgICAgdGhpcy5hZ2VudElkID0gYWdlbnRJZDtcbiAgICAgICAgdGhpcy5ldmVudFR5cGUgPSBldmVudFR5cGU7XG4gICAgICAgIHRoaXMucmV3YXJkS2luZCA9IHJld2FyZEtpbmQ7XG4gICAgICAgIHRoaXMuYW1vdW50ID0gYW1vdW50O1xuICAgICAgICB0aGlzLmJhc2VBbW91bnQgPSBiYXNlQW1vdW50O1xuICAgICAgICB0aGlzLm9ic2VydmVyQW1vdW50ID0gb2JzZXJ2ZXJBbW91bnQ7XG4gICAgICAgIHRoaXMucmV2aWV3ZXJBbW91bnQgPSByZXZpZXdlckFtb3VudDtcbiAgICAgICAgdGhpcy50YXNrQW1vdW50ID0gdGFza0Ftb3VudDtcbiAgICAgICAgdGhpcy5ibG9ja051bWJlciA9IGJsb2NrTnVtYmVyO1xuICAgICAgICB0aGlzLmV2ZW50SW5kZXggPSBldmVudEluZGV4O1xuICAgICAgICB0aGlzLmJsb2NrSGFzaCA9IGJsb2NrSGFzaDtcbiAgICB9XG4gICAgZ2V0IF9uYW1lKCkge1xuICAgICAgICByZXR1cm4gJ0FnZW50UmV3YXJkRXZlbnQnO1xuICAgIH1cbiAgICBhc3luYyBzYXZlKCkge1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuaWQ7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShpZCAhPT0gbnVsbCwgXCJDYW5ub3Qgc2F2ZSBBZ2VudFJld2FyZEV2ZW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXQoJ0FnZW50UmV3YXJkRXZlbnQnLCBpZC50b1N0cmluZygpLCB0aGlzKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIHJlbW92ZShpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHJlbW92ZSBBZ2VudFJld2FyZEV2ZW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5yZW1vdmUoJ0FnZW50UmV3YXJkRXZlbnQnLCBpZC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIGdldChpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoKGlkICE9PSBudWxsICYmIGlkICE9PSB1bmRlZmluZWQpLCBcIkNhbm5vdCBnZXQgQWdlbnRSZXdhcmRFdmVudCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgc3RvcmUuZ2V0KCdBZ2VudFJld2FyZEV2ZW50JywgaWQudG9TdHJpbmcoKSk7XG4gICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZShyZWNvcmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgZW50aXRpZXMgbWF0Y2hpbmcgdGhlIHNwZWNpZmllZCBmaWx0ZXJzIGFuZCBvcHRpb25zLlxuICAgICAqXG4gICAgICog4pqg77iPIFRoaXMgZnVuY3Rpb24gd2lsbCBmaXJzdCBzZWFyY2ggY2FjaGUgZGF0YSBmb2xsb3dlZCBieSBEQiBkYXRhLiBQbGVhc2UgY29uc2lkZXIgdGhpcyB3aGVuIHVzaW5nIG9yZGVyIGFuZCBvZmZzZXQgb3B0aW9ucy7imqDvuI9cbiAgICAgKiAqL1xuICAgIHN0YXRpYyBhc3luYyBnZXRCeUZpZWxkcyhmaWx0ZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkcyA9IGF3YWl0IHN0b3JlLmdldEJ5RmllbGRzKCdBZ2VudFJld2FyZEV2ZW50JywgZmlsdGVyLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB0aGlzLmNyZWF0ZShyZWNvcmQpKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShyZWNvcmQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHJlY29yZC5pZCAhPT0gdW5kZWZpbmVkICYmIHJlY29yZC5pZCAhPT0gbnVsbCwgXCJpZCBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgdGhpcyhyZWNvcmQuaWQsIHJlY29yZC5jaGFpbklkLCByZWNvcmQuaWRlbnRpdHlJZCwgcmVjb3JkLmFnZW50SWQsIHJlY29yZC5ldmVudFR5cGUsIHJlY29yZC5yZXdhcmRLaW5kLCByZWNvcmQuYW1vdW50LCByZWNvcmQuYmFzZUFtb3VudCwgcmVjb3JkLm9ic2VydmVyQW1vdW50LCByZWNvcmQucmV2aWV3ZXJBbW91bnQsIHJlY29yZC50YXNrQW1vdW50LCByZWNvcmQuYmxvY2tOdW1iZXIsIHJlY29yZC5ldmVudEluZGV4LCByZWNvcmQuYmxvY2tIYXNoKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHksIHJlY29yZCk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxufVxuZXhwb3J0cy5BZ2VudFJld2FyZEV2ZW50ID0gQWdlbnRSZXdhcmRFdmVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BZ2VudFJld2FyZExlZGdlciA9IHZvaWQgMDtcbmNvbnN0IHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG5jb25zdCBhc3NlcnRfMSA9IHRzbGliXzEuX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJhc3NlcnRcIikpO1xuY2xhc3MgQWdlbnRSZXdhcmRMZWRnZXIge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBjaGFpbklkLCBpZGVudGl0eUlkLCBhZ2VudElkLCBjbGFpbWFibGVUb3RhbCwgY2xhaW1lZFRvdGFsLCBjbGFpbWFibGVCYXNlLCBjbGFpbWFibGVPYnNlcnZlciwgY2xhaW1hYmxlUmV2aWV3ZXIsIGNsYWltYWJsZVRhc2ssIGNsYWltZWRCYXNlLCBjbGFpbWVkT2JzZXJ2ZXIsIGNsYWltZWRSZXZpZXdlciwgY2xhaW1lZFRhc2ssIHVwZGF0ZWRBdEJsb2NrKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jaGFpbklkID0gY2hhaW5JZDtcbiAgICAgICAgdGhpcy5pZGVudGl0eUlkID0gaWRlbnRpdHlJZDtcbiAgICAgICAgdGhpcy5hZ2VudElkID0gYWdlbnRJZDtcbiAgICAgICAgdGhpcy5jbGFpbWFibGVUb3RhbCA9IGNsYWltYWJsZVRvdGFsO1xuICAgICAgICB0aGlzLmNsYWltZWRUb3RhbCA9IGNsYWltZWRUb3RhbDtcbiAgICAgICAgdGhpcy5jbGFpbWFibGVCYXNlID0gY2xhaW1hYmxlQmFzZTtcbiAgICAgICAgdGhpcy5jbGFpbWFibGVPYnNlcnZlciA9IGNsYWltYWJsZU9ic2VydmVyO1xuICAgICAgICB0aGlzLmNsYWltYWJsZVJldmlld2VyID0gY2xhaW1hYmxlUmV2aWV3ZXI7XG4gICAgICAgIHRoaXMuY2xhaW1hYmxlVGFzayA9IGNsYWltYWJsZVRhc2s7XG4gICAgICAgIHRoaXMuY2xhaW1lZEJhc2UgPSBjbGFpbWVkQmFzZTtcbiAgICAgICAgdGhpcy5jbGFpbWVkT2JzZXJ2ZXIgPSBjbGFpbWVkT2JzZXJ2ZXI7XG4gICAgICAgIHRoaXMuY2xhaW1lZFJldmlld2VyID0gY2xhaW1lZFJldmlld2VyO1xuICAgICAgICB0aGlzLmNsYWltZWRUYXNrID0gY2xhaW1lZFRhc2s7XG4gICAgICAgIHRoaXMudXBkYXRlZEF0QmxvY2sgPSB1cGRhdGVkQXRCbG9jaztcbiAgICB9XG4gICAgZ2V0IF9uYW1lKCkge1xuICAgICAgICByZXR1cm4gJ0FnZW50UmV3YXJkTGVkZ2VyJztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgQWdlbnRSZXdhcmRMZWRnZXIgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNldCgnQWdlbnRSZXdhcmRMZWRnZXInLCBpZC50b1N0cmluZygpLCB0aGlzKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIHJlbW92ZShpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHJlbW92ZSBBZ2VudFJld2FyZExlZGdlciBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdBZ2VudFJld2FyZExlZGdlcicsIGlkLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgZ2V0KGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSgoaWQgIT09IG51bGwgJiYgaWQgIT09IHVuZGVmaW5lZCksIFwiQ2Fubm90IGdldCBBZ2VudFJld2FyZExlZGdlciBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgc3RvcmUuZ2V0KCdBZ2VudFJld2FyZExlZGdlcicsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnQWdlbnRSZXdhcmRMZWRnZXInLCBmaWx0ZXIsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHRoaXMuY3JlYXRlKHJlY29yZCkpO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKHJlY29yZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkocmVjb3JkLmlkICE9PSB1bmRlZmluZWQgJiYgcmVjb3JkLmlkICE9PSBudWxsLCBcImlkIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IG5ldyB0aGlzKHJlY29yZC5pZCwgcmVjb3JkLmNoYWluSWQsIHJlY29yZC5pZGVudGl0eUlkLCByZWNvcmQuYWdlbnRJZCwgcmVjb3JkLmNsYWltYWJsZVRvdGFsLCByZWNvcmQuY2xhaW1lZFRvdGFsLCByZWNvcmQuY2xhaW1hYmxlQmFzZSwgcmVjb3JkLmNsYWltYWJsZU9ic2VydmVyLCByZWNvcmQuY2xhaW1hYmxlUmV2aWV3ZXIsIHJlY29yZC5jbGFpbWFibGVUYXNrLCByZWNvcmQuY2xhaW1lZEJhc2UsIHJlY29yZC5jbGFpbWVkT2JzZXJ2ZXIsIHJlY29yZC5jbGFpbWVkUmV2aWV3ZXIsIHJlY29yZC5jbGFpbWVkVGFzaywgcmVjb3JkLnVwZGF0ZWRBdEJsb2NrKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHksIHJlY29yZCk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxufVxuZXhwb3J0cy5BZ2VudFJld2FyZExlZGdlciA9IEFnZW50UmV3YXJkTGVkZ2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFnZW50U3Rha2VFdmVudCA9IHZvaWQgMDtcbmNvbnN0IHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG5jb25zdCBhc3NlcnRfMSA9IHRzbGliXzEuX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJhc3NlcnRcIikpO1xuY2xhc3MgQWdlbnRTdGFrZUV2ZW50IHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgaWRlbnRpdHlJZCwgYWdlbnRJZCwgZXZlbnRUeXBlLCBibG9ja051bWJlciwgZXZlbnRJbmRleCwgYmxvY2tIYXNoKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jaGFpbklkID0gY2hhaW5JZDtcbiAgICAgICAgdGhpcy5pZGVudGl0eUlkID0gaWRlbnRpdHlJZDtcbiAgICAgICAgdGhpcy5hZ2VudElkID0gYWdlbnRJZDtcbiAgICAgICAgdGhpcy5ldmVudFR5cGUgPSBldmVudFR5cGU7XG4gICAgICAgIHRoaXMuYmxvY2tOdW1iZXIgPSBibG9ja051bWJlcjtcbiAgICAgICAgdGhpcy5ldmVudEluZGV4ID0gZXZlbnRJbmRleDtcbiAgICAgICAgdGhpcy5ibG9ja0hhc2ggPSBibG9ja0hhc2g7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdBZ2VudFN0YWtlRXZlbnQnO1xuICAgIH1cbiAgICBhc3luYyBzYXZlKCkge1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuaWQ7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShpZCAhPT0gbnVsbCwgXCJDYW5ub3Qgc2F2ZSBBZ2VudFN0YWtlRXZlbnQgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNldCgnQWdlbnRTdGFrZUV2ZW50JywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgQWdlbnRTdGFrZUV2ZW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5yZW1vdmUoJ0FnZW50U3Rha2VFdmVudCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgZ2V0KGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSgoaWQgIT09IG51bGwgJiYgaWQgIT09IHVuZGVmaW5lZCksIFwiQ2Fubm90IGdldCBBZ2VudFN0YWtlRXZlbnQgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnQWdlbnRTdGFrZUV2ZW50JywgaWQudG9TdHJpbmcoKSk7XG4gICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZShyZWNvcmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgZW50aXRpZXMgbWF0Y2hpbmcgdGhlIHNwZWNpZmllZCBmaWx0ZXJzIGFuZCBvcHRpb25zLlxuICAgICAqXG4gICAgICog4pqg77iPIFRoaXMgZnVuY3Rpb24gd2lsbCBmaXJzdCBzZWFyY2ggY2FjaGUgZGF0YSBmb2xsb3dlZCBieSBEQiBkYXRhLiBQbGVhc2UgY29uc2lkZXIgdGhpcyB3aGVuIHVzaW5nIG9yZGVyIGFuZCBvZmZzZXQgb3B0aW9ucy7imqDvuI9cbiAgICAgKiAqL1xuICAgIHN0YXRpYyBhc3luYyBnZXRCeUZpZWxkcyhmaWx0ZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkcyA9IGF3YWl0IHN0b3JlLmdldEJ5RmllbGRzKCdBZ2VudFN0YWtlRXZlbnQnLCBmaWx0ZXIsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHRoaXMuY3JlYXRlKHJlY29yZCkpO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKHJlY29yZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkocmVjb3JkLmlkICE9PSB1bmRlZmluZWQgJiYgcmVjb3JkLmlkICE9PSBudWxsLCBcImlkIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IG5ldyB0aGlzKHJlY29yZC5pZCwgcmVjb3JkLmNoYWluSWQsIHJlY29yZC5pZGVudGl0eUlkLCByZWNvcmQuYWdlbnRJZCwgcmVjb3JkLmV2ZW50VHlwZSwgcmVjb3JkLmJsb2NrTnVtYmVyLCByZWNvcmQuZXZlbnRJbmRleCwgcmVjb3JkLmJsb2NrSGFzaCk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZW50aXR5LCByZWNvcmQpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cbn1cbmV4cG9ydHMuQWdlbnRTdGFrZUV2ZW50ID0gQWdlbnRTdGFrZUV2ZW50O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFnZW50U3Rha2VMZWRnZXIgPSB2b2lkIDA7XG5jb25zdCB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xuY29uc3QgYXNzZXJ0XzEgPSB0c2xpYl8xLl9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNsYXNzIEFnZW50U3Rha2VMZWRnZXIge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBjaGFpbklkLCBpZGVudGl0eUlkLCBhZ2VudElkLCBhY3RpdmVBbW91bnQsIHVuYm9uZGluZ0Ftb3VudCwgc3RhdHVzLCByZWxlYXNlQmxvY2tlZCwgdXBkYXRlZEF0QmxvY2spIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNoYWluSWQgPSBjaGFpbklkO1xuICAgICAgICB0aGlzLmlkZW50aXR5SWQgPSBpZGVudGl0eUlkO1xuICAgICAgICB0aGlzLmFnZW50SWQgPSBhZ2VudElkO1xuICAgICAgICB0aGlzLmFjdGl2ZUFtb3VudCA9IGFjdGl2ZUFtb3VudDtcbiAgICAgICAgdGhpcy51bmJvbmRpbmdBbW91bnQgPSB1bmJvbmRpbmdBbW91bnQ7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICB0aGlzLnJlbGVhc2VCbG9ja2VkID0gcmVsZWFzZUJsb2NrZWQ7XG4gICAgICAgIHRoaXMudXBkYXRlZEF0QmxvY2sgPSB1cGRhdGVkQXRCbG9jaztcbiAgICB9XG4gICAgZ2V0IF9uYW1lKCkge1xuICAgICAgICByZXR1cm4gJ0FnZW50U3Rha2VMZWRnZXInO1xuICAgIH1cbiAgICBhc3luYyBzYXZlKCkge1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuaWQ7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShpZCAhPT0gbnVsbCwgXCJDYW5ub3Qgc2F2ZSBBZ2VudFN0YWtlTGVkZ2VyIGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXQoJ0FnZW50U3Rha2VMZWRnZXInLCBpZC50b1N0cmluZygpLCB0aGlzKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIHJlbW92ZShpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHJlbW92ZSBBZ2VudFN0YWtlTGVkZ2VyIGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5yZW1vdmUoJ0FnZW50U3Rha2VMZWRnZXInLCBpZC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIGdldChpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoKGlkICE9PSBudWxsICYmIGlkICE9PSB1bmRlZmluZWQpLCBcIkNhbm5vdCBnZXQgQWdlbnRTdGFrZUxlZGdlciBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgc3RvcmUuZ2V0KCdBZ2VudFN0YWtlTGVkZ2VyJywgaWQudG9TdHJpbmcoKSk7XG4gICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZShyZWNvcmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgZW50aXRpZXMgbWF0Y2hpbmcgdGhlIHNwZWNpZmllZCBmaWx0ZXJzIGFuZCBvcHRpb25zLlxuICAgICAqXG4gICAgICog4pqg77iPIFRoaXMgZnVuY3Rpb24gd2lsbCBmaXJzdCBzZWFyY2ggY2FjaGUgZGF0YSBmb2xsb3dlZCBieSBEQiBkYXRhLiBQbGVhc2UgY29uc2lkZXIgdGhpcyB3aGVuIHVzaW5nIG9yZGVyIGFuZCBvZmZzZXQgb3B0aW9ucy7imqDvuI9cbiAgICAgKiAqL1xuICAgIHN0YXRpYyBhc3luYyBnZXRCeUZpZWxkcyhmaWx0ZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkcyA9IGF3YWl0IHN0b3JlLmdldEJ5RmllbGRzKCdBZ2VudFN0YWtlTGVkZ2VyJywgZmlsdGVyLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB0aGlzLmNyZWF0ZShyZWNvcmQpKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShyZWNvcmQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHJlY29yZC5pZCAhPT0gdW5kZWZpbmVkICYmIHJlY29yZC5pZCAhPT0gbnVsbCwgXCJpZCBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgdGhpcyhyZWNvcmQuaWQsIHJlY29yZC5jaGFpbklkLCByZWNvcmQuaWRlbnRpdHlJZCwgcmVjb3JkLmFnZW50SWQsIHJlY29yZC5hY3RpdmVBbW91bnQsIHJlY29yZC51bmJvbmRpbmdBbW91bnQsIHJlY29yZC5zdGF0dXMsIHJlY29yZC5yZWxlYXNlQmxvY2tlZCwgcmVjb3JkLnVwZGF0ZWRBdEJsb2NrKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHksIHJlY29yZCk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxufVxuZXhwb3J0cy5BZ2VudFN0YWtlTGVkZ2VyID0gQWdlbnRTdGFrZUxlZGdlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5DaGFpbkNoZWNrcG9pbnQgPSB2b2lkIDA7XG5jb25zdCB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xuY29uc3QgYXNzZXJ0XzEgPSB0c2xpYl8xLl9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNsYXNzIENoYWluQ2hlY2twb2ludCB7XG4gICAgY29uc3RydWN0b3IoaWQsIGNoYWluSWQsIGJsb2NrTnVtYmVyLCBibG9ja0hhc2gsIHVwZGF0ZWRBdCkge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuY2hhaW5JZCA9IGNoYWluSWQ7XG4gICAgICAgIHRoaXMuYmxvY2tOdW1iZXIgPSBibG9ja051bWJlcjtcbiAgICAgICAgdGhpcy5ibG9ja0hhc2ggPSBibG9ja0hhc2g7XG4gICAgICAgIHRoaXMudXBkYXRlZEF0ID0gdXBkYXRlZEF0O1xuICAgIH1cbiAgICBnZXQgX25hbWUoKSB7XG4gICAgICAgIHJldHVybiAnQ2hhaW5DaGVja3BvaW50JztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgQ2hhaW5DaGVja3BvaW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXQoJ0NoYWluQ2hlY2twb2ludCcsIGlkLnRvU3RyaW5nKCksIHRoaXMpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgcmVtb3ZlKGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShpZCAhPT0gbnVsbCwgXCJDYW5ub3QgcmVtb3ZlIENoYWluQ2hlY2twb2ludCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdDaGFpbkNoZWNrcG9pbnQnLCBpZC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIGdldChpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoKGlkICE9PSBudWxsICYmIGlkICE9PSB1bmRlZmluZWQpLCBcIkNhbm5vdCBnZXQgQ2hhaW5DaGVja3BvaW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCBzdG9yZS5nZXQoJ0NoYWluQ2hlY2twb2ludCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnQ2hhaW5DaGVja3BvaW50JywgZmlsdGVyLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB0aGlzLmNyZWF0ZShyZWNvcmQpKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShyZWNvcmQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHJlY29yZC5pZCAhPT0gdW5kZWZpbmVkICYmIHJlY29yZC5pZCAhPT0gbnVsbCwgXCJpZCBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgdGhpcyhyZWNvcmQuaWQsIHJlY29yZC5jaGFpbklkLCByZWNvcmQuYmxvY2tOdW1iZXIsIHJlY29yZC5ibG9ja0hhc2gsIHJlY29yZC51cGRhdGVkQXQpO1xuICAgICAgICBPYmplY3QuYXNzaWduKGVudGl0eSwgcmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG59XG5leHBvcnRzLkNoYWluQ2hlY2twb2ludCA9IENoYWluQ2hlY2twb2ludDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5DaGFpbklkZW50aXR5ID0gdm9pZCAwO1xuY29uc3QgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbmNvbnN0IGFzc2VydF8xID0gdHNsaWJfMS5fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImFzc2VydFwiKSk7XG5jbGFzcyBDaGFpbklkZW50aXR5IHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgaWRlbnRpdHlJZCwgb3duZXIsIHN0YXR1cywgY3JlYXRlZEF0QmxvY2ssIHVwZGF0ZWRBdEJsb2NrKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jaGFpbklkID0gY2hhaW5JZDtcbiAgICAgICAgdGhpcy5pZGVudGl0eUlkID0gaWRlbnRpdHlJZDtcbiAgICAgICAgdGhpcy5vd25lciA9IG93bmVyO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgICAgdGhpcy5jcmVhdGVkQXRCbG9jayA9IGNyZWF0ZWRBdEJsb2NrO1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdEJsb2NrID0gdXBkYXRlZEF0QmxvY2s7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdDaGFpbklkZW50aXR5JztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgQ2hhaW5JZGVudGl0eSBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUuc2V0KCdDaGFpbklkZW50aXR5JywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgQ2hhaW5JZGVudGl0eSBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdDaGFpbklkZW50aXR5JywgaWQudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyBnZXQoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKChpZCAhPT0gbnVsbCAmJiBpZCAhPT0gdW5kZWZpbmVkKSwgXCJDYW5ub3QgZ2V0IENoYWluSWRlbnRpdHkgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnQ2hhaW5JZGVudGl0eScsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnQ2hhaW5JZGVudGl0eScsIGZpbHRlciwgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiByZWNvcmRzLm1hcChyZWNvcmQgPT4gdGhpcy5jcmVhdGUocmVjb3JkKSk7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUocmVjb3JkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShyZWNvcmQuaWQgIT09IHVuZGVmaW5lZCAmJiByZWNvcmQuaWQgIT09IG51bGwsIFwiaWQgbXVzdCBiZSBwcm92aWRlZFwiKTtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gbmV3IHRoaXMocmVjb3JkLmlkLCByZWNvcmQuY2hhaW5JZCwgcmVjb3JkLmlkZW50aXR5SWQsIHJlY29yZC5vd25lciwgcmVjb3JkLnN0YXR1cywgcmVjb3JkLmNyZWF0ZWRBdEJsb2NrLCByZWNvcmQudXBkYXRlZEF0QmxvY2spO1xuICAgICAgICBPYmplY3QuYXNzaWduKGVudGl0eSwgcmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG59XG5leHBvcnRzLkNoYWluSWRlbnRpdHkgPSBDaGFpbklkZW50aXR5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkVtZXJnZW5jeVN0YXR1cyA9IHZvaWQgMDtcbmNvbnN0IHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG5jb25zdCBhc3NlcnRfMSA9IHRzbGliXzEuX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJhc3NlcnRcIikpO1xuY2xhc3MgRW1lcmdlbmN5U3RhdHVzIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgc2NvcGUsIHN0YXR1cywgdXBkYXRlZEF0QmxvY2spIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNoYWluSWQgPSBjaGFpbklkO1xuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdEJsb2NrID0gdXBkYXRlZEF0QmxvY2s7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdFbWVyZ2VuY3lTdGF0dXMnO1xuICAgIH1cbiAgICBhc3luYyBzYXZlKCkge1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuaWQ7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShpZCAhPT0gbnVsbCwgXCJDYW5ub3Qgc2F2ZSBFbWVyZ2VuY3lTdGF0dXMgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNldCgnRW1lcmdlbmN5U3RhdHVzJywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgRW1lcmdlbmN5U3RhdHVzIGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5yZW1vdmUoJ0VtZXJnZW5jeVN0YXR1cycsIGlkLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgZ2V0KGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSgoaWQgIT09IG51bGwgJiYgaWQgIT09IHVuZGVmaW5lZCksIFwiQ2Fubm90IGdldCBFbWVyZ2VuY3lTdGF0dXMgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnRW1lcmdlbmN5U3RhdHVzJywgaWQudG9TdHJpbmcoKSk7XG4gICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZShyZWNvcmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgZW50aXRpZXMgbWF0Y2hpbmcgdGhlIHNwZWNpZmllZCBmaWx0ZXJzIGFuZCBvcHRpb25zLlxuICAgICAqXG4gICAgICog4pqg77iPIFRoaXMgZnVuY3Rpb24gd2lsbCBmaXJzdCBzZWFyY2ggY2FjaGUgZGF0YSBmb2xsb3dlZCBieSBEQiBkYXRhLiBQbGVhc2UgY29uc2lkZXIgdGhpcyB3aGVuIHVzaW5nIG9yZGVyIGFuZCBvZmZzZXQgb3B0aW9ucy7imqDvuI9cbiAgICAgKiAqL1xuICAgIHN0YXRpYyBhc3luYyBnZXRCeUZpZWxkcyhmaWx0ZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkcyA9IGF3YWl0IHN0b3JlLmdldEJ5RmllbGRzKCdFbWVyZ2VuY3lTdGF0dXMnLCBmaWx0ZXIsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHRoaXMuY3JlYXRlKHJlY29yZCkpO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKHJlY29yZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkocmVjb3JkLmlkICE9PSB1bmRlZmluZWQgJiYgcmVjb3JkLmlkICE9PSBudWxsLCBcImlkIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IG5ldyB0aGlzKHJlY29yZC5pZCwgcmVjb3JkLmNoYWluSWQsIHJlY29yZC5zY29wZSwgcmVjb3JkLnN0YXR1cywgcmVjb3JkLnVwZGF0ZWRBdEJsb2NrKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHksIHJlY29yZCk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxufVxuZXhwb3J0cy5FbWVyZ2VuY3lTdGF0dXMgPSBFbWVyZ2VuY3lTdGF0dXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuSWRlbnRpdHlLZXkgPSB2b2lkIDA7XG5jb25zdCB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xuY29uc3QgYXNzZXJ0XzEgPSB0c2xpYl8xLl9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNsYXNzIElkZW50aXR5S2V5IHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgaWRlbnRpdHlJZCwga2V5SWQsIGFjY291bnQsIHB1cnBvc2UsIHN0YXR1cywgdXBkYXRlZEF0QmxvY2spIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNoYWluSWQgPSBjaGFpbklkO1xuICAgICAgICB0aGlzLmlkZW50aXR5SWQgPSBpZGVudGl0eUlkO1xuICAgICAgICB0aGlzLmtleUlkID0ga2V5SWQ7XG4gICAgICAgIHRoaXMuYWNjb3VudCA9IGFjY291bnQ7XG4gICAgICAgIHRoaXMucHVycG9zZSA9IHB1cnBvc2U7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdEJsb2NrID0gdXBkYXRlZEF0QmxvY2s7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdJZGVudGl0eUtleSc7XG4gICAgfVxuICAgIGFzeW5jIHNhdmUoKSB7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5pZDtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCBzYXZlIElkZW50aXR5S2V5IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXQoJ0lkZW50aXR5S2V5JywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgSWRlbnRpdHlLZXkgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnJlbW92ZSgnSWRlbnRpdHlLZXknLCBpZC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIGdldChpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoKGlkICE9PSBudWxsICYmIGlkICE9PSB1bmRlZmluZWQpLCBcIkNhbm5vdCBnZXQgSWRlbnRpdHlLZXkgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnSWRlbnRpdHlLZXknLCBpZC50b1N0cmluZygpKTtcbiAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKHJlY29yZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyBlbnRpdGllcyBtYXRjaGluZyB0aGUgc3BlY2lmaWVkIGZpbHRlcnMgYW5kIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiDimqDvuI8gVGhpcyBmdW5jdGlvbiB3aWxsIGZpcnN0IHNlYXJjaCBjYWNoZSBkYXRhIGZvbGxvd2VkIGJ5IERCIGRhdGEuIFBsZWFzZSBjb25zaWRlciB0aGlzIHdoZW4gdXNpbmcgb3JkZXIgYW5kIG9mZnNldCBvcHRpb25zLuKaoO+4j1xuICAgICAqICovXG4gICAgc3RhdGljIGFzeW5jIGdldEJ5RmllbGRzKGZpbHRlciwgb3B0aW9ucykge1xuICAgICAgICBjb25zdCByZWNvcmRzID0gYXdhaXQgc3RvcmUuZ2V0QnlGaWVsZHMoJ0lkZW50aXR5S2V5JywgZmlsdGVyLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB0aGlzLmNyZWF0ZShyZWNvcmQpKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShyZWNvcmQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHJlY29yZC5pZCAhPT0gdW5kZWZpbmVkICYmIHJlY29yZC5pZCAhPT0gbnVsbCwgXCJpZCBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgdGhpcyhyZWNvcmQuaWQsIHJlY29yZC5jaGFpbklkLCByZWNvcmQuaWRlbnRpdHlJZCwgcmVjb3JkLmtleUlkLCByZWNvcmQuYWNjb3VudCwgcmVjb3JkLnB1cnBvc2UsIHJlY29yZC5zdGF0dXMsIHJlY29yZC51cGRhdGVkQXRCbG9jayk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZW50aXR5LCByZWNvcmQpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cbn1cbmV4cG9ydHMuSWRlbnRpdHlLZXkgPSBJZGVudGl0eUtleTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5QYXltZW50SW50ZW50ID0gdm9pZCAwO1xuY29uc3QgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbmNvbnN0IGFzc2VydF8xID0gdHNsaWJfMS5fX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImFzc2VydFwiKSk7XG5jbGFzcyBQYXltZW50SW50ZW50IHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgaW50ZW50SWQsIHBheWVySWRlbnRpdHlJZCwgcGF5ZWVJZGVudGl0eUlkLCBhbW91bnQsIHNldHRsZW1lbnRNb2RlLCBzdGF0dXMsIGNyZWF0ZWRBdEJsb2NrLCB1cGRhdGVkQXRCbG9jaykge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuY2hhaW5JZCA9IGNoYWluSWQ7XG4gICAgICAgIHRoaXMuaW50ZW50SWQgPSBpbnRlbnRJZDtcbiAgICAgICAgdGhpcy5wYXllcklkZW50aXR5SWQgPSBwYXllcklkZW50aXR5SWQ7XG4gICAgICAgIHRoaXMucGF5ZWVJZGVudGl0eUlkID0gcGF5ZWVJZGVudGl0eUlkO1xuICAgICAgICB0aGlzLmFtb3VudCA9IGFtb3VudDtcbiAgICAgICAgdGhpcy5zZXR0bGVtZW50TW9kZSA9IHNldHRsZW1lbnRNb2RlO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgICAgdGhpcy5jcmVhdGVkQXRCbG9jayA9IGNyZWF0ZWRBdEJsb2NrO1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdEJsb2NrID0gdXBkYXRlZEF0QmxvY2s7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdQYXltZW50SW50ZW50JztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgUGF5bWVudEludGVudCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUuc2V0KCdQYXltZW50SW50ZW50JywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgUGF5bWVudEludGVudCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdQYXltZW50SW50ZW50JywgaWQudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyBnZXQoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKChpZCAhPT0gbnVsbCAmJiBpZCAhPT0gdW5kZWZpbmVkKSwgXCJDYW5ub3QgZ2V0IFBheW1lbnRJbnRlbnQgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnUGF5bWVudEludGVudCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnUGF5bWVudEludGVudCcsIGZpbHRlciwgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiByZWNvcmRzLm1hcChyZWNvcmQgPT4gdGhpcy5jcmVhdGUocmVjb3JkKSk7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUocmVjb3JkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShyZWNvcmQuaWQgIT09IHVuZGVmaW5lZCAmJiByZWNvcmQuaWQgIT09IG51bGwsIFwiaWQgbXVzdCBiZSBwcm92aWRlZFwiKTtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gbmV3IHRoaXMocmVjb3JkLmlkLCByZWNvcmQuY2hhaW5JZCwgcmVjb3JkLmludGVudElkLCByZWNvcmQucGF5ZXJJZGVudGl0eUlkLCByZWNvcmQucGF5ZWVJZGVudGl0eUlkLCByZWNvcmQuYW1vdW50LCByZWNvcmQuc2V0dGxlbWVudE1vZGUsIHJlY29yZC5zdGF0dXMsIHJlY29yZC5jcmVhdGVkQXRCbG9jaywgcmVjb3JkLnVwZGF0ZWRBdEJsb2NrKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHksIHJlY29yZCk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxufVxuZXhwb3J0cy5QYXltZW50SW50ZW50ID0gUGF5bWVudEludGVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5SZXdhcmREYXlTdGF0ZSA9IHZvaWQgMDtcbmNvbnN0IHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG5jb25zdCBhc3NlcnRfMSA9IHRzbGliXzEuX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJhc3NlcnRcIikpO1xuY2xhc3MgUmV3YXJkRGF5U3RhdGUge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBjaGFpbklkLCBkYXlJbmRleCwgYmFzZVN0YWtpbmdCdWRnZXQsIG9ic2VydmVyUmV2aWV3ZXJCdWRnZXQsIHRhc2tNYXJrZXRCdWRnZXQsIGJhc2VTdGFraW5nUmVsZWFzZWQsIG9ic2VydmVyUmV2aWV3ZXJSZWxlYXNlZCwgdGFza01hcmtldFJlbGVhc2VkLCByb2xsb3ZlckJhc2VTdGFraW5nLCByb2xsb3Zlck9ic2VydmVyUmV2aWV3ZXIsIHJvbGxvdmVyVGFza01hcmtldCwgYmFzZVN0YWtpbmdTZXR0bGVkLCBvYnNlcnZlclJvdW5kc1NldHRsZWQsIHJldmlld2VyUm91bmRzU2V0dGxlZCwgdGFza1Jld2FyZHNTZXR0bGVkLCB1cGRhdGVkQXRCbG9jaykge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuY2hhaW5JZCA9IGNoYWluSWQ7XG4gICAgICAgIHRoaXMuZGF5SW5kZXggPSBkYXlJbmRleDtcbiAgICAgICAgdGhpcy5iYXNlU3Rha2luZ0J1ZGdldCA9IGJhc2VTdGFraW5nQnVkZ2V0O1xuICAgICAgICB0aGlzLm9ic2VydmVyUmV2aWV3ZXJCdWRnZXQgPSBvYnNlcnZlclJldmlld2VyQnVkZ2V0O1xuICAgICAgICB0aGlzLnRhc2tNYXJrZXRCdWRnZXQgPSB0YXNrTWFya2V0QnVkZ2V0O1xuICAgICAgICB0aGlzLmJhc2VTdGFraW5nUmVsZWFzZWQgPSBiYXNlU3Rha2luZ1JlbGVhc2VkO1xuICAgICAgICB0aGlzLm9ic2VydmVyUmV2aWV3ZXJSZWxlYXNlZCA9IG9ic2VydmVyUmV2aWV3ZXJSZWxlYXNlZDtcbiAgICAgICAgdGhpcy50YXNrTWFya2V0UmVsZWFzZWQgPSB0YXNrTWFya2V0UmVsZWFzZWQ7XG4gICAgICAgIHRoaXMucm9sbG92ZXJCYXNlU3Rha2luZyA9IHJvbGxvdmVyQmFzZVN0YWtpbmc7XG4gICAgICAgIHRoaXMucm9sbG92ZXJPYnNlcnZlclJldmlld2VyID0gcm9sbG92ZXJPYnNlcnZlclJldmlld2VyO1xuICAgICAgICB0aGlzLnJvbGxvdmVyVGFza01hcmtldCA9IHJvbGxvdmVyVGFza01hcmtldDtcbiAgICAgICAgdGhpcy5iYXNlU3Rha2luZ1NldHRsZWQgPSBiYXNlU3Rha2luZ1NldHRsZWQ7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJSb3VuZHNTZXR0bGVkID0gb2JzZXJ2ZXJSb3VuZHNTZXR0bGVkO1xuICAgICAgICB0aGlzLnJldmlld2VyUm91bmRzU2V0dGxlZCA9IHJldmlld2VyUm91bmRzU2V0dGxlZDtcbiAgICAgICAgdGhpcy50YXNrUmV3YXJkc1NldHRsZWQgPSB0YXNrUmV3YXJkc1NldHRsZWQ7XG4gICAgICAgIHRoaXMudXBkYXRlZEF0QmxvY2sgPSB1cGRhdGVkQXRCbG9jaztcbiAgICB9XG4gICAgZ2V0IF9uYW1lKCkge1xuICAgICAgICByZXR1cm4gJ1Jld2FyZERheVN0YXRlJztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgUmV3YXJkRGF5U3RhdGUgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNldCgnUmV3YXJkRGF5U3RhdGUnLCBpZC50b1N0cmluZygpLCB0aGlzKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIHJlbW92ZShpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHJlbW92ZSBSZXdhcmREYXlTdGF0ZSBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdSZXdhcmREYXlTdGF0ZScsIGlkLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgZ2V0KGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSgoaWQgIT09IG51bGwgJiYgaWQgIT09IHVuZGVmaW5lZCksIFwiQ2Fubm90IGdldCBSZXdhcmREYXlTdGF0ZSBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgc3RvcmUuZ2V0KCdSZXdhcmREYXlTdGF0ZScsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnUmV3YXJkRGF5U3RhdGUnLCBmaWx0ZXIsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHRoaXMuY3JlYXRlKHJlY29yZCkpO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKHJlY29yZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkocmVjb3JkLmlkICE9PSB1bmRlZmluZWQgJiYgcmVjb3JkLmlkICE9PSBudWxsLCBcImlkIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IG5ldyB0aGlzKHJlY29yZC5pZCwgcmVjb3JkLmNoYWluSWQsIHJlY29yZC5kYXlJbmRleCwgcmVjb3JkLmJhc2VTdGFraW5nQnVkZ2V0LCByZWNvcmQub2JzZXJ2ZXJSZXZpZXdlckJ1ZGdldCwgcmVjb3JkLnRhc2tNYXJrZXRCdWRnZXQsIHJlY29yZC5iYXNlU3Rha2luZ1JlbGVhc2VkLCByZWNvcmQub2JzZXJ2ZXJSZXZpZXdlclJlbGVhc2VkLCByZWNvcmQudGFza01hcmtldFJlbGVhc2VkLCByZWNvcmQucm9sbG92ZXJCYXNlU3Rha2luZywgcmVjb3JkLnJvbGxvdmVyT2JzZXJ2ZXJSZXZpZXdlciwgcmVjb3JkLnJvbGxvdmVyVGFza01hcmtldCwgcmVjb3JkLmJhc2VTdGFraW5nU2V0dGxlZCwgcmVjb3JkLm9ic2VydmVyUm91bmRzU2V0dGxlZCwgcmVjb3JkLnJldmlld2VyUm91bmRzU2V0dGxlZCwgcmVjb3JkLnRhc2tSZXdhcmRzU2V0dGxlZCwgcmVjb3JkLnVwZGF0ZWRBdEJsb2NrKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHksIHJlY29yZCk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxufVxuZXhwb3J0cy5SZXdhcmREYXlTdGF0ZSA9IFJld2FyZERheVN0YXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlJvdW5kUmV3YXJkU2V0dGxlbWVudCA9IHZvaWQgMDtcbmNvbnN0IHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG5jb25zdCBhc3NlcnRfMSA9IHRzbGliXzEuX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJhc3NlcnRcIikpO1xuY2xhc3MgUm91bmRSZXdhcmRTZXR0bGVtZW50IHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgY2hhaW5JZCwgcm91bmRJZCwgcm9sZSwgZGF5SW5kZXgsIHBhcnRpY2lwYW50Q291bnQsIHRvdGFsRWZmZWN0aXZlU3Rha2UsIHJlbGVhc2VkLCByb2xsb3ZlciwgYmxvY2tOdW1iZXIpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNoYWluSWQgPSBjaGFpbklkO1xuICAgICAgICB0aGlzLnJvdW5kSWQgPSByb3VuZElkO1xuICAgICAgICB0aGlzLnJvbGUgPSByb2xlO1xuICAgICAgICB0aGlzLmRheUluZGV4ID0gZGF5SW5kZXg7XG4gICAgICAgIHRoaXMucGFydGljaXBhbnRDb3VudCA9IHBhcnRpY2lwYW50Q291bnQ7XG4gICAgICAgIHRoaXMudG90YWxFZmZlY3RpdmVTdGFrZSA9IHRvdGFsRWZmZWN0aXZlU3Rha2U7XG4gICAgICAgIHRoaXMucmVsZWFzZWQgPSByZWxlYXNlZDtcbiAgICAgICAgdGhpcy5yb2xsb3ZlciA9IHJvbGxvdmVyO1xuICAgICAgICB0aGlzLmJsb2NrTnVtYmVyID0gYmxvY2tOdW1iZXI7XG4gICAgfVxuICAgIGdldCBfbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdSb3VuZFJld2FyZFNldHRsZW1lbnQnO1xuICAgIH1cbiAgICBhc3luYyBzYXZlKCkge1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuaWQ7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShpZCAhPT0gbnVsbCwgXCJDYW5ub3Qgc2F2ZSBSb3VuZFJld2FyZFNldHRsZW1lbnQgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNldCgnUm91bmRSZXdhcmRTZXR0bGVtZW50JywgaWQudG9TdHJpbmcoKSwgdGhpcyk7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyByZW1vdmUoaWQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGlkICE9PSBudWxsLCBcIkNhbm5vdCByZW1vdmUgUm91bmRSZXdhcmRTZXR0bGVtZW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5yZW1vdmUoJ1JvdW5kUmV3YXJkU2V0dGxlbWVudCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgZ2V0KGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSgoaWQgIT09IG51bGwgJiYgaWQgIT09IHVuZGVmaW5lZCksIFwiQ2Fubm90IGdldCBSb3VuZFJld2FyZFNldHRsZW1lbnQgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHN0b3JlLmdldCgnUm91bmRSZXdhcmRTZXR0bGVtZW50JywgaWQudG9TdHJpbmcoKSk7XG4gICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZShyZWNvcmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgZW50aXRpZXMgbWF0Y2hpbmcgdGhlIHNwZWNpZmllZCBmaWx0ZXJzIGFuZCBvcHRpb25zLlxuICAgICAqXG4gICAgICog4pqg77iPIFRoaXMgZnVuY3Rpb24gd2lsbCBmaXJzdCBzZWFyY2ggY2FjaGUgZGF0YSBmb2xsb3dlZCBieSBEQiBkYXRhLiBQbGVhc2UgY29uc2lkZXIgdGhpcyB3aGVuIHVzaW5nIG9yZGVyIGFuZCBvZmZzZXQgb3B0aW9ucy7imqDvuI9cbiAgICAgKiAqL1xuICAgIHN0YXRpYyBhc3luYyBnZXRCeUZpZWxkcyhmaWx0ZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkcyA9IGF3YWl0IHN0b3JlLmdldEJ5RmllbGRzKCdSb3VuZFJld2FyZFNldHRsZW1lbnQnLCBmaWx0ZXIsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHRoaXMuY3JlYXRlKHJlY29yZCkpO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKHJlY29yZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkocmVjb3JkLmlkICE9PSB1bmRlZmluZWQgJiYgcmVjb3JkLmlkICE9PSBudWxsLCBcImlkIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IG5ldyB0aGlzKHJlY29yZC5pZCwgcmVjb3JkLmNoYWluSWQsIHJlY29yZC5yb3VuZElkLCByZWNvcmQucm9sZSwgcmVjb3JkLmRheUluZGV4LCByZWNvcmQucGFydGljaXBhbnRDb3VudCwgcmVjb3JkLnRvdGFsRWZmZWN0aXZlU3Rha2UsIHJlY29yZC5yZWxlYXNlZCwgcmVjb3JkLnJvbGxvdmVyLCByZWNvcmQuYmxvY2tOdW1iZXIpO1xuICAgICAgICBPYmplY3QuYXNzaWduKGVudGl0eSwgcmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG59XG5leHBvcnRzLlJvdW5kUmV3YXJkU2V0dGxlbWVudCA9IFJvdW5kUmV3YXJkU2V0dGxlbWVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TZXR0bGVtZW50RXZlbnQgPSB2b2lkIDA7XG5jb25zdCB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xuY29uc3QgYXNzZXJ0XzEgPSB0c2xpYl8xLl9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNsYXNzIFNldHRsZW1lbnRFdmVudCB7XG4gICAgY29uc3RydWN0b3IoaWQsIGNoYWluSWQsIGludGVudElkLCBldmVudFR5cGUsIGJsb2NrTnVtYmVyLCBldmVudEluZGV4LCBibG9ja0hhc2gpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNoYWluSWQgPSBjaGFpbklkO1xuICAgICAgICB0aGlzLmludGVudElkID0gaW50ZW50SWQ7XG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gZXZlbnRUeXBlO1xuICAgICAgICB0aGlzLmJsb2NrTnVtYmVyID0gYmxvY2tOdW1iZXI7XG4gICAgICAgIHRoaXMuZXZlbnRJbmRleCA9IGV2ZW50SW5kZXg7XG4gICAgICAgIHRoaXMuYmxvY2tIYXNoID0gYmxvY2tIYXNoO1xuICAgIH1cbiAgICBnZXQgX25hbWUoKSB7XG4gICAgICAgIHJldHVybiAnU2V0dGxlbWVudEV2ZW50JztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgU2V0dGxlbWVudEV2ZW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBhd2FpdCBzdG9yZS5zZXQoJ1NldHRsZW1lbnRFdmVudCcsIGlkLnRvU3RyaW5nKCksIHRoaXMpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgcmVtb3ZlKGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShpZCAhPT0gbnVsbCwgXCJDYW5ub3QgcmVtb3ZlIFNldHRsZW1lbnRFdmVudCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdTZXR0bGVtZW50RXZlbnQnLCBpZC50b1N0cmluZygpKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIGdldChpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoKGlkICE9PSBudWxsICYmIGlkICE9PSB1bmRlZmluZWQpLCBcIkNhbm5vdCBnZXQgU2V0dGxlbWVudEV2ZW50IGVudGl0eSB3aXRob3V0IGFuIElEXCIpO1xuICAgICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCBzdG9yZS5nZXQoJ1NldHRsZW1lbnRFdmVudCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnU2V0dGxlbWVudEV2ZW50JywgZmlsdGVyLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlY29yZHMubWFwKHJlY29yZCA9PiB0aGlzLmNyZWF0ZShyZWNvcmQpKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShyZWNvcmQpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHJlY29yZC5pZCAhPT0gdW5kZWZpbmVkICYmIHJlY29yZC5pZCAhPT0gbnVsbCwgXCJpZCBtdXN0IGJlIHByb3ZpZGVkXCIpO1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgdGhpcyhyZWNvcmQuaWQsIHJlY29yZC5jaGFpbklkLCByZWNvcmQuaW50ZW50SWQsIHJlY29yZC5ldmVudFR5cGUsIHJlY29yZC5ibG9ja051bWJlciwgcmVjb3JkLmV2ZW50SW5kZXgsIHJlY29yZC5ibG9ja0hhc2gpO1xuICAgICAgICBPYmplY3QuYXNzaWduKGVudGl0eSwgcmVjb3JkKTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG59XG5leHBvcnRzLlNldHRsZW1lbnRFdmVudCA9IFNldHRsZW1lbnRFdmVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5UYXNrUmV3YXJkU2V0dGxlbWVudCA9IHZvaWQgMDtcbmNvbnN0IHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG5jb25zdCBhc3NlcnRfMSA9IHRzbGliXzEuX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJhc3NlcnRcIikpO1xuY2xhc3MgVGFza1Jld2FyZFNldHRsZW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBjaGFpbklkLCB0YXNrSWQsIGlkZW50aXR5SWQsIGFnZW50SWQsIGRpZmZpY3VsdHksIGFtb3VudCwgZGF5SW5kZXgsIGJsb2NrTnVtYmVyKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jaGFpbklkID0gY2hhaW5JZDtcbiAgICAgICAgdGhpcy50YXNrSWQgPSB0YXNrSWQ7XG4gICAgICAgIHRoaXMuaWRlbnRpdHlJZCA9IGlkZW50aXR5SWQ7XG4gICAgICAgIHRoaXMuYWdlbnRJZCA9IGFnZW50SWQ7XG4gICAgICAgIHRoaXMuZGlmZmljdWx0eSA9IGRpZmZpY3VsdHk7XG4gICAgICAgIHRoaXMuYW1vdW50ID0gYW1vdW50O1xuICAgICAgICB0aGlzLmRheUluZGV4ID0gZGF5SW5kZXg7XG4gICAgICAgIHRoaXMuYmxvY2tOdW1iZXIgPSBibG9ja051bWJlcjtcbiAgICB9XG4gICAgZ2V0IF9uYW1lKCkge1xuICAgICAgICByZXR1cm4gJ1Rhc2tSZXdhcmRTZXR0bGVtZW50JztcbiAgICB9XG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHNhdmUgVGFza1Jld2FyZFNldHRsZW1lbnQgZW50aXR5IHdpdGhvdXQgYW4gSURcIik7XG4gICAgICAgIGF3YWl0IHN0b3JlLnNldCgnVGFza1Jld2FyZFNldHRsZW1lbnQnLCBpZC50b1N0cmluZygpLCB0aGlzKTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIHJlbW92ZShpZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoaWQgIT09IG51bGwsIFwiQ2Fubm90IHJlbW92ZSBUYXNrUmV3YXJkU2V0dGxlbWVudCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgYXdhaXQgc3RvcmUucmVtb3ZlKCdUYXNrUmV3YXJkU2V0dGxlbWVudCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgZ2V0KGlkKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSgoaWQgIT09IG51bGwgJiYgaWQgIT09IHVuZGVmaW5lZCksIFwiQ2Fubm90IGdldCBUYXNrUmV3YXJkU2V0dGxlbWVudCBlbnRpdHkgd2l0aG91dCBhbiBJRFwiKTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgc3RvcmUuZ2V0KCdUYXNrUmV3YXJkU2V0dGxlbWVudCcsIGlkLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIGVudGl0aWVzIG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgZmlsdGVycyBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIOKaoO+4jyBUaGlzIGZ1bmN0aW9uIHdpbGwgZmlyc3Qgc2VhcmNoIGNhY2hlIGRhdGEgZm9sbG93ZWQgYnkgREIgZGF0YS4gUGxlYXNlIGNvbnNpZGVyIHRoaXMgd2hlbiB1c2luZyBvcmRlciBhbmQgb2Zmc2V0IG9wdGlvbnMu4pqg77iPXG4gICAgICogKi9cbiAgICBzdGF0aWMgYXN5bmMgZ2V0QnlGaWVsZHMoZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBzdG9yZS5nZXRCeUZpZWxkcygnVGFza1Jld2FyZFNldHRsZW1lbnQnLCBmaWx0ZXIsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcmVjb3Jkcy5tYXAocmVjb3JkID0+IHRoaXMuY3JlYXRlKHJlY29yZCkpO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKHJlY29yZCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkocmVjb3JkLmlkICE9PSB1bmRlZmluZWQgJiYgcmVjb3JkLmlkICE9PSBudWxsLCBcImlkIG11c3QgYmUgcHJvdmlkZWRcIik7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IG5ldyB0aGlzKHJlY29yZC5pZCwgcmVjb3JkLmNoYWluSWQsIHJlY29yZC50YXNrSWQsIHJlY29yZC5pZGVudGl0eUlkLCByZWNvcmQuYWdlbnRJZCwgcmVjb3JkLmRpZmZpY3VsdHksIHJlY29yZC5hbW91bnQsIHJlY29yZC5kYXlJbmRleCwgcmVjb3JkLmJsb2NrTnVtYmVyKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHksIHJlY29yZCk7XG4gICAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxufVxuZXhwb3J0cy5UYXNrUmV3YXJkU2V0dGxlbWVudCA9IFRhc2tSZXdhcmRTZXR0bGVtZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXNzZXJ0XCIpOyIsImV4cG9ydCBjb25zdCBwYWNrYWdlSW5mbyA9IHsgbmFtZTogJ0Bwb2xrYWRvdC9hcGktYmFzZScsIHBhdGg6IChpbXBvcnQubWV0YSAmJiBpbXBvcnQubWV0YS51cmwpID8gbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLnN1YnN0cmluZygwLCBuZXcgVVJMKGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUubGFzdEluZGV4T2YoJy8nKSArIDEpIDogJ2F1dG8nLCB0eXBlOiAnZXNtJywgdmVyc2lvbjogJzE2LjUuNicgfTtcbiIsImV4cG9ydCBjb25zdCBwYWNrYWdlSW5mbyA9IHsgbmFtZTogJ0Bwb2xrYWRvdC90eXBlcycsIHBhdGg6IChpbXBvcnQubWV0YSAmJiBpbXBvcnQubWV0YS51cmwpID8gbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLnN1YnN0cmluZygwLCBuZXcgVVJMKGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUubGFzdEluZGV4T2YoJy8nKSArIDEpIDogJ2F1dG8nLCB0eXBlOiAnZXNtJywgdmVyc2lvbjogJzE2LjUuNicgfTtcbiIsImV4cG9ydCBjb25zdCBwYWNrYWdlSW5mbyA9IHsgbmFtZTogJ0Bwb2xrYWRvdC90eXBlcy1jb2RlYycsIHBhdGg6IChpbXBvcnQubWV0YSAmJiBpbXBvcnQubWV0YS51cmwpID8gbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLnN1YnN0cmluZygwLCBuZXcgVVJMKGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUubGFzdEluZGV4T2YoJy8nKSArIDEpIDogJ2F1dG8nLCB0eXBlOiAnZXNtJywgdmVyc2lvbjogJzE2LjUuNicgfTtcbiIsImV4cG9ydCB7IHBhY2thZ2VJbmZvIH0gZnJvbSAnLi9wYWNrYWdlSW5mby5qcyc7XG4vKiogQGludGVybmFsIExhc3QtcmVzb3J0IFwidGhpc1wiLCBpZiBpdCBnZXRzIGhlcmUgaXQgcHJvYmFibHkgd291bGQgZmFpbCBhbnl3YXkgKi9cbmZ1bmN0aW9uIGV2YWx1YXRlVGhpcyhmbikge1xuICAgIHJldHVybiBmbigncmV0dXJuIHRoaXMnKTtcbn1cbi8qKlxuICogQSBjcm9zcy1lbnZpcm9ubWVudCBpbXBsZW1lbnRhdGlvbiBmb3IgZ2xvYmFsVGhpc1xuICovXG5leHBvcnQgY29uc3QgeGdsb2JhbCA9IC8qI19fUFVSRV9fKi8gKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJ1xuICAgID8gZ2xvYmFsVGhpc1xuICAgIDogdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyBnbG9iYWxcbiAgICAgICAgOiB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgID8gc2VsZlxuICAgICAgICAgICAgOiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgID8gd2luZG93XG4gICAgICAgICAgICAgICAgOiBldmFsdWF0ZVRoaXMoRnVuY3Rpb24pKTtcbi8qKlxuICogRXh0cmFjdHMgYSBrbm93biBnbG9iYWwgZnJvbSB0aGUgZW52aXJvbm1lbnQsIGFwcGx5aW5nIGEgZmFsbGJhY2sgaWYgbm90IGZvdW5kXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0R2xvYmFsKG5hbWUsIGZhbGxiYWNrKSB7XG4gICAgLy8gTm90IHF1aXRlIHN1cmUgd2h5IHRoaXMgaXMgaGVyZSAtIHNudWNrIGluIHdpdGggVFMgNC43LjIgd2l0aCBubyByZWFsIGlkZWFcbiAgICAvLyAoYXMgb2Ygbm93KSBhcyB0byB3aHkgdGhpcyBsb29rcyBsaWtlIGFuIFwiYW55XCIgd2hlbiB3ZSBkbyBjYXN0IGl0IHRvIGEgVFxuICAgIC8vXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtcmV0dXJuXG4gICAgcmV0dXJuIHR5cGVvZiB4Z2xvYmFsW25hbWVdID09PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IGZhbGxiYWNrXG4gICAgICAgIDogeGdsb2JhbFtuYW1lXTtcbn1cbi8qKlxuICogRXhwb3NlIGEgdmFsdWUgYXMgYSBrbm93biBnbG9iYWwsIGlmIG5vdCBhbHJlYWR5IGRlZmluZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4cG9zZUdsb2JhbChuYW1lLCBmYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2YgeGdsb2JhbFtuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgeGdsb2JhbFtuYW1lXSA9IGZhbGxiYWNrO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IHhnbG9iYWwgfSBmcm9tICdAcG9sa2Fkb3QveC1nbG9iYWwnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXMvZnVuY3Rpb24uanMnO1xuY29uc3QgREVEVVBFID0gJ0VpdGhlciByZW1vdmUgYW5kIGV4cGxpY2l0bHkgaW5zdGFsbCBtYXRjaGluZyB2ZXJzaW9ucyBvciBkZWR1cGUgdXNpbmcgeW91ciBwYWNrYWdlIG1hbmFnZXIuXFxuVGhlIGZvbGxvd2luZyBjb25mbGljdGluZyBwYWNrYWdlcyB3ZXJlIGZvdW5kOic7XG5leHBvcnQgY29uc3QgUE9MS0FET1RKU19ESVNBQkxFX0VTTV9DSlNfV0FSTklOR19GTEFHID0gJ1BPTEtBRE9USlNfRElTQUJMRV9FU01fQ0pTX1dBUk5JTkcnO1xuLyoqIEBpbnRlcm5hbCAqL1xuZnVuY3Rpb24gZ2V0RW50cnkobmFtZSkge1xuICAgIGNvbnN0IF9nbG9iYWwgPSB4Z2xvYmFsO1xuICAgIGlmICghX2dsb2JhbC5fX3BvbGthZG90anMpIHtcbiAgICAgICAgX2dsb2JhbC5fX3BvbGthZG90anMgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFfZ2xvYmFsLl9fcG9sa2Fkb3Rqc1tuYW1lXSkge1xuICAgICAgICBfZ2xvYmFsLl9fcG9sa2Fkb3Rqc1tuYW1lXSA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gX2dsb2JhbC5fX3BvbGthZG90anNbbmFtZV07XG59XG4vKiogQGludGVybmFsICovXG5mdW5jdGlvbiBmb3JtYXREaXNwbGF5KGFsbCwgZm10KSB7XG4gICAgbGV0IG1heCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDAsIGNvdW50ID0gYWxsLmxlbmd0aDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgbWF4ID0gTWF0aC5tYXgobWF4LCBhbGxbaV0udmVyc2lvbi5sZW5ndGgpO1xuICAgIH1cbiAgICByZXR1cm4gYWxsXG4gICAgICAgIC5tYXAoKGQpID0+IGBcXHQke2ZtdChkLnZlcnNpb24ucGFkRW5kKG1heCksIGQpLmpvaW4oJ1xcdCcpfWApXG4gICAgICAgIC5qb2luKCdcXG4nKTtcbn1cbi8qKiBAaW50ZXJuYWwgKi9cbmZ1bmN0aW9uIGZvcm1hdEluZm8odmVyc2lvbiwgeyBuYW1lIH0pIHtcbiAgICByZXR1cm4gW1xuICAgICAgICB2ZXJzaW9uLFxuICAgICAgICBuYW1lXG4gICAgXTtcbn1cbi8qKiBAaW50ZXJuYWwgKi9cbmZ1bmN0aW9uIGZvcm1hdFZlcnNpb24odmVyc2lvbiwgeyBwYXRoLCB0eXBlIH0pIHtcbiAgICBsZXQgZXh0cmFjdGVkO1xuICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoID49IDUpIHtcbiAgICAgICAgY29uc3Qgbm1JbmRleCA9IHBhdGguaW5kZXhPZignbm9kZV9tb2R1bGVzJyk7XG4gICAgICAgIGV4dHJhY3RlZCA9IG5tSW5kZXggPT09IC0xXG4gICAgICAgICAgICA/IHBhdGhcbiAgICAgICAgICAgIDogcGF0aC5zdWJzdHJpbmcobm1JbmRleCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBleHRyYWN0ZWQgPSAnPHVua25vd24+JztcbiAgICB9XG4gICAgcmV0dXJuIFtcbiAgICAgICAgYCR7YCR7dHlwZSB8fCAnJ31gLnBhZFN0YXJ0KDMpfSAke3ZlcnNpb259YCxcbiAgICAgICAgZXh0cmFjdGVkXG4gICAgXTtcbn1cbi8qKiBAaW50ZXJuYWwgKi9cbmZ1bmN0aW9uIGdldFBhdGgoaW5mb1BhdGgsIHBhdGhPckZuKSB7XG4gICAgaWYgKGluZm9QYXRoKSB7XG4gICAgICAgIHJldHVybiBpbmZvUGF0aDtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNGdW5jdGlvbihwYXRoT3JGbikpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoT3JGbigpIHx8ICcnO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGF0aE9yRm4gfHwgJyc7XG59XG4vKiogQGludGVybmFsICovXG5mdW5jdGlvbiB3YXJuKHByZSwgYWxsLCBmbXQpIHtcbiAgICBjb25zb2xlLndhcm4oYCR7cHJlfVxcbiR7REVEVVBFfVxcbiR7Zm9ybWF0RGlzcGxheShhbGwsIGZtdCl9YCk7XG59XG4vKipcbiAqIEBuYW1lIGRldGVjdFBhY2thZ2VcbiAqIEBzdW1tYXJ5IENoZWNrcyB0aGF0IGEgc3BlY2lmaWMgcGFja2FnZSBpcyBvbmx5IGltcG9ydGVkIG9uY2VcbiAqIEBkZXNjcmlwdGlvbiBBIGBAcG9sa2Fkb3QvKmAgdmVyc2lvbiBkZXRlY3Rpb24gdXRpbGl0eSwgY2hlY2tpbmcgZm9yIG9uZSBvY2N1cnJlbmNlIG9mIGEgcGFja2FnZSBpbiBhZGRpdGlvbiB0byBjaGVja2luZyBmb3IgZGVwZW5kZW5jeSB2ZXJzaW9ucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRldGVjdFBhY2thZ2UoeyBuYW1lLCBwYXRoLCB0eXBlLCB2ZXJzaW9uIH0sIHBhdGhPckZuLCBkZXBzID0gW10pIHtcbiAgICBpZiAoIW5hbWUuc3RhcnRzV2l0aCgnQHBvbGthZG90JykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHBhY2thZ2UgZGVzY3JpcHRvciAke25hbWV9YCk7XG4gICAgfVxuICAgIGNvbnN0IGVudHJ5ID0gZ2V0RW50cnkobmFtZSk7XG4gICAgZW50cnkucHVzaCh7IHBhdGg6IGdldFBhdGgocGF0aCwgcGF0aE9yRm4pLCB0eXBlLCB2ZXJzaW9uIH0pO1xuICAgIC8vIGlmIHdlIGhhdmUgbW9yZSB0aGFuIG9uZSBlbnRyeSBhdCBESUZGRVJFTlQgdmVyc2lvbiB0eXBlcyB0aGVuIHdhcm4uIElmIHRoZXJlIGlzXG4gICAgLy8gbW9yZSB0aGFuIG9uZSBlbnRyeSBhdCB0aGUgc2FtZSB2ZXJzaW9uIGFuZCBFU00vQ0pTIGR1YWwgd2FybmluZ3MgYXJlIGRpc2FibGVkLFxuICAgIC8vIHRoZW4gZG8gbm90IGRpc3BsYXkgd2FybmluZ3NcbiAgICBjb25zdCBlbnRyaWVzU2FtZVZlcnNpb24gPSBlbnRyeS5ldmVyeSgoZSkgPT4gZS52ZXJzaW9uID09PSB2ZXJzaW9uKTtcbiAgICBjb25zdCBlc21DanNXYXJuaW5nRGlzYWJsZWQgPSB4Z2xvYmFsLnByb2Nlc3M/LmVudj8uW1BPTEtBRE9USlNfRElTQUJMRV9FU01fQ0pTX1dBUk5JTkdfRkxBR10gPT09ICcxJztcbiAgICBjb25zdCBtdWx0aXBsZUVudHJpZXMgPSBlbnRyeS5sZW5ndGggIT09IDE7XG4gICAgY29uc3QgZGlzYWJsZVdhcm5pbmdzID0gZXNtQ2pzV2FybmluZ0Rpc2FibGVkICYmIGVudHJpZXNTYW1lVmVyc2lvbjtcbiAgICBpZiAobXVsdGlwbGVFbnRyaWVzICYmICFkaXNhYmxlV2FybmluZ3MpIHtcbiAgICAgICAgd2FybihgJHtuYW1lfSBoYXMgbXVsdGlwbGUgdmVyc2lvbnMsIGVuc3VyZSB0aGF0IHRoZXJlIGlzIG9ubHkgb25lIGluc3RhbGxlZC5gLCBlbnRyeSwgZm9ybWF0VmVyc2lvbik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBtaXNtYXRjaGVzID0gZGVwcy5maWx0ZXIoKGQpID0+IGQgJiYgZC52ZXJzaW9uICE9PSB2ZXJzaW9uKTtcbiAgICAgICAgaWYgKG1pc21hdGNoZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB3YXJuKGAke25hbWV9IHJlcXVpcmVzIGRpcmVjdCBkZXBlbmRlbmNpZXMgZXhhY3RseSBtYXRjaGluZyB2ZXJzaW9uICR7dmVyc2lvbn0uYCwgbWlzbWF0Y2hlcywgZm9ybWF0SW5mbyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvKipcbiAqIEBuYW1lIGlzRnVuY3Rpb25cbiAqIEBzdW1tYXJ5IFRlc3RzIGZvciBhIGBmdW5jdGlvbmAuXG4gKiBAZGVzY3JpcHRpb25cbiAqIENoZWNrcyB0byBzZWUgaWYgdGhlIGlucHV0IHZhbHVlIGlzIGEgSmF2YVNjcmlwdCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKiA8QlI+XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJ0Bwb2xrYWRvdC91dGlsJztcbiAqXG4gKiBpc0Z1bmN0aW9uKCgpID0+IGZhbHNlKTsgLy8gPT4gdHJ1ZVxuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cbiIsImV4cG9ydCBjb25zdCBwYWNrYWdlSW5mbyA9IHsgbmFtZTogJ0Bwb2xrYWRvdC9hcGktYXVnbWVudCcsIHBhdGg6IChpbXBvcnQubWV0YSAmJiBpbXBvcnQubWV0YS51cmwpID8gbmV3IFVSTChpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLnN1YnN0cmluZygwLCBuZXcgVVJMKGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUubGFzdEluZGV4T2YoJy8nKSArIDEpIDogJ2F1dG8nLCB0eXBlOiAnZXNtJywgdmVyc2lvbjogJzE2LjUuNicgfTtcbiIsImltcG9ydCB7IHBhY2thZ2VJbmZvIGFzIGJhc2VJbmZvIH0gZnJvbSAnQHBvbGthZG90L2FwaS1iYXNlL3BhY2thZ2VJbmZvJztcbmltcG9ydCB7IHBhY2thZ2VJbmZvIGFzIHR5cGVzSW5mbyB9IGZyb20gJ0Bwb2xrYWRvdC90eXBlcy9wYWNrYWdlSW5mbyc7XG5pbXBvcnQgeyBwYWNrYWdlSW5mbyBhcyBjb2RlY0luZm8gfSBmcm9tICdAcG9sa2Fkb3QvdHlwZXMtY29kZWMvcGFja2FnZUluZm8nO1xuaW1wb3J0IHsgZGV0ZWN0UGFja2FnZSB9IGZyb20gJ0Bwb2xrYWRvdC91dGlsJztcbmltcG9ydCB7IHBhY2thZ2VJbmZvIH0gZnJvbSAnLi9wYWNrYWdlSW5mby5qcyc7XG5kZXRlY3RQYWNrYWdlKHBhY2thZ2VJbmZvLCBudWxsLCBbYmFzZUluZm8sIGNvZGVjSW5mbywgdHlwZXNJbmZvXSk7XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cblxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSwgU3VwcHJlc3NlZEVycm9yLCBTeW1ib2wsIEl0ZXJhdG9yICovXG5cbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xuICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xuICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufVxuXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XG4gIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XG4gICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XG4gICAgICB9XG4gICAgICByZXR1cm4gdDtcbiAgfVxuICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XG4gIHZhciB0ID0ge307XG4gIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxuICAgICAgdFtwXSA9IHNbcF07XG4gIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXG4gICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xuICAgICAgfVxuICByZXR1cm4gdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcbiAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX19lc0RlY29yYXRlKGN0b3IsIGRlc2NyaXB0b3JJbiwgZGVjb3JhdG9ycywgY29udGV4dEluLCBpbml0aWFsaXplcnMsIGV4dHJhSW5pdGlhbGl6ZXJzKSB7XG4gIGZ1bmN0aW9uIGFjY2VwdChmKSB7IGlmIChmICE9PSB2b2lkIDAgJiYgdHlwZW9mIGYgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZ1bmN0aW9uIGV4cGVjdGVkXCIpOyByZXR1cm4gZjsgfVxuICB2YXIga2luZCA9IGNvbnRleHRJbi5raW5kLCBrZXkgPSBraW5kID09PSBcImdldHRlclwiID8gXCJnZXRcIiA6IGtpbmQgPT09IFwic2V0dGVyXCIgPyBcInNldFwiIDogXCJ2YWx1ZVwiO1xuICB2YXIgdGFyZ2V0ID0gIWRlc2NyaXB0b3JJbiAmJiBjdG9yID8gY29udGV4dEluW1wic3RhdGljXCJdID8gY3RvciA6IGN0b3IucHJvdG90eXBlIDogbnVsbDtcbiAgdmFyIGRlc2NyaXB0b3IgPSBkZXNjcmlwdG9ySW4gfHwgKHRhcmdldCA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBjb250ZXh0SW4ubmFtZSkgOiB7fSk7XG4gIHZhciBfLCBkb25lID0gZmFsc2U7XG4gIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgY29udGV4dCA9IHt9O1xuICAgICAgZm9yICh2YXIgcCBpbiBjb250ZXh0SW4pIGNvbnRleHRbcF0gPSBwID09PSBcImFjY2Vzc1wiID8ge30gOiBjb250ZXh0SW5bcF07XG4gICAgICBmb3IgKHZhciBwIGluIGNvbnRleHRJbi5hY2Nlc3MpIGNvbnRleHQuYWNjZXNzW3BdID0gY29udGV4dEluLmFjY2Vzc1twXTtcbiAgICAgIGNvbnRleHQuYWRkSW5pdGlhbGl6ZXIgPSBmdW5jdGlvbiAoZikgeyBpZiAoZG9uZSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBhZGQgaW5pdGlhbGl6ZXJzIGFmdGVyIGRlY29yYXRpb24gaGFzIGNvbXBsZXRlZFwiKTsgZXh0cmFJbml0aWFsaXplcnMucHVzaChhY2NlcHQoZiB8fCBudWxsKSk7IH07XG4gICAgICB2YXIgcmVzdWx0ID0gKDAsIGRlY29yYXRvcnNbaV0pKGtpbmQgPT09IFwiYWNjZXNzb3JcIiA/IHsgZ2V0OiBkZXNjcmlwdG9yLmdldCwgc2V0OiBkZXNjcmlwdG9yLnNldCB9IDogZGVzY3JpcHRvcltrZXldLCBjb250ZXh0KTtcbiAgICAgIGlmIChraW5kID09PSBcImFjY2Vzc29yXCIpIHtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSB2b2lkIDApIGNvbnRpbnVlO1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwgfHwgdHlwZW9mIHJlc3VsdCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBleHBlY3RlZFwiKTtcbiAgICAgICAgICBpZiAoXyA9IGFjY2VwdChyZXN1bHQuZ2V0KSkgZGVzY3JpcHRvci5nZXQgPSBfO1xuICAgICAgICAgIGlmIChfID0gYWNjZXB0KHJlc3VsdC5zZXQpKSBkZXNjcmlwdG9yLnNldCA9IF87XG4gICAgICAgICAgaWYgKF8gPSBhY2NlcHQocmVzdWx0LmluaXQpKSBpbml0aWFsaXplcnMudW5zaGlmdChfKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKF8gPSBhY2NlcHQocmVzdWx0KSkge1xuICAgICAgICAgIGlmIChraW5kID09PSBcImZpZWxkXCIpIGluaXRpYWxpemVycy51bnNoaWZ0KF8pO1xuICAgICAgICAgIGVsc2UgZGVzY3JpcHRvcltrZXldID0gXztcbiAgICAgIH1cbiAgfVxuICBpZiAodGFyZ2V0KSBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBjb250ZXh0SW4ubmFtZSwgZGVzY3JpcHRvcik7XG4gIGRvbmUgPSB0cnVlO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fcnVuSW5pdGlhbGl6ZXJzKHRoaXNBcmcsIGluaXRpYWxpemVycywgdmFsdWUpIHtcbiAgdmFyIHVzZVZhbHVlID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaW5pdGlhbGl6ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWx1ZSA9IHVzZVZhbHVlID8gaW5pdGlhbGl6ZXJzW2ldLmNhbGwodGhpc0FyZywgdmFsdWUpIDogaW5pdGlhbGl6ZXJzW2ldLmNhbGwodGhpc0FyZyk7XG4gIH1cbiAgcmV0dXJuIHVzZVZhbHVlID8gdmFsdWUgOiB2b2lkIDA7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX19wcm9wS2V5KHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSBcInN5bWJvbFwiID8geCA6IFwiXCIuY29uY2F0KHgpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fc2V0RnVuY3Rpb25OYW1lKGYsIG5hbWUsIHByZWZpeCkge1xuICBpZiAodHlwZW9mIG5hbWUgPT09IFwic3ltYm9sXCIpIG5hbWUgPSBuYW1lLmRlc2NyaXB0aW9uID8gXCJbXCIuY29uY2F0KG5hbWUuZGVzY3JpcHRpb24sIFwiXVwiKSA6IFwiXCI7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZiwgXCJuYW1lXCIsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogcHJlZml4ID8gXCJcIi5jb25jYXQocHJlZml4LCBcIiBcIiwgbmFtZSkgOiBuYW1lIH0pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcbiAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZyA9IE9iamVjdC5jcmVhdGUoKHR5cGVvZiBJdGVyYXRvciA9PT0gXCJmdW5jdGlvblwiID8gSXRlcmF0b3IgOiBPYmplY3QpLnByb3RvdHlwZSk7XG4gIHJldHVybiBnLm5leHQgPSB2ZXJiKDApLCBnW1widGhyb3dcIl0gPSB2ZXJiKDEpLCBnW1wicmV0dXJuXCJdID0gdmVyYigyKSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICB9XG59XG5cbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICBvW2syXSA9IG1ba107XG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XG4gIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcbiAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcbiAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XG4gIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcbiAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xuICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcbiAgICAgIH1cbiAgfTtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcbiAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xuICBpZiAoIW0pIHJldHVybiBvO1xuICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcbiAgdHJ5IHtcbiAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xuICB9XG4gIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxuICBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XG4gICAgICB9XG4gICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cbiAgfVxuICByZXR1cm4gYXI7XG59XG5cbi8qKiBAZGVwcmVjYXRlZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xuICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcbiAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcbiAgcmV0dXJuIGFyO1xufVxuXG4vKiogQGRlcHJlY2F0ZWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcbiAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XG4gIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcbiAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxuICAgICAgICAgIHJba10gPSBhW2pdO1xuICByZXR1cm4gcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcbiAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgIH1cbiAgfVxuICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xuICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XG4gIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XG4gIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XG4gIHJldHVybiBpID0gT2JqZWN0LmNyZWF0ZSgodHlwZW9mIEFzeW5jSXRlcmF0b3IgPT09IFwiZnVuY3Rpb25cIiA/IEFzeW5jSXRlcmF0b3IgOiBPYmplY3QpLnByb3RvdHlwZSksIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiwgYXdhaXRSZXR1cm4pLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XG4gIGZ1bmN0aW9uIGF3YWl0UmV0dXJuKGYpIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUodikudGhlbihmLCByZWplY3QpOyB9OyB9XG4gIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpZiAoZ1tuXSkgeyBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyBpZiAoZikgaVtuXSA9IGYoaVtuXSk7IH0gfVxuICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XG4gIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxuICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XG4gIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cbiAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XG4gIHZhciBpLCBwO1xuICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xuICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBmYWxzZSB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XG4gIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XG4gIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XG4gIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcbiAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxuICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xuICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxuICByZXR1cm4gY29va2VkO1xufTtcblxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcbiAgb1tcImRlZmF1bHRcIl0gPSB2O1xufTtcblxudmFyIG93bktleXMgPSBmdW5jdGlvbihvKSB7XG4gIG93bktleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiAobykge1xuICAgIHZhciBhciA9IFtdO1xuICAgIGZvciAodmFyIGsgaW4gbykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBrKSkgYXJbYXIubGVuZ3RoXSA9IGs7XG4gICAgcmV0dXJuIGFyO1xuICB9O1xuICByZXR1cm4gb3duS2V5cyhvKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XG4gIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrID0gb3duS2V5cyhtb2QpLCBpID0gMDsgaSA8IGsubGVuZ3RoOyBpKyspIGlmIChrW2ldICE9PSBcImRlZmF1bHRcIikgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrW2ldKTtcbiAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcbiAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XG4gIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcbiAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XG4gIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcbiAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xuICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XG4gIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XG4gIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEluKHN0YXRlLCByZWNlaXZlcikge1xuICBpZiAocmVjZWl2ZXIgPT09IG51bGwgfHwgKHR5cGVvZiByZWNlaXZlciAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgcmVjZWl2ZXIgIT09IFwiZnVuY3Rpb25cIikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgdXNlICdpbicgb3BlcmF0b3Igb24gbm9uLW9iamVjdFwiKTtcbiAgcmV0dXJuIHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgPT09IHN0YXRlIDogc3RhdGUuaGFzKHJlY2VpdmVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9fYWRkRGlzcG9zYWJsZVJlc291cmNlKGVudiwgdmFsdWUsIGFzeW5jKSB7XG4gIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdm9pZCAwKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBleHBlY3RlZC5cIik7XG4gICAgdmFyIGRpc3Bvc2UsIGlubmVyO1xuICAgIGlmIChhc3luYykge1xuICAgICAgaWYgKCFTeW1ib2wuYXN5bmNEaXNwb3NlKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jRGlzcG9zZSBpcyBub3QgZGVmaW5lZC5cIik7XG4gICAgICBkaXNwb3NlID0gdmFsdWVbU3ltYm9sLmFzeW5jRGlzcG9zZV07XG4gICAgfVxuICAgIGlmIChkaXNwb3NlID09PSB2b2lkIDApIHtcbiAgICAgIGlmICghU3ltYm9sLmRpc3Bvc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuZGlzcG9zZSBpcyBub3QgZGVmaW5lZC5cIik7XG4gICAgICBkaXNwb3NlID0gdmFsdWVbU3ltYm9sLmRpc3Bvc2VdO1xuICAgICAgaWYgKGFzeW5jKSBpbm5lciA9IGRpc3Bvc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZGlzcG9zZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IG5vdCBkaXNwb3NhYmxlLlwiKTtcbiAgICBpZiAoaW5uZXIpIGRpc3Bvc2UgPSBmdW5jdGlvbigpIHsgdHJ5IHsgaW5uZXIuY2FsbCh0aGlzKTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7IH0gfTtcbiAgICBlbnYuc3RhY2sucHVzaCh7IHZhbHVlOiB2YWx1ZSwgZGlzcG9zZTogZGlzcG9zZSwgYXN5bmM6IGFzeW5jIH0pO1xuICB9XG4gIGVsc2UgaWYgKGFzeW5jKSB7XG4gICAgZW52LnN0YWNrLnB1c2goeyBhc3luYzogdHJ1ZSB9KTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbnZhciBfU3VwcHJlc3NlZEVycm9yID0gdHlwZW9mIFN1cHByZXNzZWRFcnJvciA9PT0gXCJmdW5jdGlvblwiID8gU3VwcHJlc3NlZEVycm9yIDogZnVuY3Rpb24gKGVycm9yLCBzdXBwcmVzc2VkLCBtZXNzYWdlKSB7XG4gIHZhciBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICByZXR1cm4gZS5uYW1lID0gXCJTdXBwcmVzc2VkRXJyb3JcIiwgZS5lcnJvciA9IGVycm9yLCBlLnN1cHByZXNzZWQgPSBzdXBwcmVzc2VkLCBlO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fZGlzcG9zZVJlc291cmNlcyhlbnYpIHtcbiAgZnVuY3Rpb24gZmFpbChlKSB7XG4gICAgZW52LmVycm9yID0gZW52Lmhhc0Vycm9yID8gbmV3IF9TdXBwcmVzc2VkRXJyb3IoZSwgZW52LmVycm9yLCBcIkFuIGVycm9yIHdhcyBzdXBwcmVzc2VkIGR1cmluZyBkaXNwb3NhbC5cIikgOiBlO1xuICAgIGVudi5oYXNFcnJvciA9IHRydWU7XG4gIH1cbiAgdmFyIHIsIHMgPSAwO1xuICBmdW5jdGlvbiBuZXh0KCkge1xuICAgIHdoaWxlIChyID0gZW52LnN0YWNrLnBvcCgpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIXIuYXN5bmMgJiYgcyA9PT0gMSkgcmV0dXJuIHMgPSAwLCBlbnYuc3RhY2sucHVzaChyKSwgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihuZXh0KTtcbiAgICAgICAgaWYgKHIuZGlzcG9zZSkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSByLmRpc3Bvc2UuY2FsbChyLnZhbHVlKTtcbiAgICAgICAgICBpZiAoci5hc3luYykgcmV0dXJuIHMgfD0gMiwgUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCkudGhlbihuZXh0LCBmdW5jdGlvbihlKSB7IGZhaWwoZSk7IHJldHVybiBuZXh0KCk7IH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgcyB8PSAxO1xuICAgICAgfVxuICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgZmFpbChlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHMgPT09IDEpIHJldHVybiBlbnYuaGFzRXJyb3IgPyBQcm9taXNlLnJlamVjdChlbnYuZXJyb3IpIDogUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgaWYgKGVudi5oYXNFcnJvcikgdGhyb3cgZW52LmVycm9yO1xuICB9XG4gIHJldHVybiBuZXh0KCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3Jld3JpdGVSZWxhdGl2ZUltcG9ydEV4dGVuc2lvbihwYXRoLCBwcmVzZXJ2ZUpzeCkge1xuICBpZiAodHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIgJiYgL15cXC5cXC4/XFwvLy50ZXN0KHBhdGgpKSB7XG4gICAgICByZXR1cm4gcGF0aC5yZXBsYWNlKC9cXC4odHN4KSR8KCg/OlxcLmQpPykoKD86XFwuW14uL10rPyk/KVxcLihbY21dPyl0cyQvaSwgZnVuY3Rpb24gKG0sIHRzeCwgZCwgZXh0LCBjbSkge1xuICAgICAgICAgIHJldHVybiB0c3ggPyBwcmVzZXJ2ZUpzeCA/IFwiLmpzeFwiIDogXCIuanNcIiA6IGQgJiYgKCFleHQgfHwgIWNtKSA/IG0gOiAoZCArIGV4dCArIFwiLlwiICsgY20udG9Mb3dlckNhc2UoKSArIFwianNcIik7XG4gICAgICB9KTtcbiAgfVxuICByZXR1cm4gcGF0aDtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBfX2V4dGVuZHMsXG4gIF9fYXNzaWduLFxuICBfX3Jlc3QsXG4gIF9fZGVjb3JhdGUsXG4gIF9fcGFyYW0sXG4gIF9fZXNEZWNvcmF0ZSxcbiAgX19ydW5Jbml0aWFsaXplcnMsXG4gIF9fcHJvcEtleSxcbiAgX19zZXRGdW5jdGlvbk5hbWUsXG4gIF9fbWV0YWRhdGEsXG4gIF9fYXdhaXRlcixcbiAgX19nZW5lcmF0b3IsXG4gIF9fY3JlYXRlQmluZGluZyxcbiAgX19leHBvcnRTdGFyLFxuICBfX3ZhbHVlcyxcbiAgX19yZWFkLFxuICBfX3NwcmVhZCxcbiAgX19zcHJlYWRBcnJheXMsXG4gIF9fc3ByZWFkQXJyYXksXG4gIF9fYXdhaXQsXG4gIF9fYXN5bmNHZW5lcmF0b3IsXG4gIF9fYXN5bmNEZWxlZ2F0b3IsXG4gIF9fYXN5bmNWYWx1ZXMsXG4gIF9fbWFrZVRlbXBsYXRlT2JqZWN0LFxuICBfX2ltcG9ydFN0YXIsXG4gIF9faW1wb3J0RGVmYXVsdCxcbiAgX19jbGFzc1ByaXZhdGVGaWVsZEdldCxcbiAgX19jbGFzc1ByaXZhdGVGaWVsZFNldCxcbiAgX19jbGFzc1ByaXZhdGVGaWVsZEluLFxuICBfX2FkZERpc3Bvc2FibGVSZXNvdXJjZSxcbiAgX19kaXNwb3NlUmVzb3VyY2VzLFxuICBfX3Jld3JpdGVSZWxhdGl2ZUltcG9ydEV4dGVuc2lvbixcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBFbnRyeS1wb2ludCBmb3IgU3ViUXVlcnkgbWFwcGluZyBoYW5kbGVycy5cbiAqXG4gKiBSZS1leHBvcnRzIGV2ZXJ5IGhhbmRsZXIgc28gdGhlIFN1YlF1ZXJ5IG5vZGUgY2FuIHJlc29sdmUgdGhlbSBmcm9tXG4gKiBhIHNpbmdsZSBgLi9kaXN0L2luZGV4LmpzYCBidW5kbGUgcGF0aC5cbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5oYW5kbGVBZ2VudFJld2FyZENsYWltZWQgPSBleHBvcnRzLmhhbmRsZUFnZW50UmV3YXJkQ3JlZGl0ZWQgPSBleHBvcnRzLmhhbmRsZVRhc2tSZXdhcmRTZXR0bGVkID0gZXhwb3J0cy5oYW5kbGVSZXZpZXdlclJvdW5kU2V0dGxlZCA9IGV4cG9ydHMuaGFuZGxlT2JzZXJ2ZXJSb3VuZFNldHRsZWQgPSBleHBvcnRzLmhhbmRsZUJhc2VTdGFraW5nRGF5U2V0dGxlZCA9IGV4cG9ydHMuaGFuZGxlQWdlbnRTdGFrZVJlbGVhc2VkID0gZXhwb3J0cy5oYW5kbGVBZ2VudFN0YWtlUmVsZWFzZUNsZWFyZWQgPSBleHBvcnRzLmhhbmRsZUFnZW50U3Rha2VSZWxlYXNlQmxvY2tlZCA9IGV4cG9ydHMuaGFuZGxlQWdlbnRTdGFrZVVuYm9uZENhbmNlbGxlZCA9IGV4cG9ydHMuaGFuZGxlQWdlbnRTdGFrZVVuYm9uZFJlcXVlc3RlZCA9IGV4cG9ydHMuaGFuZGxlQWdlbnRTdGFrZUJvbmRlZCA9IGV4cG9ydHMuaGFuZGxlRW1lcmdlbmN5Q2FuY2VsbGVkID0gZXhwb3J0cy5oYW5kbGVFbWVyZ2VuY3lSZXN1bWVkID0gZXhwb3J0cy5oYW5kbGVFbWVyZ2VuY3lQYXVzZWQgPSBleHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRFeHBpcmVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50Q2FuY2VsbGVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50UmVmdW5kZWQgPSBleHBvcnRzLmhhbmRsZVBheW1lbnRJbnRlbnRDbGFpbWVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50RnVuZGVkID0gZXhwb3J0cy5oYW5kbGVQYXltZW50SW50ZW50Q3JlYXRlZCA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlEaXNhYmxlZCA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlVbmZyb3plbiA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlGcm96ZW4gPSBleHBvcnRzLmhhbmRsZVRyYW5zcG9ydFJldm9rZWQgPSBleHBvcnRzLmhhbmRsZVRyYW5zcG9ydFZlcmlmaWVkID0gZXhwb3J0cy5oYW5kbGVUcmFuc3BvcnRCb3VuZCA9IGV4cG9ydHMuaGFuZGxlQWN0aXZlUmVsYXRpb25Qb2xpY3lTZXQgPSBleHBvcnRzLmhhbmRsZUFjdGl2ZUF1dGhSZWdpc3RyeVNldCA9IGV4cG9ydHMuaGFuZGxlQWN0aXZlQWdlbnRSZWdpc3RyeVNldCA9IGV4cG9ydHMuaGFuZGxlQWN0aXZlUHJvZmlsZVNldCA9IGV4cG9ydHMuaGFuZGxlSWRlbnRpdHlLZXlSZXZva2VkID0gZXhwb3J0cy5oYW5kbGVJZGVudGl0eUtleUFkZGVkID0gZXhwb3J0cy5oYW5kbGVSZWNvdmVyeUtleVNldCA9IGV4cG9ydHMuaGFuZGxlT3duZXJLZXlSb3RhdGVkID0gZXhwb3J0cy5oYW5kbGVJZGVudGl0eVJlZ2lzdGVyZWQgPSBleHBvcnRzLmhhbmRsZUJsb2NrID0gdm9pZCAwO1xudmFyIGJsb2NrXzEgPSByZXF1aXJlKFwiLi9tYXBwaW5ncy9ibG9ja1wiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUJsb2NrXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBibG9ja18xLmhhbmRsZUJsb2NrOyB9IH0pO1xudmFyIGlkZW50aXR5Q29yZV8xID0gcmVxdWlyZShcIi4vbWFwcGluZ3MvaWRlbnRpdHlDb3JlXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlSWRlbnRpdHlSZWdpc3RlcmVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBpZGVudGl0eUNvcmVfMS5oYW5kbGVJZGVudGl0eVJlZ2lzdGVyZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVPd25lcktleVJvdGF0ZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZU93bmVyS2V5Um90YXRlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVJlY292ZXJ5S2V5U2V0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBpZGVudGl0eUNvcmVfMS5oYW5kbGVSZWNvdmVyeUtleVNldDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUlkZW50aXR5S2V5QWRkZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZUlkZW50aXR5S2V5QWRkZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVJZGVudGl0eUtleVJldm9rZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZUlkZW50aXR5S2V5UmV2b2tlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUFjdGl2ZVByb2ZpbGVTZXRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZUFjdGl2ZVByb2ZpbGVTZXQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVBY3RpdmVBZ2VudFJlZ2lzdHJ5U2V0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBpZGVudGl0eUNvcmVfMS5oYW5kbGVBY3RpdmVBZ2VudFJlZ2lzdHJ5U2V0OyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlQWN0aXZlQXV0aFJlZ2lzdHJ5U2V0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBpZGVudGl0eUNvcmVfMS5oYW5kbGVBY3RpdmVBdXRoUmVnaXN0cnlTZXQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVBY3RpdmVSZWxhdGlvblBvbGljeVNldFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gaWRlbnRpdHlDb3JlXzEuaGFuZGxlQWN0aXZlUmVsYXRpb25Qb2xpY3lTZXQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVUcmFuc3BvcnRCb3VuZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gaWRlbnRpdHlDb3JlXzEuaGFuZGxlVHJhbnNwb3J0Qm91bmQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVUcmFuc3BvcnRWZXJpZmllZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gaWRlbnRpdHlDb3JlXzEuaGFuZGxlVHJhbnNwb3J0VmVyaWZpZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVUcmFuc3BvcnRSZXZva2VkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBpZGVudGl0eUNvcmVfMS5oYW5kbGVUcmFuc3BvcnRSZXZva2VkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlSWRlbnRpdHlGcm96ZW5cIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZUlkZW50aXR5RnJvemVuOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlSWRlbnRpdHlVbmZyb3plblwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gaWRlbnRpdHlDb3JlXzEuaGFuZGxlSWRlbnRpdHlVbmZyb3plbjsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUlkZW50aXR5RGlzYWJsZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGlkZW50aXR5Q29yZV8xLmhhbmRsZUlkZW50aXR5RGlzYWJsZWQ7IH0gfSk7XG52YXIgcGF5bWVudEludGVudF8xID0gcmVxdWlyZShcIi4vbWFwcGluZ3MvcGF5bWVudEludGVudFwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVBheW1lbnRJbnRlbnRDcmVhdGVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXltZW50SW50ZW50XzEuaGFuZGxlUGF5bWVudEludGVudENyZWF0ZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVQYXltZW50SW50ZW50RnVuZGVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXltZW50SW50ZW50XzEuaGFuZGxlUGF5bWVudEludGVudEZ1bmRlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVBheW1lbnRJbnRlbnRDbGFpbWVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXltZW50SW50ZW50XzEuaGFuZGxlUGF5bWVudEludGVudENsYWltZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVQYXltZW50SW50ZW50UmVmdW5kZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHBheW1lbnRJbnRlbnRfMS5oYW5kbGVQYXltZW50SW50ZW50UmVmdW5kZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVQYXltZW50SW50ZW50Q2FuY2VsbGVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXltZW50SW50ZW50XzEuaGFuZGxlUGF5bWVudEludGVudENhbmNlbGxlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZVBheW1lbnRJbnRlbnRFeHBpcmVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXltZW50SW50ZW50XzEuaGFuZGxlUGF5bWVudEludGVudEV4cGlyZWQ7IH0gfSk7XG52YXIgZW1lcmdlbmN5XzEgPSByZXF1aXJlKFwiLi9tYXBwaW5ncy9lbWVyZ2VuY3lcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVFbWVyZ2VuY3lQYXVzZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGVtZXJnZW5jeV8xLmhhbmRsZUVtZXJnZW5jeVBhdXNlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUVtZXJnZW5jeVJlc3VtZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGVtZXJnZW5jeV8xLmhhbmRsZUVtZXJnZW5jeVJlc3VtZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVFbWVyZ2VuY3lDYW5jZWxsZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGVtZXJnZW5jeV8xLmhhbmRsZUVtZXJnZW5jeUNhbmNlbGxlZDsgfSB9KTtcbnZhciBhZ2VudFN0YWtpbmdfMSA9IHJlcXVpcmUoXCIuL21hcHBpbmdzL2FnZW50U3Rha2luZ1wiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUFnZW50U3Rha2VCb25kZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFnZW50U3Rha2luZ18xLmhhbmRsZUFnZW50U3Rha2VCb25kZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVBZ2VudFN0YWtlVW5ib25kUmVxdWVzdGVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBhZ2VudFN0YWtpbmdfMS5oYW5kbGVBZ2VudFN0YWtlVW5ib25kUmVxdWVzdGVkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlQWdlbnRTdGFrZVVuYm9uZENhbmNlbGxlZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gYWdlbnRTdGFraW5nXzEuaGFuZGxlQWdlbnRTdGFrZVVuYm9uZENhbmNlbGxlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUFnZW50U3Rha2VSZWxlYXNlQmxvY2tlZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gYWdlbnRTdGFraW5nXzEuaGFuZGxlQWdlbnRTdGFrZVJlbGVhc2VCbG9ja2VkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlQWdlbnRTdGFrZVJlbGVhc2VDbGVhcmVkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBhZ2VudFN0YWtpbmdfMS5oYW5kbGVBZ2VudFN0YWtlUmVsZWFzZUNsZWFyZWQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYW5kbGVBZ2VudFN0YWtlUmVsZWFzZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFnZW50U3Rha2luZ18xLmhhbmRsZUFnZW50U3Rha2VSZWxlYXNlZDsgfSB9KTtcbnZhciBhZ2VudEluY2VudGl2ZXNfMSA9IHJlcXVpcmUoXCIuL21hcHBpbmdzL2FnZW50SW5jZW50aXZlc1wiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUJhc2VTdGFraW5nRGF5U2V0dGxlZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gYWdlbnRJbmNlbnRpdmVzXzEuaGFuZGxlQmFzZVN0YWtpbmdEYXlTZXR0bGVkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlT2JzZXJ2ZXJSb3VuZFNldHRsZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFnZW50SW5jZW50aXZlc18xLmhhbmRsZU9ic2VydmVyUm91bmRTZXR0bGVkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlUmV2aWV3ZXJSb3VuZFNldHRsZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFnZW50SW5jZW50aXZlc18xLmhhbmRsZVJldmlld2VyUm91bmRTZXR0bGVkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlVGFza1Jld2FyZFNldHRsZWRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFnZW50SW5jZW50aXZlc18xLmhhbmRsZVRhc2tSZXdhcmRTZXR0bGVkOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaGFuZGxlQWdlbnRSZXdhcmRDcmVkaXRlZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gYWdlbnRJbmNlbnRpdmVzXzEuaGFuZGxlQWdlbnRSZXdhcmRDcmVkaXRlZDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImhhbmRsZUFnZW50UmV3YXJkQ2xhaW1lZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gYWdlbnRJbmNlbnRpdmVzXzEuaGFuZGxlQWdlbnRSZXdhcmRDbGFpbWVkOyB9IH0pO1xucmVxdWlyZShcIkBwb2xrYWRvdC9hcGktYXVnbWVudFwiKTtcbiJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsImhhbmRsZUFnZW50UmV3YXJkQ2xhaW1lZCIsImhhbmRsZVRhc2tSZXdhcmRTZXR0bGVkIiwiaGFuZGxlUmV2aWV3ZXJSb3VuZFNldHRsZWQiLCJoYW5kbGVPYnNlcnZlclJvdW5kU2V0dGxlZCIsImhhbmRsZUJhc2VTdGFraW5nRGF5U2V0dGxlZCIsImhhbmRsZUFnZW50UmV3YXJkQ3JlZGl0ZWQiLCJBZ2VudFJld2FyZEV2ZW50XzEiLCJBZ2VudFJld2FyZExlZGdlcl8xIiwiUmV3YXJkRGF5U3RhdGVfMSIsIlJvdW5kUmV3YXJkU2V0dGxlbWVudF8xIiwiVGFza1Jld2FyZFNldHRsZW1lbnRfMSIsInV0aWxzXzEiLCJzdHIiLCJ2IiwidG9TdHJpbmciLCJudW0iLCJOdW1iZXIiLCJiaWciLCJCaWdJbnQiLCJibG9ja051bSIsImJsb2NrIiwiaGVhZGVyIiwibnVtYmVyIiwiZXh0cmluc2ljSW5kZXgiLCJldmVudCIsIl9hIiwiZXh0cmluc2ljIiwiaWR4IiwidW5kZWZpbmVkIiwiemVyb1NuYXBzaG90IiwiY2xhaW1hYmxlVG90YWwiLCJjbGFpbWVkVG90YWwiLCJjbGFpbWFibGVCYXNlIiwiY2xhaW1hYmxlT2JzZXJ2ZXIiLCJjbGFpbWFibGVSZXZpZXdlciIsImNsYWltYWJsZVRhc2siLCJjbGFpbWVkQmFzZSIsImNsYWltZWRPYnNlcnZlciIsImNsYWltZWRSZXZpZXdlciIsImNsYWltZWRUYXNrIiwiYXN5bmMiLCJmZXRjaFJld2FyZExlZGdlciIsImlkZW50aXR5SWQiLCJhZ2VudElkIiwianNvbiIsImFwaSIsInF1ZXJ5IiwiYWdlbnRJbmNlbnRpdmVzIiwiYWdlbnRSZXdhcmRMZWRnZXJzIiwidG9KU09OIiwicmF3IiwiX2IiLCJfYyIsIl9kIiwiX2UiLCJfZiIsIl9nIiwiX2giLCJfaiIsIl9rIiwiY2F1c2UiLCJjb25zb2xlIiwid2FybiIsIkVycm9yIiwibWVzc2FnZSIsIlN0cmluZyIsInNhdmVSZXdhcmRMZWRnZXJTbmFwc2hvdCIsInNuYXBzaG90IiwiaWQiLCJhZ2VudFJld2FyZExlZGdlckVudGl0eUlkIiwibGVkZ2VyIiwiQWdlbnRSZXdhcmRMZWRnZXIiLCJjcmVhdGUiLCJhc3NpZ24iLCJjaGFpbklkIiwiQ0hBSU5fSUQiLCJ1cGRhdGVkQXRCbG9jayIsInNhdmUiLCJ1cHNlcnRSZXdhcmREYXlTdGF0ZSIsImRheUluZGV4IiwiX2wiLCJfbSIsImRhaWx5RW1pc3Npb25TdGF0ZXMiLCJyb3ciLCJSZXdhcmREYXlTdGF0ZSIsInJld2FyZERheVN0YXRlRW50aXR5SWQiLCJiYXNlU3Rha2luZ0J1ZGdldCIsIm9ic2VydmVyUmV2aWV3ZXJCdWRnZXQiLCJ0YXNrTWFya2V0QnVkZ2V0IiwiYmFzZVN0YWtpbmdSZWxlYXNlZCIsIm9ic2VydmVyUmV2aWV3ZXJSZWxlYXNlZCIsInRhc2tNYXJrZXRSZWxlYXNlZCIsInJvbGxvdmVyQmFzZVN0YWtpbmciLCJyb2xsb3Zlck9ic2VydmVyUmV2aWV3ZXIiLCJyb2xsb3ZlclRhc2tNYXJrZXQiLCJiYXNlU3Rha2luZ1NldHRsZWQiLCJCb29sZWFuIiwib2JzZXJ2ZXJSb3VuZHNTZXR0bGVkIiwicmV2aWV3ZXJSb3VuZHNTZXR0bGVkIiwidGFza1Jld2FyZHNTZXR0bGVkIiwiYXBwZW5kUmV3YXJkRXZlbnQiLCJpbnB1dCIsImJuIiwiZXZlbnRJbmRleCIsIkFnZW50UmV3YXJkRXZlbnQiLCJhZ2VudFJld2FyZEV2ZW50RW50aXR5SWQiLCJldmVudFR5cGUiLCJyZXdhcmRLaW5kIiwiYW1vdW50IiwiYmFzZUFtb3VudCIsIm9ic2VydmVyQW1vdW50IiwicmV2aWV3ZXJBbW91bnQiLCJ0YXNrQW1vdW50Iiwicm91bmRJZCIsInRhc2tJZCIsIm93bmVyQWNjb3VudCIsImJsb2NrTnVtYmVyIiwiYmxvY2tIYXNoIiwiaGFzaCIsInRvSGV4IiwidGltZXN0YW1wIiwiaGFuZGxlUm91bmRTZXR0bGVkIiwicm9sZSIsImRhdGEiLCJwYXJ0aWNpcGFudENvdW50IiwidG90YWxFZmZlY3RpdmVTdGFrZSIsInJlbGVhc2VkIiwicm9sbG92ZXIiLCJzZXR0bGVtZW50IiwiUm91bmRSZXdhcmRTZXR0bGVtZW50Iiwicm91bmRSZXdhcmRTZXR0bGVtZW50RW50aXR5SWQiLCJraW5kIiwiY2FsbCIsImxvd2VyIiwidG9Mb3dlckNhc2UiLCJrZXkiLCJrZXlzIiwibm9ybWFsaXplUmV3YXJkS2luZCIsInByZXZpb3VzIiwiZXhpc3RpbmciLCJnZXQiLCJyZWFkSW5kZXhlZFJld2FyZExlZGdlciIsIm5leHQiLCJjcmVkaXRTbmFwc2hvdCIsImRpZmZpY3VsdHlKc29uIiwiZGlmZmljdWx0eSIsIkpTT04iLCJzdHJpbmdpZnkiLCJUYXNrUmV3YXJkU2V0dGxlbWVudCIsInRhc2tSZXdhcmRTZXR0bGVtZW50RW50aXR5SWQiLCJoYW5kbGVBZ2VudFN0YWtlUmVsZWFzZWQiLCJoYW5kbGVBZ2VudFN0YWtlUmVsZWFzZUNsZWFyZWQiLCJoYW5kbGVBZ2VudFN0YWtlUmVsZWFzZUJsb2NrZWQiLCJoYW5kbGVBZ2VudFN0YWtlVW5ib25kQ2FuY2VsbGVkIiwiaGFuZGxlQWdlbnRTdGFrZVVuYm9uZFJlcXVlc3RlZCIsImhhbmRsZUFnZW50U3Rha2VCb25kZWQiLCJBZ2VudFN0YWtlRXZlbnRfMSIsIkFnZW50U3Rha2VMZWRnZXJfMSIsImFwcGVuZFN0YWtlRXZlbnQiLCJBZ2VudFN0YWtlRXZlbnQiLCJhZ2VudFN0YWtlRXZlbnRFbnRpdHlJZCIsImZ1bmRpbmdBY2NvdW50IiwiYWN0aXZlQW1vdW50IiwidW5sb2NrQXRCbG9jayIsInJlYXNvblJlZiIsInVwc2VydExlZGdlciIsImFnZW50U3Rha2VMZWRnZXJFbnRpdHlJZCIsIkFnZW50U3Rha2VMZWRnZXIiLCJ6ZXJvIiwiYWN0aXZlRGVsdGEiLCJ1bmJvbmRpbmdBbW91bnQiLCJ1bmJvbmRpbmdEZWx0YSIsInJlbGVhc2VCbG9ja2VkIiwic3RhdHVzIiwicmVsZWFzZUJsb2NrUmVhc29uIiwicmVmVG9TdHJpbmciLCJoYW5kbGVCbG9jayIsIkNoYWluQ2hlY2twb2ludF8xIiwiY2hlY2twb2ludCIsIkNoYWluQ2hlY2twb2ludCIsInVwZGF0ZWRBdCIsIkRhdGUiLCJoYW5kbGVFbWVyZ2VuY3lDYW5jZWxsZWQiLCJoYW5kbGVFbWVyZ2VuY3lSZXN1bWVkIiwiaGFuZGxlRW1lcmdlbmN5UGF1c2VkIiwiRW1lcmdlbmN5U3RhdHVzXzEiLCJvcHRIZXgiLCJ1cHNlcnRFbWVyZ2VuY3lTdGF0dXMiLCJzY29wZSIsInNjb3BlUmF3IiwiZW50cmllcyIsImxlbmd0aCIsIm5hbWUiLCJ2YWwiLCJzZXJpYWxpemVTY29wZSIsInVwZGF0ZWRCeSIsInJlYXNvbkhhc2giLCJlbWVyZ2VuY3lTdGF0dXNFbnRpdHlJZCIsImVzIiwiRW1lcmdlbmN5U3RhdHVzIiwiaGFuZGxlSWRlbnRpdHlEaXNhYmxlZCIsImhhbmRsZUlkZW50aXR5VW5mcm96ZW4iLCJoYW5kbGVJZGVudGl0eUZyb3plbiIsImhhbmRsZVRyYW5zcG9ydFJldm9rZWQiLCJoYW5kbGVUcmFuc3BvcnRWZXJpZmllZCIsImhhbmRsZVRyYW5zcG9ydEJvdW5kIiwiaGFuZGxlQWN0aXZlUmVsYXRpb25Qb2xpY3lTZXQiLCJoYW5kbGVBY3RpdmVBdXRoUmVnaXN0cnlTZXQiLCJoYW5kbGVBY3RpdmVBZ2VudFJlZ2lzdHJ5U2V0IiwiaGFuZGxlQWN0aXZlUHJvZmlsZVNldCIsImhhbmRsZUlkZW50aXR5S2V5UmV2b2tlZCIsImhhbmRsZUlkZW50aXR5S2V5QWRkZWQiLCJoYW5kbGVSZWNvdmVyeUtleVNldCIsImhhbmRsZU93bmVyS2V5Um90YXRlZCIsImhhbmRsZUlkZW50aXR5UmVnaXN0ZXJlZCIsIkNoYWluSWRlbnRpdHlfMSIsIklkZW50aXR5S2V5XzEiLCJnZXRJZGVudGl0eSIsIkNoYWluSWRlbnRpdHkiLCJpZGVudGl0eUVudGl0eUlkIiwic2VyaWFsaXplQ29udGVudFJlZiIsIm9iaiIsImZldGNoSWRlbnRpdHlQb2ludGVycyIsImlkZW50aXR5Q29yZSIsImlkZW50aXRpZXMiLCJhY3RpdmVQcm9maWxlIiwiYWN0aXZlQWdlbnRSZWdpc3RyeSIsImFjdGl2ZUF1dGhSZWdpc3RyeSIsImFjdGl2ZVJlbGF0aW9uUG9saWN5IiwiXyIsInRvdWNoSWRlbnRpdHkiLCJpZGVudGl0eSIsIm93bmVyIiwiY3JlYXRlZEF0QmxvY2siLCJuZXdPd25lciIsImtleUlkIiwicHVycG9zZVJhdyIsInB1cnBvc2VKc29uIiwicHVycG9zZSIsIklkZW50aXR5S2V5IiwiaWRlbnRpdHlLZXlFbnRpdHlJZCIsImFjY291bnQiLCJyZWNvcmRKc29uIiwiYXV0aG9yaXplZEtleXMiLCJwdHJzIiwiaGFuZGxlUGF5bWVudEludGVudEV4cGlyZWQiLCJoYW5kbGVQYXltZW50SW50ZW50Q2FuY2VsbGVkIiwiaGFuZGxlUGF5bWVudEludGVudFJlZnVuZGVkIiwiaGFuZGxlUGF5bWVudEludGVudENsYWltZWQiLCJoYW5kbGVQYXltZW50SW50ZW50RnVuZGVkIiwiaGFuZGxlUGF5bWVudEludGVudENyZWF0ZWQiLCJQYXltZW50SW50ZW50XzEiLCJTZXR0bGVtZW50RXZlbnRfMSIsImdldEludGVudCIsImludGVudElkIiwiUGF5bWVudEludGVudCIsInBheW1lbnRJbnRlbnRFbnRpdHlJZCIsImFwcGVuZFNldHRsZW1lbnRFdmVudCIsInNldHRsZW1lbnRFdmVudEVudGl0eUlkIiwic2UiLCJTZXR0bGVtZW50RXZlbnQiLCJwYXllcklkZW50aXR5SWQiLCJwYXllZUlkZW50aXR5SWQiLCJhY3Rpb25SYXciLCJhY3Rpb25OYW1lc3BhY2UiLCJhY3Rpb25JZCIsIm5zIiwiQXJyYXkiLCJpc0FycmF5IiwiQnVmZmVyIiwiZnJvbSIsInN0YXJ0c1dpdGgiLCJzbGljZSIsImludGVudCIsInNldHRsZW1lbnRNb2RlIiwic2V0dGxlbWVudE1vZGVKc29uIiwicHJvY2VzcyIsImVudiIsImFzc2VydF8xIiwiX19pbXBvcnREZWZhdWx0IiwiY29uc3RydWN0b3IiLCJ0aGlzIiwiX25hbWUiLCJkZWZhdWx0Iiwic3RvcmUiLCJzZXQiLCJyZW1vdmUiLCJyZWNvcmQiLCJnZXRCeUZpZWxkcyIsImZpbHRlciIsIm9wdGlvbnMiLCJtYXAiLCJlbnRpdHkiLCJtb2R1bGUiLCJyZXF1aXJlIiwicGFja2FnZUluZm8iLCJwYXRoIiwiVVJMIiwicGF0aG5hbWUiLCJzdWJzdHJpbmciLCJsYXN0SW5kZXhPZiIsInR5cGUiLCJ2ZXJzaW9uIiwieGdsb2JhbCIsImdsb2JhbFRoaXMiLCJnbG9iYWwiLCJzZWxmIiwid2luZG93IiwiRnVuY3Rpb24iLCJmb3JtYXRJbmZvIiwiZm9ybWF0VmVyc2lvbiIsImV4dHJhY3RlZCIsIm5tSW5kZXgiLCJpbmRleE9mIiwicGFkU3RhcnQiLCJnZXRQYXRoIiwiaW5mb1BhdGgiLCJwYXRoT3JGbiIsInByZSIsImFsbCIsImZtdCIsIm1heCIsImkiLCJjb3VudCIsIk1hdGgiLCJkIiwicGFkRW5kIiwiam9pbiIsImZvcm1hdERpc3BsYXkiLCJkZXBzIiwiZW50cnkiLCJfZ2xvYmFsIiwiX19wb2xrYWRvdGpzIiwiZ2V0RW50cnkiLCJwdXNoIiwiZW50cmllc1NhbWVWZXJzaW9uIiwiZXZlcnkiLCJlIiwiZXNtQ2pzV2FybmluZ0Rpc2FibGVkIiwibWlzbWF0Y2hlcyIsImRldGVjdFBhY2thZ2UiLCJleHRlbmRTdGF0aWNzIiwiYiIsInNldFByb3RvdHlwZU9mIiwiX19wcm90b19fIiwicCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiX19leHRlbmRzIiwiVHlwZUVycm9yIiwiX18iLCJfX2Fzc2lnbiIsInQiLCJzIiwibiIsImFyZ3VtZW50cyIsImFwcGx5IiwiX19yZXN0IiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImRlc2MiLCJjIiwiciIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsIlJlZmxlY3QiLCJkZWNvcmF0ZSIsIl9fcGFyYW0iLCJwYXJhbUluZGV4IiwiZGVjb3JhdG9yIiwiX19lc0RlY29yYXRlIiwiY3RvciIsImRlc2NyaXB0b3JJbiIsImNvbnRleHRJbiIsImluaXRpYWxpemVycyIsImV4dHJhSW5pdGlhbGl6ZXJzIiwiYWNjZXB0IiwiZiIsImRlc2NyaXB0b3IiLCJkb25lIiwiY29udGV4dCIsImFjY2VzcyIsImFkZEluaXRpYWxpemVyIiwicmVzdWx0IiwiaW5pdCIsInVuc2hpZnQiLCJfX3J1bkluaXRpYWxpemVycyIsInRoaXNBcmciLCJ1c2VWYWx1ZSIsIl9fcHJvcEtleSIsIngiLCJjb25jYXQiLCJfX3NldEZ1bmN0aW9uTmFtZSIsInByZWZpeCIsImRlc2NyaXB0aW9uIiwiY29uZmlndXJhYmxlIiwiX19tZXRhZGF0YSIsIm1ldGFkYXRhS2V5IiwibWV0YWRhdGFWYWx1ZSIsIm1ldGFkYXRhIiwiX19hd2FpdGVyIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInN0ZXAiLCJyZWplY3RlZCIsInRoZW4iLCJfX2dlbmVyYXRvciIsImJvZHkiLCJ5IiwibGFiZWwiLCJzZW50IiwidHJ5cyIsIm9wcyIsImciLCJJdGVyYXRvciIsInZlcmIiLCJTeW1ib2wiLCJpdGVyYXRvciIsIm9wIiwicG9wIiwiX19jcmVhdGVCaW5kaW5nIiwibyIsIm0iLCJrIiwiazIiLCJfX2VzTW9kdWxlIiwid3JpdGFibGUiLCJlbnVtZXJhYmxlIiwiX19leHBvcnRTdGFyIiwiX192YWx1ZXMiLCJfX3JlYWQiLCJhciIsImVycm9yIiwiX19zcHJlYWQiLCJfX3NwcmVhZEFycmF5cyIsImlsIiwiYSIsImoiLCJqbCIsIl9fc3ByZWFkQXJyYXkiLCJ0byIsInBhY2siLCJsIiwiX19hd2FpdCIsIl9fYXN5bmNHZW5lcmF0b3IiLCJhc3luY0l0ZXJhdG9yIiwicSIsIkFzeW5jSXRlcmF0b3IiLCJyZXN1bWUiLCJmdWxmaWxsIiwic2V0dGxlIiwic2hpZnQiLCJfX2FzeW5jRGVsZWdhdG9yIiwiX19hc3luY1ZhbHVlcyIsIl9fbWFrZVRlbXBsYXRlT2JqZWN0IiwiY29va2VkIiwiX19zZXRNb2R1bGVEZWZhdWx0Iiwib3duS2V5cyIsImdldE93blByb3BlcnR5TmFtZXMiLCJfX2ltcG9ydFN0YXIiLCJtb2QiLCJfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0IiwicmVjZWl2ZXIiLCJzdGF0ZSIsImhhcyIsIl9fY2xhc3NQcml2YXRlRmllbGRTZXQiLCJfX2NsYXNzUHJpdmF0ZUZpZWxkSW4iLCJfX2FkZERpc3Bvc2FibGVSZXNvdXJjZSIsImRpc3Bvc2UiLCJpbm5lciIsImFzeW5jRGlzcG9zZSIsInN0YWNrIiwiX1N1cHByZXNzZWRFcnJvciIsIlN1cHByZXNzZWRFcnJvciIsInN1cHByZXNzZWQiLCJfX2Rpc3Bvc2VSZXNvdXJjZXMiLCJmYWlsIiwiaGFzRXJyb3IiLCJfX3Jld3JpdGVSZWxhdGl2ZUltcG9ydEV4dGVuc2lvbiIsInByZXNlcnZlSnN4IiwidGVzdCIsInJlcGxhY2UiLCJ0c3giLCJleHQiLCJjbSIsIl9fd2VicGFja19tb2R1bGVfY2FjaGVfXyIsIl9fd2VicGFja19yZXF1aXJlX18iLCJtb2R1bGVJZCIsImNhY2hlZE1vZHVsZSIsIl9fd2VicGFja19tb2R1bGVzX18iLCJkZWZpbml0aW9uIiwicHJvcCIsInRvU3RyaW5nVGFnIiwiYmxvY2tfMSIsImlkZW50aXR5Q29yZV8xIiwicGF5bWVudEludGVudF8xIiwiZW1lcmdlbmN5XzEiLCJhZ2VudFN0YWtpbmdfMSIsImFnZW50SW5jZW50aXZlc18xIl0sInNvdXJjZVJvb3QiOiIifQ==