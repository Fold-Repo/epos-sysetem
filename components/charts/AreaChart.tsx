'use client'

import React from 'react'
import {
    AreaChart as RechartsAreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { cn } from '@/lib'

interface AreaChartProps {
    // Data
    data: Record<string, unknown>[]
    dataKey: string
    xAxisKey: string
    // Colors
    strokeColor?: string
    fillColor?: string
    gradientId?: string
    gradientColorStart?: string
    gradientColorEnd?: string
    gradientOpacityStart?: number
    gradientOpacityEnd?: number
    strokeWidth?: number
    // Dots
    showDots?: boolean
    dotSize?: number
    activeDotSize?: number
    // Axes
    showXAxis?: boolean
    showYAxis?: boolean
    xAxisFormatter?: (value: string | number) => string
    yAxisFormatter?: (value: number) => string
    xAxisProps?: Record<string, unknown>
    yAxisProps?: Record<string, unknown>
    // Grid
    showGrid?: boolean
    gridProps?: Record<string, unknown>
    // Tooltip
    customTooltip?: React.ComponentType<Record<string, unknown>>
    showTooltip?: boolean
    tooltipCursor?: Record<string, unknown>
    // Chart
    chartType?: 'monotone' | 'linear' | 'natural' | 'step'
    height?: number | string
    className?: string
    containerClassName?: string
    margin?: { top?: number; right?: number; left?: number; bottom?: number }
}

const AreaChart: React.FC<AreaChartProps> = ({
    data,
    dataKey,
    xAxisKey,
    // Colors
    strokeColor = '#D97706',
    gradientId = 'colorGradient',
    gradientColorStart,
    gradientColorEnd,
    gradientOpacityStart = 0.2,
    gradientOpacityEnd = 0,
    strokeWidth = 2.5,
    // Dots
    showDots = true,
    dotSize = 4,
    activeDotSize = 6,
    // Axes
    showXAxis = true,
    showYAxis = true,
    xAxisFormatter,
    yAxisFormatter,
    xAxisProps = {},
    yAxisProps = {},
    // Grid
    showGrid = true,
    gridProps = {},
    // Tooltip
    customTooltip,
    showTooltip = true,
    tooltipCursor = { stroke: strokeColor, strokeWidth: 1, strokeDasharray: '5 5' },
    // Chart
    chartType = 'monotone',
    height = 300,
    className,
    containerClassName,
    margin
}) => {

    const fillColor = gradientColorStart || strokeColor
    const gradientEndColor = gradientColorEnd || strokeColor

    // Auto-adjust margin based on Y-axis visibility
    const chartMargin = margin || {
        top: 10,
        right: 10,
        left: showYAxis ? -20 : 0,
        bottom: 0
    }

    const containerHeight = typeof height === 'number' ? height : 300;
    
    return (
        <div 
            className={cn("w-full", containerClassName)} 
            style={{ 
                height: typeof height === 'number' ? `${height}px` : height, 
                minHeight: typeof height === 'number' ? `${height}px` : height 
            }}>
            <ResponsiveContainer width="100%" height={containerHeight}>
                <RechartsAreaChart data={data} margin={chartMargin} className={className}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={fillColor} stopOpacity={gradientOpacityStart} />
                            <stop offset="95%" stopColor={gradientEndColor} stopOpacity={gradientOpacityEnd} />
                        </linearGradient>
                    </defs>

                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="0"
                            stroke="#F5F5F5"
                            vertical={false}
                            {...gridProps}
                        />
                    )}

                    {showXAxis && (
                        <XAxis
                            dataKey={xAxisKey}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgb(139, 149, 166)', fontSize: 12 }}
                            dy={10}
                            tickFormatter={xAxisFormatter}
                            {...xAxisProps}
                        />
                    )}

                    {showYAxis && (
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgb(139, 149, 166)', fontSize: 12 }}
                            tickFormatter={yAxisFormatter}
                            {...yAxisProps}
                        />
                    )}

                    {showTooltip && (
                        <Tooltip
                            content={customTooltip ? ((props: any) => React.createElement(customTooltip, props)) : undefined}
                            cursor={tooltipCursor}
                        />
                    )}

                    <Area
                        type={chartType}
                        dataKey={dataKey}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        fill={`url(#${gradientId})`}
                        dot={showDots ? { fill: strokeColor, strokeWidth: 0, r: dotSize } : false}
                        activeDot={showDots ? { r: activeDotSize, fill: strokeColor, stroke: '#fff', strokeWidth: 2 } : false}
                    />
                </RechartsAreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default AreaChart
