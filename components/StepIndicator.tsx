import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  currentTitle: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, currentTitle }) => {
  return (
    <div className="mb-5 sm:mb-6">
      <div className="flex items-center justify-center space-x-2 sm:space-x-3">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <React.Fragment key={step}>
            <div
              className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-semibold transition-all duration-300
                ${step === currentStep ? 'bg-emerald-500 text-white scale-110' : 
                  step < currentStep ? 'bg-emerald-600 text-emerald-100' : 
                  'bg-slate-700 text-slate-400'}`}
              aria-current={step === currentStep ? 'step' : undefined}
            >
              {step < currentStep ? (
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              ) : (
                step
              )}
            </div>
            {step < totalSteps && (
              <div className={`flex-auto h-0.5 transition-colors duration-500 ease-in-out w-4 sm:w-6
                ${step < currentStep ? 'bg-emerald-500' : 'bg-slate-700'}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      {currentTitle && <p className="text-center text-xs text-slate-400 mt-2.5 font-medium tracking-wide">Step {currentStep}: {currentTitle}</p>}
    </div>
  );
};

export default StepIndicator;