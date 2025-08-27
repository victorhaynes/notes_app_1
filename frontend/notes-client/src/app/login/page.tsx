"use client"

import { loginUser } from '@/redux/features/userSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'


type LoginForm = {
  username: string
  password: string
}

const LoginPage = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  

  const userState = useSelector((state: RootState) => state.userState)
  const user = userState.user
  const userLoading = userState.loading
  const userError = userState.error

  const form = useForm<LoginForm>()
  const register = form.register
  const handleSubmit = form.handleSubmit
  const reset = form.reset
  const formErrors = form.formState.errors

  function submitForm(data: LoginForm): void {
    dispatch(loginUser({
      username: data.username,
      password: data.password
    }))
  }

  useEffect(() => { // -- See register/page.tsx for annotated auth flow
    if (user) {
      reset()
      router.push("/profile")
    }
  }, [user, reset, router])

  return (
    <div className='max-w-7xl mx-auto px-4 mt-4'>
      <h1 className='font-bold text-xl mb-4'>Login</h1>
      <form onSubmit={handleSubmit(submitForm)}>
        <div className='flex flex-col gap-4'>
          <div className='flex gap-1'>
            <label className='w-20'>Username:</label>
            <input type="text" className='bg-sky-100 rounded-sm outline' {...register("username", {required: true})}></input>
          </div>
          <div className='flex gap-1'>
            <label className='w-20'>Password:</label>
            <input type="password" className='bg-sky-100 rounded-sm outline'{...register("password", { required: true })}></input>
          </div>
          <button type="submit" className='outline-1 rounded-sm p-1 w-14 bg-gray-300 hover:brightness-85 transition' disabled={userLoading}>{userLoading ? "Logging in..." : "Login"}</button>
          <div>
            {formErrors.username && <p>{formErrors.username.message}</p>}
            {formErrors.password && <p>{formErrors.password.message}</p>}
          </div>
        </div>
      </form>
      <div>
        {userError && <p className='text-red-600'>{userError}</p>}
        {user && <p className='text-green-600'>Logged in Successfully! Redirecting...</p>}
      </div>
    </div>
  )
}

export default LoginPage