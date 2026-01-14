'use client'

import { useState, useEffect, useMemo } from 'react'
import { useGetProducts } from '@/services'
import { ProductType } from '@/types'

interface UseProductSearchOptions {
    limit?: number
    sort?: string
    enabled?: boolean
}

/**
 * Reusable hook for product search with API integration
 * @param options - Configuration options
 * @returns Product search state and handlers
 */
export const useProductSearch = (options: UseProductSearchOptions = {}) => {

    const { limit, sort = 'name_asc' } = options
    
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [debouncedSearch, setDebouncedSearch] = useState<string>('')

    // Debounce search input (300ms delay)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    // Fetch products from API
    const { data, isLoading, error } = useGetProducts({
        page: 1,
        limit,
        sort,
        search: debouncedSearch || undefined
    })

    const products = useMemo(() => data?.products || [], [data])

    // Product options for autocomplete
    const productOptions = useMemo(() => {
        return products.map(product => ({
            value: product.id,
            label: `${product.name} (${product.code})`
        }))
    }, [products])

    return {
        products,
        productOptions,
        searchQuery,
        setSearchQuery,
        isLoading,
        error
    }
}

