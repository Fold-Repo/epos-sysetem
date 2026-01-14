import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"
import storageSession from "redux-persist/lib/storage/session"
import { 
    authReducer, 
    permissionsReducer,
    categoriesReducer,
    storesReducer,
    suppliersReducer,
    brandsReducer,
    unitsReducer,
    variationsReducer,
    paymentMethodsReducer,
    customersReducer
} from "./slice"

const rootReducer = combineReducers({
    auth: authReducer,
    permissions: permissionsReducer,
    categories: categoriesReducer,
    stores: storesReducer,
    suppliers: suppliersReducer,
    brands: brandsReducer,
    units: unitsReducer,
    variations: variationsReducer,
    paymentMethods: paymentMethodsReducer,
    customers: customersReducer,
})

const persistConfig = {
    key: "root",
    storage: storageSession,
    whitelist: ['auth', 'permissions', 'categories', 'stores', 'suppliers', 'brands', 'units', 'variations', 'paymentMethods', 'customers'], 
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Export hooks
export * from './hooks'
export * from './slice'