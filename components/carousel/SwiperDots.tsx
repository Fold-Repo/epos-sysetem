import React from 'react';
import { cn } from '@/lib';

type Props = {
    variant?: 'default' | 'primary' | 'white';
    className?: string;
    id?: string;
};

const SwiperDots: React.FC<Props> = ({ variant = 'default', className = '', id }) => {
    return (
        <div id={id} className={cn(
                'sw-dots type-circle',
                {
                    'primary': variant === 'primary',
                    'white': variant === 'white',
                },
                className
            )}
        />
    );
};

export default SwiperDots;
