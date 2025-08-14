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
    <div>
      <h2>Login Form</h2>
      <form onSubmit={handleSubmit(submitForm)}>
        <div>
          <label>Username:</label>
          <input type="text" className='bg-sky-200' {...register("username", {required: true})}></input>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" className='bg-sky-200'{...register("password", { required: true })}></input>
        </div>
        <button type="submit" className='outline-1' disabled={userLoading}>{userLoading ? "Logging in..." : "Login"}</button>
        <div>
          {formErrors.username && <p>{formErrors.username.message}</p>}
          {formErrors.password && <p>{formErrors.password.message}</p>}
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