'use client'

import React, { useState } from 'react'
import RegStepOne from './RegStepOne';
import RegStepTwo from './RegStepTwo';
import RegStepThree from './RegStepThree';
import RegStepFour from './RegStepFour';
import RegStepFive from './RegStepFive';
import Image from 'next/image';
import { LOGO } from '@/constants';
import Link from 'next/link';
import { Stepper } from '@/components';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks';
import { register } from '@/services';
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

        } catch (error) {
            const errorMessage = getErrorMessage(error);
            showError(errorMessage);
        } finally {
            setLoading(false);
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
        <div className="bg-white py-10">

            <div className="space-y-3 pb-8">

                <Link href="/" className='block'>
                    <Image src={LOGO.logo_1} alt="Logo" width={100} height={48} />
                </Link>

                <div className="space-y-0.5">

                    <h2 className='text-lg md:text-xl font-medium pt-2'>
                        Welcome to EPOS
                    </h2>
                    <p className='text-sm text-[#6C7278] leading-5'>
                        Complete your vendor registration to get started
                    </p>

                </div>

                {/* =============== Progress Bar =============== */}
                <Stepper steps={stepperSteps} currentStep={currentStep} className='pt-3' />

            </div>

            {renderStepContent()}

        </div>
    )
}

export default SignUpView