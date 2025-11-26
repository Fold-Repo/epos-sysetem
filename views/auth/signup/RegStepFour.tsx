'use client'

import { CheckBox, createInputLabel } from '@/components'
import { CheckIcon } from '@/components/icons'
import { Button } from '@heroui/react'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registrationStepFourSchema } from '@/schema/auth.schema'
import { EyeIcon } from '@heroicons/react/24/solid'

interface RegStepFourProps {
    onPrevStep?: () => void;
    onSubmit?: (data: any) => void;
    formData?: Record<string, any>;
}

const termsConditions = [
    "Provide accurate and up-to-date information about your business and services.",
    "Comply with all company policies, procedures, and legal requirements.",
    "Maintain confidentiality of any proprietary information shared during business operations.",
    "Adhere to quality standards and delivery timelines as specified in service agreements.",
    "Notify us immediately of any changes to business information, certifications, or contact details.",
]

const RegStepFour: React.FC<RegStepFourProps> = ({ onPrevStep, onSubmit, formData }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(registrationStepFourSchema),
        mode: 'onChange',
        defaultValues: {
            agreeToTerms: false,
            consentToMarketing: false,
            certifyInformation: false,
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

    const handlePreview = () => {
        console.log('Preview clicked')
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="space-y-6">

                <div className="bg-yellow/10 border border-yellow/20 space-y-3 rounded-lg p-3">
                    <div className="space-y-0 5">
                        <h3 className="text-base font-semibold text-gray-800">
                            Terms & Agreement
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                            Vendor Agreement Terms
                        </p>
                    </div>
                    <p className="text-sm text-gray-700">
                        By submitting this vendor registration form, you agree to the
                        following terms and conditions:
                    </p>
                </div>

                <div className="space-y-3">
                    {termsConditions.map((condition, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <CheckIcon className="text-[#581C87] shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700">{condition}</p>
                        </div>
                    ))}
                </div>

                <div className="pt-2">

                    <Controller
                        name="agreeToTerms"
                        control={control}
                        render={({ field }) => (
                            <CheckBox
                                formGroupClass='mb-3'
                                name="agreeToTerms"
                                label={
                                    <span className="text-sm text-gray-700">
                                        I have read and agree to the {' '}
                                        <strong className="text-deep-purple font-medium">Terms and Conditions</strong>
                                        {' '} and {' '}
                                        <strong className="text-deep-purple font-medium">Privacy Policy</strong>
                                    </span>
                                }
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                                error={errors.agreeToTerms?.message}
                            />
                        )}
                    />

                    <Controller
                        name="consentToMarketing"
                        control={control}
                        render={({ field }) => (
                            <CheckBox
                                formGroupClass='mb-2'
                                name="consentToMarketing"
                                label="I consent to receive marketing communications and business updates via email"
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                                error={errors.consentToMarketing?.message}
                            />
                        )}
                    />

                    <Controller
                        name="certifyInformation"
                        control={control}
                        render={({ field }) => (
                            <CheckBox
                                name="certifyInformation"
                                label="I certify that all information provided is accurate and complete to the best of my knowledge"
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                                error={errors.certifyInformation?.message}
                            />
                        )}
                    />

                </div>

            </div>

            {/* ============================== Buttons ============================== */}
            <div className="flex gap-3 mt-9">

                <Button type="button" radius='md' variant='bordered' className='border border-yellow text-yellow flex-1 text-xs h-11' onPress={onPrevStep}>Previous</Button>

                <Button type="submit" radius='md' className='bg-deep-purple text-white flex-1 text-xs h-11'
                    isLoading={isSubmitting}>Submit Registration</Button>

            </div>

            <p className="max-w-lg text-[14px] text-gray-400 text-left mt-4">
                By submitting this form, you acknowledge that your information will be processed according to our privacy policy.
            </p>

        </form>
    )
}

export default RegStepFour

