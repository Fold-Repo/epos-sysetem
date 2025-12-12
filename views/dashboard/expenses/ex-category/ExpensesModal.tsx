'use client'

import { createInputLabel, Input, PopupModal } from '@/components'
import { Button } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ExpenseCategoryType } from '@/types'
import { useEffect } from 'react'
import { useToast } from '@/hooks'

// =========================
// VALIDATION SCHEMA
// =========================
const expenseCategorySchema = yup.object({
    name: yup
        .string()
        .required('Category name is required')
        .min(2, 'Category name must be at least 2 characters')
        .max(50, 'Category name must not exceed 50 characters'),
}).required()

type ExpenseCategoryFormData = yup.InferType<typeof expenseCategorySchema>

interface ExpensesModalProps {
    isOpen: boolean
    onClose: () => void
    mode?: 'add' | 'edit'
    initialData?: ExpenseCategoryType
}

const ExpensesModal = ({ 
    isOpen, 
    onClose, 
    mode = 'add',
    initialData
}: ExpensesModalProps) => {

    const { showSuccess } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<ExpenseCategoryFormData>({
        resolver: yupResolver(expenseCategorySchema),
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

    const handleFormSubmit = async (data: ExpenseCategoryFormData) => {
        try {
            if (mode === 'edit' && initialData) {
                console.log('Update expense category:', initialData.id, data)
                showSuccess('Expense category updated', 'Expense category updated successfully.')
            } else {
                console.log('Create expense category:', data)
                showSuccess('Expense category created', 'Expense category created successfully.')
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
            title={mode === 'edit' ? 'Edit Expense Category' : 'Add Expense Category'}
            description={mode === 'edit' ? 'Update expense category information' : 'Add a new expense category'}
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
                    {mode === 'edit' ? 'Update Category' : 'Save Category'}
                </Button>
            }>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-4">
                <Input
                    label={createInputLabel({
                        name: "Name",
                        required: true
                    })}
                    placeholder="Office Supplies"
                    {...register('name')}
                    error={errors.name?.message as string}
                />
            </form>

        </PopupModal>
    )
}

export default ExpensesModal
