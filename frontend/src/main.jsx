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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Signin />,
      },
      {
        path: "/sign-up",
        element: <Signup />,
      },
    ],
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
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
