'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import RoleForm from '../RoleForm'
import { useGoBack } from '@/hooks'
import { useUpdateRole, useGetRolePermissionsList, useGetRolePermissions, transformPermissionsToAPI } from '@/services'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Spinner } from '@heroui/react'

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

const EditRoleView = () => {
    const params = useParams()
    const roleId = params?.id as string
    const goBack = useGoBack()
    const { data: permissionsData } = useGetRolePermissionsList()
    const { data: roleData, isLoading: isLoadingPermissions } = useGetRolePermissions(roleId)
    const updateRoleMutation = useUpdateRole()

    const [initialData, setInitialData] = useState<{
        id?: number
        name?: string
        description?: string
        permissions?: {
            [key: string]: {
                view: boolean
                create: boolean
                update: boolean
                delete: boolean
            }
        }
    } | undefined>(undefined)

    useEffect(() => {
        if (roleData && roleId) {
            // ==============================
            // Set initial data with fetched role data and permissions
            // ==============================
            setInitialData({
                id: Number(roleId),
                name: roleData.name,
                description: roleData.description || '',
                permissions: roleData.permissions || {}
            })
        }
    }, [roleData, roleId])

    const handleSubmit = (formData: RoleFormData) => {
        try {
            if (!permissionsData?.data) {
                console.error('Permissions data not available')
                return
            }

            if (!roleId) {
                console.error('Role ID not available')
                return
            }

            const apiPermissions = transformPermissionsToAPI(formData.permissions, permissionsData.data)

            const payload = {
                name: formData.name,
                description: formData.description,
                permissions: apiPermissions
            }

            updateRoleMutation.mutate({
                id: Number(roleId),
                roleData: payload
            }, {
                onSuccess: () => {
                    goBack()
                }
            })
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    if (isLoadingPermissions) 
        return <Spinner className='flex items-center justify-center min-h-[80vh]' color='primary' size='lg' />

    return (
        <>

            <DashboardBreadCrumb
                items={[
                    { label: 'Roles & Permissions', href: '/dashboard/roles-permissions' },
                    { label: 'Edit Role' }
                ]}
                title='Edit Role'
            />

            <div className="p-3 space-y-2">
                <RoleForm mode="edit" initialData={initialData} onSubmit={handleSubmit} onCancel={goBack} submitButtonText="Update" isLoading={updateRoleMutation.isPending} />
            </div>

        </>
    )
}

export default EditRoleView

