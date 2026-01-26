'use client'

import { createInputLabel, Input, TextArea, PopupModal } from '@/components'
import { Button, Switch } from '@heroui/react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ExpenseCategory } from '@/types'
import { useEffect } from 'react'
import { useCreateExpenseCategory, useUpdateExpenseCategory } from '@/services'

// =========================
// VALIDATION SCHEMA
// =========================
const expenseCategorySchema = yup.object({
    name: yup
        .string()
        .required('Category name is required')
        .min(2, 'Category name must be at least 2 characters')
        .max(50, 'Category name must not exceed 50 characters'),
    description: yup
        .string()
        .required('Description is required')
        .min(2, 'Description must be at least 2 characters')
        .max(255, 'Description must not exceed 255 characters'),
    is_active: yup
        .boolean()
        .required('Active status is required'),
}).required()

type ExpenseCategoryFormData = yup.InferType<typeof expenseCategorySchema>

interface ExpensesModalProps {
    isOpen: boolean
    onClose: () => void
    mode?: 'add' | 'edit'
    initialData?: ExpenseCategory
}

const ExpensesModal = ({ 
    isOpen, 
    onClose, 
    mode = 'add',
    initialData
}: ExpensesModalProps) => {

    const createMutation = useCreateExpenseCategory()
    const updateMutation = useUpdateExpenseCategory()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset
    } = useForm<ExpenseCategoryFormData>({
        resolver: yupResolver(expenseCategorySchema),
        mode: 'onChange',
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || '',
            is_active: initialData?.is_active ?? true
        }
    })

    useEffect(() => {
        if (isOpen) {
            reset({
                name: initialData?.name || '',
                description: initialData?.description || '',
                is_active: initialData?.is_active ?? true
            })
        }
    }, [isOpen, initialData, reset])

    const handleFormSubmit = async (data: ExpenseCategoryFormData) => {
        try {
            if (mode === 'edit' && initialData) {
                updateMutation.mutate(
                    { id: initialData.id, categoryData: data },
                    {
                        onSuccess: () => {
                            onClose()
                            reset()
                        }
                    }
                )
            } else {
                createMutation.mutate(data, {
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

    const isLoading = isSubmitting || createMutation.isPending || updateMutation.isPending

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
                    isLoading={isLoading}
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
                <TextArea
                    label={createInputLabel({
                        name: "Description",
                        required: true
                    })}
                    placeholder="Office and stationery items"
                    {...register('description')}
                    error={errors.description?.message as string}
                    rows={4}
                />
                <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">
                        Active Status
                    </label>
                    <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                size="sm"
                                color="primary"
                                isSelected={field.value}
                                onValueChange={field.onChange}
                            />
                        )}
                    />
                </div>
            </form>

        </PopupModal>
    )
}

export default ExpensesModal
