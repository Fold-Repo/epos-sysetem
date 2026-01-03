'use client'

import { createInputLabel, Input, PopupModal, TextArea, PhoneInput } from '@/components'
import { Button } from '@heroui/react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Supplier } from '@/types/supplier.type'
import { useEffect } from 'react'
import { supplierSchema, SupplierFormData } from '@/schema'
import { useCreateSupplier, useUpdateSupplier } from '@/services'

interface SupplierModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: Supplier
}

const SupplierModal = ({
    isOpen,
    onClose,
    initialData
}: SupplierModalProps) => {

    const createSupplierMutation = useCreateSupplier()
    const updateSupplierMutation = useUpdateSupplier()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset
    } = useForm<SupplierFormData>({
        resolver: yupResolver(supplierSchema),
        mode: 'onChange',
        defaultValues: {
            name: initialData?.name || '',
            email: initialData?.email || '',
            phone: initialData?.phone || '',
            address: initialData?.address || ''
        }
    })

    useEffect(() => {
        if (isOpen) {
            reset({
                name: initialData?.name || '',
                email: initialData?.email || '',
                phone: initialData?.phone || '',
                address: initialData?.address || ''
            })
        }
    }, [isOpen, initialData, reset])

    const handleFormSubmit = async (data: SupplierFormData) => {
        try {
            const payload = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address
            }

            if (initialData) {
                updateSupplierMutation.mutate({
                    id: initialData.supplier_id,
                    supplierData: payload
                }, {
                    onSuccess: () => {
                        onClose()
                        reset()
                    }
                })
            } else {
                createSupplierMutation.mutate(payload, {
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
            size="5xl"
            radius="2xl"
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            className='max-h-[95vh]'
            title={initialData ? 'Edit Supplier' : 'Add Supplier'}
            description={initialData ? 'Update supplier information' : 'Add a new supplier'}
            bodyClassName='p-5'
            footer={
                <Button
                    size='sm'
                    type='submit'
                    className='h-10 px-6'
                    color="primary"
                    isLoading={isSubmitting || createSupplierMutation.isPending || updateSupplierMutation.isPending}
                    onPress={() => {
                        const form = document.querySelector('form')
                        if (form) {
                            form.requestSubmit()
                        }
                    }}>
                    {initialData ? 'Update Supplier' : 'Save Supplier'}
                </Button>
            }>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <Input
                            label={createInputLabel({
                                name: "Name",
                                required: true
                            })}
                            placeholder="Enter Supplier Name"
                            {...register('name')}
                            error={errors.name?.message as string}
                        />

                        <Input
                            label={createInputLabel({
                                name: "Email",
                                required: true
                            })}
                            type="email"
                            placeholder="Enter Email"
                            {...register('email')}
                            error={errors.email?.message as string}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <PhoneInput
                                    label={createInputLabel({
                                        name: "Phone",
                                        required: true
                                    })}
                                    placeholder="Enter Phone"
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    error={errors.phone?.message as string}
                                />
                            )}
                        />

                        <TextArea
                            label={createInputLabel({
                                name: "Address",
                                required: true
                            })}
                            placeholder="Enter Address"
                            {...register('address')}
                            error={errors.address?.message as string}
                            rows={4}
                        />
                    </div>
                </div>
            </form>

        </PopupModal>
    )
}

export default SupplierModal

