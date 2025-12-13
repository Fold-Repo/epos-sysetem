'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import UserForm from '../UserForm'
import { useToast, useGoBack } from '@/hooks'
import { UserFormData } from '@/schema'
import { usersData } from '@/data'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { UserType } from '@/types'

const EditUserView = () => {
    const params = useParams()
    const userId = params?.id as string
    const goBack = useGoBack()
    const { showError, showSuccess } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [initialData, setInitialData] = useState<UserType | undefined>(undefined)

    useEffect(() => {
        // Find user by ID
        const user = usersData.find(u => String(u.id) === String(userId))
        
        if (user) {
            setInitialData(user)
        }
        
        setIsLoading(false)
    }, [userId])

    const handleSubmit = (formData: UserFormData) => {
        try {
            console.log('Update user:', userId, formData)
            showSuccess('User updated', 'User updated successfully.')
            goBack()
        } catch (error) {
            showError('Failed to update user', 'Please try again later.')
        }
    }

    if (isLoading) {
        return (
            <div className="p-3">
                <DashboardCard>
                    <div className="p-4 text-center">Loading...</div>
                </DashboardCard>
            </div>
        )
    }

    if (!initialData) {
        return (
            <div className="p-3">
                <DashboardCard>
                    <div className="p-4 text-center">User not found</div>
                </DashboardCard>
            </div>
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
                />
            </div>
        </>
    )
}

export default EditUserView

