"use client";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { registerUser } from "@/redux/features/userSlice"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// - Form data Type
type RegistrationForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string
}

function RegisterPage() {
  const router = useRouter() 

  const dispatch = useDispatch<AppDispatch>() // the <AppDispatch> is optional, but helps with type safety / auto-completion

  // - Use the useSelector hook to access the user state in the Redux store
  // const { user, userLoading, userError } = useSelector((state: RootState) => state.user) // Destructure the user state from the Redux store
  const userState = useSelector((state: RootState) => state.userState)
  const user = userState.user
  const userError = userState.error;
  const userLoading = userState.loading

  // - Instantiate the form using useForm hook
  // const { register, handleSubmit, watch, formState: { errors}, reset} = useForm<RegistrationForm>(); // useForm returns an object, destructure the form methods/properties from react-hook-form
  const form = useForm<RegistrationForm>();
  const register = form.register;
  const handleSubmit = form.handleSubmit;
  const reset = form.reset;
  const formErrors = form.formState.errors;



  function submitForm(data: RegistrationForm): void {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match.")
      return
    }

    dispatch(registerUser({
      username: data.username,
      email: data.email,
      password: data.password
    }))
  }

  useEffect(() => { // Resetting lives outside the submitForm function so it only resets when user state changes (null -> user object). Otherwise it would reset on error too.
    if (user){ // Remember user is null initially
      reset()
      router.push("/profile")
    }
  }, [user, reset, router]) // Technically only user is needed, but convention is to include all dependencies including functions

  return (
    <div className='max-w-7xl mx-auto px-4 mt-4'>
      <h1 className='font-bold text-xl mb-4'>Register</h1>
      <form onSubmit={handleSubmit(submitForm)}>
        <div className='flex flex-col gap-4'>
          <div className="flex gap-1">
            <label className='w-20'>Username:</label>
            <input type="text" className="bg-sky-100 rounded-sm outline" {...register("username", { required: true})}/>
          </div>
          <div className="flex gap-1">
            <label className='w-20'>Email:</label>
            <input type="email" className="bg-sky-100 rounded-sm outline" {...register("email", { required: true })} />
          </div>
          <div className="flex gap-1">
            <label className='w-20'>Password:</label>
            <input type="password" className="bg-sky-100 rounded-sm outline" {...register("password", { required: true })} />
          </div>
          <div className="flex gap-1">
            <label className='w-20'>Confirm Pasword:</label>
            <input type="password" className="bg-sky-100 rounded-sm outline h-6" {...register("confirmPassword", { required: true })} />
          </div>
          <div>
            {formErrors.username && <p>{formErrors.username.message}</p>}
            {formErrors.email && <p>{formErrors.email.message}</p>}
            {formErrors.password && <p>{formErrors.password.message}</p>}
            {formErrors.confirmPassword && <p>{formErrors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className='outline-1 rounded-sm p-1 w-18 bg-gray-300 hover:brightness-85 transition' disabled={userLoading}>{userLoading ? "Registering...": "Register"}</button>
        </div>
      </form>
      <div>
        {userError && <p className="text-red-600">{userError}</p>}
        {user && <p className="text-green-600">Registered Successfully! Redirecting...</p>}
      </div>
    </div>
  )
}

export default RegisterPage