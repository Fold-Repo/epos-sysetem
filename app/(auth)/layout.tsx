"use client"

import { Chip } from '@heroui/react'
import { usePathname } from 'next/navigation'
import React, { Suspense } from 'react'

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

                            <div className="h-full min-h-[50vh] lg:min-h-screen relative overflow-hidden flex flex-col bg-cover"
                                style={{
                                    backgroundImage: `url(/img/auth/auth_bg.png), linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0.01%, rgba(0, 0, 0, 0.54) 34.5%, rgba(0, 0, 0, 0.9) 100%)`,
                                    backgroundBlendMode: 'multiply'
                                }}>

                                <div className="flex items-center justify-center xl:gap-y-4 gap-y-3
                        flex-col w-full max-w-2xl mx-auto mt-auto p-12 pb-16 text-center">

                                    <h2 className='text-white text-xl xl:text-2xl font-medium'>
                                        Vendor Registration Technology Limited
                                    </h2>

                                    <p className='text-white text-sm leading-6!'>
                                        Complete your vendor registration to get started
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2 justify-center">
                                        <Chip size='sm' className='text-white bg-yellow/20 text-xs py-5 px-6'>
                                            Efficiency & Accuracy
                                        </Chip>
                                        <Chip size='sm' className='text-white bg-yellow/20 text-xs py-5 px-6'>
                                            24/7 Accessibility
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
                <div className='flex items-center justify-center min-h-screen py-6 bg-cover bg-center'
                    style={{
                        backgroundImage: `url(/img/auth/auth_2_bg.png)`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundBlendMode: 'multiply'
                    }}>
                    <div className="container">
                        <div className="bg-white rounded-xl w-full max-w-2xl md:min-h-[60vh] min-h-[50vh] mx-auto py-10 flex items-center justify-center">
                            <div className="w-full container">
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