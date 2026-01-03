'use client'

import { AuthHeader, AuthRedirect, Input, Label, PasswordInput, createInputLabel } from '@/components'
import { Button } from '@heroui/react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from '@/schema/auth.schema'
import { useToast } from '@/hooks'
import { useRouter, useSearchParams } from 'next/navigation'
import { login, requestOTP } from '@/services'
import { getErrorMessage, setCookie } from '@/utils'
import { EMAIL_ADDRESS_KEY, AUTH_TOKEN_KEY } from '@/types'

const LoginView = () => {

    const { showSuccess, showError } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-lg mx-auto'>
            <AuthHeader
                title="Welcome to EPOS"
                description='Enter your email and password to login to your account.'
            />

            <div className="space-y-5">

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

            <Button type="submit" radius='md' className='bg-primary text-white w-full 
            mt-6 text-xs h-11' isLoading={isSubmitting}>
                Login
            </Button>

            <AuthRedirect
                question="I'm New here?"
                linkText="Sign Up"
                href="/signup"
                className="text-center mt-7"
            />

        </form>
    )
}

export default LoginView

