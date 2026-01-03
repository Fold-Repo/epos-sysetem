import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { StoreListItem } from '@/types'
import { getStores } from '@/services'

export interface StoresState {
    stores: StoreListItem[]
    isLoading: boolean
    error: string | null
}

const initialState: StoresState = {
    stores: [],
    isLoading: false,
    error: null,
}

// ================================
// Async thunk to fetch stores
// ================================
export const fetchStores = createAsyncThunk(
    'stores/fetchStores',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getStores()
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch stores')
        }
    }
)

const storesSlice = createSlice({
    name: 'stores',
    initialState,
    reducers: {
        setStores: (state, action: PayloadAction<StoreListItem[]>) => {
            state.stores = action.payload
        },
        clearStores: (state) => {
            state.stores = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStores.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchStores.fulfilled, (state, action) => {
                state.isLoading = false
                state.stores = action.payload
                state.error = null
            })
            .addCase(fetchStores.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export const { setStores, clearStores } = storesSlice.actions

export const selectStores = (state: { stores: StoresState }) => state.stores.stores
export const selectStoresLoading = (state: { stores: StoresState }) => state.stores.isLoading
export const selectStoresError = (state: { stores: StoresState }) => state.stores.error

export default storesSlice.reducer

