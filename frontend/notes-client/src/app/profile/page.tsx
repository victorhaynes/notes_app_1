"use client"

import type { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import ProtectedRoute from "../_components/ProtectedRoute"

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.userState.user)
  

  return (
    <ProtectedRoute>
      <div>ProfilePage</div>
      <div>
        <p><strong>ID: </strong>{user?.id}</p>
        <p><strong>username: </strong>{user?.username}</p>
        <p><strong>email: </strong>{user?.email}</p>
      </div>
    </ProtectedRoute>

  )
}

export default ProfilePage