'use client'

import { createInputLabel, Input } from '@/components'
import { Button } from '@heroui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/schema/auth.schema'
import { useToast } from '@/hooks'
import { requestOTP } from '@/services'
import { getErrorMessage } from '@/utils'

interface ForgotPasswordProps {
    onNextStep?: (data: ForgotPasswordFormData) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNextStep }) => {

    const { showSuccess, showError } = useToast();

    const { register, handleSubmit, formState: { errors, isSubmitting } } =
        useForm<ForgotPasswordFormData>({
            resolver: yupResolver(forgotPasswordSchema),
            mode: 'onChange',
        })

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            const response = await requestOTP({ email: data.email });
            showSuccess(response.data.message || 'OTP sent successfully, please check your email.');
            onNextStep?.(data)
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            showError(errorMessage);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
                <Input
                    label={createInputLabel({ name: "Email Address", required: true })}
                    placeholder="Enter your email address"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                />
            </div>

            <Button
                type="submit"
                radius='md'
                className='bg-primary text-white w-full mt-6 text-xs h-11'
                isLoading={isSubmitting}
            >
                Send Code
            </Button>
        </form>
    )
}

export default ForgotPassword

