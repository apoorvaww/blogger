import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login, logout } from "./store/authSlice.js";

function App() {
  const[loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(()=>{
    const checkUserSession = async() => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/get-current-user`,{
        withCredentials: true
      })
      console.log("get current user: ", res.data);
      if(res.data.data) {
        dispatch(login(res.data.data));
      }
      else{
        dispatch(logout());
      }

    } catch (error) {
      console.error("error occurred while fetching user's info", error)
    }finally{
      setLoading(false);
    }
  };
  checkUserSession();
  })

  return !loading ? (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 text-gray-800">
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
