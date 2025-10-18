import { login, register } from "@/apis/authApi";
import { IUser } from "@/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AuthState  { 
user :IUser | null   
token : string | null
isAuthenticated : boolean
isLoading : boolean
error : string | null
registrationSuccess : boolean
}
// Safe localStorage access for SSR
const getFromLocalStorage = (key: string, defaultValue: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
};

const isAuthenticated = JSON.parse(getFromLocalStorage('isAuthenticated', 'false'))
const currentUser = JSON.parse(getFromLocalStorage('currentUser', 'null'))
const token = getFromLocalStorage('token', '')

console.log('Loading from localStorage:', {
  isAuthenticated,
  currentUser,
  token
});

const initialState : AuthState =  { 
    user : currentUser,
    token : token,
    isAuthenticated: isAuthenticated && !!currentUser && !!token, 
    isLoading : false,
    error : null,
    registrationSuccess : false
}
export const loginThunk = createAsyncThunk(
    'auth/login',
    async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
      try {
        const response = await login(username, password);
        // Assuming the API returns a token in the data
        return response;
      } catch (error) {
        return rejectWithValue((error as Error).message || 'Login failed');
      }
    },
  );
  const registerThunk = createAsyncThunk('auth/register',async ({username, password, full_name}: {username: string, password: string, full_name: string}, {rejectWithValue})=> {
    try {
        const response = await register({username, password, full_name})
        return response
    } catch (error:any) {
        return rejectWithValue((error as Error).message || 'Register failed');
    }
  })    
  // Create the auth slice
  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      logout: (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('isAuthenticated');
          window.location.reload();
        }
      },
      setCredentials: (state, action: PayloadAction<{ user: IUser; token: string }>) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      },
      clearError: (state) => {
        state.error = null;
      },
      resetRegistrationSuccess: (state) => {
        state.registrationSuccess = false;
      },
    },
    extraReducers: (builder) => {
      // Login cases
      builder
        .addCase(loginThunk.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(loginThunk.fulfilled, (state, action) => {
            console.log('Login Response:', action.payload);
            console.log('Response structure:', JSON.stringify(action.payload, null, 2));
          
          state.isLoading = false;
          state.error = null;
          
          // Xử lý response trực tiếp từ API
          if (action.payload) {
            // API trả về trực tiếp user data và token
            const userData = action.payload.user;
            const token = action.payload.accessToken;
            
            console.log('User data:', userData);
            console.log('Token:', token);
            
            if (userData && token) {
              state.user = userData;
              state.token = token;
              state.isAuthenticated = true;
      
              // Lưu thông tin user vào localStorage với đầy đủ thông tin
              const userDataToSave = {
                ...userData,
                id: userData._id, // Sử dụng _id từ MongoDB
              };
              console.log('Saving user data to localStorage:', userDataToSave);
      
              if (typeof window !== 'undefined') {
                localStorage.setItem('currentUser', JSON.stringify(userDataToSave));
                localStorage.setItem('token', token);
                localStorage.setItem('isAuthenticated', 'true');
              }
              
              console.log('Data saved to localStorage successfully');
            } else {
              console.error('Missing user data or token in response');
              state.error = 'Dữ liệu người dùng không hợp lệ';
              state.isAuthenticated = false;
            }
          } else {
            console.error('No payload in response');
            state.error = 'Đăng nhập thất bại';
            state.isAuthenticated = false;
          }
        })
        .addCase(loginThunk.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
          state.isAuthenticated = false;
          
          // Xóa thông tin cũ trong localStorage khi login thất bại
          if (typeof window !== 'undefined') {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            localStorage.removeItem('isAuthenticated');
          }
          
          console.log('Login failed:', action.payload);
        });
  
      // Register cases
      builder
        .addCase(registerThunk.pending, (state) => {
          state.isLoading = true;
          state.error = null;
          state.registrationSuccess = false;
        })
        .addCase(registerThunk.fulfilled, (state) => {
          state.isLoading = false;
          state.error = null;
          state.registrationSuccess = true;
        })
        .addCase(registerThunk.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
          state.registrationSuccess = false;
        });
    },
  });
  
  export const { logout, setCredentials, clearError, resetRegistrationSuccess } = authSlice.actions;
  export { register }; // Export register function
  export default authSlice.reducer;
  export const selectAuth = (state: RootState) => state.auth;
