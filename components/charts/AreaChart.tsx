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

interface AreaSeries {
    dataKey: string
    strokeColor?: string
    fillColor?: string
    gradientId?: string
    gradientColorStart?: string
    gradientColorEnd?: string
    gradientOpacityStart?: number
    gradientOpacityEnd?: number
    strokeWidth?: number
    showDots?: boolean
    dotSize?: number
    activeDotSize?: number
    chartType?: 'monotone' | 'linear' | 'natural' | 'step'
    baseValue?: number | 'dataMin' | 'dataMax' | 'auto' // Base value for area (number or special values)
    stackId?: string // For stacking multiple areas - areas with same stackId will stack
    hide?: boolean // Hide/show the series
}

interface AreaChartProps {
    // Data
    data: Record<string, unknown>[]
    dataKey?: string // For backward compatibility
    xAxisKey: string
    // Multiple series support
    series?: AreaSeries[]
    // Colors (for single series - backward compatibility)
    strokeColor?: string
    fillColor?: string
    gradientId?: string
    gradientColorStart?: string
    gradientColorEnd?: string
    gradientOpacityStart?: number
    gradientOpacityEnd?: number
    strokeWidth?: number
    // Dots (for single series - backward compatibility)
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
    // Chart (for single series - backward compatibility)
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
    series,
    // Colors (for single series - backward compatibility)
    strokeColor = '#D97706',
    gradientId = 'colorGradient',
    gradientColorStart,
    gradientColorEnd,
    gradientOpacityStart = 0.2,
    gradientOpacityEnd = 0,
    strokeWidth = 2.5,
    // Dots (for single series - backward compatibility)
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
    // Chart (for single series - backward compatibility)
    chartType = 'monotone',
    height = 300,
    className,
    containerClassName,
    margin
}) => {

    // Determine if using multiple series or single series (backward compatibility)
    const isMultiSeries = series && series.length > 0;
    
    // Prepare series data - either from series prop or single series from props
    const chartSeries: AreaSeries[] = isMultiSeries 
        ? series 
        : [{
            dataKey: dataKey || 'value',
            strokeColor,
            fillColor: gradientColorStart || strokeColor,
            gradientId,
            gradientColorStart,
            gradientColorEnd,
            gradientOpacityStart,
            gradientOpacityEnd,
            strokeWidth,
            showDots,
            dotSize,
            activeDotSize,
            chartType
        }];

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
                        {chartSeries.map((seriesItem, index) => {
                            const seriesGradientId = seriesItem.gradientId || `${gradientId}-${index}`;
                            const fillColor = seriesItem.gradientColorStart || seriesItem.strokeColor || strokeColor;
                            const gradientEndColor = seriesItem.gradientColorEnd || seriesItem.strokeColor || strokeColor;
                            const opacityStart = seriesItem.gradientOpacityStart ?? gradientOpacityStart;
                            const opacityEnd = seriesItem.gradientOpacityEnd ?? gradientOpacityEnd;
                            
                            return (
                                <linearGradient key={seriesGradientId} id={seriesGradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={fillColor} stopOpacity={opacityStart} />
                                    <stop offset="95%" stopColor={gradientEndColor} stopOpacity={opacityEnd} />
                                </linearGradient>
                            );
                        })}
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

                    {chartSeries.map((seriesItem, index) => {
                        // Skip rendering if series is hidden
                        if (seriesItem.hide) {
                            return null;
                        }

                        const seriesGradientId = seriesItem.gradientId || `${gradientId}-${index}`;
                        const seriesStrokeColor = seriesItem.strokeColor || strokeColor;
                        const seriesStrokeWidth = seriesItem.strokeWidth ?? strokeWidth;
                        const seriesShowDots = seriesItem.showDots ?? showDots;
                        const seriesDotSize = seriesItem.dotSize ?? dotSize;
                        const seriesActiveDotSize = seriesItem.activeDotSize ?? activeDotSize;
                        const seriesChartType = seriesItem.chartType ?? chartType;
                        
                        const areaProps: any = {
                            type: seriesChartType,
                            dataKey: seriesItem.dataKey,
                            stroke: seriesStrokeColor,
                            strokeWidth: seriesStrokeWidth,
                            fill: `url(#${seriesGradientId})`,
                            dot: seriesShowDots ? { fill: seriesStrokeColor, strokeWidth: 0, r: seriesDotSize } : false,
                            activeDot: seriesShowDots ? { r: seriesActiveDotSize, fill: seriesStrokeColor, stroke: '#fff', strokeWidth: 2 } : false,
                        };
                        
                        // Add optional props only if they are defined
                        if (seriesItem.stackId) {
                            areaProps.stackId = seriesItem.stackId;
                        }
                        if (seriesItem.baseValue !== undefined) {
                            areaProps.baseValue = seriesItem.baseValue;
                        }
                        
                        return <Area key={seriesItem.dataKey} {...areaProps} />;
                    })}
                </RechartsAreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default AreaChart
