'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { cn } from '@/lib'

export interface DonutChartData {
    name: string
    value: number
    color: string
    percentage?: number
    [key: string]: any
}

interface DonutChartProps {
    data: DonutChartData[]
    total: number
    totalLabel?: string
    innerRadius?: number
    outerRadius?: number
    className?: string
    containerClassName?: string
    height?: number
    showTooltip?: boolean
    customTooltip?: React.ComponentType<any>
}

const DonutChart: React.FC<DonutChartProps> = ({
    data,
    total,
    totalLabel = 'Total Breakdown',
    innerRadius = 60,
    outerRadius = 100,
    className,
    containerClassName,
    height = 250,
    showTooltip = true,
    customTooltip,
}) => {
    return (
        <div className={cn("w-full relative", containerClassName)} style={{ height: `${height}px` }}>
            <ResponsiveContainer width="100%" height={height}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    {showTooltip && (
                        <Tooltip
                            content={customTooltip ? ((props: any) => React.createElement(customTooltip, props)) : undefined}
                        />
                    )}
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xs text-slate-400 mb-1">{totalLabel}</p>
                <p className="text-3xl font-bold text-[#0B1221]">{total}</p>
            </div>
        </div>
    )
}

export default DonutChart

