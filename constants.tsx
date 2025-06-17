
import React from 'react';
import { Platform } from './types'; // Import Platform enum

export const ACCEPTED_PLATFORMS: string[] = ["Stake.com", "BC.Game", "Shuffle"];
export const MIN_WAGER_TOTAL: number = 100000;
export const MIN_RECENT_WAGER: number = 1000;
// This is now a general statement, as specific rank selection is handled by dropdowns.
export const REQUIRED_RANK_INDICATOR: string = "A qualifying VIP rank based on the platform's structure.";

export const LIMBO_CHALLENGE_MULTIPLIER: string = "722x";
export const STAKE_PROOF_PHRASE: string = "Jungle time";

export const STAKE_RANKS = [
  { value: "Gold", label: "Gold ($100,000+ wagered)" },
  { value: "Platinum I", label: "Platinum I ($250,000+ wagered)" },
  { value: "Platinum II", label: "Platinum II ($500,000+ wagered)" },
  { value: "Platinum III", label: "Platinum III ($1,000,000+ wagered)" },
  { value: "Platinum IV", label: "Platinum IV ($2,500,000+ wagered)" },
  { value: "Platinum V", label: "Platinum V ($5,000,000+ wagered)" },
  { value: "Platinum VI", label: "Platinum VI ($10,000,000+ wagered)" },
  { value: "Diamond", label: "Diamond ($25,000,000+ wagered)" },
  { value: "Other Stake Rank", label: "Other Stake Rank (Specify to support)"}
];

export const BCGAME_RANKS = [
  // Simplified based on cards, assuming users know their VIP level within it
  { value: "VIP 1-3 (Bronze Card)", label: "VIP 1-3 (Bronze Card)"},
  { value: "VIP 4-7 (Silver Card)", label: "VIP 4-7 (Silver Card)"},
  { value: "VIP 8-21 (Gold Card)", label: "VIP 8-21 (Gold Card)"},
  { value: "VIP 22-37 (Golden Card)", label: "VIP 22-37 (Golden Card)" },
  { value: "VIP 38-53 (Platinum Card)", label: "VIP 38-53 (Platinum Card)" },
  { value: "VIP 54-69 (Platinum Card II)", label: "VIP 54-69 (Platinum Card II)" },
  { value: "SVIP 1-15 (Diamond Card)", label: "SVIP 1-15 (Diamond Card)" },
  { value: "SVIP 16-30 (Diamond Card II)", label: "SVIP 16-30 (Diamond Card II)" },
  { value: "SVIP 31+ (Diamond Card III)", label: "SVIP 31+ (Diamond Card III)" },
  { value: "Other BC.Game Rank", label: "Other BC.Game Rank (Specify to support)"}
];

export const SHUFFLE_RANKS = [
  // Using main tiers, user will know their specific sub-level
  { value: "Jade", label: "Jade (Levels 1-5)" },
  { value: "Sapphire", label: "Sapphire (Levels 1-5)" },
  { value: "Ruby", label: "Ruby (Levels 1-5)" },
  { value: "Diamond", label: "Diamond (Levels 1-5)" },
  { value: "Other Shuffle Rank", label: "Other Shuffle Rank (Specify to support)"}
];

export const PLATFORM_SPECIFIC_RANKS: Partial<Record<Platform, Array<{ value: string; label: string }>>> = {
  [Platform.STAKE]: STAKE_RANKS,
  [Platform.BCGAME]: BCGAME_RANKS,
  [Platform.SHUFFLE]: SHUFFLE_RANKS,
};


// SVG Icons - Enhanced for Dark Theme

export const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-emerald-400" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const CrossIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-red-400" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-sky-400" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

export const WarningIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-amber-400" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

export const AppTitleIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10 text-emerald-500" }) => ( // Slightly brighter emerald
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75A4.5 4.5 0 0112 15c0 1.284.473 2.45 1.27 3.337M12 21V10.5M12 3L3.75 7.5M20.25 7.5L12 3m0 0V.75" />
</svg>
);

export const SpinnerIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 animate-spin text-emerald-500" }) => ( // Larger spinner
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={className}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);