import { Container } from '@/components'
import { ChevronDoubleRightIcon } from '@heroicons/react/16/solid'
import React from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import { GetStartedForm } from '../components'

const SellSmarter = () => {
    return (
        <div className="relative bg-no-repeat bg-center bg-cover py-10" style={{
            backgroundImage: `url('/img/banner/3.jpg')`,
        }}>

            <div className="absolute inset-0 bg-black/80 z-10"></div>

            <Container className='relative z-10'>

                <div className="min-h-[200px]  grid lg:grid-cols-2 gap-x-5 gap-y-12">

                    <div className="w-full space-y-14">

                        <div className="space-y-2 text-white">
                            <h2 className='text-xl sm:text-2xl lg:text-3xl font-semibold font-pangaia'>Don’t Just Sell, Sell Smarter with E-POS!</h2>
                            <p className='text-sm'>A <span className="text-yellow font-medium">100% Guaranteed Business</span> Growth Solution</p>
                        </div>

                        <div className="flex flex-col space-y-8">

                            <div className="inline-flex items-start gap-x-2 text-white">

                                <FaPencilAlt className='size-5' />

                                <div>
                                    <h2 className="text-base font-semibold pb-1">Fill Up Your Details</h2>
                                    <p className='text-sm text-white/80'>Our team will get in touch with you shortly.</p>
                                </div>

                            </div>

                            <div className="inline-flex items-start gap-x-2 text-white">

                                <ChevronDoubleRightIcon className='size-6' />

                                <div>
                                    <h2 className="text-base font-semibold pb-1">Fill Up Your Details</h2>
                                    <p className='text-sm text-white/80'>Our team will get in touch with you shortly.</p>
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <GetStartedForm />
                    </div>

                </div>

            </Container>

        </div>
    )
}

export default SellSmarter
