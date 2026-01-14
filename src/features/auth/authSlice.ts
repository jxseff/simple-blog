import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabaseClient } from "../../services/supabase";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  error: null,
};

//thunks

export const registerUser = createAsyncThunk(
  "auth/register",

  async (
    {email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",

  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",

  async (_, { rejectWithValue }) => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSession = createAsyncThunk(
  "auth/getSession",
  async () => {
    const { data } = await supabaseClient.auth.getSession();
    return data.session;
  }
);

//slice

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      //register
        .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.session = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //get session
      .addCase(getSession.fulfilled, (state, action) => {
        state.session = action.payload;
        state.user = action.payload ? action.payload.user : null;
      });
  },
});

export default authSlice.reducer;