'use client'

import { DashboardBreadCrumb, FilterBar, Pagination, DashboardCard, StackIcon, DeleteModal, useDisclosure } from '@/components'
import { Button } from '@heroui/react'
import RoleTable from './RoleTable'
import { RoleType } from '@/types'
import { useGetRoles, useDeleteRole } from '@/services'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const RoleViews = () => {

    const router = useRouter()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteRoleId, setDeleteRoleId] = useState<string | undefined>(undefined)
    const { data: roles, isLoading, error } = useGetRoles()
    const deleteRoleMutation = useDeleteRole()

    const handleEdit = (role: RoleType) => {
        if (role.id) {
            router.push(`/dashboard/roles-permissions/${role.id}/edit`)
        }
    }

    const handleDelete = (roleId: string) => {
        setDeleteRoleId(roleId)
        onDeleteModalOpen()
    }

    const confirmDelete = async () => {
        if (deleteRoleId) {
            const roleId = Number(deleteRoleId)
            if (!isNaN(roleId)) {
                await new Promise<void>((resolve) => {
                    deleteRoleMutation.mutate(roleId, {
                        onSuccess: () => {
                            onDeleteModalClose()
                            setDeleteRoleId(undefined)
                            resolve()
                        },
                        onError: () => {
                            resolve()
                        }
                    })
                })
            } else {
                console.error('Invalid role ID:', deleteRoleId)
            }
        }
    }

    return (
        <>

            <DashboardBreadCrumb
                title="Roles & Permissions"
                description="Manage roles and permissions here."
                endContent={
                    <Button size='sm' className='px-4 bg-primary text-white h-9'
                        onPress={() => router.push('/dashboard/roles-permissions/create')}>
                        Create Role
                    </Button>
                }
            />

            <div className="p-3 space-y-3">

                <DashboardCard bodyClassName='space-y-4'>

                    {/* ================= TABLE ================= */}
                    <RoleTable
                        data={roles || []}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isLoading={isLoading}
                    />

                    {!isLoading && !error && (
                        <Pagination
                            currentPage={1}
                            totalItems={roles?.length || 0}
                            itemsPerPage={25}
                            onPageChange={(page) => {
                                console.log('Page changed:', page)
                            }}
                            showingText="Roles & Permissions"
                        />
                    )}
                </DashboardCard>

            </div>

            <DeleteModal
                title="role"
                open={isDeleteModalOpen}
                setOpen={(value) => {
                    if (!value) {
                        onDeleteModalClose()
                        setDeleteRoleId(undefined)
                    }
                }}
                onDelete={confirmDelete}
            />

        </>
    )
}

export default RoleViews
