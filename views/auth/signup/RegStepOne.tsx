'use client'

import { AuthRedirect, createInputLabel, Input, Select } from '@/components'
import { Button } from '@heroui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registrationStepOneSchema } from '@/schema'

interface RegStepOneProps {
    onNextStep?: (data?: any) => void;
    formData?: Record<string, any>;
}

const RegStepOne: React.FC<RegStepOneProps> = ({ onNextStep, formData }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(registrationStepOneSchema),
        mode: 'onChange',
        defaultValues: (formData || {}) as any,
    })

    const onSubmit = async (data: any) => {
        try {
            onNextStep?.(data)
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <div className="flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 gap-3">
                
                <Input
                    formGroupClass='col-span-2'
                    label={createInputLabel({ name: "Business Name", required: true })}
                    placeholder="Enter your business name"
                    {...register('businessName')}
                    error={errors.businessName?.message as string}
                />

                <Select
                    label={createInputLabel({ name: "Type of Business", required: true })}
                    {...register('businessType')}
                    error={errors.businessType?.message as string}>
                    <option value="" disabled selected>Select business type</option>
                    <option value="sole-proprietorship">Sole Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="corporation">Corporation</option>
                    <option value="llc">Limited Liability Company (LLC)</option>
                </Select>

                <Input
                    label={createInputLabel({ name: "Tax Identification Number", required: true })}
                    placeholder="If any"
                    {...register('taxId')}
                    error={errors.taxId?.message as string}
                />

                <Input
                    formGroupClass='col-span-2'
                    label={createInputLabel({ name: "Website (Optional)", required: false })}
                    placeholder="If any"
                    {...register('website')}
                    error={errors.website?.message as string}
                />

                <Input
                    formGroupClass='col-span-2'
                    label={createInputLabel({ name: "Business registration number", required: false })}
                    placeholder="Business registration number"
                    {...register('businessRegistrationNumber')}
                    error={errors.businessRegistrationNumber?.message as string}
                />
            </div>

            <Button type="submit" radius='md' className='bg-deep-purple text-white w-full 
            mt-7 text-xs h-11' isLoading={isSubmitting}>
                Next
            </Button>

            <AuthRedirect question="Already have an account?" linkText="Login here" href="/signin" />

        </form>
    )
}

export default RegStepOne