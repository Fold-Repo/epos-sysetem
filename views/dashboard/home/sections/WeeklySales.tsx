'use client'

import { useState } from 'react'
import { AreaChart, ChartLegend, DashboardCard, FilterContainer } from '@/components'
import { MenuDropdown, DatePicker } from '@/components/ui'
import { StackIcon } from '@/components/icons'
import { formatCurrency } from '@/lib'
import { format } from 'date-fns'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { useGetWeeklyTrend } from '@/services'
import { getCurrentWeekSalesData } from '@/data'
import { CHART_COLORS } from '@/constants'
import { Spinner } from '@heroui/react'

// ================================
// FILTER OPTIONS
// ================================
const RANGE_OPTIONS = [
    { label: 'Weekly', key: 'weekly' },
    { label: 'Monthly', key: 'monthly' },
    { label: 'Custom', key: 'custom' }
]

const WeeklySales = () => {

    const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
        sales: true,
        purchases: true,
    });

    const [filterRange, setFilterRange] = useState<string>('weekly');
    const [dateRange, setDateRange] = useState<{ startDate?: Date; endDate?: Date }>({
        startDate: undefined,
        endDate: undefined
    });

    // ================================
    // FETCH WEEKLY TREND DATA
    // ================================
    const { data: apiData, isLoading } = useGetWeeklyTrend();

    const chartData = apiData || [];

    const toggleSeries = (dataKey: string) => {
        setVisibleSeries(prev => ({
            ...prev,
            [dataKey]: !prev[dataKey]
        }));
    };

    const legendItems = [
        {
            dataKey: 'sales',
            label: 'Sale',
            color: CHART_COLORS.sales,
            visible: visibleSeries.sales,
        },
        {
            dataKey: 'purchases',
            label: 'Purchases',
            color: CHART_COLORS.purchases,
            visible: visibleSeries.purchases,
        },
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white px-3 py-2.5 rounded-lg shadow-lg border border-[#E2E4E9]">
                    <p className="text-[11px] text-slate-400 mb-2">
                        {format(new Date(data.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <div className="space-y-2">
                        {payload.map((item: any, index: number) => {
                            const isSales = item.dataKey === 'sales';
                            return (
                                <div key={index} className="flex items-center gap-2">
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center"
                                        style={{
                                            backgroundColor: isSales ? CHART_COLORS.sales : CHART_COLORS.purchases
                                        }}>
                                        <ArrowTrendingUpIcon className='size-4 text-white' />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">
                                            {isSales ? 'Sales' : 'Purchases'}
                                        </p>
                                        <p className="text-sm font-semibold text-text-color">
                                            {formatCurrency(item.value)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return null;
    };

    const getRangeLabel = () => {
        const current = RANGE_OPTIONS.find(o => o.key === filterRange);
        return current ? current.label : 'Weekly';
    };

    const handleRangeChange = (key: string) => {
        setFilterRange(key);
        if (key !== 'custom') {
            setDateRange({ startDate: undefined, endDate: undefined });
        }
    };

    const handleDateRangeChange = (value: Date | { startDate: Date; endDate: Date }) => {
        if ('startDate' in value && 'endDate' in value) {
            setDateRange({
                startDate: value.startDate,
                endDate: value.endDate
            });
        }
    };

    return (
        <DashboardCard title='Sales & Purchases Trend'
            headerActions={
                <div className="flex flex-col items-end gap-2">
                    {/* Chart Legend */}
                    <ChartLegend
                        items={legendItems}
                        onToggle={toggleSeries}
                        indicatorSize="md"
                        textSize="xs"
                        gap="md"
                    />

                    <FilterContainer>
                        <MenuDropdown
                            label={getRangeLabel()}
                            startContent={<StackIcon className="text-slate-400" />}
                            showChevron={false}
                            items={RANGE_OPTIONS}
                            value={filterRange}
                            onChange={handleRangeChange}
                        />
                        {filterRange === 'custom' && (
                            <DatePicker
                                startDate={dateRange.startDate}
                                endDate={dateRange.endDate}
                                range={true}
                                onChange={handleDateRangeChange}
                            />
                        )}
                    </FilterContainer>

                </div>
            }>

            {/* ================= CHART ================= */}
            {isLoading ? (
                <div className="flex items-center justify-center h-full min-h-[20vh]">
                    <Spinner color="primary" size="lg" />
                </div>
            ) : (
            <AreaChart
                data={chartData}
                xAxisKey="day"
                series={[
                    {
                        dataKey: 'purchases',
                        strokeColor: CHART_COLORS.purchases,
                        gradientId: 'purchasesGradient',
                        gradientColorStart: CHART_COLORS.purchases,
                        gradientOpacityStart: 0.3,
                        gradientOpacityEnd: 0.05,
                        strokeWidth: 2.5,
                        showDots: false,
                        stackId: '1',
                        hide: !visibleSeries.purchases,
                    },
                    {
                        dataKey: 'sales',
                        strokeColor: CHART_COLORS.sales,
                        gradientId: 'salesGradient',
                        gradientColorStart: CHART_COLORS.sales,
                        gradientOpacityStart: 0.4,
                        gradientOpacityEnd: 0.05,
                        strokeWidth: 2.5,
                        showDots: false,
                        stackId: '1',
                        hide: !visibleSeries.sales,
                    }
                ]}
                customTooltip={CustomTooltip}
                yAxisFormatter={(value) => {
                    const thousands = Math.round(value / 1000);
                    return formatCurrency(thousands).replace(/\.\d+/, '') + 'k';
                }}
                height={300}
            />
            )}

        </DashboardCard>
    )
}

export default WeeklySales