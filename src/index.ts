/**
 * Entry-point for SubQuery mapping handlers.
 *
 * Re-exports every handler so the SubQuery node can resolve them from
 * a single `./dist/index.js` bundle path.
 */

export { handleBlock } from "./mappings/block";

export {
  handleIdentityRegistered,
  handleOwnerKeyRotated,
  handleRecoveryKeySet,
  handleIdentityKeyAdded,
  handleIdentityKeyRevoked,
  handleActiveProfileSet,
  handleActiveAgentRegistrySet,
  handleActiveAuthRegistrySet,
  handleActiveRelationPolicySet,
  handleTransportBound,
  handleTransportVerified,
  handleTransportRevoked,
  handleEvmRootBound,
  handleEvmAddressLinked,
  handleEvmAddressUnlinked,
  handleIdentityFrozen,
  handleIdentityUnfrozen,
  handleIdentityDisabled,
} from "./mappings/identityCore";

export {
  handlePaymentIntentCreated,
  handlePaymentIntentFunded,
  handlePaymentIntentClaimed,
  handlePaymentIntentRefunded,
  handlePaymentIntentCancelled,
  handlePaymentIntentExpired,
} from "./mappings/paymentIntent";

export {
  handleEmergencyPaused,
  handleEmergencyResumed,
  handleEmergencyCancelled,
} from "./mappings/emergency";

export {
  handleAgentStakeBonded,
  handleAgentStakeUnbondRequested,
  handleAgentStakeUnbondCancelled,
  handleAgentStakeReleaseBlocked,
  handleAgentStakeReleaseCleared,
  handleAgentStakeReleased,
} from "./mappings/agentStaking";

export {
  handleBaseStakingDaySettled,
  handleObserverRoundSettled,
  handleReviewerRoundSettled,
  handleTaskRewardSettled,
  handleAgentRewardCredited,
  handleAgentRewardClaimed,
} from "./mappings/agentIncentives";

import "@polkadot/api-augment";
