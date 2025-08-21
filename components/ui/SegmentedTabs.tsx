"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { cn } from "@/lib";

interface TabItem {
    key: string;
    value: string;
}

interface SegmentedTabsProps {
    tabs: TabItem[];
    value?: string;
    activeBg?: string;
    activeText?: string;
    inactiveText?: string;
    onChange?: (tabKey: string) => void;
    className?: string;
    buttonClassName?: string;
    activePillClassName?: string
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
    tabs,
    value,
    activeBg = "bg-yellow",
    activeText = "text-white",
    inactiveText = "text-gray-700",
    onChange,
    className,
    buttonClassName,
    activePillClassName
}) => {
    const [active, setActive] = useState(value || tabs[0]?.key);

    const handleClick = (key: string) => {
        setActive(key);
        onChange?.(key);
    };

    return (
        <div
            className={cn(
                "flex items-center bg-white rounded-full p-1 border border-[#F59E0B33] scrollbar-hide",
                className
            )}
            style={{
                boxShadow: "0px 14px 114px 0px #E1E7F3",
            }}>
            {tabs.map((tab) => {
                const isActive = active === tab.key;
                return (
                    <button
                        key={tab.key}
                        onClick={() => handleClick(tab.key)}
                        className={cn(
                            "relative px-5 py-2 text-xs font-medium rounded-full cursor-pointer",
                            buttonClassName
                        )}>
                        {isActive && (
                            <motion.div
                                layoutId="active-pill"
                                className={cn("absolute inset-0 rounded-full", activeBg, activePillClassName)}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <span
                            className={cn(
                                "relative z-10",
                                isActive ? activeText : inactiveText
                            )}>
                            {tab.value}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
