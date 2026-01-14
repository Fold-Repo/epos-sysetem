'use client'

import { createInputLabel, Input, PopupModal, TextArea, PhoneInput } from '@/components'
import { Button } from '@heroui/react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CustomerType, CreateCustomerPayload } from '@/types'
import { useEffect } from 'react'
import { customerSchema, CustomerFormData } from '@/schema'
import { useCreateCustomer, useUpdateCustomer } from '@/services'
import { useAppDispatch } from '@/store/hooks'
import { fetchCustomers } from '@/store/slice'

interface CustomerModalProps {
    isOpen: boolean
    onClose: () => void
    mode?: 'add' | 'edit'
    initialData?: CustomerType
}

const CustomerModal = ({
    isOpen,
    onClose,
    mode = 'add',
    initialData
}: CustomerModalProps) => {

    const dispatch = useAppDispatch()
    const createCustomerMutation = useCreateCustomer()
    const updateCustomerMutation = useUpdateCustomer()

    const isLoading = createCustomerMutation.isPending || updateCustomerMutation.isPending

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm<CustomerFormData>({
        resolver: yupResolver(customerSchema),
        mode: 'onChange',
        defaultValues: {
            name: initialData?.name || '',
            email: initialData?.email || '',
            phone: initialData?.phone || initialData?.phonenumber || '',
            country: initialData?.country || '',
            city: initialData?.city || '',
            address: initialData?.address || ''
        }
    })

    useEffect(() => {
        if (isOpen) {
            reset({
                name: initialData?.name || '',
                email: initialData?.email || '',
                phone: initialData?.phone || initialData?.phonenumber || '',
                country: initialData?.country || '',
                city: initialData?.city || '',
                address: initialData?.address || ''
            })
        }
    }, [isOpen, initialData, reset])

    const handleFormSubmit = async (data: CustomerFormData) => {
        const payload: CreateCustomerPayload = {
            name: data.name,
            email: data.email || undefined,
            phonenumber: data.phone || undefined,
            country: data.country || undefined,
            city: data.city || undefined,
            address: data.address || undefined
        }

        try {
            if (mode === 'edit' && initialData) {
                const customerId = initialData.customer_id || initialData.id
                await updateCustomerMutation.mutateAsync({ 
                    id: Number(customerId), 
                    payload 
                })
            } else {
                await createCustomerMutation.mutateAsync(payload)
            }
            // Refresh Redux state after successful mutation
            dispatch(fetchCustomers())
            onClose()
            reset()
        } catch (error) {
            // Error is handled by the mutation
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
            title={mode === 'edit' ? 'Edit Customer' : 'Add Customer'}
            description={mode === 'edit' ? 'Update customer information' : 'Add a new customer'}
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
                    {mode === 'edit' ? 'Update Customer' : 'Save Customer'}
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
                            placeholder="Enter Customer Name"
                            {...register('name')}
                            error={errors.name?.message as string}
                        />

                        <Input
                            label="Email:"
                            type="email"
                            placeholder="Enter Email"
                            {...register('email')}
                            error={errors.email?.message as string}
                        />

                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <PhoneInput
                                    label="Phone:"
                                    placeholder="Enter Phone"
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    error={errors.phone?.message as string}
                                />
                            )}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <Input
                            label="Country:"
                            placeholder="Enter Country"
                            {...register('country')}
                            error={errors.country?.message as string}
                        />

                        <Input
                            label="City:"
                            placeholder="Enter City"
                            {...register('city')}
                            error={errors.city?.message as string}
                        />

                        <TextArea
                            label="Address:"
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

export default CustomerModal
