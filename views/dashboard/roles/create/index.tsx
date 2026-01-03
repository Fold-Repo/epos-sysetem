'use client'

import { DashboardBreadCrumb } from '@/components'
import RoleForm from '../RoleForm'
import { useGoBack } from '@/hooks'
import { useCreateRole, useGetRolePermissionsList, transformPermissionsToAPI } from '@/services'

interface RoleFormData {
    name: string
    description: string
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
    const { mutate: createRole, isPending } = useCreateRole()
    const { data: permissionsData } = useGetRolePermissionsList()

    const handleSubmit = (formData: RoleFormData) => {
        try {

            if (!permissionsData?.data) {
                console.error('Permissions data not available')
                return
            }

            const apiPermissions = transformPermissionsToAPI(formData.permissions, permissionsData.data)

            const payload = {
                name: formData.name,
                description: formData.description,
                permissions: apiPermissions
            }

            createRole(payload, {
                onSuccess: () => {
                    goBack()
                }
            })
        } catch (error) {
            console.error('Form submission error:', error)
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
                    isLoading={isPending}
                />
            </div>
            
        </>
    )
}

export default CreateRoleView

