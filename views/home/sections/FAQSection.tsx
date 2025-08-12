import { Accordion, Button, Container } from '@/components'
import { faqData } from '@/data'
import { ArrowRightIcon } from '@heroicons/react/16/solid'
import Image from 'next/image'
import React from 'react'

const FAQSection = () => {
    return (
        <div className="relative py-10">

            <Container className='relative z-10'>

                <h2 className='font-pangaia text-xl sm:text-2xl lg:text-3xl font-semibold'>
                    Frequently Asked Questions
                </h2>

                <div className="space-y-3 my-10">

                    {faqData.map((faq, index) => (
                        <Accordion
                            key={index}
                            title={faq.question}
                            defaultOpen={index === 0}>
                            <p className="text-sm text-secondary-text">{faq.answer}</p>
                        </Accordion>
                    ))}

                </div>

                <Button className='text-yellow mx-auto' variant='light'
                    endContent={<ArrowRightIcon className='size-4' />}> 
                    Load More </Button>

            </Container>

            <Image width={1512} height={515} src="/img/home/4.png"
                className='absolute top-0 w-full inset-0'
                alt="Home Bg" />

        </div>
    )
}

export default FAQSection