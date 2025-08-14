"use client"

import { Container, HeroVideoDialog, SegmentedTabs } from '@/components'
import React, { useState } from 'react'

const tabs = [
    { key: "admin", value: "Admin" },
    { key: "sales", value: "Sales" },
    { key: "purchase", value: "Purchase" },
]
const SaleMadeSimple = () => {

    const [active, setActive] = useState('')

    return (
        <div className="py-10">

            <Container className="flex flex-col items-center justify-center !max-w-2xl mx-auto space-y-10">

                <SegmentedTabs
                    tabs={tabs}
                    value={active}
                    onChange={(key) => setActive(key)}
                />

                <div className="space-y-4 text-center">
                    <h2 className='font-pangaia text-xl sm:text-2xl lg:text-3xl font-semibold'> Sales Made Simple, Points Made Perfect! </h2>
                    <p className='text-sm lg:text-base'>Sell products in-store and on the go with E- POS on any device. Manage sales,
                        inventory, and more seamlessly across any outlet.</p>
                </div>

            </Container>

            <div className="relative">

                <HeroVideoDialog className='mx-auto max-w-5xl 2xl:max-w-7xl z-10' videoSrc='/video/1.mp4' />

                <img src="/img/home/1.png" alt="POS" className='hidden lg:block w-72 absolute left-0 -top-12' />

                <img src="/img/home/2.png" alt="POS" className='hidden lg:block w-72 absolute right-0 -bottom-12' />

            </div>

        </div>
    )
}

export default SaleMadeSimple