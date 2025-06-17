import React from 'react';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

interface ReceiptReviewStepProps {
  onRestart: () => void;
}

const ReceiptReviewStep: React.FC<ReceiptReviewStepProps> = ({ onRestart }) => {
  return (
    <div className="space-y-5">
      
      <Alert type="success" title="Preliminary Steps Completed - Action Required">
        <p className="text-xs sm:text-sm">
          Thank you for completing this guided process.
        </p>
        <p className="mt-1.5 text-xs sm:text-sm">
          Please now <strong className="text-white">send all prepared assets</strong> (screenshots, links, video) 
          to our support team via official channels.
        </p>
      </Alert>

      <div className="space-y-3">
        <h3 className="text-md font-medium text-slate-100">What Happens Next:</h3>
        <Alert type="info" title="Review Process & Timeline" className="bg-slate-700/40">
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-sky-200">
            <li>Once support receives your assets, they will begin review.</li>
            <li>This typically takes <strong className="font-medium text-sky-100">3 - 5 business days</strong> (longer during high volume or if extra checks needed).</li>
            <li>
              To ensure fairness and security, the authenticity of submitted documents, particularly email-based proofs (e.g., from wager history requests), will be <strong className="text-sky-100">carefully verified</strong>.
            </li>
            <li>
              <strong className="text-amber-300">Important:</strong> Please <strong className="text-amber-100">do not resend or modify submissions</strong> during review unless requested.
            </li>
          </ul>
        </Alert>
        
        <Alert type="info" title="Outcome Communication" className="bg-slate-700/40">
          <p className="text-xs sm:text-sm text-sky-200">
              Support will contact you with the outcome:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-sky-200 mt-1 pl-3">
              <li><strong className="text-sky-100">Approved:</strong> Notification of VIP upgrade and, if applicable, 7-day drip bonus details.</li>
              <li><strong className="text-sky-100">Rejected:</strong> Reason for rejection and any next steps, if available.</li>
          </ul>
        </Alert>
      </div>

      <p className="text-xs text-slate-400 text-center pt-2">
        You may now close this assistant. Thank you for choosing JungleBet!
      </p>

      <div className="flex justify-center mt-6 pt-4 border-t border-slate-700">
        <Button onClick={onRestart} variant="secondary" size="md">
          Start a New Application
        </Button>
      </div>
    </div>
  );
};

export default ReceiptReviewStep;