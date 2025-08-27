"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchCurrentUser } from "@/redux/features/userSlice"
import type { AppDispatch } from "@/redux/store"

// -- Purpose of this component is to fetch and re-set the current user in state, if one exists according to the cookies
// -- allows users to refresh manually without losing their user state

export const HydrateUserOrDoNothing = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch]) // -- Included per convention, probably not actually necessary

  return null
}