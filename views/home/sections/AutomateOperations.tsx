import { Container } from '@/components'
import { InfoCard } from '@/components/cards'
import { EPOS_FEATURES } from '@/constants'
import React from 'react'



const AutomateOperations = () => {
    return (
        <div className="bg-[#F4F8FF] py-8">

            <Container>

                <div className="max-w-xl space-y-4">
                    <h2 className='font-pangaia text-xl sm:text-2xl lg:text-3xl font-semibold'>
                        Features that Automate Your Operations During High-Tides!
                    </h2>
                    <p className='text-sm lg:text-base text-slate-700'>
                        Get The Best Advise and Reach Heights in Your Business
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                    {EPOS_FEATURES.map((feature, index) => (
                        <InfoCard
                            key={index}
                            icon={feature.icon}
                            color={feature.color}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>

            </Container>
            
        </div>
    )
}

export default AutomateOperations
