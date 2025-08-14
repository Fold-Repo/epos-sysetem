import { Container } from '@/components'
import { PricingCard } from '@/components/cards'
import { pricingPlans } from '@/data'
import React from 'react'

const FlexiblePricing = () => {
    return (
        <Container className="py-10 space-y-10">

            <div className="space-y-4 max-w-3xl mx-auto text-center">
                <h2 className='font-pangaia text-xl sm:text-2xl lg:text-3xl font-semibold'> Flexible Pricing for Every Event </h2>
                <p className='text-sm lg:text-base'>
                    Choose the plan that fits your needs. All plans include essential features to get you started, with options to scale as your Business. No hidden fees and the flexibility to change anytime.
                </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pricingPlans.map((pricing, index) => (
                    <PricingCard key={index} pricing={pricing} />
                ))}
            </div>

        </Container>
    )
}

export default FlexiblePricing