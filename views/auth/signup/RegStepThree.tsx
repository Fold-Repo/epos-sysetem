'use client'

import { createInputLabel, CheckBox, TextArea, FileUpload, createFileLabel, Label } from '@/components'
import { Button } from '@heroui/react'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registrationStepThreeSchema } from '@/schema/auth.schema'
import { cn } from '@/lib'

interface RegStepThreeProps {
    onNextStep?: (data?: any) => void;
    onPrevStep?: () => void;
    formData?: Record<string, any>;
}

const categories = [
    { value: 'hotel-leisure', label: 'Hotel & Leisure' },
    { value: 'food-beverage', label: 'Food & Beverage' },
    { value: 'retail-store', label: 'Retail & Store' },
    { value: 'logistics-supply', label: 'Logistics & Supply' },
]

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
            categories: [],
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

                <div className='space-y-2'>

                    <div className="inline-flex items-center">
                        <Label label={createInputLabel({ name: "Category of Goods/Services", required: true })} />
                    </div>

                    <Controller
                        name="categories"
                        control={control}
                        render={({ field }) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                {categories.map((category) => {
                                    const isChecked = field.value?.includes(category.value);
                                    const handleToggle = () => {
                                        const currentValues = field.value || [];
                                        if (isChecked) {
                                            field.onChange(currentValues.filter((v: string | undefined) => v !== category.value));
                                        } else {
                                            field.onChange([...currentValues, category.value]);
                                        }
                                    };
                                    return (
                                        <div 
                                            key={category.value}
                                            onClick={handleToggle}
                                            className={cn(
                                                "border rounded-lg px-2 pb-0.5 pt-2 transition-colors cursor-pointer",
                                                isChecked 
                                                    ? "border-primary bg-primary" 
                                                    : "border-gray-200/80"
                                            )}>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <CheckBox
                                                    name="categories"
                                                    formGroupClass='pt-0 pb-0'
                                                    label={category.label}
                                                    value={category.value}
                                                    checked={isChecked}
                                                    labelClassName={isChecked ? "text-white" : "text-gray-500"}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        const currentValues = field.value || [];
                                                        if (e.target.checked) {
                                                            field.onChange([...currentValues, category.value]);
                                                        } else {
                                                            field.onChange(currentValues.filter((v: string | undefined) => v !== category.value));
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    />

                    {errors.categories && (
                        <p className="text-xs text-red-500 mt-1">{errors.categories.message}</p>
                    )}
                </div>

                <TextArea
                    label={createInputLabel({ name: "Brief Description of Products/Services", required: true })}
                    placeholder="Provide a detailed description of your products or services, including key features and target markets..."
                    {...register('description')}
                    error={errors.description?.message}
                    formGroupClass="col-span-2"
                />

                <Controller
                    name="catalog"
                    control={control}
                    render={({ field }) => (
                        <FileUpload
                            name="catalog"
                            label={createFileLabel({ 
                                name: "Product/Service Catalog (Optional)", 
                                required: false 
                            })}
                            maxFileSize={10}
                            acceptedFileTypes={['pdf', 'doc', 'docx']}
                            error={errors.catalog?.message as string}
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

                <Button type="submit" radius='md' className='bg-deep-purple text-white flex-1 text-xs h-11' 
                isLoading={isSubmitting}>Save & Next</Button>

            </div>
        </form>
    )
}

export default RegStepThree