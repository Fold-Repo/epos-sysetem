'use client'

import { InternetCheck } from '@/utils'
import { PWAInstallPrompt } from '@/components'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { ReactQueryProvider } from './ReactQueryProvider'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>

            <ReactQueryProvider>

                <ToastProvider placement='top-right' toastOffset={10} />

                {children}

                <InternetCheck />
                {/* <PWAInstallPrompt /> */}

            </ReactQueryProvider>

        </HeroUIProvider>
    )
}