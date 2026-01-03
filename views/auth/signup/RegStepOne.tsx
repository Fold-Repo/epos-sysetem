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
                    {...register('businessname')}
                    error={errors.businessname?.message as string}
                />

                <Select
                    label={createInputLabel({ name: "Type of Business", required: true })}
                    {...register('businesstype')}
                    error={errors.businesstype?.message as string}>
                    <option value="" disabled selected>Select business type</option>
                    <option value="Retail">Retail</option>
                    <option value="Wholesale">Wholesale</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Service">Service</option>
                    <option value="Other">Other</option>
                </Select>

                <Input
                    label={createInputLabel({ name: "Tax Identification Number (TIN)", required: true })}
                    placeholder="Enter your tax identification number"
                    {...register('tin')}
                    error={errors.tin?.message as string}
                />

                <Input
                    formGroupClass='col-span-2'
                    label={createInputLabel({ name: "Website (Optional)", required: false })}
                    placeholder="Enter your website"
                    {...register('website')}
                    type="url"
                    error={errors.website?.message as string}
                />

                <Input
                    formGroupClass='col-span-2'
                    label={createInputLabel({ name: "Business registration number", required: true })}
                    placeholder="Business registration number"
                    {...register('business_registration_number')}
                    error={errors.business_registration_number?.message as string}
                />
            </div>

            <Button type="submit" radius='md' className='bg-primary text-white w-full 
            mt-7 text-xs h-11' isLoading={isSubmitting}>
                Next
            </Button>

            <AuthRedirect question="Already have an account?" linkText="Login here" href="/signin" />

        </form>
    )
}

export default RegStepOne