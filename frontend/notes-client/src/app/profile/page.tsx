"use client"

import type { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import ProtectedRoute from "../_components/ProtectedRoute"

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.userState.user)


  return (
    <ProtectedRoute>
      <div className='max-w-7xl mx-auto px-4 mt-4'>
        <h1 className='font-bold text-xl mb-4'>My Profile</h1>
        <div>
          <div><strong>ID: </strong>{user?.id}</div>
          <div><strong>username: </strong>{user?.username}</div>
          <div><strong>email: </strong>{user?.email}</div>
        </div>
      </div>
    </ProtectedRoute>

  )
}

export default ProfilePage