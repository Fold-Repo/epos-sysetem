/**
 * Get the color class for stock/quantity count based on thresholds
 * 
 * @param value - The stock/quantity value
 * @param highThreshold - Threshold for high stock (default: 50). Values above this will be green
 * @param mediumThreshold - Threshold for medium stock (default: 20). Values between medium and high will be yellow, below will be red
 * @returns Tailwind CSS color class string
 * 
 * @example
 * getStockCountColor(45) // returns 'text-green-600'
 * getStockCountColor(15) // returns 'text-yellow-600'
 * getStockCountColor(10) // returns 'text-red-600'
 * getStockCountColor(100, 80, 30) // returns 'text-green-600' with custom thresholds
 */
export const getStockCountColor = (
    value: number,
    highThreshold: number = 50,
    mediumThreshold: number = 20
): string => {
    if (value > highThreshold) {
        return 'text-green-600'
    } else if (value > mediumThreshold) {
        return 'text-yellow-500'
    } else {
        return 'text-red-400'
    }
}

