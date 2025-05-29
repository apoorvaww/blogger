import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice.js";
import Button from "./Button.jsx";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import Input from "./Input.jsx";
import toast from "react-hot-toast";

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
      if (res.data) {
        dispatch(login(res.data.data));
      }
      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      const {response} = error;
      if(response?.data?.errors) {
        Object.entries(response.data.errors).forEach(([field, message])=> {
          setError(field, {type: "server", message})
          toast.error(`${field}: ${message}`);
        })
      } else if(response?.data?.message) {
        toast.error(response.data.message)
      }else{
        toast.error("Something went wrong. Please try again!")
      }
      console.error("Sign up error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 min-h-screen bg-gradient-to-br from-slate-100 to-neutral-200">
      <div className="w-full max-w-lg bg-white rounded-2xl p-8 border border-slate-200 shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <span className="text-4xl font-extrabold text-teal-600">Blogger</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-slate-800 mb-2">
          Sign up to create account
        </h2>
        <p className="text-sm text-center text-slate-500 mb-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-teal-600 hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm text-center py-2 px-3 rounded mb-4 border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(createAccount)} className="space-y-5">
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
            placeholder="you@example.com"
            type="email"
            {...register("email", {
              required: true,
              validate: {
                matchPattern: (value) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Email address must be a valid address",
              },
            })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="********"
            {...register("password", { required: true })}
          />
          <Input
            label="Avatar"
            type="file"
            placeholder="Upload your avatar"
            {...register("avatar")}
          />
          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 transition duration-200 text-white font-semibold py-2 rounded-lg"
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
};
export default SignupComponent;
