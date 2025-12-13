'use client'

import { createInputLabel, Input, CheckBox, TableComponent, TableCell } from '@/components'
import { Button, Switch } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useToast, useGoBack } from '@/hooks'
import { DashboardCard } from '@/components'
import * as yup from 'yup'
import { useState } from 'react'

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
    permissions: PermissionState
}

const roleSchema = yup.object({
    name: yup
        .string()
        .required('Role name is required')
        .min(2, 'Role name must be at least 2 characters')
        .max(100, 'Role name must not exceed 100 characters'),
}).required()

const permissionModules: PermissionModule[] = [
    { key: 'manageAdjustments', label: 'Manage Adjustments' },
    { key: 'manageBrands', label: 'Manage Brands' },
    { key: 'manageCurrency', label: 'Manage Currency' },
    { key: 'manageCustomers', label: 'Manage Customers' },
    { key: 'manageDashboard', label: 'Manage Dashboard' },
    { key: 'manageEmailTemplates', label: 'Manage Email Templates' },
    { key: 'manageExpenseCategories', label: 'Manage Expense Categories' },
    { key: 'manageExpenses', label: 'Manage Expenses' },
    { key: 'manageLanguage', label: 'Manage Language' },
    { key: 'managePosScreen', label: 'Manage Pos Screen' },
    { key: 'manageProductCategories', label: 'Manage Product Categories' },
    { key: 'manageProducts', label: 'Manage Products' },
    { key: 'managePurchase', label: 'Manage Purchase' },
    { key: 'managePurchaseReturn', label: 'Manage Purchase Return' },
    { key: 'manageQuotations', label: 'Manage Quotations' },
    { key: 'manageReports', label: 'Manage Reports' },
    { key: 'manageRoles', label: 'Manage Roles' },
    { key: 'manageSale', label: 'Manage Sale' },
    { key: 'manageSaleReturn', label: 'Manage Sale Return' },
    { key: 'manageSetting', label: 'Manage Setting' },
    { key: 'manageSmsApis', label: 'Manage Sms Apis' },
    { key: 'manageSmsTemplates', label: 'Manage Sms Templates' },
    { key: 'manageSuppliers', label: 'Manage Suppliers' },
    { key: 'manageTransfers', label: 'Manage Transfers' },
    { key: 'manageUnits', label: 'Manage Units' },
    { key: 'manageUsers', label: 'Manage Users' },
    { key: 'manageVariations', label: 'Manage Variations' },
    { key: 'manageWarehouses', label: 'Manage Warehouses' },
]

interface RoleFormProps {
    mode?: 'create' | 'edit'
    initialData?: {
        name?: string
        permissions?: PermissionState
    }
    onSubmit?: (data: RoleFormData) => void
    onCancel?: () => void
    submitButtonText?: string
    cancelButtonText?: string
    isLoading?: boolean
}

const RoleForm = ({ mode = 'create', initialData, onSubmit, onCancel, submitButtonText = mode === 'edit' ? 'Update Role' : 'Save', cancelButtonText = 'Cancel', isLoading = false }: RoleFormProps) => {

    const { showSuccess } = useToast()
    const goBack = useGoBack()
    const [allPermissions, setAllPermissions] = useState(false)

    const [permissions, setPermissions] = useState<PermissionState>(() => {

        if (initialData?.permissions) {
            return initialData.permissions
        }

        const initial: PermissionState = {}
        permissionModules.forEach(module => {
            initial[module.key] = {
                view: false,
                create: false,
                update: false,
                delete: false
            }
        })

        return initial
    })

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ name: string }>({
        resolver: yupResolver(roleSchema),
        mode: 'onChange',
        defaultValues: {
            name: initialData?.name || ''
        }
    })

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

        const modulePermissions = permissions[moduleKey]
        const allSelected = modulePermissions.view && modulePermissions.create &&
            modulePermissions.update && modulePermissions.delete

        setPermissions(prev => ({
            ...prev,
            [moduleKey]: {
                view: !allSelected,
                create: !allSelected,
                update: !allSelected,
                delete: !allSelected
            }
        }))
    }

    const handlePermissionChange = (moduleKey: string, action: 'view' | 'create' | 'update' | 'delete', checked: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [moduleKey]: {
                ...prev[moduleKey],
                [action]: checked
            }
        }))
    }

    const handleFormSubmit = async (data: { name: string }) => {
        try {

            const formData: RoleFormData = {
                name: data.name,
                permissions
            }

            console.log(formData)

            if (onSubmit) {
                onSubmit(formData)
            } else {
                showSuccess(
                    mode === 'edit' ? 'Role updated' : 'Role created',
                    mode === 'edit' ? 'Role updated successfully.' : 'Role created successfully.'
                )
                // if (onCancel) {
                //     onCancel()
                // } else {
                //     // goBack()
                // }
            }
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <DashboardCard bodyClassName='p-5'>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-y-6">

                <div>
                    <Input label={createInputLabel({
                        name: "Name",
                        required: true
                    })} placeholder="Enter Name" {...register('name')}
                        error={errors.name?.message as string}
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
                            loading={false}
                        />
                    </div>

                </div>


                <div className="flex justify-end gap-3 mt-6">

                    <Button type="button" variant="bordered" radius='md' className='px-6 border border-gray-300 text-gray-700 text-xs h-10' onPress={onCancel || goBack}>
                        {cancelButtonText}
                    </Button>

                    <Button type="submit" radius='md' className='px-6 bg-primary text-white text-xs h-10' isLoading={isSubmitting || isLoading}>
                        {submitButtonText}
                    </Button>

                </div>

            </form>

        </DashboardCard>
    )
}

export default RoleForm

