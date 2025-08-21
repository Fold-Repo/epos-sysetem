import React from 'react'
import { HomeTwoBanner } from './components'
import { FooterTwo, Navbar } from '@/components'
import { MadePerfect, UnveilingAdvantage, WhatAreWeInto, WhyUserEpos, FlexiblePricing, 
QuestionsSection, ClientReview, GetInTouchSection, 
TransformBusiness} from './sections'

const HomeViewTwo = () => {
    return (
        <div className='bg-[#F8F8F8]'>

            <Navbar />

            <HomeTwoBanner />

            <div className="pt-10 space-y-10">

                <UnveilingAdvantage />

                <MadePerfect />

                <WhatAreWeInto />

                <WhyUserEpos />

                <FlexiblePricing />

                <QuestionsSection />

                <ClientReview />

                <GetInTouchSection />

                <TransformBusiness />

            </div>

            <FooterTwo />

        </div>
    )
}

export default HomeViewTwo