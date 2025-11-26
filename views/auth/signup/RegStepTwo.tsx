'use client'

import { createFileLabel, createInputLabel, FileUpload, Input, PhoneInput, Select } from '@/components'
import { Button } from '@heroui/react'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registrationStepTwoSchema } from '@/schema/auth.schema'

interface RegStepTwoProps {
    onNextStep?: (data?: any) => void;
    onPrevStep?: () => void;
    formData?: Record<string, any>;
}

const RegStepTwo: React.FC<RegStepTwoProps> = ({ onNextStep, onPrevStep, formData }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(registrationStepTwoSchema),
        mode: 'onChange',
        defaultValues: {
            city: 'Lagos',
            zipCode: '100001',
            ...formData,
        }
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
                    label={createInputLabel({ name: "Primary Contact Person", required: true })}
                    placeholder="Enter primary contact person"
                    {...register('primaryContactPerson')}
                    error={errors.primaryContactPerson?.message}
                />

                <Input
                    label={createInputLabel({ name: "Email Address", required: true })}
                    placeholder="Enter email address"
                    type="email"
                    {...register('emailAddress')}
                    error={errors.emailAddress?.message}
                />

                <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                        <PhoneInput
                            label={createInputLabel({ name: "Phone Number", required: true })}
                            placeholder="Enter phone number"
                            value={field.value || ''}
                            onChange={field.onChange}
                            error={errors.phoneNumber?.message}
                        />
                    )}
                />

                <Controller
                    name="alternatePhone"
                    control={control}
                    render={({ field }) => (
                        <PhoneInput
                            label={createInputLabel({ name: "Alternate Phone (Optional)", required: false })}
                            placeholder="Enter alternate phone"
                            value={field.value || ''}
                            onChange={field.onChange}
                            error={errors.alternatePhone?.message}
                        />
                    )}
                />

                <Input
                    label={createInputLabel({ name: "City", required: true })}
                    placeholder="Enter city"
                    {...register('city')}
                    error={errors.city?.message}
                />

                <Select
                    label={createInputLabel({ name: "State", required: true })}
                    {...register('state')}
                    error={errors.state?.message}>
                    <option value="" disabled>Select state</option>
                    <option value="lagos">Lagos</option>
                    <option value="abuja">Abuja</option>
                    <option value="kano">Kano</option>
                    <option value="rivers">Rivers</option>
                    <option value="oyo">Oyo</option>
                </Select>

                <Input
                    label={createInputLabel({ name: "ZIP Code", required: false })}
                    placeholder="Enter ZIP code"
                    {...register('zipCode')}
                    error={errors.zipCode?.message}
                />

                <Input
                    formGroupClass='col-span-2'
                    label={createInputLabel({ name: "Business Address (Street Address *)", required: true })}
                    placeholder="Enter business address"
                    {...register('businessAddress')}
                    error={errors.businessAddress?.message}
                />
            </div>

            <div className="flex gap-3 mt-7">

                <Button type="button" radius='md' variant='bordered'
                    className='border border-yellow text-yellow flex-1 text-xs h-11'
                    onPress={onPrevStep}>
                    Previous
                </Button>

                <Button type="submit" radius='md' className='bg-deep-purple text-white flex-1 
                text-xs h-11' isLoading={isSubmitting}>
                    Save & Next
                </Button>
            </div>

        </form>
    )
}

export default RegStepTwo