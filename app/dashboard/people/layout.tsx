import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Roles & Permissions",
};

const RolesPermissionsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>{children}</>
    )
}

export default RolesPermissionsLayout