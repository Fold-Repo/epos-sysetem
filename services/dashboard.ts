'use client'

import { useQuery } from "@tanstack/react-query";
import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { startOfWeek, addDays, format } from "date-fns";

// ================================
// WEEKLY TREND RESPONSE TYPE
// ================================
export interface WeeklyTrendResponse {
    status: number;
    message: string;
    data: {
        labels: string[];
        sales: number[];
        purchases: number[];
    };
}

// ================================
// TRANSFORMED WEEKLY TREND DATA
// ================================
export interface WeeklyTrendDataPoint extends Record<string, unknown> {
    day: string;
    purchases: number;
    sales: number;
    date: string;
}

// ================================
// GET WEEKLY TREND
// ================================
export async function getWeeklyTrend(): Promise<WeeklyTrendDataPoint[]> {
    try {
        const response = await client.get<WeeklyTrendResponse>(ENDPOINT.DASHBOARD.WEEKLY_TREND);

        if (!response.data?.data) {
            throw new Error('Invalid API response');
        }

        const { labels, sales, purchases } = response.data.data;

        if (!labels || !Array.isArray(labels) || labels.length === 0) {
            throw new Error('Invalid labels data');
        }

        const today = new Date();
        const weekStart = startOfWeek(today, { weekStartsOn: 0 });

        const dayOffsetMap: Record<string, number> = {
            'Mon': 1,
            'Tue': 2,
            'Tues': 2,
            'Wed': 3,
            'Thu': 4,
            'Thur': 4,
            'Fri': 5,
            'Sat': 6,
            'Sun': 0,
        };

        // Transform API response to chart data format
        return labels.map((label, index) => {
            const dayOffset = dayOffsetMap[label] ?? index;
            const date = addDays(weekStart, dayOffset);

            return {
                day: label,
                purchases: purchases?.[index] || 0,
                sales: sales?.[index] || 0,
                date: format(date, 'yyyy-MM-dd'),
            };
        });
    } catch (error) {
        // Return empty array on error - component will use fallback data
        console.error('Error fetching weekly trend:', error);
        return [];
    }
}

// ================================
// USE WEEKLY TREND HOOK
// ================================
export function useGetWeeklyTrend() {
    return useQuery({
        queryKey: ['weekly-trend'],
        queryFn: getWeeklyTrend,
    });
}

// ================================
// REVENUE DATA RESPONSE TYPE
// ================================
export interface RevenueDataResponse {
    status: number;
    message: string;
    data: {
        distribution: Array<{
            name: string;
            count: number;
            amount: number;
            percentage: number;
        }>;
        breakdown: {
            total: number;
            items: Array<{
                label: string;
                count: number;
                percentage: number;
                color: string;
            }>;
        };
    };
}

// ================================
// TRANSFORMED REVENUE DISTRIBUTION DATA
// ================================
export interface RevenueDistributionDataPoint {
    label: string;
    value: number;
    percentage: number;
    color: string;
}

// Color palette for distribution items
const DISTRIBUTION_COLORS = ['yellow', 'purple', 'green', 'purpleLight', 'blue', 'orange', 'purpleDark'];

// ================================
// GET REVENUE DATA
// ================================
export async function getRevenueData(): Promise<RevenueDistributionDataPoint[]> {
    try {
        const response = await client.get<RevenueDataResponse>(ENDPOINT.DASHBOARD.REVENUE_DATA);

        if (!response.data?.data?.distribution) {
            throw new Error('Invalid API response');
        }

        const { distribution } = response.data.data;

        // Transform API response to component format
        return distribution.map((item, index) => ({
            label: item.name,
            value: item.amount,
            percentage: item.percentage,
            color: DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length], // Cycle through colors
        }));
    } catch (error) {
        console.error('Error fetching revenue data:', error);
        return [];
    }
}

// ================================
// USE REVENUE DATA HOOK
// ================================
export function useGetRevenueData() {
    return useQuery({
        queryKey: ['revenue-data'],
        queryFn: getRevenueData,
    });
}

// ================================
// TRANSFORMED REVENUE BREAKDOWN DATA
// ================================
export interface RevenueBreakdownDataPoint {
    name: string;
    value: number;
    percentage: number;
    color: string;
}

export interface RevenueBreakdownResponse {
    data: RevenueBreakdownDataPoint[];
    total: number;
}

