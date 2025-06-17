
import React, { useState, useEffect } from 'react';
import { UserAnswers } from '../../types';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { SpinnerIcon, STAKE_PROOF_PHRASE } from '../../constants';

interface StakeVerificationStepProps {
  answers: UserAnswers;
  updateUserAnswer: <K extends keyof UserAnswers>(key: K, value: UserAnswers[K]) => void;
  onVerificationComplete: (verifiedRank?: string, verifiedWager?: number) => void;
  onProceedWithoutSuccess: () => void; // This might become redundant if only success path is handled for progression
}

const StakeVerificationStep: React.FC<StakeVerificationStepProps> = ({ 
    answers, 
    updateUserAnswer, 
    onVerificationComplete,
    onProceedWithoutSuccess // Retained for now, but its usage will simplify
}) => {
  const [currentDisplayMessage, setCurrentDisplayMessage] = useState<string | null>(null);
  const STAKE_PREFERENCES_LINK = "https://stake.com/settings/preferences";

  useEffect(() => {
    // If the status isn't already 'success' (e.g. from a previous interaction in the same session), set to 'pending'.
    if (answers.stakeVerificationStatus !== 'success') {
         updateUserAnswer('stakeVerificationStatus', 'pending');
    }
  }, []); 

  const handleConfirmAttestation = async () => {
    updateUserAnswer('stakeVerificationStatus', 'verifying_chat'); 
    setCurrentDisplayMessage(`Processing your confirmation...`);

    await new Promise(resolve => setTimeout(resolve, 1500)); 
      
    const attestedRank = answers.rank || "N/A (Self-Reported)"; 
    const attestedWager = typeof answers.totalWagered === 'number' ? answers.totalWagered : 0; 
    
    updateUserAnswer('verifiedStakeRank', attestedRank);
    updateUserAnswer('verifiedStakeTotalWager', attestedWager);
    updateUserAnswer('stakeVerificationStatus', 'success');
    setCurrentDisplayMessage(null); 
  };

  const renderStatusDetails = () => {
    if (currentDisplayMessage && (answers.stakeVerificationStatus === 'verifying_chat')) {
      return (
        <div className="flex items-center justify-center p-3 my-3 bg-slate-700/50 rounded-md text-slate-300 text-sm">
          <SpinnerIcon className="w-5 h-5 mr-2" />
          {currentDisplayMessage}
        </div>
      );
    }

    switch (answers.stakeVerificationStatus) {
      case 'success':
        return (
          <Alert type="success" title="Stake.com Attestation Confirmed">
            <p className="text-xs sm:text-sm">
              Your confirmation for posting "{STAKE_PROOF_PHRASE}" has been received. 
              The following self-reported details will be considered "attested" for eligibility:
            </p>
            <ul className="list-disc list-inside pl-4 mt-1 text-xs sm:text-sm">
              <li>Attested Rank: <strong className="text-emerald-100">{answers.verifiedStakeRank || 'N/A'}</strong></li>
              <li>Attested Total Wager: <strong className="text-emerald-100">${(answers.verifiedStakeTotalWager || 0).toLocaleString()}</strong></li>
            </ul>
          </Alert>
        );
      // Removed 'profile_hidden', 'timeout_error', 'generic_error' cases
      default:
        return null;
    }
  };
  
  const isProcessingAttestation = answers.stakeVerificationStatus === 'verifying_chat';

  return (
    <div className="space-y-5">
      <Alert type="info" title="Stake.com Account Attestation">
        <p className="text-xs sm:text-sm mb-2">
          To attest to your Stake.com account ownership and status, please complete the following "Jungle time" proof:
        </p>
        <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm pl-3">
          <li>
            Turn <strong className="text-sky-100">Ghost Mode OFF</strong>. 
            (Stake settings <a href={STAKE_PREFERENCES_LINK} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline">here</a> - opens new tab). 
            This is temporary (~2 minutes).
          </li>
          <li>
            In Stake.com's public chat (e.g., #sports or #challenges), send the <strong className="text-sky-100">exact phrase</strong>:
            <div className="my-1.5 p-2 bg-slate-900/50 rounded text-center">
              <code className="text-emerald-300 font-mono text-sm">{STAKE_PROOF_PHRASE}</code>
            </div>
          </li>
          <li>Press Enter to send the message. You can re-enable Ghost Mode right after.</li>
        </ol>
         <p className="text-xs sm:text-sm mt-2">
          After posting the phrase, click the button below to confirm you have completed this step.
        </p>
      </Alert>

      {renderStatusDetails()}

      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
        {answers.stakeVerificationStatus === 'pending' && !isProcessingAttestation && (
          <Button 
            onClick={handleConfirmAttestation} 
            size="md"
          >
            Confirm: I've Posted '{STAKE_PROOF_PHRASE}'
          </Button>
        )}

        {isProcessingAttestation && (
            <Button size="md" isLoading={true} disabled={true}>
                Processing Confirmation...
            </Button>
        )}
        
        { answers.stakeVerificationStatus === 'success' && !isProcessingAttestation && (
           <Button 
             onClick={() => {
                onVerificationComplete(answers.verifiedStakeRank, answers.verifiedStakeTotalWager);
             }}
             size="md"
             variant={'primary'}
           >
            Continue
           </Button>
        )}
      </div>
    </div>
  );
};

export default StakeVerificationStep;
