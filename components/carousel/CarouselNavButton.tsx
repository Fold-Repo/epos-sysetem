import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib';

type Props = {
    direction: 'prev' | 'next';
    targetClass: string;
    className?: string;
};

const CarouselNavButton: React.FC<Props> = ({ direction, targetClass, className }) => {
    const Icon = direction === 'prev' ? ArrowLeftIcon : ArrowRightIcon;

    return (
        <button
            className={cn(
                `nav-${direction}-${targetClass} inline-flex items-center justify-center size-8 bg-primary text-white rounded-full z-10 cursor-pointer`,
                className
            )}>
            <Icon className="w-4" />
        </button>
    );
};

export default CarouselNavButton;
