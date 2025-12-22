
'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export interface BarSeries {
    name: string
    data: number[]
    color?: string
    yAxisId?: 'left' | 'right' 
}

interface BarChartProps {
    // Series data
    series: BarSeries[]
    // X-axis categories
    categories: string[]
    // Chart options (optional, will merge with defaults)
    options?: Partial<any>
    // Height
    height?: number | string
    // Container class
    containerClassName?: string
    // Show legend
    showLegend?: boolean
    // Legend position
    legendPosition?: 'top' | 'bottom' | 'left' | 'right'
    // Colors (if not specified in series)
    colors?: string[]
    // Bar styling
    borderRadius?: number
    columnWidth?: string | number
    barGap?: number
    // Grid
    showGrid?: boolean
    gridBorderColor?: string
    // Tooltip
    showTooltip?: boolean
    tooltipTheme?: 'light' | 'dark'
    // Y-axis
    showYAxis?: boolean
    yAxisOpposite?: boolean
    yAxisFormatter?: (value: number) => string
    // Dual Y-axis
    secondaryYAxis?: {
        show?: boolean
        opposite?: boolean
        formatter?: (value: number) => string
    }
}

const BarChart: React.FC<BarChartProps> = ({
    series,
    categories,
    options = {},
    height = 300,
    containerClassName,
    showLegend = true,
    legendPosition = 'top',
    colors,
    borderRadius = 5,
    columnWidth = '40%',
    barGap = 5,
    showGrid = true,
    gridBorderColor = 'rgba(163, 174, 208, 0.3)',
    showTooltip = true,
    tooltipTheme = 'dark',
    showYAxis = true,
    yAxisOpposite = false,
    yAxisFormatter,
    secondaryYAxis
}) => {

    // Extract colors from series or use provided colors
    const chartColors = colors || series.map(s => s.color || '#D97706')

    // Build ApexCharts series format
    const apexSeries = series.map(s => ({
        name: s.name,
        data: s.data,
        color: s.color
    }))

    // Default options
    const defaultOptions: any = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false,
            },
            stacked: false,
        },
        plotOptions: {
            bar: {
                borderRadius: borderRadius,
                columnWidth: columnWidth,
                dataLabels: {
                    position: 'top',
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories: categories,
            labels: {
                style: {
                    colors: '#ACACAC',
                    fontSize: '12px',
                    fontWeight: 400,
                },
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: showYAxis ? {
            show: true,
            opposite: yAxisOpposite,
            labels: {
                show: true,
                style: {
                    colors: '#ACACAC',
                    fontSize: '13px',
                    fontWeight: 400,
                },
                formatter: yAxisFormatter,
            },
        } : {
            show: false,
        },
        fill: {
            type: 'solid',
            colors: chartColors,
            opacity: 1,
        },
        colors: chartColors,
        grid: showGrid ? {
            borderColor: gridBorderColor,
            show: true,
            yaxis: {
                lines: {
                    show: false,
                    opacity: 0.5,
                },
            },
            row: {
                opacity: 0.5,
            },
            xaxis: {
                lines: {
                    show: false,
                },
            },
        } : {
            show: false,
        },
        tooltip: showTooltip ? {
            style: {
                fontSize: '13px',
                backgroundColor: tooltipTheme === 'dark' ? '#000000' : '#ffffff',
            },
            theme: tooltipTheme,
            onDatasetHover: {
                style: {
                    fontSize: '12px',
                },
            },
        } : {
            enabled: false,
        },
        legend: showLegend ? {
            show: true,
            position: legendPosition,
            horizontalAlign: legendPosition === 'top' || legendPosition === 'bottom' ? 'left' : 'center',
            floating: legendPosition === 'top',
            fontSize: '13px',
            fontWeight: 400,
            offsetY: legendPosition === 'top' ? -10 : 0,
        } : {
            show: false,
        },
    }

    // Merge with provided options
    const chartOptions = {
        ...defaultOptions,
        ...options,
        // Deep merge for nested objects
        chart: {
            ...defaultOptions.chart,
            ...(options.chart || {}),
        },
        plotOptions: {
            ...defaultOptions.plotOptions,
            ...(options.plotOptions || {}),
            bar: {
                ...defaultOptions.plotOptions.bar,
                ...(options.plotOptions?.bar || {}),
            },
        },
        xaxis: {
            ...defaultOptions.xaxis,
            ...(options.xaxis || {}),
        },
        yaxis: {
            ...defaultOptions.yaxis,
            ...(options.yaxis || {}),
        },
        grid: {
            ...defaultOptions.grid,
            ...(options.grid || {}),
        },
        tooltip: {
            ...defaultOptions.tooltip,
            ...(options.tooltip || {}),
        },
        legend: {
            ...defaultOptions.legend,
            ...(options.legend || {}),
        },
    }

    const chartHeight = typeof height === 'number' ? height : parseInt(height.toString().replace('px', '')) || 300

    return (
        <div 
            className={cn("w-full", containerClassName)} 
            style={{ 
                height: typeof height === 'number' ? `${height}px` : height, 
                minHeight: typeof height === 'number' ? `${height}px` : height 
            }}>
            <Chart
                options={chartOptions}
                series={apexSeries}
                type="bar"
                width="100%"
                height={chartHeight}
            />
        </div>
    )
}

export default BarChart
