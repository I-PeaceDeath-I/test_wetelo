import { configureStore } from '@reduxjs/toolkit'
// 1. Change 'baseApi' to 'api'
import { api } from './baseApi' 

export const store = configureStore({
  reducer: {
    // 2. Use api.reducerPath
    [api.reducerPath]: api.reducer,
  },
  // 3. Use api.middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})