'use client'

import { AuthHeader, AuthRedirect, Input, PasswordInput, createInputLabel } from '@/components'
import { Button } from '@heroui/react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema } from '@/schema/auth.schema'
import { useToast } from '@/hooks'

const LoginView = () => {

    const { showSuccess, showError } = useToast();

    const { register, handleSubmit, formState: { errors, isSubmitting } } =  useForm({
        resolver: yupResolver(loginSchema),
        mode: 'onChange',
    })

    const onSubmit = async (data: any) => {
        try {
            console.log('Login data:', data)
            showSuccess('Login successful, welcome back!');
        } catch (error) {
            console.error('Login error:', error)
            showError('Failed to login, please try again later.');
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
                        <label className="text-sm text-gray-700">
                            {createInputLabel({ name: "Password", required: true })}
                        </label>
                        <Link href="/forgot-password" 
                            className="text-sm text-primary hover:underline">
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

            <Button type="submit" radius='md' className='bg-deep-purple text-white w-full 
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

