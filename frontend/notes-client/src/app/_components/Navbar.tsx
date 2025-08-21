"use client"

import React from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { requestLogout } from '@/redux/features/userSlice'

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>()

  const user = useSelector((state: RootState) => state.userState.user)



  return (
    <div className='flex gap-4'>
      <Link href={"/"}>Home</Link>
      <Link href={"/about"}>About</Link>
      {/* Remember you must wrap the dispatcher and it's action/thunk - otherwise it runs imemdiately */}
      {user ? 
        <button onClick={() => dispatch(requestLogout())}>Logout</button> 
        :
        <>
          <Link href={"/login"}>Login</Link>
          <Link href={"/register"}>Register</Link>
        </>
      }
      <Link href={"/profile"}>Profile</Link>
    </div>
  )
}

export default Navbar