'use client'

import { createInputLabel, Input, TextArea, CheckBox, TableComponent, TableCell } from '@/components'
import { Button, Switch } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useToast, useGoBack } from '@/hooks'
import { DashboardCard } from '@/components'
import { useGetRolePermissionsList } from '@/services'
import { snakeToCamel, snakeToTitleCase } from '@/utils'
import * as yup from 'yup'
import { useState, useMemo, useEffect } from 'react'

interface PermissionModule {
    key: string
    label: string
}

interface PermissionState {
    [key: string]: {
        view: boolean
        create: boolean
        update: boolean
        delete: boolean
    }
}

interface RoleFormData {
    name: string
    description: string
    permissions: PermissionState
}

const roleSchema = yup.object({
    name: yup
        .string()
        .required('Role name is required')
        .min(2, 'Role name must be at least 2 characters')
        .max(100, 'Role name must not exceed 100 characters'),
    description: yup
        .string()
        .max(100, 'Description must not exceed 500 characters')
        .required('Description is required'),
}).required()

interface RoleFormProps {
    mode?: 'create' | 'edit'
    initialData?: {
        id?: number
        name?: string
        description?: string
        permissions?: PermissionState
    }
    onSubmit?: (data: RoleFormData) => void
    onCancel?: () => void
    submitButtonText?: string
    cancelButtonText?: string
    isLoading?: boolean
}

