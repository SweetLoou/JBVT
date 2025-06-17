import * as React from 'react';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Card from '../ui/Card';
import { Platform } from '../../types';

interface ActionProofsStepProps {
  platform: Platform | string;
  onContinue: () => void;
}

const ActionProofsStep: React.FC<ActionProofsStepProps> = ({ platform, onContinue }) => {
  const renderWagerHistoryInstructions = () => {
    const instructions: { [key in Platform]?: string[] } = {
      [Platform.STAKE]: [
        'Go to "Stats" on Stake.com.',
        'Request your 7-day wager history via email.',
        'From your email client (e.g., Gmail, Outlook), find the email from Stake.',
        'Use the "Download", "Save As", or "Show Original" option to save the email as a file (usually a .eml file).',
      ],
      // Add other platforms if needed
    };

    const platformInstructions = instructions[platform as Platform] || [
      `Instructions for ${platform} will be provided by support.`,
    ];

    return (
      <ol className="list-decimal list-inside space-y-2 mt-2 text-sm text-slate-300 pl-3">
        {platformInstructions.map((step: string, index: number) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    );
  };

  return (
    <div className="space-y-6">
      <Alert type="info" title="Required for 7-Day Drip Bonus">
        <p className="text-sm">
          To verify your eligibility for the bonus, you need to provide your 7-day wager history.
        </p>
      </Alert>

      <Card title="7-Day Wager History Verification" className="bg-slate-700/50">
        <p className="text-sm text-slate-300">
          Instead of a screen recording, we now require the original email file for verification. This is a more secure and reliable method.
        </p>
        {renderWagerHistoryInstructions()}
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={onContinue} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ActionProofsStep;
