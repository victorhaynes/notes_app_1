"use client";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { registerUser } from "@/redux/features/userSlice"
import { useEffect } from "react";

// Form data Type
type RegistrationForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string
}

function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>() // the <AppDispatch> is optional, but helps with type safety / auto-completion
  const { loading, error, user } = useSelector((state: RootState) => state.user) // Destructure the user state from the Redux store
  const { register, handleSubmit, watch, formState: { errors}, reset} = useForm<RegistrationForm>(); // Destructure the form methods from react-hook-form

  function onSubmit(data: RegistrationForm): void {
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

  useEffect(() => {
    if (user){
      reset()
    }
  }, [user, reset])

  return (
    <div>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-sky-100">
        <div>
          <label>Username</label>
          <input type="text" {...register("username", { required: true})}/>
        </div>
        <div>
          <label>Email</label>
          <input type="email" {...register("email", { required: true })} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" {...register("username", { required: true })} />
        </div>
        <div>
          <label>Confirm Pasword</label>
          <input type="password" {...register("confirmPassword", { required: true })} />
        </div>
        <div>
          {errors.username && <p>{errors.username.message}</p>}
          {errors.email && <p>{errors.email.message}</p>}
          {errors.password && <p>{errors.password.message}</p>}
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>
      </form>
    </div>
  )
}

export default RegisterPage