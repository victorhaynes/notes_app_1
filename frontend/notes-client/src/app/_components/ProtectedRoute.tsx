"use client"

import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect, ReactNode } from "react"
import type { RootState } from "@/redux/store"

type ProtectedRouterProps = {
  children: ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouterProps) => {
  const {user, loading} = useSelector((state: RootState) => state.userState)
  const router = useRouter();

  useEffect(() => {
    // redirect if a user is not currently being fetched and there isn't one in state
    if (!loading && !user){
      router.push("/login")
    }
  },[user, router, loading]) // Technically only user needs to be in here but all dependencies including functions (router) used should be in the depndency array

  if (loading){
    return <div>Loading...</div>
  }

  if (!user){
    return <div>You must login to view this page. xxxRedirecting...</div>
  }

  return (
    <>{children}</>
  )
}

export default ProtectedRoute