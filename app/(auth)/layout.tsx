"use client"

import { Chip } from '@heroui/react'
import { usePathname } from 'next/navigation'
import React, { Suspense } from 'react'
import { RippleEffect } from '@/components'

const Layout = ({ children }: { children: React.ReactNode }) => {

    const pathname = usePathname()

    const signupLayoutPaths = ['/signup']

    const layer_one = signupLayoutPaths.some(path => pathname?.includes(path))

    return (
        <Suspense>
            {layer_one ? (
                <div className='relative flex flex-col lg:flex-row min-h-screen'>

                    <div className="w-full hidden lg:block lg:w-[50%] lg:fixed lg:top-0 lg:left-0 order-2 lg:order-1">

                        <div className="lg:fixed lg:top-0 lg:left-0 lg:w-[50%] lg:h-full">

                            <div className="h-full min-h-[50vh] lg:min-h-screen relative overflow-hidden flex flex-col bg-gradient-to-br from-primary via-deep-purple to-primary/80">
                                {/* POS-themed geometric pattern overlay */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-yellow/30 rounded-full blur-3xl"></div>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/20 rounded-full blur-2xl"></div>
                                </div>

                                {/* Grid pattern for tech/POS feel */}
                                <div className="absolute inset-0 opacity-5" style={{
                                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                                    backgroundSize: '50px 50px'
                                }}></div>

                                <div className="flex items-center justify-center xl:gap-y-6 gap-y-4
                        flex-col w-full max-w-2xl mx-auto my-auto p-12 text-center">

                                    {/* POS Illustration */}
                                    <div className="w-full max-w-md mb-4">
                                        <img
                                            src="/img/pos-signup.jpg"
                                            alt="Modern Point of Sale System"
                                            className="w-full h-auto drop-shadow-2xl rounded-xl"
                                        />
                                    </div>

                                    <h2 className='text-white text-xl xl:text-2xl font-semibold'>
                                        Streamline Your Business Operations
                                    </h2>

                                    <p className='text-white/90 text-sm leading-relaxed max-w-lg'>
                                        Join thousands of businesses managing sales, inventory, and customer relationships with our modern point-of-sale system.
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2 justify-center pt-2">
                                        <Chip size='sm' className='text-white bg-white/20 backdrop-blur-sm text-xs py-5 px-6 border border-white/10'>
                                            Real-time Analytics
                                        </Chip>
                                        <Chip size='sm' className='text-white bg-white/20 backdrop-blur-sm text-xs py-5 px-6 border border-white/10'>
                                            Cloud-Based
                                        </Chip>
                                        <Chip size='sm' className='text-white bg-white/20 backdrop-blur-sm text-xs py-5 px-6 border border-white/10'>
                                            Multi-Store Support
                                        </Chip>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className='flex-1 flex items-center justify-center order-1 lg:order-2 
            lg:ml-[50%]'>

                        <div className="w-full max-w-lg lg:max-w-3xl mx-auto shrink-0 py-6">

                            <div className="container pt-4">

                                {children}

                            </div>

                        </div>

                    </div>

                </div>
            ) : (
                <div className='relative flex items-center justify-center min-h-screen py-6 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden'>
                    {/* Ripple effect at bottom right */}
                    <RippleEffect />

                    {/* Gradient at bottom right */}
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl -mr-48 -mb-48"></div>

                    <div className="container w-full relative z-10 flex items-center justify-center">
                        <div className="bg-white rounded-xl shadow-sm w-full max-w-sm mx-auto py-8 px-6 md:px-8 border border-gray-200 outline outline-1 outline-gray-100">
                            <div className="w-full">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Suspense>
    )
}

export default Layout