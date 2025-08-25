import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import notesReducer from './features/noteSlice'

export const store = configureStore({
  reducer: {
    userState: userReducer,
    notesState: notesReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch