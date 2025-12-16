'use client'

import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react'
import Link from 'next/link'

interface NavDropdownProps {
    openLogoutModal: () => void
    openChangePasswordModal: () => void
    root?: string
}

const NavDropdown = ({ openLogoutModal, openChangePasswordModal, root = '/dashboard' }: NavDropdownProps) => {

    return (
        <Dropdown>

            <DropdownTrigger>
                <Avatar isBordered size="sm"
                    as="button" className="transition-transform"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
            </DropdownTrigger>

            <DropdownMenu variant="flat">

                <DropdownItem key="profile" className="h-12 gap-2 mb-2">
                    <p className="text-sm font-semibold">Signed in as</p>
                    <p className="text-xs truncate text-gray-600">zoey@example.com</p>
                </DropdownItem>

                <DropdownItem as={Link} href={`${root}/settings`} classNames={{
                    title: 'text-xs'
                }} className='py-1' key="settings">Settings</DropdownItem>

                <DropdownItem onPress={openChangePasswordModal} classNames={{
                    title: 'text-xs'
                }} className='py-1' key="password">Change Password</DropdownItem>

                <DropdownItem onPress={openLogoutModal} classNames={{
                    title: 'text-xs'
                }} className='py-1' key="logout" color="danger">
                    Log Out
                </DropdownItem>

            </DropdownMenu>

        </Dropdown>
    )
}

export default NavDropdown
