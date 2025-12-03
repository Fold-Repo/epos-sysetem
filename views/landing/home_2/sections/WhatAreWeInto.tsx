"use client"

import { Button, Container, SegmentedTabs } from '@/components'
import Image from 'next/image'
import React, { useState } from 'react'

const tabs = [
    { key: "vendor", value: "Vendor" },
    { key: "admin", value: "Admin" },
    { key: "sales", value: "Sales" },
    { key: "purchase", value: "Purchase" },
]

const WhatAreWeInto = () => {

    const [active, setActive] = useState('')

    return (
        <Container className="py-10 space-y-18">

            <div className="space-y-6 mx-auto max-w-6xl flex items-center justify-center flex-col">

                <h2 className='font-pangaia text-xl sm:text-2xl lg:text-3xl font-semibold text-center'>
                    What are we into?
                </h2>

                <SegmentedTabs
                    inactiveText='text-deep-purple'
                    tabs={tabs}
                    value={active}
                    onChange={(key) => setActive(key)}
                    className='w-full px-1.5 rounded-md border-none'
                    buttonClassName='w-full'
                    activePillClassName='rounded-md'
                />

            </div>

            <div className="grid items-center lg:grid-cols-2 gap-5 mt-8">

                <div className="max-w-lg space-y-6">

                    <h2 className='font-pangaia text-xl sm:text-2xl lg:text-3xl font-semibold'>
                        Revolutionizing with Vendor's Point of Sales System
                    </h2>

                    <p className=' text-sm leading-7 text-secondary-text'>
                        In this fast-paced world of food and beverage, efficiency and precision are paramount. Vendor Point of Sales solution meets the unique demands of the F&B industry.
                    </p>

                    <Button size='lg' className='bg-yellow text-white px-12' radius='full'>
                        Get a Demo
                    </Button>

                </div>

                <Image src='/img/home_2/3.png' width={600} height={400}
                    alt='Pos solution' />

            </div>

        </Container>
    )
}

export default WhatAreWeInto

