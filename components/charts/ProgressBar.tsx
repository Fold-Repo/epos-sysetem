'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib'

interface ProgressBarProps {
    label: string
    amount: number | string
    percentage: number
    color?: 'orange' | 'green' | 'blue' | string
    className?: string
    labelClassName?: string
    amountClassName?: string
    barClassName?: string
    gradient?: string
    showDot?: boolean
    dotColor?: string
    showTooltip?: boolean
    tooltipIcon?: React.ReactNode
    tooltipLabel?: string
    animationDelay?: number
}

const gradients = {
    orange: 'linear-gradient(270deg, #DCB085 0%, rgba(220, 176, 133, 0) 111.11%)',
    green: 'linear-gradient(270deg, #008027 0%, rgba(0, 128, 39, 0) 111.11%)',
    blue: 'linear-gradient(270deg, #277EFF 0%, rgba(39, 126, 255, 0) 111.11%)',
}

const dotColors = {
    orange: '#DCB085',
    green: '#008027',
    blue: '#277EFF',
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    label,
    amount,
    percentage,
    color = 'orange',
    className,
    labelClassName,
    amountClassName,
    barClassName,
    gradient,
    showDot = true,
    dotColor,
    showTooltip = false,
    tooltipIcon,
    tooltipLabel,
    animationDelay = 0
}) => {
    const [isHovered, setIsHovered] = useState(false)
    const gradientStyle = gradient || (color in gradients ? gradients[color as keyof typeof gradients] : color)
    const dot = dotColor || (color in dotColors ? dotColors[color as keyof typeof dotColors] : color)

    return (
        <motion.div 
            className={cn("w-full relative", className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: animationDelay, ease: "easeOut" }}>

            <motion.div 
                className="flex items-center justify-between mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: animationDelay + 0.2, duration: 0.3 }}>

                <div className="flex items-center gap-2">
                    {showDot && (
                        <motion.div 
                            className="size-3 rounded shrink-0" 
                            style={{ backgroundColor: dot }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: animationDelay + 0.3, type: "spring", stiffness: 200 }}
                        />
                    )}
                    <span className={cn("text-xs text-[#0B1221]", labelClassName)}>
                        {label}
                    </span>
                </div>

                <span className={cn("text-xs font-medium text-[#222222E5]", amountClassName)}>
                    {amount}
                </span>

            </motion.div>

            <div className={cn("w-full h-5.5 bg-[#F5F6F7] overflow-hidden", barClassName)}>
                <motion.div 
                    className="h-full"
                    style={{ background: gradientStyle }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ 
                        delay: animationDelay + 0.4, 
                        duration: 1, 
                        ease: "easeOut" 
                    }}
                />
            </div>

            <AnimatePresence>
                {showTooltip && isHovered && (
                    <motion.div 
                        className="absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full z-10"
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}>

                        <div className="bg-white px-3 py-2.5 rounded-lg shadow-lg border border-[#E2E4E9]">

                            {tooltipLabel && (
                                <p className="text-[11px] text-slate-400 mb-1.5">
                                    {tooltipLabel}
                                </p>
                            )}

                            <div className="flex items-center gap-2">
                                {tooltipIcon && (
                                    <div 
                                        className="w-7 h-7 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: dot }}>
                                        {tooltipIcon}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-[#0B1221]">
                                        {amount}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        {percentage}% of target
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-white border-r border-b border-[#E2E4E9] rotate-45"></div>

                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    )
}

export default ProgressBar

