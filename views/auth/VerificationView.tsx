'use client'

import { AuthRedirect, AuthHeader } from '@/components';
import { useCountdown, useToast } from '@/hooks';
import { Button } from '@heroui/react';
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { otpVerificationSchema, OTPVerificationFormData } from '@/schema/auth.schema'
import OTPInput from 'react-otp-input'
import { useRouter } from 'next/navigation'

const VerificationView = () => {

    const { showSuccess, showError } = useToast();
    const router = useRouter();

    const { control, handleSubmit, formState: { errors, isSubmitting } } =
        useForm<OTPVerificationFormData>({
            resolver: yupResolver(otpVerificationSchema),
            mode: 'onChange',
        })

    const { countdown: otpCountdown, reset: resetCountdown } = useCountdown({
        initialCount: 60,
        autoStart: true,
    });

    const onSubmit = async (data: OTPVerificationFormData) => {
        try {
            showSuccess('Account verified successfully, please login to your account.');
            console.log('Verify account API call:', data);
            router.push('/signin');
        } catch (error) {
            console.error('Form submission error:', error)
            showError('Failed to verify account, please try again later.');
        }
    }

    const handleResendCode = async () => {
        try {
            console.log('Resend OTP API call');
            resetCountdown(60);
            showSuccess('OTP sent successfully 🎉');
        } catch (error) {
            console.error('Resend OTP error:', error);
            showError('Failed to send OTP 😭');
        }
    }


    return (
        <div className='max-w-md mx-auto'>

            <AuthHeader
                title="Enter Verification Code"
                description="We've sent a code to adeoyesolomon2693@gmail.com"
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                    <Controller
                        name="otp"
                        control={control}
                        render={({ field }) => (
                            <OTPInput
                                value={field.value || ''}
                                onChange={field.onChange}
                                inputType="tel"
                                numInputs={6}
                                inputStyle={{ width: '50px', height: '50px' }}
                                containerStyle="flex items-center gap-x-1 sm:gap-x-2 justify-center"
                                renderInput={(props, index) => (
                                    <React.Fragment key={index}>
                                        <input
                                            {...props}
                                            className="form-control max-w-10 max-h-10 md:max-w-14 md:max-h-14 text-lg font-medium bg-white border-1.5 border-[#EDF1F3]"
                                        />
                                    </React.Fragment>
                                )}
                            />
                        )}
                    />
                    {errors.otp && (
                        <p className="text-xs text-red-500 text-center">{errors.otp.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    radius='md'
                    className='bg-deep-purple text-white text-xs w-full mt-7'
                    isLoading={isSubmitting}
                >
                    Verify Account
                </Button>

                <div className="space-y-6 mt-8">
                    <div className="flex items-center">
                        <div className="border border-gray-200 w-full"></div>
                        <p className="text-center text-xs mx-5 text-[#858481]">{otpCountdown}s</p>
                        <div className="border border-gray-200 w-full"></div>
                    </div>

                    <AuthRedirect
                        className='pt-0 px-4 text-center'
                        disabled={otpCountdown > 0}
                        onClick={handleResendCode}
                        question='Experiencing issues receiving the code?'
                        linkText='Resend Code'
                    />
                </div>
            </form>

        </div>
    )
}

export default VerificationView