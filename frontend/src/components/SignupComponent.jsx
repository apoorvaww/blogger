import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice.js";
import Button from "./Button.jsx";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import Input from "./Input.jsx";

const SignupComponent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createAccount = async (data) => {
    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }
    // const reqUrl = `${import.meta.env.VITE_BACKEND_URL}`
    // console.log(reqUrl)

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/register`,
        formData,
        {
          withCredentials: true,
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        }
      );
      console.log(res.data.data);
      if(res.data) {
        dispatch(login(res.data.data));
      }
      navigate('/login')
    } catch (error) {
      setError(error.response?.data?.message);
      console.error("frontend error: sign up error:", error);
    } finally{
        setLoading(false)
    }
  };

  return (
  <div className="flex items-center justify-center  px-4">
    <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-8 border border-gray-200">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <span className="text-3xl font-bold text-blue-600">Blogger</span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-1">
        Sign up to create account
      </h2>
      <p className="text-sm text-center text-gray-500 mb-4">
        Already have an account?&nbsp;
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Sign In
        </Link>
      </p>

      {/* Error Message */}
      {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit(createAccount)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          {...register("fullName", { required: true })}
        />
        <Input
          label="Username"
          placeholder="Enter your username"
          {...register("username", { required: true })}
        />
        <Input
          label="Email"
          placeholder="Enter your email id"
          type="email"
          {...register("email", {
            required: true,
            validate: {
              matchPatern: (value) =>
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                "Email address must be a valid address",
            },
          })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          {...register("password", { required: true })}
        />
        <Input
          label="Avatar"
          type="file"
          placeholder="Upload your avatar"
          {...register("avatar")}
        />
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>
    </div>
  </div>
);
};

export default SignupComponent;
