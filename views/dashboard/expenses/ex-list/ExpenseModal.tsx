'use client'

import { createInputLabel, createFileLabel, Input, PopupModal, TextArea, CustomAutocomplete, FileUpload, Select } from '@/components'
import { Button } from '@heroui/react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Expense, UPLOAD_FOLDER } from '@/types'
import { useEffect, useMemo, useState } from 'react'
import { useCreateExpense, useUpdateExpense, uploadImage } from '@/services'
import { useAppSelector, selectActiveExpenseCategories, selectStores, selectPaymentMethods } from '@/store'

// =========================
// VALIDATION SCHEMA
// =========================
const expenseSchema = yup.object({
    title: yup
        .string()
        .required('Expense title is required')
        .min(2, 'Expense title must be at least 2 characters')
        .max(100, 'Expense title must not exceed 100 characters'),
    category_id: yup
        .number()
        .required('Expense category is required')
        .positive('Category is required'),
    amount: yup
        .number()
        .required('Amount is required')
        .positive('Amount must be greater than 0'),
    expense_date: yup
        .string()
        .required('Expense date is required'),
    notes: yup
        .string()
        .required('Notes is required')
        .min(2, 'Notes must be at least 2 characters')
        .max(500, 'Notes must not exceed 500 characters'),
    payment_method: yup
        .string()
        .required('Payment method is required'),
    vendor: yup
        .string()
        .required('Vendor is required')
        .min(2, 'Vendor must be at least 2 characters')
        .max(100, 'Vendor must not exceed 100 characters'),
    receipt_url: yup
        .string()
        .url('Must be a valid URL')
        .nullable()
        .notRequired(),
    receiptFile: yup
        .mixed<FileList>()
        .nullable()
        .notRequired(),
    store_id: yup
        .number()
        .required('Store is required')
        .positive('Store is required'),
    status: yup
        .string()
        .oneOf(['pending', 'approved', 'rejected'], 'Invalid status')
        .optional()
        .default('pending'),
})

type ExpenseFormData = {
    title: string
    category_id: number
    amount: number
    expense_date: string
    notes: string
    payment_method: string
    vendor: string
    receipt_url?: string | null
    receiptFile?: FileList | null
    store_id: number
    status?: 'pending' | 'approved' | 'rejected'
}

interface ExpenseModalProps {
    isOpen: boolean
    onClose: () => void
    mode?: 'add' | 'edit'
    initialData?: Expense
}

