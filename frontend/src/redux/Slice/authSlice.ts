import { login, register, changePassword } from "@/apis/authApi";
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
changePasswordLoading : boolean
changePasswordSuccess : boolean
changePasswordError : string | null
}
// Safe localStorage access for SSR
const getFromLocalStorage = (key: string, defaultValue: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
};

// Parse localStorage data safely
const parseLocalStorageData = (key: string, defaultValue: any) => {
  try {
    const data = getFromLocalStorage(key, JSON.stringify(defaultValue));
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const isAuthenticated = parseLocalStorageData('isAuthenticated', false);
const currentUser = parseLocalStorageData('currentUser', null);
const token = getFromLocalStorage('token', '');

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
    registrationSuccess : false,
    changePasswordLoading : false,
    changePasswordSuccess : false,
    changePasswordError : null
}
export const loginThunk = createAsyncThunk(
    'auth/login',
    async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
      try {
        const response = await login(username, password);
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

  export const changePasswordThunk = createAsyncThunk(
    'auth/changePassword',
    async ({oldPassword, newPassword, confirmPassword}: {oldPassword: string, newPassword: string, confirmPassword: string}, {rejectWithValue}) => {
      try {
        const response = await changePassword({oldPassword, newPassword, confirmPassword})
        return response
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Đổi mật khẩu thất bại';
        return rejectWithValue(errorMessage);
      }
    }
  )

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
      resetChangePasswordState: (state) => {
        state.changePasswordLoading = false;
        state.changePasswordSuccess = false;
        state.changePasswordError = null;
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
          
          if (action.payload) {
            const userData = action.payload.user;
            const token = action.payload.token; // Sửa từ accessToken thành token
            
            console.log('User data:', userData);
            console.log('Token:', token);
            
            if (userData && token) {
              state.user = userData;
              state.token = token;
              state.isAuthenticated = true;
      
              const userDataToSave = {
                ...userData,
                id: userData.userId, // Sửa từ user_id thành userId
              };
              console.log('Saving user data to localStorage:', userDataToSave);
      
              if (typeof window !== 'undefined') {
                try {
                  localStorage.setItem('currentUser', JSON.stringify(userDataToSave));
                  localStorage.setItem('token', token);
                  localStorage.setItem('isAuthenticated', 'true');
                  
                  // Verify data was saved
                  const savedUser = localStorage.getItem('currentUser');
                  const savedToken = localStorage.getItem('token');
                  const savedAuth = localStorage.getItem('isAuthenticated');
                  
                  console.log('Verification - Saved user:', savedUser);
                  console.log('Verification - Saved token:', savedToken);
                  console.log('Verification - Saved auth:', savedAuth);
                  
                  console.log('Data saved to localStorage successfully');
                } catch (error) {
                  console.error('Error saving to localStorage:', error);
                  state.error = 'Lỗi lưu thông tin đăng nhập';
                }
              }
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

      // Change Password cases
      builder
        .addCase(changePasswordThunk.pending, (state) => {
          state.changePasswordLoading = true;
          state.changePasswordError = null;
          state.changePasswordSuccess = false;
        })
        .addCase(changePasswordThunk.fulfilled, (state) => {
          state.changePasswordLoading = false;
          state.changePasswordError = null;
          state.changePasswordSuccess = true;
        })
        .addCase(changePasswordThunk.rejected, (state, action) => {
          state.changePasswordLoading = false;
          state.changePasswordError = action.payload as string;
          state.changePasswordSuccess = false;
        });
    },
  });
  
  export const { logout, setCredentials, clearError, resetRegistrationSuccess, resetChangePasswordState } = authSlice.actions;
  export { register }; 
  export default authSlice.reducer;
  export const selectAuth = (state: RootState) => state.auth;
