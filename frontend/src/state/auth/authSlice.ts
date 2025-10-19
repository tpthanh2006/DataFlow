import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RequiredClaims, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { RootState } from "../store";
import { jwtDecode } from "jwt-decode";
import type { CustomClaims } from "@/lib/auth";

// Define type of User State
interface AuthState {
  session: Session | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
}

// Define inital state of AUTH
const initialState: AuthState = {
  session: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
};

// Fetch Session
export const fetchSession = createAsyncThunk(
  "auth/fetchSession",
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        return rejectWithValue(error);
      }

      return session;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch session",
      );
    }
  },
);

// Log In
export const logIn = createAsyncThunk(
  "auth/login",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to log in",
      );
    }
  },
);

// Log Out
export const logOut = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return rejectWithValue(error.message);
      }

      return;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to log out",
      );
    }
  },
);

// Create auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    RESET: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
    },
    SET_SESSION: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch session
      .addCase(fetchSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.session = action.payload;
        //console.log(action.payload);
      })
      .addCase(fetchSession.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.session = null;
      })

      // Log in
      .addCase(logIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logIn.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(logIn.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.session = null;
      })

      // Log out
      .addCase(logOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.session = null;
      })
      .addCase(logOut.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

// Export auth actions
export const { RESET, SET_SESSION } = authSlice.actions;

// Export some selected props
export const selectSession = (state: RootState) => state.auth.session;
export const selectUser = (state: RootState) => state.auth.session?.user;
export const selectRole = (state: RootState) => {
  const accessToken = state.auth.session?.access_token;
  if (!accessToken) {
    return null;
  }
  try {
    const decodedToken = jwtDecode(accessToken) satisfies RequiredClaims &
      CustomClaims;
    return decodedToken.user_role;
  } catch (error) {
    console.error("Error decoding auth access token:", error);
    return null;
  }
};

// Export auth reducer
export default authSlice.reducer;
