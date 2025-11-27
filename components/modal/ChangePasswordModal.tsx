"use client"

import { PopupModal, PasswordInput } from '@/components'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { changePasswordSchema, ChangePasswordFormData } from '@/schema/auth.schema'
import { createInputLabel } from '@/components/ui/form/labelHelpers'
import { useToast } from '@/hooks'

interface ChangePasswordModalProps {
    open: boolean
    close: () => void
}

const ChangePasswordModal = ({ open, close }: ChangePasswordModalProps) => {

    const { showSuccess, showError } = useToast();

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
        useForm<ChangePasswordFormData>({
            resolver: yupResolver(changePasswordSchema),
            mode: 'onChange',
        })

    const handleFormSubmit = async (data: ChangePasswordFormData) => {
        try {
            console.log('Change password API call:', data);
            showSuccess('Password changed successfully');
            reset();
            close();
        } catch (error) {
            console.error('Form submission error:', error)
            showError('Failed to change password, please try again later.');
        }
    }

    return (
        <PopupModal
            size="xl"
            radius="2xl"
            isOpen={open}
            onClose={close}
            placement="center"
            title="Change Password"
            icon={<LockClosedIcon className='size-5' />}
            className="max-h-screen rounded-2xl">

            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="p-5 space-y-6">

                    <div className="space-y-4">
                        <PasswordInput
                            label={createInputLabel({ name: "Current Password", required: true })}
                            placeholder="Enter your current password"
                            {...register('currentPassword')}
                            error={errors.currentPassword?.message}
                            fullWidth
                        />

                        <PasswordInput
                            label={createInputLabel({ name: "New Password", required: true })}
                            placeholder="Enter your new password"
                            {...register('newPassword')}
                            error={errors.newPassword?.message}
                            fullWidth
                        />

                        <PasswordInput
                            label={createInputLabel({ name: "Confirm Password", required: true })}
                            placeholder="Confirm your new password"
                            {...register('confirmPassword')}
                            error={errors.confirmPassword?.message}
                            fullWidth
                        />
                    </div>

                    <Button type="submit" fullWidth radius='md' className='text-xs bg-deep-purple text-white'
                    isLoading={isSubmitting}>
                        Change Password
                    </Button>

                </div>
            </form>

        </PopupModal>
    )
}

export default ChangePasswordModal

