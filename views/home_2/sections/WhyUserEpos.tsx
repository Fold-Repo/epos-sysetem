"use client"

import { Container } from '@/components'
import { InfoCard } from '@/components/cards'
import { CarouselNavButton, SwiperCarousel, SwiperDots, SwiperSlide } from '@/components/carousel'
import { EPOS_FEATURES } from '@/constants'
import React from 'react'

const WhyUserEpos = () => {

    const buttonStyle = 'bg-white border border-gray-200 shadow size-8 text-black'

    return (
        <Container className="space-y-16">

            <h2 className='font-pangaia text-xl sm:text-2xl lg:text-3xl font-semibold text-center'>
                Why use our Epos Services
            </h2>

            <SwiperCarousel
                mobile={1} sm={1} md={1} lg={2} xl={3}
                space={10} spaceMd={15} spaceLg={15}
                loop={true} centered
                autoplay
                // group={1} groupMd={1} groupLg={2} groupXl={2}
                paginationClass='.services_pagination'
                navPrevClass='.nav-prev-services'
                navNextClass='.nav-next-services'>

                {EPOS_FEATURES.map((feature, index) => (
                    <SwiperSlide key={index}>
                        <InfoCard
                            key={index}
                            icon={feature.icon}
                            color={feature.color}
                            title={feature.title}
                            description={feature.description}
                        />
                    </SwiperSlide>
                ))}


                {/* ==== NAV ==== */}
                <div className="flex items-center justify-center m-auto gap-x-5 pt-5">
                    <CarouselNavButton className={buttonStyle} direction="prev" targetClass="services" />
                    <CarouselNavButton className={buttonStyle} direction="next" targetClass="services" />
                </div>

            </SwiperCarousel>

        </Container>
    )
}

export default WhyUserEpos