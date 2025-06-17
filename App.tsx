
import * as React from 'react';
import { UserAnswers, Platform, AppStatus } from './types';
import { MIN_WAGER_TOTAL } from './constants';

import WelcomeStep from './components/steps/WelcomeStep';
import EligibilityFormStep from './components/steps/EligibilityFormStep';
import StakeVerificationStep from './components/steps/StakeVerificationStep'; 
import PreparationAndIntegrityStep from './components/steps/PreparationAndIntegrityStep'; // New
import LimboChallengeStep from './components/steps/LimboChallengeStep';
import ActionProofsStep from './components/steps/ActionProofsStep';
import AssetSubmissionStep from './components/steps/AssetSubmissionStep';
import ReceiptReviewStep from './components/steps/ReceiptReviewStep';
import StepIndicator from './components/StepIndicator';
import Alert from './components/ui/Alert';
import Button from './components/ui/Button';

const App: React.FC = () => {
  const initialUserAnswers: UserAnswers = {
    hasConfirmedInitialRules: false,
    jungleBetUsername: '',
    jungleBetEmail: '',
    platform: '',
    transferPlatformUsername: '',
    rank: '',
    totalWagered: '',
    hasWagered1kLast7Days: null,
    isSelfExcludedOrBanned: null,
    stakeVerificationStatus: null,
    verifiedStakeRank: undefined,
    verifiedStakeTotalWager: undefined,
    isAvailableNowForApplication: null,
    hasPreparedPart1Proof: false,
    part1Screenshot: null,
    wagerVideo: null,
    hasConfirmedIntegrity: false,
    limboBetLink: '',
    limboBetScreenshot: null,
    wagerHistoryEmail: null,
  };
  const [userAnswers, setUserAnswers] = React.useState<UserAnswers>(initialUserAnswers);
  const [currentLogicalStep, setCurrentLogicalStep] = React.useState(1);
  const [appStatus, setAppStatus] = React.useState<AppStatus>(AppStatus.IN_PROGRESS);

  const updateUserAnswer = React.useCallback(<K extends keyof UserAnswers>(key: K, value: UserAnswers[K]) => {
    setUserAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const isEligibleFor7DayBonus = React.useMemo(() => userAnswers.hasWagered1kLast7Days === true, [userAnswers.hasWagered1kLast7Days]);

  const stepSequence = React.useMemo(() => {
    const baseSequence = ['welcome', 'eligibilityForm'];
    if (userAnswers.platform === Platform.STAKE) {
      baseSequence.push('stakeVerification');
    }
    baseSequence.push('preparationAndIntegrity'); // Merged step
    
    const conditionalBonusSequence = [];
    if (isEligibleFor7DayBonus) {
      conditionalBonusSequence.push('limboChallenge', 'actionProofs', 'assetSubmission');
    }
    
    return [...baseSequence, ...conditionalBonusSequence, 'receiptReview'];
  }, [userAnswers.platform, isEligibleFor7DayBonus]);

  const totalSteps = React.useMemo(() => stepSequence.length, [stepSequence]);

  const handleNext = React.useCallback(() => {
    setAppStatus(AppStatus.IN_PROGRESS); 

    const currentStepName = stepSequence[currentLogicalStep - 1];

    if (currentStepName === 'eligibilityForm') {
      if (userAnswers.isSelfExcludedOrBanned === true) {
        setAppStatus(AppStatus.DISQUALIFIED_SELF_EXCLUDED);
        return;
      }
      if (userAnswers.platform === Platform.OTHER) {
        setAppStatus(AppStatus.DISQUALIFIED_PLATFORM);
        return;
      }
      if (userAnswers.platform !== Platform.STAKE || (userAnswers.platform === Platform.STAKE && userAnswers.stakeVerificationStatus !== 'success')) {
        if (typeof userAnswers.totalWagered === 'number' && userAnswers.totalWagered < MIN_WAGER_TOTAL) {
          setAppStatus(AppStatus.DISQUALIFIED_WAGER_LOW);
          return;
        }
      }
    }
    
    if (currentStepName === 'stakeVerification' && userAnswers.stakeVerificationStatus === 'success') {
        const wagerToCheck = userAnswers.verifiedStakeTotalWager ?? userAnswers.totalWagered;
        if (typeof wagerToCheck === 'number' && wagerToCheck < MIN_WAGER_TOTAL) {
             setAppStatus(AppStatus.DISQUALIFIED_WAGER_LOW);
             return;
        }
    }

    // This check is now integrated within PreparationAndIntegrityStep logic before it calls handleNext,
    // but AppStatus.USER_UNAVAILABLE will be set via its own "Acknowledge" button.
    // If PreparationAndIntegrityStep calls handleNext, it means user IS available.
    if (currentStepName === 'preparationAndIntegrity' && userAnswers.isAvailableNowForApplication === false) {
       setAppStatus(AppStatus.USER_UNAVAILABLE);
       return;
    }
    
    if (currentLogicalStep < totalSteps) {
      setCurrentLogicalStep((prev) => prev + 1);
    }
  }, [currentLogicalStep, totalSteps, userAnswers, stepSequence]);

  const handleBack = React.useCallback(() => {
    if (appStatus !== AppStatus.IN_PROGRESS) {
        setAppStatus(AppStatus.IN_PROGRESS);
        return;
    }
    if (currentLogicalStep > 1) {
      setCurrentLogicalStep((prev) => prev - 1);
    }
  }, [appStatus, currentLogicalStep]);
  
  const handleRestart = () => {
    setUserAnswers(initialUserAnswers);
    setCurrentLogicalStep(1);
    setAppStatus(AppStatus.IN_PROGRESS);
  };

  const renderCurrentStepInfo = (): { component: React.JSX.Element; displayStepNumber: number; stepTitle: string } => {
    const currentStepName = stepSequence[currentLogicalStep - 1];
    let stepComponent: React.JSX.Element;
    let stepTitle = "";

    switch (currentStepName) {
      case 'welcome':
        stepTitle = "Welcome & Your Details";
        stepComponent = <WelcomeStep
            answers={userAnswers}
            updateUserAnswer={updateUserAnswer}
            onProceed={() => { 
                if (userAnswers.hasConfirmedInitialRules && userAnswers.jungleBetUsername && userAnswers.jungleBetEmail) {
                    handleNext();
                }
            }}
          />;
        break;
      case 'eligibilityForm':
        stepTitle = "Eligibility Confirmation";
        stepComponent = <EligibilityFormStep answers={userAnswers} updateAnswer={updateUserAnswer} onSubmit={handleNext} />;
        break;
      case 'stakeVerification': 
        stepTitle = "Stake.com Account Verification";
        stepComponent = <StakeVerificationStep
            answers={userAnswers}
            updateUserAnswer={updateUserAnswer}
            onVerificationComplete={(verifiedRank: string, verifiedWager?: number) => {
                if (verifiedRank) updateUserAnswer('rank', verifiedRank);
                if (verifiedWager !== undefined) updateUserAnswer('totalWagered', verifiedWager);
                handleNext();
            }}
            onProceedWithoutSuccess={handleNext} 
          />;
        break;
      case 'preparationAndIntegrity': // New combined step
        stepTitle = "Preparation & Integrity Check";
        stepComponent = <PreparationAndIntegrityStep
            answers={userAnswers}
            updateUserAnswer={updateUserAnswer}
            onProceed={handleNext} // This will be called if user is available and all checks pass
            onUserUnavailable={() => setAppStatus(AppStatus.USER_UNAVAILABLE)} // For when user explicitly states unavailability
            showBonusPath={isEligibleFor7DayBonus}
          />;
        break;
      case 'limboChallenge':
        stepTitle = "Part 1: Limbo Challenge";
        stepComponent = <LimboChallengeStep
            answers={userAnswers}
            updateUserAnswer={updateUserAnswer}
            onProceed={handleNext}
          />;
        break;
      case 'actionProofs':
        stepTitle = "Part 2: Action Proofs (Bonus)";
        stepComponent = <ActionProofsStep platform={userAnswers.platform as Platform} onContinue={handleNext} />;
        break;
      case 'assetSubmission':
        stepTitle = "Asset Submission (Bonus)";
        stepComponent = <AssetSubmissionStep
            answers={userAnswers}
            updateUserAnswer={updateUserAnswer}
            onProceed={handleNext}
          />;
        break;
      case 'receiptReview':
        stepTitle = "Application Submitted";
        stepComponent = <ReceiptReviewStep onRestart={handleRestart} />;
        break;
      default:
        stepTitle = "Error";
        stepComponent = <p>Error: Undefined step: {currentStepName} (Logical: {currentLogicalStep})</p>;
    }
    return { component: stepComponent, displayStepNumber: currentLogicalStep, stepTitle };
  };
  
  const currentStepInfo = renderCurrentStepInfo();

  const renderStatusMessage = () => {
    let messageTitle = "";
    let messageBody = "";

    switch (appStatus) {
        case AppStatus.DISQUALIFIED_SELF_EXCLUDED:
            messageTitle = "Eligibility Issue: Self-Exclusion";
            messageBody = "Due to a recent self-exclusion or account ban, you are currently not eligible to proceed with the VIP transfer. If your circumstances change, please feel free to use this assistant again later.";
            break;
        case AppStatus.DISQUALIFIED_PLATFORM:
            messageTitle = "Eligibility Issue: Platform Not Supported";
            messageBody = `We currently only support VIP transfers from specific platforms. Your selection is not on the list of accepted sites. Please contact support directly if you have questions.`;
            break;
        case AppStatus.DISQUALIFIED_WAGER_LOW:
            const wagerSource = (userAnswers.platform === Platform.STAKE && userAnswers.stakeVerificationStatus === 'success') 
                ? userAnswers.verifiedStakeTotalWager 
                : userAnswers.totalWagered;
            const wagerSourceText = (userAnswers.platform === Platform.STAKE && userAnswers.stakeVerificationStatus === 'success')
                ? `Your verified wager of $${(wagerSource || 0).toLocaleString()}`
                : `Your provided wager of $${(wagerSource || 0).toLocaleString()}`;

            messageTitle = "Eligibility Issue: Low Wager";
            messageBody = `${wagerSourceText} does not meet the minimum requirement of $${MIN_WAGER_TOTAL.toLocaleString()}. Please ensure your information is accurate or contact support if you believe there's an error.`;
            break;
        case AppStatus.USER_UNAVAILABLE:
            messageTitle = "Application Paused";
            messageBody = "Understood. Please return when you are available to complete the application process. Your progress is not saved, so you will need to start over.";
            break;
        default:
            return null;
    }

    return (
        <div className="space-y-6 text-center p-6 bg-slate-800 rounded-lg">
            <Alert type="error" title={messageTitle}>
                <p>{messageBody}</p>
            </Alert>
            <Button onClick={handleRestart} variant="secondary" size="md">
                Start Over
            </Button>
        </div>
    );
  };


  return (
    <div className="min-h-full flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 bg-slate-900 text-slate-300 w-full flex-grow">
      <header className="mb-6 sm:mb-8 text-center w-full max-w-3xl">
        <div className="inline-block">
          <span className="text-5xl sm:text-6xl font-bold text-emerald-500">JungleBet</span>
          <span className="text-5xl sm:text-6xl font-bold text-slate-100"> VIP Transfer</span>
        </div>
      </header>

      <main className="w-full max-w-2xl xl:max-w-3xl flex-grow">
        {appStatus === AppStatus.IN_PROGRESS && <StepIndicator currentStep={currentStepInfo.displayStepNumber} totalSteps={totalSteps} currentTitle={currentStepInfo.stepTitle}/>}
        
        <div className={`mt-4 sm:mt-5 bg-slate-800 p-5 sm:p-6 md:p-8 rounded-lg shadow-lg border border-slate-700`}>
          {appStatus !== AppStatus.IN_PROGRESS ? renderStatusMessage() : currentStepInfo.component}
        </div>
        
        {appStatus === AppStatus.IN_PROGRESS && currentLogicalStep > 1 && currentStepInfo.stepTitle !== "Application Submitted" && (
          <div className="mt-5 flex justify-start">
            <button
              onClick={handleBack}
              aria-label="Go to previous step"
              className="group flex items-center text-xs text-slate-400 hover:text-emerald-400 transition-colors duration-150 py-1.5 px-2.5 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 transform group-hover:-translate-x-0.5 transition-transform duration-150">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
              Back
            </button>
          </div>
        )}
      </main>
      <footer className="mt-8 sm:mt-12 text-center text-xs text-slate-500 py-3">
        <p>&copy; {new Date().getFullYear()} JungleBet Services. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
