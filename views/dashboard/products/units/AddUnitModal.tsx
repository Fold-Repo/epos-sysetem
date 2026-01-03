'use client'

import { createInputLabel, Input, PopupModal } from '@/components'
import { Button } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Unit } from '@/types/unit.type'
import { useEffect } from 'react'
import { useCreateUnit, useUpdateUnit } from '@/services'

// =========================
// VALIDATION SCHEMA
// =========================
const unitSchema = yup.object({
    name: yup
        .string()
        .required('Unit name is required')
        .min(2, 'Unit name must be at least 2 characters')
        .max(100, 'Unit name must not exceed 100 characters'),
    short_name: yup
        .string()
        .required('Short name is required')
        .min(1, 'Short name must be at least 1 character')
        .max(10, 'Short name must not exceed 10 characters'),
}).required()

type UnitFormData = yup.InferType<typeof unitSchema>

interface AddUnitModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: Unit
}

const AddUnitModal = ({ isOpen, onClose, initialData }: AddUnitModalProps) => {
    const createUnitMutation = useCreateUnit()
    const updateUnitMutation = useUpdateUnit()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<UnitFormData>({
        resolver: yupResolver(unitSchema),
        mode: 'onChange',
        defaultValues: {
            name: initialData?.name || '',
            short_name: initialData?.short_name || ''
        }
    })

    useEffect(() => {
        if (isOpen) {
            reset({
                name: initialData?.name || '',
                short_name: initialData?.short_name || ''
            })
        }
    }, [isOpen, initialData, reset])

    const handleFormSubmit = async (data: UnitFormData) => {
        try {
            if (initialData) {
                updateUnitMutation.mutate({
                    id: initialData.id,
                    unitData: {
                        name: data.name,
                        short_name: data.short_name
                    }
                }, {
                    onSuccess: () => {
                        onClose()
                        reset()
                    }
                })
            } else {
                createUnitMutation.mutate({
                    name: data.name,
                    short_name: data.short_name
                }, {
                    onSuccess: () => {
                        onClose()
                        reset()
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
            title={initialData ? 'Edit Unit' : 'Add Unit'}
            description={initialData ? 'Update unit information' : 'Add a new product unit'}
            bodyClassName='p-5'
            footer={
                <Button
                    size='sm'
                    type='submit'
                    className='h-10 px-6'
                    color="primary"
                    isLoading={isSubmitting || createUnitMutation.isPending || updateUnitMutation.isPending}
                    onPress={() => {
                        const form = document.querySelector('form')
                        if (form) {
                            form.requestSubmit()
                        }
                    }}>
                    {initialData ? 'Update Unit' : 'Save Unit'}
                </Button>
            }>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-4">
                <Input
                    label={createInputLabel({
                        name: "Name",
                        required: true
                    })}
                    placeholder="Kilogram"
                    {...register('name')}
                    error={errors.name?.message as string}
                />
                <p className="text-xs text-gray-500 -mt-3.5">
                    Full name of the unit (e.g., "Kilogram", "Meter")
                </p>

                <Input
                    label={createInputLabel({
                        name: "Short Name",
                        required: true
                    })}
                    placeholder="kg"
                    {...register('short_name')}
                    error={errors.short_name?.message as string}
                />
                <p className="text-xs text-gray-500 -mt-3.5">
                    Abbreviated form (e.g., "kg", "m")
                </p>
            </form>

        </PopupModal>
    )
}

export default AddUnitModal