const RoleForm = ({ mode = 'create', initialData, onSubmit, onCancel, submitButtonText = mode === 'edit' ? 'Update Role' : 'Save', cancelButtonText = 'Cancel', isLoading = false }: RoleFormProps) => {

    const goBack = useGoBack()
    const { data: permissionsData, isLoading: isLoadingPermissions } = useGetRolePermissionsList()
    const [allPermissions, setAllPermissions] = useState(false)

    const permissionModules: PermissionModule[] = useMemo(() => {
        if (!permissionsData?.data) return []
        const uniquePermissions = new Set<string>()
        permissionsData.data.forEach(item => {
            if (item.permission) {
                uniquePermissions.add(item.permission)
            }
        })
        return Array.from(uniquePermissions)
            .sort()
            .map(permission => ({
                key: snakeToCamel(permission),
                label: snakeToTitleCase(permission)
            }))
    }, [permissionsData])

    const [permissions, setPermissions] = useState<PermissionState>(() => {
        if (initialData?.permissions) {
            return initialData.permissions
        }
        return {}
    })

    // Initialize permissions from API data or initialData
    useEffect(() => {
        // If we have initialData with permissions (edit mode), use those
        if (initialData?.permissions && Object.keys(initialData.permissions).length > 0) {
            setPermissions(initialData.permissions)
            return
        }

        // Otherwise, initialize all permissions as false (create mode)
        if (permissionsData?.data) {
            const newPermissions: PermissionState = {}
            permissionsData.data.forEach(item => {
                if (item.permission) {
                    // Ignore "create" privilege entries
                    if (item.privilege === 'create') {
                        return
                    }

                    const camelKey = snakeToCamel(item.permission)

                    // Initialize all permissions as false
                    if (!newPermissions[camelKey]) {
                        newPermissions[camelKey] = {
                            view: false,
                            create: false,
                            update: false,
                            delete: false
                        }
                    }
                }
            })
            setPermissions(newPermissions)
        }
    }, [permissionsData, initialData?.permissions])

    interface FormData {
        name: string;
        description: string;
    }

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
        resolver: yupResolver(roleSchema) as any,
        mode: 'onChange',
        defaultValues: {
            name: initialData?.name || '',
            description: initialData?.description || ''
        }
    })

    // Update form values when initialData changes (for edit mode)
    useEffect(() => {
        if (initialData?.name !== undefined || initialData?.description !== undefined) {
            reset({
                name: initialData.name || '',
                description: initialData.description || ''
            })
        }
    }, [initialData?.name, initialData?.description, reset])

    const handleAllPermissionsToggle = (checked: boolean) => {
        setAllPermissions(checked)
        const newPermissions: PermissionState = {}
        permissionModules.forEach(module => {
            newPermissions[module.key] = {
                view: checked,
                create: checked,
                update: checked,
                delete: checked
            }
        })
        setPermissions(newPermissions)
    }

    const handleSelectAll = (moduleKey: string) => {
        const modulePermissions = permissions[moduleKey] || {
            view: false,
            create: false,
            update: false,
            delete: false
        }
        const allSelected = modulePermissions.view && modulePermissions.create &&
            modulePermissions.update && modulePermissions.delete

        // When toggling on, ensure view is enabled first
        // When toggling off, disable everything
        const newState = !allSelected
        setPermissions(prev => ({
            ...prev,
            [moduleKey]: {
                view: newState,
                create: newState,
                update: newState,
                delete: newState
            }
        }))
    }

    const handlePermissionChange = (moduleKey: string, action: 'view' | 'create' | 'update' | 'delete', checked: boolean) => {
        setPermissions(prev => {
            const currentModulePermissions = prev[moduleKey] || {
                view: false,
                create: false,
                update: false,
                delete: false
            }

            // ==============================
            // If view is being unchecked, disable all other permissions
            // ==============================
            if (action === 'view' && !checked) {
                return {
                    ...prev,
                    [moduleKey]: {
                        view: false,
                        create: false,
                        update: false,
                        delete: false
                    }
                }
            }

            // ==============================
            // If create, update, or delete is being checked, automatically enable view
            // ==============================
            if ((action === 'create' || action === 'update' || action === 'delete') && checked && !currentModulePermissions.view) {
                return {
                    ...prev,
                    [moduleKey]: {
                        ...currentModulePermissions,
                        view: true,
                        [action]: true
                    }
                }
            }

            // ==============================
            // Default: just update the specific permission
            // ==============================
            return {
                ...prev,
                [moduleKey]: {
                    ...currentModulePermissions,
                    [action]: checked
                }
            }
        })
    }

    const handleFormSubmit = async (data: { name: string; description: string }) => {
        try {
            const formData: RoleFormData = {
                name: data.name,
                description: data.description,
                permissions
            }
            
            if (onSubmit) {
                onSubmit(formData)
            } else {
                if (onCancel) {
                    onCancel()
                } else {
                    goBack()
                }
            }
        } catch (error) {
            console.error('Form submission error:', error)
        } 
    }

    return (
        <DashboardCard bodyClassName='p-5'>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-2">

                <div>
                    <Input label={createInputLabel({
                        name: "Name",
                        required: true
                    })} placeholder="Enter Name" {...register('name')}
                        error={errors.name?.message as string}
                    />
                </div>

                <div>
                    <TextArea 
                        label={createInputLabel({
                            name: "Description",
                            required: true
                        })} 
                        className='min-h-16 h-full'
                        placeholder="Enter description" 
                        {...register('description')}
                        error={errors.description?.message as string}
                    />
                </div>

                {/* ============================================== */}
                {/* Permissions Section */}
                {/* ============================================== */}
                <div className="space-y-4">

                    <div className="flex items-center justify-between">

                        <label className="text-sm font-medium">
                            Permissions: <span className="text-red-500">*</span>
                        </label>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">All Permissions</span>
                            <Switch size="sm" color="primary" isSelected={allPermissions} onValueChange={handleAllPermissionsToggle} />
                        </div>

                    </div>

                    {/* ============================================== */}
                    {/* Permissions Table */}
                    {/* ============================================== */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">

                        <TableComponent
                            className=""
                            tableClassName="w-full"
                            columns={[
                                { key: 'permission', title: 'PERMISSIONS' },
                                { key: 'selectAll', title: 'SELECT ALL' },
                                { key: 'view', title: 'VIEW' },
                                { key: 'create', title: 'CREATE' },
                                { key: 'update', title: 'UPDATE' },
                                { key: 'delete', title: 'DELETE' }
                            ]}
                            data={permissionModules}
                            rowKey={(item) => item.key}
                            renderRow={(module) => {
                                const modulePermissions = permissions[module.key] || {
                                    view: false,
                                    create: false,
                                    update: false,
                                    delete: false
                                }
                                const allSelected = modulePermissions.view && modulePermissions.create &&
                                    modulePermissions.update && modulePermissions.delete

                                return (
                                    <>
                                        <TableCell>
                                            <span className="text-xs text-gray-900">{module.label}</span>
                                        </TableCell>
                                        <TableCell>
                                            <CheckBox
                                                checked={allSelected}
                                                onChange={() => handleSelectAll(module.key)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <CheckBox
                                                checked={modulePermissions.view}
                                                onChange={(e) => handlePermissionChange(module.key, 'view', e.target.checked)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <CheckBox
                                                checked={modulePermissions.create}
                                                onChange={(e) => handlePermissionChange(module.key, 'create', e.target.checked)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <CheckBox
                                                checked={modulePermissions.update}
                                                onChange={(e) => handlePermissionChange(module.key, 'update', e.target.checked)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <CheckBox
                                                checked={modulePermissions.delete}
                                                onChange={(e) => handlePermissionChange(module.key, 'delete', e.target.checked)}
                                            />
                                        </TableCell>
                                    </>
                                )
                            }}
                            withCheckbox={false}
                            loading={isLoadingPermissions}
                        />
                    </div>

                </div>


                <div className="flex justify-end gap-3 mt-6">

                    <Button type="button" variant="bordered" radius='md' className='px-6 border border-gray-300 text-gray-700 text-xs h-10' onPress={onCancel || goBack}>
                        {cancelButtonText}
                    </Button>

                    <Button type="submit" radius='md' className='px-6 bg-primary text-white text-xs h-10' 
                        isLoading={isSubmitting || isLoading}>
                        {submitButtonText}
                    </Button>

                </div>

            </form>

        </DashboardCard>
    )
}

export default RoleForm

