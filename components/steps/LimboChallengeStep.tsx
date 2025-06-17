import * as React from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { UserAnswers } from '../../types';

interface LimboChallengeStepProps {
  onProceed: () => void;
  updateUserAnswer: (key: keyof UserAnswers, value: any) => void;
  answers: Pick<UserAnswers, 'limboBetLink'>;
}

const LimboChallengeStep: React.FC<LimboChallengeStepProps> = ({ onProceed, updateUserAnswer, answers }) => {
  const [betLink, setBetLink] = React.useState(answers.limboBetLink || '');
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const linkIsValid = betLink.startsWith('https://stake.com/casino/games/limbo?iid=house%3A');
    setIsReady(linkIsValid);
  }, [betLink]);

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLink = event.target.value;
    setBetLink(newLink);
    updateUserAnswer('limboBetLink', newLink);
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-emerald-400">Part 1: The Limbo Bet Challenge</h3>
          <p className="mt-2 text-sm text-slate-300">
            To begin, you must complete a specific challenge on Stake.com. This demonstrates your understanding of the platform's features.
          </p>
        </div>

        <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
          <ul className="space-y-3 text-sm list-decimal list-inside text-slate-300">
            <li>Place a single <span className="font-bold text-white">Limbo</span> wager with a payout multiplier of exactly <span className="font-bold text-white">722x</span>.</li>
            <li>The bet amount can be anything you are comfortable with.</li>
            <li>After the bet is complete, open its details page.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="betLink" className="block text-sm font-medium text-slate-200 mb-1">
              1. Direct Bet Link
            </label>
            <Input
              id="betLink"
              label="Direct Bet Link"
              type="url"
              placeholder="e.g., https://stake.com/casino/games/limbo?iid=house:..."
              value={betLink}
              onChange={handleLinkChange}
              className="w-full"
            />
            <p className="mt-1 text-xs text-slate-400">Paste the full URL to your completed Limbo bet.</p>
          </div>
        </div>
        
        {isReady && (
            <Alert type="success" title="Ready to Proceed">
                You've provided the bet link. You can now move to the next step.
            </Alert>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={onProceed} disabled={!isReady} size="lg">
            Continue
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default LimboChallengeStep;
