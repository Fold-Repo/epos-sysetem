'use client'

import { createInputLabel, PasswordInput } from '@/components'
import { Button } from '@heroui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createPasswordSchema, CreatePasswordFormData } from '@/schema/auth.schema'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks'

interface CreatePasswordProps {
    email?: string;
}

const CreatePassword: React.FC<CreatePasswordProps> = ({ email }) => {

    const router = useRouter();
    const { showSuccess, showError } = useToast();

    const { register, handleSubmit, formState: { errors, isSubmitting } } =
        useForm<CreatePasswordFormData>({
            resolver: yupResolver(createPasswordSchema),
            mode: 'onChange',
        })

    const handleFormSubmit = async (data: CreatePasswordFormData) => {
        try {
            console.log('Reset password API call:', { email, ...data });
            router.push('/signin');
            showSuccess('Password reset successfully, please login to your account.');
        } catch (error) {
            console.error('Form submission error:', error)
            showError('Failed to reset password, please try again later.');
        }
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="space-y-4">
                <PasswordInput
                    label={createInputLabel({ name: "New Password", required: true })}
                    placeholder="Enter your new password"
                    {...register('newPassword')}
                    error={errors.newPassword?.message}
                />

                <PasswordInput
                    label={createInputLabel({ name: "Confirm Password", required: true })}
                    placeholder="Confirm your new password"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                />
            </div>

            <Button
                type="submit"
                radius='md'
                className='bg-deep-purple text-white w-full mt-6 text-xs h-11'
                isLoading={isSubmitting}
            >
                Reset Password
            </Button>
        </form>
    )
}

export default CreatePassword

