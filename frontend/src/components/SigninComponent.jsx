import axios from "axios";
import React, { useEffect, useState } from "react";
import Input from "./Input.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice.js";
import { toast } from "react-hot-toast";

const SigninComponent = () => {
  // const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (data) => {
    const { email, password } = data;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data?.data) {
        console.log(res.data);
        dispatch(authLogin({userData: res.data.data.user}));
        toast.success("Login successful!");
        navigate("/");
      }
      else{
        toast.error("Something went wrong. Couldn't retrieve user's data.")
      }
    } catch (error) {
      const { response } = error;
      console.log(response);
      let errorMessage = "Login failed. Please try again.";
      if (response && response.data) {
        if(response.data.message){
          errorMessage = response.data.message || "Please fill the login form correctly."
        }
      } else if (response?.data?.message) {
        const message = response.data.message.toLowerCase();
        if (message.includes("password")) {
          setError("password", {
            type: "server",
            message: response.data.message,
          });
          toast.error("incorrect password");
        } else if (message.includes("user") || message.includes("email")) {
          setError("email", { type: "server", message: response.data.message });
          toast.error("User not found with this email.");
        } else {
          toast.error(response.data.message);
        }
      }
      toast.error(errorMessage);
      console.error("Login error: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 to-neutral-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <span className="text-4xl font-extrabold text-teal-600 tracking-tight">
            Blogger
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-slate-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-center text-slate-500 mb-5">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="text-teal-600 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(login)} className="space-y-5">
          <Input
            label="Email"
            placeholder="you@example.com"
            type="email"
            {...register("email", {
              required: "Email is required",
              validate: {
                matchPattern: (value) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Invalid email format",
              },
            })}
            className={errors.email ? "border-red-500" : ""}
            error = {errors.email?.message}
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">
              {errors.email.message}
            </p>
          )}
          

          <Input
            label="Password"
            placeholder="••••••••"
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
            className={errors.password ? "border-red-500" : ""}
            error = {errors.password?.message}
          />
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
          )}
          

          <Button
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-600 transition duration-200 text-white font-semibold py-2 rounded-lg"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};
export default SigninComponent;
