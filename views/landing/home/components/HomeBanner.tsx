import { Button, Container } from '@/components';
import React from 'react';

const HomeBanner = () => {
    return (
        <div className="
                relative flex items-center
                min-h-[60vh] md:min-h-[92vh]
                bg-[url('/img/banner/1.png')] bg-no-repeat bg-cover bg-top">

            {/* ==== Overlay ==== */}
            <div className="absolute inset-0 bg-black/50"></div>

            <Container>

                <div className="
                        relative z-[1]
                        flex flex-col justify-center text-center text-white
                        mx-auto max-w-lg space-y-6
                        md:mx-0 md:text-left md:justify-start">

                    <h2 className="
                            font-pangaia font-semibold
                            text-3xl md:text-5xl 2xl:text-6xl">
                        Streamline Your Business
                    </h2>

                    <p className="
                            leading-7
                            text-sm md:text-base 2xl:text-lg">
                        Transform your retail operations with our cutting-edge POS system.
                        Fast, reliable, and designed for modern businesses.
                    </p>

                    <Button
                        radius="full"
                        className="
                            max-w-max py-6 px-10
                            mx-auto md:mx-0 bg-yellow text-white">
                        Start Free Trial
                    </Button>

                </div>

            </Container>

        </div>
    );
};

export default HomeBanner;

