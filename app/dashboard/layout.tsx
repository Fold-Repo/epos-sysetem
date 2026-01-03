'use client'

import { NavBar, SideBar } from '@/components'
import React, { useState } from 'react'
import { DASHBOARD_ROOT, DASHBOARD_SECTIONS } from '@/constants'
import { usePermissions, useFetchAllData } from '@/hooks'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    const [open, setOpen] = useState<boolean>(false)
    const { permissions } = usePermissions()
    
    // Fetch all data entities and populate Redux state
    useFetchAllData()

    return (
        <>

            <SideBar open={open} setOpen={setOpen} sections={DASHBOARD_SECTIONS} 
            root={DASHBOARD_ROOT} permissions={permissions} />

            <main className="relative h-full transition-all duration-200 ease-soft-in-out xl:ml-66">

                <NavBar setOpen={setOpen} showPosButton={false} root={DASHBOARD_ROOT} />

                <div className="w-full m-auto overflow-x-hidden bg-[#f4f7febc] min-h-screen">

                    {children}

                </div>

            </main>

        </>
    )
}

export default DashboardLayout