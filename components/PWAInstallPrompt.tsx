'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@heroui/react'
import { BiX } from 'react-icons/bi'
import Image from 'next/image'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showPrompt, setShowPrompt] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)
    const isDev = process.env.NODE_ENV === 'development'

    useEffect(() => {

        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true)
            return
        }

        // Check if app was installed before
        if (localStorage.getItem('pwa-installed') === 'true') {
            setIsInstalled(true)
            return
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            setShowPrompt(true)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        // In dev mode, show the prompt after delay even without the event (for testing)
        const timer = setTimeout(() => {
            if (isDev && !deferredPrompt) {
                // Show in dev mode for testing
                setShowPrompt(true)
            } else if (deferredPrompt) {
                setShowPrompt(true)
            }
        }, 3000) // Show after 3 seconds

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            clearTimeout(timer)
        }
    }, [deferredPrompt, isDev])

    const handleInstall = async () => {
        if (!deferredPrompt) {
            // In dev mode, just show a message
            if (isDev) {
                alert('PWA Install Prompt: In production, this would trigger the native install prompt. The beforeinstallprompt event typically only fires on HTTPS or deployed sites.')
                setShowPrompt(false)
                return
            }
            return
        }

        // Show the install prompt
        await deferredPrompt.prompt()

        // Wait for the user to respond
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === 'accepted') {
            localStorage.setItem('pwa-installed', 'true')
            setIsInstalled(true)
        }

        setDeferredPrompt(null)
        setShowPrompt(false)
    }

    const handleDismiss = () => {
        setShowPrompt(false)
        // Don't show again for this session
        sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    }

    // Don't show if already installed or dismissed this session
    // In dev mode, show even without deferredPrompt for testing
    if (isInstalled || !showPrompt || sessionStorage.getItem('pwa-prompt-dismissed') === 'true') {
        return null
    }

    // In production, require deferredPrompt
    if (!isDev && !deferredPrompt) {
        return null
    }

    return (
        <AnimatePresence>
            {showPrompt && (

                <div className="container">

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg mx-auto px-4">

                        <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-lg p-2.5 
                        sm:p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 relative">

                            <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full sm:w-auto">

                                <div className="shrink-0 w-10 h-10 flex items-center justify-center overflow-hidden">
                                    <Image src="/img/logo/logo.svg" alt="EPOS App" width={40} height={40} className="w-full h-full object-contain" />
                                </div>

                                <div className="f">
                                    <p className="text-gray-800 font-medium text-sm">
                                        Install EPOS 🚀
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                        Get a better experience with us.
                                    </p>
                                </div>

                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2 sm:pt-0">

                            <Button className='text-xs w-full sm:w-auto' onPress={handleInstall} color="primary" size="sm">
                                Install
                            </Button>

                            <Button className='bg-gray-100! absolute top-3 right-3 sm:relative sm:top-0 sm:right-0' isIconOnly onPress={handleDismiss} radius='full' size="sm">
                                <BiX className="w-4 h-4 text-black" />
                            </Button>

                        </div>

                        </div>

                    </motion.div>

                </div>
            )}
        </AnimatePresence>
    )
}

export default PWAInstallPrompt

