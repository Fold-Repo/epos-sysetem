'use client'

import { createInputLabel, Input, PopupModal, TextArea, CustomAutocomplete } from '@/components'
import { Button } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ExpenseType } from '@/types'
import { useEffect } from 'react'
import { useToast } from '@/hooks'
import { usersData } from '@/data'
import { expenseCategoriesData } from '@/data'

// =========================
// VALIDATION SCHEMA
// =========================
const expenseSchema = yup.object({
    userId: yup.string().optional().default(''),
    expenseTitle: yup
        .string()
        .required('Expense title is required')
        .min(2, 'Expense title must be at least 2 characters')
        .max(100, 'Expense title must not exceed 100 characters'),
    expenseCategoryId: yup
        .string()
        .required('Expense category is required'),
    amount: yup
        .string()
        .required('Amount is required')
        .test('is-positive', 'Amount must be greater than 0', (value) => {
            if (!value) return false
            const numValue = parseFloat(value.replace(/,/g, ''))
            return !isNaN(numValue) && numValue > 0
        }),
    details: yup.string().optional().default('').max(500, 'Details must not exceed 500 characters'),
}).required()

type ExpenseFormData = yup.InferType<typeof expenseSchema>

interface ExpenseModalProps {
    isOpen: boolean
    onClose: () => void
    mode?: 'add' | 'edit'
    initialData?: ExpenseType
}

const ExpenseModal = ({
    isOpen,
    onClose,
    mode = 'add',
    initialData
}: ExpenseModalProps) => {

    const { showSuccess } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue
    } = useForm<ExpenseFormData>({
        resolver: yupResolver(expenseSchema),
        mode: 'onChange',
        defaultValues: {
            userId: initialData?.userId || '',
            expenseTitle: initialData?.expenseTitle || '',
            expenseCategoryId: initialData?.expenseCategoryId || '',
            amount: initialData?.amount ? String(initialData.amount) : '',
            details: ''
        }
    })

    useEffect(() => {
        if (isOpen) {
            reset({
                userId: initialData?.userId || '',
                expenseTitle: initialData?.expenseTitle || '',
                expenseCategoryId: initialData?.expenseCategoryId || '',
                amount: initialData?.amount ? String(initialData.amount) : '',
                details: ''
            })
        }
    }, [isOpen, initialData, reset])

    const handleFormSubmit = async (data: ExpenseFormData) => {
        try {
            if (mode === 'edit' && initialData) {
                console.log('Update expense:', initialData.id, data)
                showSuccess('Expense updated', 'Expense updated successfully.')
            } else {
                console.log('Create expense:', data)
                showSuccess('Expense created', 'Expense created successfully.')
            }
            onClose()
            reset()
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    const userOptions = usersData
        .filter(user => user.id !== undefined)
        .map(user => ({
            value: String(user.id!),
            label: user.name
        }))

    const categoryOptions = expenseCategoriesData
        .filter(category => category.id !== undefined)
        .map(category => ({
            value: String(category.id!),
            label: category.name
        }))

    return (
        <PopupModal
            size="5xl"
            radius="2xl"
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            className='max-h-[95vh]'
            title={mode === 'edit' ? 'Edit Expense' : 'Add Expense'}
            description={mode === 'edit' ? 'Update expense information' : 'Add a new expense'}
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
                    {mode === 'edit' ? 'Update Expense' : 'Save Expense'}
                </Button>
            }>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-4">
                        <Input
                            label={createInputLabel({
                                name: "Expense Title",
                                required: true
                            })}
                            placeholder="Enter Expense Title"
                            {...register('expenseTitle')}
                            error={errors.expenseTitle?.message as string}
                        />

                        <CustomAutocomplete
                            name="expenseCategoryId"
                            label={createInputLabel({
                                name: "Expense Category",
                                required: true
                            })}
                            placeholder="Choose Expense Category"
                            radius="lg"
                            inputSize="sm"
                            options={categoryOptions}
                            value={watch('expenseCategoryId')}
                            onChange={(value) => {
                                if (typeof value === 'string') {
                                    setValue('expenseCategoryId', value)
                                }
                            }}
                            error={errors.expenseCategoryId?.message as string}
                        />

                        <Input
                            label={createInputLabel({
                                name: "Amount",
                                required: true
                            })}
                            placeholder="Enter Amount"
                            type="text"
                            isCurrency={true}
                            {...register('amount')}
                            error={errors.amount?.message as string}
                        />
                    </div>

                    <div className="space-y-4">
                        <CustomAutocomplete
                            name="userId"
                            label="User:"
                            placeholder="Select User"
                            radius="lg"
                            inputSize="sm"
                            options={userOptions}
                            value={watch('userId')}
                            onChange={(value) => {
                                if (typeof value === 'string') {
                                    setValue('userId', value)
                                }
                            }}
                            error={errors.userId?.message as string}
                        />

                        <TextArea
                            label="Details:"
                            placeholder="Enter Details"
                            {...register('details')}
                            error={errors.details?.message as string}
                            rows={4}
                        />
                    </div>

                </div>

            </form>

        </PopupModal>
    )
}

export default ExpenseModal

