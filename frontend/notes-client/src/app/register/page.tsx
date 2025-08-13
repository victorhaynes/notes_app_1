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
  // const { userLoading, error, user } = useSelector((state: RootState) => state.user) // Destructure the user state from the Redux store
  const userState = useSelector((state: RootState) => state.user)
  const user = userState.user
  const userError = userState.error;
  const userLoading = userState.loading

  // - Instantiate the form using useForm hook
  // const { register, handleSubmit, watch, formState: { errors}, reset} = useForm<RegistrationForm>(); // useForm returns an object, destructure the form methods/properties from react-hook-form
  const form = useForm<RegistrationForm>();
  const register = form.register;
  const handleSubmit = form.handleSubmit;
  const watch = form.watch;
  const reset = form.reset;
  const formErrors = form.formState.errors;



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

  useEffect(() => { // Resetting lives outside the onSubmit function so it only resets when user state changes (null -> user object). Otherwise it would reset on error too.
    if (user){ // Remember user is null initially
      reset()
      router.push("/profile")
    }
  }, [user, reset, router]) // Technically only user is needed, but convention is to include all dependencies including functions

  return (
    <div>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>
          <input type="text" className="bg-sky-200" {...register("username", { required: true})}/>
        </div>
        <div>
          <label>Email</label>
          <input type="email" className="bg-sky-200" {...register("email", { required: true })} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" className="bg-sky-200" {...register("password", { required: true })} />
        </div>
        <div>
          <label>Confirm Pasword</label>
          <input type="password" className="bg-sky-200" {...register("confirmPassword", { required: true })} />
        </div>
        <div>
          {formErrors.username && <p>{formErrors.username.message}</p>}
          {formErrors.email && <p>{formErrors.email.message}</p>}
          {formErrors.password && <p>{formErrors.password.message}</p>}
          {formErrors.confirmPassword && <p>{formErrors.confirmPassword.message}</p>}
        </div>
        <button type="submit" className="outline-1" disabled={userLoading}>{userLoading ? "Registering...": "Register"}</button>
      </form>
      <div>
        {userError && <p className="text-red-600">{userError}</p>}
        {user && <p className="text-gren-600">Registered Successfully! Redirecting...</p>}
      </div>
    </div>
  )
}

export default RegisterPage