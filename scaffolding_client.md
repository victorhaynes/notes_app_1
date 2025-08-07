## 1) Initialize react app using react-router template (includes typescript)
```sh
npx npx create-next-app@latest
cd notes-client
npm install axios
npm install @reduxjs/toolkit react-redux
npm install --save-dev @types/js-cookie
npm install react-hook-form
```
```sh
# notes-client
# TS yes
# ESLint no
# Tailwind yes
# src yes
# app router yes
# turbopack no
# customize alias no
```
```sh
npm run dev
```

## 2) Clean out global.css leaving tailwind import and page.tsx (landing page), public/ .svg images and remove the favicon.ico if you want

## 3) make folders & page.tsx components for each of the routes you want to have. In Next
```txt
src/app/page.tsx    <----- this is the landing page. everything else goes in a folder
src/app/about/page.tsx
src/app/cars/page.tsx
src/app/cars/[id]/page.tsx
```

## 5) src/app/_utils create .ts wrapper for axios
```ts
import axios from "axios";
import Cookies from "js-cookie"

const axiosPublic = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true
});

const axiosSecure = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
})

axiosSecure.interceptors.request.use((config) => {
    const csrfToken = Cookies.get("csrftoken");
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config
  }
)

export { axiosPublic, axiosSecure }
```
## 6) make src/app/_components/ folder for shared components i.e. Navbar.tsx
## 7) use Link import to create a NavBar component and return in it in root.tsx's App component


## 8 ) create src/redux folder
## 8a src/redux/features/authSlice.ts (for example, as many slices as needed)
```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: number;
  name: string;
  email: string;
}

type UserState = {
  user: User | null;
  loading: boolean;
  error: string | null
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null
}

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
  }
})

export const { login, logout} = userSlice.actions;
export default userSlice.reducer
```
## 8b add src/redux/store.ts, add reducers to the store
```ts
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'

export const store = configureStore({
  reducer: {
    auth: userReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
```


## 9) Create src/app/providers.tsx
```tsx
"use client"

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

function AppProviders({ children }: { children: ReactNode }){
  return <Provider store={store}>{children}</Provider>
}

export default AppProviders
```

## 10) Add the provider to the layout.tsx
```tsx
import AppProviders from "./providers";
...
...
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>
          <header>
            <Navbar />
          </header>
          <main>
            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
```










<!-- 
# 8) Create src/app/_context folder for state management
```txt
create context providers for your state:
these define the variables and the operations on them
```
```tsx
"use client"
import { createContext, useContext, useEffect, useState } from "react";
import axiosPublic from "../_utils/axios";

type Note = { // Defining the shape of a single Note
  id: number;
  title: string;
  content: string;
  owner?: object;
  created_at: string;
  updated_at: string;
}

type NotesContextData = { // Defining the shape of the notes context
  notes: Note[];
  fetchNotes: () => Promise<void>;
}

// Creating the notes context
const NotesContext = createContext<NotesContextData | undefined>(undefined);

// Creating the context provider component
export function NotesProvider({ children }: {children: React.ReactNode}) {
  const [notes, setNotes] = useState<Note[]>([]);

  async function fetchNotes(){
    try {
      const response = await axiosPublic.get("notes/");
      setNotes(response.data)
    } catch (err) {
      console.error("Error fetching notes:", err)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <NotesContext.Provider value={{ notes, fetchNotes}}>
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes(): NotesContextData {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes() must be used within a child of NotesProvider. Be sure to wrap your component with NotesProvider.")
  }
  return context
}
```
# 9) Wrap the content of your layout.tsx's JSX with the provider, now any child can consume it
# 10) import the custom use"Context"() function from your context creator, destructure what you need and use it as desired in the component -->
