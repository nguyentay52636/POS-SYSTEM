import { configureStore } from '@reduxjs/toolkit'; 
import authSliceReducer from './Slice/authSlice';
const store = configureStore({
  reducer: {
    auth: authSliceReducer, 
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;