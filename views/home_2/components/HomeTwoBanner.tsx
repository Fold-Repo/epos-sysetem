import { Button, Container } from '@/components';
import { StatsCard } from '@/views/home';
import React from 'react';

const HomeTwoBanner = () => {
    return (
        <div className="
                relative flex items-center
                min-h-[80vh] md:min-h-[92vh]
                bg-[url('/img/banner/1.png')] bg-no-repeat bg-cover bg-top">

            {/* ==== Overlay ==== */}
            <div className="absolute inset-0 bg-black/50"></div>

            <Container>

                <div className="
                        relative z-[1]
                        flex flex-col justify-center text-center text-white
                        mx-auto max-w-lg space-y-6
                        md:mx-0 md:text-left md:justify-start -mt-24 md:-mt-0">

                    <h2 className="
                            font-pangaia font-semibold
                            text-3xl md:text-5xl 2xl:text-6xl">
                        Smart POS for Modern Businesses
                    </h2>

                    <p className="
                            leading-7
                            text-sm md:text-base 2xl:text-lg">
                        Sell faster, manage smarter, and grow your business with ease.
                    </p>

                    <Button
                        radius="full"
                        className="
                            max-w-max py-6 px-10
                            mx-auto md:mx-0 bg-yellow text-white">
                        Try Free Demo
                    </Button>

                </div>

            </Container>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2
                w-full max-w-7xl 2xl:max-w-[80%] px-4 z-[2]">
                <StatsCard />
            </div>

        </div>
    );
};

export default HomeTwoBanner;
