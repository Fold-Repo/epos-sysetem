import React from 'react'
import { Button, Input, PhoneNumberInput, TextArea } from '@/components'

const GetIntoTouchForm = () => {
    return (
        <form className='w-full max-w-lg space-y-4'>

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

    )
}

export default GetIntoTouchForm