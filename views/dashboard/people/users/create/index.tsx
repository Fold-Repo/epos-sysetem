'use client'

import { DashboardBreadCrumb } from '@/components'
import UserForm from '../UserForm'
import { useToast, useGoBack } from '@/hooks'
import { UserFormData } from '@/schema'

const CreateUserView = () => {
    const goBack = useGoBack()
    const { showError, showSuccess } = useToast()

    const handleSubmit = (formData: UserFormData) => {
        try {
            console.log('Create user:', formData)
            showSuccess('User created', 'User created successfully.')
            goBack()
        } catch (error) {
            showError('Failed to create user', 'Please try again later.')
        }
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'People', href: '/dashboard/people' },
                    { label: 'Users', href: '/dashboard/people?tab=users' },
                    { label: 'Create User' }
                ]}
                title='Create User'
            />

            <div className="p-3 space-y-2">
                <UserForm
                    mode="create"
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    submitButtonText="Create User"
                />
            </div>
        </>
    )
}

export default CreateUserView

