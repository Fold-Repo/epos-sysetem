'use client'

import React, { useState } from 'react'
import RegStepOne from './RegStepOne';
import RegStepTwo from './RegStepTwo';
import RegStepThree from './RegStepThree';
import RegStepFour from './RegStepFour';
import RegStepFive from './RegStepFive';
import Link from 'next/link';
import { Logo } from '@/components';
import { Stepper, GoogleSignUpButton } from '@/components';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks';
import { register, googleSignUp } from '@/services';
import { getErrorMessage, setCookie } from '@/utils';
import { EMAIL_ADDRESS_KEY } from '@/types';

interface Step {
    id: number;
    component: React.FC<{
        onNextStep?: (data?: any) => void;
        onPrevStep?: () => void;
        onSubmit?: (data: any) => void;
        formData?: Record<string, any>;
        loading?: boolean;
    }>;
}

const SignUpView = () => {

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [googleIdToken, setGoogleIdToken] = useState<string | null>(null);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const { showSuccess, showError } = useToast();

    const steps: Step[] = [
        { id: 1, component: RegStepOne },
        { id: 2, component: RegStepTwo },
        { id: 3, component: RegStepThree },
        { id: 4, component: RegStepFour },
        { id: 5, component: RegStepFive },
    ];

    const stepperSteps = [
        { id: 1, label: 'Business Info' },
        { id: 2, label: 'Contact Details' },
        { id: 3, label: 'Products & Services' },
        { id: 4, label: 'Password' },
        { id: 5, label: 'Terms & Agreement' },
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

    const handlePrevStep = () => {
        const currentStepIndex = steps.findIndex(step => step.id === currentStep);
        if (currentStepIndex > 0) {
            setCurrentStep(steps[currentStepIndex - 1].id);
        }
    };

    const handleFinalSubmit = async (stepData: any) => {
        try {

            const allFormData = { ...formData, ...stepData };

            // If Google sign up, use googleSignUp endpoint
            if (googleIdToken) {
                const payload = {
                    idToken: googleIdToken,
                    businessname: allFormData.businessname,
                    businesstype: allFormData.businesstype,
                    tin: allFormData.tin,
                    website: allFormData.website || null,
                    business_registration_number: allFormData.business_registration_number || null,
                    firstname: allFormData.firstname,
                    lastname: allFormData.lastname,
                    email: allFormData.email,
                    phone: allFormData.phone,
                    altphone: allFormData.altphone || null,
                    product_service: allFormData.product_service,
                    product_description: allFormData.product_description,
                    product_brochure: null,
                    terms_condition: allFormData.terms_condition,
                    certify_correct_data: allFormData.certify_correct_data,
                    role: allFormData.role || 'business',
                    position: allFormData.position || 'Owner',
                    addressline1: allFormData.addressline1,
                    addressline2: allFormData.addressline2 || null,
                    addressline3: allFormData.addressline3 || null,
                    city: allFormData.city,
                    postcode: allFormData.postcode,
                    password: '', // Not needed for Google sign up
                };

                setLoading(true);
                const response = await googleSignUp(payload);
                setCookie(EMAIL_ADDRESS_KEY, allFormData.email);
                showSuccess(response.data.message || 'Registration successful! Please verify your email.');
                router.replace('/verify');
            } else {
                // Regular email sign up
                const payload = {
                    businessname: allFormData.businessname,
                    businesstype: allFormData.businesstype,
                    tin: allFormData.tin,
                    website: allFormData.website || null,
                    business_registration_number: allFormData.business_registration_number || null,
                    firstname: allFormData.firstname,
                    lastname: allFormData.lastname,
                    email: allFormData.email,
                    password: allFormData.password,
                    phone: allFormData.phone,
                    altphone: allFormData.altphone || null,
                    product_service: allFormData.product_service,
                    product_description: allFormData.product_description,
                    product_brochure: null,
                    terms_condition: allFormData.terms_condition,
                    certify_correct_data: allFormData.certify_correct_data,
                    role: allFormData.role || 'business',
                    position: allFormData.position || 'Owner',
                    addressline1: allFormData.addressline1,
                    addressline2: allFormData.addressline2 || null,
                    addressline3: allFormData.addressline3 || null,
                    city: allFormData.city,
                    postcode: allFormData.postcode,
                };

                setLoading(true);
                const response = await register(payload);
                setCookie(EMAIL_ADDRESS_KEY, allFormData.email);
                showSuccess(response.data.message || 'Registration successful! Please verify your email.');
                router.replace('/verify');
            }

        } catch (error) {
            const errorMessage = getErrorMessage(error);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async (idToken: string) => {
        try {
            setIsGoogleLoading(true);
            setGoogleIdToken(idToken);

            // Decode Google token to get user info (basic decoding, not verification)
            // In production, you should verify the token on the backend
            try {
                const payload = JSON.parse(atob(idToken.split('.')[1]));
                const name = payload.name || '';
                const email = payload.email || '';
                const [firstname = '', lastname = ''] = name.split(' ');

                // Pre-fill form data with Google info
                setFormData(prev => ({
                    ...prev,
                    firstname,
                    lastname,
                    email,
                    role: 'business',
                    position: 'Owner'
                }));

                showSuccess('Google account connected! Please complete the registration form.');
            } catch (decodeError) {
                // If decoding fails, just proceed with the token
                showSuccess('Google account connected! Please complete the registration form.');
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            showError(errorMessage || 'Failed to connect Google account. Please try again.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const renderStepContent = () => {
        const currentStepObj = steps.find(step => step.id === currentStep);

        if (currentStepObj) {
            const StepComponent = currentStepObj.component;
            return (
                <StepComponent
                    onNextStep={(data) => handleNextStep(data)}
                    onPrevStep={handlePrevStep}
                    onSubmit={handleFinalSubmit}
                    formData={formData}
                    loading={loading}
                />
            );
        }

        return null;
    };

    return (
        <div className="bg-white py-8">

            <div className="space-y-4 pb-8">

                <div className='mb-4'>
                    <Logo textColor="text-gray-900" size="md" iconBgColor="bg-primary" iconTextColor="text-white" />
                </div>

                <div className="space-y-1">

                    <h2 className='text-2xl font-semibold text-gray-900 pt-2'>
                        Create Your Business Account
                    </h2>
                    <p className='text-sm text-gray-600 leading-6'>
                        Complete your business registration to start managing your sales and inventory
                    </p>

                </div>

                {/* =============== Progress Bar =============== */}
                <Stepper steps={stepperSteps} currentStep={currentStep} className='pt-4' />

            </div>

            {/* Google Sign Up Button - Show only on first step */}
            {currentStep === 1 && !googleIdToken && (
                <div className="mb-6">
                    <GoogleSignUpButton
                        onSuccess={handleGoogleSignUp}
                        onError={(error) => showError(error)}
                        isLoading={isGoogleLoading}
                    />
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                        </div>
                    </div>
                </div>
            )}

            {renderStepContent()}

        </div>
    )
}

export default SignUpView