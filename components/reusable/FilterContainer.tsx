'use client'

import React, { ReactNode, Children } from 'react'
import { cn } from '@/lib'

type FilterContainerProps = {
    children: ReactNode
    className?: string
    showDividers?: boolean
}

const FilterContainer: React.FC<FilterContainerProps> = ({ 
    children, 
    className,
    showDividers = true
}) => {

    const childArray = Children.toArray(children);

    return (
        <div className={cn("bg-[#E2E5E8] max-w-max rounded-[10px] p-[2px] flex items-center gap-1", className)}>
            {showDividers ? (
                childArray.map((child, index) => (
                    <React.Fragment key={index}>
                        {child}
                        {index < childArray.length - 1 && (
                            <div className="border-l border-[#A09CAB] h-4" />
                        )}
                    </React.Fragment>
                ))
            ) : (
                children
            )}
        </div>
    )
}

export default FilterContainer

