
export interface UserAnswers {
  // Step 1: Welcome
  hasConfirmedInitialRules: boolean;

  // Step 2: User Identification (New)
  jungleBetUsername: string;
  jungleBetEmail: string;

  // Step 3: Eligibility Questions
  platform: string; // Will use Platform enum values or "Other"
  transferPlatformUsername: string; // Username on the platform they are transferring from
  rank: string;
  totalWagered: number | '';
  hasWagered1kLast7Days: boolean | null;
  isSelfExcludedOrBanned: boolean | null;
  
  // New: Stake.com Verification fields
  stakeVerificationStatus?: 'pending' | 'verifying_connection' | 'verifying_chat' | 'fetching_profile' | 'success' | 'profile_hidden' | 'timeout_error' | 'generic_error' | null;
  verifiedStakeRank?: string;
  verifiedStakeTotalWager?: number;

  // Step 4: Appointment Check
  isAvailableNowForApplication: boolean | null;

  // Step 5: Part 1 Proof of Status
  hasPreparedPart1Proof: boolean;
  part1Screenshot: File | null;
  wagerVideo: File | null;

  // Step 6: Integrity Reminder
  hasConfirmedIntegrity: boolean;

  // Step 7 & 8: Action Proofs & Asset Submission (for 7-day bonus)
  limboBetLink?: string;
  limboBetScreenshot?: File | null;
  wagerHistoryEmail?: File | null;
}

export enum Platform {
  STAKE = "Stake.com",
  BCGAME = "BC.Game",
  SHUFFLE = "Shuffle",
  OTHER = "Other", // Represents a non-supported platform selection
}

export const PLATFORM_OPTIONS: Platform[] = [
  Platform.STAKE,
  Platform.BCGAME,
  Platform.SHUFFLE,
  Platform.OTHER,
];

export enum AppStatus {
  IN_PROGRESS,
  USER_UNAVAILABLE,
  AWAITING_REVIEW, // Final state after successful completion
  DISQUALIFIED_SELF_EXCLUDED,
  DISQUALIFIED_PLATFORM,
  DISQUALIFIED_WAGER_LOW,
  // Add other specific disqualification reasons if needed
}
