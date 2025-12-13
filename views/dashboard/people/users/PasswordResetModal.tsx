'use client'

import { PopupModal, PasswordInput } from '@/components'
import { KeyIcon } from '@heroicons/react/24/outline'
import { Button } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createPasswordSchema, CreatePasswordFormData } from '@/schema/auth.schema'
import { createInputLabel } from '@/components/ui/form/labelHelpers'
import { useToast } from '@/hooks'
import { UserType } from '@/types'

interface PasswordResetModalProps {
    isOpen: boolean
    onClose: () => void
    user?: UserType
}

const PasswordResetModal = ({ isOpen, onClose, user }: PasswordResetModalProps) => {

    const { showSuccess, showError } = useToast()

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
        useForm<CreatePasswordFormData>({
            resolver: yupResolver(createPasswordSchema),
            mode: 'onChange',
        })

    const handleFormSubmit = async (data: CreatePasswordFormData) => {
        try {
            console.log('Reset password for user:', user?.id, data)
            showSuccess('Password reset successfully', `Password has been reset for ${user?.name || 'user'}.`)
            reset()
            onClose()
        } catch (error) {
            console.error('Form submission error:', error)
            showError('Failed to reset password', 'Please try again later.')
        }
    }

    return (
        <PopupModal
            size="xl"
            radius="2xl"
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            title="Reset Password"
            description={user ? `Reset password for ${user.name}` : 'Reset user password'}
            icon={<KeyIcon className='size-5' />}
            className="max-h-screen rounded-2xl"
            bodyClassName='p-5'>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="space-y-4">
                    <PasswordInput
                        label={createInputLabel({ name: "New Password", required: true })}
                        placeholder="Enter new password"
                        {...register('newPassword')}
                        error={errors.newPassword?.message as string}
                        fullWidth
                    />

                    <PasswordInput
                        label={createInputLabel({ name: "Confirm Password", required: true })}
                        placeholder="Confirm new password"
                        {...register('confirmPassword')}
                        error={errors.confirmPassword?.message as string}
                        fullWidth
                    />
                </div>

                <div className="flex gap-3 mt-6">
                    <Button
                        type="button"
                        variant="bordered"
                        radius='md'
                        className='flex-1 border border-gray-300 text-gray-700 text-xs h-10'
                        onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        radius='md'
                        className='flex-1 bg-primary text-white text-xs h-10'
                        isLoading={isSubmitting}>
                        Reset Password
                    </Button>
                </div>
            </form>

        </PopupModal>
    )
}

export default PasswordResetModal

