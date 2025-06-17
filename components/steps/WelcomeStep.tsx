
import React, { useState } from 'react';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import Input from '../ui/Input'; 
import { UserAnswers } from '../../types'; 
import { ACCEPTED_PLATFORMS, MIN_WAGER_TOTAL, MIN_RECENT_WAGER } from '../../constants';
import Card from '../ui/Card'; 
import Alert from '../ui/Alert';

interface WelcomeStepProps {
  answers: Pick<UserAnswers, 'hasConfirmedInitialRules' | 'jungleBetUsername' | 'jungleBetEmail'>;
  updateUserAnswer: <K extends keyof UserAnswers>(key: K, value: UserAnswers[K]) => void;
  onProceed: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ answers, updateUserAnswer, onProceed }) => {
  const [errors, setErrors] = useState<Partial<Record<'jungleBetUsername' | 'jungleBetEmail' | 'hasConfirmedInitialRules', string>>>({});

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateAndProceed = () => {
    const newErrors: Partial<Record<'jungleBetUsername' | 'jungleBetEmail' | 'hasConfirmedInitialRules', string>> = {};
    if (!answers.jungleBetUsername.trim()) {
      newErrors.jungleBetUsername = "Please enter your JungleBet username.";
    }
    if (!answers.jungleBetEmail.trim()) {
      newErrors.jungleBetEmail = "Please enter your JungleBet email address.";
    } else if (!validateEmail(answers.jungleBetEmail)) {
      newErrors.jungleBetEmail = "Please enter a valid email address.";
    }
    if (!answers.hasConfirmedInitialRules) {
      newErrors.hasConfirmedInitialRules = "You must confirm you have read the rules.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onProceed();
    }
  };


  return (
    <div className="space-y-5">
      <p className="text-slate-300 text-sm">
        Welcome to the JungleBet VIP Transfer Assistant! Please provide your JungleBet details and review the eligibility rules below.
      </p>

       <Input
        id="jungleBetUsername"
        label="Your JungleBet Username"
        type="text"
        placeholder="e.g., JungleKing123"
        value={answers.jungleBetUsername}
        onChange={(e) => {
            updateUserAnswer('jungleBetUsername', e.target.value);
            setErrors(prev => ({...prev, jungleBetUsername: undefined}));
        }}
        error={errors.jungleBetUsername}
        required
        containerClassName="mb-3"
      />

      <Input
        id="jungleBetEmail"
        label="Your JungleBet Email Address"
        type="email"
        placeholder="e.g., user@example.com"
        value={answers.jungleBetEmail}
        onChange={(e) => {
            updateUserAnswer('jungleBetEmail', e.target.value);
            setErrors(prev => ({...prev, jungleBetEmail: undefined}));
        }}
        error={errors.jungleBetEmail}
        required
        containerClassName="mb-3"
      />


      <Card title="Eligibility Rules" className="bg-slate-700/50">
        <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 space-y-2">
          <li>
            Transfers accepted from: <strong className="text-slate-100">{ACCEPTED_PLATFORMS.join(", ")}</strong>.
          </li>
          <li>
            Lifetime wager of at least <strong className="text-slate-100">${MIN_WAGER_TOTAL.toLocaleString()}</strong> (on the transferring platform).
          </li>
          <li>
            For the drip bonus: At least <strong className="text-slate-100">${MIN_RECENT_WAGER.toLocaleString()}</strong> in the last 7 days.
          </li>
        </ul>
      </Card>
      
      <div className="pt-1">
        <Checkbox
          id="confirmReadRules"
          label={<span className="font-medium text-slate-200 text-sm">I confirm I have read and understood the rules.</span>}
          checked={answers.hasConfirmedInitialRules}
          onChange={(e) => {
            updateUserAnswer('hasConfirmedInitialRules', e.target.checked);
            setErrors(prev => ({...prev, hasConfirmedInitialRules: undefined}));
          }}
        />
        {errors.hasConfirmedInitialRules && <p className="mt-1 text-xs text-red-400">{errors.hasConfirmedInitialRules}</p>}
      </div>

      <div className="flex justify-end mt-6 pt-4 border-t border-slate-700">
        <Button 
            onClick={validateAndProceed} 
            disabled={!answers.hasConfirmedInitialRules || !answers.jungleBetUsername.trim() || !answers.jungleBetEmail.trim()} 
            size="md"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
