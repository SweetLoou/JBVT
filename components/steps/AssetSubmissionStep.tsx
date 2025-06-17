import * as React from 'react';
import { UserAnswers } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Alert from '../ui/Alert';

interface AssetSubmissionStepProps {
  answers: UserAnswers;
  updateUserAnswer: (key: keyof UserAnswers, value: any) => void;
  onProceed: () => void;
}

const AssetSubmissionStep: React.FC<AssetSubmissionStepProps> = ({ answers, updateUserAnswer, onProceed }) => {
  const { part1Screenshot, wagerVideo, limboBetScreenshot, wagerHistoryEmail } = answers;

  const isComplete = part1Screenshot && wagerVideo && limboBetScreenshot && wagerHistoryEmail;

  const handleFileChange = (key: keyof UserAnswers) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateUserAnswer(key, file);
  };

  const renderFileInput = (id: keyof UserAnswers, label: string, file: File | null, accept: string) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-200 mb-1">{label}</label>
      <div className="relative">
        <Input
          id={id}
          label={label}
          type="file"
          accept={accept}
          onChange={handleFileChange(id)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex items-center justify-center w-full px-4 py-2 bg-slate-700 border-2 border-dashed border-slate-500 rounded-md">
          <span className="text-sm text-slate-400">{file ? file.name : `Click to upload ${label}`}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Alert type="info" title="Final Asset Submission">
        <p className="text-sm">
          Please upload all the required documents below. Your application will be submitted for review once all files are provided.
        </p>
      </Alert>

      <Card title="Required Documents" className="bg-slate-700/50">
        <div className="space-y-4">
          {renderFileInput('part1Screenshot', 'Part 1 Screenshot', part1Screenshot, 'image/*')}
          {renderFileInput('wagerVideo', '7-Day Wager Video', wagerVideo, 'video/*')}
          {renderFileInput('limboBetScreenshot', 'Limbo Bet Screenshot', limboBetScreenshot ?? null, 'image/*')}
          {renderFileInput('wagerHistoryEmail', 'Wager History Email', wagerHistoryEmail ?? null, '.eml,.msg')}
        </div>
      </Card>

      <div className="flex justify-end pt-4 border-t border-slate-700">
        <Button 
          onClick={onProceed} 
          disabled={!isComplete} 
          size="lg"
        >
          Submit Application
        </Button>
      </div>
    </div>
  );
};

export default AssetSubmissionStep;
