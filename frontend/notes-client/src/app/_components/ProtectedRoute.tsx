"use client"

import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect, ReactNode } from "react"
import type { RootState } from "@/redux/store"

type ProtectedRouterProps = {
  children: ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouterProps) => {
  const user = useSelector((state: RootState) => state.user.user)
  const router = useRouter();

  useEffect(() => {
    if (!user){
      router.push("/login")
    }
  },[user, router]) // Technically only user needs to be in here but all dependencies including functions (router) used should be in the depndency array

  if (!user){
    return <div>You must login to view this page. Redirecting...</div>
  }

  return (
    <>{children}</>
  )
}

export default ProtectedRoute