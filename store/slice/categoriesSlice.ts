import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Category } from '@/types'
import { getCategories } from '@/services'

export interface CategoriesState {
    categories: Category[]
    isLoading: boolean
    error: string | null
}

const initialState: CategoriesState = {
    categories: [],
    isLoading: false,
    error: null,
}

// ================================
// Async thunk to fetch categories
// ================================
export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCategories()
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch categories')
        }
    }
)

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload
        },
        clearCategories: (state) => {
            state.categories = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false
                state.categories = action.payload
                state.error = null
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export const { setCategories, clearCategories } = categoriesSlice.actions

export const selectCategories = (state: { categories: CategoriesState }) => state.categories.categories
export const selectCategoriesLoading = (state: { categories: CategoriesState }) => state.categories.isLoading
export const selectCategoriesError = (state: { categories: CategoriesState }) => state.categories.error

export default categoriesSlice.reducer

