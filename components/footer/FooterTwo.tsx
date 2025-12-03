import React from 'react'
import Container from '../Container'
import { LinkGroup, NavLink } from './FooterLinks'
import { ArrowRightIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/16/solid'
import Image from 'next/image'
import { Button } from '../ui'

const FooterTwo = () => {
    return (
        <footer className="relative z-10 bg-deep-purple py-10">

            <Container className="mx-auto flex flex-wrap gap-y-5 pb-10">

                <LinkGroup header="Quick Links">
                    <NavLink link="/#" label="Features" />
                    <NavLink link="/#" label="Pricing" />
                    <NavLink link="/#" label="Integrations" />
                    <NavLink link="/#" label="Testimonials" />
                    <NavLink link="/#" label="Blog" />
                </LinkGroup>

                <LinkGroup header="Solutions">
                    <NavLink link="/#" label="Retail" />
                    <NavLink link="/#" label="Restaurants" />
                    <NavLink link="/#" label="Cafes & Bars" />
                    <NavLink link="/#" label="Service Businesses" />
                    <NavLink link="/#" label="Enterprise" />
                </LinkGroup>

                <LinkGroup header="Support">
                    <NavLink link="/#" label="Help Center" />
                    <NavLink link="/#" label="Setup Guide" />
                    <NavLink link="/#" label="API Docs" />
                    <NavLink link="/#" label="System Status" />
                    <NavLink link="/#" label="Contact Us" />
                </LinkGroup>

                <LinkGroup header="Contact Info">

                    <div className="flex flex-col gap-y-4">

                        <div className="inline-flex items-center gap-x-2">
                            <div className="flex items-center justify-center bg-[#DDD6FE]/10 p-1 size-7 rounded-full text-white/70">
                                <EnvelopeIcon className='size-4.5' />
                            </div>
                            <a href="mailto:" className='text-xs text-white/80'> support@epos.com </a>
                        </div>

                        <div className="inline-flex items-center gap-x-2">
                            <div className="flex items-center justify-center bg-[#DDD6FE]/10 p-1 size-7 rounded-full text-white/70">
                                <MapPinIcon className='size-4.5' />
                            </div>
                            <p className='text-xs text-white/80'> 123 Tech Street, San Francisco, CA </p>
                        </div>

                    </div>

                </LinkGroup>

                <div className="w-full sm:w-2/3 lg:w-3/12 bg-white/10 p-8 space-y-4">

                    <h2 className="text-sm font-semibold text-white">Newsletter</h2>

                    <form className="relative w-full overflow-hidden rounded-lg">

                        <input type="email" required placeholder="Email address" 
                            className="block w-full pl-3 pr-16 py-3 text-xs text-black bg-white rounded-lg !outline-0 !ring-0 !shadow-none" />

                        <Button size='sm' type='submit' className='absolute top-1/2 -translate-y-1/2 right-0 !text-xs p-2 
                            rounded-l-none h-11 bg-yellow text-white'>
                                <ArrowRightIcon className='size-5' />
                            </Button>

                    </form>

                    <p className="text-xs leading-6 text-white">
                        Streamline your business operations with our cutting-edge POS system.
                        Fast, reliable, and designed for modern businesses of all sizes.
                    </p>

                </div>

            </Container>

            <div className="bg-[#C084FC]/20 h-[0.2px] flex-1" />

            <Container className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-10">

                <Image
                    src='/img/logo/logo_2.svg'
                    className="w-24"
                    width={119}
                    height={52}
                    alt="E-POS Logo"
                />

                <p className='text-soft-lilac text-xs'> © Copyright {new Date().getFullYear()} E-POS | All Rights Reserved </p>

                <div className="flex items-center gap-x-4">

                    <a href="http://" target="_blank" rel="noopener noreferrer">
                        <Image src='/img/social/facebook.svg' alt='Facebook'
                            width={35} height={35} />
                    </a>

                    <a href="http://" target="_blank" rel="noopener noreferrer">
                        <Image src='/img/social/linkedin.svg' alt='Facebook'
                            width={35} height={35} />
                    </a>

                    <a href="http://" target="_blank" rel="noopener noreferrer">
                        <Image src='/img/social/instagram.svg' alt='Facebook'
                            width={35} height={35} />
                    </a>

                    <a href="http://" target="_blank" rel="noopener noreferrer">
                        <Image src='/img/social/youtube.svg' alt='Facebook'
                            width={35} height={35} />
                    </a>

                </div>

            </Container>

        </footer>
    )
}

export default FooterTwo

