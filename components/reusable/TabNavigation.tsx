'use client'

import React, { useState } from 'react'
import { cn } from '@/lib'

export interface TabNavigationItem {
    key: string
    label: string
    icon?: React.ReactNode
}

export interface TabNavigationProps {
    items: TabNavigationItem[]
    defaultActiveKey?: string
    activeKey?: string
    onTabChange?: (key: string) => void
    className?: string
    tabClassName?: string
}

const TabNavigation: React.FC<TabNavigationProps> = ({
    items,
    defaultActiveKey,
    activeKey: controlledActiveKey,
    onTabChange,
    className,
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

    return (
        <div className={cn("border-b border-[#E6E9EF]", className)}>
            <div className="flex gap-3 overflow-x-auto w-full scrollbar-hide">
                {items.map((tab) => {
                    const isActive = activeKey === tab.key
                    return (
                        <button
                            key={tab.key}
                            onClick={() => handleTabClick(tab.key)}
                            className={cn(
                                "flex items-center gap-x-2 px-4 py-2 text-xs transition-colors relative cursor-pointer shrink-0",
                                isActive
                                    ? "text-secondary bg-secondary/5"
                                    : "text-gray-400 hover:text-secondary",
                                tabClassName
                            )}
                        >
                            {tab.icon && (
                                <span className={cn(
                                    "shrink-0",
                                    isActive ? "text-secondary" : "text-slate-400"
                                )}>
                                    {tab.icon}
                                </span>
                            )}
                            <span className="whitespace-nowrap">{tab.label}</span>
                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default TabNavigation

