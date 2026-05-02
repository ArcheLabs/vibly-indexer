/**
 * Entry-point for SubQuery mapping handlers.
 *
 * Re-exports every handler so the SubQuery node can resolve them from
 * a single `./dist/index.js` bundle path.
 */

export { handleBlock } from "./mappings/block";

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
} from "./mappings/referenda";

export {
  handleVoteCast,
  handleVoteRemoved,
  handleDelegated,
  handleUndelegated,
} from "./mappings/convictionVoting";

export {
  handlePreimageNoted,
  handlePreimageRequested,
  handlePreimageCleared,
} from "./mappings/preimage";

export {
  handleTreasuryProposed,
  handleTreasuryApproved,
  handleTreasuryRejected,
  handleTreasuryAwarded,
} from "./mappings/treasury";

import "@polkadot/api-augment";
