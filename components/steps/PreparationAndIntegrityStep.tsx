
import React, { useState } from 'react';
import { UserAnswers } from '../../types';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import RadioGroup from '../ui/RadioGroup';
import Alert from '../ui/Alert';

interface PreparationAndIntegrityStepProps {
  answers: Pick<UserAnswers, 'isAvailableNowForApplication' | 'hasPreparedPart1Proof' | 'hasConfirmedIntegrity'>;
  updateUserAnswer: <K extends keyof UserAnswers>(key: K, value: UserAnswers[K]) => void;
  onProceed: () => void;
  onUserUnavailable: () => void;
  showBonusPath: boolean;
}

const PreparationAndIntegrityStep: React.FC<PreparationAndIntegrityStepProps> = ({
  answers,
  updateUserAnswer,
  onProceed,
  onUserUnavailable,
  showBonusPath,
}) => {
  const [errors, setErrors] = useState<Partial<Record<'availability' | 'proofs' | 'integrity', string>>>({});

  const handleContinue = () => {
    if (answers.isAvailableNowForApplication === false) {
      onUserUnavailable(); // This will set AppStatus.USER_UNAVAILABLE
      return;
    }

    const newErrors: Partial<Record<'availability' | 'proofs' | 'integrity', string>> = {};
    if (answers.isAvailableNowForApplication === null) {
      newErrors.availability = "Please select your availability.";
    }
    if (answers.isAvailableNowForApplication === true) {
      if (!answers.hasPreparedPart1Proof) {
        newErrors.proofs = "Please confirm you have prepared the Part 1 proofs.";
      }
      if (!answers.hasConfirmedIntegrity) {
        newErrors.integrity = "Please confirm you agree to the integrity guidelines.";
      }
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && answers.isAvailableNowForApplication === true) {
      onProceed();
    }
  };

  return (
    <div className="space-y-6">
      {/* Availability Check Section */}
      <section>
        <Alert type="info" title="Time Commitment">
          <p className="text-xs sm:text-sm">
            The next part of the application involves preparing information and actions.
            This may take <strong className="font-medium text-sky-200">30 minutes to 2 hours</strong>.
          </p>
        </Alert>
        <RadioGroup
          legend="Are you available now to continue?"
          name="isAvailableNowForApplication"
          options={[
            { value: true, label: "Yes, I'm available." },
            { value: false, label: "No, I'll come back later." },
          ]}
          selectedValue={answers.isAvailableNowForApplication}
          onChange={(val) => {
            updateUserAnswer('isAvailableNowForApplication', val as boolean);
            setErrors(prev => ({ ...prev, availability: undefined }));
            if (val === false) { // If user selects "No", clear other confirmations
              updateUserAnswer('hasPreparedPart1Proof', false);
              updateUserAnswer('hasConfirmedIntegrity', false);
            }
          }}
          error={errors.availability}
        />
        {answers.isAvailableNowForApplication === false && (
          <Alert type="warning" title="Application Paused" className="mt-3">
            <p className="text-xs sm:text-sm">No problem! Please return when you have time. Progress is not saved, so you'll start over.</p>
          </Alert>
        )}
      </section>

      {/* Proof of Status & Integrity Reminder Sections (conditional on availability) */}
      {answers.isAvailableNowForApplication === true && (
        <>
          <hr className="border-slate-700" />
          <section className="space-y-5">
            <Alert type="info" title="Part 1: Prepare This Information">
              <p className="mb-2.5 text-xs sm:text-sm">
                Gather the items below. Later, you'll provide these to support.
                <strong className="block mt-0.5 text-sky-200">All info/screenshots MUST be in English.</strong>
              </p>
              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <h4 className="font-medium text-sky-100">1. Profile Screenshot:</h4>
                  <ul className="list-disc list-inside pl-4 mt-0.5 text-sky-300/90 space-y-0.5">
                    <li>Must show: <strong className="text-white">Username, VIP rank, VIP progress, total wagered</strong>.</li>
                    <li>Ensure you are logged in for real-time data.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sky-100">2. Profile Link:</h4>
                  <ul className="list-disc list-inside pl-4 mt-0.5 text-sky-300/90 space-y-0.5">
                    <li>Direct, accessible profile link.</li>
                    <li>"Ghost Mode" / "Private Mode" must be <strong className="text-white">DISABLED</strong>.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sky-100">3. Telegram Handle:</h4>
                  <ul className="list-disc list-inside pl-4 mt-0.5 text-sky-300/90">
                    <li>Your active Telegram username (e.g., <code className="text-white bg-sky-900/60 px-1 rounded text-xs">@yourhandle</code>).</li>
                  </ul>
                </div>
              </div>
            </Alert>
            <Checkbox
              id="confirmPreparedPart1"
              label={<span className="font-medium text-slate-200 text-sm">I have prepared all items for Part 1 as listed.</span>}
              checked={answers.hasPreparedPart1Proof}
              onChange={(e) => {
                updateUserAnswer('hasPreparedPart1Proof', e.target.checked);
                setErrors(prev => ({ ...prev, proofs: undefined }));
              }}
            />
            {errors.proofs && <p className="mt-1 text-xs text-red-400">{errors.proofs}</p>}
          </section>

          <hr className="border-slate-700" />
          <section className="space-y-5">
            <Alert type="warning" title="Crucial Integrity Guidelines">
              <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm">
                <li><strong className="font-medium text-amber-100">One Account Policy:</strong> Transfers are <strong className="text-white">one per person/household</strong>.</li>
                <li><strong className="font-medium text-amber-100">No Edited Media:</strong> Screenshots/videos must be <strong className="text-white">original and unaltered</strong>.</li>
                <li><strong className="font-medium text-amber-100">Truthful Information:</strong> False info leads to <strong className="text-white">rejection</strong>.</li>
              </ul>
            </Alert>
            <Checkbox
              id="confirmIntegrity"
              label={<span className="font-medium text-slate-200 text-sm">I confirm I agree to these integrity guidelines.</span>}
              checked={answers.hasConfirmedIntegrity}
              onChange={(e) => {
                updateUserAnswer('hasConfirmedIntegrity', e.target.checked);
                setErrors(prev => ({ ...prev, integrity: undefined }));
              }}
            />
            {errors.integrity && <p className="mt-1 text-xs text-red-400">{errors.integrity}</p>}
          </section>
        </>
      )}

      <div className="flex justify-end mt-6 pt-4 border-t border-slate-700">
        <Button
          onClick={handleContinue}
          disabled={answers.isAvailableNowForApplication === null || 
                     (answers.isAvailableNowForApplication === true && (!answers.hasPreparedPart1Proof || !answers.hasConfirmedIntegrity))
                   }
          size="md"
        >
          {answers.isAvailableNowForApplication === false ? "Acknowledge" :
           answers.isAvailableNowForApplication === true && showBonusPath ? "Next: Bonus Actions" :
           "Next"}
        </Button>
      </div>
    </div>
  );
};

export default PreparationAndIntegrityStep;