const ExpenseModal = ({
    isOpen,
    onClose,
    mode = 'add',
    initialData
}: ExpenseModalProps) => {

    const createMutation = useCreateExpense()
    const updateMutation = useUpdateExpense()

    // Get data from Redux state
    const activeCategories = useAppSelector(selectActiveExpenseCategories)
    const stores = useAppSelector(selectStores)
    const paymentMethods = useAppSelector(selectPaymentMethods)

    const [isUploading, setIsUploading] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue
    } = useForm<ExpenseFormData>({
        resolver: yupResolver(expenseSchema) as any,
        mode: 'onChange',
        defaultValues: {
            title: initialData?.title || '',
            category_id: initialData?.category_id || undefined,
            amount: initialData?.amount || undefined,
            expense_date: initialData?.expense_date ? new Date(initialData.expense_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            notes: initialData?.notes || '',
            payment_method: initialData?.payment_method || '',
            vendor: initialData?.vendor || '',
            receipt_url: initialData?.receipt_url || '',
            store_id: initialData?.store_id || undefined,
            status: (initialData?.status as 'pending' | 'approved' | 'rejected') || 'pending',
            receiptFile: null
        }
    })

    useEffect(() => {
        if (isOpen && initialData) {
            const dateStr = initialData.expense_date ? new Date(initialData.expense_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            reset({
                title: initialData.title || '',
                category_id: initialData.category_id || undefined,
                amount: initialData.amount || undefined,
                expense_date: dateStr,
                notes: initialData.notes || '',
                payment_method: initialData.payment_method || '',
                vendor: initialData.vendor || '',
                receipt_url: initialData.receipt_url || '',
                store_id: initialData.store_id || undefined,
                status: (initialData.status as 'pending' | 'approved' | 'rejected') || 'pending',
                receiptFile: null
            })
        } else if (isOpen) {
            const today = new Date().toISOString().split('T')[0]
            reset({
                title: '',
                category_id: undefined,
                amount: undefined,
                expense_date: today,
                notes: '',
                payment_method: '',
                vendor: '',
                receipt_url: '',
                store_id: undefined,
                status: 'pending',
                receiptFile: null
            })
        }
    }, [isOpen, initialData, reset])

    // Build options
    const categoryOptions = useMemo(() => {
        return activeCategories.map(cat => ({
            value: String(cat.id),
            label: cat.name
        }))
    }, [activeCategories])

    const storeOptions = useMemo(() => {
        return stores
            .filter(s => s.store_id !== undefined)
            .map(s => ({
                value: String(s.store_id),
                label: s.name
            }))
    }, [stores])

    const paymentMethodOptions = useMemo(() => {
        return paymentMethods.map(pm => ({
            value: pm.name,
            label: pm.name.charAt(0).toUpperCase() + pm.name.slice(1)
        }))
    }, [paymentMethods])

    const handleFormSubmit = async (data: ExpenseFormData) => {
        try {
            let receiptUrl = data.receipt_url || undefined

            if (data.receiptFile && data.receiptFile instanceof FileList && data.receiptFile.length > 0) {
                setIsUploading(true)
                try {
                    const uploadedFiles = await uploadImage({
                        images: data.receiptFile as FileList,
                        folders: UPLOAD_FOLDER.EXPENSES
                    })
                    if (uploadedFiles && uploadedFiles.length > 0) {
                        receiptUrl = uploadedFiles[0].url
                    }
                } catch (error: any) {
                    setIsUploading(false)
                    return
                } finally {
                    setIsUploading(false)
                }
            }

            const payload = {
                title: data.title,
                category_id: data.category_id,
                amount: data.amount,
                expense_date: data.expense_date, 
                notes: data.notes,
                payment_method: data.payment_method,
                vendor: data.vendor,
                receipt_url: receiptUrl,
                store_id: data.store_id,
                status: data.status || 'pending'
            }

            if (mode === 'edit' && initialData) {
                updateMutation.mutate(
                    { id: initialData.expense_id, expenseData: payload },
                    {
                        onSuccess: () => {
                            onClose()
                            reset()
                        }
                    }
                )
            } else {
                createMutation.mutate(payload, {
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

    const isLoading = isSubmitting || isUploading || createMutation.isPending || updateMutation.isPending

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
                    isLoading={isLoading}
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
                            placeholder="Office Supplies Purchase"
                            {...register('title')}
                            error={errors.title?.message as string}
                        />

                        <CustomAutocomplete
                            name="category_id"
                            label={createInputLabel({
                                name: "Expense Category",
                                required: true
                            })}
                            placeholder="Choose Expense Category"
                            radius="lg"
                            inputSize="sm"
                            options={categoryOptions}
                            value={watch('category_id') ? String(watch('category_id')) : ''}
                            onChange={(value) => {
                                if (typeof value === 'string') {
                                    setValue('category_id', parseInt(value), { shouldValidate: true })
                                }
                            }}
                            error={errors.category_id?.message as string}
                        />

                        <Input
                            label={createInputLabel({
                                name: "Amount",
                                required: true
                            })}
                            placeholder="Enter Amount"
                            type="number"
                            step="0.01"
                            {...register('amount', { valueAsNumber: true })}
                            error={errors.amount?.message as string}
                        />

                        <Input
                            label={createInputLabel({
                                name: "Expense Date",
                                required: true
                            })}
                            placeholder="Select Date"
                            type="date"
                            {...register('expense_date')}
                            error={errors.expense_date?.message as string}
                        />

                        <Controller
                            name="store_id"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Select
                                    label={createInputLabel({
                                        name: "Store",
                                        required: true
                                    })}
                                    name="store_id"
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        const value = e.target.value ? parseInt(e.target.value) : undefined
                                        field.onChange(value)
                                    }}
                                    onBlur={field.onBlur}
                                    error={fieldState.error?.message as string}
                                    radius="lg">
                                    <option value="" disabled>Select Store</option>
                                    {storeOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-4">
                        <Select
                            label={createInputLabel({
                                name: "Payment Method",
                                required: true
                            })}
                            {...register('payment_method')}
                            error={errors.payment_method?.message as string}
                            radius="lg">
                            <option value="" disabled>Select Payment Method</option>
                            {paymentMethodOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </Select>

                        <Input
                            label={createInputLabel({
                                name: "Vendor",
                                required: true
                            })}
                            placeholder="Office Depot"
                            {...register('vendor')}
                            error={errors.vendor?.message as string}
                        />

                        <Controller
                            name="receiptFile"
                            control={control}
                            render={({ field, fieldState }) => (
                                <FileUpload
                                    formGroupClass='w-full'
                                    className='h-32'
                                    name="receiptFile"
                                    label={createFileLabel({
                                        name: "Receipt Image",
                                        required: false
                                    })}
                                    maxFileSize={5}
                                    acceptedFileTypes={['jpg', 'jpeg', 'png', 'webp', 'pdf']}
                                    accept="image/*,.pdf"
                                    multiple={false}
                                    value={field.value as FileList | null}
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            field.onChange(e.target.files)
                                        }
                                    }}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                        {initialData?.receipt_url && !watch('receiptFile') && (
                            <div className="text-xs text-gray-500">
                                Current receipt: <a href={initialData.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Receipt</a>
                            </div>
                        )}

                        <Select
                            label={createInputLabel({
                                name: "Status",
                                required: false
                            })}
                            {...register('status')}
                            error={errors.status?.message as string}
                            radius="lg">
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </Select>

                        <TextArea
                            label={createInputLabel({
                                name: "Notes",
                                required: true
                            })}
                            placeholder="Purchased pens, paper, and folders"
                            {...register('notes')}
                            error={errors.notes?.message as string}
                            rows={4}
                        />
                    </div>

                </div>
            </form>

        </PopupModal>
    )
}

export default ExpenseModal
