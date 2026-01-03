import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Supplier } from '@/types'
import { getSuppliers } from '@/services'

export interface SuppliersState {
    suppliers: Supplier[]
    isLoading: boolean
    error: string | null
}

const initialState: SuppliersState = {
    suppliers: [],
    isLoading: false,
    error: null,
}

// ================================
// Async thunk to fetch suppliers
// ================================
export const fetchSuppliers = createAsyncThunk(
    'suppliers/fetchSuppliers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getSuppliers()
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch suppliers')
        }
    }
)

const suppliersSlice = createSlice({
    name: 'suppliers',
    initialState,
    reducers: {
        setSuppliers: (state, action: PayloadAction<Supplier[]>) => {
            state.suppliers = action.payload
        },
        clearSuppliers: (state) => {
            state.suppliers = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuppliers.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchSuppliers.fulfilled, (state, action) => {
                state.isLoading = false
                state.suppliers = action.payload
                state.error = null
            })
            .addCase(fetchSuppliers.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export const { setSuppliers, clearSuppliers } = suppliersSlice.actions

export const selectSuppliers = (state: { suppliers: SuppliersState }) => state.suppliers.suppliers
export const selectSuppliersLoading = (state: { suppliers: SuppliersState }) => state.suppliers.isLoading
export const selectSuppliersError = (state: { suppliers: SuppliersState }) => state.suppliers.error

export default suppliersSlice.reducer

