import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice.js";
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/logout`,
      {},
    {
      withCredentials: true
    })

      dispatch(logout());
      navigate("/login")
    } catch (error) {
      console.error("error occured while logging out: ", error)
    }
  };

  return (
    <button
      className="inline-block px-4 py-2 duration-200 hover:bg-teal-600 hover:text-white rounded-full transition cursor-pointer font-semibold shadow-sm"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
};

export default LogoutBtn;
