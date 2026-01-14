import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { CustomerType } from '@/types'
import { getCustomers } from '@/services'

export interface CustomersState {
    customers: CustomerType[]
    isLoading: boolean
    error: string | null
}

const initialState: CustomersState = {
    customers: [],
    isLoading: false,
    error: null,
}

// ================================
// Async thunk to fetch customers
// ================================
export const fetchCustomers = createAsyncThunk(
    'customers/fetchCustomers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCustomers({ page: 1, limit: 200 })
            return response.customers
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch customers')
        }
    }
)

const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        setCustomers: (state, action: PayloadAction<CustomerType[]>) => {
            state.customers = action.payload
        },
        clearCustomers: (state) => {
            state.customers = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.isLoading = false
                state.customers = action.payload
                state.error = null
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export const { setCustomers, clearCustomers } = customersSlice.actions

export const selectCustomers = (state: { customers: CustomersState }) => state.customers.customers
export const selectCustomersLoading = (state: { customers: CustomersState }) => state.customers.isLoading
export const selectCustomersError = (state: { customers: CustomersState }) => state.customers.error

export default customersSlice.reducer

