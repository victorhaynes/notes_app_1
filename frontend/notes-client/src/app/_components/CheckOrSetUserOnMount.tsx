"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { login, logout } from "@/redux/features/userSlice"
import { axiosAuthenticated } from "../_utils/axios"
import type { AppDispatch } from "@/redux/store"

// -- Purpose of this component is to fetch and re-set the current user in state, if one exists according to the cookies
// -- allows users to refresh manually without losing their user state

export const CheckOrSetUserOnMount = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    async function fetchAndSetCurrentUser(){
      try {
        const response = await axiosAuthenticated.get("/auth/me/")
        dispatch(login(response.data))
      } catch (error) {
        console.error(error)
        dispatch(logout()) // -- this strictly removes the user from state. 
      }
    }

    fetchAndSetCurrentUser()
  }, [dispatch]) // -- Included per convention, probably not actually necessary


  return null
}