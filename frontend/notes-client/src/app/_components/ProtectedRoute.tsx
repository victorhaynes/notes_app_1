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
    // HydrateUserOrDoNothing component/wrapper handles this. This component just reads and decides what to do
    if (!loading && !user){
      router.push("/login")
    }
  },[user, router, loading]) // Technically only user needs to be in here but all dependencies including functions (router) used should be in the depndency array

  if (loading){
    return <div className="fixed inset-0 flex justify-center items-center">Loading...</div>
  }

  if (!user){
    return <div className="fixed inset-0 flex justify-center items-center text-red-800">You must login to view this page. Redirecting...</div>
  }

  return (
    <>{children}</>
  )
}

export default ProtectedRoute