import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className='flex gap-4'>
      <Link href={"/"}>Home</Link>
      <Link href={"/about"}>About</Link>
      <Link href={"/login"}>Login</Link>
      <Link href={"/register"}>Register</Link>
      <Link href={"/profile"}>Profile</Link>
      <Link href={"/counter"}>Counter</Link>
    </div>
  )
}

export default Navbar