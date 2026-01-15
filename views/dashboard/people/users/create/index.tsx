'use client'

import { DashboardBreadCrumb } from '@/components'
import UserForm from '../UserForm'
import { useGoBack } from '@/hooks'
import { UserFormData } from '@/schema'
import { useCreateBusinessUser } from '@/services'

const CreateUserView = () => {
    
    const goBack = useGoBack()
    const createUserMutation = useCreateBusinessUser()

    const handleSubmit = (formData: UserFormData) => {
        createUserMutation.mutate({
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            role_id: formData.role_id!,
            store_id: formData.store_id!
        }, {
            onSuccess: () => {
                goBack()
            }
        })
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
                    isLoading={createUserMutation.isPending}
                />
            </div>
        </>
    )
}

export default CreateUserView

