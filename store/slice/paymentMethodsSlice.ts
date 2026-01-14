import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { PaymentMethodType } from '@/types'
import { getPaymentMethods } from '@/services'

export interface PaymentMethodsState {
    paymentMethods: PaymentMethodType[]
    isLoading: boolean
    error: string | null
}

const initialState: PaymentMethodsState = {
    paymentMethods: [],
    isLoading: false,
    error: null,
}

// ================================
// Async thunk to fetch payment methods
// ================================
export const fetchPaymentMethods = createAsyncThunk(
    'paymentMethods/fetchPaymentMethods',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getPaymentMethods()
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch payment methods')
        }
    }
)

const paymentMethodsSlice = createSlice({
    name: 'paymentMethods',
    initialState,
    reducers: {
        setPaymentMethods: (state, action: PayloadAction<PaymentMethodType[]>) => {
            state.paymentMethods = action.payload
        },
        clearPaymentMethods: (state) => {
            state.paymentMethods = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaymentMethods.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
                state.isLoading = false
                state.paymentMethods = action.payload
                state.error = null
            })
            .addCase(fetchPaymentMethods.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export const { setPaymentMethods, clearPaymentMethods } = paymentMethodsSlice.actions

export const selectPaymentMethods = (state: { paymentMethods: PaymentMethodsState }) => state.paymentMethods.paymentMethods
export const selectPaymentMethodsLoading = (state: { paymentMethods: PaymentMethodsState }) => state.paymentMethods.isLoading
export const selectPaymentMethodsError = (state: { paymentMethods: PaymentMethodsState }) => state.paymentMethods.error

export default paymentMethodsSlice.reducer

