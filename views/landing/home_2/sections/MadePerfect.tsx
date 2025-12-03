import { Container } from '@/components'
import { InfoCard } from '@/components/cards'
import { Convert3DCube } from 'iconsax-reactjs'
import React from 'react'

const features = [
    {
        icon: <Convert3DCube size="35" color="#C084FC" variant="Bulk" />,
        color: '#C084FC',
        title: "Inventory Management",
        description: "Lorem ipsum dolor sit amet consectetur. Eu eget tellus quisque a. Quis montes nec tellus facilisi rhoncus proin ultrices. Egestas donec st."
    },
    {
        icon: <Convert3DCube size="35" color="#C084FC" variant="Bulk" />,
        color: '#C084FC',
        title: "Inventory Management",
        description: "Lorem ipsum dolor sit amet consectetur. Eu eget tellus quisque a. Quis montes nec tellus facilisi rhoncus proin ultrices. Egestas donec st."
    },
    {
        icon: <Convert3DCube size="35" color="#C084FC" variant="Bulk" />,
        color: '#C084FC',
        title: "Inventory Management",
        description: "Lorem ipsum dolor sit amet consectetur. Eu eget tellus quisque a. Quis montes nec tellus facilisi rhoncus proin ultrices. Egestas donec st."
    },
]

const MadePerfect = () => {
    return (
        <Container className="space-y-10">

                <div className="space-y-4 max-w-3xl mx-auto text-center">
                    <h2 className='font-pangaia text-xl sm:text-2xl lg:text-3xl font-semibold'>
                        Sales Made Simple, Points Made Perfect!
                    </h2>
                    <p className='text-sm lg:text-base'>
                        Sell products in-store and on the go with E- POS on any device. Manage sales, inventory, and more seamlessly across any outlet.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                    {features.map((feature, index) => (
                        <InfoCard
                            key={index}
                            icon={feature.icon}
                            color={feature.color}
                            title={feature.title}
                            variant='border_b'
                            description={feature.description}
                        />
                    ))}
                </div>

        </Container>
    )
}

export default MadePerfect

