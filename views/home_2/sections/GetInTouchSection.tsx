import { Container } from '@/components'
import React from 'react'
import { GetIntoTouchForm } from '../components'
import Image from 'next/image'

const GetInTouchSection = () => {
    return (
        <div className='relative bg-[#EBEFFFE5]'>

            <Container className='relative grid lg:grid-cols-2 gap-x-5 gap-y-12 min-h-full pb-12 lg:pb-0 pt-12 z-[10]'>

                <div className="max-w-lg space-y-4">

                    <h2 className='text-3xl font-medium'> Lets Get in <span className='text-deep-purple'>Touch!</span> </h2>

                    <p className='text-sm lg:text-base'>Have a question or need assistance? Reach out to us via email,
                        phone, or the contact form below. We're eager to assist you.</p>

                    <h6 className='text-sm font-semibold text-deep-purple'>Nice hearing from you!</h6>

                    <Image src='/img/home_2/5.png' width={593} height={620}
                        className='relative object-contain z-[10]'
                        alt='Pos solution' />

                </div>

                <div className="flex justify-center lg:justify-end relative z-[10]">
                    <GetIntoTouchForm />
                </div>

            </Container>

            <Image src='/img/home_2/6.svg' width={478} height={453} alt='Svg' className='absolute top-0 left-1/2 -translate-x-1/2' />

            <svg className='hidden lg:block absolute bottom-0 ' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200">
                <path fill="#EAB30880" fillOpacity="1" d="M0,96L48,101.3C96,107,192,117,288,117.3C384,117,480,107,576,112C672,117,768,139,864,138.7C960,139,1056,117,1152,96C1248,75,1344,53,1392,42.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>

        </div>
    )
}

export default GetInTouchSection