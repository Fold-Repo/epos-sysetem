import { Button, Input, PhoneNumberInput, TextArea } from '@/components'
import React from 'react'

const GetStartedForm = () => {
    return (
        <div className="
            bg-white 
                w-full max-w-xl 
                p-5 md:p-8 
                rounded-2xl 
                border-solid 
                border-t-2 
                border-r-2 
                border-b-[6px] 
                border-l-2 
                border-yellow-500 
                backdrop-blur-[124px] 
                shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">

            <div className="text-center space-y-1.5">
                <h2 className='text-primary-text font-bold text-3xl'> Get Started </h2>
                <p className='text-secondary-text font-medium'>Explore EPOS at Zero-Cost</p>
            </div>

            <form className='mt-10'>

                <Input
                    name='name'
                    label="Enter your name"
                    placeholder="Name"
                    radius='lg'
                />

                <Input
                    name='email'
                    type='email'
                    label="Enter your name"
                    placeholder="Email"
                    radius='lg'
                />

                <PhoneNumberInput
                    radius='lg'
                    label='Enter your Phone' 
                    placeholder='Phone Number' />

                <TextArea label='Enter Your Message' radius='lg' placeholder='Enter your message' />

                <Button className='bg-yellow text-white w-full mt-8' radius='full' size='lg'> Submit </Button>

            </form>


        </div>
    )
}

export default GetStartedForm