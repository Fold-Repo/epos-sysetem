'use client'

import { createInputLabel, Input, TextArea, PhoneInput, CustomAutocomplete, PasswordInput, ProfilePictureUpload, createFileLabel } from '@/components'
import { Button } from '@heroui/react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { UserType } from '@/types'
import { useToast, useGoBack } from '@/hooks'
import { userSchema, UserFormData } from '@/schema'
import { storesData } from '@/data'
import { DashboardCard } from '@/components'

interface UserFormProps {
    mode?: 'create' | 'edit'
    initialData?: UserType
    onSubmit?: (data: UserFormData) => void
    onCancel?: () => void
    submitButtonText?: string
    cancelButtonText?: string
    isLoading?: boolean
}

const UserForm = ({
    mode = 'create',
    initialData,
    onSubmit,
    onCancel,
    submitButtonText = mode === 'edit' ? 'Update User' : 'Create User',
    cancelButtonText = 'Cancel',
    isLoading = false
}: UserFormProps) => {

    const { showSuccess } = useToast()
    const goBack = useGoBack()

    const roleOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'manager', label: 'Manager' },
        { value: 'cashier', label: 'Cashier' }
    ]

    // Create a dynamic schema based on mode
    const getValidationSchema = () => {
        if (mode === 'edit') {
            return userSchema.shape({
                password: yup.string().optional().min(6, 'Password must be at least 6 characters'),
                confirmPassword: yup
                    .string()
                    .optional()
                    .when('password', {
                        is: (val: string) => val && val.length > 0,
                        then: (schema: any) => schema.oneOf([yup.ref('password')], 'Passwords must match'),
                        otherwise: (schema: any) => schema.optional()
                    })
            })
        }
        return userSchema
    }

    const form = useForm<UserFormData>({
        resolver: yupResolver(getValidationSchema()) as any,
        mode: 'onChange',
        defaultValues: {
            name: initialData?.name || '',
            email: initialData?.email || '',
            role: initialData?.role 
                ? roleOptions.find(opt => opt.label.toLowerCase() === initialData.role?.toLowerCase())?.value || initialData.role.toLowerCase()
                : '',
            phone: initialData?.phone || '',
            stores: initialData?.stores?.map(s => String(s)) || [],
            password: '',
            confirmPassword: '',
            profilePicture: undefined
        }
    })

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        clearErrors,
        formState: { errors, isSubmitting }
    } = form

    const handleFormSubmit = async (data: UserFormData) => {
        try {
            if (onSubmit) {
                onSubmit(data)
            } else {
                console.log(mode === 'edit' ? 'Update user:' : 'Create user:', data)
                showSuccess(
                    mode === 'edit' ? 'User updated' : 'User created',
                    mode === 'edit' ? 'User updated successfully.' : 'User created successfully.'
                )
                if (onCancel) {
                    onCancel()
                } else {
                    goBack()
                }
            }
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    const storeOptions = storesData
        .filter(store => store.id !== undefined)
        .map(store => ({
            value: String(store.id!),
            label: store.name
        }))

    return (
        <DashboardCard bodyClassName='p-5'>

            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-4">

                <div className="mb-1">
                    <Controller
                        name="profilePicture"
                        control={control}
                        render={({ field }) => (
                            <ProfilePictureUpload
                                label={createFileLabel({
                                    name: "Change Image",
                                    required: false
                                })}
                                labelClassName='font-medium mb-3'
                                name="profilePicture"
                                value={field.value as FileList | null}
                                onChange={(e) => {
                                    field.onChange(e.target.files)
                                }}
                                error={errors.profilePicture?.message as string}
                                defaultImage={initialData?.email ? `https://i.pravatar.cc/150?u=${initialData.id}` : undefined}
                            />
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-4">
                        <Input
                            label={createInputLabel({
                                name: "Name",
                                required: true
                            })}
                            placeholder="Enter User Name"
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

                        <CustomAutocomplete
                            name="role"
                            label={createInputLabel({
                                name: "Role",
                                required: true
                            })}
                            placeholder="Select Role"
                            radius="lg"
                            inputSize="sm"
                            options={roleOptions}
                            value={watch('role')}
                            onChange={(value) => {
                                if (typeof value === 'string') {
                                    setValue('role', value, { shouldValidate: true })
                                    clearErrors('role')
                                }
                            }}
                            error={errors.role?.message as string}
                        />

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
                    </div>

                    <div className="space-y-4">
                        <CustomAutocomplete
                            name="stores"
                            label={createInputLabel({
                                name: "Stores",
                                required: true
                            })}
                            placeholder="Select Stores"
                            radius="lg"
                            inputSize="sm"
                            multiple={true}
                            options={storeOptions}
                            value={(watch('stores') || []).filter((s): s is string => s !== undefined)}
                            onChange={(value) => {
                                if (Array.isArray(value)) {
                                    const filteredValues = value.filter((v): v is string => typeof v === 'string')
                                    setValue('stores', filteredValues, { shouldValidate: true })
                                    if (filteredValues.length > 0) {
                                        clearErrors('stores')
                                    }
                                }
                            }}
                            error={errors.stores?.message as string}
                        />

                        {mode === 'create' && (
                            <>
                                <PasswordInput
                                    label={createInputLabel({
                                        name: "Password",
                                        required: true
                                    })}
                                    placeholder="Enter Password"
                                    {...register('password')}
                                    error={errors.password?.message as string}
                                    fullWidth
                                />

                                <PasswordInput
                                    label={createInputLabel({
                                        name: "Confirm Password",
                                        required: true
                                    })}
                                    placeholder="Confirm Password"
                                    {...register('confirmPassword')}
                                    error={errors.confirmPassword?.message as string}
                                    fullWidth
                                />
                            </>
                        )}
                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        type="button"
                        variant="bordered"
                        radius='md'
                        className='px-6 border border-gray-300 text-gray-700 text-xs h-10'
                        onPress={onCancel || goBack}>
                        {cancelButtonText}
                    </Button>
                    <Button
                        type="submit"
                        radius='md'
                        className='px-6 bg-primary text-white text-xs h-10'
                        isLoading={isSubmitting || isLoading}>
                        {submitButtonText}
                    </Button>
                </div>

            </form>
            
        </DashboardCard>
    )
}

export default UserForm

