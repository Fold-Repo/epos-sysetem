"use client"

import { Container } from '@/components'
import { TestimonialCard } from '@/components/cards'
import { CarouselNavButton, SwiperCarousel, SwiperSlide } from '@/components/carousel'
import { testimonials } from '@/data'
import React, { useState } from 'react'

const ClientReview = () => {

    const [ active, setActive ] = useState(0)

    return (
        <Container className='space-y-16 py-10 bg-[#F1F1F1]'>

            <div className="text-center space-y-3">
                <h2 className='font-pangaia text-xl sm:text-2xl lg:text-3xl font-semibold'>
                    What Our Clients Say About Us</h2>
            </div>

            <SwiperCarousel
                mobile={1} sm={1} md={1} lg={2} xl={3}
                space={10} spaceMd={15} spaceLg={15}
                loop={true} centered
                autoplay
                // group={1} groupMd={1} groupLg={2} groupXl={2}
                navPrevClass='.nav-prev-testimonial'
                navNextClass='.nav-next-testimonial'
                onRealIndexChange={({ realIndex }) => setActive(realIndex)}>

                {testimonials.map((testimonial, index) => (
                    <SwiperSlide key={index}>
                        <TestimonialCard active={index === active} testimonial={testimonial} />
                    </SwiperSlide>
                ))}


                {/* ==== NAV ==== */}
                <div className="flex items-center justify-center m-auto gap-5 pt-12">
                    <CarouselNavButton className='bg-white border border-gray-200 shadow size-10 text-black' direction="prev" targetClass="testimonial" />
                    <CarouselNavButton className='bg-white border border-gray-200 shadow size-10 text-black' direction="next" targetClass="testimonial" />
                </div>

            </SwiperCarousel>

        </Container>
    )
}

export default ClientReview

