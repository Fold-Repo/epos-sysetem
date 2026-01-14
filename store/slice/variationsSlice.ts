import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Variation } from '@/types'
import { getVariations } from '@/services'

export interface VariationsState {
    variations: Variation[]
    isLoading: boolean
    error: string | null
}

const initialState: VariationsState = {
    variations: [],
    isLoading: false,
    error: null,
}

// ================================
// Async thunk to fetch variations
// ================================
export const fetchVariations = createAsyncThunk(
    'variations/fetchVariations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getVariations(1, 200)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch variations')
        }
    }
)

const variationsSlice = createSlice({
    name: 'variations',
    initialState,
    reducers: {
        setVariations: (state, action: PayloadAction<Variation[]>) => {
            state.variations = action.payload
        },
        clearVariations: (state) => {
            state.variations = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVariations.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchVariations.fulfilled, (state, action) => {
                state.isLoading = false
                state.variations = action.payload
                state.error = null
            })
            .addCase(fetchVariations.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export const { setVariations, clearVariations } = variationsSlice.actions

export const selectVariations = (state: { variations: VariationsState }) => state.variations.variations
export const selectVariationsLoading = (state: { variations: VariationsState }) => state.variations.isLoading
export const selectVariationsError = (state: { variations: VariationsState }) => state.variations.error

export default variationsSlice.reducer

