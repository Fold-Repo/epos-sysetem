'use client'

import { AuthRedirect } from '@/components'
import { useCountdown, useToast } from '@/hooks'
import { Button } from '@heroui/react'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { otpVerificationSchema, OTPVerificationFormData } from '@/schema/auth.schema'
import OTPInput from 'react-otp-input'

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
        try {
            console.log('Verify OTP API call:', { email, ...data });
            showSuccess('OTP verified successfully, please create a new password.');
            onNextStep?.(data)
        } catch (error) {
            console.error('Form submission error:', error)
            showError('Failed to verify OTP, please try again later.');
        }
    }

    const handleResendCode = async () => {
        try {
            console.log('Resend OTP API call:', { email });
            resetCountdown(60);
        } catch (error) {
            console.error('Resend OTP error:', error);
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
                className='bg-deep-purple text-white w-full mt-7 text-xs h-11'
                isLoading={isSubmitting}
            >
                Verify Code
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

