import { createSlice } from "@reduxjs/toolkit";
import { axiosAuthenticated, axiosPublic } from "@/app/_utils/axios";
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


// -- Thunk Format --
// createAsyncThunk<
//   Returned,         // Type of what the thunk will resolve with
//   ThunkArg,         // Type of the argument you pass to dispatch(registerUser(...))
//   ThunkApiConfig    // Extra options for typing rejectValue, state, dispatch, etc...can destructure thunkAPI
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
        const errorBody = error.response?.data
        let errorMessages = "Registration failed." // Default/Generic
        if (errorBody?.serializer_errors){ // If there are serializer/validation errors in Django I'm sending the default errors inside of a serializer_errors key
          errorMessages = Object.entries(errorBody.serializer_errors)
            .flatMap(([fieldName, fieldErrors]) => {
              return (fieldErrors as string[]).map(individualError => {
                return `${fieldName}: ${individualError}`
              })
            })
            .join(" ")
        }

        return rejectWithValue(errorMessages)
      }
    }
  )

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string}
  >("user/fetchCurrentUser", 
    async (_, {rejectWithValue}) => {
      try {
        const response = await axiosAuthenticated.get<User>("/auth/me/")
        return response.data
      } catch (error){
        return rejectWithValue("Failed to fetch current user")
      }
    }
  )

  export const requestLogout = createAsyncThunk<
    void,
    void,
    {rejectValue: string}
    >("user/logout",
      async (_, {rejectWithValue}) => {
        try {
          await axiosAuthenticated.post("/auth/logout/")
        } catch (error) {
          return rejectWithValue("Logout failed.")
        }
      }
    )

export const loginUser = createAsyncThunk<
  User,
  {"username": string, "password": string},
  {rejectValue: string}
  >("user/login",
    async (formData, {rejectWithValue}) => {
      try {
        const response = await axiosPublic.post<User>("/auth/login/", formData)
        return response.data
      } catch (error) {
        return rejectWithValue("Login failed")
      }
    }
  )

// -- Slice --
const userSlice = createSlice({ // -- Note thunks just return payloads or null, state mutation happens in the slice
  name: "user",
  initialState,
  reducers: { // -- Synchronous state mutation only
  },
  extraReducers: (builder) => { // -- Asynchronous state mutation
    builder
      // -- User Registration Cases
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
        state.error = action.payload ?? "Registration failed."
      })
      // -- Fetch Current User Cases -- note .pending not necessary we don't care about loading state for this really
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.user = null
        // -- Note: we do not want to set any errors for this...it is totally valid for user check to fail
      })
      // -- Logout Cases
      .addCase(requestLogout.fulfilled, (state) => {
        state.user = null
      })
      .addCase(requestLogout.rejected, (state, action) => {
        state.user = null
        state.error = action.payload ?? "Logout failed."
      })
      // -- Login Cases
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed."
      })
  }
})

// standard reducers would be exported here // export const { login  } = userSlice.actions;
export default userSlice.reducer