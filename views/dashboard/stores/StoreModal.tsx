'use client'

import { createInputLabel, Input, PopupModal } from '@/components'
import { Button } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { StoreType } from '@/types'
import { useEffect } from 'react'
import { useToast } from '@/hooks'

// =========================
// VALIDATION SCHEMA
// =========================
const storeSchema = yup.object({
    name: yup
        .string()
        .required('Store name is required')
        .min(2, 'Store name must be at least 2 characters')
        .max(100, 'Store name must not exceed 100 characters'),
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

    const { showSuccess } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<StoreFormData>({
        resolver: yupResolver(storeSchema),
        mode: 'onChange',
        defaultValues: {
            name: initialData?.name || ''
        }
    })

    useEffect(() => {
        if (isOpen) {
            reset({
                name: initialData?.name || ''
            })
        }
    }, [isOpen, initialData, reset])

    const handleFormSubmit = async (data: StoreFormData) => {
        try {
            if (mode === 'edit' && initialData) {
                console.log('Update store:', initialData.id, data)
                showSuccess('Store updated', 'Store updated successfully.')
            } else {
                console.log('Create store:', data)
                showSuccess('Store created', 'Store created successfully.')
            }
            onClose()
            reset()
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
                    isLoading={isSubmitting}
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
            </form>

        </PopupModal>
    )
}

export default StoreModal

