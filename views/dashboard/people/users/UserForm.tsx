'use client'

import { createInputLabel, Input, PhoneInput, CustomAutocomplete, PasswordInput } from '@/components'
import { Button } from '@heroui/react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { StaffUserType, RoleType, StoreType } from '@/types'
import { useToast, useGoBack } from '@/hooks'
import { userSchema, UserFormData } from '@/schema'
import { DashboardCard } from '@/components'
import { useEffect } from 'react'
import { useAppSelector, selectRoles, selectStores } from '@/store'

interface UserFormProps {
    mode?: 'create' | 'edit'
    initialData?: StaffUserType
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
    
    // ================================
    // GET ROLES AND STORES FROM REDUX STATE
    // ================================
    const rolesData = useAppSelector(selectRoles)
    const storesData = useAppSelector(selectStores)
    
    // Transform to RoleType and StoreType format
    const roles: RoleType[] = rolesData.map(role => ({
        id: role.role_id,
        name: role.name,
        description: role.description,
        created_at: role.created_at
    }))
    
    const stores: StoreType[] = storesData.map(store => ({
        id: store.store_id,
        name: store.name,
        description: store.description,
        created_at: store.created_at
    }))


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

    const roleOptions = roles.map(role => ({
        value: String(role.id),
        label: role.name
    }))

    const storeOptions = stores.map(store => ({
        value: String(store.id),
        label: store.name
    }))

    const form = useForm<UserFormData>({
        resolver: yupResolver(getValidationSchema()) as any,
        mode: 'onChange',
        defaultValues: {
            firstname: initialData?.firstname || '',
            lastname: initialData?.lastname || '',
            email: initialData?.email || '',
            phone: initialData?.phone || '',
            role_id: initialData?.role_id ? Number(initialData.role_id) : undefined,
            store_id: initialData?.store_id ? Number(initialData.store_id) : undefined,
            password: '',
            confirmPassword: ''
        }
    })

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        clearErrors,
        reset,
        formState: { errors, isSubmitting }
    } = form

    // Update form when initialData changes (for edit mode)
    useEffect(() => {
        if (initialData && mode === 'edit') {
            reset({
                firstname: initialData.firstname || '',
                lastname: initialData.lastname || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                role_id: initialData.role_id ? Number(initialData.role_id) : undefined,
                store_id: initialData.store_id ? Number(initialData.store_id) : undefined,
                password: '',
                confirmPassword: ''
            })
        }
    }, [initialData, mode, reset])

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

    return (
        <DashboardCard bodyClassName='p-5'>

            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-4">
                        <Input
                            label={createInputLabel({
                                name: "First Name",
                                required: true
                            })}
                            placeholder="Enter First Name"
                            {...register('firstname')}
                            error={errors.firstname?.message as string}
                        />

                        <Input
                            label={createInputLabel({
                                name: "Last Name",
                                required: true
                            })}
                            placeholder="Enter Last Name"
                            {...register('lastname')}
                            error={errors.lastname?.message as string}
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
                            name="role_id"
                            label={createInputLabel({
                                name: "Role",
                                required: true
                            })}
                            placeholder="Select Role"
                            radius="lg"
                            inputSize="sm"
                            options={roleOptions}
                            value={watch('role_id') ? String(watch('role_id')) : ''}
                            onChange={(value) => {
                                if (typeof value === 'string') {
                                    setValue('role_id', Number(value), { shouldValidate: true })
                                    clearErrors('role_id')
                                }
                            }}
                            error={errors.role_id?.message as string}
                        />

                        <CustomAutocomplete
                            name="store_id"
                            label={createInputLabel({
                                name: "Store",
                                required: true
                            })}
                            placeholder="Select Store"
                            radius="lg"
                            inputSize="sm"
                            options={storeOptions}
                            value={watch('store_id') ? String(watch('store_id')) : ''}
                            onChange={(value) => {
                                if (typeof value === 'string') {
                                    setValue('store_id', Number(value), { shouldValidate: true })
                                    clearErrors('store_id')
                                }
                            }}
                            error={errors.store_id?.message as string}
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

