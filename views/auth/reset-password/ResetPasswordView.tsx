'use client'

import React, { useState } from 'react'
import ForgotPassword from './ForgotPassword'
import PassOTPVerification from './PassOTPVerification'
import CreatePassword from './CreatePassword'
import { AuthHeader } from '@/components'
import {
    ForgotPasswordFormData,
    OTPVerificationFormData,
    CreatePasswordFormData
} from '@/schema/auth.schema'

interface Step {
    id: number;
    component: React.FC<{
        onNextStep?: (data?: any) => void;
        email?: string;
        token?: string;
    }>;
}

type AllFormData = ForgotPasswordFormData & OTPVerificationFormData & CreatePasswordFormData;

const ResetPasswordView = () => {

    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<Partial<AllFormData>>({});

    const stepTitles: Record<number, string> = {
        1: 'Reset Password',
        2: 'Enter Reset Password OTP',
        3: 'Create New Password',
    };

    const stepSubtitles: Record<number, string> = {
        1: 'Enter the email you have registered with so we could send you an OTP to reset your password.',
        2: `We've sent a code to ${formData.email || 'your email'}`,
        3: 'Enter your credentials to set new password',
    };

    const steps: Step[] = [
        { id: 1, component: ForgotPassword },
        { id: 2, component: PassOTPVerification },
        { id: 3, component: CreatePassword },
    ];

    const handleNextStep = (stepData?: any) => {
        if (stepData) {
            setFormData((prev) => ({ ...prev, ...stepData }));
        }
        const currentStepIndex = steps.findIndex(step => step.id === currentStep);
        if (currentStepIndex < steps.length - 1) {
            setCurrentStep(steps[currentStepIndex + 1].id);
        }
    };

    const renderStepContent = () => {
        const currentStepObj = steps.find(step => step.id === currentStep);

        if (currentStepObj) {
            const StepComponent = currentStepObj.component;
            return (
                <StepComponent
                    onNextStep={(data) => handleNextStep(data)}
                    email={formData.email}
                    token={formData.otp}
                />
            );
        }

        return null;
    };

    return (
        <div className="bg-white">

            <div className="max-w-lg mx-auto">

                <AuthHeader
                    title={stepTitles[currentStep]}
                    description={stepSubtitles[currentStep]}
                />

                {renderStepContent()}

            </div>

        </div>
    )
}

export default ResetPasswordView

