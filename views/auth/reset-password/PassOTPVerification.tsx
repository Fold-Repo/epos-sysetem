'use client'

import { AuthRedirect } from '@/components'
import { useCountdown, useToast } from '@/hooks'
import { Button } from '@heroui/react'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { otpVerificationSchema, OTPVerificationFormData } from '@/schema/auth.schema'
import OTPInput from 'react-otp-input'
import { requestOTP } from '@/services'
import { getErrorMessage } from '@/utils'

interface PassOTPVerificationProps {
    onNextStep?: (data: OTPVerificationFormData) => void;
    email?: string;
}

const PassOTPVerification: React.FC<PassOTPVerificationProps> = ({ 
    onNextStep, 
    email,
}) => {

    const { showSuccess, showError } = useToast();

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
        onNextStep?.(data)
    }

    const handleResendCode = async () => {
        try {
            if (!email) {
                showError('Email not found. Please try again.');
                return;
            }
            const response = await requestOTP({ email });
            showSuccess(response.data.message || 'OTP sent successfully.');
            resetCountdown(60);
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            showError(errorMessage);
        }
    }

    return (
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
                                        className={`form-control max-w-10 max-h-10 md:max-w-14 md:max-h-14 text-lg font-medium bg-white border-1.5 border-[#EDF1F3] ${errors.otp ? 'border-red-400' : ''}`}
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

            <Button type="submit" radius='md' className='bg- text-white w-full mt-7 text-xs h-11'>
                Verify OTP
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
    )
}

export default PassOTPVerification

