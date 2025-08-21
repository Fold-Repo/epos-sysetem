import { Button, Container } from '@/components'
import React from 'react'

const TransformBusiness = () => {
    return (
        <div className="relative bg-no-repeat bg-center bg-cover py-10 min-h-[400px] flex flex-col items-center justify-center" style={{
            backgroundImage: `url('/img/banner/4.jpg')`,
        }}>

            <div className="absolute inset-0 bg-black/80 z-10"></div>

            <Container className='inset-0 flex items-center justify-center  !max-w-3xl mx-auto z-10'>

                <div className="space-y-4 text-center text-white">

                    <h2 className='font-pangaia text-xl sm:text-2xl lg:text-3xl font-semibold'> 
                        Ready to Transform Your Business with Epos Payments?
                    </h2>

                    <p className='text-sm lg:text-base pb-10'>
                        Join hundreds of successful business owner who trust EPOS for seamless, secure, and smart transactions.
                    </p>

                    <Button className='px-12 mx-auto rounded-full bg-yellow text-white'> Start Your Free Trial Today!  </Button>

                </div>

            </Container>

        </div>
    )
}

export default TransformBusiness