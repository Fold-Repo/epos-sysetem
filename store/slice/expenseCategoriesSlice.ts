import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ActiveExpenseCategory } from '@/types'
import { getActiveExpenseCategories } from '@/services'

export interface ExpenseCategoriesState {
    activeCategories: ActiveExpenseCategory[]
    isLoadingActive: boolean
    error: string | null
}

const initialState: ExpenseCategoriesState = {
    activeCategories: [],
    isLoadingActive: false,
    error: null,
}

// ================================
// Async thunk to fetch active expense categories
// ================================
export const fetchActiveExpenseCategories = createAsyncThunk(
    'expenseCategories/fetchActiveExpenseCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getActiveExpenseCategories()
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch active expense categories')
        }
    }
)

const expenseCategoriesSlice = createSlice({
    name: 'expenseCategories',
    initialState,
    reducers: {
        setActiveExpenseCategories: (state, action: PayloadAction<ActiveExpenseCategory[]>) => {
            state.activeCategories = action.payload
        },
        clearExpenseCategories: (state) => {
            state.activeCategories = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch active expense categories
            .addCase(fetchActiveExpenseCategories.pending, (state) => {
                state.isLoadingActive = true
                state.error = null
            })
            .addCase(fetchActiveExpenseCategories.fulfilled, (state, action) => {
                state.isLoadingActive = false
                state.activeCategories = action.payload
                state.error = null
            })
            .addCase(fetchActiveExpenseCategories.rejected, (state, action) => {
                state.isLoadingActive = false
                state.error = action.payload as string
            })
    },
})

export const { setActiveExpenseCategories, clearExpenseCategories } = expenseCategoriesSlice.actions

export const selectActiveExpenseCategories = (state: { expenseCategories: ExpenseCategoriesState }) => state.expenseCategories.activeCategories
export const selectActiveExpenseCategoriesLoading = (state: { expenseCategories: ExpenseCategoriesState }) => state.expenseCategories.isLoadingActive
export const selectExpenseCategoriesError = (state: { expenseCategories: ExpenseCategoriesState }) => state.expenseCategories.error

export default expenseCategoriesSlice.reducer
