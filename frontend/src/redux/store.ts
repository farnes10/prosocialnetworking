import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice'
import applicationSlice from './applicationSlice'
import jobSlice from './jobSlice'
import notificationSlice from './notificationSlice'



const store = configureStore({
    reducer: {
        auth: authSlice,
        job:jobSlice,
        application: applicationSlice,
        notification:notificationSlice
    }
    
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store