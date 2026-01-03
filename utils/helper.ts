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

