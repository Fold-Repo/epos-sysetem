'use client'

import { InternetCheck } from '@/utils'
import { PWAInstallPrompt } from '@/components'
import { HeroUIProvider, ToastProvider } from '@heroui/react'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>

            <ToastProvider placement='top-right' toastOffset={10} />

            {children}

            <InternetCheck />
            {/* <PWAInstallPrompt /> */}

        </HeroUIProvider>
    )
}