import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login, logout } from "./store/authSlice.js";
import toast, { Toaster } from "react-hot-toast";


function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/get-current-user`,
          {
            withCredentials: true,
          }
        );
        // console.log("get current user: ", res.data);
        if (res.data) {
          dispatch(login(res.data.data));
        } else {
          toast.error("Session expired or no user found. Please login again.")
          dispatch(logout());
          navigate('/login');
        }
      } catch (error) {
        console.error("error occurred while fetching user's info", error);
        toast.error("Something went wrong. Please login again.")
        dispatch(logout());
        navigate('/login')
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, [dispatch, navigate]);

  return !loading ? (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100 font-poppins">
      <header className="shadow-md bg-white">
        <Header />
      </header>

      <main className="flex-grow p-6">
        <Outlet />
      </main>

      <footer className="bg-white shadow-inner">
        <Footer />
      </footer>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center">
        <svg
          className="animate-spin h-10 w-10 text-gray-600 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        <p className="text-gray-600 text-lg font-semibold">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}

export default App;
