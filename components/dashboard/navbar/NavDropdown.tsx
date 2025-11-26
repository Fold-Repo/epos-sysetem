import React from 'react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from '@heroui/react'

const NavDropdown = () => {

    return (
        <Dropdown>
            <DropdownTrigger>
                <User
                    as="button"
                    avatarProps={{
                        isBordered: true,
                        src: "/img/avatar.png",
                        className: "size-8.5 rounded-lg sm:size-9",
                        radius: "md",
                    }}
                    className="transition-transform"
                    description="oluwafemi.s@gmaim.com"
                    name="Oluwafemi Samson"
                    classNames={{
                        name: 'text-xs font-medium truncate max-w-32 pt-1 hidden sm:block',
                        description: 'text-[12px] truncate max-w-30 hidden sm:block',
                        base: 'gap-x-3',
                    }}
                />
            </DropdownTrigger>
            <DropdownMenu itemClasses={{
                title: 'text-xs',
                base: 'py-1.5'
            }} aria-label="User Actions" variant="flat">
                <DropdownItem href='dashboard/settings' key="settings">Settings</DropdownItem>
                <DropdownItem key="logout" color="danger">
                    Log Out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}

export default NavDropdown