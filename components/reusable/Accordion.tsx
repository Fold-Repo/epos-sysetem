'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib';
import { AddSquare, Minus } from 'iconsax-reactjs';

type AccordionProps = {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
    className?: string;
    contentClassName?: string;
    buttonClassName?: string;
};

export default function Accordion({
    title,
    children,
    defaultOpen = false,
    className,
    contentClassName,
    buttonClassName
}: AccordionProps) {

    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={cn(
            'w-full p-4 rounded-lg bg-white border border-[#E4EAF3] transition-shadow duration-300',
            isOpen && 'shadow-[0px_10px_24px_0px_#E8F3FD]',
            className
        )}>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex w-full items-center justify-between text-base text-left font-semibold text-secondary-text cursor-pointer',
                    isOpen && 'text-primary-text', buttonClassName
                )}>
                <span>{title}</span>
                <div className="transform transition-transform duration-300">
                    {isOpen ? (
                        <Minus size="26" color="#EAB308" variant="Bulk" />
                    ) : (
                        <AddSquare size="26" color="#EAB308" variant="Outline" />
                    )}
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="accordion"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden">

                        <div className={cn(
                            'mt-3',
                            contentClassName
                        )}>
                            {children}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

