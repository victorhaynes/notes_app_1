import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosPublic } from "@/app/_utils/axios";
import { createAsyncThunk  } from "@reduxjs/toolkit";

// -- Types --
type User = {
  id: number;
  username: string;
  email: string;
}

type UserState = {
  user: User | null;
  loading: boolean;
  error: string | null
}

// -- Initial State --
const initialState: UserState = {
  user: null,
  loading: false,
  error: null
}

// -- Thunks --
export const registerUser = createAsyncThunk<
  User, 
  { "username": string, "email": string, "password": string },
  { rejectValue: string}
  >("user/register",
    async (userData, {rejectWithValue}) => {
      try {
        const response = await axiosPublic.post("auth/register", userData);
        return response.data;
      } catch (error: any){ // Note: axios throws for HTTP error codes automatically
        const errorMessage = error.response?.data?.message || "Registration failed."
        return rejectWithValue(errorMessage)
      }
    }
  )

// -- Slice --
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>){
      state.user = action.payload;
    },
    logout(state){
      state.user = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed"
      })
  }
})

export const { login, logout} = userSlice.actions;
export default userSlice.reducer