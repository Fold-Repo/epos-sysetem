import { Button, Container } from '@/components'
import Image from 'next/image'
import React from 'react'

const advantages = [
    {
        img: '/img/home_2/1.png',
        title: 'Simple & Flexible',
        desc: 'Suitable for all business',
    },
    {
        img: '/img/home_2/2.png',
        title: 'Super-fast Transactions',
        desc: 'Experiences Speed Enhance Efficiency',
    }
]

const UnveilingAdvantage = () => {
    return (
        <Container className="py-10 space-y-10">

            <div className="flex flex-col items-center justify-center">

                <div className="space-y-4 max-w-3xl mx-auto text-center">
                    <h2 className='font-pangaia text-xl sm:text-2xl lg:text-3xl font-semibold'> Unveiling the Advantages of our POS System </h2>
                    <p className='text-sm lg:text-base'>
                        Discover the Transformative power of our state-of the-art point of sales application , crafted to elevate every aspart of your retail operations with elegance and precision.
                    </p>
                </div>

            </div>

            <div className="grid sm:grid-cols-2 gap-5">
                {advantages.map(({ img, title, desc }, index) => (
                    <div key={index} className="bg-white rounded-xl border-b-3 border-deep-purple p-3">

                        <div className="bg-[#0E76A81A] aspect-7/5 rounded-lg overflow-hidden">
                            <Image
                                src={img}
                                width={612}
                                height={385}
                                className='w-full h-full object-cover'
                                alt={title}
                            />
                        </div>

                        <div className="space-y-1.5 text-center flex flex-col justify-center pt-5 pb-3">

                            <h2 className="text-lg lg:text-xl font-bold text-primary-text">{title}</h2>
                            <p className='text-sm lg:text-base text-secondary-text pb-5'>{desc}</p>

                            <Button
                                radius='full'
                                variant='bordered'
                                className='border-1 border-yellow text-yellow mx-auto max-w-max px-12'>
                                More Information
                            </Button>

                        </div>
                        
                    </div>
                ))}
            </div>

        </Container>
    )
}

export default UnveilingAdvantage