'use client'

import React from 'react'
import Image from 'next/image'
import { TestimonialType } from '@/types'

const TestimonialCard = ({ testimonial, active }: { testimonial: TestimonialType; active: boolean }) => {

    const { name, role, message, image } = testimonial || {}

    return (
        <div className={`bg-white p-5 rounded-xl flex flex-col gap-y-6 text-center transition-all duration-300 !overflow-hidden ${active && '!py-14'} `}
            style={
                active
                    ? {
                        borderWidth: '2px 2px 6px 2px',
                        borderStyle: 'solid',
                        borderImageSource:
                            'linear-gradient(83.69deg, #4449ED -25.33%, #4592FD 39.47%, #8245F4 100.41%)',
                        borderImageSlice: 1,
                        boxShadow: '0px 44px 63.9px 0px #4572F621',
                        borderRadius: '0.75rem'
                    }
                    : { border: '1px solid #E4EAF3' }
            }>

            <p className={`font-medium text-sm leading-6 ${active ? 'text-primart-text' : 'text-[#757C9D]'} `}>
                { message }
            </p>

            <div className='flex flex-col items-center justify-center gap-y-2'>

                <Image
                    src={image}
                    alt={name}
                    width={300}
                    height={300}
                    className="rounded-full size-16 object-cover"
                />

                <div className="space-y-1.5">
                    <h2 className='font-semibold text-primary-text text-sm'> { name } </h2>
                    <p className='text-xs text-[#757C9D'> { role } </p>
                </div>

            </div>

        </div>
    )
}

export default TestimonialCard

