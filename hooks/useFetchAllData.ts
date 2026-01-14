'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import {
    fetchCategories,
    fetchStores,
    fetchSuppliers,
    fetchBrands,
    fetchUnits,
    fetchVariations,
    fetchPaymentMethods,
    fetchCustomers
} from '@/store/slice'

/**
 * Hook to fetch all data entities and populate Redux state
 * Call this hook in your dashboard layout or main component
 */
export const useFetchAllData = () => {

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchCategories())
        dispatch(fetchStores())
        dispatch(fetchSuppliers())
        dispatch(fetchBrands())
        dispatch(fetchUnits())
        dispatch(fetchVariations())
        dispatch(fetchPaymentMethods())
        dispatch(fetchCustomers())
    }, [dispatch])
}

