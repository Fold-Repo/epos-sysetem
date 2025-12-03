import { Container } from '@/components'
import Image from 'next/image'
import React from 'react'

const SupportingBusinesses = () => {
    return (
        <Container className="space-y-16 py-8">

            <div className="max-w-2xl space-y-3">
                <h2 className='font-pangaia text-xl sm:text-2xl lg:text-3xl font-semibold'>
                    Supporting local businesses. Around the globe</h2>
                <p className='text-sm lg:text-base text-slate-700'>
                    In today's evolving business landscape, choosing the right POS software for Multi- Store Retail is crucial. Our system offers flexible installation options to align with your business needs, whether it's our Online Cloud or Thin Offline setup.
                </p>
            </div>

            <div className="max-w-7xl mx-auto">
                <Image className='md:h-[600px] 2xl:h-full' src='/img/map.svg' width={1173} height={650} alt='Map' />
            </div>

        </Container>
    )
}

export default SupportingBusinesses

