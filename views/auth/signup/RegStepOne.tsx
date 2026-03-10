'use client'

import { AuthRedirect, createInputLabel, Input, Select } from '@/components'
import { Button } from '@heroui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registrationStepOneSchema } from '@/schema'
import { validateCompany, useBusinessTypes } from '@/services'
import { useToast } from '@/hooks'
import { getErrorMessage } from '@/utils'

interface RegStepOneProps {
    onNextStep?: (data?: any) => void;
    formData?: Record<string, any>;
}

const RegStepOne: React.FC<RegStepOneProps> = ({ onNextStep, formData }) => {
    const { showSuccess, showError } = useToast();
    const { data: businessTypesResponse, isLoading: loadingTypes } = useBusinessTypes();
    const businessTypes = businessTypesResponse?.data ?? [];
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(registrationStepOneSchema),
        mode: 'onChange',
        defaultValues: (formData || {}) as any,
    })

    const onSubmit = async (data: any) => {
        try {
            setSubmitting(true);

            const company_number = (data.business_registration_number ?? '').toString().trim();
            const res = await validateCompany({ company_number });
            const address = res?.data?.company?.registered_office_address;
            if (res?.data?.validation?.isValid && res?.data?.company?.company_name) {
                setValue('businessname', res.data.company.company_name, { shouldValidate: true });
                showSuccess(res.message || 'Company verified.');
                onNextStep?.({
                    ...data,
                    businessname: res.data.company.company_name,
                    ...(address && {
                        postcode: address.postal_code ?? data.postcode,
                        addressline1: address.address_line_1 ?? data.addressline1,
                        addressline2: address.address_line_2 ?? data.addressline2,
                        addressline3: address.country ?? data.addressline3,
                        city: address.locality ?? data.city,
                    }),
                });
            } else if (res?.data?.validation && !res.data.validation.isValid && res.data.validation.mismatches) {
                const mismatchMessages = Object.entries(res.data.validation.mismatches)
                    .map(([field, info]) => `${field}: "${info.provided}" does not match registered "${info.registered}"`).join('; ');
                showError(mismatchMessages || 'Company details do not match.');
                return;
            } else {
                onNextStep?.(data);
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            showError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <div className="flex flex-col lg:grid grid-cols-1 lg:grid-cols-2 gap-3">

                <Input
                    formGroupClass='col-span-2'
                    label={createInputLabel({ name: "Business registration number", required: true })}
                    placeholder="Enter your company number"
                    {...register('business_registration_number')}
                    error={errors.business_registration_number?.message as string}
                />

                <Input
                    formGroupClass='col-span-2'
                    label={createInputLabel({ name: "Business Name", required: false })}
                    placeholder="Business name"
                    {...register('businessname')}
                    error={errors.businessname?.message as string}
                    disabled
                />

                <Select label={createInputLabel({ name: "Type of Business", required: true })}
                    {...register('businesstype')} defaultValue={formData?.businesstype ?? ''}
                    error={errors.businesstype?.message as string} disabled={loadingTypes}>
                    <option value="" disabled>Select business type</option>
                    {businessTypes
                        .filter((bt) => bt.is_active)
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((bt) => (
                            <option key={bt.id} value={bt.name}>
                                {bt.name}
                            </option>
                        ))}
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
            </div>

            <Button
                type="submit"
                radius='lg'
                className='bg-primary text-white w-full 
                mt-7 text-sm font-medium h-12 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200'
                isLoading={isSubmitting || submitting}
            >
                Next
            </Button>

            <AuthRedirect className='mt-5' question="Already have an account?" linkText="Login here" href="/" />

        </form>
    )
}

export default RegStepOne