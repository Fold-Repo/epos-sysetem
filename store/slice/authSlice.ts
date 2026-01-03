import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
    token: string | null
    isAuthenticated: boolean
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload
            state.isAuthenticated = Boolean(action.payload)
        },
        clearAuth: (state) => {
            state.token = null
            state.isAuthenticated = false
        },
    },
})

export const { setAuth, clearAuth } = authSlice.actions

export const selectAuth = (state: { auth: AuthState }) => state.auth
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token

export default authSlice.reducer

