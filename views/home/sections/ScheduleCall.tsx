import { Button, Container } from '@/components';
import React from 'react';
import { StatsCard } from '../components';

const ScheduleCall = () => {
    return (
        <div className="py-8 bg-no-repeat bg-center bg-cover"
            style={{
                backgroundImage: `
                linear-gradient(270deg, #0E1420 0%, rgba(0, 0, 0, 0) 100%),
                url('/img/banner/2.png')`,
            }}>

            <Container>

                <div className="min-h-[200px]  flex flex-col justify-between gap-y-12">

                    <div className="flex items-center flex-wrap gap-5 justify-between">

                        <div className="space-y-1.5 text-white">
                            <h2 className='text-2xl font-semibold font-pangaia'>Schedule Call With Our Experts</h2>
                            <p className='text-sm'>Get The Best Advise and Reach Heights in Your Business</p>
                        </div>

                        <Button variant='bordered' radius='full' className='text-yellow border-yellow px-6'> Watch Demo </Button>

                    </div>

                    <StatsCard />

                </div>

            </Container>

        </div>
    );
};

export default ScheduleCall;
