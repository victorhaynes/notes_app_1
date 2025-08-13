import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosAuthenticated, axiosPublic } from "@/app/_utils/axios";
import { createAsyncThunk  } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

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


// -- Thunk Format --
// createAsyncThunk<
//   Returned,         // Type of what the thunk will resolve with
//   ThunkArg,         // Type of the argument you pass to dispatch(registerUser(...))
//   ThunkApiConfig    // Extra options for typing rejectValue, state, dispatch, etc.
// >(
//   typePrefix: string,              // First parameter
//   payloadCreator: AsyncFunction    // Second parameter
// )


// -- Thunks --
export const registerUser = createAsyncThunk<
  User, 
  { "username": string, "email": string, "password": string },
  { rejectValue: string}
  >("user/register", // -- User -> register, action type prefix. Listens for "user/register/pending", "user/register/fulfilled", and "user/register/rejected"
    async (userData, {rejectWithValue}) => {
      try {
        const response = await axiosPublic.post<User>("auth/register/", userData); // -- Axios allows any response type, type the response here as User
        return response.data;
      } catch (error: any){ // Note: axios throws for HTTP error codes automatically
        const errorMessage = error.response?.data?.message || "Registration failed."
        return rejectWithValue(errorMessage)
      }
    }
  )

  export const performLogout = createAsyncThunk(
    "user/logout",
    async (_, {dispatch}) => {
      try {
        await axiosAuthenticated.post("/auth/logout/")
        Cookies.remove("sessionid")
        Cookies.remove("csrftoken")
      } catch (error) {
        console.log()
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
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { // -- Note: registerUser() has type prefix "user/register". Here we define the various states of the thunk
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