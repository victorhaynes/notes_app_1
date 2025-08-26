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
    <div className="max-w-7xl mx-auto px-2 mt-4">
      <div className='flex gap-2 font-semibold divide-x divide-gray-400'>
        <Link className='px-2' href={"/"}>Home</Link>
        <Link className='px-2' href={"/about"}>About</Link>
        {/* Remember you must wrap the dispatcher and it's action/thunk - otherwise it runs imemdiately */}
        {user ? 
          <>
            <button className='px-2 hover:cursor-pointer' onClick={() => dispatch(requestLogout())}>Logout</button> 
            <Link className='px-2' href={"/notes"}>My Notes</Link>
          </>
          :
          <>
            <Link className='px-2' href={"/login"}>Login</Link>
            <Link className='px-2' href={"/register"}>Register</Link>
          </>
        }
        <Link className='px-2' href={"/profile"}>Profile</Link>
      </div>
    </div>
  )
}

export default Navbar