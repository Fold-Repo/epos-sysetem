'use client'

import { createInputLabel, PasswordInput, PasswordRequirements } from '@/components'
import { Button } from '@heroui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registrationStepFourSchema } from '@/schema/auth.schema'

interface RegStepFourProps {
    onNextStep?: (data?: any) => void;
    onPrevStep?: () => void;
    onSubmit?: (data: any) => void;
    formData?: Record<string, any>;
}

const RegStepFour: React.FC<RegStepFourProps> = ({ onNextStep, onPrevStep, onSubmit, formData }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(registrationStepFourSchema),
        mode: 'onChange',
        defaultValues: {
            ...formData,
        }
    })

    const passwordValue = watch('password') || ''

    const handleFormSubmit = async (data: any) => {
        try {
            onNextStep?.(data)
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="space-y-6">

                <PasswordInput
                    label={createInputLabel({ name: "Password", required: true })}
                    placeholder="Enter your password"
                    {...register('password')}
                    error={errors.password?.message}
                />

                <PasswordRequirements password={passwordValue} />

                <PasswordInput
                    label={createInputLabel({ name: "Confirm Password", required: true })}
                    placeholder="Confirm your password"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                />

            </div>

            {/* ============================== Buttons ============================== */}
            <div className="flex gap-3 mt-9">

                <Button 
                    type="button" 
                    radius='md' 
                    variant='bordered' 
                    className='border border-yellow text-yellow flex-1 text-xs h-11' 
                    onPress={onPrevStep}>
                    Previous
                </Button>

                <Button 
                    type="submit" 
                    radius='md' 
                    className='bg-deep-purple text-white flex-1 text-xs h-11'
                    isLoading={isSubmitting}>
                    Save & Next
                </Button>

            </div>

        </form>
    )
}

export default RegStepFour
