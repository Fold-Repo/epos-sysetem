import { useMemo } from 'react'

export interface ItemWithSubtotal {
    subtotal: number
    [key: string]: any
}

interface UseOrderTotalsOptions {
    /**
     * Array of items with subtotal property
     */
    items: ItemWithSubtotal[]
    /**
     * Order tax - can be percentage (string/number) or fixed amount
     * If string/number, treated as percentage
     */
    orderTax?: string | number
    /**
     * Order discount - can be percentage (string/number) or fixed amount
     * If string/number, treated as fixed amount
     */
    orderDiscount?: string | number
    /**
     * Shipping amount
     */
    shipping?: string | number
    /**
     * Whether orderTax should be treated as percentage (default: true)
     */
    orderTaxIsPercentage?: boolean
    /**
     * Whether orderDiscount should be treated as percentage (default: false)
     */
    orderDiscountIsPercentage?: boolean
}

export interface OrderTotals {
    /**
     * Sum of all item subtotals
     */
    itemsTotal: number
    /**
     * Calculated order tax amount
     */
    orderTaxAmount: number
    /**
     * Order discount amount
     */
    orderDiscount: number
    /**
     * Shipping amount
     */
    shipping: number
    /**
     * Grand total (itemsTotal - orderDiscount + orderTaxAmount + shipping)
     */
    grandTotal: number
}

/**
 * Hook to calculate order totals from items and order-level adjustments
 * 
 * @example
 * ```tsx
 * const totals = useOrderTotals({
 *   items: quotationItems,
 *   orderTax: '10', // 10%
 *   orderDiscount: '50', // $50 fixed
 *   shipping: '20' // $20
 * })
 * ```
 */
export function useOrderTotals(options: UseOrderTotalsOptions): OrderTotals {
    const {
        items,
        orderTax = 0,
        orderDiscount = 0,
        shipping = 0,
        orderTaxIsPercentage = true,
        orderDiscountIsPercentage = false
    } = options

    return useMemo(() => {
        // Calculate items total
        const itemsTotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0)

        // Calculate order tax amount
        const orderTaxValue = Number(orderTax || 0)
        const orderTaxAmount = orderTaxIsPercentage
            ? (itemsTotal * orderTaxValue) / 100
            : orderTaxValue

        // Calculate order discount amount
        const orderDiscountValue = Number(orderDiscount || 0)
        const orderDiscountAmount = orderDiscountIsPercentage
            ? (itemsTotal * orderDiscountValue) / 100
            : orderDiscountValue

        // Get shipping amount
        const shippingAmount = Number(shipping || 0)

        // Calculate grand total
        const grandTotal = itemsTotal - orderDiscountAmount + orderTaxAmount + shippingAmount

        return {
            itemsTotal,
            orderTaxAmount,
            orderDiscount: orderDiscountAmount,
            shipping: shippingAmount,
            grandTotal
        }
    }, [items, orderTax, orderDiscount, shipping, orderTaxIsPercentage, orderDiscountIsPercentage])
}

