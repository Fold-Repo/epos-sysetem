import React from 'react'
import Container from '../Container'
import { LinkGroup, NavLink } from './FooterLinks'
import { EnvelopeIcon, MapPinIcon } from '@heroicons/react/16/solid'
import Image from 'next/image'

const Footer = () => {
    return (
        <footer className="relative z-10 bg-[#0A142F] py-10">

            <Container className="mx-auto flex flex-wrap gap-y-5 pb-10">

                <div className="mb-5 w-full px-4 sm:w-2/3 lg:w-3/12">

                    <p className="text-sm font-[300] leading-6 text-white">
                        Streamline your business operations with our cutting-edge POS system.
                        Fast, reliable, and designed for modern businesses of all sizes.
                    </p>

                </div>

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

            </Container>

            <div className="flex items-center pb-5">
                <div className="bg-[#C084FC]/20 h-[0.2px] flex-1"></div>
                <div className="mx-4">
                    <Image
                        src='/img/logo/logo_2.svg'
                        className="w-24"
                        width={119}
                        height={52}
                        alt="E-POS Logo"
                    />
                </div>
                <div className="bg-[#C084FC]/20 h-[0.2px] flex-1"></div>
            </div>

            <div className="flex flex-col items-center justify-center mx-auto gap-y-6">

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

            </div>

        </footer>
    )
}

export default Footer