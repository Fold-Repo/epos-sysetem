'use client'

import { InternetCheck } from '@/utils'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { ReactQueryProvider } from './ReactQueryProvider'
import { store } from '@/store'
import { Provider } from 'react-redux'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>

            <Provider store={store}>

                <ReactQueryProvider>

                    <ToastProvider placement='top-right' toastOffset={10} />

                    {children}

                    <InternetCheck />
                    {/* <PWAInstallPrompt /> */}

                </ReactQueryProvider>

            </Provider>

        </HeroUIProvider>
    )
}