'use client'

import { CheckBox } from '@/components'
import { CheckIcon } from '@/components/icons'
import { Button } from '@heroui/react'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registrationStepFiveSchema } from '@/schema/auth.schema'

interface RegStepFiveProps {
    onPrevStep?: () => void;
    onSubmit?: (data: any) => void;
    formData?: Record<string, any>;
    loading?: boolean;
}

const termsConditions = [
    "Provide accurate and up-to-date information about your business and services.",
    "Comply with all company policies, procedures, and legal requirements.",
    "Maintain confidentiality of any proprietary information shared during business operations.",
    "Adhere to quality standards and delivery timelines as specified in service agreements.",
    "Notify us immediately of any changes to business information, certifications, or contact details.",
]

const RegStepFive: React.FC<RegStepFiveProps> = ({ onPrevStep, onSubmit, formData, loading }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registrationStepFiveSchema),
        mode: 'onChange',
        defaultValues: {
            terms_condition: '',
            certify_correct_data: '',
            ...formData,
        }
    })

    const handleFormSubmit = async (data: any) => {
        try {
            onSubmit?.(data)
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="space-y-6">

                <div className="bg-yellow/10 border border-yellow/20 space-y-3 rounded-lg p-3">
                    <div className="space-y-0.5">
                        <h3 className="text-sm font-semibold text-gray-800">
                            Terms & Agreement
                        </h3>
                        <p className="text-xs text-gray-600 mb-1">
                            Vendor Agreement Terms
                        </p>
                    </div>
                    <p className="text-xs text-gray-700">
                        By submitting this vendor registration form, you agree to the
                        following terms and conditions:
                    </p>
                </div>

                <div className="space-y-3">
                    {termsConditions.map((condition, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <CheckIcon className="text-[#581C87] shrink-0 mt-0.5 size-3" />
                            <p className="text-xs text-gray-700">{condition}</p>
                        </div>
                    ))}
                </div>

                <div className="pt-2 space-y-4">

                    <Controller
                        name="terms_condition"
                        control={control}
                        render={({ field }) => (
                            <CheckBox
                                formGroupClass='mb-3'
                                name="terms_condition"
                                label={
                                    <span className="text-sm text-gray-700">
                                        I have read and agree to the {' '}
                                        <strong className="text-deep-purple font-medium">Terms and Conditions</strong>
                                        {' '} and {' '}
                                        <strong className="text-deep-purple font-medium">Privacy Policy</strong>
                                    </span>
                                }
                                checked={field.value === 'yes'}
                                onChange={(e) => field.onChange(e.target.checked ? 'yes' : '')}
                                error={errors.terms_condition?.message}
                            />
                        )}
                    />

                    <Controller
                        name="certify_correct_data"
                        control={control}
                        render={({ field }) => (
                            <CheckBox
                                name="certify_correct_data"
                                label="I certify that all information provided is accurate and complete to the best of my knowledge"
                                checked={field.value === 'yes'}
                                onChange={(e) => field.onChange(e.target.checked ? 'yes' : '')}
                                error={errors.certify_correct_data?.message}
                            />
                        )}
                    />

                </div>

            </div>

            {/* ============================== Buttons ============================== */}
            <div className="flex gap-3 mt-9">

                <Button 
                    type="button" 
                    radius='lg' 
                    variant='bordered' 
                    className='border-2 border-gray-300 text-gray-700 flex-1 text-sm font-medium h-12 hover:bg-gray-50 transition-all duration-200' 
                    onPress={onPrevStep}>
                    Previous
                </Button>

                <Button 
                    type="submit" 
                    radius='lg' 
                    className='bg-primary text-white flex-1 text-sm font-medium h-12 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200'
                    isLoading={loading}>
                    Submit Registration
                </Button>

            </div>

            <p className="max-w-lg text-[14px] text-gray-400 text-left mt-4">
                By submitting this form, you acknowledge that your information will be processed according to our privacy policy.
            </p>

        </form>
    )
}

export default RegStepFive

