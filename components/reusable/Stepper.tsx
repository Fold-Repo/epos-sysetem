'use client'

import React from 'react'

export interface StepperStep {
    id: number;
    label?: string;
}

interface StepperProps {
    steps: StepperStep[];
    currentStep: number;
    className?: string;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className = '' }) => {
    return (
        <div className={`flex items-center ${className}`}>
            {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;

                return (
                    <React.Fragment key={step.id}>
                        <div className="flex items-center gap-2.5">
                            <div
                                className={`
                                    w-9 h-9 rounded-full flex items-center justify-center
                                    border-2 transition-all duration-300
                                    ${isActive
                                        ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                                        : isCompleted
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-gray-300 bg-white text-gray-400'
                                    }
                                `}>
                                {isCompleted ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span className="text-sm font-semibold">
                                        {step.id}
                                    </span>
                                )}
                            </div>
                            {isActive && step.label && (
                                <span className="text-sm font-semibold text-primary whitespace-nowrap">
                                    {step.label}
                                </span>
                            )}
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`
                                flex-1 h-0.5 mx-3 transition-colors duration-300
                                ${isCompleted ? 'bg-primary' : 'bg-gray-300'}
                            `} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Stepper;

