import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getBusinessConnectStatus } from '@/services'
import type { BusinessConnectStatusData } from '@/types'

export interface BusinessConnectState {
    data: BusinessConnectStatusData | null
    isLoading: boolean
    error: string | null
}

const initialState: BusinessConnectState = {
    data: null,
    isLoading: false,
    error: null,
}

export const fetchBusinessConnectStatus = createAsyncThunk(
    'business/fetchBusinessConnectStatus',
    async (_, { rejectWithValue }) => {
        try {
            const res = await getBusinessConnectStatus()
            return res.data
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to fetch business connect status'
            return rejectWithValue(message)
        }
    }
)

const businessSlice = createSlice({
    name: 'business',
    initialState,
    reducers: {
        clearBusinessConnectStatus: (state) => {
            state.data = null
            state.isLoading = false
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBusinessConnectStatus.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchBusinessConnectStatus.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchBusinessConnectStatus.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export const { clearBusinessConnectStatus } = businessSlice.actions

export const selectBusinessConnectStatus = (state: { business: BusinessConnectState }) => state.business.data
export const selectBusinessConnectLoading = (state: { business: BusinessConnectState }) => state.business.isLoading
export const selectBusinessConnectError = (state: { business: BusinessConnectState }) => state.business.error

export default businessSlice.reducer

