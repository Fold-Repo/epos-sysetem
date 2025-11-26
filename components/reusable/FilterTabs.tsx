'use client'

import React, { useState } from 'react'
import { cn } from '@/lib'
import { Select } from '../ui'

export interface FilterTabItem {
    key: string
    label: string
}

export interface FilterTabsProps {
    items: FilterTabItem[]
    defaultActiveKey?: string
    activeKey?: string
    onTabChange?: (key: string) => void
    className?: string
    selectClassName?: string
    tabClassName?: string
}

const FilterTabs: React.FC<FilterTabsProps> = ({
    items,
    defaultActiveKey,
    activeKey: controlledActiveKey,
    onTabChange,
    className,
    selectClassName,
    tabClassName
}) => {
    const [internalActiveKey, setInternalActiveKey] = useState(defaultActiveKey || items[0]?.key || '')
    
    const activeKey = controlledActiveKey !== undefined ? controlledActiveKey : internalActiveKey

    const handleTabClick = (key: string) => {
        if (controlledActiveKey === undefined) {
            setInternalActiveKey(key)
        }
        onTabChange?.(key)
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        handleTabClick(e.target.value)
    }

    return (
        <div className={cn('w-full md:w-fit', className)}>

            <div className="md:hidden">
                <Select name="filter-tabs" formGroupClass='mb-0 pb-0' 
                className={cn('w-full md:w-full h-10 md:h-auto text-xs', selectClassName)} 
                value={activeKey} onChange={handleSelectChange}>
                    {items.map((item) => (
                        <option key={item.key} value={item.key}>
                            {item.label}
                        </option>
                    ))}
                </Select>
            </div>

            <ul className={cn(
                'hidden md:flex text-xs w-max text-center text-text-color',
                '-space-x-px border border-[#D0D5DD] rounded-[10px]',
                'shadow-[0px_1px_2px_0px_#1018280D] overflow-hidden',
                className
            )}>
                {items.map((item, index) => {
                    
                    const isActive = activeKey === item.key
                    const isFirst = index === 0
                    const isLast = index === items.length - 1

                    return (
                        <li key={item.key}>
                            <button
                                type="button"
                                onClick={() => handleTabClick(item.key)}
                                className={cn(
                                    'text-xs leading-5 cursor-pointer border-x border-gray-300',
                                    'px-3.5 py-2',
                                    'transition-colors',
                                    isFirst && 'rounded-l-lg border-l-0',
                                    isLast && 'rounded-r-lg border-r-0',
                                    !isFirst && '-ml-px',
                                    isActive
                                        ? 'bg-amber-50 text-secondary font-medium'
                                        : 'bg-white text-gray-500 hover:bg-gray-50',
                                    tabClassName
                                )}
                                aria-current={isActive ? 'page' : undefined}>
                                {item.label}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default FilterTabs

