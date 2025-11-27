'use client'

import React from 'react'
import { cn } from '@/lib'

export interface LegendItem {
    dataKey: string
    label: string
    color: string
    visible?: boolean
}

interface ChartLegendProps {
    items: LegendItem[]
    onToggle?: (dataKey: string) => void
    className?: string
    itemClassName?: string
    indicatorSize?: 'sm' | 'md' | 'lg'
    indicatorShape?: 'circle' | 'square' | 'rounded'
    textSize?: 'xs' | 'sm' | 'base'
    gap?: 'sm' | 'md' | 'lg'
}

const ChartLegend: React.FC<ChartLegendProps> = ({
    items,
    onToggle,
    className,
    itemClassName,
    indicatorSize = 'md',
    indicatorShape = 'circle',
    textSize = 'xs',
    gap = 'md',
}) => {
    const sizeClasses = {
        sm: 'size-2',
        md: 'size-2.5',
        lg: 'size-3',
    };

    const shapeClasses = {
        circle: 'rounded-full',
        square: 'rounded-none',
        rounded: 'rounded-sm',
    };

    const textSizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
    };

    const gapClasses = {
        sm: 'gap-2',
        md: 'gap-3',
        lg: 'gap-4',
    };

    const itemGapClasses = {
        sm: 'gap-1',
        md: 'gap-1.5',
        lg: 'gap-2',
    };

    return (
        <div className={cn('flex items-center', gapClasses[gap], className)}>
            {items.map((item) => {
                const isVisible = item.visible !== false;
                const isInteractive = !!onToggle;

                return (
                    <div
                        key={item.dataKey}
                        className={cn(
                            'flex items-center',
                            itemGapClasses[gap],
                            isInteractive && 'cursor-pointer transition-opacity hover:opacity-80',
                            itemClassName
                        )}
                        onClick={() => isInteractive && onToggle?.(item.dataKey)}
                    >
                        <div
                            className={cn(
                                sizeClasses[indicatorSize],
                                shapeClasses[indicatorShape],
                                'transition-opacity'
                            )}
                            style={{
                                backgroundColor: item.color,
                                opacity: isVisible ? 1 : 0.3,
                            }}
                        />
                        <span
                            className={cn(
                                textSizeClasses[textSize],
                                'text-slate-400 transition-opacity'
                            )}
                            style={{
                                opacity: isVisible ? 1 : 0.3,
                            }}
                        >
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default ChartLegend;

