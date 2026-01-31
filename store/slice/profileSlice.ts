import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProfile } from '@/services/users'
import type { ProfileData } from '@/types'

export interface ProfileState {
    data: ProfileData | null
    isLoading: boolean
    error: string | null
}

const initialState: ProfileState = {
    data: null,
    isLoading: false,
    error: null,
}

// ================================
// Async thunk to fetch profile
// ================================
export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getProfile()
            return data
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to fetch profile'
            return rejectWithValue(message)
        }
    }
)

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.data = null
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export const { clearProfile } = profileSlice.actions

export const selectProfile = (state: { profile: ProfileState }) => state.profile.data
export const selectProfileLoading = (state: { profile: ProfileState }) => state.profile.isLoading
export const selectProfileError = (state: { profile: ProfileState }) => state.profile.error

export default profileSlice.reducer
