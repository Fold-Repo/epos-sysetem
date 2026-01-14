import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Brand } from '@/types'
import { getBrands } from '@/services'

export interface BrandsState {
    brands: Brand[]
    isLoading: boolean
    error: string | null
}

const initialState: BrandsState = {
    brands: [],
    isLoading: false,
    error: null,
}

// ================================
// Async thunk to fetch brands
// ================================
export const fetchBrands = createAsyncThunk(
    'brands/fetchBrands',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getBrands(1, 200)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch brands')
        }
    }
)

const brandsSlice = createSlice({
    name: 'brands',
    initialState,
    reducers: {
        setBrands: (state, action: PayloadAction<Brand[]>) => {
            state.brands = action.payload
        },
        clearBrands: (state) => {
            state.brands = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBrands.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.isLoading = false
                state.brands = action.payload
                state.error = null
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export const { setBrands, clearBrands } = brandsSlice.actions

export const selectBrands = (state: { brands: BrandsState }) => state.brands.brands
export const selectBrandsLoading = (state: { brands: BrandsState }) => state.brands.isLoading
export const selectBrandsError = (state: { brands: BrandsState }) => state.brands.error

export default brandsSlice.reducer

