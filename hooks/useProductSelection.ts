'use client'

import { useState, useCallback } from 'react'
import { useToast } from './useToast'
import { ProductType } from '@/types'

export interface BaseProductItem {
    id: string
    productId: string
    name: string
    code: string
    stock: number
    unit: string
    [key: string]: any
}

interface UseProductSelectionOptions<T extends BaseProductItem> {
    /**
     * Array of products to select from
     */
    products: ProductType[]
    /**
     * Function to transform a product into the desired item structure
     */
    itemMapper: (product: ProductType, id: string) => T
    /**
     * Custom error message when product is already added
     */
    duplicateErrorMessage?: (productName: string) => string
    /**
     * Custom error title when product is already added
     */
    duplicateErrorTitle?: string
    /**
     * Optional function to recalculate item when fields change (e.g., subtotal when quantity changes)
     */
    onItemUpdate?: (item: T, field: keyof T, value: any) => Partial<T>
}

export function useProductSelection<T extends BaseProductItem>(
    options: UseProductSelectionOptions<T>
) {
    
    const { showError } = useToast()
    const [selectedProductId, setSelectedProductId] = useState<string>("")
    const [items, setItems] = useState<T[]>([])

    const handleProductSelect = useCallback((productId: string) => {
        if (!productId) return

        const product = options.products.find(p => p.id === productId)
        if (!product) return

        const existingItem = items.find(item => item.productId === productId)
        if (existingItem) {
            const errorTitle = options.duplicateErrorTitle || 'Product already added'
            const errorMessage = options.duplicateErrorMessage 
                ? options.duplicateErrorMessage(product.name)
                : `"${product.name}" is already in the list.`
            
            showError(errorTitle, errorMessage)
            setSelectedProductId("")
            return
        }

        const newItem = options.itemMapper(product, `item-${Date.now()}-${Math.random()}`)
        setItems(prev => [...prev, newItem])
        setSelectedProductId("")
    }, [items, options, showError])

    const productOptions = options.products.map(p => ({ value: p.id, label: p.name }))

    const updateItem = useCallback(<K extends keyof T>(id: string, field: K, value: T[K]) => {
        setItems(prev =>
            prev.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value }
                    // If onItemUpdate is provided, apply additional updates (e.g., recalculate subtotal)
                    if (options.onItemUpdate) {
                        const additionalUpdates = options.onItemUpdate(updatedItem, field, value)
                        return { ...updatedItem, ...additionalUpdates }
                    }
                    return updatedItem
                }
                return item
            })
        )
    }, [options])

    const deleteItem = useCallback((id: string) => {
        setItems(prev => prev.filter(item => item.id !== id))
    }, [])

    const clearItems = useCallback(() => {
        setItems([])
        setSelectedProductId("")
    }, [])

    const reset = useCallback(() => {
        clearItems()
    }, [clearItems])

    return {
        selectedProductId,
        setSelectedProductId,
        items,
        setItems,
        handleProductSelect,
        updateItem,
        deleteItem,
        clearItems,
        reset,
        productOptions
    }
}