// ================================
// GET REVENUE BREAKDOWN DATA
// ================================
export async function getRevenueBreakdownData(): Promise<RevenueBreakdownResponse> {
    try {
        const response = await client.get<RevenueDataResponse>(ENDPOINT.DASHBOARD.REVENUE_DATA);

        if (!response.data?.data?.breakdown) {
            throw new Error('Invalid API response');
        }

        const { breakdown } = response.data.data;

        // Transform API response to component format
        const data = breakdown.items.map((item) => ({
            name: item.label,
            value: item.count,
            percentage: item.percentage,
            color: item.color,
        }));

        return {
            data,
            total: breakdown.total,
        };
    } catch (error) {
        console.error('Error fetching revenue breakdown data:', error);
        return {
            data: [],
            total: 0,
        };
    }
}

// ================================
// USE REVENUE BREAKDOWN DATA HOOK
// ================================
export function useGetRevenueBreakdownData() {
    return useQuery({
        queryKey: ['revenue-breakdown'],
        queryFn: getRevenueBreakdownData,
    });
}

// ================================
// STOCK ALERT RESPONSE TYPE
// ================================
export interface StockAlertResponse {
    status: number;
    message: string;
    data: Array<{
        id: number;
        product: {
            id: number;
            name: string;
            sku: string;
            image_url: string | null;
        };
        variation: {
            id: number;
            type: string;
            value: string;
            sku: string;
        } | null;
        store: {
            id: number;
            name: string;
        };
        stock: {
            current_quantity: number;
            alert_threshold: number;
            unit: string;
            is_low: boolean;
            deficit: number;
        };
        unit: {
            name: string;
            short_name: string;
        };
    }>;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

// ================================
// TRANSFORMED STOCK ALERT DATA
// ================================
export interface StockAlertDataPoint {
    productName: string;
    productImage?: string;
    code: string;
    warehouse: string;
    currentStock: number;
    currentStockUnit: string;
    quantity: number;
    quantityUnit: string;
    alertQuantity: number;
    alertQuantityUnit: string;
}

// ================================
// GET STOCK ALERTS
// ================================
export async function getStockAlerts(): Promise<StockAlertDataPoint[]> {
    try {
        const response = await client.get<StockAlertResponse>(ENDPOINT.DASHBOARD.STOCK_ALERTS, {
            params: { limit: 12 }
        });

        if (!response.data?.data) {
            throw new Error('Invalid API response');
        }

        return response.data.data.map((item) => {
            const productName = item.variation
                ? `${item.product.name} - ${item.variation.type}: ${item.variation.value}`
                : item.product.name;

            const code = item.variation ? item.variation.sku : item.product.sku;

            return {
                productName,
                productImage: item.product.image_url || undefined,
                code,
                warehouse: item.store.name,
                currentStock: item.stock.current_quantity,
                currentStockUnit: item.unit.short_name,
                quantity: item.stock.current_quantity,
                quantityUnit: item.unit.short_name,
                alertQuantity: item.stock.alert_threshold,
                alertQuantityUnit: item.unit.short_name,
            };
        });
    } catch (error) {
        console.error('Error fetching stock alerts:', error);
        return [];
    }
}

// ================================
// USE STOCK ALERTS HOOK
// ================================
export function useGetStockAlerts() {
    return useQuery({
        queryKey: ['stock-alerts'],
        queryFn: getStockAlerts,
    });
}

// ================================
// SUMMARY CARDS RESPONSE TYPE
// ================================
export interface SummaryCardMetric {
    value: number;
    last_month: number;
    percentage_change: number;
}

export interface SummaryCardsResponse {
    status: number;
    data: {
        totalSales: SummaryCardMetric;
        totalPurchases: SummaryCardMetric;
        salesReturn: SummaryCardMetric;
        todaySales: SummaryCardMetric;
    };
}

// ================================
// GET SUMMARY CARDS
// ================================
export async function getSummaryCards(): Promise<SummaryCardsResponse['data']> {
    const response = await client.get<SummaryCardsResponse>(ENDPOINT.DASHBOARD.SUMMARY_CARDS);
    return response.data.data;
}

// ================================
// USE SUMMARY CARDS HOOK
// ================================
export function useGetSummaryCards() {
    return useQuery({
        queryKey: ['summary-cards'],
        queryFn: getSummaryCards,
    });
}
