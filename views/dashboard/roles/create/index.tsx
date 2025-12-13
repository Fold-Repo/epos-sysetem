'use client'

import { DashboardBreadCrumb } from '@/components'
import RoleForm from '../RoleForm'
import { useToast, useGoBack } from '@/hooks'

interface RoleFormData {
    name: string
    permissions: {
        [key: string]: {
            view: boolean
            create: boolean
            update: boolean
            delete: boolean
        }
    }
}

const CreateRoleView = () => {
    const goBack = useGoBack()
    const { showError, showSuccess } = useToast()

    const handleSubmit = (formData: RoleFormData) => {
        try {
            console.log('Create role:', formData)
            showSuccess('Role created', 'Role created successfully.')
            goBack()
        } catch (error) {
            showError('Failed to create role', 'Please try again later.')
        }
    }

    return (
        <>
            <DashboardBreadCrumb
                items={[
                    { label: 'Roles & Permissions', href: '/dashboard/roles-permissions' },
                    { label: 'Create Role' }
                ]}
                title='Create Role'
            />

            <div className="p-3 space-y-2">
                <RoleForm
                    mode="create"
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    submitButtonText="Save"
                />
            </div>
        </>
    )
}

export default CreateRoleView

