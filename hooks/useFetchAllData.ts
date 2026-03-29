'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { persistor } from '@/store'
import {
    fetchCategories,
    fetchStores,
    fetchSuppliers,
    fetchBrands,
    fetchUnits,
    fetchVariations,
    fetchPaymentMethods,
    fetchCustomers,
    fetchRoles,
    fetchActiveExpenseCategories,
    fetchProfile,
    fetchBusinessConnectStatus
} from '@/store/slice'

/**
 * Hook to fetch all data entities and populate Redux state
 * Call this hook in your dashboard layout or main component
 */
export const useFetchAllData = () => {

    const dispatch = useAppDispatch()
    const [persistReady, setPersistReady] = useState(() => persistor.getState().bootstrapped)

    useEffect(() => {
        if (persistReady) return
        const unsub = persistor.subscribe(() => {
            if (persistor.getState().bootstrapped) {
                setPersistReady(true)
            }
        })
        return unsub
    }, [persistReady])

    useEffect(() => {
        if (!persistReady) return
        void Promise.allSettled([
            dispatch(fetchProfile()),
            dispatch(fetchBusinessConnectStatus()),
            dispatch(fetchCategories()),
            dispatch(fetchStores()),
            dispatch(fetchSuppliers()),
            dispatch(fetchBrands()),
            dispatch(fetchUnits()),
            dispatch(fetchVariations()),
            dispatch(fetchPaymentMethods()),
            dispatch(fetchCustomers()),
            dispatch(fetchRoles()),
            dispatch(fetchActiveExpenseCategories()),
        ])
    }, [dispatch, persistReady])
}

