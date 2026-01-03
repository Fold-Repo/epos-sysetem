'use client'

import { createInputLabel, Input, TextArea, FileUpload, createFileLabel } from '@/components'
import { Button } from '@heroui/react'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registrationStepThreeSchema } from '@/schema/auth.schema'

interface RegStepThreeProps {
    onNextStep?: (data?: any) => void;
    onPrevStep?: () => void;
    formData?: Record<string, any>;
}

const RegStepThree: React.FC<RegStepThreeProps> = ({ onNextStep, onPrevStep, formData }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(registrationStepThreeSchema),
        mode: 'onChange',
        defaultValues: {
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
            <div className="space-y-6">

                <Input
                    formGroupClass='col-span-2'
                    label={createInputLabel({ name: "Product/Service", required: true })}
                    placeholder="Enter your product or service (e.g., African Food Retail)"
                    {...register('product_service')}
                    error={errors.product_service?.message}
                />

                <TextArea
                    label={createInputLabel({ name: "Brief Description of Products/Services", required: true })}
                    placeholder="Provide a detailed description of your products or services, including key features and target markets..."
                    {...register('product_description')}
                    error={errors.product_description?.message}
                    formGroupClass="col-span-2"
                />

                <Controller
                    name="product_brochure"
                    control={control}
                    render={({ field }) => (
                        <FileUpload
                            name="product_brochure"
                            label={createFileLabel({ 
                                name: "Product/Service Catalog (Optional)", 
                                required: false 
                            })}
                            maxFileSize={10}
                            acceptedFileTypes={['pdf', 'doc', 'docx']}
                            error={errors.product_brochure?.message as string}
                            value={field.value as FileList | null}
                            onChange={(e) => {
                                if (e.target.files) {
                                    field.onChange(e.target.files);
                                }
                            }}
                        />
                    )}
                />

            </div>

            <div className="flex gap-3 mt-9">

                <Button type="button" radius='md' variant='bordered' className='border border-yellow text-yellow flex-1 text-xs h-11' onPress={onPrevStep}>Previous</Button>

                <Button type="submit" radius='md' className='bg-primary text-white flex-1 text-xs h-11' 
                isLoading={isSubmitting}>Save & Next</Button>

            </div>
        </form>
    )
}

export default RegStepThree