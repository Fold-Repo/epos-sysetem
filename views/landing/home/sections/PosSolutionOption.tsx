import { Button, Container } from '@/components'
import { Edit2 } from 'iconsax-reactjs'
import Image from 'next/image'
import React from 'react'
import { MdWifi, MdWifiOff } from 'react-icons/md'

const PosSolutionOption = () => {
    return (
        <div className="relative py-10">

            <Container className='relative z-10'>

                <h2 className='font-pangaia text-xl sm:text-2xl lg:text-3xl font-semibold'>
                    POS Solutions Installation Options
                </h2>

                <div className="grid lg:grid-cols-2 gap-5 mt-8">

                    <div className="space-y-8">

                        <div className="space-y-3 text-sm leading-7">
                            <p>
                                In today's evolving business landscape, choosing the right POS software for Multi- Store Retail is crucial. Our system offers flexible installation options to align with your business needs, whether it's our Online Cloud or Thin Offline setup.
                            </p>
                            <p>What sets us apart is that we provide the same intuitive interface and robust functionality across both deployment models, guaranteeing a seamless and consistent user experience regardless of yourchoice.
                            </p>
                        </div>

                        <Button size='lg' className='bg-yellow text-white px-6' radius='full'
                        startContent={<Edit2 className='w-5' variant="Outline"/>}>
                            Start now - It's free 
                        </Button>

                    </div>

                    <div className="relative">


                        <Image src='/img/home/3.jpg' width={540} height={544} 
                        className='aspect-7/6 mx-auto rounded-t-2xl object-cover'
                        alt='Pos solution' />
                        
                        <div className="border-7 border-white/20 bg-white font-semibold rounded-xl py-2 px-4 
                            flex items-center gap-x-2 text-primary-text max-w-max absolute bottom-6 right-0 "
                            style={{ boxShadow: "0px 15.61px 45.26px 0px #9597A729" }}>
                            <MdWifiOff className='size-8 text-[#2757D2]' />
                            <span>Thin Offline POS</span>
                        </div>
                        
                        <div className="border-7 border-white/20 bg-white font-semibold rounded-xl py-2 px-4 
                            flex items-center gap-x-2 text-primary-text max-w-max absolute top-6 "
                            style={{ boxShadow: "0px 15.61px 45.26px 0px #9597A729" }}>
                            <MdWifi className='size-8 text-[#F2742D]' />
                            <span>Online Cloud POS</span>
                        </div>

                    </div>

                </div>

            </Container>

            <Image width={1512} height={515} src="/img/home/4.png" 
            className='absolute top-0 w-full inset-0'
            alt="Home Bg" />

        </div>
    )
}

export default PosSolutionOption

