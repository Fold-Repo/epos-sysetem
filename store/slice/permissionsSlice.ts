import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserPermissions } from '@/types'

export interface PermissionsState {
    permissions: UserPermissions | null
}

const initialState: PermissionsState = {
    permissions: null,
}

const permissionsSlice = createSlice({
    name: 'permissions',
    initialState,
    reducers: {
        setPermissions: (state, action: PayloadAction<UserPermissions | null>) => {
            state.permissions = action.payload
        },
        clearPermissions: (state) => {
            state.permissions = null
        },
    },
})

export const { setPermissions, clearPermissions } = permissionsSlice.actions

export const selectPermissions = (state: { permissions: PermissionsState }) => state.permissions.permissions

export default permissionsSlice.reducer

