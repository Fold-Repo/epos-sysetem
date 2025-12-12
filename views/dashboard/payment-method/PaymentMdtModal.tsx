'use client'

import { createInputLabel, Input, PopupModal } from '@/components'
import { Button } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { PaymentMethodType } from '@/types'
import { useEffect } from 'react'
import { useToast } from '@/hooks'

// =========================
// VALIDATION SCHEMA
// =========================
const paymentMethodSchema = yup.object({
    name: yup
        .string()
        .required('Payment method name is required')
        .min(2, 'Payment method name must be at least 2 characters')
        .max(50, 'Payment method name must not exceed 50 characters'),
}).required()

type PaymentMethodFormData = yup.InferType<typeof paymentMethodSchema>

interface PaymentMdtModalProps {
    isOpen: boolean
    onClose: () => void
    mode?: 'add' | 'edit'
    initialData?: PaymentMethodType
}

const PaymentMdtModal = ({
    isOpen,
    onClose,
    mode = 'add',
    initialData
}: PaymentMdtModalProps) => {

    const { showSuccess } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<PaymentMethodFormData>({
        resolver: yupResolver(paymentMethodSchema),
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

    const handleFormSubmit = async (data: PaymentMethodFormData) => {
        try {
            if (mode === 'edit' && initialData) {
                console.log('Update payment method:', initialData.id, data)
                showSuccess('Payment method updated', 'Payment method updated successfully.')
            } else {
                console.log('Create payment method:', data)
                showSuccess('Payment method created', 'Payment method created successfully.')
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
            title={mode === 'edit' ? 'Edit Payment Method' : 'Add Payment Method'}
            description={mode === 'edit' ? 'Update payment method information' : 'Add a new payment method'}
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
                    {mode === 'edit' ? 'Update Payment Method' : 'Save Payment Method'}
                </Button>
            }>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-4">
                <Input
                    label={createInputLabel({
                        name: "Name",
                        required: true
                    })}
                    placeholder="Cash"
                    {...register('name')}
                    error={errors.name?.message as string}
                />
            </form>

        </PopupModal>
    )
}

export default PaymentMdtModal
