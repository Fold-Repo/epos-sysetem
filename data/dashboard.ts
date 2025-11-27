import { format, startOfWeek, addDays } from 'date-fns'

export interface WeeklySalesDataPoint extends Record<string, unknown> {
    day: string
    purchases: number
    sales: number
    date: string
}

/**
 * Get current week's sales and purchases data
 * @returns Array of data points for each day of the current week
 */
export const getCurrentWeekSalesData = (): WeeklySalesDataPoint[] => {

    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 0 });

    return [
        { day: 'Mon', purchases: 18000, sales: 28000, date: format(addDays(weekStart, 1), 'yyyy-MM-dd') },
        { day: 'Tues', purchases: 22000, sales: 35000, date: format(addDays(weekStart, 2), 'yyyy-MM-dd') },
        { day: 'Wed', purchases: 28000, sales: 45000, date: format(addDays(weekStart, 3), 'yyyy-MM-dd') },
        { day: 'Thur', purchases: 20000, sales: 28000, date: format(addDays(weekStart, 4), 'yyyy-MM-dd') },
        { day: 'Fri', purchases: 25000, sales: 38000, date: format(addDays(weekStart, 5), 'yyyy-MM-dd') },
        { day: 'Sat', purchases: 32000, sales: 50000, date: format(addDays(weekStart, 6), 'yyyy-MM-dd') },
        { day: 'Sun', purchases: 38000, sales: 58000, date: format(weekStart, 'yyyy-MM-dd') },
    ];
};

export interface RevenueBreakdownDataPoint {
    name: string
    value: number
    percentage: number
    color: string
}

/**
 * Get revenue breakdown data
 * @returns Revenue breakdown data with total
 */
export const getRevenueBreakdownData = (): { data: RevenueBreakdownDataPoint[], total: number } => {
    const data: RevenueBreakdownDataPoint[] = [
        { name: 'Sales', value: 248, percentage: 57.8, color: '#10b981' }, // Green
        { name: 'Returns', value: 129, percentage: 30.1, color: '#7c3aed' }, // Dark Purple
        { name: 'Refunds', value: 52, percentage: 12.1, color: '#c084fc' }, // Light Purple
    ];
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return { data, total };
};

export interface RevenueDistributionDataPoint {
    label: string
    value: number
    percentage: number
    color: string
}

/**
 * Get revenue distribution data
 * @returns Array of revenue distribution data points
 */
export const getRevenueDistributionData = (): RevenueDistributionDataPoint[] => {
    return [
        { label: 'Walk-In-Customer', value: 70, percentage: 80, color: 'yellow' },
        { label: 'Meara Nair', value: 22, percentage: 80.92, color: 'purple' },
        { label: 'Rajesh Kuser', value: 19, percentage: 90, color: 'green' },
        { label: 'Sarah Johnson', value: 16, percentage: 77.67, color: 'purpleLight' },
        { label: 'Ahmed Hassan', value: 11, percentage: 60.46, color: 'purpleDark' },
    ];
};

export interface RecentSalesDataPoint {
    reference: string
    customer: string
    status: 'completed' | 'pending' | 'cancelled'
    grandTotal: number
    paid: number
    due: number
    paymentStatus: 'paid' | 'pending'
}

/**
 * Get recent sales data
 * @returns Array of recent sales data points
 */
export const getRecentSalesData = (): RecentSalesDataPoint[] => {
    return [
        { reference: 'SA_T1212', customer: 'walk-in-customer', status: 'completed', grandTotal: 133.29, paid: 133.29, due: 0.00, paymentStatus: 'paid' },
        { reference: 'SA_T1212', customer: 'walk-in-customer', status: 'completed', grandTotal: 133.29, paid: 133.29, due: 0.00, paymentStatus: 'paid' },
        { reference: 'SA_T1212', customer: 'walk-in-customer', status: 'completed', grandTotal: 133.29, paid: 133.29, due: 0.00, paymentStatus: 'pending' },
        { reference: 'SA_T1212', customer: 'walk-in-customer', status: 'completed', grandTotal: 133.29, paid: 133.29, due: 0.00, paymentStatus: 'pending' },
        { reference: 'SA_T1212', customer: 'walk-in-customer', status: 'completed', grandTotal: 133.29, paid: 133.29, due: 0.00, paymentStatus: 'pending' },
        { reference: 'SA_T1212', customer: 'walk-in-customer', status: 'completed', grandTotal: 133.29, paid: 133.29, due: 0.00, paymentStatus: 'pending' },
    ];
};

export interface StockAlertDataPoint {
    productName: string
    productImage?: string
    code: string
    warehouse: string
    currentStock: number
    currentStockUnit: string
    quantity: number
    quantityUnit: string
    alertQuantity: number
    alertQuantityUnit: string
}

/**
 * Get stock alert data
 * @returns Array of stock alert data points
 */
export const getStockAlertData = (): StockAlertDataPoint[] => {
    return [
        { 
            productName: 'Dragon Fruit', 
            productImage: '/img/products/dragon-fruit.jpg',
            code: 'AF23556588fd', 
            warehouse: 'General Warehouse', 
            currentStock: 0, 
            currentStockUnit: 'kg',
            quantity: 10, 
            quantityUnit: 'Piece',
            alertQuantity: 10, 
            alertQuantityUnit: 'Piece'
        },
        { 
            productName: 'Dragon Fruit', 
            productImage: '/img/products/dragon-fruit.jpg',
            code: 'AF23556588fd', 
            warehouse: 'Warehouse', 
            currentStock: 0, 
            currentStockUnit: 'kg',
            quantity: 5, 
            quantityUnit: 'Piece',
            alertQuantity: 10, 
            alertQuantityUnit: 'Piece'
        },
        { 
            productName: 'Dragon Fruit', 
            productImage: '/img/products/dragon-fruit.jpg',
            code: 'AF23556588fd', 
            warehouse: 'General Warehouse', 
            currentStock: 0, 
            currentStockUnit: 'kg',
            quantity: 10, 
            quantityUnit: 'Piece',
            alertQuantity: 10, 
            alertQuantityUnit: 'Piece'
        },
        { 
            productName: 'Dragon Fruit', 
            productImage: '/img/products/dragon-fruit.jpg',
            code: 'AF23556588fd', 
            warehouse: 'General Warehouse', 
            currentStock: 0, 
            currentStockUnit: 'kg',
            quantity: 10, 
            quantityUnit: 'Piece',
            alertQuantity: 10, 
            alertQuantityUnit: 'Piece'
        },
        { 
            productName: 'Dragon Fruit', 
            productImage: '/img/products/dragon-fruit.jpg',
            code: 'AF23556588fd', 
            warehouse: 'General Warehouse', 
            currentStock: 0, 
            currentStockUnit: 'kg',
            quantity: 10, 
            quantityUnit: 'Piece',
            alertQuantity: 10, 
            alertQuantityUnit: 'Piece'
        },
    ];
};

