"use client"

import { Accordion, Button, Container, SegmentedTabs } from '@/components'
import { faqData } from '@/data'
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import React, { useState } from 'react'

const tabs = [
    { key: "all", value: "All" },
    { key: "basics", value: "Basics" },
    { key: "setup", value: "Setup" },
    { key: "features", value: "Features" },
    { key: "support", value: "Support" },
]

const QuestionsSection = () => {

    const [active, setActive] = useState('all')

    const filteredFaqs = active === "all"
        ? faqData
        : faqData.filter(faq => faq.category === active)

    return (
        <Container className='z-10'>

            <div className="grid lg:grid-cols-2 gap-x-5">

                <Image src='/img/home_2/4.png' width={640} height={815}
                    className='object-contain md:w-[500px] md:mx-auto'
                    alt='Pos solution' />

                <div className="bg-yellow p-6 md:p-10 rounded-2xl space-y-8 overflow-hidden">

                    <div className="space-y-2 text-center">

                        <h2 className='font-pangaia text-xl lg:text-2xl font-semibold text-center'>
                            Do you have questions?
                        </h2>

                        <p className="text-sm pb-2">
                            Everything you need to know about our POS system
                        </p>

                        <SegmentedTabs
                            tabs={tabs}
                            value={active}
                            onChange={(key) => setActive(key)}
                            className='max-w-fit md:max-w-xl mx-auto px-1.5 rounded-md border-none overflow-x-scroll'
                            buttonClassName='w-full'
                            activePillClassName='rounded-md'
                        />

                    </div>

                    <div className="space-y-1">

                        {filteredFaqs.map((item, index) => (
                            <Accordion
                                key={index}
                                className='bg-transparent shadow-none px-0 border-0 !border-b border-[#EBEBEB40] rounded-none text-[#585F81]'
                                title={item.question}>
                                <p className="text-sm text-[#202020]">
                                    {item.answer}
                                </p>
                            </Accordion>
                        ))}

                    </div>

                    <div className="flex items-center justify-center gap-x-2 pt-5">
                        <p className='text-xs text-white/90'>My question is not here.</p>
                        <Button className='bg-white px-5 !text-[11px]' size='sm'
                            endContent={<ArrowUpRightIcon className='size-3' />}>
                            CONNECT US
                        </Button>
                    </div>

                </div>

            </div>

        </Container>
    )
}

export default QuestionsSection

