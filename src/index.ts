/**
 * Entry-point for SubQuery mapping handlers.
 *
 * Re-exports every handler so the SubQuery node can resolve them from
 * a single `./dist/index.js` bundle path.
 */

export { handleBlock } from "./mappings/block.js";

export {
  handleReferendumSubmitted,
  handleReferendumDecisionStarted,
  handleReferendumConfirmStarted,
  handleReferendumConfirmAborted,
  handleReferendumApproved,
  handleReferendumRejected,
  handleReferendumCancelled,
  handleReferendumTimedOut,
  handleReferendumKilled,
} from "./mappings/referenda.js";

export {
  handleVoteCast,
  handleVoteRemoved,
  handleDelegated,
  handleUndelegated,
} from "./mappings/convictionVoting.js";

export {
  handlePreimageNoted,
  handlePreimageRequested,
  handlePreimageCleared,
} from "./mappings/preimage.js";

export {
  handleTreasuryProposed,
  handleTreasuryApproved,
  handleTreasuryRejected,
  handleTreasuryAwarded,
} from "./mappings/treasury.js";
