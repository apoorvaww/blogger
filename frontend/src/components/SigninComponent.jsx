import axios from "axios";
import React, { useState } from "react";
import Input from "./Input.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice.js";

const SigninComponent = () => {
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, setError, formState: {errors} } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (data) => {
    setServerError("");
    const formdata = new FormData();
    formdata.append("email", data.email);
    formdata.append("password", data.password);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        {
            email: data.email,
            password: data.password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      dispatch(authLogin(res.data.data.user));
      navigate("/");
    
    } catch (error) {
        const {response} = error;
        if(response?.data?.errors) {
            Object.entries(response.data.errors).forEach(([FileSystemDirectoryHandle, message]) => {
                setError(field, {type: "server", message})
            })
        }else if(response?.data?.message) {
            setServerError(response.data.message);
        }else{
            setServerError("Login failed. Please try again.");
        }

        console.error("Login error: ", error);
    }
  };

  return (
    <div className=" flex items-center justify-center px-5 m-10">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-8 border border-gray-200">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <span className="text-3xl font-bold text-blue-600">Blogger</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-1">
          Sign in to your account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-4">
          Don&apos;t have an account?&nbsp;
          <Link
            to="/sign-up"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>

        {/* Global Server Error */}
        {serverError && (
          <p className="text-red-600 text-sm text-center mb-4">{serverError}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(login)} className="space-y-4">
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            {...register("email", {
              required: "Email is required",
              validate: {
                matchPattern: (value) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Invalid email format",
              },
            })}
            className={errors.email && "border-red-500"}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}

          <Input
            label="Password"
            placeholder="Enter your password"
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
            className={errors.password && "border-red-500"}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SigninComponent;
