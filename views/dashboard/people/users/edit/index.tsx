'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import UserForm from '../UserForm'
import { useGoBack } from '@/hooks'
import { UserFormData } from '@/schema'
import { useParams } from 'next/navigation'
import { useGetBusinessUserById, useUpdateBusinessUser } from '@/services'

const EditUserView = () => {
    
    const params = useParams()
    const userId = params?.id as string
    const goBack = useGoBack()
    const { data: initialData, isLoading } = useGetBusinessUserById(userId ? Number(userId) : undefined)
    const updateUserMutation = useUpdateBusinessUser()

    const handleSubmit = (formData: UserFormData) => {
        if (!userId) return
        
        const payload: any = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            phone: formData.phone,
            role_id: formData.role_id!,
            store_id: formData.store_id!
        }

        if (formData.password) {
        }

        updateUserMutation.mutate({
            id: Number(userId),
            payload
        }, {
            onSuccess: () => {
                goBack()
            }
        })
    }

    // ================================
    // LOADING STATE
    // ================================
    if (isLoading) {
        return (
            <>
                <DashboardBreadCrumb
                    items={[
                        { label: 'People', href: '/dashboard/people' },
                        { label: 'Users', href: '/dashboard/people?tab=users' },
                        { label: 'Edit User' }
                    ]}
                    title='Edit User'
                />
                <div className="p-3">
                    <DashboardCard>
                        <div className="p-8 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    </DashboardCard>
                </div>
            </>
        )
    }

    if (!initialData) {
        return (
            <>
                <DashboardBreadCrumb
                    items={[
                        { label: 'People', href: '/dashboard/people' },
                        { label: 'Users', href: '/dashboard/people?tab=users' },
                        { label: 'Edit User' }
                    ]}
                    title='Edit User'
                />
                <div className="p-3">
                    <DashboardCard>
                        <div className="p-8 text-center text-gray-500">
                            User not found
                        </div>
                    </DashboardCard>
                </div>
            </>
        )
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'People', href: '/dashboard/people' },
                    { label: 'Users', href: '/dashboard/people?tab=users' },
                    { label: 'Edit User' }
                ]}
                title='Edit User'
            />

            <div className="p-3 space-y-2">
                <UserForm
                    mode="edit"
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    submitButtonText="Update User"
                    isLoading={updateUserMutation.isPending}
                />
            </div>
        </>
    )
}

export default EditUserView

