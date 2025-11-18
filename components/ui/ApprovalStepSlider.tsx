
import React from 'react';
import { CheckIcon } from '../icons';

export const ApprovalStepSlider = ({ currentStep, onChange, t }: { currentStep: number, onChange: (step: number) => void, t: any }) => {
    const steps = [1, 2, 3, 4];
    const stepLabels = {
        1: t.step1_label,
        2: t.step2_label,
        3: t.step3_label,
        4: t.step4_label,
    };
    return (
        <div className="relative pt-8 px-4">
            <div className="relative w-full h-1 bg-latte-surface2 dark:bg-mocha-surface2 rounded-full">
                <div
                    className="absolute top-0 left-0 h-1 bg-latte-mauve dark:bg-mocha-mauve rounded-full"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
                {steps.map((step) => (
                    <div
                        key={step}
                        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    >
                        <button
                            onClick={() => onChange(step)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${step <= currentStep
                                ? 'bg-latte-mauve dark:bg-mocha-mauve border-latte-mauve dark:border-mocha-mauve'
                                : 'bg-latte-base dark:bg-mocha-base border-latte-surface2 dark:border-mocha-surface2'
                                }`}
                        >
                            {step < currentStep && <CheckIcon className="w-3 h-3 text-white dark:text-mocha-crust" />}
                        </button>
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-semibold text-latte-subtext1 dark:text-mocha-subtext1 whitespace-nowrap">
                            {stepLabels[step]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
