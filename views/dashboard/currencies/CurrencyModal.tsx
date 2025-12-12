'use client'

import { createInputLabel, Input, PopupModal } from '@/components'
import { Button } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { CurrencyType } from '@/types'
import { useEffect } from 'react'
import { useToast } from '@/hooks'

// =========================
// VALIDATION SCHEMA
// =========================
const currencySchema = yup.object({
    name: yup
        .string()
        .required('Currency name is required')
        .min(2, 'Currency name must be at least 2 characters')
        .max(50, 'Currency name must not exceed 50 characters'),
    code: yup
        .string()
        .required('Currency code is required')
        .length(3, 'Currency code must be exactly 3 characters')
        .uppercase(),
    symbol: yup
        .string()
        .required('Currency symbol is required')
        .max(5, 'Currency symbol must not exceed 5 characters'),
}).required()

type CurrencyFormData = yup.InferType<typeof currencySchema>

interface CurrencyModalProps {
    isOpen: boolean
    onClose: () => void
    mode?: 'add' | 'edit'
    initialData?: CurrencyType
}

const CurrencyModal = ({
    isOpen,
    onClose,
    mode = 'add',
    initialData
}: CurrencyModalProps) => {

    const { showSuccess } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<CurrencyFormData>({
        resolver: yupResolver(currencySchema),
        mode: 'onChange',
        defaultValues: {
            name: initialData?.name || '',
            code: initialData?.code || '',
            symbol: initialData?.symbol || ''
        }
    })

    useEffect(() => {
        if (isOpen) {
            reset({
                name: initialData?.name || '',
                code: initialData?.code || '',
                symbol: initialData?.symbol || ''
            })
        }
    }, [isOpen, initialData, reset])

    const handleFormSubmit = async (data: CurrencyFormData) => {
        try {
            if (mode === 'edit' && initialData) {
                console.log('Update currency:', initialData.id, data)
                showSuccess('Currency updated', 'Currency updated successfully.')
            } else {
                console.log('Create currency:', data)
                showSuccess('Currency created', 'Currency created successfully.')
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
            title={mode === 'edit' ? 'Edit Currency' : 'Add Currency'}
            description={mode === 'edit' ? 'Update currency information' : 'Add a new currency'}
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
                    {mode === 'edit' ? 'Update Currency' : 'Save Currency'}
                </Button>
            }>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-4">
                <Input
                    label={createInputLabel({
                        name: "Name",
                        required: true
                    })}
                    placeholder="US Dollar"
                    {...register('name')}
                    error={errors.name?.message as string}
                />

                <Input
                    label={createInputLabel({
                        name: "Code",
                        required: true
                    })}
                    placeholder="USD"
                    maxLength={3}
                    {...register('code', {
                        onChange: (e) => {
                            e.target.value = e.target.value.toUpperCase()
                        }
                    })}
                    error={errors.code?.message as string}
                />

                <Input
                    label={createInputLabel({
                        name: "Symbol",
                        required: true
                    })}
                    placeholder="$"
                    maxLength={5}
                    {...register('symbol')}
                    error={errors.symbol?.message as string}
                />
            </form>

        </PopupModal>
    )
}

export default CurrencyModal

