import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RoleListItem } from '@/types'
import { getRoles } from '@/services'

export interface RolesState {
    roles: RoleListItem[]
    isLoading: boolean
    error: string | null
}

const initialState: RolesState = {
    roles: [],
    isLoading: false,
    error: null,
}

// ================================
// Async thunk to fetch roles
// ================================
export const fetchRoles = createAsyncThunk(
    'roles/fetchRoles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getRoles()
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch roles')
        }
    }
)

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        setRoles: (state, action: PayloadAction<RoleListItem[]>) => {
            state.roles = action.payload
        },
        clearRoles: (state) => {
            state.roles = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.isLoading = false
                state.roles = action.payload
                state.error = null
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export const { setRoles, clearRoles } = rolesSlice.actions

export const selectRoles = (state: { roles: RolesState }) => state.roles.roles
export const selectRolesLoading = (state: { roles: RolesState }) => state.roles.isLoading
export const selectRolesError = (state: { roles: RolesState }) => state.roles.error

export default rolesSlice.reducer

