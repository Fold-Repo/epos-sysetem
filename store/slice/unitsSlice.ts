import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Unit } from '@/types'
import { getUnits } from '@/services'

export interface UnitsState {
    units: Unit[]
    isLoading: boolean
    error: string | null
}

const initialState: UnitsState = {
    units: [],
    isLoading: false,
    error: null,
}

// ================================
// Async thunk to fetch units
// ================================
export const fetchUnits = createAsyncThunk(
    'units/fetchUnits',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getUnits()
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch units')
        }
    }
)

const unitsSlice = createSlice({
    name: 'units',
    initialState,
    reducers: {
        setUnits: (state, action: PayloadAction<Unit[]>) => {
            state.units = action.payload
        },
        clearUnits: (state) => {
            state.units = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnits.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchUnits.fulfilled, (state, action) => {
                state.isLoading = false
                state.units = action.payload
                state.error = null
            })
            .addCase(fetchUnits.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export const { setUnits, clearUnits } = unitsSlice.actions

export const selectUnits = (state: { units: UnitsState }) => state.units.units
export const selectUnitsLoading = (state: { units: UnitsState }) => state.units.isLoading
export const selectUnitsError = (state: { units: UnitsState }) => state.units.error

export default unitsSlice.reducer

