import React, { useState, useEffect, useMemo } from 'react';
import { UserAnswers, Platform, PLATFORM_OPTIONS } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import RadioGroup from '../ui/RadioGroup';
import Select from '../ui/Select';
import Alert from '../ui/Alert';
import { MIN_RECENT_WAGER, ACCEPTED_PLATFORMS, MIN_WAGER_TOTAL, PLATFORM_SPECIFIC_RANKS } from '../../constants';


interface EligibilityFormStepProps {
  answers: UserAnswers;
  updateAnswer: <K extends keyof UserAnswers>(key: K, value: UserAnswers[K]) => void;
  onSubmit: () => void;
}

const EligibilityFormStep: React.FC<EligibilityFormStepProps> = ({ answers, updateAnswer, onSubmit }) => {
  const [errors, setErrors] = useState<Partial<Record<keyof UserAnswers, string>>>({});
  const isFormDisabled = answers.platform === Platform.OTHER;

  useEffect(() => {
    if (!answers.platform || answers.platform === Platform.OTHER) {
      updateAnswer('transferPlatformUsername', '');
      updateAnswer('rank', '');
      updateAnswer('totalWagered', '');
      updateAnswer('hasWagered1kLast7Days', null);
      updateAnswer('isSelfExcludedOrBanned', null);
    }
     // Clear rank if platform changes
    if (answers.platform) {
        updateAnswer('rank', '');
    }
  }, [answers.platform, updateAnswer]);

  const currentPlatformRankOptions = useMemo(() => {
    if (answers.platform && answers.platform !== Platform.OTHER && PLATFORM_SPECIFIC_RANKS[answers.platform as Exclude<Platform, Platform.OTHER>]) {
      return PLATFORM_SPECIFIC_RANKS[answers.platform as Exclude<Platform, Platform.OTHER>] || [];
    }
    return [];
  }, [answers.platform]);


  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserAnswers, string>> = {};
    if (!answers.platform) {
        newErrors.platform = "Please select your platform.";
    }

    if (answers.platform && answers.platform !== Platform.OTHER) {
        if (!answers.transferPlatformUsername.trim()){
            newErrors.transferPlatformUsername = "Please enter your username on the transferring platform."
        }
        if (!answers.rank.trim()) { // Check if rank is selected
            newErrors.rank = "Please select your VIP rank.";
        }
        if (answers.totalWagered === '' || answers.totalWagered === null || Number(answers.totalWagered) < 0) {
            newErrors.totalWagered = "Please enter your total lifetime wager.";
        } else if (Number(answers.totalWagered) < MIN_WAGER_TOTAL) {
            // This message is informational, so it's handled by an Alert below, not a blocking error here.
            // However, if strict blocking is needed, uncomment this:
            // newErrors.totalWagered = `A minimum of $${MIN_WAGER_TOTAL.toLocaleString()} total lifetime wager is generally required.`;
        }
        if (answers.hasWagered1kLast7Days === null) {
            newErrors.hasWagered1kLast7Days = "Please select for recent wagering.";
        }
        if (answers.isSelfExcludedOrBanned === null) {
            newErrors.isSelfExcludedOrBanned = "Please confirm self-exclusion status.";
        }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  const platformSelectOptions = PLATFORM_OPTIONS.map(p => ({value: p, label: p}));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      <Select
        id="platform"
        label="Platform you're transferring from?"
        options={platformSelectOptions}
        value={answers.platform}
        onChange={(e) => {
            const newPlatform = e.target.value as Platform;
            updateAnswer('platform', newPlatform);
            // Clear errors for fields that depend on the platform
            setErrors(prev => ({
                ...prev, 
                platform: undefined, 
                transferPlatformUsername: undefined,
                rank: undefined,
                totalWagered: undefined,
                hasWagered1kLast7Days: undefined,
                isSelfExcludedOrBanned: undefined,
            })); 
        }}
        error={errors.platform}
        required
        defaultValueText="Select platform..."
      />
       {answers.platform === Platform.OTHER && (
        <Alert type="warning" title="Platform Not Directly Supported">
            <p className="text-xs">This assistant handles transfers from {ACCEPTED_PLATFORMS.join(', ')}. For "Other", please contact support directly.</p>
        </Alert>
      )}

      <Input
        id="transferPlatformUsername"
        label={`Your Username on ${answers.platform && answers.platform !== Platform.OTHER ? answers.platform : 'selected platform'}`}
        type="text"
        placeholder="e.g., Player123"
        value={answers.transferPlatformUsername}
        onChange={(e) => updateAnswer('transferPlatformUsername', e.target.value)}
        error={errors.transferPlatformUsername}
        required
        disabled={!answers.platform || isFormDisabled}
        aria-disabled={!answers.platform || isFormDisabled}
      />
      
      <Select
        id="rank"
        label={`Your VIP rank on ${answers.platform && answers.platform !== Platform.OTHER ? answers.platform : 'selected platform'}`}
        options={currentPlatformRankOptions}
        value={answers.rank}
        onChange={(e) => updateAnswer('rank', e.target.value)}
        error={errors.rank}
        required
        disabled={!answers.platform || isFormDisabled || currentPlatformRankOptions.length === 0}
        aria-disabled={!answers.platform || isFormDisabled || currentPlatformRankOptions.length === 0}
        defaultValueText={!answers.platform || isFormDisabled ? "Select platform first..." : "Select your rank..."}
      />
      
      <Input
        id="totalWagered"
        label={`Approx. total lifetime wagered on ${answers.platform && answers.platform !== Platform.OTHER ? answers.platform : 'selected platform'} (USD)`}
        type="number"
        placeholder={`${MIN_WAGER_TOTAL.toLocaleString()}`}
        value={answers.totalWagered}
        onChange={(e) => updateAnswer('totalWagered', e.target.value === '' ? '' : Number(e.target.value))}
        min="0"
        error={errors.totalWagered}
        required
        disabled={!answers.platform || isFormDisabled}
        aria-disabled={!answers.platform || isFormDisabled}
      />
      
      <RadioGroup
        legend={`Wagered $${MIN_RECENT_WAGER.toLocaleString()}+ in last 7 days (for 7-day bonus)?`}
        name="hasWagered1kLast7Days"
        options={[ 
            { value: true, label: "Yes" }, 
            { value: false, label: "No" }
        ]}
        selectedValue={answers.hasWagered1kLast7Days}
        onChange={(val) => updateAnswer('hasWagered1kLast7Days', val as boolean)}
        error={errors.hasWagered1kLast7Days}
        disabled={!answers.platform || isFormDisabled}
      />
      
      <RadioGroup
        legend="Any recent self-exclusions or temporary bans on that account?"
        name="isSelfExcludedOrBanned"
        options={[ 
            { value: true, label: "Yes" }, 
            { value: false, label: "No" }
        ]}
        selectedValue={answers.isSelfExcludedOrBanned}
        onChange={(val) => updateAnswer('isSelfExcludedOrBanned', val as boolean)}
        error={errors.isSelfExcludedOrBanned}
        disabled={!answers.platform || isFormDisabled}
      />
      
      {answers.platform && !isFormDisabled && (answers.isSelfExcludedOrBanned === true) && (
        <Alert type="warning" title="Potential Eligibility Issue">
           <p className="text-xs">An active self-exclusion or ban usually prevents VIP transfers. Please ensure this is accurate.</p>
        </Alert>
      )}
       {answers.platform && !isFormDisabled && typeof answers.totalWagered === 'number' && answers.totalWagered > 0 && answers.totalWagered < MIN_WAGER_TOTAL && (
        <Alert type="info" title="Note on Total Wager">
           <p className="text-xs">Your entered wager is below the typical $${MIN_WAGER_TOTAL.toLocaleString()} minimum for Gold-equivalent status. If your VIP rank is high and you believe you qualify (e.g., recently achieved rank, high recent activity), please proceed. Support will review your specific case.</p>
        </Alert>
      )}


      <div className="flex justify-end mt-6 pt-4 border-t border-slate-700">
        <Button 
            type="submit" 
            size="md" 
            disabled={
                !answers.platform || 
                (answers.platform !== Platform.OTHER && (
                    answers.hasWagered1kLast7Days === null || 
                    answers.isSelfExcludedOrBanned === null || 
                    !answers.transferPlatformUsername || 
                    !answers.rank || // Rank must be selected
                    answers.totalWagered === ''
                ))
            }
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default EligibilityFormStep;