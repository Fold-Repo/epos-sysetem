'use client'

import { createInputLabel, Input, PopupModal, TextArea } from '@/components'
import { Button } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { StoreType } from '@/types'
import { useEffect } from 'react'
import { useCreateStore, useUpdateStore } from '@/services'

// =========================
// VALIDATION SCHEMA
// =========================
const storeSchema = yup.object({
    name: yup
        .string()
        .required('Store name is required')
        .min(2, 'Store name must be at least 2 characters')
        .max(100, 'Store name must not exceed 100 characters'),
    description: yup
        .string()
        .required('Description is required')
        .min(3, 'Description must be at least 3 characters')
        .max(500, 'Description must not exceed 500 characters'),
}).required()

type StoreFormData = yup.InferType<typeof storeSchema>

interface StoreModalProps {
    isOpen: boolean
    onClose: () => void
    mode?: 'add' | 'edit'
    initialData?: StoreType
}

const StoreModal = ({
    isOpen,
    onClose,
    mode = 'add',
    initialData
}: StoreModalProps) => {

    const createStoreMutation = useCreateStore()
    const updateStoreMutation = useUpdateStore()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<StoreFormData>({
        resolver: yupResolver(storeSchema),
        mode: 'onChange',
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || ''
        }
    })

    useEffect(() => {
        if (isOpen) {
            reset({
                name: initialData?.name || '',
                description: initialData?.description || ''
            })
        }
    }, [isOpen, initialData, reset])

    const handleFormSubmit = async (data: StoreFormData) => {
        try {
            if (mode === 'edit' && initialData?.id) {
                updateStoreMutation.mutate({
                    id: Number(initialData.id),
                    storeData: {
                        name: data.name,
                        description: data.description
                    }
                }, {
                    onSuccess: () => {
                        onClose()
                        reset()
                    }
                })
            } else {
                createStoreMutation.mutate({
                    name: data.name,
                    description: data.description
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
            title={mode === 'edit' ? 'Edit Store' : 'Add Store'}
            description={mode === 'edit' ? 'Update store information' : 'Add a new store'}
            bodyClassName='p-5'
            footer={
                <Button
                    size='sm'
                    type='submit'
                    className='h-10 px-6'
                    color="primary"
                    isLoading={isSubmitting || createStoreMutation.isPending || updateStoreMutation.isPending}
                    onPress={() => {
                        const form = document.querySelector('form')
                        if (form) {
                            form.requestSubmit()
                        }
                    }}>
                    {mode === 'edit' ? 'Update Store' : 'Save Store'}
                </Button>
            }>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-4">
                <Input
                    label={createInputLabel({
                        name: "Name",
                        required: true
                    })}
                    placeholder="Enter Store Name"
                    {...register('name')}
                    error={errors.name?.message as string}
                />
                <TextArea
                    label={createInputLabel({
                        name: "Description",
                        required: true
                    })}
                    placeholder="Enter store description"
                    {...register('description')}
                    error={errors.description?.message as string}
                />
            </form>

        </PopupModal>
    )
}

export default StoreModal

