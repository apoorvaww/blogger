import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./store/store.js";
import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // children: [
    //   {
    //     path: "/login",
    //     element: <Signin />,
    //   },
    //   {
    //     path: "/sign-up",
    //     element: <Signup />,
    //   },
    // ],
  },
  {
    path: "/login",
    element: <Signin />,
  },
  {
    path: "/sign-up",
    element: <Signup />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          className: "",
          duration: 4000,
          style: {
            background: "#ffffff",
            color: "#1f2937", // text-gray-800
            border: "1px solid #e5e7eb", // border-gray-200
            padding: "12px 16px",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
            fontSize: "14px",
          },
          success: {
            style: {
              background: "#ecfdf5",
              color: "#065f46", // text-teal-700
              border: "1px solid #d1fae5", // border-teal-100
            },
          },
          error: {
            style: {
              background: "#fef2f2",
              color: "#991b1b", // text-red-700
              border: "1px solid #fecaca", // border-red-200
            },
          },
        }}
      />

      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
