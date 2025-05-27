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
      className="inline-block px-6 py-2 duration-200 hover:bg-blue-200 rounded-full text-lg font-semibold"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
};

export default LogoutBtn;
