/**
 * Converts a snake_case string to camelCase
 * @param str - The string in snake_case format
 * @returns The string in camelCase format
 * @example
 * snakeToCamel('manage_adjustments') // returns 'manageAdjustments'
 */
export const snakeToCamel = (str: string): string => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Converts a snake_case string to Title Case
 * @param str - The string in snake_case format
 * @returns The string in Title Case format
 * @example
 * snakeToTitleCase('manage_adjustments') // returns 'Manage Adjustments'
 */
export const snakeToTitleCase = (str: string): string => {
    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

/**
 * Generate reference ID with prefix
 * Format: PREFIX-YYYY-XXXX (e.g., PUR-2024-0096, SAL-2024-0123)
 * @param prefix - Prefix for the reference (e.g., "PUR", "SAL", "QUO")
 * @returns Generated reference string
 * @example
 * generateReference('PUR') // returns 'PUR-2024-0096'
 * generateReference('SAL') // returns 'SAL-2024-0123'
 */
export function generateReference(prefix: string): string {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix.toUpperCase()}-${year}-${randomNum.toString().padStart(4, '0')}`;
}

// ================================
// AMOUNT TYPE
// ================================
export type AmountType = 'percent' | 'fixed'

/**
 * Calculate amount based on type (fixed or percentage)
 * @param value - The tax/discount value
 * @param baseAmount - The base amount to calculate percentage from
 * @param type - 'fixed' or 'percent'
 * @returns The calculated amount
 * @example
 * calcByType(10, 100, 'percent') // returns 10 (10% of 100)
 * calcByType(10, 100, 'fixed') // returns 10 (fixed amount)
 */
export function calcByType(
    value: number, 
    baseAmount: number, 
    type: AmountType | string | null | undefined
): number {
    return type === 'fixed' ? value : (baseAmount * value) / 100
}

/**
 * Format amount display based on type
 * @param value - The amount value
 * @param type - 'fixed' or 'percent'
 * @param currencyFormatter - Optional currency formatting function for fixed amounts
 * @returns Formatted string (e.g., "£10.00" for fixed, "10%" for percent)
 * @example
 * formatByType(10, 'percent') // returns '10%'
 * formatByType(10, 'fixed', formatCurrency) // returns '£10.00'
 */
export function formatByType(
    value: number | string, 
    type: AmountType | string | null | undefined,
    currencyFormatter?: (amount: number) => string
): string {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    
    if (type === 'fixed' && currencyFormatter) {
        return currencyFormatter(numValue)
    }
    return `${numValue}%`
}

