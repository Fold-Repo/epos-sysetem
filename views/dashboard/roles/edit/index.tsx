'use client'

import { DashboardBreadCrumb, DashboardCard } from '@/components'
import RoleForm from '../RoleForm'
import { useToast, useGoBack } from '@/hooks'
import { rolesData } from '@/data/roles'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { RoleType } from '@/types'

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

const EditRoleView = () => {
    const params = useParams()
    const roleId = params?.id as string
    const goBack = useGoBack()
    const { showError, showSuccess } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [initialData, setInitialData] = useState<{
        name?: string
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
        // Find role by ID
        const role = rolesData.find(r => String(r.id) === String(roleId))
        
        if (role) {
            // Mock permissions data - in real app, this would come from API
            const mockPermissions: {
                [key: string]: {
                    view: boolean
                    create: boolean
                    update: boolean
                    delete: boolean
                }
            } = {}
            
            // Set some default permissions based on role name
            const permissionKeys = [
                'manageDashboard', 'manageProducts', 'manageUsers', 
                'manageRoles', 'manageReports', 'manageSettings'
            ]
            
            permissionKeys.forEach(key => {
                mockPermissions[key] = {
                    view: true,
                    create: role.name === 'Admin' || role.name === 'Manager',
                    update: role.name === 'Admin' || role.name === 'Manager',
                    delete: role.name === 'Admin'
                }
            })
            
            setInitialData({
                name: role.name,
                permissions: mockPermissions
            })
        }
        
        setIsLoading(false)
    }, [roleId])

    const handleSubmit = (formData: RoleFormData) => {
        try {
            console.log('Update role:', roleId, formData)
            showSuccess('Role updated', 'Role updated successfully.')
            goBack()
        } catch (error) {
            showError('Failed to update role', 'Please try again later.')
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
                    <div className="p-4 text-center">Role not found</div>
                </DashboardCard>
            </div>
        )
    }

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
                <RoleForm
                    mode="edit"
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={goBack}
                    submitButtonText="Update"
                />
            </div>
        </>
    )
}

export default EditRoleView

