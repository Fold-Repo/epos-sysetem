'use client'

import { DashboardBreadCrumb, FilterBar, Pagination, DashboardCard, StackIcon, DeleteModal, useDisclosure } from '@/components'
import { Button } from '@heroui/react'
import RoleTable from './RoleTable'
import { rolesData } from '@/data/roles'
import { RoleType } from '@/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const RoleViews = () => {

    const router = useRouter()
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
    const [deleteRoleId, setDeleteRoleId] = useState<string | undefined>(undefined)

    const filterItems = [
        {
            type: 'dropdown' as const,
            label: 'Status: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'All', key: 'all' },
                { label: 'Active', key: 'active' },
                { label: 'Inactive', key: 'inactive' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Status changed:', key)
            }
        },
        {
            type: 'dropdown' as const,
            label: 'Sort By: All',
            startContent: <StackIcon className="text-slate-400" />,
            showChevron: false,
            items: [
                { label: 'Name (A-Z)', key: 'name_asc' },
                { label: 'Name (Z-A)', key: 'name_desc' },
                { label: 'Users (High to Low)', key: 'users_desc' },
                { label: 'Users (Low to High)', key: 'users_asc' },
                { label: 'Permissions (High to Low)', key: 'permissions_desc' },
                { label: 'Permissions (Low to High)', key: 'permissions_asc' },
                { label: 'Newest First', key: 'newest' },
                { label: 'Oldest First', key: 'oldest' }
            ],
            value: '',
            onChange: (key: string) => {
                console.log('Sort changed:', key)
            }
        },
        {
            type: 'dateRange' as const,
            label: 'Data',
            placeholder: 'Select date range'
        }
    ]

    const handleEdit = (role: RoleType) => {
        if (role.id) {
            router.push(`/dashboard/roles-permissions/${role.id}/edit`)
        }
    }

    const handleDelete = (roleId: string) => {
        setDeleteRoleId(roleId)
        onDeleteModalOpen()
    }

    const confirmDelete = () => {
        console.log('Delete role:', deleteRoleId)
        onDeleteModalClose()
        setDeleteRoleId(undefined)
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
                    
                    {/* ================= FILTER BAR ================= */}
                    <FilterBar
                        searchInput={{
                            placeholder: 'Search by role name',
                            className: 'w-full md:w-72'
                        }}
                        items={filterItems}
                    />

                    {/* ================= TABLE ================= */}
                    <RoleTable
                        data={rolesData}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    <Pagination
                        currentPage={1}
                        totalItems={100}
                        itemsPerPage={25}
                        onPageChange={(page) => {
                            console.log('Page changed:', page)
                        }}
                        showingText="Roles & Permissions"
                    />
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
