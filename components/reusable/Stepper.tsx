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

                return (
                    <React.Fragment key={step.id}>
                        <div className="flex items-center gap-2.5">
                            <div
                                className={`
                                    w-8 h-8 rounded-full flex items-center justify-center
                                    border transition-all duration-300
                                    ${isActive
                                        ? 'border-yellow bg-white'
                                        : 'border-gray-300 bg-white'
                                    }
                                `}>
                                <span
                                    className={`
                                        text-sm font-medium
                                        ${isActive
                                            ? 'text-yellow'
                                            : 'text-gray-400'
                                        }
                                    `}>
                                    {step.id}
                                </span>
                            </div>
                            {isActive && step.label && (
                                <span className="text-sm font-medium text-yellow whitespace-nowrap">
                                    {step.label}
                                </span>
                            )}
                        </div>
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-px bg-gray-300 mx-2" />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Stepper;

