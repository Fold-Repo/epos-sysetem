'use client'

import { createInputLabel, Input, PopupModal } from '@/components'
import { Button } from '@heroui/react'
import { useState, useEffect } from 'react'
import { TrashIcon } from '@/components/icons'
import { Variation } from '@/types/variation.type'
import { useCreateVariation, useUpdateVariation } from '@/services'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// =========================
// VALIDATION SCHEMA
// =========================
const variationSchema = yup.object({
    name: yup
        .string()
        .required('Variation name is required')
        .min(2, 'Variation name must be at least 2 characters')
        .max(100, 'Variation name must not exceed 100 characters'),
    options: yup
        .array()
        .of(yup.string().required('Option is required'))
        .min(1, 'At least one option is required')
        .required('Options are required')
}).required()

type VariationFormData = yup.InferType<typeof variationSchema>

interface AddVariationModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: Variation
}

const AddVariationModal = ({ isOpen, onClose, initialData }: AddVariationModalProps) => {

    const createVariationMutation = useCreateVariation()
    const updateVariationMutation = useUpdateVariation()
    const [options, setOptions] = useState<string[]>([''])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        control
    } = useForm<VariationFormData>({
        resolver: yupResolver(variationSchema),
        mode: 'onChange',
        defaultValues: {
            name: initialData?.name || '',
            options: initialData?.options.map(opt => opt.option) || ['']
        }
    })

    useEffect(() => {
        if (isOpen) {
            const initialOptions = initialData?.options.map(opt => opt.option) || ['']
            reset({
                name: initialData?.name || '',
                options: initialOptions
            })
            setOptions(initialOptions)
        }
    }, [isOpen, initialData, reset])

    const handleAddOption = () => {
        const newOptions = [...options, '']
        setOptions(newOptions)
        setValue('options', newOptions)
    }

    const handleRemoveOption = (index: number) => {
        if (options.length > 1) {
            const newOptions = options.filter((_, i) => i !== index)
            setOptions(newOptions)
            setValue('options', newOptions)
        }
    }

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)
        setValue('options', newOptions)
    }

    const handleFormSubmit = async (data: VariationFormData) => {
        try {
            const payload = {
                name: data.name,
                options: data.options.filter(opt => opt.trim() !== '')
            }

            if (initialData) {
                updateVariationMutation.mutate({
                    id: initialData.id,
                    variationData: payload
                }, {
                    onSuccess: () => {
                        onClose()
                        reset()
                        setOptions([''])
                    }
                })
            } else {
                createVariationMutation.mutate(payload, {
                    onSuccess: () => {
                        onClose()
                        reset()
                        setOptions([''])
                    }
                })
            }
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <PopupModal
            size="lg"
            radius="2xl"
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            className='max-h-[95vh]'
            title={initialData ? 'Edit Variation' : 'Add Variation'}
            description={initialData ? 'Update variation information' : 'Add a new product variation'}
            bodyClassName='p-5'
            footer={
                <Button
                    size='sm'
                    type='submit'
                    className='h-10 px-6'
                    color="primary"
                    isLoading={isSubmitting || createVariationMutation.isPending || updateVariationMutation.isPending}
                    onPress={() => {
                        const form = document.querySelector('form')
                        if (form) {
                            form.requestSubmit()
                        }
                    }}>
                    {initialData ? 'Update Variation' : 'Save Variation'}
                </Button>
            }>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-4">
                <Input
                    label={createInputLabel({
                        name: "Variation Name",
                        required: true
                    })}
                    placeholder="Enter variation name (e.g., Size, Color)"
                    {...register('name')}
                    error={errors.name?.message as string}
                />

                {/* ================================ */}
                {/* Options */}
                {/* ================================ */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className='text-sm font-medium text-black/80'>Options:</h2>
                        <Button 
                            size="sm" 
                            variant="flat" 
                            className="text-[11px]" 
                            onPress={handleAddOption}
                            type="button">
                            Add Option
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {options.map((option, index) => (
                            <div key={index} className="w-full flex items-center gap-2">
                                <Controller
                                    name={`options.${index}`}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Input
                                            name={`options.${index}`}
                                            formGroupClass='w-full flex-1'
                                            inputSize='sm'
                                            value={field.value || ''}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                handleOptionChange(index, e.target.value)
                                            }}
                                            placeholder="Enter option (e.g., Small, Medium, Large)"
                                            error={fieldState.error?.message}
                                        />
                                    )}
                                />
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    className="text-red-500 hover:text-red-700"
                                    onPress={() => handleRemoveOption(index)}
                                    type="button"
                                    isDisabled={options.length === 1}>
                                    <TrashIcon className="size-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    {errors.options && typeof errors.options.message === 'string' && (
                        <p className="text-xs text-danger">{errors.options.message}</p>
                    )}
                </div>
            </form>

        </PopupModal>
    )
}

export default AddVariationModal

