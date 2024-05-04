import { createAsyncThunk, createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { setAuthToken } from "../utils/setAuthToken";
import { apiUrl, LOCAL_STORAGE_AUTH } from "../common/constants";
import { RootState, AppThunk, useAppSelector } from "./store";
import RequestResponseType from "src/types/api";

interface AuthState {
  authLoading: boolean;
  isLoggedIn: boolean;
  token: string;
  user: any;
}

const initialState: AuthState = {
  authLoading: false,
  isLoggedIn: false,
  token: "",
  user: null,
};

interface ExistingUser {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
  _v: number;
}

interface LoginForm {
  username: string;
  password: string;
}

interface RegistrationForm {
  username: string;
  password: string;
  name?: string;
  email?: string;
  // confirmedPassword: string;
  // role: string;
}

export const loadUser = createAsyncThunk<
  RequestResponseType<ExistingUser> | null,
  void
>("auth/loadUser", async (_, { getState }) => {
  console.log('loadUser')
  const state = getState() as { user: any };
  console.log('🚀 ~ > ~ state:', state)
  // const state = getState();
  try {
    if (localStorage[LOCAL_STORAGE_AUTH]) {
      console.log('local')
      console.log('🚀 ~ > ~ localStorage[LOCAL_STORAGE_AUTH]:', localStorage[LOCAL_STORAGE_AUTH])

      setAuthToken(localStorage[LOCAL_STORAGE_AUTH]);
      return state;
    } else {
      const response = await axios.get(`${apiUrl}/auth`);
      return response.data;
    }
  } catch (error: any) {
    // remove token for future request
    localStorage.removeItem(LOCAL_STORAGE_AUTH);
    setAuthToken(null);
    // TODO: add error type
    if (error.response.data) return error.response.data;
    else return { success: false, message: error.message, data: null };
  }
});

// return token when login successfully
export const login = createAsyncThunk<
  RequestResponseType<string> | null,
  LoginForm
>("auth/login", async (loginForm: LoginForm) => {
  console.log('🚀 ~ > ~ loginForm:', loginForm)
  try {
    const response = await axios.post(`${apiUrl}/users/auth`, loginForm);
    console.log('🚀 ~ > ~ response:', response)

    if (response.data.success) {
      localStorage.setItem(LOCAL_STORAGE_AUTH, JSON.stringify(response.data.data.auth));
      setAuthToken(localStorage[LOCAL_STORAGE_AUTH]);
    }

    return response.data;
  } catch (error: any) {
    // TODO: add error type
    if (error.response.data) return error.response.data;
    else return { success: false, message: error.message, data: null };
  }
});

export const register = createAsyncThunk<
  RequestResponseType<string> | null,
  RegistrationForm
>("auth/register", async (registrationForm: RegistrationForm) => {
  try {
    const response = await axios.post(
      `${apiUrl}/users/register`,
      registrationForm
    );
    if (response.data.success) {
      localStorage.setItem(LOCAL_STORAGE_AUTH, JSON.stringify(response.data.data.auth));
      console.log('🚀 ~ > ~ localStorage[LOCAL_STORAGE_AUTH]:', localStorage[LOCAL_STORAGE_AUTH])

      setAuthToken(localStorage[LOCAL_STORAGE_AUTH]);
    }
    return response.data;
  } catch (error: any) {
    // TODO: add error type
    if (error.response.data) return error.response.data;
    else return { success: false, message: error.message, data: null };
  }
});

export const logout = (): AppThunk => (dispatch) => {
  localStorage.removeItem(LOCAL_STORAGE_AUTH);
  setAuthToken(null)
  dispatch(
    setAuth({ authLoading: false, isLoggedIn: false, token: "", user: null })
  );
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.authLoading = action.payload.authLoading;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        return {
          ...state,
          authLoading: true,
        };
      })
      .addCase(loadUser.fulfilled, (state, { payload }) => {
        if (payload) {
          return {
            ...state,
            authLoading: false,
            isLoggedIn: true,
            token: localStorage[LOCAL_STORAGE_AUTH],
            user: payload.data,
          };
        }
        return state;
      })
      .addCase(loadUser.rejected, (state) => {
        return {
          ...state,
          authLoading: false,
          isLoggedIn: false,
          token: "",
          user: null,
        };
      })
      .addMatcher(isAnyOf (login.fulfilled, register.fulfilled), (state, { payload }) => {
        if (payload) {
          return {
            ...state,
            authLoading: false,
            isLoggedIn: true,
            token: JSON.parse(localStorage[LOCAL_STORAGE_AUTH]).token,
            user: payload.data,
          };
        }
        return state;
      });
  },
});

export const { setAuth } = authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectUsername = (state: RootState) => state.auth.user.username;
export const selectRole = (state: RootState) => state.auth.user.role;
export const selectAuthLoading = (state: RootState) => state.auth.authLoading;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;

export default authSlice.reducer;