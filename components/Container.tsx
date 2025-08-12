import { cn } from '@/lib';
import React, { ReactNode } from 'react';

interface ContainerProps {
    children: ReactNode;
    width?: string;
    className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, width = "max-w-7xl", className }) => {
    return (
        <div className={cn(
            'container mx-auto 2xl:max-w-[80%] px-4 sm:px-6 flex-grow',
            width,
            className
        )}>
            {children}
        </div>
    );
};

export default Container;
