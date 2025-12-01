import { configureStore } from '@reduxjs/toolkit'; 
import authSliceReducer from './Slice/authSlice';
import cartSliceReducer from './Slice/cartSlice';

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    cart: cartSliceReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;