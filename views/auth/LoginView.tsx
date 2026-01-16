'use client'

import { AuthRedirect, Input, Label, PasswordInput, createInputLabel, GoogleSignInButton, Logo } from '@/components'
import { Button } from '@heroui/react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from '@/schema/auth.schema'
import { useToast } from '@/hooks'
import { useRouter, useSearchParams } from 'next/navigation'
import { login, requestOTP, googleSignIn } from '@/services'
import { getErrorMessage, setCookie } from '@/utils'
import { EMAIL_ADDRESS_KEY, AUTH_TOKEN_KEY } from '@/types'
import { useState } from 'react'

const LoginView = () => {

    const { showSuccess, showError } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(loginSchema),
        mode: 'onChange',
    })

    const onSubmit = async (data: any) => {
        try {

            const response = await login({
                email: data.email,
                password: data.password
            });

            setCookie(AUTH_TOKEN_KEY, response.data?.token || '');
            showSuccess(response.message || 'Login successful, welcome back!');
            router.push(callbackUrl);

        } catch (error: any) {

            // ==============================
            // Handle axios error response
            // ==============================
            if (error?.response?.data) {

                const errorData = error.response.data;

                if (errorData.isVerify === false) {

                    // ==============================
                    // Store email for verification
                    // ==============================
                    setCookie(EMAIL_ADDRESS_KEY, data.email);

                    // ==============================
                    // Automatically request verification OTP
                    // ==============================
                    try {
                        await requestOTP({
                            email: data.email,
                            type: 'verify_account'
                        });
                        showError(errorData.message || 'Account not verified. Please verify your account.');
                        router.push('/verify');
                        return;
                    } catch (otpError) {
                        const errorMessage = getErrorMessage(otpError);
                        showError(errorMessage || 'Failed to send verification code. Please try again.');
                        return;
                    }
                }
            }

            const errorMessage = getErrorMessage(error);
            showError(errorMessage);

        }
    }

    const handleGoogleSignIn = async (idToken: string) => {
        try {
            setIsGoogleLoading(true);
            const response = await googleSignIn({ idToken });

            setCookie(AUTH_TOKEN_KEY, response.data?.token || '');
            showSuccess(response.message || 'Login successful, welcome back!');
            router.push(callbackUrl);
        } catch (error: any) {
            const errorMessage = getErrorMessage(error);
            showError(errorMessage || 'Google sign in failed. Please try again.');
        } finally {
            setIsGoogleLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
            <div className="flex flex-col items-center justify-center mb-6">
                <Logo
                    textColor="text-gray-900"
                    size="md"
                    iconBgColor="bg-primary"
                    iconTextColor="text-white"
                />
                <p className='text-lg font-bold mt-4 text-gray-800'>Welcome Back</p>
            </div>

            {/* Google Sign In Button */}
            <div className="mb-6">
                <GoogleSignInButton
                    onSuccess={handleGoogleSignIn}
                    onError={(error) => showError(error)}
                    isLoading={isGoogleLoading}
                />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
                </div>
            </div>

            <div className="space-y-4">

                <Input label={createInputLabel({ name: "Email", required: true })}
                    placeholder="Enter your email"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message as string}
                />

                <div className="form-group">

                    <div className="flex items-center justify-between mb-1">
                        <Label htmlFor="password" label={createInputLabel({ name: "Password", required: true })} />
                        <Link href="/forgot-password"
                            className="text-xs text-primary hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <PasswordInput
                        placeholder="Enter your Password"
                        {...register('password')}
                        error={errors.password?.message as string}
                        formGroupClass="mb-0"
                    />

                </div>

            </div>

            <Button
                type="submit"
                radius='lg'
                className='bg-primary text-white w-full 
                mt-6 text-sm font-medium h-12 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200'
                isLoading={isSubmitting}
            >
                Sign In
            </Button>

            <AuthRedirect
                question="I'm New here?"
                linkText="Sign Up"
                href="/signup"
                className="text-center mt-6"
            />

            <div className="fixed -bottom-24 -right-24 z-0 pointer-events-none overflow-hidden container-none">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-96 h-96 bg-primary/20 rounded-full blur-3xl ripple-animation-1 absolute"></div>
                    <div className="w-[28rem] h-[28rem] bg-primary/10 rounded-full blur-3xl ripple-animation-2 absolute"></div>
                </div>
            </div>

        </form>
    )
}

export default LoginView

