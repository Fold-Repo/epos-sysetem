'use client'

import { createInputLabel, Input, PopupModal } from '@/components'
import { Button } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Brand } from '@/types/brand.type'
import { useEffect } from 'react'
import { useCreateBrand, useUpdateBrand } from '@/services'

// =========================
// VALIDATION SCHEMA
// =========================
const brandSchema = yup.object({
    name: yup
        .string()
        .required('Brand name is required')
        .min(2, 'Brand name must be at least 2 characters')
        .max(100, 'Brand name must not exceed 100 characters'),
    short_name: yup
        .string()
        .required('Short name is required')
        .min(1, 'Short name must be at least 1 character')
        .max(50, 'Short name must not exceed 50 characters'),
}).required()

type BrandFormData = yup.InferType<typeof brandSchema>

interface AddBrandModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: Brand
}

const AddBrandModal = ({ isOpen, onClose, initialData }: AddBrandModalProps) => {
    const createBrandMutation = useCreateBrand()
    const updateBrandMutation = useUpdateBrand()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<BrandFormData>({
        resolver: yupResolver(brandSchema),
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

    const handleFormSubmit = async (data: BrandFormData) => {
        try {
            if (initialData) {
                updateBrandMutation.mutate({
                    id: initialData.id,
                    brandData: {
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
                createBrandMutation.mutate({
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
            title={initialData ? 'Edit Brand' : 'Add Brand'}
            description={initialData ? 'Update brand information' : 'Add a new product brand'}
            bodyClassName='p-5'
            footer={
                <Button
                    size='sm'
                    type='submit'
                    className='h-10 px-6'
                    color="primary"
                    isLoading={isSubmitting || createBrandMutation.isPending || updateBrandMutation.isPending}
                    onPress={() => {
                        const form = document.querySelector('form')
                        if (form) {
                            form.requestSubmit()
                        }
                    }}>
                    {initialData ? 'Update Brand' : 'Save Brand'}
                </Button>
            }>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-4">
                <Input
                    label={createInputLabel({
                        name: "Brand Name",
                        required: true
                    })}
                    placeholder="Enter brand name (e.g., Nike)"
                    {...register('name')}
                    error={errors.name?.message as string}
                />

                <Input
                    label={createInputLabel({
                        name: "Short Name",
                        required: true
                    })}
                    placeholder="Enter short name (e.g., Nike fashion)"
                    {...register('short_name')}
                    error={errors.short_name?.message as string}
                />
            </form>

        </PopupModal>
    )
}

export default AddBrandModal

